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

Chi tiết thao tác `SE19` / `SE24`, code mẫu, debug và rollback nằm ở [Phụ lục kỹ thuật](#phu-luc-ky-thuat) — dành cho đội kỹ thuật SAP/ABAP.

Chưa quen BAdI? Đọc trước [Giới thiệu BAdI](Gioi_thieu_BADI.md).

## Khi dùng

Dùng tài liệu này khi gặp một trong các tình huống sau:

- Sau upgrade S/4HANA, custom field trên `ACDOCA` có giá trị ở năm cũ nhưng bị trống ở dữ liệu năm mới sau Balance Carryforward.
- Lỗi xảy ra khi chạy `FAGLGVTR`, job Balance Carryforward trong **Schedule General Ledger Jobs**, hoặc app **Carry Forward Balances** trên release còn hỗ trợ app này.
- Cần kiểm tra BAdI `BADI_FINS_ACDOC_FIELDCAT` / enhancement spot `ES_FINS_ACDOCA` để bổ sung field vào field catalog dùng cho BCF.

Không dùng tài liệu này để xử lý field chưa tồn tại trên `ACDOCA`, sai cấu hình master data G/L, hoặc sai logic retained earnings. Các lỗi đó cần kiểm tra cấu hình Finance trước.

## Điều kiện trước khi làm

- Có hệ **DEV** hoặc sandbox để tạo và test object `Z*`; không làm thẳng trên **PRD**.
- User có quyền `SE19`, `SE24`, và quyền chạy/test Balance Carryforward (`FAGLGVTR` hoặc job/app tương ứng theo release).
- Biết technical field name thật trên `ACDOCA`, ví dụ `ZZBRANCH`; kiểm tra bằng `SE11`, `SE16N`, hoặc công cụ được phép trong dự án.
- Đã xác nhận field cần được carry forward cho loại tài khoản liên quan: open item, Balance Sheet, hoặc P&L.
- Trước khi viết code, mở `SE24` → interface `IF_BADI_FINS_ACDOC_FIELDCAT` → method BCF → tab **Parameters** để lấy đúng tên CHANGING parameter trên hệ thực tế.

## Nội dung chính

### Hiện tượng lỗi

Sau khi upgrade S/4HANA, một số **custom field** trên bảng universal journal `ACDOCA` vẫn có dữ liệu ở **năm cũ**, nhưng sau khi chạy **Balance Carryforward** thì dữ liệu **năm mới bị trống** (blank).

Triệu chứng thường gặp:

- Dòng item năm trước vẫn hiển thị giá trị custom field.
- Sau BCF, dòng năm mới hoặc số dư đầu kỳ không còn giá trị field đó.
- Lỗi hay gặp với dữ liệu tạo từ `FAGLGVTR`, job Balance Carryforward, hoặc app **Carry Forward Balances** trên release còn hỗ trợ app này.

SAP mô tả triệu chứng tương tự trong [KBA 3588343](https://userapps.support.sap.com/sap/support/knowledge/en/3588343) (extended items trên ACDOCA blank sau balance carryforward dù trước upgrade vẫn có giá trị). Mirror nội bộ: [KBA-3588343](sources/sap-kba/KBA-3588343.md).

### Nguyên nhân tổng quan

Một số custom field **chưa được đưa vào danh sách field active** cho quá trình Balance Carryforward. Khi hệ thống tạo dữ liệu carryforward sang năm mới, các field này **không được kế thừa** — dẫn tới giá trị trống trên posting/dòng hiển thị năm mới.

Nguyên nhân không phải “mất dữ liệu năm cũ” mà là **luồng BCF không copy field đó** vì field chưa được khai báo relevant cho BCF hoặc chưa có enhancement bổ sung field vào catalog active.

Trên hệ thống cần kiểm tra thêm customizing field (ví dụ `FINSC_ACDOC_FCT`) — xem [tóm tắt FINSC_ACDOC_FCT](sources/finance/FINSC_ACDOC_FCT.md).

### Đối chiếu nguồn SAP

| Claim trong tài liệu | Kết luận đối chiếu | Nguồn |
|----------------------|--------------------|-------|
| BAdI `BADI_FINS_ACDOC_FIELDCAT` thuộc enhancement spot `ES_FINS_ACDOCA` có thể dùng để chỉnh field catalog cho Balance Carryforward | **Đúng**; SAP Help xác nhận | [Balance Carryforward in G/L Accounting](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html) |
| Sau upgrade, ACDOCA extended items blank sau balance carryforward | **Đúng**; SAP KBA preview xác nhận, bản đầy đủ cần SAP for Me | [KBA 3588343](https://userapps.support.sap.com/sap/support/knowledge/en/3588343) |
| `CHANGE_ACTIVE_FIELDS_BCF_OI` liên quan open-item-managed accounts | **Đúng theo keyword KBA preview** | [KBA 3588343](https://userapps.support.sap.com/sap/support/knowledge/en/3588343) |
| `CHANGE_ACTIVE_FIELDS_BCF_BS` / `CHANGE_ACTIVE_FIELDS_BCF_PL` và tên parameter cụ thể | **Cần xác minh trên `SE24` theo release**; không copy code nếu signature khác | `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` |
| `FINSC_ACDOC_FCT` là field catalog cho `ACDOCA` | **Cần xác minh bằng DDIC trên hệ DEV**; repo chỉ có tóm tắt nội bộ | `SE11` / `SE16N` → `FINSC_ACDOC_FCT` |
| App **Carry Forward Balances** | **Phụ thuộc release**; SAP Help cho biết app đã deprecated ở SAP S/4HANA 2022, có thể dùng `FAGLGVTR` hoặc Schedule General Ledger Jobs | [Carry Forward Balances](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE_UPA/e55549ee96814207af9232a7688dd64a/65810e56a686fb37e10000000a44147b.html?version=2022.3_UPA) |

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
| **Public Cloud** | Custom field BCF có thể bị giới hạn extensibility. Nguồn hiện có trong repo là SAP Community, không phải SAP Help chính thức — xem [tóm tắt Community](sources/sap-community/balance-carryforward-custom-fields.md). |

Chương trình / app thường dùng để kiểm tra: `FAGLGVTR`, job Balance Carryforward trong **Schedule General Ledger Jobs**, **Balance Carryforward Status**, và **Display Line Items** (GL). Nếu hệ còn app **Carry Forward Balances**, kiểm tra trạng thái hỗ trợ theo release trước khi hướng dẫn end user dùng app này.

## Bước làm

Luồng dưới đây là checklist tổng quan cho người mới. Chi tiết màn hình `SE19` / `SE24` nằm ở [Phụ lục kỹ thuật](#phu-luc-ky-thuat).

1. Trên **DEV** hoặc **QA**, lấy một ví dụ lỗi: company code, ledger, fiscal year, G/L account, document/line item, và technical field trên `ACDOCA`.
2. So sánh dữ liệu `ACDOCA` năm cũ và năm mới cho cùng field custom. Nếu năm cũ có giá trị nhưng năm mới blank sau BCF, ghi lại bằng chứng trước khi sửa.
3. Kiểm tra field có tồn tại trong `ACDOCA` bằng `SE11` hoặc `SE16N`. Nếu field chưa tồn tại, dừng hướng BAdI và xử lý extension field trước.
4. Mở `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` → xác định method BCF cần dùng và CHANGING parameter thật. Không giả định tên parameter từ tài liệu này.
5. Mở `SE19` → tạo implementation cho **New BAdI** theo enhancement spot `ES_FINS_ACDOCA`.
6. Tạo object customer `Z*`: enhancement implementation `ZEI_*`, BAdI implementation `ZBI_*`, implementation class `ZCL_IM_*`.
7. Trong implementation class, thêm technical field name vào active field list của method BCF tương ứng. Với open item, KBA 3588343 preview nêu keyword `CHANGE_ACTIVE_FIELDS_BCF_OI`.
8. Activate class, BAdI implementation và enhancement implementation.
9. Chạy lại Balance Carryforward bằng `FAGLGVTR` hoặc job/app tương ứng theo release, rồi kiểm tra lại `ACDOCA` / **Display Line Items**.
10. Nếu DEV pass, transport đủ chain object `ZEI_*` / `ZBI_*` / `ZCL_*` sang QA; test lại trước khi đưa PRD.

## Kiểm tra

1. Trên **DEV** hoặc **QA**, chạy lại **Balance Carryforward** bằng `FAGLGVTR`, job trong **Schedule General Ledger Jobs**, hoặc app **Carry Forward Balances** nếu release còn hỗ trợ app này.
2. Mở dữ liệu `ACDOCA` hoặc report **Display Line Items** (G/L) cho năm mới.
3. Xác nhận custom field **không còn trống** trên dòng/số dư sau BCF (so với cùng tài khoản trước khi sửa).
4. Nếu có nhiều loại tài khoản (open item, Balance Sheet, P&L), kiểm tra từng scenario tương ứng method BCF đã implement.

Checklist kỹ thuật chi tiết nằm ở [Phụ lục — Kiểm tra sau thao tác](#kiem-tra-cach-xac-minh-phu-luc); dùng khi cần đối chiếu `SE19`, `SE24`, transport và trạng thái active.

Kết quả pass tối thiểu trên `SE19` / `SE24` / `FAGLGVTR`:

- `SE19` hiển thị BAdI implementation `ZBI_*` ở trạng thái **active**.
- `SE24` hiển thị method trong class `ZCL_IM_*` đã activate.
- Sau BCF, field custom có giá trị ở line item / số dư năm mới đúng scenario test.
- Không có short dump hoặc exception BAdI trong job/app BCF.

## Lỗi thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách kiểm tra / xử lý |
|-------------|------------------------|------------------------|
| Custom field `ACDOCA` vẫn blank sau BCF | Sai method BCF hoặc field chưa được thêm vào active fields | Kiểm tra `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT`; chạy lại BCF trên cùng company code / fiscal year |
| Breakpoint không dừng | Đặt breakpoint ở interface thay vì implementation class; user/job khác | Đặt breakpoint trong `ZCL_IM_*`; với background job dùng `SM37` → `JDBG` |
| `CX_BADI_NOT_IMPLEMENTED` | BAdI single-use không có implementation active | Kiểm tra `SE19` → active flag; xem nguồn `GET BADI` |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | BAdI single-use nhưng có nhiều implementation active | Chỉ để một implementation active hoặc kiểm tra filter |
| Syntax error khi activate class | Tên CHANGING parameter hoặc cấu trúc table khác code mẫu | Mở `SE24` → tab **Parameters**; sửa code theo signature thật |
| QA/PRD khác DEV | Thiếu transport hoặc object inactive | Transport đủ `ZEI_*`, `ZBI_*`, `ZCL_*`; activate lại trên target |

## Link nguồn

- SAP KBA 3588343 preview: https://userapps.support.sap.com/sap/support/knowledge/en/3588343 — dùng để xác minh triệu chứng ACDOCA extended items blank sau BCF và keyword `BADI_FINS_ACDOC_FIELDCAT` / `CHANGE_ACTIVE_FIELDS_BCF_OI`; mirror [KBA-3588343](sources/sap-kba/KBA-3588343.md).
- SAP Help — Balance Carryforward in G/L Accounting: https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html — dùng để xác minh BAdI `BADI_FINS_ACDOC_FIELDCAT`, enhancement spot `ES_FINS_ACDOCA`, field catalog cho BCF, và cách chạy/schedule BCF.
- SAP Help — Carry Forward Balances app: https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE_UPA/e55549ee96814207af9232a7688dd64a/65810e56a686fb37e10000000a44147b.html?version=2022.3_UPA — dùng để xác minh app liên quan, `FAGLGVTR`, và lưu ý deprecated theo release.
- SAP Help — Report Transactions: https://help.sap.com/saphelp_em92/helpdata/en/43/0f4c879f2d6f41e10000000a422035/content.htm — dùng để xác minh transaction code có thể được gán với executable program và selection screen qua `SE93`.
- SAP Help — Balance carried forward for an account is not equal with the previous year-end balance: https://help.sap.com/docs/SUPPORT_CONTENT/fiaccounting/3361881370.html — dùng để xác minh `FAGLGVTR` / `SAPFGVTR` trong nội dung support về Balance Carryforward.
- SAP ABAP — BAdI glossary: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html — dùng để xác minh BAdI gồm interface, filter và setting.
- SAP ABAP — ABAP Enhancements: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html — dùng để xác minh BAdI cho phép enhance ABAP source mà không modify source gốc.
- SAP ABAP — Enhancements Using BAdIs: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html — dùng để xác minh enhancement spot, implementation class, `GET BADI`, `CALL BADI`, single/multiple use và fallback class.
- SAP ABAP — enhancement implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html — dùng để xác minh object quản trị enhancement implementation.
- SAP ABAP — BAdI implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html — dùng để xác minh implementation class, filter condition, active/inactive.
- SAP ABAP — BAdI implementation class: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html — dùng để xác minh implementation class implement BAdI interface và instance hoạt động như object plug-in.
- SAP ABAP — GET BADI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html — dùng để xác minh exception `CX_BADI_NOT_IMPLEMENTED` và `CX_BADI_MULTIPLY_IMPLEMENTED`.
- SAP ABAP — CALL BADI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html — dùng để xác minh cách runtime gọi BAdI methods.
- SAP Help — Breakpoints at Statements: https://help.sap.com/saphelp_em900/helpdata/en/49/26e11dc93016b8e10000000a42189d/content.htm — dùng để xác minh breakpoint dynamic theo ABAP statement trong Debugger.
- SAP Help Support Content — What BAdI is and how to find and implement it: https://help.sap.com/docs/SUPPORT_CONTENT/abap/3353525767.html — dùng để tham khảo cách đặt breakpoint `CALL BADI` và `CL_EXITHANDLER` khi tìm BAdI.
- SAP Community — BCF custom fields: https://community.sap.com/t5/financial-management-q-a/balance-carryforward-s-4-public-cloud/qaq-p/14252529 — nguồn cộng đồng, chỉ dùng tham khảo hạn chế Public Cloud; mirror [Community](sources/sap-community/balance-carryforward-custom-fields.md).
- Mirror ABAP Cloud trong repo: [sources/sap-abap-cloud/](sources/sap-abap-cloud/) — dùng để đọc bản mirror nội bộ của ABAP Keyword Documentation.

## Phụ lục kỹ thuật

*Phần dưới dành cho đội kỹ thuật SAP/ABAP khi cần tạo implementation, kiểm tra, rollback hoặc xử lý lỗi. Object mẫu (`ZEI_FINS_ACDOCA`, `ZBI_FINS_ACDOC_FCAT`, `ZCL_IM_FINS_ACDOC_FCAT`) mang tính minh họa — xác nhận trên hệ **DEV** trước khi transport.*

### Điều kiện kỹ thuật trước khi làm

- User có quyền `SE19`, `SE24`, `SE80`/`SE84` trên **DEV** (hoặc sandbox).
- Đã có technical name field trên `ACDOCA`; đã xem `FINSC_ACDOC_FCT` nếu field chưa BCF-relevant.
- Có transport hoặc package (ví dụ `$TMP`) cho object `ZEI_*`, `ZBI_*`, `ZCL_*`.
- Trước khi viết code: `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` → tab **Parameters** của method BCF — ghi đúng tên **CHANGING parameter**.

### Khái niệm: BAdI và implementation class

**Business Add-In (BAdI)** — template gồm interface, filter, setting; runtime gọi method trên **object plug-in**. Enhancement qua BAdI **không sửa** source SAP standard. BAdI và điểm gọi trong program nằm trong **enhancement spot** (ví dụ `ES_FINS_ACDOCA`).

Trên `SE19`: tạo **enhancement implementation** (container `ZEI_*`), **BAdI implementation** (`ZBI_*`) và **implementation class** (`ZCL_*`). Code ABAP viết trong class `ZCL_IM_*`; interface `IF_BADI_*` chỉ khai báo method.

Nguồn: [BAdI glossary](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html), [BAdI implementation class](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html).

### Quan hệ object trong BAdI

Áp vào case `BADI_FINS_ACDOC_FIELDCAT`:

> Cần xác minh: các method `CHANGE_ACTIVE_FIELDS_BCF_BS` / `_PL` / `_OI` phải được kiểm tra lại trong `SE24` trên release của hệ thống. Nguồn công khai SAP KBA preview nêu rõ `_OI`; các method còn lại phụ thuộc interface thực tế.

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

**Method cần kiểm tra trên `SE24`:**

| Loại | Method |
|------|--------|
| Open item managed | `CHANGE_ACTIVE_FIELDS_BCF_OI` — xuất hiện trong keyword của KBA 3588343 preview |
| Balance Sheet | `CHANGE_ACTIVE_FIELDS_BCF_BS` — cần xác minh trong `SE24` |
| P&L | `CHANGE_ACTIVE_FIELDS_BCF_PL` — cần xác minh trong `SE24` |

**Kiểm tra sau khi tạo:**

1. `SE19` → mở `ZBI_FINS_ACDOC_FCAT` → trạng thái **Active**.
2. `SE24` → `ZCL_IM_FINS_ACDOC_FCAT` → method `CHANGE_ACTIVE_FIELDS_BCF_*` đã activate.
3. Chạy thử `FAGLGVTR` hoặc job/app BCF theo release — field custom có trong active fields sau khi đã kiểm tra DDIC/customizing liên quan.

### Phụ lục kỹ thuật: ví dụ implementation

> **Cảnh báo:** Code bên dưới chỉ minh họa pattern. Chỉ dùng nếu `SE24` xác nhận method, CHANGING parameter và cấu trúc table đúng như ví dụ. Nếu signature khác, sửa theo hệ thực tế.

Ví dụ dưới đây giả định CHANGING parameter tên `ct_active_fields` và có component `fieldname`. Thay `ZZBRANCH` bằng technical field name thật trong `ACDOCA`.

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
3. Save, Activate, test lại BCF bằng `FAGLGVTR` hoặc job/app tương ứng theo release.

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
- [ ] Đúng method trên `SE24`: `BCF_OI`, `BCF_BS`, hoặc `BCF_PL` nếu interface của hệ có các method này

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

### Ví dụ: tìm enhancement spot từ T-code `FAGLGVTR`

**Mục tiêu:** từ T-code `FAGLGVTR`, tìm BAdI/enhancement spot có thể ảnh hưởng field catalog của Balance Carryforward.

**Kết luận đã có nguồn SAP:** với case field catalog cho Balance Carryforward, SAP Help nêu trực tiếp BAdI `BADI_FINS_ACDOC_FIELDCAT` thuộc enhancement spot `ES_FINS_ACDOCA`. SAP KBA 3588343 preview nêu keyword `CHANGE_ACTIVE_FIELDS_BCF_OI` cho lỗi ACDOCA extended items blank sau BCF.

**Nguồn internet để đối chiếu từng bước:**

| Điểm cần xác minh | Kết luận dùng trong ví dụ | Nguồn internet |
|-------------------|---------------------------|----------------|
| T-code có thể map tới program/selection screen | SAP Help mô tả report transaction gán transaction code với executable program và selection screen; dùng `SE93` để kiểm trên hệ thật | [SAP Help — Report Transactions](https://help.sap.com/saphelp_em92/helpdata/en/43/0f4c879f2d6f41e10000000a422035/content.htm) |
| `FAGLGVTR` liên quan program nào | SAP Support Content có ví dụ support ghi `FAGLGVTR` / `SAPFGVTR`; vẫn phải xác nhận `SE93` trên hệ của bạn | [SAP Support Content — Balance carried forward](https://help.sap.com/docs/SUPPORT_CONTENT/fiaccounting/3361881370.html) |
| Debug theo statement | SAP Help mô tả dynamic breakpoint trước ABAP statement; dùng để đặt breakpoint `GET BADI` / `CALL BADI` | [SAP Help — Breakpoints at Statements](https://help.sap.com/saphelp_em900/helpdata/en/49/26e11dc93016b8e10000000a42189d/content.htm) |
| Tìm BAdI bằng runtime/debug | SAP Support Content hướng dẫn đặt breakpoint với `CL_EXITHANDLER` cho classic BAdI và `CALL BADI` cho new BAdI | [SAP Help Support Content — What BAdI is and how to find and implement it](https://help.sap.com/docs/SUPPORT_CONTENT/abap/3353525767.html) |
| Tìm BAdI definition theo package | SAP Support Content nêu đường `SE84` → BAdI definitions → Package (Development Class) → BAdI definition name | [SAP Help Support Content — What BAdI is and how to find and implement it](https://help.sap.com/docs/SUPPORT_CONTENT/abap/3353525767.html) |
| BAdI/spot đúng cho field catalog BCF | SAP Help nêu `BADI_FINS_ACDOC_FIELDCAT` thuộc `ES_FINS_ACDOCA` dùng để modify field catalog type cho Balance Carryforward | [SAP Help — Balance Carryforward in G/L Accounting](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9691b2a7afdf4b7ab15b3c57c6c89f2c.html) |
| Triệu chứng ACDOCA blank sau BCF | SAP KBA preview nêu symptom ACDOCA extended items blank after balance carryforward và keyword `BADI_FINS_ACDOC_FIELDCAT`, `CHANGE_ACTIVE_FIELDS_BCF_OI` | [SAP KBA 3588343 preview](https://userapps.support.sap.com/sap/support/knowledge/en/3588343) |

**Luồng thao tác đề xuất:**

1. Mở `SE93` → nhập `FAGLGVTR` → **Display**. Ghi lại loại transaction, program và selection screen. Trên nhiều hệ, nguồn SAP Support Content ghi `FAGLGVTR` chạy program `SAPFGVTR`; vẫn phải xác nhận bằng `SE93` trên hệ của bạn.
2. Mở `SE38` hoặc `SE80` → program vừa ghi nhận, ví dụ `SAPFGVTR`. Search trong program/include theo các keyword: `GET BADI`, `CALL BADI`, `BADI_FINS_ACDOC_FIELDCAT`, `ES_FINS_ACDOCA`, `ACDOC`, `FIELDCAT`, `BCF`.
3. Nếu không thấy hit trực tiếp, lấy package/development class của program trong `SE80`; vào `SE84` → **BAdI definitions** → lọc theo package. Sau khi tìm được BAdI definition, mở `SE18` / `SE19` để xem enhancement spot. Dùng package thật trên hệ; không copy package từ tài liệu nếu `SE93` / `SE38` hiển thị khác.
4. Debug runtime: chạy `/h` rồi execute `FAGLGVTR` ở **test mode** hoặc với phạm vi nhỏ. Trong Debugger, đặt **Breakpoint at Statement** cho `GET BADI` và `CALL BADI`. Nếu nghi classic BAdI, đặt breakpoint ở `CL_EXITHANDLER=>GET_INSTANCE`.
5. Khi debugger dừng ở `GET BADI` / `CALL BADI`, ghi lại tên BAdI, filter value nếu có, include/class đang chạy và call stack. Từ tên BAdI, mở `SE18` / `SE19` để xem enhancement spot và implementation hiện có.
6. Với case này, kết quả kỳ vọng cần đối chiếu là `BADI_FINS_ACDOC_FIELDCAT` / `ES_FINS_ACDOCA`. Sau đó mở `SE24` → `IF_BADI_FINS_ACDOC_FIELDCAT` để xác nhận method BCF và parameter thật trước khi viết code.

**Không kết luận quá rộng:** một T-code có thể có nhiều nhánh xử lý. Danh sách tìm bằng `SE84` là ứng viên; chỉ BAdI dừng trong debug hoặc có nguồn SAP Help/KBA đúng nghiệp vụ mới nên xem là liên quan trực tiếp tới flow đang test.

### Lỗi thường gặp trong phụ lục kỹ thuật

| Triệu chứng | Nguyên nhân thường gặp | Hướng xử lý |
|-------------|------------------------|-------------|
| Custom field ACDOCA **trống sau BCF** | Field chưa BCF-relevant; thiếu catalog / chưa append qua BAdI | Kiểm tra DDIC/customizing liên quan, sau đó implement method BCF đúng signature — [KBA 3588343](sources/sap-kba/KBA-3588343.md) |
| Breakpoint **không dừng** | Debug nhầm interface; user/job khác; chưa active implementation | Debug class `ZCL_*`; external breakpoint; SM37 + `JDBG` |
| `CX_BADI_NOT_IMPLEMENTED` | Single-use BAdI, không có implementation active | Tạo/activate `ZBI_*` — [GET BADI](sources/sap-abap-cloud/3008-ABAPGET_BADI.md) |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | Single-use nhưng nhiều implementation active | Chỉ một implementation active hoặc kiểm tra filter |
| Syntax error trong implementation | Sai tên CHANGING parameter | `SE24` → signature thật |
| BCF QA/PRD khác DEV | Thiếu transport / inactive | Transport `ZEI_*`/`ZBI_*`/`ZCL_*`; activate chain |

### Lưu ý triển khai (kỹ thuật)

- Luôn xác nhận method đúng trên `SE24`: `BCF_OI`, `BCF_BS`, `BCF_PL` nếu interface của hệ có các method này.
- Không giả định tên parameter — kiểm tra trên `SE24`.
- **Activate** enhancement + BAdI implementation + class sau mỗi thay đổi.
- Object/method phụ thuộc release Finance — xác nhận trong `SE19`/`SE24` trên hệ bạn trước transport QA/PRD.
