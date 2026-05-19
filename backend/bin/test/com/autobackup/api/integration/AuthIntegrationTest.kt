package com.autobackup.api.integration

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AuthIntegrationTest {

    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:14-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }

    @LocalServerPort
    var port: Int = 0

    @Autowired
    lateinit var rest: TestRestTemplate

    @Test
    fun registerLoginRefresh() {
        val base = "http://localhost:$port/api/auth"
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val registerBody = mapOf("email" to "ituser@example.com", "password" to "password123")
        val regResp = rest.postForEntity("${'$'}{base}/register", HttpEntity(registerBody, headers), Map::class.java)
        assertEquals(201, regResp.statusCodeValue)
        assertTrue((regResp.body?.get("success") as Boolean))

        val loginBody = mapOf("email" to "ituser@example.com", "password" to "password123")
        val loginResp = rest.postForEntity("${'$'}{base}/login", HttpEntity(loginBody, headers), Map::class.java)
        assertEquals(200, loginResp.statusCodeValue)
        val data = loginResp.body?.get("data") as Map<*, *>
        val accessToken = data["accessToken"] as String
        val refreshToken = data["refreshToken"] as String
        assertNotNull(accessToken)
        assertNotNull(refreshToken)

        val refreshBody = mapOf("refreshToken" to refreshToken)
        val refResp = rest.postForEntity("${'$'}{base}/refresh", HttpEntity(refreshBody, headers), Map::class.java)
        assertEquals(200, refResp.statusCodeValue)
        val refData = refResp.body?.get("data") as Map<*, *>
        val newAccess = refData["accessToken"] as String
        val newRefresh = refData["refreshToken"] as String
        assertNotEquals(accessToken, newAccess)
        assertNotEquals(refreshToken, newRefresh)
    }
    @Test
    fun registerDuplicateEmailThrows() {
        val base = "http://localhost:$port/api/auth"
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val registerBody = mapOf("email" to "dup@example.com", "password" to "password123")
        rest.postForEntity("$base/register", HttpEntity(registerBody, headers), Map::class.java)

        val regResp2 = rest.postForEntity("$base/register", HttpEntity(registerBody, headers), Map::class.java)
        assertEquals(409, regResp2.statusCode.value())
    }

    @Test
    fun loginWrongPasswordThrows() {
        val base = "http://localhost:$port/api/auth"
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val registerBody = mapOf("email" to "wrongpass@example.com", "password" to "password123")
        rest.postForEntity("$base/register", HttpEntity(registerBody, headers), Map::class.java)

        val loginBody = mapOf("email" to "wrongpass@example.com", "password" to "wrongpassword")
        val loginResp = rest.postForEntity("$base/login", HttpEntity(loginBody, headers), Map::class.java)
        assertEquals(401, loginResp.statusCode.value())
    }
}
