# BAdI implementation

[← Home](Home.md)

## Định nghĩa (SAP)

Implementation của một BAdI. **Nhiều** BAdI implementation có thể gán cho **một** BAdI.

Gồm:

- **BAdI implementation class**
- **Filter condition** — chọn implementation trong `GET BADI`

## Trạng thái active / inactive

BAdI implementation có thể ở trạng thái **active** hoặc **inactive**.

Trạng thái **inactive** ghi đè cả:

- setting Switch Framework
- filter condition

→ Đây là cách **disable chuẩn** (ưu tiên hơn comment code trong class).

## Thao tác liên quan

| Thao tác | Gợi ý |
|----------|--------|
| Disable | SE19 → inactive / deactivate implementation |
| Xóa | Deactivate → test → xóa `ZBI_*` → xóa `ZEI_*` |

## Nguồn

- [ABENBADI_IMPLEMENTATION_GLOSRY — SAP Help](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html)
