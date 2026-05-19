package com.autobackup.domain.repository

import com.autobackup.domain.model.BackupSchedule
import java.util.UUID

/**
 * Repository interface for backup schedule management.
 * Handles CRUD operations for backup schedules.
 */
interface ScheduleRepository {
    
    /**
     * Get all active schedules for this device.
     */
    suspend fun getAllSchedules(): List<BackupSchedule>
    
    /**
     * Get a schedule by ID.
     */
    suspend fun getScheduleById(id: UUID): BackupSchedule?
    
    /**
     * Create a new schedule.
     */
    suspend fun createSchedule(schedule: BackupSchedule): BackupSchedule
    
    /**
     * Update an existing schedule.
     */
    suspend fun updateSchedule(schedule: BackupSchedule): BackupSchedule
    
    /**
     * Delete a schedule by ID.
     */
    suspend fun deleteSchedule(id: UUID): Boolean
    
    /**
     * Sync schedules with backend server.
     */
    suspend fun syncSchedules(): List<BackupSchedule>
    
    // TODO: Add conflict resolution strategy (local vs server priority)
}
