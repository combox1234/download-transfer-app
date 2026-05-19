package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for backup schedules.
 */
@Entity
@Table(name = "backup_schedules")
data class BackupScheduleEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: UserEntity,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    val device: DeviceEntity,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val sourceUri: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val destinationUri: String,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val destinationType: DestinationType,
    
    @Column(nullable = false)
    val triggerHour: Int,
    
    @Column(nullable = false)
    val triggerMinute: Int,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val mode: BackupMode,
    
    @Column(columnDefinition = "TEXT")
    val fileFilter: String? = null,
    
    @Column(nullable = false)
    val isEnabled: Boolean = true,
    
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now(),
)

enum class DestinationType {
    GOOGLE_DRIVE, ONE_DRIVE, DROPBOX, S3, LOCAL
}

enum class BackupMode {
    COPY, MOVE
}
