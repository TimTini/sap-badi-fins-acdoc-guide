# Lỗi thường gặp

[← Home](Home.md) · [Chi tiết](../Huong_dan_BADI_FINS_ACDOC.md#8-lỗi-thường-gặp)

| Triệu chứng | Xử lý nhanh |
|-------------|-------------|
| Field trống sau BCF | `FINSC_ACDOC_FCT` + BAdI `CHANGE_ACTIVE_FIELDS_BCF_*` — [KBA 3588343](../sources/sap-kba/KBA-3588343.md) |
| Breakpoint không dừng | Debug `ZCL_*`, đúng user, SM37+JDBG |
| `CX_BADI_NOT_IMPLEMENTED` | Activate implementation / fallback — [GET BADI](../sources/sap-abap-cloud/3008-ABAPGET_BADI.md) |
| `CX_BADI_MULTIPLY_IMPLEMENTED` | Một implementation active (single-use) |
| Sai parameter | SE24 signature thật |
