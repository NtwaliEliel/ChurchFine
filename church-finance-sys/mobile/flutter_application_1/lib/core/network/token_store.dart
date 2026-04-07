import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStore {
  static const _access = 'access_token';
  static const _refresh = 'refresh_token';
  static const _churchId = 'church_id';

  final FlutterSecureStorage _storage;
  const TokenStore(this._storage);

  Future<void> saveSession({
    required String accessToken,
    required String refreshToken,
    required String churchId,
  }) async {
    await _storage.write(key: _access, value: accessToken);
    await _storage.write(key: _refresh, value: refreshToken);
    await _storage.write(key: _churchId, value: churchId);
  }

  Future<String?> accessToken() => _storage.read(key: _access);
  Future<String?> refreshToken() => _storage.read(key: _refresh);
  Future<String?> churchId() => _storage.read(key: _churchId);

  Future<void> clear() async {
    await _storage.delete(key: _access);
    await _storage.delete(key: _refresh);
    await _storage.delete(key: _churchId);
  }
}

