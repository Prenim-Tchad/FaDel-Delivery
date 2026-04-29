/// FaDel Delivery - Spacing System
/// Consistent spacing tokens for layout
class AppSpacing {
  AppSpacing._(); // Private constructor

  // Base spacing unit (4px)
  static const double baseUnit = 4.0;

  // Spacing tokens
  static const double xs = 4.0; // 1 unit
  static const double sm = 8.0; // 2 units
  static const double md = 12.0; // 3 units
  static const double lg = 16.0; // 4 units
  static const double xl = 20.0; // 5 units
  static const double xxl = 24.0; // 6 units
  static const double xxxl = 32.0; // 8 units
  static const double huge = 40.0; // 10 units
  static const double massive = 48.0; // 12 units

  // Common gaps
  static const double gapSmall = sm;
  static const double gapMedium = lg;
  static const double gapLarge = xxl;

  // Padding presets
  static const double paddingSmall = sm;
  static const double paddingMedium = lg;
  static const double paddingLarge = xl;
  static const double paddingXLarge = xxl;
  static const double paddingHuge = xxxl;

  // Border radius (Squircle style)
  static const double radiusSmall = 16.0;
  static const double radiusMedium = 24.0;
  static const double radiusLarge = 32.0;
  static const double radiusXLarge = 40.0; // Max squircle
  static const double radiusFull = 9999.0; // Circle

  // Button sizes
  static const double buttonHeightSmall = 40.0;
  static const double buttonHeightMedium = 48.0;
  static const double buttonHeightLarge = 56.0;
}
