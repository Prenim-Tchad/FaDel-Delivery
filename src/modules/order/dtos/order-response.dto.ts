import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

export interface OrderItemResponse {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface PricingBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  promoCodeApplied?: string;
}

export interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  items: OrderItemResponse[];
  pricing: PricingBreakdown;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  estimatedDelivery?: Date;
  createdAt: Date;
}
