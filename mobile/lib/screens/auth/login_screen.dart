import 'package:flutter/material.dart';
import '../../constants/index.dart';
import '../../services/index.dart';
import '../../widgets/common/index.dart';
import '../auth/register_screen.dart';
import '../home/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  bool _obscurePassword = true;
  bool _isLoading = false;
  
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic));
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final response = await ApiClient.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
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
        throw Exception(response['message'] ?? 'Erreur de connexion');
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
      body: Stack(
        children: [
          const _LoginBackground(),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _slideAnim,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 60),
                      Text(
                        'FADEL',
                        style: AppTypography.heading1,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Livraison sûre, rapide, toujours là.',
                        style: AppTypography.body2Secondary,
                      ),
                      const SizedBox(height: 56),
                      FadelCard(
                        borderRadius: AppSpacing.radiusXLarge,
                        padding: const EdgeInsets.all(AppSpacing.xxxl),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'CONNEXION',
                                style: AppTypography.heading2,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Accédez à vos livraisons en un clic.',
                                style: AppTypography.body2Secondary,
                              ),
                              const SizedBox(height: 32),
                              FadelInput(
                                controller: _emailController,
                                label: 'Email',
                                hint: 'exemple@mail.com',
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
                              const SizedBox(height: 32),
                              FadelButton(
                                label: 'CONTINUER',
                                onPressed: _login,
                                isLoading: _isLoading,
                                size: FadelButtonSize.large,
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Pas encore de compte ?',
                            style: AppTypography.body2,
                          ),
                          GestureDetector(
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const RegisterScreen()),
                            ),
                            child: Text(
                              ' S\'inscrire',
                              style: AppTypography.body2.copyWith(
                                color: AppColors.accentGreen,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LoginBackground extends StatelessWidget {
  const _LoginBackground();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: -120,
          right: -80,
          child: Container(
            width: 280,
            height: 280,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppColors.accentGreen.withOpacity(0.08),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        Positioned(
          bottom: -100,
          left: -100,
          child: Container(
            width: 320,
            height: 320,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppColors.primaryBlack.withOpacity(0.04),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
