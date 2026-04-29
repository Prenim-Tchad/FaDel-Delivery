import 'package:flutter/material.dart';
import '../../constants/index.dart';
import '../../models/index.dart';
import '../../services/index.dart';
import '../../widgets/home/index.dart';
import '../auth/login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

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
      backgroundColor: AppColors.bgMistGray,
      appBar: AppBar(
        title: Text('Où allons-nous aujourd\'hui ?', style: AppTypography.heading3),
        backgroundColor: AppColors.primaryWhite,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            color: AppColors.primaryBlack,
            onPressed: () {},
          ),
        ],
      ),
      body: FadeTransition(
        opacity: _fadeAnim,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    BannerCard(
                      title: 'Paiement de factures',
                      subtitle: 'À portée de main',
                      badgeText: '🚀 NOUVEAU',
                      actionText: 'Découvrir →',
                      icon: Icons.receipt_long_outlined,
                      onActionTap: () {},
                    ),
                    const SizedBox(height: AppSpacing.xxxl),
                    Text(
                      'NOS SERVICES',
                      style: AppTypography.labelLarge,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    _buildServicesGrid(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildServicesGrid() {
    final services = [
      Service(
        id: '1',
        label: 'Restaurants',
        icon: 'restaurant',
        color: '#FF6B6B',
        description: 'Passez des commandes',
      ),
      Service(
        id: '2',
        label: 'Taxi',
        icon: 'taxi',
        color: '#4F7CFF',
        description: 'Commandez un taxi',
      ),
      Service(
        id: '3',
        label: 'Livraison',
        icon: 'local_shipping',
        color: '#22C55E',
        description: 'Livrez vos colis',
      ),
      Service(
        id: '4',
        label: 'Gaz',
        icon: 'local_gas_station',
        color: '#FFB347',
        description: 'Chargement de gaz',
      ),
    ];

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: AppSpacing.md,
        crossAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.83,
      ),
      itemCount: services.length,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        final service = services[index];
        return ServiceTile(
          label: service.label,
          icon: _getIcon(service.icon),
          color: Color(int.parse(service.color.replaceFirst('#', '0xff'))),
          onTap: () {},
        );
      },
    );
  }

  IconData _getIcon(String iconName) {
    final iconMap = {
      'restaurant': Icons.restaurant_outlined,
      'taxi': Icons.taxi_alert_outlined,
      'local_shipping': Icons.local_shipping_outlined,
      'local_gas_station': Icons.local_gas_station_outlined,
    };
    return iconMap[iconName] ?? Icons.business_outlined;
  }

  Widget _buildBottomNav() {
    final items = [
      ('ACCUEIL', Icons.home_outlined, Icons.home),
      ('CARTE', Icons.map_outlined, Icons.map),
      ('MSG', Icons.chat_bubble_outline, Icons.chat_bubble),
      ('PROFIL', Icons.person_outline, Icons.person),
      ('QUITTER', Icons.logout_outlined, Icons.logout),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.primaryWhite,
        border: Border(
          top: BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 20),
      child: Row(
        children: List.generate(items.length, (i) {
          final selected = i == _selectedIndex;
          final (label, icon, activeIcon) = items[i];

          return Expanded(
            child: GestureDetector(
              onTap: () async {
                setState(() => _selectedIndex = i);
                if (i == 4) {
                  // Logout
                  try {
                    await AuthService.logout();
                    if (!mounted) return;
                    Navigator.of(context).pushReplacementNamed('/login');
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Erreur de déconnexion')),
                    );
                  }
                }
              },
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.lg,
                      vertical: AppSpacing.md,
                    ),
                    decoration: BoxDecoration(
                      color: selected ? AppColors.accentGreen.withOpacity(0.12) : Colors.transparent,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
                    ),
                    child: Icon(
                      selected ? activeIcon : icon,
                      color: selected ? AppColors.accentGreen : AppColors.textTertiary,
                      size: 22,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    label,
                    style: AppTypography.labelSmall.copyWith(
                      color: selected ? AppColors.accentGreen : AppColors.textTertiary,
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
