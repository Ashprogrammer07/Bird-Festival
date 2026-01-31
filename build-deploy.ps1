# 🚀 Build and Deploy Script for Bird Festival
# This script builds the frontend and copies it to the server folder

Write-Host "🔨 Building Bird Festival for Production..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend
Write-Host "📦 Step 1: Building frontend..." -ForegroundColor Yellow
Set-Location -Path "client"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing client dependencies..." -ForegroundColor Yellow
    npm install
}

# Build
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
Set-Location -Path ".."

# Step 2: Copy to Server
Write-Host ""
Write-Host "📁 Step 2: Copying build to server..." -ForegroundColor Yellow

# Remove old dist folder if exists
if (Test-Path "server\dist") {
    Write-Host "🗑️  Removing old build..." -ForegroundColor Gray
    Remove-Item -Path "server\dist" -Recurse -Force
}

# Create dist folder
New-Item -ItemType Directory -Path "server\dist" -Force | Out-Null

# Copy files
Copy-Item -Path "client\dist\*" -Destination "server\dist" -Recurse -Force

Write-Host "✅ Build copied to server/dist!" -ForegroundColor Green

# Step 3: Verify
Write-Host ""
Write-Host "🔍 Step 3: Verifying build..." -ForegroundColor Yellow

$indexExists = Test-Path "server\dist\index.html"
$assetsExists = Test-Path "server\dist\assets"

if ($indexExists -and $assetsExists) {
    Write-Host "✅ Build verified successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Build Statistics:" -ForegroundColor Cyan
    
    $distSize = (Get-ChildItem -Path "server\dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Total Size: $([math]::Round($distSize, 2)) MB" -ForegroundColor White
    
    $fileCount = (Get-ChildItem -Path "server\dist" -Recurse -File).Count
    Write-Host "   Total Files: $fileCount" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎉 Build Complete! Ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Upload the 'server' folder to Hostinger" -ForegroundColor White
    Write-Host "   2. Set environment variables on Hostinger" -ForegroundColor White
    Write-Host "   3. Run 'npm install' on the server" -ForegroundColor White
    Write-Host "   4. Start the application" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Build verification failed!" -ForegroundColor Red
    Write-Host "   Missing files in server/dist" -ForegroundColor Red
    exit 1
}
