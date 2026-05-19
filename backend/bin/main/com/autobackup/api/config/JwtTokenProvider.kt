package com.autobackup.api.config

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*

/**
 * JWT token provider for generating and validating tokens.
 */
@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}") private val jwtSecret: String,
    @Value("\${jwt.expiration:900000}") private val accessTokenExpiration: Long,
    @Value("\${jwt.refresh-expiration:2592000000}") private val refreshTokenExpiration: Long,
) {
    private val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

    /**
     * Generate access token (15 minutes).
     */
    fun generateAccessToken(userId: String, email: String): String {
        return Jwts.builder()
            .setSubject(userId)
            .claim("email", email)
            .claim("type", "access")
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
    }

    /**
     * Generate refresh token (30 days).
     */
    fun generateRefreshToken(userId: String): String {
        return Jwts.builder()
            .setSubject(userId)
            .claim("type", "refresh")
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + refreshTokenExpiration))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
    }

    /**
     * Validate token and extract userId.
     */
    fun validateAndGetUserId(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .body
            
            if (claims["type"] == "access") {
                claims.subject
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Validate refresh token and extract userId.
     */
    fun validateRefreshTokenAndGetUserId(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .body
            
            if (claims["type"] == "refresh") {
                claims.subject
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    fun getEmailFromToken(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .body
            claims["email"] as? String
        } catch (e: Exception) {
            null
        }
    }
}
