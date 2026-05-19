package com.autobackup.api.controller

import com.autobackup.api.model.ApiResponse
import com.autobackup.api.model.dto.StatsResponse
import com.autobackup.api.service.StatsService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/stats")
@Tag(name = "Stats", description = "Dashboard statistics endpoints")
@SecurityRequirement(name = "bearerAuth")
class StatsController(
    private val statsService: StatsService,
) {

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary statistics")
    fun getSummary(): ResponseEntity<ApiResponse<StatsResponse>> {
        val stats = statsService.getStats()
        return ResponseEntity.ok(ApiResponse(success = true, data = stats))
    }
}
