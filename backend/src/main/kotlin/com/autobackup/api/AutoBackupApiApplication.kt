package com.autobackup.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Spring Boot application entry point.
 */
@SpringBootApplication
class AutoBackupApiApplication

fun main(args: Array<String>) {
    runApplication<AutoBackupApiApplication>(*args)
}
