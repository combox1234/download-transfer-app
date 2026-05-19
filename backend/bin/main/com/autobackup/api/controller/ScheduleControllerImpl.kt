package com.autobackup.api.controller

import com.autobackup.api.model.ApiResponse
import com.autobackup.api.model.dto.CreateScheduleRequest
import com.autobackup.api.model.dto.ScheduleResponse
import com.autobackup.api.model.dto.UpdateScheduleRequest
import com.autobackup.api.service.ScheduleService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/schedules")
@Tag(name = "Schedules", description = "Backup schedule endpoints")
@SecurityRequirement(name = "bearerAuth")
class ScheduleControllerImpl(
    private val scheduleService: ScheduleService,
) {

    @PostMapping
    @Operation(summary = "Create a new backup schedule")
    fun createSchedule(@RequestBody request: CreateScheduleRequest): ResponseEntity<ApiResponse<ScheduleResponse>> {
        val schedule = scheduleService.createSchedule(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse(success = true, data = schedule)
        )
    }

    @GetMapping
    @Operation(summary = "List all schedules for user")
    fun listSchedules(): ResponseEntity<ApiResponse<List<ScheduleResponse>>> {
        val schedules = scheduleService.listSchedules()
        return ResponseEntity.ok(ApiResponse(success = true, data = schedules))
    }

    @GetMapping("/{scheduleId}")
    @Operation(summary = "Get a specific schedule")
    fun getSchedule(@PathVariable scheduleId: UUID): ResponseEntity<ApiResponse<ScheduleResponse>> {
        val schedule = scheduleService.getSchedule(scheduleId)
        return ResponseEntity.ok(ApiResponse(success = true, data = schedule))
    }

    @PutMapping("/{scheduleId}")
    @Operation(summary = "Update a schedule")
    fun updateSchedule(
        @PathVariable scheduleId: UUID,
        @RequestBody request: UpdateScheduleRequest,
    ): ResponseEntity<ApiResponse<ScheduleResponse>> {
        val schedule = scheduleService.updateSchedule(scheduleId, request)
        return ResponseEntity.ok(ApiResponse(success = true, data = schedule))
    }

    @DeleteMapping("/{scheduleId}")
    @Operation(summary = "Delete a schedule")
    fun deleteSchedule(@PathVariable scheduleId: UUID): ResponseEntity<ApiResponse<Unit>> {
        scheduleService.deleteSchedule(scheduleId)
        return ResponseEntity.ok(ApiResponse(success = true))
    }

    @PatchMapping("/{scheduleId}/toggle")
    @Operation(summary = "Toggle schedule enabled/disabled")
    fun toggleSchedule(@PathVariable scheduleId: UUID): ResponseEntity<ApiResponse<ScheduleResponse>> {
        val schedule = scheduleService.toggleSchedule(scheduleId)
        return ResponseEntity.ok(ApiResponse(success = true, data = schedule))
    }
}
