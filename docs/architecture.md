# System Architecture

## Overview

AutoBackup Manager is a three-tier distributed system designed for reliable, scheduled file backup across multiple platforms with a unified control plane.

```
┌─────────────────┐
│   Android App   │ (Kotlin + Jetpack Compose)
│  (On Demand,    │
│   Scheduled)    │
└────────┬────────┘
         │ REST/gRPC
         │ (JWT Auth)
┌────────▼──────────────────────────────────────┐
│         Backend API (Spring Boot 3)           │
│  ┌──────────────────────────────────────────┐ │
│  │ Controllers: Auth, Schedule, Backup,     │ │
│  │             Device, FileLog              │ │
│  ├──────────────────────────────────────────┤ │
│  │ Services: Persistence, notification      │ │
│  ├──────────────────────────────────────────┤ │
│  │ PostgreSQL: Users, devices, schedules    │ │
│  └──────────────────────────────────────────┘ │
└────────┬──────────────────────────────────────┘
         │ REST/GraphQL
         │ (JWT Auth)
┌────────▼────────────┐
│   Web Dashboard     │
│   (Next.js 14)      │
│ (View history,      │
│  manage schedules)  │
└─────────────────────┘
```

## Data Flow

### Backup Execution Flow
1. **Trigger**: User initiates backup (manual or scheduled via WorkManager on Android)
2. **Request**: Android sends `POST /api/backup-runs` with schedule ID
3. **Processing**: Backend creates `BackupRun` record, marks as `RUNNING`
4. **Scanning**: Android lists files from source (Documents, Downloads, Photos)
5. **Transfer**: Files moved/copied to destination (Drive, OneDrive, S3 bucket)
6. **Logging**: Per-file success/failure recorded in `file_logs`
7. **Completion**: Backend updates `BackupRun` with final counts, status
8. **Visibility**: Web dashboard displays results in real-time via polling/WebSocket

### Schedule Execution
- **WorkManager** (Android): Triggers on specified day/time or periodic intervals
- **Backend Storage**: Schedules persisted in DB, retrieved by device on login
- **Device Sync**: Android polls `/api/schedules` on boot and periodically
- **Conflict Resolution**: Latest server version wins on conflicts

## Module Structure

### Android (Clean Architecture)

```
Domain Layer (Pure Kotlin, no Android deps)
├── UseCase
│   ├── ExecuteBackupUseCase        → Orchestrate file transfer
│   ├── ScheduleBackupUseCase       → Create/update schedule
│   ├── ResolveDestinationUseCase   → Map destination enum to URI
│   └── RetryFailedTransfersUseCase → Retry mechanism
├── Repository (interfaces)
│   ├── BackupRepository
│   ├── ScheduleRepository
│   └── FileLogRepository
└── Model (data classes, enums)

Data Layer (Android framework)
├── Entity (Room models)
├── DAO (database access)
├── Repository (implementations)
├── DataStore (user preferences)
└── Remote (API client)

UI Layer (Jetpack Compose)
├── Screens (Login, Dashboard, ScheduleList)
└── Components (composables)

Worker Layer
├── BackupWorker (WorkManager)
├── BackupForegroundService
└── Receivers (Boot, Backup Trigger)

Storage Layer
├── SAF helpers (access Documents, Downloads)
├── MediaStore (Photos, videos)
└── Transfer engine (duplicate checking)
```

### Backend (Spring Boot 3)

```
API Layer
├── Controllers (REST endpoints)
│   ├── /api/auth
│   ├── /api/schedules
│   ├── /api/runs
│   ├── /api/files
│   └── /api/devices
└── Exception handlers

Business Logic Layer
├── Services
│   ├── AuthService (JWT, password hashing)
│   ├── ScheduleService (CRUD + validation)
│   ├── BackupRunService (tracking)
│   └── FileLogService
└── Model validators

Data Access Layer
├── Repositories (Spring Data JPA)
├── Entities (JPA models)
└── Database (PostgreSQL)

Infrastructure
├── Security config (JWT, CORS)
├── Database config (Flyway)
└── Logging
```

### Web (Next.js 14)

```
Pages (App Router)
├── /login, /register
├── /dashboard (overview, stats)
├── /schedules (CRUD)
├── /history (view past backups)
├── /devices (device management)
└── /settings

Components
├── Atomic: Button, Card, Input
├── Domain: ScheduleCard, RunTable
└── Layout: Sidebar, Header

API Client
├── axios instance with JWT interceptor
└── Typed endpoints

State Management
├── React Query (data fetching)
├── Context API (auth state)
└── localStorage (JWT tokens)
```

## Authentication & Authorization

**Flow:**
1. User registers: `POST /api/auth/register` → hashed password stored
2. User logs in: `POST /api/auth/login` → returns JWT (15min) + refresh token
3. Requests include: `Authorization: Bearer <jwt>`
4. Token expiry: backend returns 401, frontend calls `POST /api/auth/refresh`
5. Refresh token stored securely (HttpOnly on web, encrypted on Android)

**Scope:**
- No role-based authorization (MVP)
- User can only access own schedules, runs, devices

## Deployment

### Android
- Built via GitHub Actions: `android-ci.yml`
- Outputs `.apk` artifact
- Manual upload to Google Play or Firebase App Distribution

### Backend
- Built via GitHub Actions: `backend-ci.yml`
- Docker image pushed to Railway container registry
- Environment variables passed from Railway dashboard
- PostgreSQL addon provisioned via Railway

### Web
- Built via GitHub Actions: `web-ci.yml`
- Deployed to Vercel via CLI
- Environment variables (`NEXT_PUBLIC_API_URL`) set in Vercel dashboard
- Auto-deploys on push to `main`

## Scalability Considerations

**Bottlenecks (MVP):**
- Single PostgreSQL instance (add read replicas if needed)
- Polling from Android (consider WebSocket for real-time)
- No backup job queuing (jobs run synchronously on device)

**Future:**
- Message queue (RabbitMQ) for async job processing
- Redis cache for schedule lookups
- S3 for large file transfers
- Grafana monitoring & alerting
