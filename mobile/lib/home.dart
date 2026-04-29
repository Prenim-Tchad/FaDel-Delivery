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
      backgroundColor: const Color(0xFFF9FAFB), // Mist Gray (App Background)
      body: FadeTransition(
        opacity: _fadeAnim,
        child: CustomScrollView(
          slivers: [
            // ── Header ──────────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Container(
                color: const Color(0xFFFFFFFF), // Optical White header
                child: Stack(
                  children: [
                    // Subtle halo
                    Positioned(
                      top: -100,
                      right: -60,
                      child: Container(
                        width: 240,
                        height: 240,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              const Color(0xFF22C55E).withOpacity(0.06),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
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
                                            '👋',
                                            style: TextStyle(fontSize: 20),
                                          ),
                                          SizedBox(width: 8),
                                          Text(
                                            'Où allons-nous aujourd\'hui ?',
                                            style: TextStyle(
                                              fontFamily: 'Jakarta Sans',
                                              color: Color(0xFF000000),
                                              fontSize: 18,
                                              fontWeight: FontWeight.w900,
                                              letterSpacing: -0.05,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: const [
                                          Icon(
                                            Icons.location_on,
                                            color: Color(0xFF22C55E),
                                            size: 14,
                                          ),
                                          SizedBox(width: 6),
                                          Text(
                                            'Kabalaye, N\'Djamena',
                                            style: TextStyle(
                                              fontFamily: 'Jakarta Sans',
                                              color: Color(0xFF6B7280),
                                              fontSize: 12,
                                              fontWeight: FontWeight.w500,
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
                            // Search Bar
                            _SearchBar(),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Quick Actions ────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Row(
                  children: _quickActions
                      .map((q) => Expanded(child: _QuickActionTile(action: q)))
                      .toList(),
                ),
              ),
            ),

            // ── Banner Card ──────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: _BannerCard(),
              ),
            ),

            // ── Services Section ─────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Row(
                  children: [
                    const Text(
                      'NOS SERVICES',
                      style: TextStyle(
                        fontFamily: 'Jakarta Sans',
                        color: Color(0xFF000000),
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF22C55E).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        '8 Services',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          color: Color(0xFF22C55E),
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Voir tout →',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          color: Color(0xFF22C55E),
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
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
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
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
              // Logout via authentication service
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

class _SearchBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB), // Mist Gray
        borderRadius: BorderRadius.circular(36), // Squircle
        border: Border.all(
          color: const Color(0xFFE5E7EB),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF000000).withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const SizedBox(width: 16),
          const Icon(
            Icons.search,
            color: Color(0xFF22C55E),
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Chercher un service...',
                border: InputBorder.none,
                hintStyle: const TextStyle(
                  fontFamily: 'Jakarta Sans',
                  color: Color(0xFF9CA3AF),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              style: const TextStyle(
                fontFamily: 'Jakarta Sans',
                color: Color(0xFF000000),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.all(6),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF000000),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(
              Icons.tune,
              color: Color(0xFFFFFFFF),
              size: 16,
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}

class _NotifBell extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(32), // Squircle
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: const Icon(
            Icons.notifications_outlined,
            color: Color(0xFF000000),
            size: 20,
          ),
        ),
        Positioned(
          top: 6,
          right: 6,
          child: Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              color: Color(0xFFEF4444),
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
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(32), // Squircle
      ),
      child: const Center(
        child: Text(
          'MD',
          style: TextStyle(
            fontFamily: 'Jakarta Sans',
            color: Color(0xFFFFFFFF),
            fontWeight: FontWeight.w900,
            fontSize: 13,
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
      height: 136,
      decoration: BoxDecoration(
        color: const Color(0xFF000000), // Pure Black
        borderRadius: BorderRadius.circular(40), // Squircle
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF000000).withOpacity(0.1),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Subtle halo
          Positioned(
            right: -40,
            top: -20,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF22C55E).withOpacity(0.08),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        '🚀 NOUVEAU',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          color: Color(0xFF22C55E),
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.6,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Paiement de factures\nà portée de main',
                        style: TextStyle(
                          fontFamily: 'Jakarta Sans',
                          color: Color(0xFFFFFFFF),
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          height: 1.3,
                          letterSpacing: -0.05,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF22C55E),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: const Text(
                          'Découvrir →',
                          style: TextStyle(
                            fontFamily: 'Jakarta Sans',
                            color: Color(0xFF000000),
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    color: const Color(0xFF22C55E),
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: const Icon(
                    Icons.receipt_long_outlined,
                    color: Color(0xFF000000),
                    size: 36,
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

class _QuickActionTile extends StatefulWidget {
  final _QuickAction action;
  const _QuickActionTile({required this.action});

  @override
  State<_QuickActionTile> createState() => _QuickActionTileState();
}

class _QuickActionTileState extends State<_QuickActionTile>
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
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: () {},
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: const Color(0xFF000000),
                borderRadius: BorderRadius.circular(28), // Squircle
              ),
              child: Icon(widget.action.icon,
                  color: const Color(0xFFFFFFFF), size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              widget.action.label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Jakarta Sans',
                color: Color(0xFF000000),
                fontSize: 10,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ServiceTile extends StatefulWidget {
  final _Service service;
  const _ServiceTile({required this.service});

  @override
  State<_ServiceTile> createState() => _ServiceTileState();
}

class _ServiceTileState extends State<_ServiceTile>
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
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: () {},
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: const Color(0xFFFFFFFF),
                borderRadius: BorderRadius.circular(28), // Squircle
                border: Border.all(
                  color: const Color(0xFFE5E7EB),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF000000).withOpacity(0.06),
                    blurRadius: 12,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(widget.service.icon,
                  color: widget.service.color, size: 26),
            ),
            const SizedBox(height: 8),
            Text(
              widget.service.label,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: const TextStyle(
                fontFamily: 'Jakarta Sans',
                color: Color(0xFF000000),
                fontSize: 10,
                fontWeight: FontWeight.w900,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NewsTile extends StatefulWidget {
  final _NewsItem news;
  const _NewsTile({required this.news});

  @override
  State<_NewsTile> createState() => _NewsTileState();
}

class _NewsTileState extends State<_NewsTile>
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
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: () {},
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFFFFF),
            borderRadius: BorderRadius.circular(36), // Squircle
            border: Border.all(color: const Color(0xFFE5E7EB), width: 1),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF000000).withOpacity(0.06),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(26),
                  border: Border.all(
                    color: const Color(0xFFE5E7EB),
                    width: 1,
                  ),
                ),
                child: Icon(widget.news.icon,
                    color: widget.news.tagColor, size: 24),
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
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: widget.news.tagColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            widget.news.tag.toUpperCase(),
                            style: TextStyle(
                              fontFamily: 'Jakarta Sans',
                              color: widget.news.tagColor,
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.4,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          widget.news.date,
                          style: const TextStyle(
                            fontFamily: 'Jakarta Sans',
                            color: Color(0xFF9CA3AF),
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.news.title,
                      style: const TextStyle(
                        fontFamily: 'Jakarta Sans',
                        color: Color(0xFF000000),
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.02,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.news.subtitle,
                      style: const TextStyle(
                        fontFamily: 'Jakarta Sans',
                        color: Color(0xFF6B7280),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(
                Icons.arrow_forward_ios,
                color: Color(0xFFD1D5DB),
                size: 14,
              ),
            ],
          ),
        ),
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
      _NavItem(Icons.home_outlined, Icons.home, 'ACCUEIL'),
      _NavItem(Icons.map_outlined, Icons.map, 'CARTE'),
      _NavItem(Icons.chat_bubble_outline, Icons.chat_bubble, 'MSG'),
      _NavItem(Icons.person_outline, Icons.person, 'PROFIL'),
      _NavItem(Icons.logout_outlined, Icons.logout, 'QUITTER'),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFFFFFFF),
        border: Border(top: BorderSide(color: Color(0xFFE5E7EB), width: 1)),
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
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: selected
                          ? const Color(0xFF22C55E).withOpacity(0.12)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      selected ? items[i].activeIcon : items[i].icon,
                      color: selected
                          ? const Color(0xFF22C55E)
                          : const Color(0xFF9CA3AF),
                      size: 22,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    items[i].label,
                    style: TextStyle(
                      fontFamily: 'Jakarta Sans',
                      color: selected
                          ? const Color(0xFF22C55E)
                          : const Color(0xFF9CA3AF),
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.3,
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
