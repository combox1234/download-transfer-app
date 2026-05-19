package com.autobackup.domain.usecase

import com.autobackup.domain.model.DestinationType
import java.util.UUID

/**
 * UseCase for mapping destination types to provider-specific URIs.
 * Handles authentication and provider-specific URI formats.
 */
class ResolveDestinationUseCase {
    
    /**
     * Resolve a backup destination URI.
     * @param destinationType The cloud provider
     * @param credentials Provider-specific credentials
     * @return Resolved URI for that destination
     */
    suspend operator fun invoke(
        destinationType: DestinationType,
        credentials: String,
    ): String {
        // TODO: Implement provider-specific resolution
        //  - GOOGLE_DRIVE: Use Drive API to get folder URI
        //  - ONE_DRIVE: Use Graph API to get folder path
        //  - DROPBOX: Use Dropbox API for path
        //  - S3: Validate bucket exists
        //  - LOCAL: Validate local path (SAF for scoped storage)
        
        return when (destinationType) {
            DestinationType.GOOGLE_DRIVE -> "https://drive.google.com/backup"
            DestinationType.ONE_DRIVE -> "https://onedrive.com/backup"
            DestinationType.DROPBOX -> "https://dropbox.com/backup"
            DestinationType.S3 -> "s3://backup-bucket"
            DestinationType.LOCAL -> "/Documents/Backup"
        }
    }
}
