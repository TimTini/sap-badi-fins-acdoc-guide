# CALL BADI

[← Home](Home.md)

## Mục đích

Gọi **BAdI method** trên tất cả object plug-in mà BAdI object đang tham chiếu.

## Cú pháp (tóm tắt)

```abap
CALL BADI badi->meth parameter_list
   | badi->(meth_name) {parameter_list | parameter_tables}.
```

- Static: `badi` có static type của BAdI class; `meth` là method của BAdI interface
- Dynamic: `badi` type `CL_BADI_BASE`; `meth_name` là tên method IN UPPERCASE

## Hành vi quan trọng

- Gọi method trên **mọi** plug-in được reference
- **Multiple use**: thứ tự gọi theo định nghĩa BAdI implementations; `badi` initial → không effect
- **Single use**: `badi` phải valid; initial → exception
- Method mới thêm vào BAdI nhưng implementation chưa có → gọi như empty implementation

## Nguồn

- [ABAPCALL_BADI — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html)
