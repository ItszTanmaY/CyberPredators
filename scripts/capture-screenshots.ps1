$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\admin\OneDrive\Desktop\CyberPredator\screenshots"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

Write-Host "Capturing Public Website Home Page (1200x1600)..."
Start-Process $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1200,1600", "--virtual-time-budget=2500", "--screenshot=$outDir\public_home_1200.png", "http://localhost:3000" -Wait

Write-Host "Capturing Public About Page..."
Start-Process $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1200,1200", "--virtual-time-budget=2000", "--screenshot=$outDir\public_about_1200.png", "http://localhost:3000/about" -Wait

Write-Host "Capturing Public Features Page..."
Start-Process $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1200,1200", "--virtual-time-budget=2000", "--screenshot=$outDir\public_features_1200.png", "http://localhost:3000/features" -Wait

Write-Host "Capturing Protected Portal View (1200x1800)..."
Start-Process $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1200,1800", "--virtual-time-budget=3000", "--screenshot=$outDir\portal_view_1200.png", "http://localhost:3000/portal?sample=case01_criminal_bail" -Wait

Write-Host "Capturing Mobile Home (390x900)..."
Start-Process $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=390,900", "--virtual-time-budget=2000", "--screenshot=$outDir\mobile_home_390.png", "http://localhost:3000" -Wait

Write-Host "Done. Verifying generated screenshots:"
Get-ChildItem $outDir\public*.png, $outDir\portal_view*.png, $outDir\mobile_home*.png | Select-Object Name, Length
