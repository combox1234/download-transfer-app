package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for tracking failed transfers that need retry.
 */
@Entity
@Table(name = "failed_transfers")
data class FailedTransferEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_log_id", nullable = false)
    val fileLog: FileLogEntity,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val sourceUri: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val destinationUri: String,
    
    @Column(nullable = false)
    val retryCount: Int = 0,
    
    @Column
    val lastRetryAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    val resolved: Boolean = false,
)
