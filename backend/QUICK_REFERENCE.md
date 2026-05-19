# Backend Quick Reference Guide

## Project Structure

```
backend/
├── src/main/kotlin/com/autobackup/api/
│   ├── controller/        → REST endpoints
│   ├── service/           → Business logic
│   ├── repository/        → Data access
│   ├── model/
│   │   ├── entity/        → JPA entities
│   │   └── dto/           → Request/Response DTOs
│   ├── security/          → JWT & auth
│   ├── config/            → Spring config
│   └── exception/         → Error handling
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/      → Flyway SQL
├── src/test/              → Unit/integration tests
└── build.gradle.kts       → Dependencies
```

## Running the Application

### Development
```bash
cd backend
gradle bootRun
# http://localhost:8080/api
# Swagger: http://localhost:8080/api/swagger-ui.html
```

### Testing
```bash
gradle test                          # Run all tests
gradle test --tests AuthServiceTest  # Run specific test
gradle test jacocoTestReport         # With coverage
```

### Production
```bash
gradle bootJar
java -jar build/libs/autobackup-manager-1.0.0.jar \
  --spring.profiles.active=prod \
  --DATABASE_URL=jdbc:postgresql://host:5432/db \
  --DATABASE_USER=user \
  --DATABASE_PASSWORD=pass \
  --JWT_SECRET=secret-key
```

## API Quick Reference

### 1. Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Refresh Token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'
```

### 2. Devices
```bash
TOKEN="your-access-token"

# Register device
curl -X POST http://localhost:8080/api/devices/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceName":"My Phone"}'

# List devices
curl -X GET http://localhost:8080/api/devices \
  -H "Authorization: Bearer $TOKEN"

# Delete device
curl -X DELETE http://localhost:8080/api/devices/{deviceId} \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Schedules
```bash
TOKEN="your-access-token"

# Create schedule
curl -X POST http://localhost:8080/api/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId":"550e8400-e29b-41d4-a716-446655440000",
    "sourceUri":"/storage/photos",
    "destinationUri":"s3://bucket/photos",
    "destinationType":"CLOUD",
    "triggerHour":2,
    "triggerMinute":30
  }'

# List schedules
curl -X GET http://localhost:8080/api/schedules \
  -H "Authorization: Bearer $TOKEN"

# Update schedule
curl -X PUT http://localhost:8080/api/schedules/{scheduleId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"triggerHour":3}'

# Toggle schedule
curl -X PATCH http://localhost:8080/api/schedules/{scheduleId}/toggle \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Backup Runs
```bash
TOKEN="your-access-token"

# List runs
curl -X GET "http://localhost:8080/api/runs?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"

# Get run details
curl -X GET http://localhost:8080/api/runs/{runId} \
  -H "Authorization: Bearer $TOKEN"

# Get file logs
curl -X GET "http://localhost:8080/api/runs/{runId}/files?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"

# Get failed files
curl -X GET http://localhost:8080/api/runs/{runId}/failed \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Statistics
```bash
TOKEN="your-access-token"

# Get dashboard stats
curl -X GET http://localhost:8080/api/stats/summary \
  -H "Authorization: Bearer $TOKEN"
```

## Database Connection

### Local PostgreSQL
```bash
psql -h localhost -U postgres -d autobackup
```

### SQL Examples
```sql
-- List users
SELECT id, email, created_at FROM users;

-- List devices for user
SELECT * FROM devices WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- List schedules for user
SELECT * FROM backup_schedules WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- List backup runs
SELECT id, schedule_id, status, started_at FROM backup_runs ORDER BY started_at DESC;

-- Get file logs for a run
SELECT filename, status, transferred_at FROM file_logs WHERE run_id = '...';
```

## Configuration

### Environment Variables
```bash
# Required for production
DATABASE_URL=jdbc:postgresql://localhost:5432/autobackup
DATABASE_USER=postgres
DATABASE_PASSWORD=password
JWT_SECRET=your-secret-key-min-32-chars

# Optional
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### application.yml Sections
```yaml
jwt:
  expiration: 900000        # 15 minutes in ms
  refresh-expiration: 2592000000  # 30 days in ms

cors:
  allowed-origins: http://localhost:3000

server:
  port: 8080
  servlet:
    context-path: /api
```

## Common Tasks

### Add New Endpoint
1. Create DTO in `model/dto/`
2. Add method to Service
3. Add @PostMapping method to Controller
4. Return ResponseEntity<ApiResponse<DTO>>

### Add New Entity
1. Create entity in `model/entity/`
2. Create Repository interface
3. Create Service with CRUD methods
4. Create Controller with endpoints

### Add Validation
1. Throw ValidationException in service
2. Check message appears in error response
3. Add test in ServiceTest

### Debug Issues
1. Check logs: `logs/autobackup-manager.log`
2. Check database: `psql -d autobackup`
3. Check Swagger: http://localhost:8080/api/swagger-ui.html
4. Check test logs: `gradle test --info`

## Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| FORBIDDEN | 403 | User lacks permission |
| RESOURCE_NOT_FOUND | 404 | Entity not found |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_EMAIL | 409 | Email already registered |
| INTERNAL_ERROR | 500 | Server error |

## Performance Tips

1. **Pagination:** Always paginate large result sets
2. **Indexes:** Add DB indexes on frequently queried columns
3. **Caching:** Use Spring Cache for static data
4. **Connections:** Monitor HikariCP pool usage
5. **Queries:** Avoid N+1 queries (use @Transactional)

## Security Checklist

- [ ] JWT_SECRET set to 32+ random characters
- [ ] DATABASE_PASSWORD never in code
- [ ] HTTPS enforced in production
- [ ] CORS restricted to known origins
- [ ] Passwords hashed with BCrypt
- [ ] User isolation enforced (cannot access others' data)
- [ ] All inputs validated
- [ ] Error messages don't leak sensitive info

## Testing Quick Commands

```bash
# Run auth tests
gradle test --tests "AuthServiceTest"

# Run schedule validation tests
gradle test --tests "ScheduleServiceTest"

# Run controller integration tests
gradle test --tests "BackupRunControllerTest"

# View test report
open build/reports/tests/test/index.html
```

## Troubleshooting

### Build Fails
```bash
gradle clean build      # Clean and rebuild
gradle --refresh-dependencies  # Refresh deps
```

### Database Connection Error
```bash
# Check if PostgreSQL running
psql --version
# Check connection string
echo $DATABASE_URL
```

### JWT Token Expired
```bash
# Tokens expire after 15 minutes
# Use refresh token endpoint to get new access token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'
```

### User Isolation Error
```bash
# Verify user in SecurityContextHolder
# Check service calls getCurrentUserId()
# Verify repositories filter by user_id
```

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/device-management
   ```

2. **Make changes** in service and controller

3. **Write tests** in src/test/

4. **Run tests**
   ```bash
   gradle test
   ```

5. **Build and verify**
   ```bash
   gradle build
   gradle bootRun
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add device management"
   git push origin feature/device-management
   ```

## Resources

- [Spring Boot 3.2 Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT (jjwt)](https://github.com/jwtk/jjwt)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Flyway Migration](https://flywaydb.org/)
- [Kotlin Docs](https://kotlinlang.org/docs/home.html)

## Support

For questions or issues:
1. Check BACKEND_IMPLEMENTATION.md
2. Check existing test examples
3. Review similar service implementation
4. Check GlobalExceptionHandler for error handling
