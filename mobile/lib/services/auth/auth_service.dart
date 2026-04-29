import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static const String _accessTokenKey = 'fadel_access_token';
  static const String _refreshTokenKey = 'fadel_refresh_token';
  static const String _userKey = 'fadel_user';

  static const _secureStorage = FlutterSecureStorage();

  /// Save tokens and user data locally
  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
    required Map<String, dynamic> user,
  }) async {
    await Future.wait([
      _secureStorage.write(key: _accessTokenKey, value: accessToken),
      _secureStorage.write(key: _refreshTokenKey, value: refreshToken),
      _secureStorage.write(key: _userKey, value: user.toString()),
    ]);
  }

  /// Get stored access token
  static Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: _accessTokenKey);
  }

  /// Get stored refresh token
  static Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: _refreshTokenKey);
  }

  /// Check if user is authenticated
  static Future<bool> isAuthenticated() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  /// Logout - clear all stored data
  static Future<void> logout() async {
    await Future.wait([
      _secureStorage.delete(key: _accessTokenKey),
      _secureStorage.delete(key: _refreshTokenKey),
      _secureStorage.delete(key: _userKey),
    ]);
  }

  /// Clear all secure storage
  static Future<void> clearAll() async {
    await _secureStorage.deleteAll();
  }
}
