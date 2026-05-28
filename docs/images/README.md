# Hình minh họa (`docs/images/`)

## File trong repo

| File | Loại | Nội dung |
|------|------|----------|
| `01-badi-object-relation.svg` | SVG (giữ) | Sơ đồ quan hệ object Standard → Z* — **không** dùng screenshot |
| `02-se19-new-badi-enhancement-spot.png` | PNG | SE19: **New BAdI**, Enhancement Spot `ES_FINS_ACDOCA` |
| `03-se19-enhancement-implementation-zbi-active.png` | PNG | ZEI → ZBI → class, trạng thái **Active** |
| `04-se24-method-parameters-bcf-oi.png` | PNG | SE24: method `CHANGE_ACTIVE_FIELDS_BCF_OI`, tab Parameters |
| `05-se19-deactivate-badi-implementation.png` | PNG | SE19: tắt **Active implementation** trên `ZBI_FINS_ACDOC_FCAT` |
| `06-debug-breakpoint-zcl-im.png` | PNG | Breakpoint / debugger trong `ZCL_IM_FINS_ACDOC_FCAT` |
| `07-se84-check-badi-implementation.png` | PNG | SE84: kiểm tra BAdI implementation còn sót |
| `05-bcf-flow.svg` | SVG (phụ) | Luồng BCF — chỉ dùng ở banner HTML, tùy chọn |

PNG hiện tại là **placeholder** (tạo bằng `scripts/generate-image-placeholders.ps1`). Trên GitHub Pages vẫn hiển thị được qua thẻ `<img src="images/...">` trong HTML.

## Thay bằng screenshot SAP thật

1. Chụp trên **DEV** với object thật: `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `ZBI_FINS_ACDOC_FCAT`, `ZCL_IM_FINS_ACDOC_FCAT`.
2. **Che/mask**: system ID, client, username, package, transport request.
3. Crop chỉ vùng cần hướng dẫn; rộng khoảng **1200–1600px**, chữ đọc được.
4. Ghi đè file PNG **cùng tên** — không cần sửa HTML.

## Mẫu bố cục (không copy ảnh vào repo public)

- [SAP Community — SE19 BAdI (blog)](https://community.sap.com/t5/application-development-and-automation-blog-posts/adding-wrbtr-column-in-the-standard-report-rfumsv00-vat-report/ba-p/13242101)
- [SAP Community — deactivate BAdI](https://community.sap.com/t5/application-development-discussions/deactivate-the-badi-implementation/td-p/3276063)

Chỉ tham khảo layout; ảnh blog/help thường có bản quyền — ưu tiên ảnh tự chụp.

## SVG cũ (có thể xóa sau khi có PNG đủ bộ)

`01-object-tree.svg`, `02-se19-create.svg`, `03-se19-impl-tree.svg`, `04-se24-methods.svg` — bản minh họa cũ, HTML chính dùng tên file ở bảng trên.
