package com.autobackup.api.service

import com.autobackup.api.model.dto.StatsResponse
import com.autobackup.api.repository.BackupRunRepository
import com.autobackup.api.repository.BackupScheduleRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

@Service
@Transactional(readOnly = true)
class StatsService(
    private val backupRunRepository: BackupRunRepository,
    private val backupScheduleRepository: BackupScheduleRepository,
) {

    fun getStats(): StatsResponse {
        val userId = getCurrentUserId()
        
        // Get schedules
        val schedules = backupScheduleRepository.findByUserId(userId)
        val activeSchedules = schedules.count { it.isEnabled }
        
        // Get last 30 days runs
        val thirtyDaysAgo = Instant.now().minusSeconds(30 * 24 * 60 * 60)
        val runsLast30Days = backupRunRepository.findAll()
            .filter { it.userId == userId && it.startedAt.isAfter(thirtyDaysAgo) }
        
        // Calculate success rate
        val successRate = if (runsLast30Days.isNotEmpty()) {
            val successRuns = runsLast30Days.count { it.status == "SUCCESS" }
            (successRuns.toDouble() / runsLast30Days.size) * 100
        } else {
            0.0
        }
        
        // Calculate total bytes
        val totalBytesCopied = runsLast30Days.sumOf { it.bytesCopied }
        
        // Get last run
        val lastRun = runsLast30Days.maxByOrNull { it.startedAt }
        
        // Count failed transfers pending
        val failedTransfersPending = runsLast30Days
            .sumOf { run -> run.failedFiles }
        
        return StatsResponse(
            totalSchedules = schedules.size,
            activeSchedules = activeSchedules,
            totalRunsLast30Days = runsLast30Days.size,
            successRate = successRate,
            totalBytesCopiedLast30Days = totalBytesCopied,
            lastRunAt = lastRun?.startedAt,
            failedTransfersPending = failedTransfersPending,
        )
    }

    private fun getCurrentUserId(): UUID {
        val authentication = SecurityContextHolder.getContext().authentication
        return UUID.fromString(authentication.name)
    }
}
