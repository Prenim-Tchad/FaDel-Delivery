import 'package:flutter/material.dart';
import 'services/api_client.dart';
import 'services/auth_service.dart';
import 'widgets/app_logo.dart';
import 'register.dart';
import 'home.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
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
    _fadeAnim =
        CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic));
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
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Utiliser l'API backend au lieu de Supabase directement
      final response = await ApiClient.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );

      if (response.containsKey('accessToken')) {
        // Sauvegarder les tokens localement
        await AuthService.saveTokens(
          accessToken: response['accessToken'],
          refreshToken: response['refreshToken'] ?? '',
          user: response['user'] ?? {},
        );

        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Connexion réussie!')),
        );

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomePage()),
        );
      } else {
        throw Exception(response['message'] ?? 'Erreur de connexion');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: ${e.toString()}')),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB), // Mist Gray background
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
                      const AppLogo(size: 100),
                      const SizedBox(height: 24),
                      const Text(
                        'FADEL',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          fontSize: 32,
                          fontWeight: FontWeight.w900, // Black weight
                          color: Color(0xFF000000), // Pure Black
                          letterSpacing: -0.05, // Tight tracking
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Livraison sûre, rapide, toujours là.',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          fontSize: 14,
                          fontWeight: FontWeight.w500, // Medium
                          color: Color(0xFF000000),
                          letterSpacing: 0.2,
                        ),
                      ),
                      const SizedBox(height: 56),
                      Container(
                        padding: const EdgeInsets.all(32),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFFFFF), // Optical White
                          borderRadius: BorderRadius.circular(40), // Squircle
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF000000).withOpacity(0.08),
                              blurRadius: 24,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'CONNEXION',
                              style: TextStyle(
                                fontFamily: 'Jakarta Sans',
                                fontSize: 24,
                                fontWeight: FontWeight.w900, // Black
                                color: Color(0xFF000000),
                                letterSpacing: -0.05, // Tight
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Accédez à vos livraisons en un clic.',
                              style: TextStyle(
                                fontFamily: 'Jakarta Sans',
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF000000),
                                letterSpacing: 0.2,
                              ),
                            ),
                            const SizedBox(height: 32),
                            _InputField(
                              controller: _emailController,
                              label: 'Adresse e-mail',
                              hint: 'exemple@mail.com',
                              icon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                            ),
                            const SizedBox(height: 16),
                            _InputField(
                              controller: _passwordController,
                              label: 'Mot de passe',
                              hint: '••••••••',
                              icon: Icons.lock_outline,
                              obscureText: _obscurePassword,
                              suffix: IconButton(
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off_outlined
                                      : Icons.visibility_outlined,
                                  color: const Color(0xFF8B9CC8),
                                  size: 20,
                                ),
                                onPressed: () => setState(() =>
                                    _obscurePassword = !_obscurePassword),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Align(
                              alignment: Alignment.centerRight,
                              child: GestureDetector(
                                onTap: () {},
                                child: const Text(
                                  'Mot de passe oublié ?',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Color(0xFF4F7CFF),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 32),
                            _GradientButton(
                              label: 'CONTINUER',
                              isLoading: _isLoading,
                              onTap: _login,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Pas encore de compte ?",
                            style: TextStyle(
                              fontFamily: 'Jakarta Sans',
                              color: Color(0xFF000000),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const RegisterPage()),
                            ),
                            child: const Text(
                              " S'inscrire",
                              style: TextStyle(
                                fontFamily: 'Jakarta Sans',
                                color: Color(0xFF22C55E),
                                fontSize: 14,
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

// ── Widgets privés ─────────────────────────────────────────────────────────────

class _LoginBackground extends StatelessWidget {
  const _LoginBackground();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Subtle Gaussian blur halo - guidance without visual weight
        Positioned(
          top: -120,
          right: -80,
          child: Container(
            width: 280,
            height: 280,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(colors: [
                const Color(0xFF22C55E).withOpacity(0.08), // Signal Green halo
                Colors.transparent,
              ]),
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
              gradient: RadialGradient(colors: [
                const Color(0xFF000000).withOpacity(0.04), // Subtle black
                Colors.transparent,
              ]),
            ),
          ),
        ),
      ],
    );
  }
}

class _InputField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final bool obscureText;
  final Widget? suffix;
  final TextInputType? keyboardType;

  const _InputField({
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    this.obscureText = false,
    this.suffix,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(
            fontFamily: 'Jakarta Sans',
            color: Color(0xFF000000),
            fontSize: 11,
            fontWeight: FontWeight.w900, // Black
            letterSpacing: 0.8, // Wide spacing for micro-labels
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          style: const TextStyle(
            fontFamily: 'Jakarta Sans',
            color: Color(0xFF000000),
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(
              fontFamily: 'Jakarta Sans',
              color: Color(0x4D000000),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
            prefixIcon: Icon(icon, color: const Color(0xFF22C55E), size: 20),
            suffixIcon: suffix,
            filled: true,
            fillColor: const Color(0xFFF9FAFB), // Mist Gray
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(32), // Squircle
              borderSide: const BorderSide(
                color: Color(0xFFE5E7EB),
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(32),
              borderSide: const BorderSide(
                color: Color(0xFFE5E7EB),
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(32),
              borderSide: const BorderSide(
                color: Color(0xFF22C55E),
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _GradientButton extends StatefulWidget {
  final String label;
  final bool isLoading;
  final VoidCallback onTap;

  const _GradientButton({
    required this.label,
    required this.isLoading,
    required this.onTap,
  });

  @override
  State<_GradientButton> createState() => _GradientButtonState();
}

class _GradientButtonState extends State<_GradientButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.98).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: widget.isLoading ? null : (_) => _controller.forward(),
      onTapUp: widget.isLoading ? null : (_) {
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: widget.isLoading ? null : () => _controller.reverse(),
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          height: 56,
          width: double.infinity,
          decoration: BoxDecoration(
            color: const Color(0xFF000000), // Pure Black
            borderRadius: BorderRadius.circular(36), // Squircle
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF000000).withOpacity(0.12),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Center(
            child: widget.isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      color: Color(0xFFFFFFFF),
                      strokeWidth: 2.5,
                    ),
                  )
                : Text(
                    widget.label.toUpperCase(),
                    style: const TextStyle(
                      fontFamily: 'Jakarta Sans',
                      color: Color(0xFFFFFFFF), // Optical White
                      fontSize: 16,
                      fontWeight: FontWeight.w900, // Black
                      letterSpacing: 0.6,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
