package com.autobackup.api.repository

import com.autobackup.api.model.entity.DeviceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

/**
 * Spring Data JPA repository for Device entities.
 */
@Repository
interface DeviceRepository : JpaRepository<DeviceEntity, UUID> {
    fun findByUserId(userId: UUID): List<DeviceEntity>
}
