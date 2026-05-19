package com.autobackup.domain.repository

import com.autobackup.domain.model.BackupRun
import java.util.UUID

/**
 * Repository interface for backup run persistence and queries.
 * Implementation handles local caching and server synchronization.
 */
interface BackupRunRepository {
    
    /**
     * Get a backup run by ID.
     */
    suspend fun getRunById(runId: UUID): BackupRun?
    
    /**
     * List all runs for a schedule, sorted by start time descending.
     */
    suspend fun listRunsBySchedule(scheduleId: UUID, limit: Int = 50): List<BackupRun>
    
    /**
     * Create a new backup run record.
     */
    suspend fun createRun(run: BackupRun): BackupRun
    
    /**
     * Update an existing run (e.g., mark as completed, update counts).
     */
    suspend fun updateRun(run: BackupRun): BackupRun
    
    // TODO: Implement Repository<BackupRunRepository> pattern with caching
}
