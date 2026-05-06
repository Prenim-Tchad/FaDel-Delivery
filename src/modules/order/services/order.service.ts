import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { QueueService } from '../../queue/queue.service';
import { OrderValidationService } from './order-validation.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderResponse } from '../dtos/order-response.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: OrderValidationService,
    private readonly queueService: QueueService,
  ) {}

  async create(
    customerId: string,
    dto: CreateOrderDto,
  ): Promise<CreateOrderResponse> {
    // ── Étape 1 : Valider le restaurant ────────────────────────────────────
    await this.validationService.validateRestaurant(dto.restaurantId);

    // ── Étape 2 : Valider les champs livraison ──────────────────────────────
    this.validationService.validateDeliveryFields(dto);

    // ── Étape 3 : Valider la disponibilité des articles ─────────────────────
    const validatedItems = await this.validationService.validateItems(dto);

    // ── Étape 4 : Recalculer les frais côté serveur ─────────────────────────
    const { subtotal, deliveryFee, serviceFee } =
      await this.validationService.calculatePricing(
        dto.restaurantId,
        validatedItems,
        dto.orderType,
        dto.deliveryLatitude,
        dto.deliveryLongitude,
      );

    // ── Étape 5 : Vérifier le code promo (si fourni) ────────────────────────
    let discountAmount = 0;
    let promoCodeId: string | undefined;
    let promoCodeApplied: string | undefined;

    if (dto.promoCode) {
      const promo = await this.validationService.validatePromoCode(
        dto.promoCode,
        subtotal,
        dto.restaurantId,
        customerId,
      );
      discountAmount = promo.discountAmount;
      promoCodeId = promo.promoCodeId;
      promoCodeApplied = dto.promoCode.toUpperCase();
    }

    const totalAmount = subtotal + deliveryFee + serviceFee - discountAmount;

    // ── Étape 6 : Créer la commande en DB (transaction) ─────────────────────
    const order = await this.prisma.$transaction(async (tx) => {
      // Créer la commande
      const newOrder = await tx.foodOrder.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          customerId,
          restaurantId: dto.restaurantId,
          status: OrderStatus.PENDING,
          orderType: dto.orderType,
          deliveryAddress: dto.deliveryAddress,
          deliveryLatitude: dto.deliveryLatitude,
          deliveryLongitude: dto.deliveryLongitude,
          deliveryNotes: dto.deliveryNotes,
          customerPhone: dto.customerPhone,
          customerName: dto.customerName,
          subtotal,
          deliveryFee,
          serviceFee,
          discountAmount,
          totalAmount,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: dto.paymentMethod,
          promoCodeId,
          estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // +45 min
          orderItems: {
            create: validatedItems.map((item) => ({
              menuItemId: item.menuItemId,
              name: item.name,
              basePrice: item.unitPrice,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              specialInstructions: item.specialInstructions,
            })),
          },
        },
        include: { orderItems: true },
      });

      // Incrémenter le compteur du code promo
      if (promoCodeId) {
        await tx.promoCode.update({
          where: { id: promoCodeId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    this.logger.log(
      `Commande créée: #${order.orderNumber} | total=${totalAmount} FCFA | customer=${customerId}`,
    );

    // ── Étape 7 : Envoyer dans la queue BullMQ ──────────────────────────────
    await this.queueService.addOrderProcessingJob({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId,
      restaurantId: dto.restaurantId,
      status: OrderStatus.PENDING,
      orderType: dto.orderType,
      totalAmount,
      deliveryFee,
      customerPhone: dto.customerPhone,
      customerName: dto.customerName,
      deliveryAddress: dto.deliveryAddress,
      deliveryLatitude: dto.deliveryLatitude,
      deliveryLongitude: dto.deliveryLongitude,
      paymentMethod: dto.paymentMethod,
      items: validatedItems.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    });

    // ── Réponse ─────────────────────────────────────────────────────────────
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      restaurantId: order.restaurantId,
      customerId: order.customerId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress ?? undefined,
      items: order.orderItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        specialInstructions: item.specialInstructions ?? undefined,
      })),
      pricing: {
        subtotal,
        deliveryFee,
        serviceFee,
        discountAmount,
        totalAmount,
        promoCodeApplied,
      },
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod ?? undefined,
      estimatedDelivery: order.estimatedDelivery ?? undefined,
      createdAt: order.createdAt,
    };
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const rand = randomUUID().split('-')[0].toUpperCase();
    return `FDL-${ymd}-${rand}`;
  }
}