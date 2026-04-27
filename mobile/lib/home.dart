import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'services/auth_service.dart';
import 'login.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  final List<_Service> _services = [
    _Service(
      'Signalement',
      Icons.report_problem_outlined,
      Color(0xFFFF6B6B),
      'Signalez un problème dans votre quartier',
    ),
    _Service(
      'Transport',
      Icons.directions_bus_outlined,
      Color(0xFF4F7CFF),
      'Horaires et lignes de bus',
    ),
    _Service(
      'Santé',
      Icons.local_hospital_outlined,
      Color(0xFF00D4A4),
      'Centres de santé proches',
    ),
    _Service(
      'Sécurité',
      Icons.shield_outlined,
      Color(0xFFFFB347),
      'Alertes et numéros d\'urgence',
    ),
    _Service(
      'Éducation',
      Icons.school_outlined,
      Color(0xFFB47AFF),
      'Écoles et formations',
    ),
    _Service(
      'Commerce',
      Icons.storefront_outlined,
      Color(0xFF4FC3F7),
      'Boutiques et marchés locaux',
    ),
    _Service(
      'Mairie',
      Icons.account_balance_outlined,
      Color(0xFFFF8A65),
      'Démarches administratives',
    ),
    _Service(
      'Événements',
      Icons.event_outlined,
      Color(0xFF66BB6A),
      'Agenda du quartier',
    ),
  ];

  final List<_NewsItem> _news = [
    _NewsItem(
      title: 'Restaurants',
      subtitle: 'Passez des commandes 24H/24',
      tag: 'Gastronomie',
      tagColor: Color(0xFF4F7CFF),
      icon: Icons.food_bank_outlined,
      date: 'Des codes promos exclusifs pour vous !',
    ),
    _NewsItem(
      title: 'Chargement de gaz',
      subtitle: 'Faites-nous charger vos gaz à domicile',
      tag: 'Cuisine',
      tagColor: Color(0xFF4FC3F7),
      icon: Icons.local_gas_station_outlined,
      date: 'Appelez-nous',
    ),
    _NewsItem(
      title: 'Taxi',
      subtitle: 'Commandez nos taxis depuis votre position',
      tag: 'Logistique',
      tagColor: Color(0xFF00D4A4),
      icon: Icons.taxi_alert_outlined,
      date: 'Nos chauffeurs sont prêts à vous servir !',
    ),
    _NewsItem(
      title: 'Livraison des colis',
      subtitle: 'Nous livrons vos colis à domicile en toute sécurité',
      tag: 'Colis',
      tagColor: Color(0xFFFFB347),
      icon: Icons.delivery_dining_outlined,
      date: '07 Avr.',
    ),
  ];

  final List<_QuickAction> _quickActions = [
    _QuickAction('Commander', Icons.shopping_cart_outlined, Color(0xFFFF6B6B)),
    _QuickAction(
      'Envoyer un colis',
      Icons.delivery_dining_outlined,
      Color(0xFFFFB347),
    ),
    _QuickAction(
      'Mes commandes',
      Icons.shopping_bag_outlined,
      Color(0xFF4F7CFF),
    ),
    _QuickAction('Contacts', Icons.contacts_outlined, Color(0xFF66BB6A)),
  ];

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A),
      body: FadeTransition(
        opacity: _fadeAnim,
        child: CustomScrollView(
          slivers: [
            // ── Header ──────────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Stack(
                children: [
                  Container(
                    height: 220,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFF1A2A50), Color(0xFF0A0E1A)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                  Positioned(
                    top: -60,
                    right: -40,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            const Color(0xFF4F7CFF).withOpacity(0.2),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: const [
                                        Text(
                                          '👋  ',
                                          style: TextStyle(fontSize: 20),
                                        ),
                                        Text(
                                          'Bonjour, Ernest !',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 22,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: const [
                                        Icon(
                                          Icons.location_on,
                                          color: Color(0xFF4F7CFF),
                                          size: 14,
                                        ),
                                        SizedBox(width: 4),
                                        Text(
                                          'Kabalaye, N\'Djamena',
                                          style: TextStyle(
                                            color: Color(0xFF8B9CC8),
                                            fontSize: 13,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              _NotifBell(),
                              const SizedBox(width: 12),
                              _UserAvatar(),
                            ],
                          ),
                          const SizedBox(height: 20),
                          // Barre de recherche
                          Container(
                            height: 48,
                            decoration: BoxDecoration(
                              color: const Color(0xFF131929),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: const Color(0xFF2A3A5C),
                              ),
                            ),
                            child: Row(
                              children: [
                                const SizedBox(width: 14),
                                const Icon(
                                  Icons.search,
                                  color: Color(0xFF4F7CFF),
                                  size: 20,
                                ),
                                const SizedBox(width: 10),
                                const Expanded(
                                  child: Text(
                                    'Rechercher un service...',
                                    style: TextStyle(
                                      color: Color(0xFF4A5B7A),
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.all(6),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFF4F7CFF),
                                        Color(0xFF8A5FE0),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Icon(
                                    Icons.tune,
                                    color: Colors.white,
                                    size: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Accès rapides ────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 4, 20, 0),
                child: Row(
                  children: _quickActions
                      .map((q) => Expanded(child: _QuickActionTile(action: q)))
                      .toList(),
                ),
              ),
            ),

            // ── Bannière ─────────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: _BannerCard(),
              ),
            ),

            // ── Actualités ───────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Row(
                  children: [
                    const Text(
                      'Nos Services',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4F7CFF).withOpacity(0.18),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        '6 Services',
                        style: TextStyle(
                          color: Color(0xFF4F7CFF),
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Voir tout',
                        style: TextStyle(
                          color: Color(0xFF4F7CFF),
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => _ServiceTile(service: _services[i]),
                  childCount: _services.length,
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  mainAxisSpacing: 14,
                  crossAxisSpacing: 14,
                  childAspectRatio: 0.83,
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => _NewsTile(news: _news[i]),
                  childCount: _news.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
      bottomNavigationBar: _BottomNav(
        selectedIndex: _selectedIndex,
        onTap: (i) async {
          setState(() => _selectedIndex = i);
          if (i == 4) {
            try {
              // Déconnexion via le service d'authentification
              await AuthService.logout();
              await Supabase.instance.client.auth.signOut();

              if (!mounted) return;
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const LoginPage()),
              );
            } catch (e) {
              if (!mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Erreur lors de la déconnexion')),
              );
            }
          }
        },
      ),
    );
  }
}

// ── Widgets privés ─────────────────────────────────────────────────────────────

class _NotifBell extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFF131929),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF2A3A5C)),
          ),
          child: const Icon(
            Icons.notifications_outlined,
            color: Colors.white,
            size: 20,
          ),
        ),
        Positioned(
          top: 8,
          right: 8,
          child: Container(
            width: 9,
            height: 9,
            decoration: const BoxDecoration(
              color: Color(0xFFFF6B6B),
              shape: BoxShape.circle,
            ),
          ),
        ),
      ],
    );
  }
}

class _UserAvatar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 42,
      height: 42,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF4F7CFF), Color(0xFF8A5FE0)],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(
        child: Text(
          'MD',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}

class _BannerCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E3A7A), Color(0xFF4F2D8A)],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.06),
              ),
            ),
          ),
          Positioned(
            right: 30,
            bottom: -30,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.06),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        '🔥 Nouveau !',
                        style: TextStyle(
                          color: Color(0xFFFFD580),
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Paiement de factures\ndirectement depuis l\'app',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                          ),
                        ),
                        child: const Text(
                          'Découvrir →',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.receipt_long_outlined,
                    color: Colors.white,
                    size: 38,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionTile extends StatelessWidget {
  final _QuickAction action;
  const _QuickActionTile({required this.action});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: action.color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: action.color.withOpacity(0.25)),
            ),
            child: Icon(action.icon, color: action.color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            action.label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFFCDD5F0),
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _ServiceTile extends StatelessWidget {
  final _Service service;
  const _ServiceTile({required this.service});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: service.color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: service.color.withOpacity(0.2)),
            ),
            child: Icon(service.icon, color: service.color, size: 26),
          ),
          const SizedBox(height: 8),
          Text(
            service.label,
            textAlign: TextAlign.center,
            maxLines: 2,
            style: const TextStyle(
              color: Color(0xFFCDD5F0),
              fontSize: 11,
              fontWeight: FontWeight.w600,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }
}

class _NewsTile extends StatelessWidget {
  final _NewsItem news;
  const _NewsTile({required this.news});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF131929),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF1E2D4A)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: news.tagColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(news.icon, color: news.tagColor, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: news.tagColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        news.tag,
                        style: TextStyle(
                          color: news.tagColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      news.date,
                      style: const TextStyle(
                        color: Color(0xFF4A5B7A),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  news.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  news.subtitle,
                  style: const TextStyle(
                    color: Color(0xFF8B9CC8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          const Icon(
            Icons.arrow_forward_ios,
            color: Color(0xFF4A5B7A),
            size: 14,
          ),
        ],
      ),
    );
  }
}

class _BottomNav extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onTap;
  const _BottomNav({required this.selectedIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final items = [
      _NavItem(Icons.home_outlined, Icons.home, 'Accueil'),
      _NavItem(Icons.map_outlined, Icons.map, 'Carte'),
      _NavItem(Icons.chat_bubble_outline, Icons.chat_bubble, 'Messagerie'),
      _NavItem(Icons.person_outline, Icons.person, 'Profil'),
      _NavItem(Icons.logout_outlined, Icons.logout, 'Quitter'),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF0F1726),
        border: Border(top: BorderSide(color: Color(0xFF1E2D4A))),
      ),
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 20),
      child: Row(
        children: List.generate(items.length, (i) {
          final selected = i == selectedIndex;
          return Expanded(
            child: GestureDetector(
              onTap: () => onTap(i),
              behavior: HitTestBehavior.opaque,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: selected
                          ? const Color(0xFF4F7CFF).withOpacity(0.15)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      selected ? items[i].activeIcon : items[i].icon,
                      color: selected
                          ? const Color(0xFF4F7CFF)
                          : const Color(0xFF4A5B7A),
                      size: 22,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    items[i].label,
                    style: TextStyle(
                      color: selected
                          ? const Color(0xFF4F7CFF)
                          : const Color(0xFF4A5B7A),
                      fontSize: 10,
                      fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}

// ── Modèles de données ─────────────────────────────────────────────────────────

class _Service {
  final String label;
  final IconData icon;
  final Color color;
  final String description;
  _Service(this.label, this.icon, this.color, this.description);
}

class _NewsItem {
  final String title;
  final String subtitle;
  final String tag;
  final Color tagColor;
  final IconData icon;
  final String date;
  _NewsItem({
    required this.title,
    required this.subtitle,
    required this.tag,
    required this.tagColor,
    required this.icon,
    required this.date,
  });
}

class _QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  _QuickAction(this.label, this.icon, this.color);
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  _NavItem(this.icon, this.activeIcon, this.label);
}
