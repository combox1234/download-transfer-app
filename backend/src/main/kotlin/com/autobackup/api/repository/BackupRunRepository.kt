package com.autobackup.api.repository

import com.autobackup.api.model.entity.BackupRunEntity
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

/**
 * Spring Data JPA repository for BackupRun entities.
 */
@Repository
interface BackupRunRepository : JpaRepository<BackupRunEntity, UUID> {
    fun findByScheduleId(scheduleId: UUID, pageable: Pageable): List<BackupRunEntity>
    fun findByDeviceId(deviceId: UUID, pageable: Pageable): List<BackupRunEntity>
    fun findAllByOrderByStartedAtDesc(pageable: Pageable): org.springframework.data.domain.Page<BackupRunEntity>
    fun findByDeviceIdOrderByStartedAtDesc(deviceId: UUID, pageable: Pageable): org.springframework.data.domain.Page<BackupRunEntity>
    fun findByStatusOrderByStartedAtDesc(status: String, pageable: Pageable): org.springframework.data.domain.Page<BackupRunEntity>
}
