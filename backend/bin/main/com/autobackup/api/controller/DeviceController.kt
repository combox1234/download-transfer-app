package com.autobackup.api.controller

import org.springframework.web.bind.annotation.*

/**
 * Device registration and management endpoints.
 * - POST /api/devices/register
 * - GET /api/devices
 */
@RestController
@RequestMapping("/devices")
class DeviceController {
    
    // TODO: Implement device management endpoints
    
    @PostMapping("/register")
    fun registerDevice(): String {
        return "TODO: register device"
    }
    
    @GetMapping
    fun listDevices(): String {
        return "TODO: list devices"
    }
}
