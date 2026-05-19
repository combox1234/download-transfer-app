package com.autobackup.api.controller

import org.springframework.web.bind.annotation.*

/**
 * File transfer log endpoints.
 * - GET /api/file-logs
 */
@RestController
@RequestMapping("/file-logs")
class FileLogController {
    
    // TODO: Implement file transfer history endpoints
    
    @GetMapping
    fun listFileLogs(): String {
        return "TODO: list file logs"
    }
}
