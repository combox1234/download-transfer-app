package com.autobackup.api.model

import java.time.Instant

/**
 * Generic API response wrapper for all endpoints.
 */
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null,
    val timestamp: Instant = Instant.now(),
)
