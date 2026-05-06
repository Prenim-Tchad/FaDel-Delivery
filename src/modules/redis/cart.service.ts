import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisService } from './redis.service';

export interface CartItem {
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  specialInstructions?: string;
  modifiers: CartItemModifier[];
}

export interface CartItemModifier {
  modifierGroupId: string;
  modifierGroupName: string;
  modifierOptionId: string;
  modifierOptionName: string;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CartService {
  constructor(
    private readonly redisService: RedisService,
    private readonly cacheService: CacheService,
  ) {}

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  private getCartLockKey(userId: string): string {
    return `cart_lock:${userId}`;
  }

  // Créer ou récupérer un panier
  async getCart(userId: string): Promise<Cart | null> {
    const cartKey = this.getCartKey(userId);
    const cart = await this.redisService.getJson<Cart>(cartKey);

    if (cart) {
      // Recalculer les totaux au cas où
      return this.calculateTotals(cart);
    }

    return null;
  }

  // Créer un nouveau panier
  async createCart(userId: string, restaurantId: string): Promise<Cart> {
    // Vérifier s'il y a déjà un panier pour cet utilisateur
    const existingCart = await this.getCart(userId);
    if (existingCart && existingCart.restaurantId !== restaurantId) {
      throw new BadRequestException(
        'Vous avez déjà un panier avec un autre restaurant. Veuillez finaliser ou vider votre panier actuel.',
      );
    }

    const cart: Cart = {
      id: `cart_${userId}_${Date.now()}`,
      userId,
      restaurantId,
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cartKey = this.getCartKey(userId);
    await this.redisService.setJson(cartKey, cart, 86400); // Expire en 24h

    return cart;
  }

  // Ajouter un article au panier
  async addItem(
    userId: string,
    restaurantId: string,
    menuItemId: string,
    menuItemName: string,
    basePrice: number,
    quantity: number = 1,
    modifiers: CartItemModifier[] = [],
    specialInstructions?: string,
  ): Promise<Cart> {
    // Acquérir un lock pour éviter les conflits
    const lockKey = this.getCartLockKey(userId);
    const lockAcquired = await this.redisService.set(lockKey, 'locked', 10); // Lock de 10 secondes

    if (!lockAcquired) {
      throw new BadRequestException(
        'Panier en cours de modification, veuillez réessayer.',
      );
    }

    try {
      let cart = await this.getCart(userId);

      if (!cart) {
        cart = await this.createCart(userId, restaurantId);
      }

      // Vérifier que l'article vient du même restaurant
      if (cart.restaurantId !== restaurantId) {
        throw new BadRequestException(
          'Vous ne pouvez pas ajouter des articles de différents restaurants dans le même panier.',
        );
      }

      // Chercher si l'article existe déjà dans le panier
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.menuItemId === menuItemId &&
          JSON.stringify(item.modifiers) === JSON.stringify(modifiers) &&
          item.specialInstructions === specialInstructions,
      );

      if (existingItemIndex >= 0) {
        // Augmenter la quantité
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Ajouter un nouvel article
        const newItem: CartItem = {
          menuItemId,
          name: menuItemName,
          basePrice,
          quantity,
          specialInstructions,
          modifiers,
        };
        cart.items.push(newItem);
      }

      // Recalculer les totaux
      cart = this.calculateTotals(cart);
      cart.updatedAt = new Date();

      // Sauvegarder
      const cartKey = this.getCartKey(userId);
      await this.redisService.setJson(cartKey, cart, 86400);

      return cart;
    } finally {
      // Libérer le lock
      await this.redisService.del(lockKey);
    }
  }

  // Mettre à jour la quantité d'un article
  async updateItemQuantity(
    userId: string,
    itemIndex: number,
    newQuantity: number,
  ): Promise<Cart> {
    if (newQuantity < 0) {
      throw new BadRequestException('La quantité ne peut pas être négative.');
    }

    const cart = await this.getCart(userId);
    if (!cart) {
      throw new NotFoundException('Panier non trouvé.');
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      throw new NotFoundException('Article non trouvé dans le panier.');
    }

    if (newQuantity === 0) {
      // Supprimer l'article
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }

    // Recalculer les totaux
    const updatedCart = this.calculateTotals(cart);
    updatedCart.updatedAt = new Date();

    // Sauvegarder
    const cartKey = this.getCartKey(userId);
    await this.redisService.setJson(cartKey, updatedCart, 86400);

    return updatedCart;
  }

  // Supprimer un article du panier
  async removeItem(userId: string, itemIndex: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    if (!cart) {
      throw new NotFoundException('Panier non trouvé.');
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      throw new NotFoundException('Article non trouvé dans le panier.');
    }

    cart.items.splice(itemIndex, 1);

    // Recalculer les totaux
    const updatedCart = this.calculateTotals(cart);
    updatedCart.updatedAt = new Date();

    // Sauvegarder
    const cartKey = this.getCartKey(userId);
    await this.redisService.setJson(cartKey, updatedCart, 86400);

    return updatedCart;
  }

  // Vider le panier
  async clearCart(userId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.redisService.del(cartKey);
  }

  // Appliquer un code promo
  async applyPromoCode(userId: string, promoCode: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    if (!cart) {
      throw new NotFoundException('Panier non trouvé.');
    }

    // Ici, vous devriez valider le code promo avec la base de données
    // Pour l'exemple, on applique un discount fictif
    cart.promoCode = promoCode;
    cart.discountAmount = cart.subtotal * 0.1; // 10% de réduction

    const updatedCart = this.calculateTotals(cart);
    updatedCart.updatedAt = new Date();

    const cartKey = this.getCartKey(userId);
    await this.redisService.setJson(cartKey, updatedCart, 86400);

    return updatedCart;
  }

  // Retirer le code promo
  async removePromoCode(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    if (!cart) {
      throw new NotFoundException('Panier non trouvé.');
    }

    cart.promoCode = undefined;
    cart.discountAmount = 0;

    const updatedCart = this.calculateTotals(cart);
    updatedCart.updatedAt = new Date();

    const cartKey = this.getCartKey(userId);
    await this.redisService.setJson(cartKey, updatedCart, 86400);

    return updatedCart;
  }

  // Calculer les totaux du panier
  private calculateTotals(cart: Cart): Cart {
    let subtotal = 0;

    cart.items.forEach((item) => {
      // Prix de base
      let itemTotal = item.basePrice * item.quantity;

      // Ajouter les modificateurs
      item.modifiers.forEach((modifier) => {
        itemTotal += modifier.price * item.quantity;
      });

      subtotal += itemTotal;
    });

    cart.subtotal = subtotal;

    // Calculer le total final
    cart.totalAmount =
      cart.subtotal + cart.deliveryFee + cart.serviceFee - cart.discountAmount;

    return cart;
  }

  // Valider le panier avant commande
  async validateCart(
    userId: string,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const cart = await this.getCart(userId);
    if (!cart) {
      return { valid: false, errors: ['Panier vide'] };
    }

    const errors: string[] = [];

    if (cart.items.length === 0) {
      errors.push('Le panier ne contient aucun article');
    }

    if (cart.totalAmount <= 0) {
      errors.push('Le montant total doit être positif');
    }

    // Ici, vous pourriez ajouter d'autres validations :
    // - Vérifier la disponibilité des articles
    // - Vérifier les horaires du restaurant
    // - Vérifier les zones de livraison

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Convertir le panier en commande (pour finaliser)
  async convertToOrder(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    if (!cart) {
      throw new NotFoundException('Panier non trouvé.');
    }

    const validation = await this.validateCart(userId);
    if (!validation.valid) {
      throw new BadRequestException(
        `Panier invalide: ${validation.errors.join(', ')}`,
      );
    }

    return cart;
  }

  // Statistiques des paniers
  async getCartStats(): Promise<any> {
    const cartKeys = await this.redisService.keys('cart:*');
    const carts: Cart[] = [];

    for (const key of cartKeys) {
      const cart = await this.redisService.getJson<Cart>(key);
      if (cart) {
        carts.push(cart);
      }
    }

    return {
      totalCarts: carts.length,
      totalItems: carts.reduce((sum, cart) => sum + cart.items.length, 0),
      totalValue: carts.reduce((sum, cart) => sum + cart.totalAmount, 0),
      averageCartValue:
        carts.length > 0
          ? carts.reduce((sum, cart) => sum + cart.totalAmount, 0) /
            carts.length
          : 0,
    };
  }
}
