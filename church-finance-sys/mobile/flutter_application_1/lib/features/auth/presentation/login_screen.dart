import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _churchId = TextEditingController();
  final _phone = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _churchId.dispose();
    _phone.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final dio = ref.read(dioProvider);
      final tokenStore = ref.read(tokenStoreProvider);

      final res = await dio.post(
        '/auth/login',
        data: {'phone': _phone.text.trim(), 'password': _password.text},
        options: Options(headers: {'x-church-id': _churchId.text.trim()}),
      );

      final data = res.data as Map<String, dynamic>;
      await tokenStore.saveSession(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
        churchId: _churchId.text.trim(),
      );

      ref.invalidate(authSessionProvider);
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
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              Text('Welcome back', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 6),
              Text(
                'Sign in to manage your giving securely.',
                style: theme.textTheme.bodySmall,
              ),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField(
                        controller: _churchId,
                        textInputAction: TextInputAction.next,
                        decoration: const InputDecoration(
                          labelText: 'Church ID',
                          hintText: 'e.g. 2f9d…',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _phone,
                        keyboardType: TextInputType.phone,
                        textInputAction: TextInputAction.next,
                        decoration: const InputDecoration(
                          labelText: 'Phone',
                          hintText: 'e.g. 07xxxxxxxx',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _password,
                        obscureText: true,
                        textInputAction: TextInputAction.done,
                        decoration: const InputDecoration(
                          labelText: 'Password',
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
                          onPressed: _loading ? null : _login,
                          child: Text(_loading ? 'Signing in…' : 'Sign in'),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: _loading ? null : () {},
                          child: const Text('Create an account'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Payments are confirmed only after provider settlement.',
                style: theme.textTheme.bodySmall,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

