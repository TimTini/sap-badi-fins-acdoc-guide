# Nguồn ảnh minh họa (screenshot thật)

Ảnh trong thư mục này là **screenshot SAP GUI thật** lấy từ tài liệu công khai của SAP (Help Portal, SAP Community). Không phải ảnh tự chế/placeholder.

**Lưu ý:** Các ảnh dùng **object ví dụ** của SAP (ví dụ `FI_TAX_BADI_*`, `z_bdi_calc_vat_us`) — **không** phải `ES_FINS_ACDOCA` / `ZBI_FINS_ACDOC_FCAT` trên hệ DEV của bạn. Bố cục màn hình SE19/SE24/Class Builder vẫn đúng; khi triển khai nên chụp lại với tên object thật.

| File | Mô tả | Nguồn | URL |
|------|--------|--------|-----|
| `01-badi-object-relation.svg` | Sơ đồ object (tự vẽ, ASCII) | Repo này | — |
| `02-se19-new-badi-enhancement-spot.png` | SE19 tạo BAdI implementation | SAP Community blog (2013) | [Adding WRBTR column / RFUMSV00](https://community.sap.com/t5/application-development-and-automation-blog-posts/adding-wrbtr-column-in-the-standard-report-rfumsv00-vat-report/ba-p/13242101) — `capture1_293909.png` |
| `03-se19-enhancement-implementation-zbi-active.png` | Enhancement impl + Runtime **Implementation is active** | SAP Help — *How to Implement a BAdI* | [help.sap.com …/f518d884…](https://help.sap.com/saphelp_snc70/helpdata/en/44/f518d884056c30e10000000a114a6b/content.htm) — `TEMPLATE_image007.jpg` |
| `04-se24-method-parameters-bcf-oi.png` | Class Builder / method implementation | SAP Community blog (cùng bài trên) | `capture6_293926.png` |
| `05-se19-deactivate-badi-implementation.png` | Cùng màn hình — bỏ chọn **Implementation is active** | SAP Help — *How to Implement a BAdI* | `TEMPLATE_image007.jpg` (hướng dẫn Runtime Behavior) |
| `06-debug-breakpoint-zcl-im.png` | Class Builder (đặt breakpoint trong method) | SAP Help — *How to Implement a BAdI* | `TEMPLATE_image008.jpg` |
| `07-se84-check-badi-implementation.png` | Object Navigator / enhancement tree (tham khảo SE80/SE84) | SAP Help — *Building Your First BAdI* | [help.sap.com …/f5175e19…](https://help.sap.com/saphelp_snc70/helpdata/en/44/f5175e19fd2463e10000000a1553f7/content.htm) — `TEMPLATE_image004.jpg` |

## Bản quyền

- SAP Help / SAP Community: tuân thủ [Terms of Use](https://www.sap.com/about/legal/terms-of-use.html) khi nhúng trong repo public; ưu tiên **link nguồn** trong caption HTML.
- Khuyến nghị bản production: thay bằng screenshot tự chụp trên DEV (che client, user, transport).

## Tải lại ảnh từ nguồn

```powershell
# Blog SE19 (Hình 2)
curl -sL -A "Mozilla/5.0" "https://community.sap.com/legacyfs/online/storage/blog_attachments/2013/10/capture1_293909.png" -o docs/images/02-se19-new-badi-enhancement-spot.png

# SAP Help (Hình 3, 5, 6)
$hb = "https://help.sap.com/saphelp_snc70/helpdata/en/44/f518d884056c30e10000000a114a6b"
curl -sL "$hb/TEMPLATE_image007.jpg" -o docs/images/03-se19-enhancement-implementation-zbi-active.png
curl -sL "$hb/TEMPLATE_image007.jpg" -o docs/images/05-se19-deactivate-badi-implementation.png
curl -sL "$hb/TEMPLATE_image008.jpg" -o docs/images/06-debug-breakpoint-zcl-im.png
```
