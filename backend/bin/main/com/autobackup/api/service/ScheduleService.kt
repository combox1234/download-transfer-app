package com.autobackup.api.service

import com.autobackup.api.exception.ResourceNotFoundException
import com.autobackup.api.exception.ValidationException
import com.autobackup.api.model.dto.CreateScheduleRequest
import com.autobackup.api.model.dto.ScheduleResponse
import com.autobackup.api.model.dto.UpdateScheduleRequest
import com.autobackup.api.model.entity.BackupScheduleEntity
import com.autobackup.api.repository.BackupScheduleRepository
import com.autobackup.api.repository.DeviceRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

/**
 * Service for schedule management (CRUD).
 */
@Service
@Transactional
class ScheduleService {
    constructor(
        private val scheduleRepository: BackupScheduleRepository,
        private val deviceRepository: DeviceRepository,
    )

    fun createSchedule(request: CreateScheduleRequest): ScheduleResponse {
        validateScheduleInput(request)
        val userId = getCurrentUserId()
        val device = deviceRepository.findById(request.deviceId)
            .orElseThrow { ResourceNotFoundException("Device not found") }
        if (device.userId != userId) throw ValidationException("Unauthorized")
        
        val schedule = BackupScheduleEntity(
            id = UUID.randomUUID(),
            userId = userId,
            deviceId = request.deviceId,
            sourceUri = request.sourceUri,
            destinationUri = request.destinationUri,
            destinationType = request.destinationType,
            triggerHour = request.triggerHour,
            triggerMinute = request.triggerMinute,
            mode = request.mode,
            fileFilter = request.fileFilter,
            isEnabled = request.isEnabled,
            createdAt = Instant.now(),
            updatedAt = Instant.now(),
        )
        val savedSchedule = scheduleRepository.save(schedule)
        return savedSchedule.toResponse()
    }

    fun listSchedules(): List<ScheduleResponse> {
        val userId = getCurrentUserId()
        return scheduleRepository.findByUserId(userId).map { it.toResponse() }
    }

    fun getSchedule(scheduleId: UUID): ScheduleResponse {
        val userId = getCurrentUserId()
        val schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow { ResourceNotFoundException("Schedule not found") }
        if (schedule.userId != userId) throw ValidationException("Unauthorized")
        return schedule.toResponse()
    }

    fun updateSchedule(scheduleId: UUID, request: UpdateScheduleRequest): ScheduleResponse {
        val userId = getCurrentUserId()
        val schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow { ResourceNotFoundException("Schedule not found") }
        if (schedule.userId != userId) throw ValidationException("Unauthorized")
        
        request.sourceUri?.let { schedule.sourceUri = it }
        request.destinationUri?.let { schedule.destinationUri = it }
        request.destinationType?.let { schedule.destinationType = it }
        request.triggerHour?.let {
            if (it !in 0..23) throw ValidationException("triggerHour 0-23")
            schedule.triggerHour = it
        }
        request.triggerMinute?.let {
            if (it !in 0..59) throw ValidationException("triggerMinute 0-59")
            schedule.triggerMinute = it
        }
        request.mode?.let { schedule.mode = it }
        request.fileFilter?.let { schedule.fileFilter = it }
        request.isEnabled?.let { schedule.isEnabled = it }
        schedule.updatedAt = Instant.now()
        val updated = scheduleRepository.save(schedule)
        return updated.toResponse()
    }

    fun deleteSchedule(scheduleId: UUID) {
        val userId = getCurrentUserId()
        val schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow { ResourceNotFoundException("Schedule not found") }
        if (schedule.userId != userId) throw ValidationException("Unauthorized")
        scheduleRepository.delete(schedule)
    }

    fun toggleSchedule(scheduleId: UUID): ScheduleResponse {
        val userId = getCurrentUserId()
        val schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow { ResourceNotFoundException("Schedule not found") }
        if (schedule.userId != userId) throw ValidationException("Unauthorized")
        schedule.isEnabled = !schedule.isEnabled
        schedule.updatedAt = Instant.now()
        val updated = scheduleRepository.save(schedule)
        return updated.toResponse()
    }

    private fun validateScheduleInput(request: CreateScheduleRequest) {
        if (request.sourceUri.isBlank()) throw ValidationException("sourceUri required")
        if (request.destinationUri.isBlank()) throw ValidationException("destinationUri required")
        if (request.triggerHour !in 0..23) throw ValidationException("triggerHour 0-23")
        if (request.triggerMinute !in 0..59) throw ValidationException("triggerMinute 0-59")
    }

    private fun getCurrentUserId(): UUID {
        val authentication = SecurityContextHolder.getContext().authentication
        return UUID.fromString(authentication.name)
    }

    private fun BackupScheduleEntity.toResponse() = ScheduleResponse(
        id = id,
        deviceId = deviceId,
        sourceUri = sourceUri,
        destinationUri = destinationUri,
        destinationType = destinationType,
        triggerHour = triggerHour,
        triggerMinute = triggerMinute,
        mode = mode,
        fileFilter = fileFilter,
        isEnabled = isEnabled,
        createdAt = createdAt,
        updatedAt = updatedAt,
    )
}
