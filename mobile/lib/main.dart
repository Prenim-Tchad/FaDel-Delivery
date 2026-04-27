import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'services/api_client.dart';
import 'services/auth_service.dart';
import 'login.dart';
import 'register.dart';
import 'home.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Charger les variables d'environnement
  await dotenv.load(fileName: ".env");

  // Initialiser Supabase
  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
  );

  runApp(const FaDelApp());
}

class FaDelApp extends StatelessWidget {
  const FaDelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FaDel Delivery',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const AuthWrapper(),
      routes: {
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/home': (context) => const HomePage(),
      },
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _checkAuthState();
    _listenSupabaseAuthState();
  }

  Future<void> _checkAuthState() async {
    final isLoggedIn = await AuthService.isLoggedIn();
    if (isLoggedIn) {
      // Vérifier si le token est toujours valide
      final profile = await AuthService.getProfile();
      if (profile == null) {
        // Token expiré, déconnecter
        await AuthService.logout();
        await Supabase.instance.client.auth.signOut();
      }
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  void _listenSupabaseAuthState() {
    Supabase.instance.client.auth.onAuthStateChange.listen((data) async {
      final event = data.event;
      final session = data.session;

      if (event == AuthChangeEvent.signedIn && session != null) {
        // Sauvegarder les tokens localement
        await AuthService.saveTokens(
          accessToken: session.accessToken,
          refreshToken: session.refreshToken ?? '',
          user: session.user.toJson(),
        );
      } else if (event == AuthChangeEvent.signedOut) {
        // Nettoyer les tokens locaux
        await AuthService.logout();
      }

      if (mounted) {
        setState(() => _isLoading = false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      return const HomePage();
    } else {
      return const AuthSelectionPage();
    }
  }
}

class AuthSelectionPage extends StatelessWidget {
  const AuthSelectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.delivery_dining, size: 80, color: Colors.blue),
            const SizedBox(height: 20),
            const Text(
              'FaDel Delivery',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/login'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(200, 50),
              ),
              child: const Text('Se connecter'),
            ),
            const SizedBox(height: 20),
            OutlinedButton(
              onPressed: () => Navigator.pushNamed(context, '/register'),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(200, 50),
              ),
              child: const Text('S\'inscrire'),
            ),
          ],
        ),
      ),
    );
  }
}