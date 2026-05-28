# Cách tìm điểm enhance

[← Home](Home.md) · [Hướng dẫn §7](../Huong_dan_BADI_FINS_ACDOC.md#7-cách-tìm-điểm-để-enhance--tổng-quát)

## Mục đích

Tóm tắt cách tìm BAdI / enhancement spot theo mục đích runtime. Chi tiết đầy đủ nằm ở hướng dẫn chính §7.

## Nội dung chính

1. Viết mục đích runtime (hook ở bước nào).
2. Xác định transaction/process → tìm `GET BADI` / `CALL BADI`.
3. `SE84` (package → Enhancements) hoặc `SE24` (`CL_EXITHANDLER`).
4. Đọc method signature — cần `CHANGING` nếu muốn đổi dữ liệu.
5. Kiểm tra filter và active.
6. Debug xác nhận trong `ZCL_*`.

**Case Finance:** `SE19` → `ES_FINS_ACDOCA` / `BADI_FINS_ACDOC_FIELDCAT`; method `CHANGE_ACTIVE_FIELDS_BCF_*`; test `FAGLGVTR`.

## Kiểm tra / Cách xác minh

- Breakpoint trong `ZCL_IM_FINS_ACDOC_FCAT` trước khi chạy BCF.
- Nếu không dừng: kiểm tra active, filter, đúng user/job (`SM37` + `JDBG`).

## Link nguồn

- Hướng dẫn đầy đủ §7: [Huong_dan_BADI_FINS_ACDOC.md](../Huong_dan_BADI_FINS_ACDOC.md#7-cách-tìm-điểm-để-enhance--tổng-quát) — quy trình 6 bước + case Finance
- SAP Library — Enhancement Concept: https://help.sap.com/saphelp_ewm900/helpdata/en/42/d356adddec036fe10000000a114cbd/content.htm — enhancement option, hook
- SAP Support — find classic BAdIs: https://help.sap.com/docs/SUPPORT_CONTENT/abaphowto/3353523789.html — SE84, package
