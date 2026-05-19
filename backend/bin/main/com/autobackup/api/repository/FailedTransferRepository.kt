package com.autobackup.api.repository

import com.autobackup.api.model.entity.FailedTransferEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface FailedTransferRepository : JpaRepository<FailedTransferEntity, UUID> {
    fun findByFileLogRunIdAndResolved(runId: UUID, resolved: Boolean = false): List<FailedTransferEntity>
}
