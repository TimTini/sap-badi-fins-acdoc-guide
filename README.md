# Custom field ACDOCA trống sau Balance Carryforward (S/4HANA)

Tài liệu giải thích hiện tượng, nguyên nhân và hướng xử lý khi custom field trên `ACDOCA` bị trống sau BCF sau upgrade; phụ lục kỹ thuật mô tả thao tác BAdI `BADI_FINS_ACDOC_FIELDCAT`.

## Xem trên web

Sau khi bật GitHub Pages cho repo này, mở trang chủ tại URL Pages của repository (Settings → Pages → branch `main`, folder `/docs`).

Trang chủ: [docs/index.html](docs/index.html) → Hướng dẫn HTML → Wiki → Sources mirror.

## Nội dung

| File | Mô tả |
|------|--------|
| [docs/Huong_dan_BADI_FINS_ACDOC.md](docs/Huong_dan_BADI_FINS_ACDOC.md) | Hiện tượng / hướng xử lý + phụ lục kỹ thuật — Markdown |
| [docs/Huong_dan_BADI_FINS_ACDOC.html](docs/Huong_dan_BADI_FINS_ACDOC.html) | Bản HTML (dark theme); build: `node docs/scripts/build-guide-html.mjs` |
| [docs/wiki/index.html](docs/wiki/index.html) | **Wiki tra cứu nhanh** — cổng vào tài liệu SAP ABAP (Cloud) |
| [docs/wiki/Home.md](docs/wiki/Home.md) | Mục lục wiki (Markdown / GitHub) |
| [docs/sources/](docs/sources/README.md) | **Mirror nguồn SAP** — ABAP doc, KBA, Community, FINSC_ACDOC_FCT |

### Wiki — xem nhanh

1. Mở [docs/index.html](docs/index.html) (local hoặc GitHub Pages).
2. Chọn chủ đề (HTML hoặc `.md`): BAdI, Enhancement Implementation, GET/CALL BADI, …
3. Nội dung trích từ SAP ABAP Keyword Documentation; link SAP Help đầy đủ trong từng trang.

## Phạm vi

- Phần chính: hiện tượng sau upgrade, nguyên nhân, hướng xử lý BAdI, kiểm tra, ảnh hưởng
- Phụ lục: khái niệm BAdI, tạo/disable/xóa implementation, code mẫu, debug, lỗi thường gặp
- Case: `BADI_FINS_ACDOC_FIELDCAT` / `ES_FINS_ACDOCA`

## Lưu ý triển khai

Tên object/method ví dụ trong tài liệu mang tính minh họa. Trước khi triển khai trên hệ thống thật, xác nhận signature và parameter trong `SE19` / `SE24`.

Nguồn tham chiếu: SAP ABAP Keyword Documentation (Cloud) — liên kết trong cuối tài liệu.

## License

Tài liệu kỹ thuật tham khảo; nội dung SAP standard thuộc bản quyền SAP SE.
