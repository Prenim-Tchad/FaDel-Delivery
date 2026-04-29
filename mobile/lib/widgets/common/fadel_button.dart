import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_spacing.dart';
import '../../constants/app_typography.dart';
import '../../constants/app_constants.dart';

class FadelButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isEnabled;
  final FadelButtonVariant variant;
  final FadelButtonSize size;
  final Widget? leadingIcon;
  final Widget? trailingIcon;

  const FadelButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.isEnabled = true,
    this.variant = FadelButtonVariant.primary,
    this.size = FadelButtonSize.medium,
    this.leadingIcon,
    this.trailingIcon,
  }) : super(key: key);

  @override
  State<FadelButton> createState() => _FadelButtonState();
}

class _FadelButtonState extends State<FadelButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: AppConstants.animationShort,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: AppConstants.scaleOnTap)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final config = _getButtonConfig();

    return GestureDetector(
      onTapDown: widget.isEnabled && !widget.isLoading ? (_) => _controller.forward() : null,
      onTapUp: widget.isEnabled && !widget.isLoading ? (_) {
        _controller.reverse();
        widget.onPressed();
      } : null,
      onTapCancel: widget.isEnabled && !widget.isLoading ? () => _controller.reverse() : null,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          height: config.height,
          padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          decoration: BoxDecoration(
            color: widget.isEnabled ? config.backgroundColor : config.disabledColor,
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
            border: config.border,
            boxShadow: widget.isEnabled ? config.shadow : [],
          ),
          child: Center(
            child: widget.isLoading
                ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      color: config.textColor,
                      strokeWidth: 2.5,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.leadingIcon != null) ...[
                        widget.leadingIcon!,
                        SizedBox(width: AppSpacing.sm),
                      ],
                      Text(
                        widget.label.toUpperCase(),
                        style: AppTypography.buttonText.copyWith(
                          color: config.textColor,
                        ),
                      ),
                      if (widget.trailingIcon != null) ...[
                        SizedBox(width: AppSpacing.sm),
                        widget.trailingIcon!,
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  _ButtonConfig _getButtonConfig() {
    switch (widget.variant) {
      case FadelButtonVariant.primary:
        return _ButtonConfig(
          backgroundColor: AppColors.primaryBlack,
          textColor: AppColors.primaryWhite,
          disabledColor: AppColors.neutral400,
          height: _getSizeHeight(),
          border: null,
          shadow: [
            BoxShadow(
              color: AppColors.primaryBlack.withOpacity(0.12),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        );
      case FadelButtonVariant.secondary:
        return _ButtonConfig(
          backgroundColor: AppColors.primaryWhite,
          textColor: AppColors.primaryBlack,
          disabledColor: AppColors.neutral100,
          height: _getSizeHeight(),
          border: Border.all(color: AppColors.borderLight),
          shadow: [
            BoxShadow(
              color: AppColors.primaryBlack.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        );
      case FadelButtonVariant.accent:
        return _ButtonConfig(
          backgroundColor: AppColors.accentGreen,
          textColor: AppColors.primaryBlack,
          disabledColor: AppColors.neutral300,
          height: _getSizeHeight(),
          border: null,
          shadow: [
            BoxShadow(
              color: AppColors.accentGreen.withOpacity(0.12),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        );
      case FadelButtonVariant.ghost:
        return _ButtonConfig(
          backgroundColor: Colors.transparent,
          textColor: AppColors.primaryBlack,
          disabledColor: AppColors.neutral200,
          height: _getSizeHeight(),
          border: null,
          shadow: [],
        );
    }
  }

  double _getSizeHeight() {
    switch (widget.size) {
      case FadelButtonSize.small:
        return AppSpacing.buttonHeightSmall;
      case FadelButtonSize.medium:
        return AppSpacing.buttonHeightMedium;
      case FadelButtonSize.large:
        return AppSpacing.buttonHeightLarge;
    }
  }
}

enum FadelButtonVariant { primary, secondary, accent, ghost }

enum FadelButtonSize { small, medium, large }

class _ButtonConfig {
  final Color backgroundColor;
  final Color textColor;
  final Color disabledColor;
  final double height;
  final Border? border;
  final List<BoxShadow> shadow;

  _ButtonConfig({
    required this.backgroundColor,
    required this.textColor,
    required this.disabledColor,
    required this.height,
    required this.border,
    required this.shadow,
  });
}
