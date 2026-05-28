# Lưu ý & ảnh hưởng

[← Home](Home.md) · [§9–§10](../Huong_dan_BADI_FINS_ACDOC.md#9-lưu-ý-quan-trọng)

## Mục đích

Ghi nhớ vận hành và phạm vi ảnh hưởng khi implement hoặc tắt BAdI `BADI_FINS_ACDOC_FIELDCAT`.

## Nội dung chính

### Lưu ý

- `SE24` → signature trước khi code; activate + transport đủ chain (`ZEI_*`, `ZBI_*`, `ZCL_*`).
- Disable chuẩn: **inactive** BAdI implementation trên `SE19`, không chỉ comment code.
- Không sửa object SAP standard (`ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `IF_BADI_*`).

### Ảnh hưởng

- BCF / opening balance `ACDOCA` — method `CHANGE_ACTIVE_FIELDS_BCF_OI` (open-item).
- QA/PRD lệch DEV nếu thiếu transport hoặc implementation inactive.

## Kiểm tra / Cách xác minh

- Sau transport: `SE19` mở `ZBI_FINS_ACDOC_FCAT` trên tier đích → active.
- Test BCF trên từng tier trước khi đóng change.

## Link nguồn

- Hướng dẫn §9–§10: [Huong_dan_BADI_FINS_ACDOC.md](../Huong_dan_BADI_FINS_ACDOC.md#luu-y) — lưu ý vận hành và bảng ảnh hưởng BCF
- SAP KBA 3588343: https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — ACDOCA blank sau BCF
- SAP ABAP — BAdI implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html — inactive trước khi xóa
