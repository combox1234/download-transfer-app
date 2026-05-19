package com.autobackup.domain.usecase

import com.autobackup.domain.model.BackupMode
import com.autobackup.domain.model.BackupRun
import com.autobackup.domain.model.BackupRunStatus
import com.autobackup.domain.model.FileTransferStatus
import com.autobackup.domain.repository.BackupRunRepository
import com.autobackup.domain.repository.FileLogRepository
import java.time.LocalDateTime
import java.util.UUID

/**
 * UseCase for executing a backup job.
 * Orchestrates file discovery, transfer, and result logging.
 *
 * TODO: Implement cancellation via token
 * TODO: Add progress callbacks for UI updates
 * TODO: Implement parallel transfer with configurable thread pool
 */
class ExecuteBackupUseCase(
    private val backupRunRepository: BackupRunRepository,
    private val fileLogRepository: FileLogRepository,
) {
    
    /**
     * Execute a backup run.
     * @param scheduleId The schedule to execute
     * @param deviceId The device performing the backup
     * @return The completed BackupRun
     */
    suspend operator fun invoke(
        scheduleId: UUID,
        deviceId: UUID,
    ): BackupRun {
        // TODO: Implement backup orchestration
        //  1. Create BackupRun record with RUNNING status
        //  2. Scan source directory
        //  3. For each file:
        //     - Check against fileFilter
        //     - Check for duplicates
        //     - Transfer to destination
        //     - Log result
        //  4. Update BackupRun with counts and status
        //  5. Handle exceptions (out of space, permission denied, etc.)
        
        val run = BackupRun(
            id = UUID.randomUUID(),
            scheduleId = scheduleId,
            deviceId = deviceId,
            startedAt = LocalDateTime.now(),
            status = BackupRunStatus.RUNNING,
        )
        
        return backupRunRepository.createRun(run)
    }
}
