package com.autobackup.api.controller

import com.autobackup.api.model.ApiResponse
import com.autobackup.api.model.dto.DeviceRegistrationRequest
import com.autobackup.api.model.dto.DeviceResponse
import com.autobackup.api.service.DeviceService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/devices")
@Tag(name = "Devices", description = "Device management endpoints")
@SecurityRequirement(name = "bearerAuth")
class DeviceController(
    private val deviceService: DeviceService,
) {

    @PostMapping("/register")
    @Operation(summary = "Register a new device")
    fun registerDevice(@RequestBody request: DeviceRegistrationRequest): ResponseEntity<ApiResponse<DeviceResponse>> {
        val device = deviceService.registerDevice(request.deviceName, request.fcmToken)
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse(success = true, data = device)
        )
    }

    @GetMapping
    @Operation(summary = "List all devices for authenticated user")
    fun listDevices(): ResponseEntity<ApiResponse<List<DeviceResponse>>> {
        val devices = deviceService.listDevices()
        return ResponseEntity.ok(ApiResponse(success = true, data = devices))
    }

    @DeleteMapping("/{deviceId}")
    @Operation(summary = "Delete a device")
    fun deleteDevice(@PathVariable deviceId: UUID): ResponseEntity<ApiResponse<Unit>> {
        deviceService.deleteDevice(deviceId)
        return ResponseEntity.ok(ApiResponse(success = true))
    }
}
