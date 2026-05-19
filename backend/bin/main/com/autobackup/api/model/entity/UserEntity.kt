package com.autobackup.api.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

/**
 * JPA entity for users.
 */
@Entity
@Table(name = "users")
data class UserEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    
    @Column(nullable = false, unique = true)
    val email: String,
    
    @Column(nullable = false)
    val passwordHash: String,

    @Column(name = "refresh_token_hash")
    var refreshTokenHash: String? = null,
    
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
)
