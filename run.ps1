# ===================================================
# TD-markitdown PowerShell Launcher
# Developed by dtmadman 2026™ under TobonDigital.com
# ===================================================

Clear-Host
Write-Output "==================================================="
Write-Output "            TD-markitdown Launcher"
Write-Output "==================================================="
Write-Output ""

# 1. Check if Python is installed
$pythonCheck = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCheck) {
    Write-Warning "[ERROR] Python is not installed or not in PATH."
    Write-Host "Please install Python 3.10+ from https://www.python.org/"
    Write-Host "Make sure to check 'Add Python to PATH' during installation."
    Write-Host ""
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Create virtual environment if it doesn't exist
if (-not (Test-Path -Path ".venv")) {
    Write-Host "[System] Creating Python virtual environment (.venv)..."
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "[ERROR] Failed to create virtual environment."
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "[System] Virtual environment created successfully."
    Write-Host ""
}

# 3. Install/Upgrade dependencies
Write-Host "[System] Checking and installing dependencies..."
& .venv\Scripts\python.exe -m pip install --upgrade pip -q
& .venv\Scripts\pip.exe install -r backend/requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Warning "[ERROR] Failed to install dependencies."
    Read-Host "Press Enter to exit..."
    exit 1
}
Write-Host "[System] Dependencies up to date."
Write-Host ""

# 4. Start FastAPI backend
Write-Host "[System] Starting FastAPI backend..."
Write-Host "The application will open automatically in your browser."
Write-Host "Press Ctrl+C in this window to stop the server."
Write-Host ""

# Move to backend directory and start server using venv python
Set-Location -Path "backend"
& ..\.venv\Scripts\python.exe main.py
