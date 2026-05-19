package com.autobackup.api.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Database and persistence configuration.
 */
@Configuration
class DatabaseConfig {
    
    @Bean
    fun webMvcConfigurer(corsProperties: CorsProperties): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(*corsProperties.allowedOrigins.toTypedArray())
                    .allowedMethods(*corsProperties.allowedMethods.toTypedArray())
                    .allowedHeaders(*corsProperties.allowedHeaders.toTypedArray())
                    .allowCredentials(corsProperties.allowCredentials)
            }
        }
    }
    
    // TODO: Configure Flyway
    // TODO: Setup data source pooling
}
