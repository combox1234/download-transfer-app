package com.autobackup.domain.usecase

import com.autobackup.domain.model.BackupSchedule
import com.autobackup.domain.repository.ScheduleRepository
import java.util.UUID

/**
 * UseCase for creating or updating a backup schedule.
 * Validates inputs and persists to repository.
 *
 * TODO: Add validation for destination accessibility
 * TODO: Implement conflict resolution (local vs server)
 */
class ScheduleBackupUseCase(
    private val scheduleRepository: ScheduleRepository,
) {
    
    /**
     * Create a new backup schedule.
     */
    suspend fun createSchedule(schedule: BackupSchedule): BackupSchedule {
        // TODO: Validate schedule (source/destination URIs accessible, cron is valid)
        return scheduleRepository.createSchedule(schedule)
    }
    
    /**
     * Update an existing schedule.
     */
    suspend fun updateSchedule(schedule: BackupSchedule): BackupSchedule {
        // TODO: Invalidate cached backup history if schedule changes
        return scheduleRepository.updateSchedule(schedule)
    }
    
    /**
     * Delete a schedule.
     */
    suspend fun deleteSchedule(scheduleId: UUID): Boolean {
        return scheduleRepository.deleteSchedule(scheduleId)
    }
}
