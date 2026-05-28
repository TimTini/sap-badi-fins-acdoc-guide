# FINSC_ACDOC_FCT — Field catalog ACDOCA (tóm tắt)

**Mục đích:** Bảng customizing mô tả field nào dùng cho nghiệp vụ nào trên Universal Journal (`ACDOCA`).

**Package (tham khảo):** `FINS_ACDOC_CUST` — Unified Journal Entry Customizing.

## Cột liên quan Balance Carryforward

| Cột | Ý nghĩa (rút gọn) |
|-----|-------------------|
| `FIELD` | Tên field (key) |
| `BCF_PL_FIELD` | Field dùng cho BCF P&L |
| `BCF_BS_FIELD` | Field dùng cho BCF Balance Sheet |
| `GL_OIM_FIELD` | Field liên quan open item management |
| `GL_TOT_FIELD` | G/L totals |
| `GL_REP_FIELD` | G/L reporting |

*(Còn nhiều cột `GL_*` khác — xem dictionary trên hệ thống.)*

## Liên hệ BAdI `BADI_FINS_ACDOC_FIELDCAT`

- Customizing `FINSC_ACDOC_FCT` định nghĩa **catalog / relevance** ở mức field.
- BAdI `CHANGE_ACTIVE_FIELDS_BCF_BS` / `_PL` / `_OI` cho phép **bổ sung** field vào danh sách active khi chạy BCF (runtime), ví dụ khi field chưa được BCF pick đúng sau upgrade.

## Kiểm tra trên hệ thống

```text
SE16 / SE16N → FINSC_ACDOC_FCT → FIELD = <tên field custom>
```

Hoặc app customizing tương ứng theo release (S/4).

## Nguồn tham khảo công khai

- SAP table documentation / SAP Help — search `FINSC_ACDOC_FCT`
- KBA 3588343 (keywords ACDOCA, BCF, `BADI_FINS_ACDOC_FIELDCAT`)
