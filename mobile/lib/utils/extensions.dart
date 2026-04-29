/// Dart extension utilities
import 'package:flutter/material.dart';

/// String extensions
extension StringExtension on String {
  /// Capitalize first letter
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }

  /// Convert to title case
  String get toTitleCase {
    if (isEmpty) return this;
    return split(' ')
        .map((word) => word.isEmpty ? word : word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
  }

  /// Check if string is numeric
  bool get isNumeric {
    if (isEmpty) return false;
    return double.tryParse(this) != null;
  }

  /// Check if string is valid email
  bool get isValidEmail {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(this);
  }

  /// Check if string is valid URL
  bool get isValidUrl {
    try {
      Uri.parse(this);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Remove all whitespace
  String get removeWhitespace {
    return replaceAll(RegExp(r'\s+'), '');
  }

  /// Truncate string with ellipsis
  String truncate(int length, {String ellipsis = '...'}) {
    if (this.length <= length) return this;
    return substring(0, length - ellipsis.length) + ellipsis;
  }
}

/// Double extensions
extension DoubleExtension on double {
  /// Format as currency
  String toCurrency({String symbol = 'F', int decimals = 2}) {
    return '$symbol ${toStringAsFixed(decimals)}';
  }

  /// Format as percentage
  String toPercentage({int decimals = 0}) {
    return '${(this * 100).toStringAsFixed(decimals)}%';
  }
}

/// DateTime extensions
extension DateTimeExtension on DateTime {
  /// Format as readable date
  String toReadableDate() {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return '${day} ${months[month - 1]} $year';
  }

  /// Format as readable time
  String toReadableTime() {
    return '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }

  /// Check if date is today
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  /// Check if date is yesterday
  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year && month == yesterday.month && day == yesterday.day;
  }

  /// Get days difference
  int getDaysDifference(DateTime other) {
    return difference(other).inDays;
  }
}

/// List extensions
extension ListExtension<T> on List<T> {
  /// Safe access by index
  T? getOrNull(int index) {
    if (index >= 0 && index < length) {
      return this[index];
    }
    return null;
  }

  /// Get first or null
  T? get firstOrNull => isEmpty ? null : first;

  /// Get last or null
  T? get lastOrNull => isEmpty ? null : last;
}

/// BuildContext extensions
extension BuildContextExtension on BuildContext {
  /// Get screen size
  Size get screenSize => MediaQuery.of(this).size;

  /// Get screen width
  double get screenWidth => screenSize.width;

  /// Get screen height
  double get screenHeight => screenSize.height;

  /// Check if device is in landscape
  bool get isLandscape => screenWidth > screenHeight;

  /// Check if device is mobile (width < 600)
  bool get isMobile => screenWidth < 600;

  /// Check if device is tablet (width >= 600 && width < 900)
  bool get isTablet => screenWidth >= 600 && screenWidth < 900;

  /// Check if device is desktop (width >= 900)
  bool get isDesktop => screenWidth >= 900;

  /// Get device padding (notch, etc.)
  EdgeInsets get devicePadding => MediaQuery.of(this).padding;

  /// Get device view insets (keyboard, etc.)
  EdgeInsets get viewInsets => MediaQuery.of(this).viewInsets;

  /// Get keyboard height
  double get keyboardHeight => viewInsets.bottom;

  /// Check if keyboard is visible
  bool get isKeyboardVisible => keyboardHeight > 0;

  /// Get device pixel ratio
  double get devicePixelRatio => MediaQuery.of(this).devicePixelRatio;

  /// Show snackbar
  void showSnackBar(String message, {Duration duration = const Duration(seconds: 3)}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration,
      ),
    );
  }

  /// Get theme data
  ThemeData get theme => Theme.of(this);

  /// Get text theme
  TextTheme get textTheme => Theme.of(this).textTheme;
}
