import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';

class AuthService {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user';

  static Future<SharedPreferences> get _prefs async => await SharedPreferences.getInstance();

  // Sauvegarder les tokens après connexion
  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
    required Map<String, dynamic> user,
  }) async {
    final prefs = await _prefs;
    await prefs.setString(_accessTokenKey, accessToken);
    await prefs.setString(_refreshTokenKey, refreshToken);
    await prefs.setString(_userKey, jsonEncode(user));
  }

  // Récupérer le token d'accès
  static Future<String?> getAccessToken() async {
    final prefs = await _prefs;
    return prefs.getString(_accessTokenKey);
  }

  // Récupérer le token de rafraîchissement
  static Future<String?> getRefreshToken() async {
    final prefs = await _prefs;
    return prefs.getString(_refreshTokenKey);
  }

  // Récupérer les informations utilisateur
  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await _prefs;
    final userJson = prefs.getString(_userKey);
    if (userJson != null) {
      return jsonDecode(userJson);
    }
    return null;
  }

  // Rafraîchir le token automatiquement
  static Future<bool> refreshAccessToken() async {
    try {
      final refreshToken = await getRefreshToken();
      if (refreshToken == null) return false;

      final response = await ApiClient.refreshToken(refreshToken);
      if (response.containsKey('accessToken')) {
        final user = await getUser();
        if (user != null) {
          await saveTokens(
            accessToken: response['accessToken'],
            refreshToken: response['refreshToken'] ?? refreshToken,
            user: user,
          );
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Vérifier si l'utilisateur est connecté
  static Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  // Se déconnecter
  static Future<void> logout() async {
    try {
      final accessToken = await getAccessToken();
      if (accessToken != null) {
        await ApiClient.logout(accessToken);
      }
    } catch (e) {
      // Ignorer les erreurs de déconnexion côté serveur
    }

    final prefs = await _prefs;
    await prefs.remove(_accessTokenKey);
    await prefs.remove(_refreshTokenKey);
    await prefs.remove(_userKey);
  }

  // Récupérer le profil utilisateur depuis l'API
  static Future<Map<String, dynamic>?> getProfile() async {
    try {
      final accessToken = await getAccessToken();
      if (accessToken == null) return null;

      final response = await ApiClient.getProfile(accessToken);
      return response;
    } catch (e) {
      // Essayer de rafraîchir le token si l'accès échoue
      final refreshed = await refreshAccessToken();
      if (refreshed) {
        final accessToken = await getAccessToken();
        if (accessToken != null) {
          final response = await ApiClient.getProfile(accessToken);
          return response;
        }
      }
      return null;
    }
  }

  // Mettre à jour le profil
  static Future<Map<String, dynamic>?> updateProfile({
    String? nom,
    String? prenom,
    String? phone,
    String? quartier,
  }) async {
    try {
      final accessToken = await getAccessToken();
      if (accessToken == null) return null;

      final response = await ApiClient.updateProfile(
        accessToken,
        nom: nom,
        prenom: prenom,
        phone: phone,
        quartier: quartier,
      );
      return response;
    } catch (e) {
      // Essayer de rafraîchir le token si l'accès échoue
      final refreshed = await refreshAccessToken();
      if (refreshed) {
        final accessToken = await getAccessToken();
        if (accessToken != null) {
          final response = await ApiClient.updateProfile(
            accessToken,
            nom: nom,
            prenom: prenom,
            phone: phone,
            quartier: quartier,
          );
          return response;
        }
      }
      return null;
    }
  }
}