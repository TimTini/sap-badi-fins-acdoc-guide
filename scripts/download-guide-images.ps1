# Download real SAP Help / SAP Community screenshots into docs/images/
# See docs/images/SOURCES.md for mapping and URLs.

$ErrorActionPreference = "Stop"
$dest = Join-Path $PSScriptRoot "..\docs\images"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$community = "https://community.sap.com/legacyfs/online/storage/blog_attachments/2013/10"
$blogUrl = "https://community.sap.com/t5/application-development-and-automation-blog-posts/adding-wrbtr-column-in-the-standard-report-rfumsv00-vat-report/ba-p/13242101"

$helpBadi = "https://help.sap.com/saphelp_snc70/helpdata/en/44/f518d884056c30e10000000a114a6b"
$helpFirst = "https://help.sap.com/saphelp_snc70/helpdata/en/44/f5175e19fd2463e10000000a1553f7"

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

function Get-RemoteFile {
    param([string]$Url, [string]$OutPath)
    curl -sL -A $ua $Url -o $OutPath
    if (-not (Test-Path $OutPath) -or (Get-Item $OutPath).Length -lt 500) {
        throw "Download failed or file too small: $Url"
    }
    Write-Host "OK $OutPath"
}

Get-RemoteFile "$community/capture1_293909.png" (Join-Path $dest "02-se19-new-badi-enhancement-spot.png")
Get-RemoteFile "$helpBadi/TEMPLATE_image007.jpg" (Join-Path $dest "03-se19-enhancement-implementation-zbi-active.png")
Get-RemoteFile "$community/capture6_293926.png" (Join-Path $dest "04-se24-method-parameters-bcf-oi.png")
Get-RemoteFile "$helpBadi/TEMPLATE_image007.jpg" (Join-Path $dest "05-se19-deactivate-badi-implementation.png")
Get-RemoteFile "$helpBadi/TEMPLATE_image008.jpg" (Join-Path $dest "06-debug-breakpoint-zcl-im.png")
Get-RemoteFile "$helpFirst/TEMPLATE_image004.jpg" (Join-Path $dest "07-se84-check-badi-implementation.png")

Write-Host "Done. Sources: $blogUrl and SAP Help paths in SOURCES.md"
