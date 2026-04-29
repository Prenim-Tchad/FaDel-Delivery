/// API Endpoints constants
class ApiEndpoints {
  ApiEndpoints._(); // Private constructor

  // Base URL
  static const String baseUrl = 'https://api.fadel.delivery';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';

  // User endpoints
  static const String userProfile = '/users/profile';
  static const String updateProfile = '/users/profile';
  static const String deleteAccount = '/users/account';

  // Service endpoints
  static const String services = '/services';
  static String serviceDetail(String id) => '/services/$id';

  // Order endpoints
  static const String orders = '/orders';
  static String orderDetail(String id) => '/orders/$id';
  static String updateOrderStatus(String id) => '/orders/$id/status';

  // Restaurant endpoints
  static const String restaurants = '/restaurants';
  static String restaurantDetail(String id) => '/restaurants/$id';
  static String restaurantMenu(String id) => '/restaurants/$id/menu';

  // Payment endpoints
  static const String createPayment = '/payments';
  static String paymentStatus(String id) => '/payments/$id';
}
