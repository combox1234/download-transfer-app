package com.autobackup.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

/**
 * Application class for Hilt initialization and global setup.
 */
@HiltAndroidApp
class BackupApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Timber logging
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
        
        // TODO: Initialize other global services
        //  - Setup Retrofit client
        //  - Initialize Room database
        //  - Schedule periodic sync jobs
    }
}
