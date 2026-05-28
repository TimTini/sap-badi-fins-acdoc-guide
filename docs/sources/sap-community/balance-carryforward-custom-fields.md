# Balance Carryforward — custom field không được carry (tóm tắt)

**Nguồn gốc:** [SAP Community Q&A — Balance Carryforward S/4 Public Cloud](https://community.sap.com/t5/financial-management-q-a/balance-carryforward-s-4-public-cloud/qaq-p/14252529)  
**Đã sanitize:** Chỉ giữ nội dung kỹ thuật; bỏ thông tin người dùng.

## Vấn đề thường gặp

Custom field đã extend lên **ACDOCA** (ví dụ qua Custom Fields and Logic) nhưng **không có giá trị** ở số dư đầu kỳ sau BCF.

## Nguyên nhân (theo SAP Community)

- Chương trình BCF chuẩn tổng hợp theo **dimension chuẩn** (company code, G/L, ledger, …).
- Custom field **không tự động** được coi là “BCF relevant” chỉ vì đã có trên ACDOCA.
- Trên **Public Cloud**, hành vi này được mô tả là **standard** trong clean-core; cần cấu hình/extensibility đúng chỗ.

## Điều kiện cần (tóm tắt)

1. Field đã extend tới Universal Journal (**ACDOCA**).
2. Field được đánh dấu **Balance Carryforward Relevant** (nếu loại field và edition hỗ trợ).
3. Với case on-prem / có BAdI: có thể cần **`BADI_FINS_ACDOC_FIELDCAT`** + method `CHANGE_ACTIVE_FIELDS_BCF_*` để đưa field vào danh sách active fields cho BCF.

## Cách xác minh nhanh

1. Chạy / xem kết quả BCF (app Balance Carryforward hoặc `FAGLGVTR`).
2. **Display Line Items** — năm mới, cùng ledger/account đã BCF.
3. Thêm cột custom field vào layout.
4. Nếu có dòng opening balance nhưng cột custom field **trống** → field chưa được BCF logic nhận.

## Tham chiếu SAP (trong thread)

- Balance Carryforward — extensibility / field extensibility (SAP Help — tìm theo release của hệ thống).
- Blog kỹ thuật: *S/4HANA Finance Balance Carryforward technical tip* (SAP Community / SAP Help).
