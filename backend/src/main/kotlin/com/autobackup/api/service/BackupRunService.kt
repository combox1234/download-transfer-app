package com.autobackup.api.service

import com.autobackup.api.exception.ResourceNotFoundException
import com.autobackup.api.model.dto.BackupRunRequest
import com.autobackup.api.model.dto.BackupRunResponse
import com.autobackup.api.model.dto.FileLogRequest
import com.autobackup.api.model.dto.FileLogResponse
import com.autobackup.api.model.entity.BackupRunEntity
import com.autobackup.api.model.entity.FileLogEntity
import com.autobackup.api.model.entity.FailedTransferEntity
import com.autobackup.api.repository.BackupRunRepository
import com.autobackup.api.repository.FileLogRepository
import com.autobackup.api.repository.FailedTransferRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class BackupRunService(
    private val backupRunRepository: BackupRunRepository,
    private val fileLogRepository: FileLogRepository,
    private val failedTransferRepository: FailedTransferRepository,
    private val scheduleRepository: com.autobackup.api.repository.ScheduleRepository,
    private val deviceRepository: com.autobackup.api.repository.DeviceRepository,
) {

    fun createBackupRun(request: BackupRunRequest): BackupRunResponse {
        val schedule = scheduleRepository.findById(request.scheduleId)
            .orElseThrow { ResourceNotFoundException("Schedule not found") }
        val device = deviceRepository.findById(request.deviceId)
            .orElseThrow { ResourceNotFoundException("Device not found") }

        val run = BackupRunEntity(
            id = UUID.randomUUID(),
            schedule = schedule,
            device = device,
            startedAt = request.startedAt ?: LocalDateTime.now(),
            endedAt = null,
            status = com.autobackup.api.model.entity.BackupRunStatus.valueOf((request.status ?: "RUNNING").uppercase()),
            totalFiles = 0,
            movedFiles = 0,
            failedFiles = 0,
            bytesCopied = 0L,
            errorMessage = null,
        )
        val saved = backupRunRepository.save(run)
        return BackupRunResponse(
            id = saved.id,
            scheduleId = saved.schedule.id,
            deviceId = saved.device.id,
            startedAt = saved.startedAt,
            endedAt = saved.endedAt,
            status = saved.status.name,
            totalFiles = saved.totalFiles,
            movedFiles = saved.movedFiles,
            failedFiles = saved.failedFiles,
            bytesCopied = saved.bytesCopied,
            errorMessage = saved.errorMessage,
        )
    }

    fun updateBackupRun(runId: UUID, status: String, finishedAt: LocalDateTime?) : BackupRunResponse {
        val run = backupRunRepository.findById(runId).orElseThrow { ResourceNotFoundException("Backup run not found") }
        val updated = run.copy(
            status = com.autobackup.api.model.entity.BackupRunStatus.valueOf(status.uppercase()),
            endedAt = finishedAt,
        )
        val saved = backupRunRepository.save(updated)
        return BackupRunResponse(
            id = saved.id,
            scheduleId = saved.schedule.id,
            deviceId = saved.device.id,
            startedAt = saved.startedAt,
            endedAt = saved.endedAt,
            status = saved.status.name,
            totalFiles = saved.totalFiles,
            movedFiles = saved.movedFiles,
            failedFiles = saved.failedFiles,
            bytesCopied = saved.bytesCopied,
            errorMessage = saved.errorMessage,
        )
    }

    @Transactional
    fun addFileLogs(runId: UUID, logs: List<FileLogRequest>): List<FileLogResponse> {
        val run = backupRunRepository.findById(runId).orElseThrow { ResourceNotFoundException("Backup run not found") }
        val entities = logs.map { req ->
            FileLogEntity(
                id = UUID.randomUUID(),
                run = run,
                fileName = req.fileName,
                fileSize = req.fileSize ?: 0L,
                sourceUri = req.sourceUri ?: "",
                destinationUri = req.destinationUri,
                status = com.autobackup.api.model.entity.FileTransferStatus.valueOf((req.status ?: "PENDING").uppercase()),
                errorCode = req.errorCode,
                transferredAt = req.transferredAt,
            )
        }
        val saved = fileLogRepository.saveAll(entities)

        // create failed transfer records for failed logs
        val failed = saved.filter { it.status.equals("FAILED", ignoreCase = true) }
        failed.forEach { fl ->
            val ft = FailedTransferEntity(
                id = UUID.randomUUID(),
                fileLog = fl,
                sourceUri = fl.sourceUri,
                destinationUri = fl.destinationUri,
                retryCount = 0,
                lastRetryAt = null,
                resolved = false,
            )
            failedTransferRepository.save(ft)
        }

        return saved.map { it -> FileLogResponse(
            id = it.id,
            runId = it.run.id,
            fileName = it.fileName,
            fileSize = it.fileSize,
            sourceUri = it.sourceUri,
            destinationUri = it.destinationUri,
            status = it.status.name,
            errorCode = it.errorCode,
            transferredAt = it.transferredAt,
        ) }
    }

    fun getRunFiles(runId: UUID): List<FileLogResponse> {
        val run = backupRunRepository.findById(runId).orElseThrow { ResourceNotFoundException("Backup run not found") }
        val logs = fileLogRepository.findByRunId(run.id, org.springframework.data.domain.Pageable.unpaged())
        return logs.map {
            FileLogResponse(
                id = it.id,
                runId = it.run.id,
                fileName = it.fileName,
                fileSize = it.fileSize,
                sourceUri = it.sourceUri,
                destinationUri = it.destinationUri,
                status = it.status.name,
                errorCode = it.errorCode,
                transferredAt = it.transferredAt,
            )
        }
    }

    fun getFailedFiles(runId: UUID): List<FileLogResponse> {
        val failed = failedTransferRepository.findByFileLogRunIdAndResolved(runId, false)
        return failed.map {
            val fl = it.fileLog
            FileLogResponse(
                id = fl.id,
                runId = fl.run.id,
                fileName = fl.fileName,
                fileSize = fl.fileSize,
                sourceUri = fl.sourceUri,
                destinationUri = fl.destinationUri,
                status = fl.status.name,
                errorCode = fl.errorCode,
                transferredAt = fl.transferredAt,
            )
        }
    }

    fun markFailedForRetry(runId: UUID, fileLogId: UUID) {
        val ft = failedTransferRepository.findAll().find { it.fileLog.id == fileLogId && it.fileLog.run.id == runId }
            ?: throw ResourceNotFoundException("Failed transfer not found")
        ft.retryCount = ft.retryCount + 1
        ft.lastRetryAt = LocalDateTime.now()
        ft.resolved = false
        failedTransferRepository.save(ft)
    }

    fun retryAllFailed(runId: UUID) {
        val list = failedTransferRepository.findByFileLogRunIdAndResolved(runId, false)
        list.forEach {
            it.retryCount = it.retryCount + 1
            it.lastRetryAt = LocalDateTime.now()
            it.resolved = false
        }
        failedTransferRepository.saveAll(list)
    }

    // Controller-facing helpers
    fun listRuns(page: Int, size: Int): org.springframework.data.domain.Page<BackupRunResponse> {
        val pg = org.springframework.data.domain.PageRequest.of(page, size)
        val pageEnt = backupRunRepository.findAllByOrderByStartedAtDesc(pg)
        return pageEnt.map { e -> BackupRunResponse(
            id = e.id,
            scheduleId = e.schedule.id,
            deviceId = e.device.id,
            startedAt = e.startedAt,
            endedAt = e.endedAt,
            status = e.status.name,
            totalFiles = e.totalFiles,
            movedFiles = e.movedFiles,
            failedFiles = e.failedFiles,
            bytesCopied = e.bytesCopied,
            errorMessage = e.errorMessage,
        ) }
    }

    fun getRun(runId: UUID): BackupRunResponse {
        val e = backupRunRepository.findById(runId).orElseThrow { ResourceNotFoundException("Backup run not found") }
        return BackupRunResponse(
            id = e.id,
            scheduleId = e.schedule.id,
            deviceId = e.device.id,
            startedAt = e.startedAt,
            endedAt = e.endedAt,
            status = e.status.name,
            totalFiles = e.totalFiles,
            movedFiles = e.movedFiles,
            failedFiles = e.failedFiles,
            bytesCopied = e.bytesCopied,
            errorMessage = e.errorMessage,
        )
    }

    fun getRunFiles(runId: UUID, page: Int, size: Int): org.springframework.data.domain.Page<FileLogResponse> {
        val pg = org.springframework.data.domain.PageRequest.of(page, size)
        val list = fileLogRepository.findByRunId(runId, pg)
        val total = list.size
        val dtos = list.map { it -> FileLogResponse(
            id = it.id,
            runId = it.run.id,
            fileName = it.fileName,
            fileSize = it.fileSize,
            sourceUri = it.sourceUri,
            destinationUri = it.destinationUri,
            status = it.status.name,
            errorCode = it.errorCode,
            transferredAt = it.transferredAt,
        ) }
        return org.springframework.data.domain.PageImpl(dtos, pg, total.toLong())
    }
}
