// ===== DỮ LIỆU SÁCH =====
// THE_LOAI: danh sách thể loại (id gắn cho từng sách, ten hiển thị trên menu).
// DU_LIEU_MAU: danh sách sách. Ảnh bìa đặt trong thư mục image.

const THE_LOAI = [
  { id: "ngoaivan", ten: "Sách Ngoại Văn" },
  { id: "vanhoc", ten: "Sách Văn Học" },
  { id: "doisong", ten: "Sách Đời Sống" },
  { id: "khxh", ten: "Sách Khoa Học Xã Hội" },
  { id: "khtn", ten: "Sách Khoa Học Tự Nhiên" },
  { id: "thieunhi", ten: "Sách Thiếu Nhi" },
  { id: "giaokhoa", ten: "Sách Giáo Khoa" }
];

const DU_LIEU_MAU = [
  {
    ma: "NV01",
    ten: "Life A1-A2 Student’s Book 2nd Edition",
    loai: "ngoaivan",
    gia: 160000,
    tacGia: "John Hughes, Helen Stephenson, Paul Dummett",
    hinh: "../image/NV01.jpg"
  },
  {
    ma: "NV02",
    ten: "The Little Prince",
    loai: "ngoaivan",
    gia: 186000,
    tacGia: "Antoine de Saint-Exupéry",
    hinh: "../image/NV02.jpg"
  },
  {
    ma: "NV03",
    ten: "Harry Potter and the Philosopher's Stone",
    loai: "ngoaivan",
    gia: 120000,
    tacGia: "J. K. Rowling",
    hinh: "../image/NV03.jpg"
  },
  {
    ma: "VH01",
    ten: "Dế Mèn Phiêu Lưu Ký",
    loai: "vanhoc",
    gia: 50000,
    tacGia: "Tô Hoài",
    hinh: "../image/VH01.jpg"
  },
  {
    ma: "VH02",
    ten: "Số Đỏ",
    loai: "vanhoc",
    gia: 54000,
    tacGia: "Vũ Trọng Phụng",
    hinh: "../image/VH02.jpg"
  },
  {
    ma: "VH03",
    ten: "Tắt Đèn",
    loai: "vanhoc",
    gia: 40000,
    tacGia: "Ngô Tất Tố",
    hinh: "../image/VH03.jpg"
  },
  {
    ma: "DS01",
    ten: "Đắc Nhân Tâm",
    loai: "doisong",
    gia: 100000,
    tacGia: "Dale Carnegie",
    hinh: "../image/DS01.jpg"
  },
  {
    ma: "DS02",
    ten: "Nhà Giả Kim",
    loai: "doisong",
    gia: 60000,
    tacGia: "Paulo Coelho",
    hinh: "../image/DS02.jpg"
  },
  {
    ma: "DS03",
    ten: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    loai: "doisong",
    gia: 80000,
    tacGia: "Rosie Nguyễn",
    hinh: "../image/DS03.jpg"
  },
  {
    ma: "XH01",
    ten: "Sapiens: Lược Sử Loài Người",
    loai: "khxh",
    gia: 189000,
    tacGia: "Yuval Noah Harari",
    hinh: "../image/XH01.jpg"
  },
  {
    ma: "XH02",
    ten: "Việt Nam Sử Lược",
    loai: "khxh",
    gia: 140000,
    tacGia: "Trần Trọng Kim",
    hinh: "../image/XH02.jpg"
  },
  {
    ma: "XH03",
    ten: "Việt Nam Sử Lược - Ấn Bản Cao Cấp",
    loai: "khxh",
    gia: 530000,
    tacGia: "Trần Trọng Kim",
    hinh: "../image/XH03.jpg"
  },
  {
    ma: "XH04",
    ten: "Cựu hoàng đế Bảo Đại qua một số tư liệu chưa công bố",
    loai: "khxh",
    gia: 90000,
    tacGia: "Phạm Hy Tùng",
    hinh: "../image/XH04.jpg"
  },
  {
    ma: "XH05",
    ten: "Các Mác và Tư Bản - Trích tác phẩm kinh điển",
    loai: "khxh",
    gia: 112000,
    tacGia: "Phạm Đức Hải",
    hinh: "../image/XH05.jpg"
  },
  {
    ma: "XH06",
    ten: "Hải Cảng Biển Đông",
    loai: "khxh",
    gia: 187000,
    tacGia: "Dr A. Benoist De La Grandière",
    hinh: "../image/XH06.jpg"
  },
  {
    ma: "TN01",
    ten: "Lược Sử Thời Gian",
    loai: "khtn",
    gia: 98000,
    tacGia: "Stephen Hawking",
    hinh: "../image/TN01.jpg"
  },
  {
    ma: "TN02",
    ten: "Vũ Trụ Trong Vỏ Hạt Dẻ",
    loai: "khtn",
    gia: 98000,
    tacGia: "Stephen Hawking",
    hinh: "../image/TN02.jpg",
  },
  {
    ma: "TN03",
    ten: "Nguồn Gốc Các Loài",
    loai: "khtn",
    gia: 156000,
    tacGia: "Charles Darwin",
    hinh: "../image/TN03.jpg",
  },
  {
    ma: "TT01",
    ten: "Doraemon - Tập 1",
    loai: "thieunhi",
    gia: 23000,
    tacGia: "Fujiko F. Fujio",
    hinh: "../image/TT01.jpg",
  },
  {
    ma: "TT02",
    ten: "Truyện Cổ Grimm",
    loai: "thieunhi",
    gia: 90000,
    tacGia: "Anh em nhà Grimm",
    hinh: "../image/TT02.jpg",
  },
  {
    ma: "TT03",
    ten: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    loai: "thieunhi",
    gia: 82000,
    tacGia: "Nguyễn Nhật Ánh",
    hinh: "../image/TT03.jpg",
  },
  {
    ma: "GK01",
    ten: "Toán 12 - Tập 1",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK01.jpg",
  },
  {
    ma: "GK02",
    ten: "Ngữ văn 12 - Tập 1",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK02.jpg",
  }
];

// LocalStorage chưa có data thì seed
if (localStorage.getItem("dsSach") === null) {
  localStorage.setItem("dsSach", JSON.stringify(DU_LIEU_MAU));
}
