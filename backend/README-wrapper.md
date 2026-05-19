Gradle wrapper helper

This repository includes `gradlew` and wrapper config but not the real `gradle-wrapper.jar` binary.

To fetch a working wrapper JAR on Windows (PowerShell):

```powershell
# from project root
Invoke-WebRequest -Uri https://services.gradle.org/distributions/gradle-8.4-bin.zip -OutFile gradle-8.4-bin.zip
Expand-Archive gradle-8.4-bin.zip -DestinationPath .gradle-temp
Copy-Item -Path .gradle-temp\gradle-8.4\lib\gradle-wrapper.jar -Destination gradle\wrapper\gradle-wrapper.jar
Remove-Item -Recurse -Force .gradle-temp, gradle-8.4-bin.zip
```

On Unix/macOS:

```sh
wget https://services.gradle.org/distributions/gradle-8.4-bin.zip -O gradle-8.4-bin.zip
unzip gradle-8.4-bin.zip -d .gradle-temp
cp .gradle-temp/gradle-8.4/lib/gradle-wrapper.jar gradle/wrapper/gradle-wrapper.jar
rm -rf .gradle-temp gradle-8.4-bin.zip
```

After placing the real `gradle-wrapper.jar`, run:

```sh
./gradlew clean build
```
