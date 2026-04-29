import 'package:flutter/material.dart';
import '../../constants/index.dart';
import '../../services/index.dart';
import '../../widgets/common/index.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  bool _obscurePassword = true;
  bool _agreedToTerms = false;
  bool _isLoading = false;
  
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _register() async {
    if (!_formKey.currentState!.validate() || !_agreedToTerms) {
      if (!_agreedToTerms) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Veuillez accepter les conditions')),
        );
      }
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiClient.register(
        email: _emailController.text.trim(),
        password: _passwordController.text,
        firstName: _firstNameController.text,
        lastName: _lastNameController.text,
      );

      if (response.containsKey('accessToken')) {
        await AuthService.saveTokens(
          accessToken: response['accessToken'],
          refreshToken: response['refreshToken'] ?? '',
          user: response['user'] ?? {},
        );

        if (!mounted) return;
        Navigator.of(context).pushReplacementNamed('/home');
      } else {
        throw Exception(response['message'] ?? 'Erreur d\'inscription');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgMistGray,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          color: AppColors.primaryBlack,
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('INSCRIPTION', style: AppTypography.heading3),
        backgroundColor: AppColors.primaryWhite,
        elevation: 0,
      ),
      body: FadeTransition(
        opacity: _fadeAnim,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const SizedBox(height: 24),
                FadelCard(
                  borderRadius: AppSpacing.radiusXLarge,
                  padding: const EdgeInsets.all(AppSpacing.xxxl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      FadelInput(
                        controller: _firstNameController,
                        label: 'Prénom',
                        hint: 'Jean',
                        prefixIcon: Icons.person_outline,
                        validator: (value) => value?.isEmpty ?? true ? 'Prénom requis' : null,
                      ),
                      const SizedBox(height: 16),
                      FadelInput(
                        controller: _lastNameController,
                        label: 'Nom',
                        hint: 'Dupont',
                        prefixIcon: Icons.person_outline,
                        validator: (value) => value?.isEmpty ?? true ? 'Nom requis' : null,
                      ),
                      const SizedBox(height: 16),
                      FadelInput(
                        controller: _emailController,
                        label: 'Email',
                        hint: 'jean@example.com',
                        prefixIcon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) => value?.isEmpty ?? true ? 'Email requis' : null,
                      ),
                      const SizedBox(height: 16),
                      FadelInput(
                        controller: _passwordController,
                        label: 'Mot de passe',
                        hint: '••••••••',
                        prefixIcon: Icons.lock_outline,
                        obscureText: _obscurePassword,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            color: AppColors.accentGreen,
                          ),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                        validator: (value) => value?.isEmpty ?? true ? 'Mot de passe requis' : null,
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          Checkbox(
                            value: _agreedToTerms,
                            onChanged: (value) => setState(() => _agreedToTerms = value ?? false),
                            activeColor: AppColors.accentGreen,
                          ),
                          Expanded(
                            child: Text(
                              'J\'accepte les conditions d\'utilisation',
                              style: AppTypography.body3,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      FadelButton(
                        label: 'S\'INSCRIRE',
                        onPressed: _register,
                        isLoading: _isLoading,
                        size: FadelButtonSize.large,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Déjà inscrit ?',
                            style: AppTypography.body2,
                          ),
                          GestureDetector(
                            onTap: () => Navigator.of(context).pushReplacement(
                              MaterialPageRoute(builder: (_) => const LoginScreen()),
                            ),
                            child: Text(
                              ' Se connecter',
                              style: AppTypography.body2.copyWith(
                                color: AppColors.accentGreen,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
