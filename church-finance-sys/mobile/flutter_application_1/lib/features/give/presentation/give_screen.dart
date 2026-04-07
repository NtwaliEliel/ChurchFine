import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/theme/app_colors.dart';

class GiveScreen extends ConsumerStatefulWidget {
  const GiveScreen({super.key});

  @override
  ConsumerState<GiveScreen> createState() => _GiveScreenState();
}

class _GiveScreenState extends ConsumerState<GiveScreen> {
  final _amount = TextEditingController();
  final _phone = TextEditingController();
  String? _categoryId;
  bool _loading = false;
  String? _error;

  final _categories = const [
    ('tithe', 'Tithe'),
    ('offering', 'Offering'),
    ('donation', 'Donation'),
    ('project', 'Project Fund'),
  ];

  @override
  void dispose() {
    _amount.dispose();
    _phone.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final dio = ref.read(dioProvider);
      final amount = double.tryParse(_amount.text.trim());
      if (amount == null || amount <= 0) {
        throw Exception('Enter a valid amount');
      }
      if (_phone.text.trim().isEmpty) {
        throw Exception('Enter payer phone');
      }

      final res = await dio.post('/payments/initiate', data: {
        'categoryId': _categoryId,
        'amount': amount,
        'currency': 'RWF',
        'payerPhone': _phone.text.trim(),
        'description': 'Mobile giving',
      });

      if (!mounted) return;
      final tx = res.data;
      await showModalBottomSheet(
        context: context,
        showDragHandle: true,
        builder: (_) => _PaymentPendingSheet(tx: tx),
      );
    } on DioException catch (e) {
      setState(() => _error = e.response?.data?.toString() ?? e.message);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Give')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Giving details', style: theme.textTheme.titleMedium),
          const SizedBox(height: 10),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  DropdownButtonFormField<String>(
                    value: _categoryId,
                    decoration: const InputDecoration(labelText: 'Category'),
                    items: _categories
                        .map((c) => DropdownMenuItem(value: c.$1, child: Text(c.$2)))
                        .toList(),
                    onChanged: (v) => setState(() => _categoryId = v),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _amount,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Amount (RWF)',
                      hintText: 'e.g. 5000',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _phone,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'MTN MoMo phone',
                      hintText: 'e.g. 07xxxxxxxx',
                    ),
                  ),
                  const SizedBox(height: 14),
                  if (_error != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.danger.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.danger.withOpacity(0.25)),
                      ),
                      child: Text(
                        _error!,
                        style: theme.textTheme.bodySmall?.copyWith(color: AppColors.danger),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _loading ? null : _submit,
                      child: Text(_loading ? 'Starting payment…' : 'Confirm & Pay'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          Text(
            'Important: your payment is marked as pending until settlement is confirmed by the provider.',
            style: theme.textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

class _PaymentPendingSheet extends StatelessWidget {
  final dynamic tx;
  const _PaymentPendingSheet({required this.tx});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Payment started', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Text('Status: pending', style: theme.textTheme.bodySmall),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.warning.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.warning.withOpacity(0.25)),
            ),
            child: Text(
              'Approve the request in MoMo. This screen will update once the webhook confirms settlement.',
              style: theme.textTheme.bodySmall,
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Done'),
            ),
          ),
        ],
      ),
    );
  }
}

