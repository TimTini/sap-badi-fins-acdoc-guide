# Hình minh họa

## Ảnh hiện tại

Screenshot **thật** từ [SAP Help](https://help.sap.com) và [SAP Community](https://community.sap.com) — xem bảng nguồn đầy đủ trong [`SOURCES.md`](SOURCES.md).

| File | Nội dung |
|------|----------|
| `01-badi-object-relation.svg` | Sơ đồ object (SVG, không screenshot) |
| `02`–`07` | PNG từ tài liệu SAP (SE19, enhancement impl, Class Builder, …) |

**Không còn placeholder tự chế.** Object trên ảnh là ví dụ SAP (`FI_TAX_*`, `z_bdi_calc_vat_*`), không phải `ZBI_FINS_ACDOC_FCAT` — bố cục transaction vẫn đúng.

## Thay bằng screenshot hệ DEV (khuyến nghị cuối)

1. Chụp trên DEV với `ES_FINS_ACDOCA`, `ZBI_FINS_ACDOC_FCAT`, `ZCL_IM_FINS_ACDOC_FCAT`.
2. Che client, system ID, user, transport.
3. Ghi đè cùng tên file PNG.

## Script

- `scripts/generate-image-placeholders.ps1` — chỉ dùng khi không tải được ảnh nguồn; **không** dùng cho bản publish.
