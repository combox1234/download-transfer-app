package com.autobackup.api

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@TestConfiguration
class TestConfig {

    @Bean
    fun testObjectMapper(): ObjectMapper = ObjectMapper()

    @Bean
    fun testPasswordEncoder(): BCryptPasswordEncoder = BCryptPasswordEncoder(12)
}
