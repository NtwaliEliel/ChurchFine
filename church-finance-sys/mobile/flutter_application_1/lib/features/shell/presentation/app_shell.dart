import 'package:flutter/material.dart';

import '../../dashboard/presentation/dashboard_screen.dart';
import '../../give/presentation/give_screen.dart';
import '../../transactions/presentation/transactions_screen.dart';
import '../../tithing/presentation/tithing_screen.dart';
import '../../admin/presentation/admin_dashboard_screen.dart';
import '../../../core/theme/app_colors.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  final _screens = const [
    DashboardScreen(),
    GiveScreen(),
    TransactionsScreen(),
    TithingScreen(),
    AdminDashboardScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _screens[_index]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        indicatorColor: AppColors.red.withOpacity(0.12),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.volunteer_activism_outlined), label: 'Give'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), label: 'History'),
          NavigationDestination(icon: Icon(Icons.autorenew_outlined), label: 'Tithing'),
          NavigationDestination(icon: Icon(Icons.admin_panel_settings_outlined), label: 'Admin'),
        ],
      ),
    );
  }
}

