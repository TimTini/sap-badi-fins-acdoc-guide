# Generate PNG placeholders for docs/images (run once, commit PNG to repo).
# Replace later with real SAP GUI screenshots (same file names).

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\docs\images"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-PlaceholderPng {
    param(
        [string]$FileName,
        [string]$Title,
        [string]$Subtitle,
        [int]$Width = 1280,
        [int]$Height = 720
    )

    $path = Join-Path $outDir $FileName
    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(232, 232, 232))

    $headerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(208, 208, 208))
    $graphics.FillRectangle($headerBrush, 0, 0, $Width, 36)

    $panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(247, 247, 247))
    $graphics.FillRectangle($panelBrush, 24, 52, ($Width - 48), ($Height - 76))

    $titleFont = [System.Drawing.Font]::new("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
    $subFont = [System.Drawing.Font]::new("Segoe UI", 14)
    $badgeFont = [System.Drawing.Font]::new("Segoe UI", 11)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 35, 50))
    $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(92, 107, 130))
    $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 98, 254))

    $graphics.DrawString($Title, $titleFont, $textBrush, 48, 80)
    $graphics.DrawString($Subtitle, $subFont, $mutedBrush, 48, 120)
    $graphics.DrawString("PLACEHOLDER - replace with screenshot on your SAP system", $badgeFont, $accentBrush, 48, ($Height - 100))
    $graphics.DrawString("Mask: client, system ID, username, transport", $badgeFont, $mutedBrush, 48, ($Height - 72))

    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Created $path"
}

New-PlaceholderPng "02-se19-new-badi-enhancement-spot.png" "SE19 - Create Implementation" "New BAdI | Enhancement Spot: ES_FINS_ACDOCA"
New-PlaceholderPng "03-se19-enhancement-implementation-zbi-active.png" "SE19 - Enhancement Implementation" "ZEI_FINS_ACDOCA > ZBI_FINS_ACDOC_FCAT > ZCL_IM_* | Active = ON"
New-PlaceholderPng "04-se24-method-parameters-bcf-oi.png" "SE24 - Class Builder" "Method CHANGE_ACTIVE_FIELDS_BCF_OI | check CHANGING parameter"
New-PlaceholderPng "05-se19-deactivate-badi-implementation.png" "SE19 - Deactivate BAdI" "ZBI_FINS_ACDOC_FCAT | set Active implementation OFF"
New-PlaceholderPng "06-debug-breakpoint-zcl-im.png" "ABAP Debugger" "Breakpoint in ZCL_IM_FINS_ACDOC_FCAT~CHANGE_ACTIVE_FIELDS_BCF_OI"
New-PlaceholderPng "07-se84-check-badi-implementation.png" "SE84 - Repository Info System" "Enhancements > BAdI Implementations > ZBI_FINS_ACDOC_FCAT"
