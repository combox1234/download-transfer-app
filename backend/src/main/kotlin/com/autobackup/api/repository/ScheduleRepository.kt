package com.autobackup.api.repository

import com.autobackup.api.model.entity.BackupScheduleEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

/**
 * Spring Data JPA repository for BackupSchedule entities.
 */
@Repository
interface ScheduleRepository : JpaRepository<BackupScheduleEntity, UUID> {
    fun findByUserId(userId: UUID): List<BackupScheduleEntity>
    fun findByDeviceId(deviceId: UUID): List<BackupScheduleEntity>
}
