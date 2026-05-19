package com.autobackup.app.di

import com.autobackup.domain.usecase.*
import com.autobackup.domain.repository.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt dependency injection module for the app layer.
 * Provides singletons for UseCases and repositories.
 */
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    // TODO: Implement repository providers
    @Provides
    @Singleton
    fun provideScheduleRepository(): ScheduleRepository {
        // Will be implemented in data module
        throw NotImplementedError("Implement via data module binding")
    }
    
    @Provides
    @Singleton
    fun provideBackupRunRepository(): BackupRunRepository {
        throw NotImplementedError("Implement via data module binding")
    }
    
    @Provides
    @Singleton
    fun provideFileLogRepository(): FileLogRepository {
        throw NotImplementedError("Implement via data module binding")
    }
    
    // UseCase providers
    @Provides
    @Singleton
    fun provideExecuteBackupUseCase(
        backupRunRepository: BackupRunRepository,
        fileLogRepository: FileLogRepository,
    ): ExecuteBackupUseCase {
        return ExecuteBackupUseCase(backupRunRepository, fileLogRepository)
    }
    
    @Provides
    @Singleton
    fun provideScheduleBackupUseCase(
        scheduleRepository: ScheduleRepository,
    ): ScheduleBackupUseCase {
        return ScheduleBackupUseCase(scheduleRepository)
    }
    
    @Provides
    @Singleton
    fun provideResolveDestinationUseCase(): ResolveDestinationUseCase {
        return ResolveDestinationUseCase()
    }
    
    @Provides
    @Singleton
    fun provideRetryFailedTransfersUseCase(
        fileLogRepository: FileLogRepository,
    ): RetryFailedTransfersUseCase {
        return RetryFailedTransfersUseCase(fileLogRepository)
    }
}
