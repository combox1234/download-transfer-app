package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for backup run records.
 */
@Entity
@Table(name = "backup_runs")
data class BackupRunEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    val schedule: BackupScheduleEntity,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    val device: DeviceEntity,
    
    @Column(nullable = false)
    val startedAt: LocalDateTime,
    
    @Column
    val endedAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val status: BackupRunStatus,
    
    @Column(nullable = false)
    val totalFiles: Int = 0,
    
    @Column(nullable = false)
    val movedFiles: Int = 0,
    
    @Column(nullable = false)
    val failedFiles: Int = 0,
    
    @Column(nullable = false)
    val bytesCopied: Long = 0L,
    
    @Column(columnDefinition = "TEXT")
    val errorMessage: String? = null,
)

enum class BackupRunStatus {
    PENDING, RUNNING, SUCCESS, FAILED, PARTIAL
}
