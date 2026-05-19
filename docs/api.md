# API Reference

Generated from OpenAPI 3.0 specification at `shared/api-contracts/openapi.yaml`.

## Authentication

All endpoints (except `/auth/*`) require:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2024-05-19T10:30:00Z"
}
```

**Response (400):** Email already exists or invalid input.

---

### POST /api/auth/login
Authenticate and receive access token + refresh token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

**Response (401):** Invalid credentials.

---

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

---

## Schedules

### GET /api/schedules
List all backup schedules for the authenticated user's device.

**Query Parameters:**
- `deviceId` (optional): Filter by specific device

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Daily Documents Backup",
      "sourceUri": "content://com.android.externalstorage.documents/tree/primary:Documents",
      "destinationUri": "https://drive.google.com/backup",
      "destinationType": "GOOGLE_DRIVE",
      "triggerHour": 22,
      "triggerMinute": 30,
      "mode": "MOVE",
      "fileFilter": "*.pdf",
      "isEnabled": true,
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-05-19T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

### POST /api/schedules
Create a new backup schedule.

**Request:**
```json
{
  "name": "Weekly Photos Backup",
  "sourceUri": "content://com.android.providers.media.documents/tree/images",
  "destinationUri": "https://onedrive.com/backup",
  "destinationType": "ONE_DRIVE",
  "triggerHour": 23,
  "triggerMinute": 0,
  "mode": "COPY",
  "fileFilter": "*.jpg,*.png",
  "isEnabled": true
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Weekly Photos Backup",
  "sourceUri": "content://...",
  "destinationUri": "https://...",
  "destinationType": "ONE_DRIVE",
  "triggerHour": 23,
  "triggerMinute": 0,
  "mode": "COPY",
  "fileFilter": "*.jpg,*.png",
  "isEnabled": true,
  "createdAt": "2024-05-19T10:30:00Z",
  "updatedAt": "2024-05-19T10:30:00Z"
}
```

---

### GET /api/schedules/{id}
Retrieve a specific backup schedule.

**Response (200):** Same as single schedule object above.

**Response (404):** Schedule not found.

---

### PUT /api/schedules/{id}
Update an existing backup schedule.

**Request:** Same as POST body.

**Response (200):** Updated schedule object.

---

### DELETE /api/schedules/{id}
Delete a backup schedule.

**Response (204):** No content.

---

## Backup Runs

### GET /api/backup-runs
List backup execution history.

**Query Parameters:**
- `scheduleId` (optional): Filter by schedule
- `status` (optional): `PENDING`, `RUNNING`, `SUCCESS`, `FAILED`, `PARTIAL`
- `limit` (optional, default 20): Results per page
- `offset` (optional, default 0): Pagination offset

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "scheduleId": "550e8400-e29b-41d4-a716-446655440001",
      "deviceId": "550e8400-e29b-41d4-a716-446655440010",
      "startedAt": "2024-05-19T22:30:00Z",
      "endedAt": "2024-05-19T22:45:30Z",
      "status": "SUCCESS",
      "totalFiles": 42,
      "movedFiles": 40,
      "failedFiles": 2,
      "bytesCopied": 1073741824,
      "errorMessage": null
    }
  ],
  "total": 143,
  "limit": 20,
  "offset": 0
}
```

---

### GET /api/backup-runs/{id}
Get details of a specific backup run.

**Response (200):** Single run object.

---

### GET /api/backup-runs/{id}/files
List individual file transfer results for a run.

**Query Parameters:**
- `status` (optional): `SUCCESS`, `FAILED`, `SKIPPED`
- `limit`, `offset` (pagination)

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "runId": "550e8400-e29b-41d4-a716-446655440003",
      "fileName": "document.pdf",
      "fileSize": 2097152,
      "sourceUri": "content://...",
      "destinationUri": "https://...",
      "status": "SUCCESS",
      "errorCode": null,
      "transferredAt": "2024-05-19T22:31:15Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440021",
      "runId": "550e8400-e29b-41d4-a716-446655440003",
      "fileName": "large_archive.zip",
      "fileSize": 5368709120,
      "sourceUri": "content://...",
      "destinationUri": "https://...",
      "status": "FAILED",
      "errorCode": "DESTINATION_FULL",
      "transferredAt": null
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

---

## Devices

### POST /api/devices/register
Register a new device for backup.

**Request:**
```json
{
  "deviceName": "Samsung Galaxy S24",
  "deviceToken": "fcm_token_123..."
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "deviceName": "Samsung Galaxy S24",
  "deviceToken": "fcm_token_123...",
  "lastSeenAt": "2024-05-19T10:30:00Z"
}
```

---

### GET /api/devices
List all registered devices for user.

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "deviceName": "Samsung Galaxy S24",
      "lastSeenAt": "2024-05-19T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "details": [
    {
      "field": "destinationType",
      "message": "Unsupported backup destination"
    }
  ],
  "timestamp": "2024-05-19T10:30:00Z"
}
```

### Common Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `DESTINATION_FULL` | 507 | Insufficient storage on destination |
| `INTERNAL_ERROR` | 500 | Server error |
