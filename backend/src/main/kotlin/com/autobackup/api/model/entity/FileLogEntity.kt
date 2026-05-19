package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for file transfer logs.
 */
@Entity
@Table(name = "file_logs")
data class FileLogEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_id", nullable = false)
    val run: BackupRunEntity,
    
    @Column(nullable = false)
    val fileName: String,
    
    @Column(nullable = false)
    val fileSize: Long,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val sourceUri: String,
    
    @Column(columnDefinition = "TEXT")
    val destinationUri: String? = null,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val status: FileTransferStatus,
    
    @Column
    val errorCode: String? = null,
    
    @Column
    val transferredAt: LocalDateTime? = null,
)

enum class FileTransferStatus {
    SUCCESS, FAILED, SKIPPED
}
