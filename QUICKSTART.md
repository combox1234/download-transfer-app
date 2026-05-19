# Quick Start Guide

Get AutoBackup Manager running locally in 5 minutes.

## Prerequisites

- **JDK 17+** ([download](https://adoptium.net))
- **Node.js 18+** ([download](https://nodejs.org))
- **PostgreSQL 14+** ([download](https://www.postgresql.org))
- **Gradle 8.0+** (included via wrapper)
- **Android SDK 34** (for Android development)

## 1. Database Setup

```bash
# Create databases
createdb autobackup          # Development database
createdb autobackup_test     # Test database

# Verify connection
psql -U postgres -d autobackup -c "SELECT version();"
```

## 2. Backend (Spring Boot)

```bash
cd backend

# Build
./gradlew build

# Run development server (auto-migrates schema via Flyway)
./gradlew bootRun

# Server starts on http://localhost:8080/api
# Health check: curl http://localhost:8080/api/actuator/health
```

### Environment Variables (optional)
```bash
export JWT_SECRET=your-secret-key
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/autobackup
export SPRING_DATASOURCE_PASSWORD=postgres
```

## 3. Web Dashboard (Next.js)

```bash
cd web

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Configure API endpoint (edit .env.local)
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Run development server
npm run dev

# Dashboard available at http://localhost:3000
```

### Build for production
```bash
npm run build
npm start  # Runs on port 3000
```

## 4. Android App

```bash
cd android

# Sync Gradle
./gradlew sync

# Build debug APK
./gradlew assembleDebug

# APK output: android/app/build/outputs/apk/debug/app-debug.apk

# Or install directly to emulator/device
./gradlew installDebug
```

## API Testing

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response: {"accessToken":"...", "refreshToken":"...", "expiresIn":900000}
```

### Authenticated Request (use accessToken)
```bash
TOKEN="your-access-token"
curl -X GET http://localhost:8080/api/schedules \
  -H "Authorization: Bearer $TOKEN"
```

## Development Workflow

### Adding a New Feature

1. **Update OpenAPI spec** (`shared/api-contracts/openapi.yaml`)
   ```bash
   # Then regenerate client code
   cd web && npm run openapi:generate
   ```

2. **Backend changes** (`backend/src/main/kotlin/...`)
   ```bash
   cd backend
   ./gradlew test          # Run tests
   ./gradlew bootRun       # Test locally
   ```

3. **Web changes** (`web/...`)
   ```bash
   cd web
   npm run lint            # Check for errors
   npm test                # Run tests
   npm run dev             # Hot reload
   ```

4. **Android changes** (`android/...`)
   ```bash
   cd android
   ./gradlew test          # Unit tests
   ./gradlew assembleDebug # Build APK
   ```

5. **Create PR** → CI/CD runs automatically

## Troubleshooting

### Gradle Build Fails
```bash
# Clean and retry
./gradlew clean build --refresh-dependencies
```

### Port Already in Use
```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Web (3000)
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify credentials in application.yml or environment variables
```

### Android Build Issues
```bash
# Update Android Studio & SDK Manager
# Ensure SDK 34 is installed
# Try: ./gradlew clean assembleDebug --stacktrace
```

### Web API Connection Failed
```bash
# Ensure backend is running
curl http://localhost:8080/api/actuator/health

# Check .env.local has correct NEXT_PUBLIC_API_URL
cat web/.env.local
```

## Useful Commands

```bash
# Backend
cd backend
./gradlew bootRun              # Run dev server
./gradlew test                 # Run tests
./gradlew build                # Build JAR
./gradlew bootBuildImage       # Build Docker image

# Web
cd web
npm run dev                    # Development
npm run build && npm start     # Production
npm run lint                   # Check code
npm run test                   # Tests
npm run openapi:generate       # Regenerate types from OpenAPI

# Android
cd android
./gradlew sync                 # Gradle sync
./gradlew build                # Build all modules
./gradlew assembleDebug        # Build debug APK
./gradlew test                 # Unit tests
./gradlew installDebug         # Deploy to device/emulator
```

## Deployment

### Backend (Railway)
```bash
# CI/CD handles automatic deployment on push to main
# Manual: push Docker image to Railway
```

### Web (Vercel)
```bash
# CI/CD handles automatic deployment on push to main
# Manual: npm install -g vercel && vercel
```

### Android
```bash
# Build release APK (requires keystore)
cd android
./gradlew bundleRelease

# Upload to Google Play or Firebase App Distribution
```

## Documentation

- [Architecture](docs/architecture.md) - System design, data flow, deployment
- [API Reference](docs/api.md) - Endpoint documentation with examples
- [OpenAPI Spec](shared/api-contracts/openapi.yaml) - Machine-readable spec

## Support

For issues or questions:
1. Check [docs/architecture.md](docs/architecture.md)
2. Review [README.md](README.md)
3. Search existing GitHub issues
4. Create new issue with detailed context
