import 'package:flutter/material.dart';
import 'app_colors.dart';

/// FaDel Delivery - Typography System
/// Jakarta Sans font family with Black, Medium weights
class AppTypography {
  AppTypography._(); // Private constructor

  static const String fontFamily = 'Jakarta Sans';

  // Heading Styles (Weight: 900 Black, Tight Tracking)
  static const TextStyle heading1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w900, // Black
    color: AppColors.textPrimary,
    letterSpacing: -0.05, // Tight tracking
    height: 1.2,
  );

  static const TextStyle heading2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w900,
    color: AppColors.textPrimary,
    letterSpacing: -0.05,
    height: 1.2,
  );

  static const TextStyle heading3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w900,
    color: AppColors.textPrimary,
    letterSpacing: -0.03,
    height: 1.3,
  );

  static const TextStyle heading4 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w900,
    color: AppColors.textPrimary,
    letterSpacing: -0.02,
    height: 1.3,
  );

  // Body Styles (Weight: 500 Medium)
  static const TextStyle body1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w500, // Medium
    color: AppColors.textPrimary,
    letterSpacing: 0.0,
    height: 1.5,
  );

  static const TextStyle body2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
    letterSpacing: 0.0,
    height: 1.5,
  );

  static const TextStyle body3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
    letterSpacing: 0.0,
    height: 1.4,
  );

  // Label Styles (Weight: 900 Black, UPPERCASE, Wide Spacing)
  static const TextStyle labelLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w900, // Black
    color: AppColors.textPrimary,
    letterSpacing: 0.8, // Wide spacing
    height: 1.2,
  );

  static const TextStyle labelMedium = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w900,
    color: AppColors.textPrimary,
    letterSpacing: 0.6,
    height: 1.2,
  );

  static const TextStyle labelSmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 10,
    fontWeight: FontWeight.w900,
    color: AppColors.textPrimary,
    letterSpacing: 0.4,
    height: 1.2,
  );

  // Caption Style
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w500,
    color: AppColors.textTertiary,
    letterSpacing: 0.0,
    height: 1.3,
  );

  // Button Text
  static const TextStyle buttonText = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w900, // Black
    color: AppColors.textInverted,
    letterSpacing: 0.6,
    height: 1.2,
  );

  // Override for secondary text colors
  static TextStyle heading1Secondary = heading1.copyWith(
    color: AppColors.textSecondary,
  );

  static TextStyle body1Secondary = body1.copyWith(
    color: AppColors.textSecondary,
  );

  static TextStyle body2Secondary = body2.copyWith(
    color: AppColors.textSecondary,
  );
}
