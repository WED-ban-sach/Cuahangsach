// Dữ liệu mẫu: thể loại + 19 sản phẩm. Ảnh bìa: bỏ file vào /images đặt tên theo mã (vd NV01.jpg), chưa có ảnh thì tự hiện bìa màu.
// Trường tuỳ chọn cho trang chi tiết: tacGia, dichGia, soTrang, namXB (có thì hiện, không có thì ẩn dòng đó).
const THE_LOAI = [
  {id:'ngoaivan', ten:'Sách Ngoại Văn', icon:'🌐'},
  {id:'vanhoc', ten:'Sách Văn Học', icon:'📖'},
  {id:'doisong', ten:'Sách Đời Sống', icon:'🌱'},
  {id:'khxh', ten:'Sách Khoa Học Xã Hội', icon:'🏛️'},
  {id:'khtn', ten:'Sách Khoa Học Tự Nhiên', icon:'🔬'},
  {id:'thieunhi', ten:'Sách Thiếu Nhi', icon:'🧸'},
  {id:'giaokhoa', ten:'Sách Giáo Khoa', icon:'🎓'}
];
const DU_LIEU_MAU = [
  {ma:'NV01', ten:"Life A1-A2 Student’s Book 2nd Edition", loai:'ngoaivan', gia:160000, tacGia:'John Hughes, Helen Stephenson, Paul Dummett', hinh:'images/stubook2nd.jpg', moTa:'Sách ngữ pháp tiếng Anh nổi tiếng.'},
  {ma:'NV02', ten:'The Little Prince', loai:'ngoaivan', gia:120000, tacGia:'Antoine de Saint-Exupéry', hinh:'images/NV02.jpg', moTa:'Bản tiếng Anh của tác phẩm kinh điển.'},
  {ma:'NV03', ten:"Harry Potter and the Philosopher's Stone", loai:'ngoaivan', gia:210000, tacGia:'J. K. Rowling', hinh:'images/NV03.jpg', moTa:'Tập đầu tiên của series Harry Potter.'},
  {ma:'VH01', ten:'Dế Mèn Phiêu Lưu Ký', loai:'vanhoc', gia:68000, tacGia:'Tô Hoài', hinh:'images/VH01.jpg', moTa:'Truyện của Tô Hoài.'},
  {ma:'VH02', ten:'Số đỏ', loai:'vanhoc', gia:75000, tacGia:'Vũ Trọng Phụng', hinh:'images/VH02.jpg', moTa:'Tiểu thuyết của Vũ Trọng Phụng.'},
  {ma:'VH03', ten:'Tắt đèn', loai:'vanhoc', gia:55000, tacGia:'Ngô Tất Tố', hinh:'images/VH03.jpg', moTa:'Tiểu thuyết của Ngô Tất Tố.'},
  {ma:'DS01', ten:'Đắc nhân tâm', loai:'doisong', gia:86000, tacGia:'Dale Carnegie', hinh:'images/DS01.jpg', moTa:'Nghệ thuật đối nhân xử thế.'},
  {ma:'DS02', ten:'Nhà giả kim', loai:'doisong', gia:79000, tacGia:'Paulo Coelho', hinh:'images/DS02.jpg', moTa:'Hành trình theo đuổi giấc mơ.'},
  {ma:'DS03', ten:'Tuổi trẻ đáng giá bao nhiêu', loai:'doisong', gia:80000, tacGia:'Rosie Nguyễn', hinh:'images/DS03.jpg', moTa:'Sách dành cho người trẻ.'},
  {ma:'XH01', ten:'Sapiens: Lược sử loài người', loai:'khxh', gia:189000, tacGia:'Yuval Noah Harari', hinh:'images/XH01.jpg', moTa:'Lịch sử loài người từ thời nguyên thủy.'},
  {ma:'XH02', ten:'Việt Nam Sử Lược', loai:'khxh', gia:140000, tacGia:'Trần Trọng Kim', hinh:'images/vnsl.jpg', moTa:'Sách sử của nhà nghiên cứu sử học Trần Trọng Kim.'},
  {ma:'XH03', ten:'Việt Nam Sử Lược - Ấn Bản Cao Cấp', loai:'khxh', gia:530000, tacGia:'Trần Trọng Kim', hinh:'images/vnsldb.jpg', moTa:'Ấn bản kỷ niệm 100 năm xuất bản lần đầu (1920 - 2020) của tác phẩm Việt Nam Sử Lược của học giả Trần Trọng Kim.'},
  {ma:'TN01', ten:'Lược sử thời gian', loai:'khtn', gia:110000, tacGia:'Stephen Hawking', hinh:'images/TN01.jpg', moTa:'Vũ trụ học phổ thông.'},
  {ma:'TN02', ten:'Vũ trụ trong vỏ hạt dẻ', loai:'khtn', gia:135000, tacGia:'Stephen Hawking', hinh:'images/TN02.jpg', moTa:'Sách của Stephen Hawking.'},
  {ma:'TN03', ten:'Nguồn gốc các loài', loai:'khtn', gia:150000, tacGia:'Charles Darwin', hinh:'images/TN03.jpg', moTa:'Thuyết tiến hóa của Darwin.'},
  {ma:'NH01', ten:'Doraemon - Tập 1', loai:'thieunhi', gia:25000, tacGia:'Fujiko F. Fujio', hinh:'images/NH01.jpg', moTa:'Truyện tranh thiếu nhi.'},
  {ma:'NH02', ten:'Truyện cổ Grimm', loai:'thieunhi', gia:90000, tacGia:'Anh em nhà Grimm', hinh:'images/NH02.jpg', moTa:'Tuyển tập truyện cổ tích.'},
  {ma:'NH03', ten:'Cho tôi xin một vé đi tuổi thơ', loai:'thieunhi', gia:85000, tacGia:'Nguyễn Nhật Ánh', hinh:'images/NH03.jpg', moTa:'Truyện của Nguyễn Nhật Ánh.'},
  {ma:'GK01', ten:'Toán 12 - Tập 1', loai:'giaokhoa', gia:22000, tacGia:'Bộ Giáo dục và Đào tạo', hinh:'images/GK01.jpg', moTa:'Sách giáo khoa Toán lớp 12.'},
  {ma:'GK02', ten:'Ngữ văn 12 - Tập 1', loai:'giaokhoa', gia:20000, tacGia:'Bộ Giáo dục và Đào tạo', hinh:'images/GK02.jpg', moTa:'Sách giáo khoa Ngữ văn lớp 12.'}
];
