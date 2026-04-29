import 'package:dio/dio.dart';
import '../../constants/app_constants.dart';
import '../auth/auth_service.dart';

class ApiClient {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://api.fadel.delivery', // Update with actual API URL
      connectTimeout: AppConstants.apiTimeout,
      receiveTimeout: AppConstants.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  // Interceptor for adding auth token
  static void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await AuthService.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired, attempt refresh
            final refreshToken = await AuthService.getRefreshToken();
            if (refreshToken != null) {
              try {
                final response = await _dio.post(
                  '/auth/refresh',
                  data: {'refresh_token': refreshToken},
                );
                final newAccessToken = response.data['access_token'];
                await AuthService.saveTokens(
                  accessToken: newAccessToken,
                  refreshToken: refreshToken,
                  user: response.data['user'] ?? {},
                );
                return handler.resolve(await _dio.request(
                  error.requestOptions.path,
                  options: Options(method: error.requestOptions.method),
                ));
              } catch (e) {
                await AuthService.logout();
              }
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  // Login
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      return response.data ?? {};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Register
  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'first_name': firstName,
          'last_name': lastName,
        },
      );
      return response.data ?? {};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Get user profile
  static Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final response = await _dio.get('/users/profile');
      return response.data ?? {};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Get services
  static Future<List<dynamic>> getServices() async {
    try {
      final response = await _dio.get('/services');
      return response.data['services'] ?? [];
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Get orders
  static Future<List<dynamic>> getOrders() async {
    try {
      final response = await _dio.get('/orders');
      return response.data['orders'] ?? [];
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Create order
  static Future<Map<String, dynamic>> createOrder({
    required Map<String, dynamic> data,
  }) async {
    try {
      final response = await _dio.post(
        '/orders',
        data: data,
      );
      return response.data ?? {};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Error handling
  static String _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.badResponse:
        return error.response?.data['message'] ?? 'Erreur serveur';
      case DioExceptionType.connectionTimeout:
        return 'Délai d\'attente dépassé';
      case DioExceptionType.receiveTimeout:
        return 'Réponse trop lente';
      case DioExceptionType.sendTimeout:
        return 'Envoi trop lent';
      case DioExceptionType.unknown:
        return 'Erreur inconnue';
      default:
        return 'Une erreur est survenue';
    }
  }
}
