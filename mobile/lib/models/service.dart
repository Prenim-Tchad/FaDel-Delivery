class Service {
  final String id;
  final String label;
  final String icon; // Icons as string representation
  final String color; // Hex color code
  final String description;
  final bool isActive;

  Service({
    required this.id,
    required this.label,
    required this.icon,
    required this.color,
    required this.description,
    this.isActive = true,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] ?? '',
      label: json['label'] ?? '',
      icon: json['icon'] ?? 'business',
      color: json['color'] ?? '#22C55E',
      description: json['description'] ?? '',
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'label': label,
      'icon': icon,
      'color': color,
      'description': description,
      'is_active': isActive,
    };
  }

  Service copyWith({
    String? id,
    String? label,
    String? icon,
    String? color,
    String? description,
    bool? isActive,
  }) {
    return Service(
      id: id ?? this.id,
      label: label ?? this.label,
      icon: icon ?? this.icon,
      color: color ?? this.color,
      description: description ?? this.description,
      isActive: isActive ?? this.isActive,
    );
  }
}
