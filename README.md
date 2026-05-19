# AutoBackup Manager

A production-grade monorepo for a comprehensive backup management system with native Android support, modern web dashboard, and robust backend API.

## Architecture

**Tech Stack:**
- **Android**: Kotlin + Jetpack Compose, Clean Architecture
- **Web**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3 + Kotlin on Railway
- **Database**: PostgreSQL with Flyway migrations
- **Build**: Gradle (Android + Backend), npm (Web)

## Project Structure

```
autobackup-manager/
├── android/                   # Android native app (Gradle module)
│   ├── app/                   # Entry point & DI
│   ├── domain/                # UseCase & models
│   ├── data/                  # Room DB & repositories
│   ├── worker/                # WorkManager & scheduling
│   ├── storage/               # SAF & file handling
│   └── common/                # Shared utilities
├── backend/                   # Spring Boot 3 API
│   ├── src/main/kotlin/       # Controllers, services, entities
│   └── src/main/resources/    # application.yml, migrations
├── web/                       # Next.js 14 dashboard (npm)
│   ├── app/                   # App Router
│   ├── components/            # React components
│   └── lib/                   # API client, hooks, types
├── shared/
│   └── api-contracts/         # OpenAPI 3.0 spec (single source of truth)
├── docs/                      # Architecture & API documentation
└── .github/workflows/         # CI/CD pipelines
```

## Getting Started

### Prerequisites
- JDK 17+ (Android & Backend)
- Gradle 8.0+
- Node.js 18+
- PostgreSQL 14+ (local or Railway)
- Android SDK 34+

### Development Setup

**Android:**
```bash
cd android
./gradlew build
./gradlew assembleDebug    # Build APK
```

**Backend:**
```bash
cd backend
./gradlew build
./gradlew bootRun          # Development server on :8080
```

**Web:**
```bash
cd web
npm install
npm run dev               # Development on :3000
```

### Environment Variables

**Backend** (backend/src/main/resources/application-dev.yml):
- `SPRING_DATASOURCE_URL`: PostgreSQL connection
- `SPRING_DATASOURCE_PASSWORD`: DB password
- `JWT_SECRET`: Signing key for tokens

**Web** (web/.env.local):
- `NEXT_PUBLIC_API_URL=http://localhost:8080`

## Shared API Contract

All three clients (Android, Web, Backend) implement the same OpenAPI 3.0 specification:
```
shared/api-contracts/openapi.yaml
```

### Generating Client Code

**Android** (generate Retrofit interfaces):
```bash
cd android
./gradlew openApiGenerate
```

**Web** (generate TypeScript types):
```bash
cd web
npm run openapi:generate
```

## Database Schema

PostgreSQL schema managed via Flyway:
- `users` — Authentication & user profiles
- `devices` — Registered client devices
- `backup_schedules` — Backup job configurations
- `backup_runs` — Execution history
- `file_logs` — Per-file transfer results
- `failed_transfers` — Retry queue

Run migrations automatically on app startup.

## CI/CD Pipelines

**GitHub Actions:**
- `.github/workflows/android-ci.yml` — Build & test APK
- `.github/workflows/backend-ci.yml` — Build & deploy to Railway
- `.github/workflows/web-ci.yml` — Build & deploy to Vercel

Trigger on push to `main` branch.

## Development Workflow

1. **Create feature branch**: `git checkout -b feature/new-schedule-ui`
2. **Implement across modules** (Android, backend, web as needed)
3. **Update OpenAPI spec** if adding endpoints
4. **Run tests**: `gradle test`, `npm test`
5. **Create PR** with test coverage
6. **Deploy on merge to main** via GitHub Actions

## Documentation

- [Architecture](docs/architecture.md) — System design, data flow, deployment topology
- [API Reference](docs/api.md) — Endpoint documentation, examples

## Security

- JWT token-based authentication (15min expiry, refresh tokens)
- Database-backed user credentials
- CORS configured for Android + web origins
- No sensitive data in logs
- HTTPS on production deployments

## License

Proprietary — AutoBackup Manager
