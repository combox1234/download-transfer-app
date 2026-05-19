package com.autobackup.domain.model

import java.util.UUID

/**
 * Represents a configured backup destination (cloud storage service).
 * Used to abstract away provider-specific details from domain logic.
 */
data class BackupDestination(
    val id: UUID,
    val type: DestinationType,
    val displayName: String,
    val credentials: String, // Encrypted, provider-specific format
    val isConfigured: Boolean = false,
)
