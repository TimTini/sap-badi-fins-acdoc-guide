# Giới thiệu BAdI — đọc trước khi triển khai

## Mục đích

Tài liệu này giúp thành viên nhóm hiểu **BAdI (Business Add-In)** và các **object liên quan** trong ABAP Enhancement Framework **trước** khi implement BAdI nghiệp vụ (ví dụ `BADI_FINS_ACDOC_FIELDCAT` cho Balance Carryforward).

Nếu chưa biết BAdI, nắm trước 3 ý:

1. BAdI là điểm móc SAP chừa sẵn để customer thêm logic mà **không sửa source SAP standard**.
2. Trong case `ACDOCA` / Balance Carryforward, SAP đã có sẵn BAdI `BADI_FINS_ACDOC_FIELDCAT`.
3. Người triển khai chỉ tạo object customer `Z*`: enhancement implementation, BAdI implementation và implementation class.

Nội dung dưới đây tóm tắt từ **SAP ABAP Keyword Documentation (Cloud)** và **SAP Library — Enhancement Framework** (link đầy đủ ở cuối). Phần thao tác `SE19` / `SE80` lấy từ SAP Help Portal; nếu màn hình trên hệ DEV khác tài liệu, ưu tiên kiểm tra lại trên release thực tế.

Sau khi đọc xong, chuyển sang [Tài liệu case ACDOCA / BCF](Huong_dan_BADI_FINS_ACDOC.md).

---

## Nội dung chính

### Đọc nhanh cho người mới

Nếu chỉ cần hiểu để làm case nhóm, đọc theo thứ tự này:

1. **BAdI definition** là thiết kế SAP cung cấp sẵn, ví dụ `BADI_FINS_ACDOC_FIELDCAT`.
2. **BAdI interface** chỉ khai báo method, ví dụ `IF_BADI_FINS_ACDOC_FIELDCAT`; không viết logic ở đây.
3. **BAdI implementation class** là nơi viết ABAP code, ví dụ `ZCL_IM_FINS_ACDOC_FCAT`.
4. **Enhancement implementation** là container quản trị object customer `Z*`.
5. Runtime SAP gọi BAdI qua `GET BADI` / `CALL BADI`; filter và trạng thái active/inactive quyết định implementation nào tham gia.

### Trong case nhóm cần tạo gì?

Với `BADI_FINS_ACDOC_FIELDCAT`, nhóm **không tạo BAdI definition mới** và **không sửa interface SAP**. Nhóm chỉ tạo object customer:

| Object cần tạo | Ví dụ | Kiểm tra ở đâu |
|----------------|-------|----------------|
| Enhancement implementation | `ZEI_FINS_ACDOCA` | `SE19` hoặc `SE80` |
| BAdI implementation | `ZBI_FINS_ACDOC_FCAT` | `SE19` |
| BAdI implementation class | `ZCL_IM_FINS_ACDOC_FCAT` | `SE24` / Class Builder |

Trước khi transport, phải activate đủ class, BAdI implementation và enhancement implementation trên hệ **DEV**.

### BAdI là gì?

ABAP Glossary định nghĩa **BAdI** (Business Add-In) là **template cho BAdI objects**. Một BAdI gồm:

- **BAdI interface** — khai báo method.
- **Bộ filter** — chọn implementation khi runtime gọi.
- **Các setting** — ví dụ single/multiple use, fallback class, context-free/dependent (chi tiết trong tài liệu *Enhancements Using BAdIs*).

BAdI là cơ sở để gọi **BAdI methods** trên **object plug-in** trong chương trình ABAP; caller có thể điều khiển implementation nào được dùng bằng **filter values**.

Nguồn: [ABENBADI_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html) — mirror [3987-ABENBADI_GLOSRY.md](sources/sap-abap-cloud/3987-ABENBADI_GLOSRY.md).

### BAdI trong Enhancement Framework

Các trang *ABAP - Enhancements* và *Enhancements Using BAdIs* mô tả:

- ABAP source code có thể được **enhance mà không sửa** (modify) source gốc, thông qua BAdI — một phần của **ABAP Enhancement Framework**.
- BAdI cùng **vị trí gọi** trong chương trình ABAP tạo thành **explicit enhancement options** và được gán vào **enhancement spots**.
- Khi BAdI và điểm gọi đã được định nghĩa trên hệ thống, trên **hệ follow-on** (ví dụ customer system) có thể tạo **BAdI implementations** để bổ sung logic.
- BAdI implementation **chủ yếu** gồm **BAdI implementation class**; instance của class hoạt động như **object plug-in** tại runtime.
- Trong Enhancement Framework, BAdI implementation là **enhancement implementation element** và được **enhancement implementations** quản trị.

Nguồn: [ABENENHANCEMENT_FRAMEWORK](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html), [ABENBADI_ENHANCEMENT](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html) — mirror [3006-ABENENHANCEMENT_FRAMEWORK.md](sources/sap-abap-cloud/3006-ABENENHANCEMENT_FRAMEWORK.md), [3007-ABENBADI_ENHANCEMENT.md](sources/sap-abap-cloud/3007-ABENBADI_ENHANCEMENT.md).

### Các object cần phân biệt

Bảng dưới map **tên object SAP** → **vai trò**; nguồn là glossary và trang *Enhancements Using BAdIs*. Tên `Z*` trong cột ví dụ chỉ minh họa object customer — quy ước đặt tên phụ thuộc dự án.

| Object (SAP) | Vai trò | Ví dụ minh họa (case Finance) |
|--------------|-------------------|-------------------------------|
| **enhancement spot** | Repository object quản trị **explicit enhancement options** | `ES_FINS_ACDOCA` |
| **BAdI** (BAdI definition) | Template: interface + filters + settings | `BADI_FINS_ACDOC_FIELDCAT` |
| **BAdI interface** | Khai báo **BAdI methods** | `IF_BADI_FINS_ACDOC_FIELDCAT` |
| **enhancement implementation** | Repository object quản trị enhancements của object khác | `ZEI_*` |
| **BAdI implementation** | Implementation của một BAdI; gồm class + filter condition; trạng thái **active/inactive** | `ZBI_*` |
| **BAdI implementation class** | Global class implement interface; **nơi viết code**; instance = object plug-in | `ZCL_IM_*` |

**Quan hệ phân cấp (tóm tắt):**

```text
SAP standard (định nghĩa enhancement)
└── enhancement spot
    └── BAdI definition
        └── BAdI interface (+ filters, settings)

Customer (tạo trên hệ follow-on)
└── enhancement implementation
    └── BAdI implementation
        ├── BAdI implementation class   ← code ABAP
        └── filter condition              ← chọn khi GET BADI
```

Nguồn object: [ABENENHANCEMENT_SPOT_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_SPOT_GLOSRY.html), [ABENENHANCEMENT_IMPL_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html), [ABENBADI_IMPLEMENTATION_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html), [ABENBADI_IMPLEMENT_CLASS_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html).

**Lưu ý khi đọc code:** interface chỉ **khai báo** method; logic viết trong **implementation class** (SAP Help: *Enhancements Using BAdIs*, *BAdI implementation class*).

### Runtime: `GET BADI` và `CALL BADI`

Trang *Enhancements Using BAdIs* nêu hai câu lệnh runtime:

| Câu lệnh | Mục đích (SAP) |
|----------|----------------|
| `GET BADI` | Tạo BAdI object — handle cho object plug-ins |
| `CALL BADI` | Gọi BAdI methods trên object plug-ins |

Filter trên BAdI implementation dùng để chọn implementation phù hợp trong `GET BADI`. Trạng thái **inactive** của BAdI implementation ghi đè cả Switch Framework và filter condition.

Nguồn: [ABENBADI_ENHANCEMENT](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html), [ABENBADI_IMPLEMENTATION_GLOSRY](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html), [ABAPGET_BADI](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html), [ABAPCALL_BADI](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html).

### Phạm vi: tạo gì trên hệ customer?

Trên dự án nhóm (Balance Carryforward / `ACDOCA`), **SAP đã cung cấp sẵn** enhancement spot, BAdI definition và interface. Customer **không** tạo BAdI definition mới, mà tạo **BAdI implementation** (container + class + activate).

Tạo **BAdI definition** từ đầu (enhancement spot + BAdI mới) là bước **định nghĩa enhancement** — dành cho người thiết kế extension spot, khác với implement BAdI SAP có sẵn. SAP mô tả tại [Creating a BAdI (Enhancement Framework)](https://help.sap.com/doc/saphelp_ewm900/9.0/en-US/32/a83942424dac04e10000000a1550b0/content.htm). Tài liệu này tập trung **implement BAdI đã có**.

### Tạo BAdI implementation đơn giản (New BAdI)

SAP Library *How to Implement a BAdI* và *Creating, Editing, and Deleting Enhancement Implementations* mô tả luồng tối thiểu gồm **3 lớp object customer**:

```text
enhancement implementation (container, gán 1 enhancement spot)
└── BAdI implementation
    └── BAdI implementation class   ← implement method của BAdI interface
```

**Điều kiện:** trên hệ DEV đã biết **tên enhancement spot** (hoặc tên BAdI) do SAP định nghĩa — ví dụ nhóm dùng `ES_FINS_ACDOCA` / `BADI_FINS_ACDOC_FIELDCAT`.

### Cách A — `SE19` (SAP Help: Create a BAdI implementation)

1. Mở transaction **`SE19`**.
2. Cửa sổ **Create Implementation** → chọn radio **`New BAdI`**.
3. Nhập **Enhancement Spot** (hoặc chọn qua Input Help) → bấm **`Create Impl`**.
4. Nhập **tên Enhancement Implementation** và **Short Text** → xác nhận.
5. Trong cây enhancement implementation, chọn **BAdI** cần implement (nếu spot có nhiều BAdI).
6. Tạo / gán **Implementing Class** (BAdI implementation class).
7. Trong Class Builder, **implement method** đã khai báo trên **BAdI interface** (SAP Help: method đã có sẵn trên interface — customer chỉ viết body).
8. **Save** và **Activate** class.
9. Trên BAdI implementation, bật **Implementation is active** (Runtime Behavior — SAP Help *How to Implement a BAdI*: khi active, runtime gọi implementation thay vì fallback class nếu có).
10. **Save** và **Activate** enhancement implementation; transport theo quy trình nội bộ.

Nguồn thao tác SE19: [Creating, Editing, and Deleting Enhancement Implementations](https://help.sap.com/doc/saphelp_scm700_ehp02/7.0.2/en-US/5f/103a4280da9923e10000000a155106/content.htm).

### Cách B — `SE80` (SAP Help: Create a Container for the Implementation)

1. Mở **Object Navigator** — transaction **`SE80`**.
2. Mở **enhancement spot** tương ứng.
3. Chọn **`Create Enhancement Implementation`** → tạo **(simple) enhancement implementation** (container gán duy nhất một spot — SAP Help).
4. Trong container, tạo **BAdI implementation** cho BAdI definition trong spot.
5. Nhập **Implementing Class** → **`Change`** → Class Builder → implement method → save/activate class.
6. Đánh dấu implementation **active**, save/activate enhancement implementation.

Nguồn: [How to Implement a BAdI](https://help.sap.com/saphelp_snc70/helpdata/en/44/f518d884056c30e10000000a114a6b/content.htm).

### Minh họa tên object (case nhóm — xác nhận trên DEV)

| Bước SAP Help | Object customer (ví dụ nhóm) |
|---------------|------------------------------|
| enhancement implementation | `ZEI_FINS_ACDOCA` |
| BAdI implementation | `ZBI_FINS_ACDOC_FCAT` |
| BAdI implementation class | `ZCL_IM_FINS_ACDOC_FCAT` |
| BAdI interface (SAP, không sửa) | `IF_BADI_FINS_ACDOC_FIELDCAT` |

Code mẫu cho method BCF nằm ở [Phụ lục kỹ thuật tài liệu case](Huong_dan_BADI_FINS_ACDOC.md#phu-luc-ky-thuat).

### Lỗi runtime thường gặp khi mới học (SAP Help)

| Tình huống | SAP mô tả |
|------------|-----------|
| BAdI **single use**, nhiều implementation **active** | Exception `CX_BADI_MULTIPLY_IMPLEMENTED` (*How to Implement a BAdI*) |
| BAdI **single use**, không có implementation active | `CX_BADI_NOT_IMPLEMENTED` — nên có fallback class (*Enhancements Using BAdIs*, *GET BADI*) |
| Implementation **inactive** | Không tham gia runtime; ghi đè filter và Switch Framework (*BAdI implementation* glossary) |

### Luồng tạo BAdI implementation (tóm tắt khái niệm)

Trang *Enhancements Using BAdIs* mô tả luồng khái niệm trùng với các bước thao tác trên:

1. SAP đã định nghĩa **BAdI** và **điểm gọi** trong chương trình ABAP (explicit enhancement option trong **enhancement spot**).
2. Trên hệ customer, tạo **enhancement implementation** (container).
3. Trong container, tạo **BAdI implementation** gắn BAdI definition.
4. Implement method trên **BAdI implementation class**.
5. **Activate** implementation và class.
6. Transport object customer DEV → QA → PRD.

Nguồn khái niệm: [ABENBADI_ENHANCEMENT](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html).

---

## Kiểm tra / Cách xác minh

Trước khi sang tài liệu implement case ACDOCA, mỗi thành viên tự trả lời:

1. **BAdI khác gì sửa trực tiếp SAP standard?** → Enhance qua implementation customer, không modify source SAP — xem *ABAP - Enhancements*.
2. **Code viết ở đâu?** → **BAdI implementation class**, không phải interface.
3. **Object nào quản trị BAdI implementation?** → **enhancement implementation**.
4. **Làm sao runtime chọn implementation?** → Filter trong `GET BADI`; trạng thái active/inactive — xem *BAdI implementation* glossary.
5. **Đã mở mirror/glossary tương ứng trên SAP Help?** → Ít nhất [BAdI](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html) và [Enhancements Using BAdIs](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html).

**Thực hành trên DEV (đối chiếu với SAP Help):**

1. Tạo được enhancement implementation + BAdI implementation qua **`SE19`** (New BAdI) hoặc **`SE80`**.
2. Class implement method trên interface; **activate** class và implementation.
3. Trạng thái BAdI implementation là **active** (inactive → runtime không gọi — glossary *BAdI implementation*).

Nếu còn mơ hồ về object tree, đọc lại mục **Các object cần phân biệt** hoặc wiki [Enhancements Using BAdIs](wiki/Enhancements-Using-BAdIs.md).

---

## Link nguồn

- SAP ABAP Glossary — BAdI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_GLOSRY.html — dùng để xác minh BAdI gồm interface, filter và setting.
- SAP ABAP — ABAP Enhancements: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_FRAMEWORK.html — dùng để xác minh ABAP source có thể được enhance bằng BAdI mà không sửa source gốc.
- SAP ABAP — Enhancements Using BAdIs: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html — dùng để xác minh BAdI nằm trong Enhancement Framework, được gán vào enhancement spot, và implementation class hoạt động như object plug-in.
- SAP ABAP Glossary — enhancement spot: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_SPOT_GLOSRY.html — dùng để xác minh vai trò enhancement spot.
- SAP ABAP Glossary — enhancement implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENENHANCEMENT_IMPL_GLOSRY.html — dùng để xác minh vai trò enhancement implementation.
- SAP ABAP Glossary — BAdI implementation: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENTATION_GLOSRY.html — dùng để xác minh implementation gồm class, filter condition, active/inactive.
- SAP ABAP Glossary — BAdI implementation class: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_IMPLEMENT_CLASS_GLOSRY.html — dùng để xác minh class implement BAdI interface và instance là object plug-in.
- SAP ABAP — GET BADI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPGET_BADI.html — dùng để xác minh `GET BADI` tạo BAdI object và xử lý filter.
- SAP ABAP — CALL BADI: https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html — dùng để xác minh `CALL BADI` gọi BAdI method trên object plug-ins.
- SAP Library — How to Implement a BAdI: https://help.sap.com/saphelp_snc70/helpdata/en/44/f518d884056c30e10000000a114a6b/content.htm — dùng để xác minh luồng SE80 / implementation class / active flag.
- SAP Library — Creating, Editing, and Deleting Enhancement Implementations: https://help.sap.com/doc/saphelp_scm700_ehp02/7.0.2/en-US/5f/103a4280da9923e10000000a155106/content.htm — dùng để xác minh luồng `SE19` → `New BAdI` → `Create Impl`.
- SAP Library — Creating a BAdI: https://help.sap.com/doc/saphelp_ewm900/9.0/en-US/32/a83942424dac04e10000000a1550b0/content.htm — dùng để phân biệt bước định nghĩa BAdI mới với bước customer implement BAdI có sẵn.
- Mirror offline trong repo: [sources/sap-abap-cloud/](sources/sap-abap-cloud/) — dùng để đọc lại bản mirror nội bộ của SAP ABAP Keyword Documentation.
- Tài liệu bước tiếp theo: [Huong_dan_BADI_FINS_ACDOC.md](Huong_dan_BADI_FINS_ACDOC.md) — dùng để chuyển sang case `ACDOCA` / Balance Carryforward.
