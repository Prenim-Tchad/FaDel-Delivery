/// Input validation utilities
class Validators {
  Validators._(); // Private constructor

  /// Validate email format
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email est requis';
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value)) {
      return 'Email invalide';
    }

    return null;
  }

  /// Validate password strength
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mot de passe est requis';
    }

    if (value.length < 8) {
      return 'Minimum 8 caractères requis';
    }

    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Doit contenir au moins une majuscule';
    }

    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Doit contenir au moins une minuscule';
    }

    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Doit contenir au moins un chiffre';
    }

    return null;
  }

  /// Validate required field
  static String? validateRequired(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    return null;
  }

  /// Validate phone number
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Numéro de téléphone requis';
    }

    final phoneRegex = RegExp(r'^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}');

    if (!phoneRegex.hasMatch(value)) {
      return 'Numéro de téléphone invalide';
    }

    return null;
  }

  /// Validate name
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Le nom est requis';
    }

    if (value.length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }

    if (value.length > 50) {
      return 'Le nom ne doit pas dépasser 50 caractères';
    }

    return null;
  }

  /// Validate URL
  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Optional field
    }

    try {
      Uri.parse(value);
      return null;
    } catch (e) {
      return 'URL invalide';
    }
  }

  /// Validate numeric value
  static String? validateNumeric(String? value) {
    if (value == null || value.isEmpty) {
      return 'Ce champ est requis';
    }

    if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
      return 'Doit contenir uniquement des chiffres';
    }

    return null;
  }
}
