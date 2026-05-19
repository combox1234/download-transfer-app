package com.autobackup.domain.model

import java.time.LocalDateTime
import java.util.UUID

/**
 * Result of transferring a single file.
 *
 * @property id Unique identifier
 * @property runId Reference to the backup run
 * @property fileName Original filename
 * @property fileSize Size in bytes
 * @property sourceUri Original location
 * @property destinationUri Final location
 * @property status SUCCESS, FAILED, SKIPPED
 * @property errorCode Why transfer failed (e.g., DESTINATION_FULL, PERMISSION_DENIED)
 * @property transferredAt Timestamp of completion
 */
data class FileTransferResult(
    val id: UUID,
    val runId: UUID,
    val fileName: String,
    val fileSize: Long,
    val sourceUri: String,
    val destinationUri: String? = null,
    val status: FileTransferStatus,
    val errorCode: String? = null,
    val transferredAt: LocalDateTime? = null,
)

enum class FileTransferStatus {
    SUCCESS,
    FAILED,
    SKIPPED
}
