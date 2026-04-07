import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'token_store.dart';

final tokenStoreProvider = Provider<TokenStore>((ref) {
  return const TokenStore(FlutterSecureStorage());
});

final dioProvider = Provider<Dio>((ref) {
  final tokenStore = ref.watch(tokenStoreProvider);
  final dio = Dio(
    BaseOptions(
      baseUrl: const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000/api/v1'),
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await tokenStore.accessToken();
        final churchId = await tokenStore.churchId();
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        if (churchId != null) options.headers['x-church-id'] = churchId;
        handler.next(options);
      },
    ),
  );

  return dio;
});

