package com.autobackup.api.controller

import org.springframework.web.bind.annotation.*

/**
 * Backup run history endpoints.
 * - GET /api/backup-runs
 * - GET /api/backup-runs/{id}
 * - GET /api/backup-runs/{id}/files
 */
@RestController
@RequestMapping("/backup-runs")
class BackupRunController {
    
    // TODO: Implement read-only endpoints for backup history
    
    @GetMapping
    fun listRuns(): String {
        return "TODO: list backup runs"
    }
    
    @GetMapping("/{id}")
    fun getRun(@PathVariable id: String): String {
        return "TODO: get backup run $id"
    }
    
    @GetMapping("/{id}/files")
    fun getRunFiles(@PathVariable id: String): String {
        return "TODO: list files for run $id"
    }
}
