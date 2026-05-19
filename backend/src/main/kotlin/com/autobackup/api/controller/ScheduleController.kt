package com.autobackup.api.controller

import org.springframework.web.bind.annotation.*

/**
 * Schedule management endpoints.
 * - GET /api/schedules
 * - POST /api/schedules
 * - GET /api/schedules/{id}
 * - PUT /api/schedules/{id}
 * - DELETE /api/schedules/{id}
 */
@RestController
@RequestMapping("/schedules")
class ScheduleController {
    
    // TODO: Implement CRUD endpoints
    
    @GetMapping
    fun listSchedules(): String {
        return "TODO: list schedules"
    }
    
    @PostMapping
    fun createSchedule(): String {
        return "TODO: create schedule"
    }
    
    @GetMapping("/{id}")
    fun getSchedule(@PathVariable id: String): String {
        return "TODO: get schedule $id"
    }
    
    @PutMapping("/{id}")
    fun updateSchedule(@PathVariable id: String): String {
        return "TODO: update schedule $id"
    }
    
    @DeleteMapping("/{id}")
    fun deleteSchedule(@PathVariable id: String): String {
        return "TODO: delete schedule $id"
    }
}
