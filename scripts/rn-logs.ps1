# React Native Console Logs via ADB
# Usage: .\rn-logs.ps1
# Standalone script with all checks and requirements

param(
    [switch]$Clear,
    [switch]$Help
)

function Show-Help {
    Write-Host ""
    Write-Host "React Native ADB Log Viewer" -ForegroundColor Cyan
    Write-Host "===========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\rn-logs.ps1 [-Clear] [-Help]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Clear    Clear logcat buffer before starting"
    Write-Host "  -Help     Show this help message"
    Write-Host ""
    Write-Host "Press Ctrl+C to stop logging"
    Write-Host ""
    exit 0
}

function Test-AdbInstalled {
    try {
        $null = Get-Command adb -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-DeviceConnected {
    $devices = adb devices 2>&1
    $connectedDevices = $devices | Select-String -Pattern "^\w+\s+device$"
    return $connectedDevices.Count -gt 0
}

function Get-ConnectedDevices {
    $devices = adb devices 2>&1
    $deviceList = @()
    foreach ($line in $devices) {
        if ($line -match "^(\S+)\s+device$") {
            $deviceList += $matches[1]
        }
    }
    return $deviceList
}

# Show help if requested
if ($Help) {
    Show-Help
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  React Native ADB Log Viewer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: ADB installed
Write-Host "[1/3] Checking ADB installation..." -ForegroundColor Yellow
if (-not (Test-AdbInstalled)) {
    Write-Host "  ERROR: ADB is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "  To fix this:" -ForegroundColor White
    Write-Host "  1. Install Android Studio or Android SDK Platform Tools"
    Write-Host "  2. Add ADB to your system PATH:"
    Write-Host "     - Usually located at: C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools"
    Write-Host "  3. Restart your terminal and try again"
    Write-Host ""
    exit 1
}
Write-Host "  OK: ADB is installed" -ForegroundColor Green

# Check 2: ADB server running
Write-Host "[2/3] Starting ADB server..." -ForegroundColor Yellow
$null = adb start-server 2>&1
Write-Host "  OK: ADB server is running" -ForegroundColor Green

# Check 3: Device connected
Write-Host "[3/3] Checking for connected devices..." -ForegroundColor Yellow
if (-not (Test-DeviceConnected)) {
    Write-Host "  ERROR: No device connected" -ForegroundColor Red
    Write-Host ""
    Write-Host "  To fix this:" -ForegroundColor White
    Write-Host "  1. Connect your Android device via USB"
    Write-Host "  2. Enable USB Debugging in Developer Options"
    Write-Host "  3. Accept the debugging prompt on your device"
    Write-Host "  4. Run 'adb devices' to verify connection"
    Write-Host ""
    exit 1
}

$devices = Get-ConnectedDevices
Write-Host "  OK: Device(s) connected:" -ForegroundColor Green
foreach ($device in $devices) {
    Write-Host "      - $device" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Clear logcat if requested
if ($Clear) {
    Write-Host "Clearing logcat buffer..." -ForegroundColor Yellow
    adb logcat -c
    Write-Host "Buffer cleared." -ForegroundColor Green
}

Write-Host ""
Write-Host "Streaming React Native console logs..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor DarkGray

# Stream React Native logs
# ReactNativeJS is the tag used by React Native for console.log/warn/error
adb logcat -s ReactNativeJS:V *:S
