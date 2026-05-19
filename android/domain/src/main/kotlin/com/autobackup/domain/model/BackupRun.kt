package com.autobackup.domain.model

import java.time.LocalDateTime
import java.util.UUID

/**
 * Represents a single backup execution.
 *
 * @property id Unique identifier
 * @property scheduleId Reference to the schedule that triggered this run
 * @property deviceId Device executing the backup
 * @property startedAt When the backup started
 * @property endedAt When the backup completed (null if running)
 * @property status PENDING, RUNNING, SUCCESS, FAILED, PARTIAL
 * @property totalFiles Number of files in source
 * @property movedFiles Number of successfully transferred files
 * @property failedFiles Number of files that failed
 * @property bytesCopied Total bytes transferred
 * @property errorMessage Human-readable error if status is FAILED
 */
data class BackupRun(
    val id: UUID,
    val scheduleId: UUID,
    val deviceId: UUID,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime? = null,
    val status: BackupRunStatus,
    val totalFiles: Int = 0,
    val movedFiles: Int = 0,
    val failedFiles: Int = 0,
    val bytesCopied: Long = 0L,
    val errorMessage: String? = null,
)

enum class BackupRunStatus {
    PENDING,   // Queued, not started
    RUNNING,   // Currently executing
    SUCCESS,   // All files transferred
    FAILED,    // Unable to complete, errors occurred
    PARTIAL    // Some files transferred, some failed
}
