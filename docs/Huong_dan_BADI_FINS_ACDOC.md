# Hướng dẫn BAdI `BADI_FINS_ACDOC_FIELDCAT`

> Tài liệu ngắn gọn bằng tiếng Việt, dùng cho thao tác cơ bản với BAdI trong SAP S/4HANA Finance.  
> Trọng tâm: hiểu BAdI, Enhancement Implementation, BAdI Implementation, Implementation Class, và 3 thao tác: **Tạo**, **Disable**, **Xóa**.

---

## 0. Cơ bản: BAdI là gì?

### BAdI là gì?

BAdI là viết tắt của **Business Add-In**. Trong ABAP Keyword Documentation, BAdI là template cho BAdI object, gồm BAdI interface, filters và các setting liên quan. [[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html)

BAdI cho phép implement enhancement cho ứng dụng SAP standard mà không sửa original code của SAP. [[S2]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html)

Trong ABAP enhancement concept, BAdI và điểm gọi của nó trong chương trình ABAP tạo thành explicit enhancement options và được gán vào enhancement spots. [[S3]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html)

### Enhance BAdI là gì?

Với New BAdI, khi tạo implementation trong Enhancement Framework, bạn quản trị nó thông qua **enhancement implementation**. [[S4]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html)

Sau đó tạo **BAdI implementation** và gắn vào BAdI definition tương ứng trong spot. [[S4]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html)

Trong SE19, thao tác thường gặp là chọn **New BAdI**, nhập **Enhancement Spot**, rồi tạo enhancement implementation. [[S5]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html)

### Implementation Class là gì?

ABAP Keyword Documentation nói BAdI chủ yếu gồm **BAdI implementation class**, và instance của class này enhance function của ABAP program tại runtime như một object plug-in. [[S3]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html)

ABAP Glossary nói BAdI implementation classes là thành phần chính của BAdI implementations, và instance của chúng hoạt động như object plug-ins cho functional enhancements của ABAP programs. [[S6]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html)

Vì vậy code ABAP được viết trong implementation class, còn interface BAdI chỉ khai báo các method mà implementation class phải implement. [[S3]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html)

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

## 7. Cách tìm điểm để enhance — tổng quát

Phần này mô tả cách tìm **enhancement option** / BAdI theo mục đích runtime, không chỉ case append field ACDOCA.

### 7.1 Nguyên tắc nền tảng

Trong Enhancement Framework, **enhancement option** là “hook” gắn vào development object; khi runtime tới hook, enhancement tại đó được xử lý. [[S9]](https://help.sap.com/saphelp_ewm900/helpdata/en/42/d356adddec036fe10000000a114cbd/content.htm)

SAP chia **implicit** và **explicit** enhancement options. **Enhancement spot** chứa explicit options; **enhancement implementation** chứa phần tử implementation. [[S9]](https://help.sap.com/saphelp_ewm900/helpdata/en/42/d356adddec036fe10000000a114cbd/content.htm)

**Cách hỏi đúng:** không bắt đầu bằng “append field ở đâu?”, mà: *SAP standard cho hook ở bước runtime nào?*

### 7.2 BAdI không chỉ để append field

BAdI là enhancement qua **object plug-in**; method BAdI được gọi trong chương trình ABAP. [[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html) · [[S12]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENOBJECT_PLUGIN_GLOSRY.html)

Khả năng enhance phụ thuộc **tên method**, **documentation**, và **IMPORTING / CHANGING / EXPORTING**. [[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html)

**BAdI ≠ append field.** Append field chỉ là một mục đích khi method cho phép đổi field catalog, active fields hoặc structure liên quan.

### 7.3 Mục đích thường gặp (khung thực hành)

Không phải danh sách official cố định của SAP; căn cứ: BAdI method gọi tại runtime. [[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html)

| Mục đích | Nhận diện BAdI phù hợp | Từ khóa method |
|----------|------------------------|----------------|
| Validate dữ liệu | Có input + trả lỗi/message/exception | `CHECK`, `VALIDATE`, `BEFORE_SAVE` |
| Derive / default | Có `CHANGING` cho field/structure | `DERIVE`, `DEFAULT`, `FILL`, `DETERMINE` |
| Đổi logic xử lý | Nhận dữ liệu nghiệp vụ, đổi kết quả | `CHANGE`, `PROCESS`, `DETERMINE` |
| Field catalog / output | Table field catalog hoặc active fields | `FIELD`, `FIELDCAT`, `ACTIVE_FIELDS`, `OUTPUT` |
| Mapping / integration | Mapping, inbound/outbound, interface | `MAP`, `INBOUND`, `OUTBOUND`, `INTERFACE` |
| Action / event | Gọi tại event trong process | `EVENT`, `ACTION`, `POST`, `SAVE` |
| Chọn implementation | Có filter hoặc caller truyền filter | `FILTER`, `FLT_VAL` |

### 7.4 Quy trình tìm BAdI theo mục đích

#### Bước 1 — Viết rõ mục đích runtime

```text
Tôi muốn can thiệp tại thời điểm ___ để thay đổi/kiểm tra ___.
```

Ví dụ:

```text
Can thiệp trước khi Balance Carryforward xác định active fields
để thêm custom field ACDOCA.
```

#### Bước 2 — Xác định process / transaction

BAdI chỉ có tác dụng khi standard gọi tới điểm `GET BADI` / `CALL BADI`. [[S10]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html) · [[S11]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html)

Debug: tìm `GET BADI` hoặc `CALL BADI` trong luồng chạy.

#### Bước 3 — Tìm theo package hoặc transaction

- **SE84:** package → **Enhancements** → BAdI definitions. [[S13]](https://help.sap.com/docs/SUPPORT_CONTENT/abaphowto/3353523789.html)
- **SE24:** class `CL_EXITHANDLER` (classic BAdI theo transaction). [[S14]](https://help.sap.com/docs/SUPPORT_CONTENT/abap/3353525647.html)

```text
1. Xác định transaction/app/process.
2. Tìm program/package liên quan.
3. SE84 → Enhancements → Business Add-Ins → Definitions.
4. Search theo package hoặc keyword nghiệp vụ.
```

#### Bước 4 — Đọc method signature

```text
Method name · Documentation
IMPORTING / CHANGING / EXPORTING
Exceptions / messages (nếu có)
```

Cần **đổi dữ liệu** → thường phải có `CHANGING` hoặc cơ chế trả kết quả. Method chỉ `IMPORTING` thường chỉ đọc/kiểm tra. [[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html)

#### Bước 5 — Filter, multiple use, điều kiện gọi

```text
Implementation đã active?
Có filter? Filter value khớp runtime?
Process có đi qua BAdI này?
```

[[S1]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html) · [[S5]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html)

#### Bước 6 — Debug xác nhận

External breakpoint (đúng ABAP user) hoặc dynamic breakpoint (statement/message/exception). [[S15]](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829321ffa326a/4ec121276e391014adc9fffe4e204223.html) · [[S16]](https://help.sap.com/docs/abap-cloud/abap-development-tools-user-guide/setting-dynamic-breakpoints)

```text
1. Breakpoint trong ZCL_* (hoặc debug GET/CALL BADI).
2. Chạy transaction/app đúng scenario.
3. Kiểm tra BAdI có dừng và parameter có dữ liệu cần không.
4. Không dừng → kiểm tra filter, active, user, job/Fiori.
```

### 7.5 Checklist chọn đúng BAdI

```text
[ ] Đúng module/process đang chạy
[ ] Đúng thời điểm runtime
[ ] Method name/documentation khớp mục đích
[ ] Signature có dữ liệu cần đọc/đổi
[ ] Đổi dữ liệu → có CHANGING hoặc cơ chế trả kết quả
[ ] Filter (nếu có) khớp runtime
[ ] Đã debug xác nhận BAdI chạy thật
```

### 7.6 Áp lại case `BADI_FINS_ACDOC_FIELDCAT`

Mục đích: append custom field ACDOCA vào **active field list** của Balance Carryforward.

Method phù hợp:

```text
CHANGE_ACTIVE_FIELDS_BCF_OI
CHANGE_ACTIVE_FIELDS_BCF_BS
CHANGE_ACTIVE_FIELDS_BCF_PL
```

Tên method đã thể hiện can thiệp active fields cho BCF.

**Tìm nhanh (Finance):**

| Bước | Transaction | Việc làm |
|------|-------------|----------|
| 1 | `SE19` | `BADI_FINS_ACDOC_FIELDCAT` / `ES_FINS_ACDOCA` |
| 2 | `SE24` | `IF_BADI_FINS_ACDOC_FIELDCAT` → method / parameter |
| 3 | Where-used | BAdI hoặc interface → program standard gọi BAdI |
| 4 | `SE84` / `SE18` | Enhancements → spot/BAdI; keyword `ACDOC`, `BCF`, `FINS` |
| 5 | `FAGLGVTR` | Tìm `GET BADI` / `CALL BADI` trong luồng BCF |

Mục đích khác append field → quay lại quy trình §7.4: *mục đích runtime → transaction → SE84/debug → signature → filter → debug*.

---

## 8. Lỗi thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Hướng xử lý |
|-------------|------------------------|-------------|
| Custom field ACDOCA **trống sau BCF** | Field chưa BCF-relevant; thiếu entry catalog / chưa append qua BAdI | Kiểm tra `FINSC_ACDOC_FCT`; implement `CHANGE_ACTIVE_FIELDS_BCF_*` — xem [KBA 3588343](sources/sap-kba/KBA-3588343.md) |
| Breakpoint **không dừng** | Debug nhầm interface; user/job khác; chưa active implementation | Debug class `ZCL_*`; external breakpoint đúng user; SM37 + `JDBG` cho job |
| `CX_BADI_NOT_IMPLEMENTED` | Single-use BAdI, không có implementation active | Tạo/activate `ZBI_*` hoặc fallback class (SAP gợi ý) — [GET BADI](sources/sap-abap-cloud/3008-ABAPGET_BADI.md) |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | Single-use nhưng nhiều implementation active | Chỉ giữ một implementation active hoặc kiểm tra filter |
| `CX_BADI_FILTER_ERROR` | Sai filter khi `GET BADI` | Kiểm tra filter definition và giá trị `FILTERS` / `FILTER-TABLE` |
| `CX_BADI_INITIAL_REFERENCE` / lỗi CALL | `badi` initial (single-use) | Đảm bảo `GET BADI` thành công trước `CALL BADI` |
| Syntax error trong implementation | Sai tên CHANGING parameter | `SE24` → signature thật; không copy mù `ct_active_fields` |
| BCF QA/PRD khác DEV | Thiếu transport / implementation inactive | Transport `ZEI_*`/`ZBI_*`/`ZCL_*`; activate đủ chain |
| Comment code nhưng vẫn “có BAdI” | Disable không chuẩn | Ưu tiên **inactive** BAdI implementation trong SE19 [[S5]](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html) |

**Exception class (tham khảo):** `CX_BADI_CONTEXT_ERROR`, `CX_BADI_FILTER_ERROR`, `CX_BADI_NOT_IMPLEMENTED`, `CX_BADI_MULTIPLY_IMPLEMENTED`, `CX_BADI_UNKNOWN_ERROR` — chi tiết trong [GET BADI](sources/sap-abap-cloud/3008-ABAPGET_BADI.md).

---

## 9. Lưu ý quan trọng

### Trước khi code

- Luôn xác nhận **method** đúng: `BCF_OI` (open item), `BCF_BS`, `BCF_PL`.
- Xác nhận **CHANGING parameter** trên `SE24` — không giả định tên parameter.
- Kiểm tra customizing field: `FINSC_ACDOC_FCT` — [tóm tắt](sources/finance/FINSC_ACDOC_FCT.md).

### Khi vận hành

- **Activate** enhancement implementation + BAdI implementation + class sau mỗi thay đổi.
- **Transport** theo thứ tự DEV → QA → PRD; test BCF trên từng tier.
- **Disable:** inactive implementation (chuẩn) trước khi xóa object.
- **Không sửa** SAP standard: `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `IF_BADI_*`.

### Public Cloud vs on-prem

- Public Cloud: custom field BCF có thể bị giới hạn bởi extensibility — [tóm tắt Community](sources/sap-community/balance-carryforward-custom-fields.md).
- On-prem / private: BAdI `BADI_FINS_ACDOC_FIELDCAT` thường là hướng xử lý khi field đã có trên ACDOCA nhưng BCF bỏ qua.

---

## 10. Ảnh hưởng liên quan

| Vùng | Ảnh hưởng khi implement / disable BAdI |
|------|----------------------------------------|
| **Balance Carryforward** | Field có/không xuất hiện trong active fields khi chạy BCF → ảnh hưởng số dư đầu kỳ ACDOCA |
| **Open item managed accounts** | Method `CHANGE_ACTIVE_FIELDS_BCF_OI` — case KBA 3588343 |
| **P&L / Balance Sheet** | Method `BCF_PL` / `BCF_BS` — phân loại field theo loại BCF |
| **Display / reporting** | Line items năm mới có thể thiếu cột custom field dù có posting |
| **Upgrade S/4** | Sau upgrade, extended items có thể blank nếu chưa khai báo lại relevance + BAdI |
| **Transport** | Thiếu object trên QA/PRD → hành vi khác DEV |
| **Performance BCF** | Append nhiều field không cần → tăng dữ liệu xử lý BCF (cân nhắc chỉ field bắt buộc) |

**Chương trình / app kiểm tra:** `FAGLGVTR`, **Carry Forward Balances**, **Display Line Items** (GL).

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

### [S7] SAP KBA 3588343 — ACDOCA blank after BCF (preview)

https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — mirror: [sources/sap-kba/KBA-3588343.md](sources/sap-kba/KBA-3588343.md)

### [S8] SAP Community — Balance Carryforward custom fields (tóm tắt)

https://community.sap.com/t5/financial-management-q-a/balance-carryforward-s-4-public-cloud/qaq-p/14252529 — mirror: [sources/sap-community/balance-carryforward-custom-fields.md](sources/sap-community/balance-carryforward-custom-fields.md)

### [S9] SAP Library — Enhancement Concept

https://help.sap.com/saphelp_ewm900/helpdata/en/42/d356adddec036fe10000000a114cbd/content.htm

### [S10] ABAP Keyword Documentation — GET BADI

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html — mirror: [sources/sap-abap-cloud/3008-ABAPGET_BADI.md](sources/sap-abap-cloud/3008-ABAPGET_BADI.md)

### [S11] ABAP Keyword Documentation — CALL BADI

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html

### [S12] ABAP Keyword Documentation — object plug-in

https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENOBJECT_PLUGIN_GLOSRY.html

### [S13] SAP Support — How to find classic BAdIs

https://help.sap.com/docs/SUPPORT_CONTENT/abaphowto/3353523789.html

### [S14] SAP Support — Find a BADI

https://help.sap.com/docs/SUPPORT_CONTENT/abap/3353525647.html

### [S15] SAP Help — Breakpoints (characteristics)

https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829321ffa326a/4ec121276e391014adc9fffe4e204223.html

### [S16] SAP Help — Setting dynamic breakpoints (ADT)

https://help.sap.com/docs/abap-cloud/abap-development-tools-user-guide/setting-dynamic-breakpoints

### Mirror ABAP Cloud trong repo

Toàn bộ trang ABAP Keyword Documentation liên quan: [docs/sources/sap-abap-cloud/](sources/sap-abap-cloud/)

---

## Ghi chú

Tài liệu này dùng để hướng dẫn thao tác và khái niệm cơ bản.

Các tên object/method cụ thể như `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `CHANGE_ACTIVE_FIELDS_BCF_*` là phần phụ thuộc hệ thống Finance thực tế, cần xác nhận trực tiếp trong `SE19`/`SE24` trước khi triển khai.

Khi triển khai thật, luôn kiểm tra signature method và parameter trực tiếp trong hệ thống SAP của bạn.
