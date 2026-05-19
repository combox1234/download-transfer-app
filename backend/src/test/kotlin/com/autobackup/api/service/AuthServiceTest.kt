package com.autobackup.api.service

import com.autobackup.api.exception.DuplicateEmailException
import com.autobackup.api.exception.UnauthorizedException
import com.autobackup.api.exception.ValidationException
import com.autobackup.api.model.entity.UserEntity
import com.autobackup.api.repository.UserRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles
import java.time.Instant
import java.util.*

@DataJpaTest
@Import(AuthService::class, BCryptPasswordEncoder::class)
@ActiveProfiles("test")
class AuthServiceTest @Autowired constructor(
    private val authService: AuthService,
    private val userRepository: UserRepository,
    private val passwordEncoder: BCryptPasswordEncoder,
) {

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }

    @Test
    fun `register should create user successfully`() {
        // Arrange
        val email = "test@example.com"
        val password = "securePassword123"

        // Act
        val response = authService.register(email, password)

        // Assert
        assertNotNull(response.id)
        assertEquals(email, response.email)
        assertNotNull(response.createdAt)

        // Verify in database
        val savedUser = userRepository.findByEmail(email)
        assertNotNull(savedUser)
        assertTrue(passwordEncoder.matches(password, savedUser!!.passwordHash))
    }

    @Test
    fun `register should throw on blank email`() {
        // Act & Assert
        assertThrows<ValidationException> {
            authService.register("", "password123")
        }
    }

    @Test
    fun `register should throw on short password`() {
        // Act & Assert
        assertThrows<ValidationException> {
            authService.register("test@example.com", "short")
        }
    }

    @Test
    fun `register should throw on duplicate email`() {
        // Arrange
        val email = "test@example.com"
        authService.register(email, "password123")

        // Act & Assert
        assertThrows<DuplicateEmailException> {
            authService.register(email, "otherPassword123")
        }
    }

    @Test
    fun `login should return tokens for valid credentials`() {
        // Arrange
        val email = "test@example.com"
        val password = "securePassword123"
        authService.register(email, password)

        // Act
        val response = authService.login(email, password)

        // Assert
        assertNotNull(response.accessToken)
        assertNotNull(response.refreshToken)
        assertEquals(900000, response.expiresIn) // 15 minutes
        assertEquals(email, response.user.email)
    }

    @Test
    fun `login should throw on wrong password`() {
        // Arrange
        val email = "test@example.com"
        authService.register(email, "securePassword123")

        // Act & Assert
        assertThrows<UnauthorizedException> {
            authService.login(email, "wrongPassword")
        }
    }

    @Test
    fun `login should throw on non-existent user`() {
        // Act & Assert
        assertThrows<UnauthorizedException> {
            authService.login("nonexistent@example.com", "anyPassword")
        }
    }
}
