# Enhancements Using BAdIs

[← Home](Home.md)

## Định nghĩa (SAP)

- BAdI + vị trí gọi trong ABAP program = **explicit enhancement options**, gán vào **enhancement spots**.
- Trên hệ follow-on, tạo **BAdI implementations** để enhance.
- BAdI implementation chủ yếu gồm **BAdI implementation class**; instance hoạt động như **object plug-in** tại runtime.
- Trong Enhancement Framework, BAdI implementation là **enhancement implementation element**, do **enhancement implementations** quản trị.

## Cấu trúc BAdI definition

- **BAdI interface** — khai báo BAdI methods
- **Filters** — chọn implementation
- Setting: single/multiple use, fallback class, context-free/dependent, …

## ABAP statements

| Statement | Mục đích |
|-----------|----------|
| `GET BADI` | Tạo BAdI object (handle cho object plug-ins) |
| `CALL BADI` | Gọi BAdI methods trên plug-ins |

Có thể bật/tắt qua **Switch Framework**.

## Gợi ý thực hành

- BAdI **single use**: nên có fallback implementation class trên cùng hệ định nghĩa BAdI.
- Method BAdI interface có thể **optional** (`DEFAULT`).

## Nguồn

- [ABENBADI_ENHANCEMENT — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html)
