# BAdI — khái niệm

[← Home](Home.md)

**Business Add-In** — template cho BAdI object.

## Định nghĩa (SAP)

Một BAdI gồm:

- **BAdI interface** — khai báo method
- **Bộ filter** — chọn implementation khi gọi
- **Các setting** — single/multiple use, context, fallback class, …

BAdI là cơ sở để gọi method trên **object plug-in** trong chương trình ABAP; caller điều khiển implementation nào được dùng qua **filter values**.

## Liên quan case Finance

| SAP standard | Vai trò |
|--------------|---------|
| `BADI_FINS_ACDOC_FIELDCAT` | BAdI definition |
| `IF_BADI_FINS_ACDOC_FIELDCAT` | Interface — không viết code |

## Nguồn

- [ABENBADI_GLOSRY — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html)
