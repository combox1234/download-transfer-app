# PowerShell vs Bash Command Syntax

## Key Difference
- **Bash**: Uses `&&` for command chaining (Exit on error)
- **PowerShell**: Uses `;` for command chaining (Continue on error)

## Correct PowerShell Syntax

### Backend
```powershell
cd backend; ./gradlew bootRun
```

### Web
```powershell
cd web; npm install; npm run dev
```

### Android
```powershell
cd android; ./gradlew assembleDebug
```

## Running Multiple Commands

### Sequential Execution (stop on error)
```powershell
cd backend; ./gradlew clean; ./gradlew build; ./gradlew bootRun
```

### With Output Piping
```powershell
cd web | npm run dev
```

### Run in Parallel (use & for background jobs)
```powershell
# Start backend
Start-Job -ScriptBlock { cd backend; ./gradlew bootRun }

# Start web
Start-Job -ScriptBlock { cd web; npm run dev }

# Check jobs
Get-Job
```

## Quick Start Commands

**Backend (Spring Boot on :8080)**
```powershell
cd backend
./gradlew bootRun
```

**Web (Next.js on :3000)**
```powershell
cd web
npm run dev
```

**Android (Build APK)**
```powershell
cd android
./gradlew assembleDebug
```

## Notes
- PowerShell uses `;` instead of `&&`
- All scripts use `/` path separators (Windows compatible)
- `./gradlew` works on Windows automatically
