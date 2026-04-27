import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiClient {
  // URL du backend NestJS (port 3000 par défaut)
  static String get baseUrl {
    return dotenv.env['API_URL'] ?? 'http://localhost:3000';
  }

  static Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl'));
      return {
        'status': response.statusCode == 200 ? 'UP' : 'DOWN',
        'message': response.body,
      };
    } catch (e) {
      return {
        'status': 'ERROR',
        'message': e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String nom,
    required String prenom,
    required String phone,
    required String quartier,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'nom': nom,
        'prenom': prenom,
        'phone': phone,
        'quartier': quartier,
      }),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'refreshToken': refreshToken,
      }),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getProfile(String accessToken) async {
    final response = await http.get(
      Uri.parse('$baseUrl/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> updateProfile(
    String accessToken, {
    String? nom,
    String? prenom,
    String? phone,
    String? quartier,
  }) async {
    final body = <String, dynamic>{};
    if (nom != null) body['nom'] = nom;
    if (prenom != null) body['prenom'] = prenom;
    if (phone != null) body['phone'] = phone;
    if (quartier != null) body['quartier'] = quartier;

    final response = await http.patch(
      Uri.parse('$baseUrl/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode(body),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> logout(String accessToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/logout'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    return jsonDecode(response.body);
  }
}