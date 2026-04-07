import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class TithingScreen extends StatefulWidget {
  const TithingScreen({super.key});

  @override
  State<TithingScreen> createState() => _TithingScreenState();
}

class _TithingScreenState extends State<TithingScreen> {
  bool _enabled = false;
  String _type = 'percentage';
  final _value = TextEditingController(text: '10');
  final _phone = TextEditingController();

  @override
  void dispose() {
    _value.dispose();
    _phone.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Automated tithing')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text('Enable automated tithing', style: theme.textTheme.titleMedium),
                      ),
                      Switch(
                        value: _enabled,
                        activeColor: AppColors.red,
                        onChanged: (v) => setState(() => _enabled = v),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Charges are initiated monthly and remain pending until provider settlement.',
                    style: theme.textTheme.bodySmall,
                  ),
                  const SizedBox(height: 14),
                  DropdownButtonFormField<String>(
                    value: _type,
                    decoration: const InputDecoration(labelText: 'Type'),
                    items: const [
                      DropdownMenuItem(value: 'percentage', child: Text('Percentage')),
                      DropdownMenuItem(value: 'fixed', child: Text('Fixed amount')),
                    ],
                    onChanged: _enabled ? (v) => setState(() => _type = v ?? 'percentage') : null,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _value,
                    enabled: _enabled,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: _type == 'fixed' ? 'Amount (RWF)' : 'Percent (%)',
                      hintText: _type == 'fixed' ? 'e.g. 10000' : 'e.g. 10',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _phone,
                    enabled: _enabled,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'MTN MoMo phone',
                      hintText: 'e.g. 07xxxxxxxx',
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _enabled ? () {} : null,
                      child: const Text('Save settings'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Schedule', style: theme.textTheme.titleMedium),
                const SizedBox(height: 6),
                Text('Next charge: 1st of next month (09:00)', style: theme.textTheme.bodySmall),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

