import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Admin')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Financial overview', style: theme.textTheme.titleMedium),
          const SizedBox(height: 10),
          Row(
            children: const [
              Expanded(child: _AdminStat(title: 'This month', value: 'RWF 0')),
              SizedBox(width: 12),
              Expanded(child: _AdminStat(title: 'This year', value: 'RWF 0')),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: const [
              Expanded(child: _AdminStat(title: 'Pending', value: '0')),
              SizedBox(width: 12),
              Expanded(child: _AdminStat(title: 'Failed', value: '0')),
            ],
          ),
          const SizedBox(height: 18),
          Text('Operations', style: theme.textTheme.titleMedium),
          const SizedBox(height: 10),
          _ActionTile(
            icon: Icons.receipt_long_outlined,
            title: 'Manage transactions',
            subtitle: 'Review pending/failed and export reports',
            onTap: () {},
          ),
          _ActionTile(
            icon: Icons.category_outlined,
            title: 'Giving categories',
            subtitle: 'Add/edit categories per church',
            onTap: () {},
          ),
          _ActionTile(
            icon: Icons.people_outline,
            title: 'Members',
            subtitle: 'Search members and view giving history',
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _AdminStat extends StatelessWidget {
  final String title;
  final String value;
  const _AdminStat({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: theme.textTheme.bodySmall),
            const SizedBox(height: 8),
            Text(value, style: theme.textTheme.titleMedium?.copyWith(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Ink(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border),
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.black.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, color: AppColors.black),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: theme.textTheme.titleMedium),
                      const SizedBox(height: 2),
                      Text(subtitle, style: theme.textTheme.bodySmall),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

