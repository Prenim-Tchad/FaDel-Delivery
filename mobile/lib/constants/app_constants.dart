/// FaDel Delivery - Application Constants
class AppConstants {
  AppConstants._(); // Private constructor

  // App Info
  static const String appName = 'FaDel Delivery';
  static const String appVersion = '1.0.0';

  // Animation Durations
  static const Duration animationShort = Duration(milliseconds: 150);
  static const Duration animationMedium = Duration(milliseconds: 300);
  static const Duration animationLong = Duration(milliseconds: 600);

  // Scale factors for interactions
  static const double scaleOnTap = 0.98;

  // Debounce duration
  static const Duration debounceDuration = Duration(milliseconds: 500);

  // API timeouts
  static const Duration apiTimeout = Duration(seconds: 30);

  // Shadow elevations
  static const double shadowElevationSmall = 2.0;
  static const double shadowElevationMedium = 8.0;
  static const double shadowElevationLarge = 16.0;
}
