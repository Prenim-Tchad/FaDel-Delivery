import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateOrderDto, OrderItemDto } from '../dtos/create-order.dto';
import { OrderType } from '@prisma/client';

export interface ValidatedItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  modifierOptionIds?: string[];
}

export interface PricingResult {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  promoCodeId?: string;
  promoCodeApplied?: string;
}

@Injectable()
export class OrderValidationService {
  private readonly SERVICE_FEE_RATE = 0.05; // 5%

  constructor(private readonly prisma: PrismaService) {}

  // ── Étape 1 : Valider le restaurant ──────────────────────────────────────
  async validateRestaurant(restaurantId: string): Promise<void> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, isActive: true, isVerified: true, name: true },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant introuvable: ${restaurantId}`);
    }

    if (!restaurant.isActive) {
      throw new UnprocessableEntityException(
        `Le restaurant "${restaurant.name}" est actuellement fermé`,
      );
    }
  }

  // ── Étape 2 : Valider la disponibilité des articles ───────────────────────
  async validateItems(dto: CreateOrderDto): Promise<ValidatedItem[]> {
    const menuItemIds = dto.items.map((i) => i.menuItemId);

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        isDeleted: false,
      },
      include: {
        menuCategory: {
          select: { restaurantId: true, isDeleted: true },
        },
        modifierGroups: {
          include: { options: true },
        },
      },
    });

    // Vérifier que tous les items existent
    const foundIds = new Set(menuItems.map((m) => m.id));
    const missingIds = menuItemIds.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Articles introuvables: ${missingIds.join(', ')}`,
      );
    }

    // Vérifier que tous les items appartiennent au même restaurant
    const wrongRestaurant = menuItems.filter(
      (item) =>
        item.menuCategory.restaurantId !== dto.restaurantId ||
        item.menuCategory.isDeleted,
    );
    if (wrongRestaurant.length > 0) {
      throw new BadRequestException(
        `Certains articles n'appartiennent pas au restaurant sélectionné`,
      );
    }

    // Vérifier la disponibilité
    const unavailable = menuItems.filter((item) => !item.isAvailable);
    if (unavailable.length > 0) {
      const names = unavailable.map((i) => i.name).join(', ');
      throw new UnprocessableEntityException(
        `Articles non disponibles: ${names}`,
      );
    }

    // Construire les items validés avec prix serveur
    return dto.items.map((orderItem) => {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId)!;
      const unitPrice = menuItem.price;
      const totalPrice = unitPrice * orderItem.quantity;

      return {
        menuItemId: orderItem.menuItemId,
        name: menuItem.name,
        quantity: orderItem.quantity,
        unitPrice,
        totalPrice,
        specialInstructions: orderItem.specialInstructions,
        modifierOptionIds: orderItem.modifierOptionIds,
      };
    });
  }

  // ── Étape 3 : Recalcul des frais serveur ──────────────────────────────────
  async calculatePricing(
    restaurantId: string,
    validatedItems: ValidatedItem[],
    orderType: OrderType,
    deliveryLatitude?: number,
    deliveryLongitude?: number,
  ): Promise<
    Omit<PricingResult, 'discountAmount' | 'promoCodeId' | 'promoCodeApplied'>
  > {
    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Calculer les frais de livraison selon la zone
    let deliveryFee = 0;
    if (orderType === OrderType.DELIVERY) {
      deliveryFee = await this.getDeliveryFee(
        restaurantId,
        deliveryLatitude,
        deliveryLongitude,
      );
    }

    const serviceFee = Math.round(subtotal * this.SERVICE_FEE_RATE);

    return { subtotal, deliveryFee, serviceFee };
  }

  private async getDeliveryFee(
    restaurantId: string,
    lat?: number,
    lng?: number,
  ): Promise<number> {
    // Récupérer les zones de livraison actives du restaurant
    const zones = await this.prisma.deliveryZone.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { deliveryFee: 'asc' },
    });

    if (zones.length === 0) {
      // Utiliser les frais par défaut du restaurant
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { deliveryFee: true },
      });
      return restaurant?.deliveryFee ?? 0;
    }

    // Si coordonnées fournies, trouver la zone la plus proche
    if (lat !== undefined && lng !== undefined) {
      for (const zone of zones) {
        if (this.isInZone(lat, lng, zone)) {
          return zone.deliveryFee;
        }
      }
    }

    // Zone par défaut : la moins chère
    return zones[0].deliveryFee;
  }

  private isInZone(
    lat: number,
    lng: number,
    zone: { coordinates: unknown; radius: number },
  ): boolean {
    // Vérification par rayon simple
    if (zone.coordinates && typeof zone.coordinates === 'object') {
      const coords = zone.coordinates as { lat?: number; lng?: number };
      if (coords.lat !== undefined && coords.lng !== undefined) {
        const distance = this.haversineDistance(
          lat,
          lng,
          coords.lat,
          coords.lng,
        );
        return distance <= zone.radius;
      }
    }
    return false;
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Étape 4 : Vérification et application du code promo ──────────────────
  async validatePromoCode(
    code: string,
    subtotal: number,
    restaurantId: string,
    customerId: string,
  ): Promise<{ discountAmount: number; promoCodeId: string }> {
    const promo = await this.prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      throw new BadRequestException(`Code promo invalide: ${code}`);
    }

    if (!promo.isActive) {
      throw new BadRequestException(`Code promo expiré: ${code}`);
    }

    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      throw new BadRequestException(
        `Code promo hors période de validité: ${code}`,
      );
    }

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      throw new BadRequestException(
        `Code promo épuisé (limite atteinte): ${code}`,
      );
    }

    if (subtotal < promo.minimumOrder) {
      throw new BadRequestException(
        `Montant minimum requis: ${promo.minimumOrder} FCFA (commande: ${subtotal} FCFA)`,
      );
    }

    // Vérifier restriction restaurant
    if (
      promo.applicableRestaurants.length > 0 &&
      !promo.applicableRestaurants.includes(restaurantId)
    ) {
      throw new BadRequestException(`Code promo non valide pour ce restaurant`);
    }

    // Calculer le discount
    let discountAmount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(subtotal * (promo.discountValue / 100));
    } else if (promo.discountType === 'FIXED') {
      discountAmount = promo.discountValue;
    }

    // Appliquer le plafond si défini
    if (promo.maximumDiscount !== null) {
      discountAmount = Math.min(discountAmount, promo.maximumDiscount);
    }

    // Ne pas dépasser le subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return { discountAmount, promoCodeId: promo.id };
  }

  // ── Validation livraison ──────────────────────────────────────────────────
  validateDeliveryFields(dto: CreateOrderDto): void {
    if (dto.orderType === OrderType.DELIVERY) {
      if (!dto.deliveryAddress) {
        throw new BadRequestException(
          'Adresse de livraison requise pour une commande DELIVERY',
        );
      }
    }
  }
}
