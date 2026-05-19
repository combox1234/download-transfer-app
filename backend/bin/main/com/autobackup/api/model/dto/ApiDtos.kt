package com.autobackup.api.model.dto

import java.time.LocalDateTime
import java.util.UUID

// ========== Request DTOs ==========

data class RegisterRequest(
    val email: String,
    val password: String,
)

data class LoginRequest(
    val email: String,
    val password: String,
)

data class RefreshRequest(
    val refreshToken: String,
)

data class CreateScheduleRequest(
    val name: String,
    val sourceUri: String,
    val destinationUri: String,
    val destinationType: String,
    val triggerHour: Int,
    val triggerMinute: Int,
    val mode: String,
    val fileFilter: String? = null,
    val isEnabled: Boolean = true,
)

data class DeviceRegistrationRequest(
    val deviceName: String,
    val deviceToken: String,
)

// ========== Backup Run / File Log Requests ==========
data class BackupRunRequest(
    val scheduleId: UUID,
    val deviceId: UUID,
    val startedAt: LocalDateTime? = null,
    val status: String? = null,
)

data class FileLogRequest(
    val fileName: String,
    val fileSize: Long? = null,
    val sourceUri: String? = null,
    val destinationUri: String? = null,
    val status: String? = null,
    val errorCode: String? = null,
    val transferredAt: LocalDateTime? = null,
)

// ========== Response DTOs ==========

data class UserResponse(
    val id: UUID,
    val email: String,
    val createdAt: LocalDateTime,
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long,
)

data class ScheduleResponse(
    val id: UUID,
    val name: String,
    val sourceUri: String,
    val destinationUri: String,
    val destinationType: String,
    val triggerHour: Int,
    val triggerMinute: Int,
    val mode: String,
    val fileFilter: String? = null,
    val isEnabled: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)

data class BackupRunResponse(
    val id: UUID,
    val scheduleId: UUID,
    val deviceId: UUID,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime? = null,
    val status: String,
    val totalFiles: Int,
    val movedFiles: Int,
    val failedFiles: Int,
    val bytesCopied: Long,
    val errorMessage: String? = null,
)

data class FileLogResponse(
    val id: UUID,
    val runId: UUID,
    val fileName: String,
    val fileSize: Long,
    val sourceUri: String,
    val destinationUri: String? = null,
    val status: String,
    val errorCode: String? = null,
    val transferredAt: LocalDateTime? = null,
)

data class DeviceResponse(
    val id: UUID,
    val deviceName: String,
    val lastSeenAt: LocalDateTime,
)

// ========== Paginated Response Wrapper ==========

data class PagedResponse<T>(
    val data: List<T>,
    val total: Int,
    val limit: Int = 20,
    val offset: Int = 0,
)

data class ErrorResponse(
    val code: String,
    val message: String,
    val details: List<ErrorDetail>? = null,
    val timestamp: LocalDateTime = LocalDateTime.now(),
)

data class ErrorDetail(
    val field: String,
    val message: String,
)
