# Custom field ACDOCA trống sau Balance Carryforward (S/4HANA)

## Mục đích

Tài liệu này giải thích hiện tượng một số custom field trên `ACDOCA` bị trống sau khi chạy **Balance Carryforward** sau khi hệ thống được upgrade lên phiên bản S/4HANA mới hơn.

Mục tiêu của tài liệu là giúp người đọc hiểu:

- Hiện tượng lỗi đang xảy ra là gì.
- Nguyên nhân tổng quan vì sao custom field không được carry forward.
- Hướng xử lý được đề xuất.
- Cách kiểm tra kết quả sau khi xử lý.
- Phạm vi ảnh hưởng và các lưu ý khi triển khai.

Giải pháp đề xuất là sử dụng BAdI do SAP cung cấp (`BADI_FINS_ACDOC_FIELDCAT`, enhancement spot `ES_FINS_ACDOCA`) để bổ sung custom field vào danh sách field được xử lý trong Balance Carryforward. Cách làm này **không sửa trực tiếp** SAP standard object, mà thực hiện thông qua **customer enhancement**.

Chi tiết thao tác `SE19` / `SE24`, code mẫu, debug và rollback nằm ở [Phụ lục kỹ thuật](#phụ-lục-kỹ-thuật) — dành cho đội kỹ thuật SAP/ABAP.

---

## Nội dung chính

### Hiện tượng lỗi

Sau khi upgrade S/4HANA, một số **custom field** trên bảng universal journal `ACDOCA` vẫn có dữ liệu ở **năm cũ**, nhưng sau khi chạy **Balance Carryforward** thì dữ liệu **năm mới bị trống** (blank).

Triệu chứng thường gặp:

- Dòng item năm trước vẫn hiển thị giá trị custom field.
- Sau BCF, dòng năm mới hoặc số dư đầu kỳ không còn giá trị field đó.
- Lỗi hay gặp với dữ liệu tạo từ chương trình `FAGLGVTR` hoặc app **Carry Forward Balances**.

SAP mô tả triệu chứng tương tự trong [KBA 3588343](https://userapps.support.sap.com/sap/support/knowledge/en/3588343) (extended items trên ACDOCA blank sau balance carryforward dù trước upgrade vẫn có giá trị). Mirror nội bộ: [KBA-3588343](sources/sap-kba/KBA-3588343.md).

---

### Nguyên nhân tổng quan

Một số custom field **chưa được đưa vào danh sách field active** cho quá trình Balance Carryforward. Khi hệ thống tạo dữ liệu carryforward sang năm mới, các field này **không được kế thừa** — dẫn tới giá trị trống trên posting/dòng hiển thị năm mới.

Nguyên nhân không phải “mất dữ liệu năm cũ” mà là **luồng BCF không copy field đó** vì field chưa được khai báo relevant cho BCF hoặc chưa có enhancement bổ sung field vào catalog active.

Trên hệ thống cần kiểm tra thêm customizing field (ví dụ `FINSC_ACDOC_FCT`) — xem [tóm tắt FINSC_ACDOC_FCT](sources/finance/FINSC_ACDOC_FCT.md).

---

### Khi nào cần áp dụng giải pháp này?

Áp dụng giải pháp này khi gặp các tình huống sau:

- Sau khi upgrade S/4HANA, custom field trên `ACDOCA` bị trống ở dữ liệu năm mới.
- Dữ liệu năm cũ vẫn có giá trị, nhưng sau khi chạy Balance Carryforward thì custom field không được kế thừa.
- Lỗi xảy ra với dữ liệu được tạo từ chương trình `FAGLGVTR` hoặc app **Carry Forward Balances**.
- Cần bổ sung custom field vào danh sách field được xử lý trong quá trình carryforward.

**Không** áp dụng khi field chưa tồn tại trên `ACDOCA` hoặc chưa được cấu hình đúng trong customizing — cần xử lý cấu hình field trước.

---

### Hướng xử lý

SAP cung cấp BAdI **`BADI_FINS_ACDOC_FIELDCAT`** trong enhancement spot **`ES_FINS_ACDOCA`** để chỉnh **field catalog / active fields** cho Balance Carryforward. SAP Help ghi rõ có thể dùng BAdI này cho balance carryforward trong G/L Accounting — xem [Balance Carryforward in G/L Accounting](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html).

Tóm tắt phương án:

| Hạng mục | Nội dung |
|----------|----------|
| Cơ chế | Customer enhancement (BAdI implementation), không sửa source SAP standard |
| BAdI | `BADI_FINS_ACDOC_FIELDCAT` |
| Enhancement spot | `ES_FINS_ACDOCA` |
| Việc cần làm | Tạo implementation customer, bổ sung tên technical field custom vào danh sách active fields cho BCF (method tùy loại tài khoản: open item, Balance Sheet, P&L) |
| Môi trường | Triển khai và test trên **DEV**, sau đó transport sang **QA** và **PRD** |

Đội kỹ thuật thực hiện các bước chi tiết trong [Phụ lục kỹ thuật — Tạo BAdI Implementation](#tao-badi-implementation).

### Ảnh hưởng

| Khía cạnh | Mô tả |
|-----------|--------|
| **SAP standard** | Không sửa object standard (`ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, interface `IF_BADI_*`). Chỉ thêm object customer (`ZEI_*`, `ZBI_*`, `ZCL_*`). |
| **Dữ liệu** | Ảnh hưởng dữ liệu **tạo mới** sau BCF (field có/không được carry forward). Không tự động sửa lại toàn bộ lịch sử năm cũ. |
| **Vận hành** | Cần **activate** implementation và **transport** đầy đủ chain object từ DEV → QA → PRD. Thiếu transport → hành vi khác giữa môi trường. |
| **Balance Carryforward** | Field được khai báo qua BAdI sẽ nằm trong active fields khi chạy BCF — ảnh hưởng số dư đầu kỳ / line item năm mới. |
| **Performance BCF** | Chỉ bổ sung field thật sự cần; append nhiều field không dùng có thể tăng khối lượng xử lý BCF. |
| **Public Cloud** | Custom field BCF có thể bị giới hạn extensibility — xem [tóm tắt Community](sources/sap-community/balance-carryforward-custom-fields.md). |

Chương trình / app thường dùng để kiểm tra: `FAGLGVTR`, **Carry Forward Balances**, **Display Line Items** (GL).

---

## Kiểm tra / Cách xác minh

1. Trên **DEV** hoặc **QA**, chạy lại **Balance Carryforward** (`FAGLGVTR` hoặc app **Carry Forward Balances**) cho company code / fiscal year liên quan.
2. Mở dữ liệu `ACDOCA` hoặc report **Display Line Items** (G/L) cho năm mới.
3. Xác nhận custom field **không còn trống** trên dòng/số dư sau BCF (so với cùng tài khoản trước khi sửa).
4. Nếu có nhiều loại tài khoản (open item, Balance Sheet, P&L), kiểm tra từng scenario tương ứng method BCF đã implement.

Checklist kỹ thuật chi tiết: [Phụ lục — Kiểm tra sau thao tác](#kiem-tra-cach-xac-minh-phu-luc).

---

## Link nguồn

- SAP KBA 3588343 — ACDOCA extended items blank sau BCF: https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — mirror [KBA-3588343](sources/sap-kba/KBA-3588343.md)
- SAP Help — Balance Carryforward in G/L Accounting (BAdI field catalog): https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html
- SAP ABAP — BAdI implementation class (glossary): https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-us/abenbadi_implement_class_glosry.htm
- SAP ABAP — BAdI (Glossary): https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html
- SAP ABAP — Enhancements: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html
- SAP ABAP — Enhancements Using BAdIs: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html
- SAP ABAP — enhancement implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html
- SAP ABAP — BAdI implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html
- SAP ABAP — BAdI implementation class: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html
- SAP Community — BCF custom fields: https://community.sap.com/t5/financial-management-q-a/balance-carryforward-s-4-public-cloud/qaq-p/14252529 — mirror [Community](sources/sap-community/balance-carryforward-custom-fields.md)
- Mirror ABAP Cloud trong repo: [sources/sap-abap-cloud/](sources/sap-abap-cloud/)

---

## Phụ lục kỹ thuật

*Phần dưới dành cho đội kỹ thuật SAP/ABAP khi cần tạo implementation, kiểm tra, rollback hoặc xử lý lỗi. Object mẫu (`ZEI_FINS_ACDOCA`, `ZBI_FINS_ACDOC_FCAT`, `ZCL_IM_FINS_ACDOC_FCAT`) mang tính minh họa — xác nhận trên hệ **DEV** trước khi transport.*

### Điều kiện trước khi làm

- User có quyền `SE19`, `SE24`, `SE80`/`SE84` trên **DEV** (hoặc sandbox).
- Đã có technical name field trên `ACDOCA`; đã xem `FINSC_ACDOC_FCT` nếu field chưa BCF-relevant.
- Có transport hoặc package (ví dụ `$TMP`) cho object `ZEI_*`, `ZBI_*`, `ZCL_*`.
- Trước khi viết code: `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` → tab **Parameters** của method BCF — ghi đúng tên **CHANGING parameter**.

### Khái niệm: BAdI và implementation class

**Business Add-In (BAdI)** — template gồm interface, filter, setting; runtime gọi method trên **object plug-in**. Enhancement qua BAdI **không sửa** source SAP standard. BAdI và điểm gọi trong program nằm trong **enhancement spot** (ví dụ `ES_FINS_ACDOCA`).

Trên `SE19`: tạo **enhancement implementation** (container `ZEI_*`), **BAdI implementation** (`ZBI_*`) và **implementation class** (`ZCL_*`). Code ABAP viết trong class `ZCL_IM_*`; interface `IF_BADI_*` chỉ khai báo method.

Nguồn: [BAdI glossary](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html), [BAdI implementation class](https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-us/abenbadi_implement_class_glosry.htm).

### Quan hệ object trong BAdI

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

| Object | Ví dụ | Vai trò |
|---|---|---|
| Enhancement Spot | `ES_FINS_ACDOCA` | Điểm mở rộng SAP standard |
| BAdI Definition | `BADI_FINS_ACDOC_FIELDCAT` | BAdI SAP cung cấp |
| Interface | `IF_BADI_FINS_ACDOC_FIELDCAT` | Khai báo method, không viết code ở đây |
| Enhancement Implementation | `ZEI_FINS_ACDOCA` | Container Z* của customer |
| BAdI Implementation | `ZBI_FINS_ACDOC_FCAT` | Implementation cụ thể cho BAdI |
| Implementation Class | `ZCL_IM_FINS_ACDOC_FCAT` | Nơi viết code ABAP |

### Tạo BAdI Implementation

**Mục tiêu:** tạo đủ 3 object customer: `ZEI_FINS_ACDOCA`, `ZBI_FINS_ACDOC_FCAT`, `ZCL_IM_FINS_ACDOC_FCAT`.

**Các bước:**

1. Transaction `SE19`.
2. Chọn tạo implementation cho **New BAdI** hoặc theo **Enhancement Spot** → `ES_FINS_ACDOCA`.
3. Tạo Enhancement Implementation (ví dụ `ZEI_FINS_ACDOCA`).
4. Trong Enhancement Implementation, tạo BAdI Implementation cho `BADI_FINS_ACDOC_FIELDCAT` (ví dụ `ZBI_FINS_ACDOC_FCAT`).
5. Tạo hoặc để SAP sinh Implementation Class (ví dụ `ZCL_IM_FINS_ACDOC_FCAT`).
6. Code trong class `ZCL_IM_FINS_ACDOC_FCAT`, không code trong interface.

**Method thường dùng:**

| Loại | Method |
|------|--------|
| Open item managed | `CHANGE_ACTIVE_FIELDS_BCF_OI` |
| Balance Sheet | `CHANGE_ACTIVE_FIELDS_BCF_BS` |
| P&L | `CHANGE_ACTIVE_FIELDS_BCF_PL` |

**Kiểm tra sau khi tạo:**

1. `SE19` → mở `ZBI_FINS_ACDOC_FCAT` → trạng thái **Active**.
2. `SE24` → `ZCL_IM_FINS_ACDOC_FCAT` → method `CHANGE_ACTIVE_FIELDS_BCF_*` đã activate.
3. Chạy thử `FAGLGVTR` (hoặc app BCF) — field custom có trong active fields (sau khi đã cấu hình `FINSC_ACDOC_FCT`).

### Phụ lục kỹ thuật: ví dụ implementation

> **Cảnh báo:** Code bên dưới chỉ là ví dụ. Tên field, method và parameter cần được kiểm tra trực tiếp trên hệ thống SAP thực tế (`SE24` → signature method) trước khi triển khai.

Thay `ZZBRANCH` bằng technical field name thật trong `ACDOCA`.

```abap
METHOD if_badi_fins_acdoc_fieldcat~change_active_fields_bcf_oi.

  CONSTANTS lc_field TYPE fieldname VALUE 'ZZBRANCH'.

  IF NOT line_exists( ct_active_fields[ fieldname = lc_field ] ).
    APPEND VALUE #( fieldname = lc_field ) TO ct_active_fields.
  ENDIF.

ENDMETHOD.
```

Nếu hệ thống không có parameter `ct_active_fields`, mở `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` → method → **Parameters** → kiểm tra tên **CHANGING parameter** thật và sửa code theo signature thực tế.

### Disable / Deactivate

Dùng khi tắt ảnh hưởng runtime nhưng vẫn giữ object để sửa tiếp hoặc rollback.

1. `SE19` → mở `ZEI_FINS_ACDOCA` → Change mode.
2. Deactivate `ZBI_FINS_ACDOC_FCAT` (hoặc tắt active flag).
3. Save, Activate, test lại BCF (`FAGLGVTR` hoặc app **Carry Forward Balances**).

Ưu tiên **inactive** implementation trong `SE19` thay vì chỉ comment code (BAdI vẫn được gọi nếu chỉ comment logic).

### Xóa implementation

1. Deactivate trước → test lại.
2. Xóa BAdI Implementation `ZBI_*` nếu còn.
3. Xóa Enhancement Implementation `ZEI_*`.
4. Xóa Implementation Class `ZCL_*` nếu không còn reference.
5. Activate và transport.

**Không xóa** SAP standard: `ES_FINS_ACDOCA`, `BADI_FINS_ACDOC_FIELDCAT`, `IF_BADI_FINS_ACDOC_FIELDCAT`.

Kiểm tra còn sót: `SE19`, `SE80` (Enhancements), `SE84` (BAdI Implementations).

### Debug

- Không debug trong interface `IF_BADI_FINS_ACDOC_FIELDCAT` — chỉ khai báo.
- Debug trong `SE24` → `ZCL_IM_FINS_ACDOC_FCAT` → method `IF_BADI_FINS_ACDOC_FIELDCAT~CHANGE_ACTIVE_FIELDS_BCF_*`.
- Fiori/HTTP: external breakpoint đúng SAP user.
- Background job: `SM37` → job → `JDBG`.

### Kiểm tra / Cách xác minh

**Tạo**

- [ ] Đúng Enhancement Spot: `ES_FINS_ACDOCA`
- [ ] Có Enhancement Implementation: `ZEI_*`
- [ ] Có BAdI Implementation: `ZBI_*`
- [ ] Có Implementation Class: `ZCL_*`
- [ ] Code nằm trong class, không nằm trong interface
- [ ] Đúng method: `BCF_OI`, `BCF_BS`, hoặc `BCF_PL`

**Disable / xóa**

- [ ] Deactivate trước khi xóa
- [ ] Test lại BCF
- [ ] Không xóa SAP standard object
- [ ] Transport đủ chain lên QA/PRD

### Cách tìm điểm enhance (tổng quát)

Dành khi cần tìm BAdI khác ngoài case ACDOCA/BCF:

1. Viết rõ mục đích runtime (*can thiệp tại thời điểm nào để đổi/kiểm tra gì*).
2. Xác định transaction/app (`FAGLGVTR`, …).
3. `SE84` → package → Enhancements → BAdI definitions; hoặc `SE19` / `SE24` theo spot/interface.
4. Đọc method signature: cần đổi dữ liệu → thường phải có `CHANGING`.
5. Kiểm tra filter, implementation active.
6. Debug xác nhận BAdI thực sự được gọi.

Case `BADI_FINS_ACDOC_FIELDCAT`: tìm nhanh qua `SE19` (`ES_FINS_ACDOCA`), `SE24` (`IF_BADI_FINS_ACDOC_FIELDCAT`), where-used, keyword `ACDOC` / `BCF` / `FINS` trên `SE84`.

### Lỗi thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Hướng xử lý |
|-------------|------------------------|-------------|
| Custom field ACDOCA **trống sau BCF** | Field chưa BCF-relevant; thiếu catalog / chưa append qua BAdI | `FINSC_ACDOC_FCT`; implement `CHANGE_ACTIVE_FIELDS_BCF_*` — [KBA 3588343](sources/sap-kba/KBA-3588343.md) |
| Breakpoint **không dừng** | Debug nhầm interface; user/job khác; chưa active implementation | Debug class `ZCL_*`; external breakpoint; SM37 + `JDBG` |
| `CX_BADI_NOT_IMPLEMENTED` | Single-use BAdI, không có implementation active | Tạo/activate `ZBI_*` — [GET BADI](sources/sap-abap-cloud/3008-ABAPGET_BADI.md) |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | Single-use nhưng nhiều implementation active | Chỉ một implementation active hoặc kiểm tra filter |
| Syntax error trong implementation | Sai tên CHANGING parameter | `SE24` → signature thật |
| BCF QA/PRD khác DEV | Thiếu transport / inactive | Transport `ZEI_*`/`ZBI_*`/`ZCL_*`; activate chain |

### Lưu ý triển khai (kỹ thuật)

- Luôn xác nhận method đúng: `BCF_OI`, `BCF_BS`, `BCF_PL`.
- Không giả định tên parameter — kiểm tra trên `SE24`.
- **Activate** enhancement + BAdI implementation + class sau mỗi thay đổi.
- Object/method phụ thuộc release Finance — xác nhận trong `SE19`/`SE24` trên hệ bạn trước transport QA/PRD.
