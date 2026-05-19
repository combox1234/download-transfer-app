package com.autobackup.domain.repository

import com.autobackup.domain.model.FileTransferResult
import java.util.UUID

/**
 * Repository for file transfer logs and retry tracking.
 */
interface FileLogRepository {
    
    /**
     * Log a successful file transfer.
     */
    suspend fun logSuccess(result: FileTransferResult)
    
    /**
     * Log a failed file transfer.
     */
    suspend fun logFailure(result: FileTransferResult)
    
    /**
     * Get all file logs for a backup run.
     */
    suspend fun getLogsByRun(runId: UUID): List<FileTransferResult>
    
    /**
     * Get failed transfers that need retry.
     */
    suspend fun getFailedTransfers(): List<FileTransferResult>
    
    // TODO: Implement retry backoff strategy
}
