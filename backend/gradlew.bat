@echo off
setlocal

set DIRNAME=%~dp0
set LOCAL_GRADLE=%DIRNAME%.gradle84-temp\gradle-8.4\bin\gradle.bat

if exist "%LOCAL_GRADLE%" (
  call "%LOCAL_GRADLE%" %*
  exit /b %ERRORLEVEL%
)

set WRAPPER_CP=%DIRNAME%gradle\wrapper\*

if not exist "%DIRNAME%gradle\wrapper" (
  echo Gradle wrapper directory not found: %DIRNAME%gradle\wrapper
  echo You can generate it by running 'gradle wrapper' with a local Gradle installation.
  exit /b 1
)

java -cp "%WRAPPER_CP%" org.gradle.wrapper.GradleWrapperMain %*
