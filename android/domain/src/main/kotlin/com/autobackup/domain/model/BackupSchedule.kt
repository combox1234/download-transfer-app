package com.autobackup.domain.model

import java.time.LocalDateTime
import java.util.UUID

/**
 * Represents a scheduled backup job.
 *
 * @property id Unique identifier
 * @property userId Owner of the schedule
 * @property deviceId Device this schedule runs on
 * @property name User-friendly name
 * @property sourceUri Content URI for backup source (Documents, Photos, etc.)
 * @property destinationUri URI of backup destination (Drive, OneDrive, S3, etc.)
 * @property destinationType Enum: GOOGLE_DRIVE, ONE_DRIVE, DROPBOX, S3, LOCAL
 * @property triggerHour Hour (0-23) to run backup
 * @property triggerMinute Minute (0-59) to run backup
 * @property mode COPY or MOVE
 * @property fileFilter Comma-separated glob patterns (*.pdf, *.jpg)
 * @property isEnabled Whether schedule is active
 * @property createdAt Timestamp
 * @property updatedAt Timestamp
 */
data class BackupSchedule(
    val id: UUID,
    val userId: UUID,
    val deviceId: UUID,
    val name: String,
    val sourceUri: String,
    val destinationUri: String,
    val destinationType: DestinationType,
    val triggerHour: Int,
    val triggerMinute: Int,
    val mode: BackupMode,
    val fileFilter: String? = null,
    val isEnabled: Boolean = true,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
) {
    init {
        require(triggerHour in 0..23) { "triggerHour must be 0-23" }
        require(triggerMinute in 0..59) { "triggerMinute must be 0-59" }
        require(name.isNotBlank()) { "name cannot be blank" }
    }
}

enum class DestinationType {
    GOOGLE_DRIVE,
    ONE_DRIVE,
    DROPBOX,
    S3,
    LOCAL
}

enum class BackupMode {
    COPY,    // Duplicate files
    MOVE     // Move files (delete from source)
}
