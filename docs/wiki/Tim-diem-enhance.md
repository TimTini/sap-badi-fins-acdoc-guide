# Cách tìm điểm enhance

[← Home](Home.md) · [Hướng dẫn §7](../Huong_dan_BADI_FINS_ACDOC.md#7-cách-tìm-điểm-để-enhance--tổng-quát)

## Tóm tắt

1. Viết rõ **mục đích runtime** (hook ở bước nào).
2. Xác định **transaction/process** → tìm `GET BADI` / `CALL BADI`.
3. **SE84** (package → Enhancements) hoặc **SE24** (`CL_EXITHANDLER`).
4. Đọc **method signature** — cần đổi dữ liệu thì thường cần `CHANGING`.
5. Kiểm tra **filter** và **active**.
6. **Debug** xác nhận BAdI chạy thật.

## Case Finance (BCF / ACDOCA)

| T-code | Việc làm |
|--------|----------|
| `SE19` | `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT` |
| `SE24` | `IF_BADI_FINS_ACDOC_FIELDCAT` → `CHANGE_ACTIVE_FIELDS_BCF_*` |
| `FAGLGVTR` | Where-used / `GET BADI` trong luồng BCF |

Chi tiết: [Hướng dẫn đầy đủ §7](../Huong_dan_BADI_FINS_ACDOC.html#tim-enhance).

## Nguồn

[S9–S16](../Huong_dan_BADI_FINS_ACDOC.md#nguồn-tham-khảo) trong hướng dẫn chính.
