/// Helper functions
class Helpers {
  Helpers._(); // Private constructor

  /// Delay execution
  static Future<void> delay([Duration duration = const Duration(milliseconds: 500)]) {
    return Future.delayed(duration);
  }

  /// Print with prefix
  static void debugLog(String message, {String prefix = '✓'}) {
    print('$prefix $message');
  }

  /// Print error
  static void errorLog(String message) {
    debugLog(message, prefix: '✗');
  }

  /// Print warning
  static void warningLog(String message) {
    debugLog(message, prefix: '⚠');
  }
}
