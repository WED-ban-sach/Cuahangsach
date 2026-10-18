// ===== DỮ LIỆU SÁCH =====
// THE_LOAI: danh sách thể loại (id gắn cho từng sách, ten hiển thị trên menu).
// DU_LIEU_MAU: danh sách sách. Ảnh bìa để trong thư mục images, dùng đường dẫn tương đối (vd: "images/vnsl.jpg").

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
    hinh: "images/stubook2nd.jpg",
    moTa: ""
  },
  {
    ma: "NV02",
    ten: "The Little Prince",
    loai: "ngoaivan",
    gia: 120000,
    tacGia: "Antoine de Saint-Exupéry",
    hinh: "images/NV02.jpg",
    moTa: ""
  },
  {
    ma: "NV03",
    ten: "Harry Potter and the Philosopher's Stone",
    loai: "ngoaivan",
    gia: 210000,
    tacGia: "J. K. Rowling",
    hinh: "images/NV03.jpg",
    moTa: ""
  },
  {
    ma: "VH01",
    ten: "Dế Mèn Phiêu Lưu Ký",
    loai: "vanhoc",
    gia: 68000,
    tacGia: "Tô Hoài",
    hinh: "images/VH01.jpg",
    moTa: ""
  },
  {
    ma: "VH02",
    ten: "Số đỏ",
    loai: "vanhoc",
    gia: 75000,
    tacGia: "Vũ Trọng Phụng",
    hinh: "images/VH02.jpg",
    moTa: ""
  },
  {
    ma: "VH03",
    ten: "Tắt đèn",
    loai: "vanhoc",
    gia: 55000,
    tacGia: "Ngô Tất Tố",
    hinh: "images/VH03.jpg",
    moTa: ""
  },
  {
    ma: "DS01",
    ten: "Đắc nhân tâm",
    loai: "doisong",
    gia: 86000,
    tacGia: "Dale Carnegie",
    hinh: "images/DS01.jpg",
    moTa: ""
  },
  {
    ma: "DS02",
    ten: "Nhà giả kim",
    loai: "doisong",
    gia: 79000,
    tacGia: "Paulo Coelho",
    hinh: "images/DS02.jpg",
    moTa: ""
  },
  {
    ma: "DS03",
    ten: "Tuổi trẻ đáng giá bao nhiêu",
    loai: "doisong",
    gia: 80000,
    tacGia: "Rosie Nguyễn",
    hinh: "images/DS03.jpg",
    moTa: ""
  },
  {
    ma: "XH01",
    ten: "Sapiens: Lược sử loài người",
    loai: "khxh",
    gia: 189000,
    tacGia: "Yuval Noah Harari",
    hinh: "images/XH01.jpg",
    moTa: ""
  },
  {
    ma: "XH02",
    ten: "Việt Nam Sử Lược",
    loai: "khxh",
    gia: 140000,
    tacGia: "Trần Trọng Kim",
    hinh: "images/vnsl.jpg",
    moTa: ""
  },
  {
    ma: "XH03",
    ten: "Việt Nam Sử Lược - Ấn Bản Cao Cấp",
    loai: "khxh",
    gia: 530000,
    tacGia: "Trần Trọng Kim",
    hinh: "images/vnsldb.jpg",
    moTa: ""
  },
  {
    ma: "XH04",
    ten: "Cựu hoàng đế Bảo Đại qua một số tư liệu chưa công bố",
    loai: "khxh",
    gia: 90000,
    tacGia: "Phạm Hy Tùng",
    hinh: "images/chbd.jpg",
    moTa: ""
  },
  {
    ma: "TN01",
    ten: "Lược sử thời gian",
    loai: "khtn",
    gia: 110000,
    tacGia: "Stephen Hawking",
    hinh: "images/TN01.jpg",
    moTa: ""
  },
  {
    ma: "TN02",
    ten: "Vũ trụ trong vỏ hạt dẻ",
    loai: "khtn",
    gia: 135000,
    tacGia: "Stephen Hawking",
    hinh: "images/TN02.jpg",
    moTa: ""
  },
  {
    ma: "TN03",
    ten: "Nguồn gốc các loài",
    loai: "khtn",
    gia: 150000,
    tacGia: "Charles Darwin",
    hinh: "images/TN03.jpg",
    moTa: ""
  },
  {
    ma: "NH01",
    ten: "Doraemon - Tập 1",
    loai: "thieunhi",
    gia: 25000,
    tacGia: "Fujiko F. Fujio",
    hinh: "images/NH01.jpg",
    moTa: ""
  },
  {
    ma: "NH02",
    ten: "Truyện cổ Grimm",
    loai: "thieunhi",
    gia: 90000,
    tacGia: "Anh em nhà Grimm",
    hinh: "images/NH02.jpg",
    moTa: ""
  },
  {
    ma: "NH03",
    ten: "Cho tôi xin một vé đi tuổi thơ",
    loai: "thieunhi",
    gia: 85000,
    tacGia: "Nguyễn Nhật Ánh",
    hinh: "images/NH03.jpg",
    moTa: ""
  },
  {
    ma: "GK01",
    ten: "Toán 12 - Tập 1",
    loai: "giaokhoa",
    gia: 22000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "images/GK01.jpg",
    moTa: ""
  },
  {
    ma: "GK02",
    ten: "Ngữ văn 12 - Tập 1",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "images/GK02.jpg",
    moTa: ""
  }
];
