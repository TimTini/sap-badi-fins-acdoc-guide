# Hướng dẫn BAdI `BADI_FINS_ACDOC_FIELDCAT`

Tài liệu nội bộ team về thao tác BAdI trong SAP S/4HANA Finance (Balance Carryforward / ACDOCA field catalog).

## GitHub Pages (public)

**https://timtini.github.io/sap-badi-fins-acdoc-guide/**

Trang chủ → Hướng dẫn HTML → Wiki → Sources mirror.

## Nội dung

| File | Mô tả |
|------|--------|
| [docs/Huong_dan_BADI_FINS_ACDOC.md](docs/Huong_dan_BADI_FINS_ACDOC.md) | Hướng dẫn thao tác — Markdown |
| [docs/Huong_dan_BADI_FINS_ACDOC.html](docs/Huong_dan_BADI_FINS_ACDOC.html) | Hướng dẫn thao tác — HTML (mở trình duyệt) |
| [docs/wiki/index.html](docs/wiki/index.html) | **Wiki tra cứu nhanh** — cổng vào tài liệu SAP ABAP (Cloud) |
| [docs/wiki/Home.md](docs/wiki/Home.md) | Mục lục wiki (Markdown / GitHub) |
| [docs/sources/](docs/sources/README.md) | **Mirror nguồn SAP** — ABAP doc, KBA, Community, FINSC_ACDOC_FCT |

### Wiki — xem nhanh

1. Mở **[docs/index.html](docs/index.html)** hoặc **GitHub Pages** (xem bên dưới).
2. Chọn chủ đề (HTML hoặc `.md`): BAdI, Enhancement Implementation, GET/CALL BADI, …
3. Nội dung trích từ SAP ABAP Keyword Documentation; link SAP Help đầy đủ trong từng trang.

## Phạm vi

- Khái niệm: BAdI, Enhancement Implementation, BAdI Implementation, Implementation Class
- Thao tác: **Tạo**, **Disable**, **Xóa**, debug cơ bản
- Case: `BADI_FINS_ACDOC_FIELDCAT` / `ES_FINS_ACDOCA`

## Lưu ý triển khai

Tên object/method ví dụ trong tài liệu mang tính minh họa. Trước khi triển khai trên hệ thống thật, xác nhận signature và parameter trong `SE19` / `SE24`.

Nguồn tham chiếu: SAP ABAP Keyword Documentation (Cloud) — liên kết trong cuối tài liệu.

## License

Tài liệu kỹ thuật nội bộ; nội dung SAP standard thuộc bản quyền SAP SE.
