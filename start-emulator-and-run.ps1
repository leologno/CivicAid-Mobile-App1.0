# Script to start Android emulator and run the app
# Run this script: .\start-emulator-and-run.ps1

Write-Host "🚀 Starting Android Emulator and App..." -ForegroundColor Green

# Set Android SDK paths
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$emulatorPath = "$env:ANDROID_HOME\emulator\emulator.exe"
$adbPath = "$env:ANDROID_HOME\platform-tools\adb.exe"
$env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"

# Check if emulator exists
if (-not (Test-Path $emulatorPath)) {
    Write-Host "❌ Android emulator not found at: $emulatorPath" -ForegroundColor Red
    Write-Host "📝 Please install Android Studio and create an emulator first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to create an emulator:" -ForegroundColor Cyan
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Go to Tools → Device Manager" -ForegroundColor White
    Write-Host "3. Click 'Create Device'" -ForegroundColor White
    Write-Host "4. Select a device (e.g., Pixel 5)" -ForegroundColor White
    Write-Host "5. Select a system image (e.g., API 33 or 34)" -ForegroundColor White
    Write-Host "6. Click Finish and then start the emulator" -ForegroundColor White
    exit 1
}

# List available AVDs
Write-Host "📱 Checking for available emulators..." -ForegroundColor Cyan
$avds = & $emulatorPath -list-avds 2>&1

if (-not $avds -or $avds.Count -eq 0) {
    Write-Host "❌ No Android Virtual Devices (AVDs) found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Please create an emulator in Android Studio:" -ForegroundColor Yellow
    Write-Host "   1. Open Android Studio" -ForegroundColor White
    Write-Host "   2. Go to: Tools → Device Manager" -ForegroundColor White
    Write-Host "   3. Click 'Create Device'" -ForegroundColor White
    Write-Host "   4. Select a device (e.g., Pixel 5 or Pixel 6)" -ForegroundColor White
    Write-Host "   5. Download a system image (e.g., API 33 or 34) if needed" -ForegroundColor White
    Write-Host "   6. Finish the setup" -ForegroundColor White
    Write-Host ""
    Write-Host "After creating an emulator, run this script again." -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Found emulators: $avds" -ForegroundColor Green
$selectedAvd = $avds[0]
Write-Host "🚀 Starting emulator: $selectedAvd" -ForegroundColor Cyan

# Start emulator in background
Start-Process $emulatorPath -ArgumentList "-avd", $selectedAvd -WindowStyle Minimized

Write-Host "⏳ Waiting for emulator to boot (this may take 1-2 minutes)..." -ForegroundColor Yellow

# Wait for emulator to be ready
$maxWait = 120  # 2 minutes
$waited = 0
$deviceReady = $false

while ($waited -lt $maxWait -and -not $deviceReady) {
    Start-Sleep -Seconds 5
    $waited += 5
    $devices = & $adbPath devices 2>&1
    if ($devices -match "device$") {
        $deviceReady = $true
        Write-Host "✅ Emulator is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Still waiting... ($waited seconds)" -ForegroundColor Gray
}

if (-not $deviceReady) {
    Write-Host "⏰ Emulator took too long to start. Please start it manually and try again." -ForegroundColor Yellow
    Write-Host "   Or check if an emulator is already running with: adb devices" -ForegroundColor Cyan
    exit 1
}

# Start Metro bundler in background
Write-Host "📦 Starting Metro bundler..." -ForegroundColor Cyan
$metroProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start" -PassThru -WindowStyle Minimized

Start-Sleep -Seconds 3

# Build and install the app
Write-Host "🔨 Building and installing the app..." -ForegroundColor Cyan
Write-Host ""
npm run android

Write-Host ""
Write-Host "✅ Done! Your app should be running on the emulator now! 🎉" -ForegroundColor Green
Write-Host "📝 To stop Metro bundler, close the PowerShell window or press Ctrl+C in that window." -ForegroundColor Cyan






