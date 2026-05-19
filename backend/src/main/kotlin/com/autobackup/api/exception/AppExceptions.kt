package com.autobackup.api.exception

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import com.autobackup.api.model.dto.ErrorResponse
import com.autobackup.api.model.dto.ErrorDetail

/**
 * Global exception handler for REST API.
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)
    
    @ExceptionHandler(AppException::class)
    fun handleAppException(ex: AppException, request: WebRequest): ResponseEntity<ErrorResponse> {
        val response = ErrorResponse(
            code = ex.code,
            message = ex.message ?: "An error occurred",
            details = ex.details
        )
        return ResponseEntity(response, ex.status)
    }
    
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException, request: WebRequest): ResponseEntity<ErrorResponse> {
        val fieldErrors = ex.bindingResult.fieldErrors.map { fe: FieldError ->
            ErrorDetail(field = fe.field, message = fe.defaultMessage ?: "Invalid value")
        }
        val response = ErrorResponse(
            code = "VALIDATION_ERROR",
            message = "Validation failed",
            details = fieldErrors
        )
        return ResponseEntity(response, HttpStatus.BAD_REQUEST)
    }
    
    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception, request: WebRequest): ResponseEntity<ErrorResponse> {
        // Log full stack trace for diagnostics, but return sanitized message to clients
        logger.error("Unhandled exception: ${'$'}{ex.message}", ex)
        val response = ErrorResponse(
            code = "INTERNAL_ERROR",
            message = "An internal server error occurred"
        )
        return ResponseEntity(response, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException, request: WebRequest): ResponseEntity<ErrorResponse> {
        val response = ErrorResponse(
            code = "BAD_REQUEST",
            message = ex.message ?: "Invalid argument"
        )
        return ResponseEntity(response, HttpStatus.BAD_REQUEST)
    }
}

/**
 * Base exception for application errors.
 */
open class AppException(
    val code: String,
    message: String,
    val status: HttpStatus = HttpStatus.BAD_REQUEST,
    val details: List<ErrorDetail>? = null,
) : Exception(message)

class ValidationException(message: String, details: List<ErrorDetail>? = null) :
    AppException("VALIDATION_ERROR", message, HttpStatus.BAD_REQUEST, details)

class UnauthorizedException(message: String = "Unauthorized") :
    AppException("UNAUTHORIZED", message, HttpStatus.UNAUTHORIZED)

class ForbiddenException(message: String = "Forbidden") :
    AppException("FORBIDDEN", message, HttpStatus.FORBIDDEN)

class NotFoundException(message: String) :
    AppException("NOT_FOUND", message, HttpStatus.NOT_FOUND)

class DuplicateEmailException(email: String) :
    AppException("DUPLICATE_EMAIL", "Email $email already registered", HttpStatus.CONFLICT)
    class ResourceNotFoundException(message: String) :
        AppException("RESOURCE_NOT_FOUND", message, HttpStatus.NOT_FOUND)

class InsufficientStorageException() :
    AppException("DESTINATION_FULL", "Insufficient storage on destination", HttpStatus.INSUFFICIENT_STORAGE)
