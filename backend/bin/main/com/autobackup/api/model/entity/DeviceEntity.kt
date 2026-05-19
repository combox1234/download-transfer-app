package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for registered devices.
 */
@Entity
@Table(name = "devices")
data class DeviceEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: UserEntity,
    
    @Column(nullable = false)
    val deviceName: String,
    
    @Column(nullable = false)
    val deviceToken: String,
    
    @Column(nullable = false)
    val lastSeenAt: LocalDateTime = LocalDateTime.now(),
)
