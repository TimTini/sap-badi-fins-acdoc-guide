# Custom field ACDOCA trống sau Balance Carryforward (S/4HANA)

## Mục đích

Repo này chứa tài liệu giải thích hiện tượng custom field trên `ACDOCA` bị trống sau khi chạy **Balance Carryforward** sau upgrade S/4HANA.

Đường đọc khuyến nghị:

1. Đọc [docs/Gioi_thieu_BADI.md](docs/Gioi_thieu_BADI.md) nếu chưa quen BAdI.
2. Đọc [docs/Huong_dan_BADI_FINS_ACDOC.md](docs/Huong_dan_BADI_FINS_ACDOC.md) để hiểu case ACDOCA / BCF.
3. Mở [docs/sources/](docs/sources/README.md) khi cần đối chiếu nguồn SAP mirror trong repo.

## Xem trên web

Sau khi bật GitHub Pages cho repo này, mở trang chủ tại URL Pages của repository (Settings → Pages → branch `main`, folder `/docs`).

Trang chủ: [docs/index.html](docs/index.html) → Hướng dẫn HTML → Wiki → Sources mirror.

## Nội dung chính

| File | Mô tả |
|------|--------|
| [docs/Gioi_thieu_BADI.md](docs/Gioi_thieu_BADI.md) | **Đọc trước** — BAdI, object, luồng tạo implementation (SAP Keyword Doc) |
| [docs/Huong_dan_BADI_FINS_ACDOC.md](docs/Huong_dan_BADI_FINS_ACDOC.md) | Case ACDOCA / BCF + phụ lục kỹ thuật — Markdown |
| [docs/Gioi_thieu_BADI.html](docs/Gioi_thieu_BADI.html) | Giới thiệu BAdI — HTML |
| [docs/Huong_dan_BADI_FINS_ACDOC.html](docs/Huong_dan_BADI_FINS_ACDOC.html) | Case ACDOCA / BCF — HTML; build: `node docs/scripts/build-guide-html.mjs` |
| [docs/wiki/index.html](docs/wiki/index.html) | **Wiki tra cứu nhanh** — cổng vào tài liệu SAP ABAP (Cloud) |
| [docs/wiki/Home.md](docs/wiki/Home.md) | Mục lục wiki (Markdown / GitHub) |
| [docs/sources/](docs/sources/README.md) | **Mirror nguồn SAP** — ABAP doc, KBA, Community, FINSC_ACDOC_FCT |

### Wiki — xem nhanh

1. Mở [docs/index.html](docs/index.html) (local hoặc GitHub Pages).
2. Chọn chủ đề (HTML hoặc `.md`): BAdI, Enhancement Implementation, GET/CALL BADI, …
3. Nội dung trích từ SAP ABAP Keyword Documentation; link SAP Help đầy đủ trong từng trang.

## Phạm vi

- **Bước 1:** giới thiệu BAdI và object Enhancement Framework
- **Bước 2:** case ACDOCA blank sau BCF, hướng xử lý, kiểm tra, phụ lục SE19/code
- Case: `BADI_FINS_ACDOC_FIELDCAT` / `ES_FINS_ACDOCA`

## Kiểm tra / Cách xác minh

- Mở `docs/Gioi_thieu_BADI.md` trước khi làm trên hệ SAP nếu người đọc chưa biết BAdI.
- Đối chiếu claim kỹ thuật trong `docs/Huong_dan_BADI_FINS_ACDOC.md` với mục **Link nguồn** ở cuối file.
- Trên hệ DEV, xác nhận object và signature thật bằng `SE19` / `SE24` trước khi copy code mẫu.
- Nếu dùng bản HTML, build lại bằng `node docs/scripts/build-guide-html.mjs` sau khi sửa Markdown.

## Link nguồn

- SAP Help — Balance Carryforward in G/L Accounting: https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html — dùng để xác minh BAdI `BADI_FINS_ACDOC_FIELDCAT`, enhancement spot `ES_FINS_ACDOCA`, và field catalog cho Balance Carryforward.
- SAP KBA 3588343 preview: https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — dùng để xác minh triệu chứng ACDOCA extended items blank sau balance carryforward và keyword `CHANGE_ACTIVE_FIELDS_BCF_OI`.
- SAP ABAP Keyword Documentation — BAdI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html — dùng để xác minh khái niệm BAdI, interface, filter, setting.
- SAP ABAP Keyword Documentation — Enhancements Using BAdIs: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html — dùng để xác minh quan hệ BAdI, enhancement spot, implementation class, `GET BADI`, `CALL BADI`.
- Mirror nguồn trong repo: [docs/sources/](docs/sources/README.md) — dùng để đọc lại bản mirror đã lưu ngày 2026-05-02.

## Lưu ý triển khai

Tên object/method ví dụ trong tài liệu mang tính minh họa. Trước khi triển khai trên hệ thống thật, xác nhận signature và parameter trong `SE19` / `SE24`.

Nguồn tham chiếu: SAP ABAP Keyword Documentation (Cloud) — liên kết trong cuối tài liệu.

## License

Tài liệu kỹ thuật tham khảo; nội dung SAP standard thuộc bản quyền SAP SE.
