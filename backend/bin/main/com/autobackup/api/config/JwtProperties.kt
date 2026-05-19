package com.autobackup.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

/**
 * JWT configuration properties loaded from application.yml
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
class JwtProperties {
    lateinit var secret: String
    var expiration: Long = 900000  // 15 minutes
    var refreshExpiration: Long = 604800000  // 7 days
}
