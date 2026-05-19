package com.autobackup.api.service

import com.autobackup.api.config.JwtTokenProvider
import com.autobackup.api.exception.DuplicateEmailException
import com.autobackup.api.exception.UnauthorizedException
import com.autobackup.api.exception.ValidationException
import com.autobackup.api.model.dto.AuthResponse
import com.autobackup.api.model.dto.UserResponse
import com.autobackup.api.model.entity.UserEntity
import com.autobackup.api.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

/**
 * Service for user authentication and token management.
 * 
 * TODO: Implement
 *  - User registration with password hashing
 *  - Login with JWT token generation
 *  - Token refresh logic
 *  - Token validation and extraction
 */
@Service
@Transactional
class AuthService {
    constructor(
        private val userRepository: UserRepository,
        private val passwordEncoder: PasswordEncoder,
        private val jwtTokenProvider: JwtTokenProvider,
    )

    /**
     * Register a new user account.
     */
    fun register(email: String, password: String): UserResponse {
        if (email.isBlank() || password.isBlank()) {
            throw ValidationException("Email and password are required")
        }
        if (!isValidEmail(email)) {
            throw ValidationException("Invalid email format")
        }
        if (password.length < 8) {
            throw ValidationException("Password must be at least 8 characters")
        }
        if (userRepository.existsByEmail(email)) {
            throw DuplicateEmailException("Email already registered: $email")
        }

        val user = UserEntity(
            id = UUID.randomUUID(),
            email = email,
            passwordHash = passwordEncoder.encode(password),
            createdAt = java.time.LocalDateTime.now(),
            updatedAt = java.time.LocalDateTime.now(),
        )
        val savedUser = userRepository.save(user)
        return UserResponse(
            id = savedUser.id,
            email = savedUser.email,
            createdAt = savedUser.createdAt,
        )
    }

    /**
     * Authenticate user and issue tokens.
     */
    fun login(email: String, password: String): AuthResponse {
        val user = userRepository.findByEmail(email)
            ?: throw UnauthorizedException("Invalid email or password")
        if (!passwordEncoder.matches(password, user.passwordHash)) {
            throw UnauthorizedException("Invalid email or password")
        }

        val accessToken = jwtTokenProvider.generateAccessToken(user.id.toString(), user.email)
        val refreshToken = jwtTokenProvider.generateRefreshToken(user.id.toString())
        // store hashed refresh token
        val refreshHash = passwordEncoder.encode(refreshToken)
        user.refreshTokenHash = refreshHash
        user.updatedAt = java.time.LocalDateTime.now()
        userRepository.save(user)
        return AuthResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            expiresIn = 900000,
            user = UserResponse(id = user.id, email = user.email, createdAt = user.createdAt),
        )
    }

    /**
     * Refresh access token.
     */
    fun refreshToken(refreshToken: String): AuthResponse {
        val userId = jwtTokenProvider.validateRefreshTokenAndGetUserId(refreshToken)
            ?: throw UnauthorizedException("Invalid or expired refresh token")
        val user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow { UnauthorizedException("User not found") }

        // verify the provided refresh token matches stored hash
        val storedHash = user.refreshTokenHash
        if (storedHash == null || !passwordEncoder.matches(refreshToken, storedHash)) {
            throw UnauthorizedException("Invalid refresh token")
        }

        val newAccessToken = jwtTokenProvider.generateAccessToken(user.id.toString(), user.email)
        val newRefreshToken = jwtTokenProvider.generateRefreshToken(user.id.toString())
        // rotate refresh token and store hash
        val newRefreshHash = passwordEncoder.encode(newRefreshToken)
        user.refreshTokenHash = newRefreshHash
        user.updatedAt = java.time.LocalDateTime.now()
        userRepository.save(user)
        return AuthResponse(
            accessToken = newAccessToken,
            refreshToken = newRefreshToken,
            expiresIn = 900000,
            user = UserResponse(id = user.id, email = user.email, createdAt = user.createdAt),
        )
    }

    private fun isValidEmail(email: String): Boolean {
        val emailRegex = """^[A-Za-z0-9+_.-]+@(.+)$""".toRegex()
        return emailRegex.matches(email)
    }
}
