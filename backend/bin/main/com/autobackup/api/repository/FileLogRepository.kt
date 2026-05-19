package com.autobackup.api.repository

import com.autobackup.api.model.entity.FileLogEntity
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

/**
 * Spring Data JPA repository for FileLog entities.
 */
@Repository
interface FileLogRepository : JpaRepository<FileLogEntity, UUID> {
    fun findByRunId(runId: UUID, pageable: Pageable): List<FileLogEntity>
    fun findByRunIdOrderByCreatedAtDesc(runId: UUID, pageable: Pageable): Page<FileLogEntity>
    fun findByRunIdAndStatus(runId: UUID, status: String): List<FileLogEntity>
    fun findByRunIdAndStatusOrderByCreatedAtDesc(runId: UUID, status: String, pageable: Pageable): Page<FileLogEntity>
}
