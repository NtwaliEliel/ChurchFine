import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/login_screen.dart';
import '../../features/shell/presentation/app_shell.dart';
import '../network/token_store.dart';
import '../network/api_client.dart';

final authSessionProvider = FutureProvider<bool>((ref) async {
  final tokenStore = ref.watch(tokenStoreProvider);
  final token = await tokenStore.accessToken();
  return token != null && token.isNotEmpty;
});

final appRouterProvider = Provider<GoRouter>((ref) {
  final session = ref.watch(authSessionProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final loggedIn = session.asData?.value ?? false;
      final isLogin = state.matchedLocation == '/login';
      if (!loggedIn && !isLogin) return '/login';
      if (loggedIn && isLogin) return '/';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const AppShell(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text(state.error?.toString() ?? 'Unknown error')),
    ),
  );
});

