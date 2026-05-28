# BAdI implementation class

[← Home](Home.md)

## Định nghĩa (SAP)

Global class implement một hoặc nhiều **BAdI interfaces** (và các BAdI methods của interface).

- Thành phần chính của BAdI implementation
- Instance = **object plug-in** cho functional enhancement của ABAP programs

Class **không** thuộc BAdI implementation vẫn có thể dùng làm **fallback BAdI implementation class**.

## Nơi viết code (case ACDOCA)

| Viết code | Không viết code |
|-----------|------------------|
| `ZCL_IM_*` (implementation class) | `IF_BADI_*` (interface) |

Debug: breakpoint trên method trong class, ví dụ  
`IF_BADI_FINS_ACDOC_FIELDCAT~CHANGE_ACTIVE_FIELDS_BCF_OI`.

## Nguồn

- [ABENBADI_IMPLEMENT_CLASS_GLOSRY — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html)
