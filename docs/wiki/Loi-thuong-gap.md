# Lỗi thường gặp

[← Home](Home.md) · [Chi tiết §8](../Huong_dan_BADI_FINS_ACDOC.md#8-lỗi-thường-gặp)

## Mục đích

Bảng tra nhanh lỗi BAdI / BCF liên quan `BADI_FINS_ACDOC_FIELDCAT`. Bảng đầy đủ: [hướng dẫn §8](../Huong_dan_BADI_FINS_ACDOC.md#8-lỗi-thường-gặp).

## Nội dung chính

| Triệu chứng | Xử lý nhanh |
|-------------|-------------|
| Field trống sau BCF | `FINSC_ACDOC_FCT` + BAdI `CHANGE_ACTIVE_FIELDS_BCF_*` — [KBA 3588343](../sources/sap-kba/KBA-3588343.md) |
| Breakpoint không dừng | Debug `ZCL_*`, đúng user, `SM37`+`JDBG` |
| `CX_BADI_NOT_IMPLEMENTED` | Activate `ZBI_*` / fallback — [GET BADI](../sources/sap-abap-cloud/3008-ABAPGET_BADI.md) |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | Một implementation active (single-use) |
| Sai parameter | `SE24` → signature thật, không copy `ct_active_fields` mù |

## Kiểm tra / Cách xác minh

Sau khi xử lý: chạy lại `FAGLGVTR`, xem field trên line item năm mới; nếu dump → `ST22` + short text exception.

## Link nguồn

- Hướng dẫn §8: [Huong_dan_BADI_FINS_ACDOC.md](../Huong_dan_BADI_FINS_ACDOC.md#8-lỗi-thường-gặp) — bảng đầy đủ + exception class
- SAP KBA 3588343: https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — ACDOCA blank sau BCF
