package com.autobackup.api.controller

import com.autobackup.api.model.dto.*
import com.autobackup.api.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Authentication endpoints.
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/refresh
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
class AuthController {
    constructor(private val authService: AuthService)

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<ApiResponse<UserResponse>> {
        val user = authService.register(request.email, request.password)
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse(success = true, data = user)
        )
    }
    
    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue tokens")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<ApiResponse<AuthResponse>> {
        val response = authService.login(request.email, request.password)
        return ResponseEntity.ok(ApiResponse(success = true, data = response))
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    fun refresh(@RequestBody request: RefreshRequest): ResponseEntity<ApiResponse<AuthResponse>> {
        val response = authService.refreshToken(request.refreshToken)
        return ResponseEntity.ok(ApiResponse(success = true, data = response))
    }
    
    @PostMapping("/refresh")
    fun refresh(): String {
        // TODO: Implement token refresh logic
        return "TODO: refresh endpoint"
    }
}
