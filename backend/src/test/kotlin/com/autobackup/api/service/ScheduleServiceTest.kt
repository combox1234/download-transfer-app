package com.autobackup.api.service

import com.autobackup.api.exception.ValidationException
import com.autobackup.api.model.dto.CreateScheduleRequest
import com.autobackup.api.model.entity.DeviceEntity
import com.autobackup.api.model.entity.UserEntity
import com.autobackup.api.repository.DeviceRepository
import com.autobackup.api.repository.ScheduleRepository
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.any
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDateTime
import java.util.*

@ExtendWith(MockitoExtension::class)
class ScheduleServiceTest {

    @Mock
    lateinit var scheduleRepository: ScheduleRepository

    @Mock
    lateinit var deviceRepository: DeviceRepository

    @InjectMocks
    lateinit var scheduleService: ScheduleService

    private val user = UserEntity(
        id = UUID.randomUUID(),
        email = "test@example.com",
        passwordHash = "hash",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )

    private val device = DeviceEntity(
        id = UUID.randomUUID(),
        user = user,
        deviceName = "Test Device",
        deviceToken = "token",
        lastSeenAt = LocalDateTime.now()
    )

    @BeforeEach
    fun setup() {
        // Mock current user
        // Note: For a real unit test testing validation, we only need to test the validation exception
        // before it hits the repository, so some mocks might not be strictly necessary if validation runs first.
    }

    @Test
    fun `createSchedule throws ValidationException when triggerHour is invalid`() {
        val request = CreateScheduleRequest(
            deviceId = device.id,
            sourceUri = "src",
            destUri = "dest",
            destType = "INTERNAL",
            triggerHour = 25, // Invalid hour
            triggerMinute = 30,
            mode = "COPY",
            isEnabled = true,
            fileFilter = null
        )

        assertThrows(ValidationException::class.java) {
            scheduleService.createSchedule(request)
        }
    }

    @Test
    fun `createSchedule throws ValidationException when triggerMinute is invalid`() {
        val request = CreateScheduleRequest(
            deviceId = device.id,
            sourceUri = "src",
            destUri = "dest",
            destType = "INTERNAL",
            triggerHour = 10,
            triggerMinute = 60, // Invalid minute
            mode = "COPY",
            isEnabled = true,
            fileFilter = null
        )

        assertThrows(ValidationException::class.java) {
            scheduleService.createSchedule(request)
        }
    }
}
