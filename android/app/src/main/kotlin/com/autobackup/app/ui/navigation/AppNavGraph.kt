package com.autobackup.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

/**
 * Main navigation graph for the app.
 * Defines screens and navigation flows.
 */
@Composable
fun AppNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "dashboard"
    ) {
        // Dashboard screen
        composable("dashboard") {
            // TODO: Create DashboardScreen composable
            // Displays overview of schedules, recent runs, storage stats
        }
        
        // Schedule list screen
        composable("schedules") {
            // TODO: Create ScheduleListScreen composable
            // Shows all configured schedules, options to create/edit/delete
        }
        
        // Schedule detail/edit screen
        composable("schedules/{scheduleId}") { backStackEntry ->
            val scheduleId = backStackEntry.arguments?.getString("scheduleId")
            // TODO: Create ScheduleDetailScreen composable
        }
        
        // Backup history screen
        composable("history") {
            // TODO: Create HistoryScreen composable
            // Shows list of past backup runs with filtering/sorting
        }
        
        // Run detail screen
        composable("history/{runId}") { backStackEntry ->
            val runId = backStackEntry.arguments?.getString("runId")
            // TODO: Create RunDetailScreen composable
            // Shows file-level transfer results for a run
        }
        
        // Devices screen
        composable("devices") {
            // TODO: Create DevicesScreen composable
        }
        
        // Settings screen
        composable("settings") {
            // TODO: Create SettingsScreen composable
        }
    }
}
