# GET BADI

[← Home](Home.md)

## Mục đích

Tạo **BAdI object** mới và gán reference vào biến BAdI — handle cho các object plug-in.

## Cú pháp (tóm tắt)

```abap
GET BADI badi [FILTERS f1 = x1 f2 = x2 ...]
          | { badi TYPE (name) [FILTERS ... | FILTER-TABLE ftab] }
          [CONTEXT con].
```

- **FILTERS** — gán giá trị filter (static)
- **FILTER-TABLE** — bảng `BADI_FILTER_BINDINGS` (dynamic)
- **CONTEXT** — bắt buộc với context-dependent BAdI; không dùng với context-free

## Runtime (rút gọn)

1. Hệ thống tìm BAdI implementation classes phù hợp filter
2. Tạo hoặc reuse object plug-in
3. Single-use BAdI: không có hoặc nhiều hit → exception

## Liên quan disable

Implementation **inactive** không được chọn khi `GET BADI` resolve plug-in.

## Nguồn

- [ABAPGET_BADI — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html)
