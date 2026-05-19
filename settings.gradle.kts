rootProject.name = "autobackup-manager"

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}

val includeAndroidModules = providers.gradleProperty("includeAndroidModules")
    .map { it.equals("true", ignoreCase = true) }
    .orElse(false)
    .get()

if (includeAndroidModules) {
    include(":android:app")
    include(":android:domain")
    include(":android:data")
    include(":android:worker")
    include(":android:storage")
    include(":android:common")
}

// Backend module
include(":backend")
