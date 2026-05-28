# Hình minh họa / Screenshot

## File SVG (đã có — hiển thị trên GitHub Pages)

| File | Nội dung |
|------|----------|
| `01-object-tree.svg` | Sơ đồ object Standard vs Z* |
| `02-se19-create.svg` | SE19 — Create Implementation |
| `03-se19-impl-tree.svg` | SE19 — cây ZEI / ZBI / Active |
| `04-se24-methods.svg` | SE24 — interface methods |
| `05-bcf-flow.svg` | Luồng BCF → BAdI → ACDOCA |

Đây là **minh họa** (không phải screenshot SAP thật). Dùng cho team xem nhanh trước khi có ảnh hệ thống.

## Thay bằng screenshot thật (khuyến nghị)

Chụp trên **DEV**, đặt PNG cùng tên (hoặc cập nhật HTML):

| Tên file PNG gợi ý | Transaction | Ghi chú |
|--------------------|-------------|---------|
| `02-se19-create.png` | SE19 | New BAdI + spot `ES_FINS_ACDOCA` |
| `03-se19-impl-tree.png` | SE19 | ZEI + ZBI + Active |
| `04-se24-methods.png` | SE24 | `IF_BADI_FINS_ACDOC_FIELDCAT` parameters |
| `06-se19-deactivate.png` | SE19 | Inactive / deactivate |
| `07-faglbcvtr.png` | FAGLGVTR | Test BCF |

Sau khi có PNG: sửa `Huong_dan_BADI_FINS_ACDOC.html` — đổi `src` từ `.svg` sang `.png` hoặc thêm `<picture>`.

## Ảnh SAP Help (tham khảo ngoài)

SAP có screenshot trong tài liệu *Building Your First BAdI* (SE19/SE80) — xem link trong [SAP Help](https://help.sap.com/doc/saphelp_snc700_ehp04/7.0.4/en-US/44/f5175e19fd2463e10000000a1553f7/content.htm). Không copy vào repo public nếu chưa rõ license; ưu tiên ảnh tự chụp trên hệ DEV.
