# Hướng dẫn BAdI `BADI_FINS_ACDOC_FIELDCAT`

> Tài liệu ngắn gọn bằng tiếng Việt, dùng cho thao tác cơ bản với BAdI trong SAP S/4HANA Finance.  
> Trọng tâm: hiểu BAdI, Enhancement Implementation, BAdI Implementation, Implementation Class, và 3 thao tác: **Tạo**, **Disable**, **Xóa**.

---

## 0. Cơ bản: BAdI là gì?

### BAdI là gì?

BAdI là viết tắt của **Business Add-In**. Trong ABAP Keyword Documentation, BAdI là template cho BAdI object, gồm BAdI interface, filters và các setting liên quan. [[S1]](#nguon-tham-khao)

BAdI cho phép implement enhancement cho ứng dụng SAP standard mà không sửa original code của SAP. [[S2]](#nguon-tham-khao)

Trong ABAP enhancement concept, BAdI và điểm gọi của nó trong chương trình ABAP tạo thành explicit enhancement options và được gán vào enhancement spots. [[S3]](#nguon-tham-khao)

### Enhance BAdI là gì?

Với New BAdI, khi tạo implementation trong Enhancement Framework, bạn quản trị nó thông qua **enhancement implementation**. [[S4]](#nguon-tham-khao)

Sau đó tạo **BAdI implementation** và gắn vào BAdI definition tương ứng trong spot. [[S4]](#nguon-tham-khao)

Trong SE19, thao tác thường gặp là chọn **New BAdI**, nhập **Enhancement Spot**, rồi tạo enhancement implementation. [[S5]](#nguon-tham-khao)

### Implementation Class là gì?

ABAP Keyword Documentation nói BAdI chủ yếu gồm **BAdI implementation class**, và instance của class này enhance function của ABAP program tại runtime như một object plug-in. [[S3]](#nguon-tham-khao)

ABAP Glossary nói BAdI implementation classes là thành phần chính của BAdI implementations, và instance của chúng hoạt động như object plug-ins cho functional enhancements của ABAP programs. [[S6]](#nguon-tham-khao)

Vì vậy code ABAP được viết trong implementation class, còn interface BAdI chỉ khai báo các method mà implementation class phải implement. [[S3]](#nguon-tham-khao)

---

## 1. Quan hệ object trong BAdI

Áp vào case `BADI_FINS_ACDOC_FIELDCAT`:

```text
SAP Standard
└── Enhancement Spot: ES_FINS_ACDOCA
    └── BAdI Definition: BADI_FINS_ACDOC_FIELDCAT
        └── Interface: IF_BADI_FINS_ACDOC_FIELDCAT
            ├── CHANGE_ACTIVE_FIELDS_BCF_BS
            ├── CHANGE_ACTIVE_FIELDS_BCF_PL
            └── CHANGE_ACTIVE_FIELDS_BCF_OI

Customer Z*
└── Enhancement Implementation: ZEI_FINS_ACDOCA
    └── BAdI Implementation: ZBI_FINS_ACDOC_FCAT
        └── Implementation Class: ZCL_IM_FINS_ACDOC_FCAT
            ├── CHANGE_ACTIVE_FIELDS_BCF_BS code
            ├── CHANGE_ACTIVE_FIELDS_BCF_PL code
            └── CHANGE_ACTIVE_FIELDS_BCF_OI code
```

Tóm tắt:

| Object | Ví dụ | Vai trò |
|---|---|---|
| Enhancement Spot | `ES_FINS_ACDOCA` | Điểm mở rộng SAP standard |
| BAdI Definition | `BADI_FINS_ACDOC_FIELDCAT` | BAdI SAP cung cấp |
| Interface | `IF_BADI_FINS_ACDOC_FIELDCAT` | Khai báo method, không viết code ở đây |
| Enhancement Implementation | `ZEI_FINS_ACDOCA` | Container Z* của bạn |
| BAdI Implementation | `ZBI_FINS_ACDOC_FCAT` | Implementation cụ thể cho BAdI |
| Implementation Class | `ZCL_IM_FINS_ACDOC_FCAT` | Nơi viết code ABAP thật |

---

## 2. Tạo BAdI Implementation

### Mục tiêu

Tạo đủ 3 object customer:

```text
ZEI_FINS_ACDOCA
ZBI_FINS_ACDOC_FCAT
ZCL_IM_FINS_ACDOC_FCAT
```

### Các bước

1. Vào transaction:

```text
SE19
```

2. Chọn tạo implementation cho **New BAdI** hoặc theo **Enhancement Spot**.

3. Nhập enhancement spot:

```text
ES_FINS_ACDOCA
```

4. Tạo Enhancement Implementation, ví dụ:

```text
ZEI_FINS_ACDOCA
```

5. Trong Enhancement Implementation, tạo BAdI Implementation cho:

```text
BADI_FINS_ACDOC_FIELDCAT
```

6. Đặt tên BAdI Implementation, ví dụ:

```text
ZBI_FINS_ACDOC_FCAT
```

7. Tạo hoặc để SAP sinh Implementation Class, ví dụ:

```text
ZCL_IM_FINS_ACDOC_FCAT
```

8. Code trong class `ZCL_IM_FINS_ACDOC_FCAT`, không code trong interface `IF_BADI_FINS_ACDOC_FIELDCAT`.

### Method thường dùng

Nếu xử lý custom field ACDOCA bị blank trong Balance Carryforward với open-item-managed account, thường kiểm tra method:

```text
CHANGE_ACTIVE_FIELDS_BCF_OI
```

Nếu liên quan Balance Sheet:

```text
CHANGE_ACTIVE_FIELDS_BCF_BS
```

Nếu liên quan P&L:

```text
CHANGE_ACTIVE_FIELDS_BCF_PL
```

### Code mẫu

Thay `ZZBRANCH` bằng technical field name thật trong `ACDOCA`.
Trước khi code, luôn mở SE24 để xác nhận đúng tên CHANGING parameter trong hệ thống của bạn.

```abap
METHOD if_badi_fins_acdoc_fieldcat~change_active_fields_bcf_oi.

  CONSTANTS lc_field TYPE fieldname VALUE 'ZZBRANCH'.

  IF NOT line_exists( ct_active_fields[ fieldname = lc_field ] ).
    APPEND VALUE #( fieldname = lc_field ) TO ct_active_fields.
  ENDIF.

ENDMETHOD.
```

Nếu hệ thống không có parameter `ct_active_fields`, mở:

```text
SE24
→ IF_BADI_FINS_ACDOC_FIELDCAT
→ method cần xem
→ Parameters
```

Sau đó kiểm tra tên **CHANGING parameter** thật trong hệ thống của bạn và sửa code theo signature thực tế.

---

## 3. Disable / Deactivate

### Khi nào dùng?

Dùng khi muốn tắt ảnh hưởng runtime nhưng vẫn giữ object để sửa tiếp hoặc rollback.

### Các bước

1. Vào:

```text
SE19
```

2. Mở Enhancement Implementation:

```text
ZEI_FINS_ACDOCA
```

3. Chuyển sang Change mode.

4. Kiểm tra node BAdI Implementation:

```text
ZBI_FINS_ACDOC_FCAT
```

5. Deactivate implementation, hoặc tắt active flag nếu màn hình có.

6. Save và Activate lại object nếu hệ thống yêu cầu.

7. Test lại Balance Carryforward, ví dụ:

```text
FAGLGVTR
```

hoặc app **Carry Forward Balances**.

### Cách disable bằng code

Nếu không thấy nút deactivate rõ ràng, có thể comment logic trong class:

```abap
METHOD if_badi_fins_acdoc_fieldcat~change_active_fields_bcf_oi.

  "* Disabled: không append custom field nữa
  "* APPEND VALUE #( fieldname = 'ZZBRANCH' ) TO ct_active_fields.

ENDMETHOD.
```

Lưu ý: cách này vẫn làm BAdI được gọi, chỉ là không còn tác động logic.

---

## 4. Xóa implementation

### Thứ tự xóa khuyến nghị

1. Deactivate trước.
2. Test lại.
3. Xóa BAdI Implementation `ZBI_*` nếu còn.
4. Xóa Enhancement Implementation `ZEI_*`.
5. Xóa Implementation Class `ZCL_*` nếu không còn reference.
6. Activate và transport nếu cần.

### Không xóa SAP standard object

Không xóa các object sau:

```text
ES_FINS_ACDOCA
BADI_FINS_ACDOC_FIELDCAT
IF_BADI_FINS_ACDOC_FIELDCAT
```

Đây là SAP standard object.

### Kiểm tra còn sót `ZBI_*` không

Kiểm tra bằng 3 cách:

#### Cách 1: SE19

Vào:

```text
SE19
```

Thử mở:

```text
ZBI_FINS_ACDOC_FCAT
```

Nếu không tồn tại, nghĩa là đã xóa hoặc đã bị xóa theo parent container.

#### Cách 2: SE80

Vào:

```text
SE80
```

Mở package hoặc `$TMP`, kiểm tra:

```text
Enhancements
→ Enhancement Implementations
```

Tìm:

```text
ZEI_FINS_ACDOCA
ZBI_FINS_ACDOC_FCAT
```

#### Cách 3: SE84

Vào:

```text
SE84
```

Tìm trong phần:

```text
Enhancements
→ BAdI Implementations
```

Search:

```text
ZBI_FINS_ACDOC_FCAT
```

### Nếu đã xóa `ZEI_FINS_ACDOCA` trước

Nếu `ZBI_FINS_ACDOC_FCAT` nằm bên trong `ZEI_FINS_ACDOCA`, thì khi xóa hẳn `ZEI_FINS_ACDOCA`, `ZBI_FINS_ACDOC_FCAT` thường sẽ bị xóa theo.

Vẫn nên kiểm tra lại bằng:

```text
SE19
SE80
SE84
```

---

## 5. Debug nhanh

### Không debug trong interface

Không debug ở:

```text
SE24 → IF_BADI_FINS_ACDOC_FIELDCAT
```

Vì đây chỉ là interface.

### Debug trong implementation class

Mở class:

```text
SE24 → ZCL_IM_FINS_ACDOC_FCAT
```

Vào method:

```text
IF_BADI_FINS_ACDOC_FIELDCAT~CHANGE_ACTIVE_FIELDS_BCF_OI
```

Đặt breakpoint hoặc external breakpoint.

### Nếu chạy Fiori / HTTP

Dùng external breakpoint cho đúng SAP user đang chạy app.

### Nếu chạy background job

Dùng:

```text
SM37
→ chọn job
→ nhập JDBG
```

---

## 6. Checklist cuối

### Tạo

- [ ] Đúng Enhancement Spot: `ES_FINS_ACDOCA`
- [ ] Có Enhancement Implementation: `ZEI_*`
- [ ] Có BAdI Implementation: `ZBI_*`
- [ ] Có Implementation Class: `ZCL_*`
- [ ] Code nằm trong class, không nằm trong interface
- [ ] Đúng method: `BCF_OI`, `BCF_BS`, hoặc `BCF_PL`

### Disable

- [ ] Deactivate trước khi xóa
- [ ] Test lại BCF
- [ ] Không để object inactive ngoài ý muốn
- [ ] Có transport nếu cần đưa lên QA/PRD

### Xóa

- [ ] Không xóa SAP standard object
- [ ] Check `ZBI_*` còn không
- [ ] Check class còn reference không
- [ ] Check bằng `SE19`, `SE80`, `SE84`
- [ ] Activate và transport

---

## Nguồn tham khảo

### [S1] SAP ABAP Keyword Documentation — BAdI (Glossary)

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html

### [S2] SAP ABAP Keyword Documentation — ABAP - Enhancements

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html

### [S3] SAP ABAP Keyword Documentation — Enhancements Using BAdIs

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html

### [S4] SAP ABAP Keyword Documentation — enhancement implementation

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html

### [S5] SAP ABAP Keyword Documentation — BAdI implementation

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html

### [S6] SAP ABAP Keyword Documentation — BAdI implementation class

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html

---

## Ghi chú

Tài liệu này dùng để hướng dẫn thao tác và khái niệm cơ bản.

Các tên object/method cụ thể như `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `CHANGE_ACTIVE_FIELDS_BCF_*` là phần phụ thuộc hệ thống Finance thực tế, cần xác nhận trực tiếp trong `SE19`/`SE24` trước khi triển khai.

Khi triển khai thật, luôn kiểm tra signature method và parameter trực tiếp trong hệ thống SAP của bạn.
