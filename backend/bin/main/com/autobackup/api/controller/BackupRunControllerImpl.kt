package com.autobackup.api.controller

import com.autobackup.api.model.ApiResponse
import com.autobackup.api.model.dto.BackupRunResponse
import com.autobackup.api.model.dto.FileLogResponse
import com.autobackup.api.service.BackupRunService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/runs")
@Tag(name = "Backup Runs", description = "Backup run tracking endpoints")
@SecurityRequirement(name = "bearerAuth")
class BackupRunControllerImpl(
    private val backupRunService: BackupRunService,
) {

    @GetMapping
    @Operation(summary = "List backup runs")
    fun listRuns(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): ResponseEntity<ApiResponse<Page<BackupRunResponse>>> {
        val runs = backupRunService.listRuns(page, size)
        return ResponseEntity.ok(ApiResponse(success = true, data = runs))
    }

    @GetMapping("/{runId}")
    @Operation(summary = "Get a specific backup run")
    fun getRun(@PathVariable runId: UUID): ResponseEntity<ApiResponse<BackupRunResponse>> {
        val run = backupRunService.getRun(runId)
        return ResponseEntity.ok(ApiResponse(success = true, data = run))
    }

    @GetMapping("/{runId}/files")
    @Operation(summary = "Get file logs for a backup run")
    fun getRunFiles(
        @PathVariable runId: UUID,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): ResponseEntity<ApiResponse<Page<FileLogResponse>>> {
        val files = backupRunService.getRunFiles(runId, page, size)
        return ResponseEntity.ok(ApiResponse(success = true, data = files))
    }

    @GetMapping("/{runId}/failed")
    @Operation(summary = "Get failed file transfers")
    fun getFailedFiles(@PathVariable runId: UUID): ResponseEntity<ApiResponse<List<FileLogResponse>>> {
        val failed = backupRunService.getFailedFiles(runId)
        return ResponseEntity.ok(ApiResponse(success = true, data = failed))
    }

    @PostMapping
    @Operation(summary = "Create a new backup run")
    fun createRun(@RequestBody req: com.autobackup.api.model.dto.BackupRunRequest): ResponseEntity<ApiResponse<BackupRunResponse>> {
        val created = backupRunService.createBackupRun(req)
        return ResponseEntity.ok(ApiResponse(success = true, data = created))
    }

    @PostMapping("/{runId}/files")
    @Operation(summary = "Ingest file logs for a run (batch up to 100 records)")
    fun addFileLogs(@PathVariable runId: UUID, @RequestBody logs: List<com.autobackup.api.model.dto.FileLogRequest>): ResponseEntity<ApiResponse<List<FileLogResponse>>> {
        if (logs.size > 100) return ResponseEntity.badRequest().body(ApiResponse(success = false, error = "Max 100 file logs per request"))
        val saved = backupRunService.addFileLogs(runId, logs)
        return ResponseEntity.ok(ApiResponse(success = true, data = saved))
    }

    @PostMapping("/{runId}/failed/{fileLogId}/retry")
    @Operation(summary = "Mark a failed file for retry")
    fun retryFailedFile(@PathVariable runId: UUID, @PathVariable fileLogId: UUID): ResponseEntity<ApiResponse<String>> {
        backupRunService.markFailedForRetry(runId, fileLogId)
        return ResponseEntity.ok(ApiResponse(success = true, data = "scheduled"))
    }

    @PostMapping("/{runId}/failed/retry-all")
    @Operation(summary = "Mark all failed files in a run for retry")
    fun retryAllFailed(@PathVariable runId: UUID): ResponseEntity<ApiResponse<String>> {
        backupRunService.retryAllFailed(runId)
        return ResponseEntity.ok(ApiResponse(success = true, data = "scheduled"))
    }
}
