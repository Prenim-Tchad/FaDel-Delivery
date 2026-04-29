import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_spacing.dart';

class FadelCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderRadius;
  final List<BoxShadow>? shadow;
  final VoidCallback? onTap;
  final bool pressable;

  const FadelCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.lg),
    this.backgroundColor = AppColors.primaryWhite,
    this.borderColor = AppColors.borderLight,
    this.borderRadius = AppSpacing.radiusLarge,
    this.shadow,
    this.onTap,
    this.pressable = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final defaultShadow = [
      BoxShadow(
        color: AppColors.primaryBlack.withOpacity(0.06),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ];

    Widget card = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor ?? Colors.transparent),
        boxShadow: shadow ?? defaultShadow,
      ),
      child: child,
    );

    if (pressable && onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: card,
      );
    }

    return card;
  }
}
