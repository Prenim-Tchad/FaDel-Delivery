import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_spacing.dart';
import '../../constants/app_typography.dart';
import 'fadel_card.dart';

class BannerCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String? badgeText;
  final String? actionText;
  final IconData? icon;
  final VoidCallback? onActionTap;

  const BannerCard({
    Key? key,
    required this.title,
    required this.subtitle,
    this.badgeText,
    this.actionText,
    this.icon,
    this.onActionTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FadelCard(
      backgroundColor: AppColors.primaryBlack,
      borderColor: Colors.transparent,
      borderRadius: AppSpacing.radiusXLarge,
      padding: const EdgeInsets.all(AppSpacing.xxl),
      shadow: [
        BoxShadow(
          color: AppColors.primaryBlack.withOpacity(0.1),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ],
      child: Stack(
        children: [
          // Subtle halo
          Positioned(
            right: -40,
            top: -20,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.accentGreen.withOpacity(0.08),
              ),
            ),
          ),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (badgeText != null) ...[
                      Text(
                        badgeText!,
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.accentGreen,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                    ],
                    Text(
                      title,
                      style: AppTypography.heading2.copyWith(
                        color: AppColors.primaryWhite,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      subtitle,
                      style: AppTypography.body2.copyWith(
                        color: AppColors.primaryWhite.withOpacity(0.8),
                      ),
                    ),
                    if (actionText != null) ...[
                      const SizedBox(height: AppSpacing.xl),
                      GestureDetector(
                        onTap: onActionTap,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.lg,
                            vertical: AppSpacing.md,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.accentGreen,
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusMedium),
                          ),
                          child: Text(
                            actionText!,
                            style: AppTypography.labelMedium.copyWith(
                              color: AppColors.primaryBlack,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (icon != null) ...[
                const SizedBox(width: AppSpacing.xl),
                Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    color: AppColors.accentGreen,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.primaryBlack,
                    size: 36,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
