# Sàn tập Dữ liệu và Quyết định

> ⚠️ **ĐÂY LÀ WEBSITE GIẢ LẬP, KHÔNG PHẢI HỆ THỐNG CỦA BẤT KỲ CƠ QUAN NHÀ NƯỚC NÀO.**
>
> Địa danh **“thị xã Mẫu Giang, Tỉnh Mẫu”** và tên 12 đơn vị trên trang đều là hư cấu.
> Mọi số liệu do chương trình sinh ra. Trang không kết nối với hệ thống nào, không
> nhận và không lưu bất kỳ thông tin nào người dùng nhập vào.

**Xem trang tại:** https://nntminh1983.github.io/Boiduongkienthuccongngheso/santap-dulieu/

---

## Đây là gì

Website thực hành của khoá bồi dưỡng **“Ra quyết định dựa trên dữ liệu trong quản lý
nhà nước”** — chương trình 10 buổi × 4 tiết dành cho lãnh đạo cơ quan nhà nước.

Học viên là lãnh đạo, không phải cán bộ kỹ thuật. Vì vậy mọi công cụ trên trang đều
chạy thẳng trên trình duyệt, không cần cài đặt và không cần tài khoản.

## Năm công cụ

| Trang | Dùng ở buổi | Làm được gì |
|---|---|---|
| `du-lieu.html` | 1–10 | Xem trước và tải về 8 bộ dữ liệu giả lập |
| `bang-dieu-khien.html` | 6, 9 | Bảng điều khiển mẫu có bộ lọc, để học viên tham chiếu khi tự dựng bằng Looker Studio |
| `bieu-do.html` | 3 | Bật tắt từng thủ thuật biểu đồ đánh lừa, thấy ngay cùng một số liệu cho hai kết luận trái ngược |
| `quyet-dinh.html` | 7, 8, 10 | **Công cụ chính:** kéo thanh trọng số, thứ hạng bốn phương án đổi ngay; có sẵn phân tích độ nhạy ba kịch bản và tiêu chí loại trừ |
| `kpi.html` | 9 | Sổ 8 KPI có giá trị thật; học viên điền kỳ đo và người chịu trách nhiệm rồi tải CSV về nộp |

## Vì sao mọi thứ đều hư cấu

Học viên là cán bộ, công chức. Nhiều bài tập có bước tải dữ liệu lên Google Trang tính
hoặc trợ lý AI, nên **không được dùng dữ liệu thật của cơ quan**. Bộ dữ liệu giả lập
cho phép học viên thao tác thoải mái mà không chạm vào bất kỳ thông tin cá nhân hay
số liệu thật nào.

Dữ liệu còn được **cố ý** thiết kế để có vấn đề: 4 ô trống và 3 dòng bất thường trong
tệp hồ sơ; đủ bảy loại lỗi trong tệp `05_ho_so_ban.csv`; bảy trong tám KPI chưa đạt
chỉ tiêu. Dữ liệu “sạch hoàn hảo” sẽ không dạy được gì.

## Về kỹ thuật

Trang tĩnh thuần HTML, CSS và JavaScript. Không khung ứng dụng, không bước biên dịch,
không phụ thuộc bên ngoài.

- **Không có máy chủ xử lý, không có cơ sở dữ liệu.** Dữ liệu nhúng sẵn trong
  `du_lieu/*.js` dưới dạng biến JavaScript toàn cục.
- **Không thu thập bất kỳ thông tin nào.** Sổ KPI và công cụ quyết định chỉ chạy trong
  trình duyệt; nội dung nhập vào không được gửi đi đâu và mất khi đóng trang.
- **Không gọi ra bên ngoài.** Trang không tải phông chữ, thư viện hay mã thống kê từ
  máy chủ nào khác.
- Biểu đồ vẽ bằng SVG tự sinh, không dùng thư viện đồ hoạ.
- Mở được bằng cách bấm đúp `index.html`, không cần máy chủ.

Trang đặt thẻ `robots: noindex` và có `robots.txt` chặn thu thập, nên không xuất hiện
trong kết quả tìm kiếm.

## Kiểm chứng số liệu

Mọi con số trên trang được tính lại từ chính bộ dữ liệu trong `du_lieu/`, dùng cùng
công thức với bộ slide của khoá học. Ví dụ ma trận quyết định cho ra:

| Kịch bản trọng số | Thứ hạng |
|---|---|
| Cân bằng | PA1 (66,6) > PA2 (54,1) > PA4 (51,0) > PA3 (45,0) |
| Ưu tiên tiết kiệm | PA1 (75,1) > PA3 (64,4) > PA2 (46,7) > PA4 (27,8) |
| Ưu tiên nghiệp vụ và an toàn | PA4 (71,0) > PA2 (60,3) > PA1 (56,0) > PA3 (30,6) |

Thứ hạng **đảo** giữa các kịch bản — đó chính là bài học trọng tâm của buổi Ngày 04
Chiều: quyết định không nằm ở bảng tính mà nằm ở chỗ tập thể lãnh đạo thống nhất
ưu tiên điều gì.

## Phạm vi sử dụng

Chỉ dùng cho mục đích đào tạo. Không trích dẫn số liệu trên trang vào bất kỳ văn bản
chính thức nào. Không so sánh với bất kỳ đơn vị hành chính thật nào. Không dùng ảnh
chụp màn hình theo cách khiến người xem hiểu nhầm đó là hệ thống thật.

---

## English summary

**This is a simulated data-and-decision training sandbox for Vietnamese public-sector
leaders. It is not a real government system.** The district and ward names are invented
and every figure is randomly generated. The site is fully static, stores nothing and
sends no data anywhere. Please do not reuse it in any way that could suggest it is a
genuine government system.
