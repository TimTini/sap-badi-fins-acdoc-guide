# Sync hướng dẫn từ Downloads vào repo (chạy trực tiếp trong PowerShell).
# Cách chạy:
#   powershell -NoProfile -ExecutionPolicy Bypass -File "F:\MyGitProject\sap-badi-fins-acdoc-guide\scripts\sync-from-downloads.ps1"

$ErrorActionPreference = 'Stop'

$repo = 'F:\MyGitProject\sap-badi-fins-acdoc-guide'
$docsDir = Join-Path $repo 'docs'
$srcMd = 'h:\Downloads\Huong_dan_BADI_FINS_ACDOC.md'
$srcHtml = 'h:\Downloads\Huong_dan_BADI_FINS_ACDOC.html'

if (-not (Test-Path -LiteralPath $srcMd)) {
  Write-Error "Không tìm thấy: $srcMd"
}
if (-not (Test-Path -LiteralPath $srcHtml)) {
  Write-Error "Không tìm thấy: $srcHtml"
}

New-Item -ItemType Directory -Path $docsDir -Force | Out-Null

Copy-Item -LiteralPath $srcMd -Destination (Join-Path $docsDir 'Huong_dan_BADI_FINS_ACDOC.md') -Force
Copy-Item -LiteralPath $srcHtml -Destination (Join-Path $docsDir 'Huong_dan_BADI_FINS_ACDOC.html') -Force

Write-Host "OK: đã sync vào $docsDir"
