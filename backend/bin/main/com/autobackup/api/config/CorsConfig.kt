package com.autobackup.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

/**
 * CORS configuration properties
 */
@Configuration
@ConfigurationProperties(prefix = "cors")
class CorsProperties {
    var allowedOrigins: List<String> = emptyList()
    var allowedMethods: List<String> = listOf("GET", "POST", "PUT", "DELETE")
    var allowedHeaders: List<String> = listOf("*")
    var allowCredentials: Boolean = true
}
