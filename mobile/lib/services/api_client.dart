import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  // URL statique pour le développement (Port 3001 du Backend Node.js)
  // À l'avenir, on pourra repasser par dotenv.env['API_URL'] pour la production
  static const String baseUrl = "http://localhost:3001";

  static Future<Map<String, dynamic>> checkHealth() async {
    try {
      // Appel asynchrone pour vérifier la disponibilité du serveur
      final response = await http.get(Uri.parse('$baseUrl/health'));
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {'status': 'ERROR'};
    } catch (e) {
      return {'status': 'ERROR'};
    }
  }
}