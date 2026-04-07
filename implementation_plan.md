# Church Finance Management System — Implementation Plan

## Overview

Production-grade, multi-tenant church finance platform handling real money (tithes, offerings, donations) via MTN MoMo Rwanda. Builds on the existing NestJS + PostgreSQL + Redis scaffold.

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           Flutter Mobile App            │
│  (Clean Arch · Riverpod · HTTP/HTTPS)   │
└────────────────┬────────────────────────┘
                 │ HTTPS REST
┌────────────────▼────────────────────────┐
│           NestJS API Gateway            │
│  (Auth · Guard · Rate-limit · Logging)  │
├─────────────────────────────────────────┤
│  Auth │ Users │ Transactions │ Payments │
│       Tithing (Cron) │ Admin            │
├─────────────────────────────────────────┤
│  TypeORM → PostgreSQL                   │
│  BullMQ  → Redis (queues/jobs)          │
└─────────────────────────────────────────┘
         │ Webhook callback
┌────────▼────────────┐
│   MTN MoMo API      │
│   (Collections)     │
└─────────────────────┘
```

---

## Phase 1 — Database Schema (PostgreSQL)

**File:** `backend/db/schema.sql`

Tables:
- `churches` (id, name, country, subscription_tier, created_at)
- `users` (id, church_id FK, email, phone, password_hash, role, is_active, created_at)
- `roles` (id, name, permissions jsonb)
- `giving_categories` (id, church_id FK, name, description, is_active)
- `transactions` (id, church_id FK, user_id FK, category_id FK, amount, currency, status, momo_ref, idempotency_key, metadata jsonb, created_at)
- `tithe_subscriptions` (id, church_id FK, user_id FK, type [percentage|fixed], value, next_charge_date, is_active)
- `webhook_logs` (id, provider, reference, payload jsonb, status, received_at)

Rules: UUID PKs, `deleted_at` soft-delete on non-financial tables, financial records immutable.

---

## Phase 2 — Backend (NestJS)

### New Dependencies to Install
```
@nestjs/jwt @nestjs/passport passport passport-jwt passport-local
@nestjs/schedule bcrypt uuid class-validator class-transformer
axios helmet @nestjs/throttler
```

### Module Structure

```
src/
├── app.module.ts           (updated — all modules wired)
├── main.ts                 (updated — helmet, cors, validation pipe)
├── common/
│   ├── decorators/
│   ├── guards/             (jwt.guard, roles.guard)
│   ├── interceptors/       (logging.interceptor, transform.interceptor)
│   └── filters/            (http-exception.filter)
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts  (register, login, refresh)
│   ├── auth.service.ts
│   ├── strategies/         (jwt.strategy, local.strategy)
│   └── dto/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   ├── entities/user.entity.ts
│   └── dto/
├── churches/
│   ├── churches.module.ts
│   └── entities/church.entity.ts
├── transactions/
│   ├── transactions.module.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── transactions.repository.ts
│   ├── entities/transaction.entity.ts
│   └── dto/
├── payments/
│   ├── payments.module.ts
│   ├── payments.controller.ts  (initiate, webhook)
│   ├── payments.service.ts     (MTN MoMo integration)
│   ├── momo/
│   │   ├── momo.client.ts      (token gen, request-to-pay)
│   │   └── momo.types.ts
│   └── entities/webhook-log.entity.ts
├── giving-categories/
│   ├── ...
├── tithing/
│   ├── tithing.module.ts
│   ├── tithing.service.ts      (cron job)
│   ├── tithing.repository.ts
│   └── entities/tithe-subscription.entity.ts
└── admin/
    ├── admin.module.ts
    ├── admin.controller.ts     (reports, member mgmt)
    └── admin.service.ts
```

### Key Files to Create/Modify

#### [MODIFY] main.ts — Add helmet, CORS, global pipes, versioning
#### [MODIFY] app.module.ts — Register all modules + ScheduleModule + ThrottlerModule
#### [NEW] common/guards/jwt.guard.ts
#### [NEW] common/guards/roles.guard.ts
#### [NEW] common/interceptors/logging.interceptor.ts
#### [NEW] auth/auth.module.ts + auth.service.ts + auth.controller.ts
#### [NEW] auth/strategies/jwt.strategy.ts
#### [NEW] users/entities/user.entity.ts
#### [NEW] churches/entities/church.entity.ts
#### [NEW] transactions/entities/transaction.entity.ts
#### [NEW] transactions/transactions.service.ts
#### [NEW] payments/momo/momo.client.ts — MTN MoMo token + request-to-pay
#### [NEW] payments/payments.service.ts — initiate payment, handle webhook
#### [NEW] payments/payments.controller.ts — POST /payments/initiate, POST /payments/webhook
#### [NEW] payments/entities/webhook-log.entity.ts
#### [NEW] tithing/tithing.service.ts — @Cron monthly job
#### [NEW] tithing/entities/tithe-subscription.entity.ts
#### [NEW] giving-categories/* — CRUD for categories
#### [NEW] admin/admin.controller.ts — dashboard stats, exports
#### [NEW] db/schema.sql — Full SQL schema

---

## Phase 3 — MTN MoMo Integration

**Flow:**
1. Client calls `POST /payments/initiate` with amount + phone
2. Backend generates idempotency key (UUID), stores transaction as `PENDING`
3. Backend calls MTN Collections API `POST /collection/v1_0/requesttopay`
4. MTN sends async webhook to `POST /payments/webhook`
5. Webhook handler verifies signature, updates transaction to `SUCCESSFUL` or `FAILED`
6. Client polls `GET /transactions/:id` for status

**idempotency:** `X-Reference-Id` header = stored transaction UUID — prevents double charge on retry.

---

## Phase 4 — Automated Tithing (Cron)

- `@Cron('0 9 1 * *')` — fires 9 AM on 1st of every month
- Queries all active `tithe_subscriptions` where `next_charge_date <= today`
- For each: calculates amount (percentage of last month's income OR fixed)
- Calls `payments.service.initiatePayment()`
- On failure: retries up to 3× via BullMQ queue with exponential backoff
- Updates `next_charge_date` = first of next month

---

## Phase 5 — Flutter (Clean Architecture)

### pubspec.yaml additions
```yaml
flutter_riverpod, riverpod_annotation, go_router,
dio, retrofit, json_annotation, shared_preferences,
flutter_secure_storage, intl, fl_chart, shimmer,
lottie, google_fonts, pin_code_fields
```

### Folder Structure

```
lib/
├── main.dart               (updated)
├── app.dart                (MaterialApp.router + GoRouter)
├── core/
│   ├── theme/
│   │   ├── app_theme.dart  (colors, typography, components)
│   │   └── app_colors.dart
│   ├── network/
│   │   ├── dio_client.dart  (interceptors, token refresh)
│   │   └── api_endpoints.dart
│   ├── router/app_router.dart
│   └── utils/
│       ├── formatters.dart
│       └── validators.dart
├── features/
│   ├── auth/
│   │   ├── data/           (remote datasource, repository impl)
│   │   ├── domain/         (entities, use cases, repo interface)
│   │   └── presentation/   (screens, widgets, providers)
│   ├── dashboard/
│   ├── give/
│   ├── transactions/
│   ├── tithing/
│   └── admin/
└── shared/
    └── widgets/            (app_button, app_card, loading_state, etc.)
```

### Key UI Screens
1. **Login** — Clean card layout, red CTA, phone + password
2. **Dashboard** — Summary cards (monthly/yearly), quick give button, recent txns
3. **Give** — Category selector, amount input, MoMo phone, confirmation sheet
4. **Transactions** — Paginated list, status chips (pending/success/failed), search/filter
5. **Automated Tithing** — Toggle on/off, percentage/fixed selector, schedule display
6. **Admin Dashboard** — Stats overview, member list, failed txns, export button

---

## Phase 6 — API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register member |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/users/me` | Current user profile |
| GET | `/transactions` | Paginated transaction history |
| GET | `/transactions/:id` | Single transaction / status poll |
| POST | `/payments/initiate` | Start MTN MoMo payment |
| POST | `/payments/webhook` | MTN callback (public, signature-verified) |
| GET | `/giving-categories` | List categories for church |
| POST | `/giving-categories` | Create category (admin) |
| GET | `/tithing/subscription` | Get my tithe subscription |
| POST | `/tithing/subscription` | Create/update tithe subscription |
| GET | `/admin/dashboard` | Aggregate stats |
| GET | `/admin/members` | Member list |
| GET | `/admin/reports/export` | Download CSV/PDF |

---

## Verification Plan

### Backend
- `npm run start:dev` — server starts on port 3000
- `curl POST /auth/register` + `curl POST /auth/login` — returns JWT
- `curl POST /payments/initiate` — creates `PENDING` transaction
- Simulate webhook call — transaction updates to `SUCCESSFUL`

### Flutter
- `flutter pub get` then `flutter run`
- Login → Dashboard → Give flow
- Transaction list shows correct state chips

### Deployment
- `docker-compose up -d` (postgres + redis)
- `npm run start:prod` for backend
- Production [.env](file:///Users/elielntwali/Documents/Side_Projects/ChurchFine/church-finance-sys/backend/.env) with real MTN MoMo sandbox credentials

---

## Implementation Order

1. DB schema SQL
2. NestJS entities + migrations
3. Auth module (register/login/JWT)
4. Transactions module + repository
5. MTN MoMo client + payments module
6. Webhook handler
7. Tithing cron module
8. Admin module
9. Flutter core (theme, DI, router, Dio)
10. Flutter auth screens
11. Flutter dashboard + give + transactions screens
12. Flutter tithing + admin screens
