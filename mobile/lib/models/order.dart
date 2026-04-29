class Order {
  final String id;
  final String userId;
  final String? restaurantId;
  final String status; // 'pending', 'confirmed', 'preparing', 'ready', 'on_delivery', 'delivered', 'cancelled'
  final double totalAmount;
  final String? deliveryAddress;
  final String? notes;
  final DateTime createdAt;
  final DateTime? deliveredAt;
  final List<OrderItem> items;

  Order({
    required this.id,
    required this.userId,
    this.restaurantId,
    required this.status,
    required this.totalAmount,
    this.deliveryAddress,
    this.notes,
    required this.createdAt,
    this.deliveredAt,
    required this.items,
  });

  // Getters
  int get itemCount => items.length;
  bool get isDelivered => status == 'delivered';
  bool get isCancelled => status == 'cancelled';

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      restaurantId: json['restaurant_id'],
      status: json['status'] ?? 'pending',
      totalAmount: (json['total_amount'] ?? 0).toDouble(),
      deliveryAddress: json['delivery_address'],
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      deliveredAt: json['delivered_at'] != null ? DateTime.parse(json['delivered_at']) : null,
      items: (json['items'] as List?)?.map((i) => OrderItem.fromJson(i)).toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'restaurant_id': restaurantId,
      'status': status,
      'total_amount': totalAmount,
      'delivery_address': deliveryAddress,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'delivered_at': deliveredAt?.toIso8601String(),
      'items': items.map((i) => i.toJson()).toList(),
    };
  }
}

class OrderItem {
  final String id;
  final String orderId;
  final String menuItemId;
  final String name;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final String? specialInstructions;

  OrderItem({
    required this.id,
    required this.orderId,
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    this.specialInstructions,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] ?? '',
      orderId: json['order_id'] ?? '',
      menuItemId: json['menu_item_id'] ?? '',
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      totalPrice: (json['total_price'] ?? 0).toDouble(),
      specialInstructions: json['special_instructions'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_id': orderId,
      'menu_item_id': menuItemId,
      'name': name,
      'quantity': quantity,
      'unit_price': unitPrice,
      'total_price': totalPrice,
      'special_instructions': specialInstructions,
    };
  }
}
