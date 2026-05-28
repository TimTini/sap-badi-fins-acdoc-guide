# Sync hướng dẫn từ thư mục Downloads vào repo (chạy trực tiếp trong PowerShell).
# Cách chạy (sửa đường dẫn cho đúng máy bạn):
#   powershell -NoProfile -ExecutionPolicy Bypass -File "[redacted-repo-path]\scripts\sync-from-downloads.ps1"

$ErrorActionPreference = 'Stop'

$repo = '[redacted-repo-path]'
$docsDir = Join-Path $repo 'docs'
$srcMd = '[redacted-downloads-path]\Huong_dan_BADI_FINS_ACDOC.md'
$srcHtml = '[redacted-downloads-path]\Huong_dan_BADI_FINS_ACDOC.html'

if (-not (Test-Path -LiteralPath $srcMd)) {
  Write-Error "Không tìm thấy: $srcMd"
}
if (-not (Test-Path -LiteralPath $srcHtml)) {
  Write-Error "Không tìm thấy: $srcHtml"
}

New-Item -ItemType Directory -Path $docsDir -Force | Out-Null

Copy-Item -LiteralPath $srcMd -Destination (Join-Path $docsDir 'Huong_dan_BADI_FINS_ACDOC.md') -Force
Copy-Item -LiteralPath $srcHtml -Destination (Join-Path $docsDir 'Huong_dan_BADI_FINS_ACDOC.html') -Force

Write-Host "Đã sync vào $docsDir"
