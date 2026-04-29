import 'package:flutter/material.dart';

/// FaDel Delivery - Design System Color Palette
/// High-Contrast Minimalist Design
class AppColors {
  AppColors._(); // Private constructor

  // Primary Colors
  static const Color primaryBlack = Color(0xFF000000); // Pure Black
  static const Color primaryWhite = Color(0xFFFFFFFF); // Optical White
  static const Color accentGreen = Color(0xFF22C55E); // Signal Green

  // Background
  static const Color bgMistGray = Color(0xFFF9FAFB); // App Background
  static const Color bgWhite = Color(0xFFFFFFFF);
  static const Color bgBlack = Color(0xFF000000);

  // Text Colors
  static const Color textPrimary = Color(0xFF000000); // Primary Text
  static const Color textSecondary = Color(0xFF6B7280); // Secondary Text
  static const Color textTertiary = Color(0xFF9CA3AF); // Tertiary Text
  static const Color textInverted = Color(0xFFFFFFFF); // For dark backgrounds

  // Border & Divider
  static const Color borderLight = Color(0xFFE5E7EB);
  static const Color borderMedium = Color(0xFFD1D5DB);
  static const Color borderDark = Color(0xFF9CA3AF);

  // Status Colors
  static const Color statusSuccess = Color(0xFF22C55E); // Green Signal
  static const Color statusError = Color(0xFFEF4444); // Red
  static const Color statusWarning = Color(0xFFFCD34D); // Amber
  static const Color statusInfo = Color(0xFF3B82F6); // Blue

  // Semantic Colors
  static const Color success = statusSuccess;
  static const Color error = statusError;
  static const Color warning = statusWarning;
  static const Color info = statusInfo;

  // Neutral Palette
  static const Color neutral50 = Color(0xFFFAFAFA);
  static const Color neutral100 = Color(0xFFF5F5F5);
  static const Color neutral200 = Color(0xFFEEEEEE);
  static const Color neutral300 = Color(0xFFE0E0E0);
  static const Color neutral400 = Color(0xFFBDBDBD);
  static const Color neutral500 = Color(0xFF9E9E9E);
  static const Color neutral600 = Color(0xFF757575);
  static const Color neutral700 = Color(0xFF616161);
  static const Color neutral800 = Color(0xFF424242);
  static const Color neutral900 = Color(0xFF212121);

  // Transparent variants (for overlays and halos)
  static const Color primaryBlackTransparent = Color(0x1A000000); // 10% opacity
  static const Color accentGreenTransparent = Color(0x14000000); // 8% opacity
}
