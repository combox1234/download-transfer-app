Gradle Wrapper

This repo includes `gradlew` and `gradlew.bat` scripts and `gradle/wrapper/gradle-wrapper.properties`.

Important: the `gradle-wrapper.jar` binary is not committed here. To generate it locally, run the following on a machine with Gradle installed:

    cd backend
    gradle wrapper --gradle-version 8.6.3

This will produce `gradle/wrapper/gradle-wrapper.jar`. After that you can run:

    ./gradlew clean build

If you prefer, you can install Gradle and run `gradle wrapper` once and commit the generated jar.
