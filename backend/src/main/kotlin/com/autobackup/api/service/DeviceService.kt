package com.autobackup.api.service

import org.springframework.stereotype.Service
import com.autobackup.api.exception.ResourceNotFoundException
import com.autobackup.api.exception.ValidationException
import com.autobackup.api.model.dto.DeviceResponse
import com.autobackup.api.model.entity.DeviceEntity
import com.autobackup.api.repository.DeviceRepository
import com.autobackup.api.repository.UserRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

/**
 * Service for device registration and management.
 */
@Service
@Transactional
class DeviceService {
    constructor(
        private val deviceRepository: DeviceRepository,
        private val userRepository: UserRepository,
    )

    fun registerDevice(deviceName: String, fcmToken: String? = null): DeviceResponse {
        val userId = getCurrentUserId()
        if (deviceName.isBlank()) throw ValidationException("Device name is required")
        
        val device = DeviceEntity(
            id = UUID.randomUUID(),
            userId = userId,
            deviceName = deviceName,
            deviceToken = UUID.randomUUID().toString(),
            lastSeenAt = Instant.now(),
            createdAt = Instant.now(),
            updatedAt = Instant.now(),
        )
        val savedDevice = deviceRepository.save(device)
        return savedDevice.toResponse()
    }

    fun listDevices(): List<DeviceResponse> {
        val userId = getCurrentUserId()
        return deviceRepository.findByUserId(userId).map { it.toResponse() }
    }

    fun deleteDevice(deviceId: UUID) {
        val userId = getCurrentUserId()
        val device = deviceRepository.findById(deviceId)
            .orElseThrow { ResourceNotFoundException("Device not found") }
        if (device.userId != userId) throw ValidationException("Unauthorized")
        deviceRepository.delete(device)
    }

    fun updateLastSeen(deviceId: UUID) {
        val device = deviceRepository.findById(deviceId)
            .orElseThrow { ResourceNotFoundException("Device not found") }
        device.lastSeenAt = Instant.now()
        device.updatedAt = Instant.now()
        deviceRepository.save(device)
    }

    private fun getCurrentUserId(): UUID {
        val authentication = SecurityContextHolder.getContext().authentication
        return UUID.fromString(authentication.name)
    }

    private fun DeviceEntity.toResponse() = DeviceResponse(
        id = id,
        userId = userId,
        deviceName = deviceName,
        deviceToken = deviceToken,
        lastSeenAt = lastSeenAt,
        createdAt = createdAt,
    )
}
