// ===== DỮ LIỆU SÁCH =====
// THE_LOAI: danh sách thể loại (id gắn cho từng sách, ten hiển thị trên menu).
// DU_LIEU_MAU: danh sách sách. Ảnh bìa đặt trong thư mục image. moTa: mô tả sách (để "" nếu chưa có).

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
    hinh: "../image/NV01.jpg",
    moTa: "Life là bộ sách học tiếng Anh thú vị với 6 cấp độ dành cho người lớn. Dựa trên nội dung của National Geographic, Life biến quá trình học tập của bạn thành một cuộc hành trình tuyệt vời với những hình ảnh đẹp không thể cưỡng lại được."
  },
  {
    ma: "NV02",
    ten: "The Little Prince",
    loai: "ngoaivan",
    gia: 186000,
    tacGia: "Antoine de Saint-Exupéry",
    hinh: "../image/NV02.jpg",
    moTa: "Kể về một hoàng tử nhỏ cô đơn từ tiểu tinh cầu xa xôi viếng thăm rồi lại lìa xa Trái Đất, Hoàng Tử Bé được xem là một trong những tác phẩm thơ mộng nhất của mọi thời đại. Cho đến nay, tác phẩm ra đời vào năm 1943 của nhà văn Saint – Exupéry này đã được dịch sang hơn 300 ngôn ngữ và phát hành hơn 140 triệu bản trên khắp thế giới. Sự giản dị, trong sáng tỏa khắp tác phẩm đã khiến Hoàng Tử Bé trở thành một bài thơ bất hủ mà mãi mãi người ta muốn đem làm quà tặng của tình yêu."
  },
  {
    ma: "NV03",
    ten: "Harry Potter and the Philosopher's Stone",
    loai: "ngoaivan",
    gia: 120000,
    tacGia: "J. K. Rowling",
    hinh: "../image/NV03.jpg",
    moTa: "Harry Potter thậm chí chưa bao giờ nghe nói về Hogwarts khi những lá thư bắt đầu rơi trên tấm thảm chùi chân ở số bốn, đường Privet Drive. Được ghi địa chỉ bằng mực xanh trên giấy da hơi vàng có đóng dấu màu tím, chúng nhanh chóng bị tịch thu bởi người dì và người chú ghê rợn của anh. Sau đó, vào ngày sinh nhật thứ mười một của Harry, một người đàn ông khổng lồ có đôi mắt bọ cánh cứng tên là Rubeus Hagrid xông vào với một tin tức đáng kinh ngạc: Harry Potter là một phù thủy, và cậu có một suất tại Trường Ma thuật và Pháp thuật Hogwarts. Một cuộc phiêu lưu đáng kinh ngạc sắp bắt đầu! Các ấn bản mới này của bộ truyện cổ điển và bán chạy nhất quốc tế, từng đoạt nhiều giải thưởng có những chiếc áo khoác mới có thể lấy ngay của Jonny Duddle, với sức hấp dẫn lớn đối với trẻ em, để đưa Harry Potter đến với thế hệ độc giả tiếp theo. Đã đến lúc VƯỢT QUA KỲ DIỆU."
  },
  {
    ma: "NV04",
    ten: "100 Things to Know About Numbers, Computers Coding",
    loai: "ngoaivan",
    gia: 423000,
    tacGia: "Usborne Publishing Ltd",
    hinh: "../image/NV04.jpg",
    moTa: "Bạn có biết rằng có một điểm duy nhất trên não của bạn có thể nhận ra các con số không ? Hay những lỗi máy tính đầu tiên là côn trùng thực sự và hầu hết Internet đều nằm dưới nước ? Cuốn sách hấp dẫn này chứa đầy 100 sự kiện hấp dẫn, hình minh họa đồ họa thông tin, sáng sủa, bảng thuật ngữ và chỉ mục, cũng như các liên kết đến các trang web được lựa chọn đặc biệt để tìm hiểu thêm."
  },
  {
    ma: "VH01",
    ten: "Hồn Trương Ba Da Hàng Thịt - Tôi Và Chúng Ta",
    loai: "vanhoc",
    gia: 60000,
    tacGia: "Lưu Quang Vũ",
    hinh: "../image/VH01.jpg",
    moTa: "Với gia tài tác phẩm để lại, có thể nói, Lưu Quang Vũ đã có những đóng góp dấu ấn trong sự nghiệp sáng tác văn chương và là một trong những tác gia quan trọng của văn học Việt Nam sau 1975, đặc biệt về lĩnh vực sân khấu. Nội dung hai vở kịch nổi tiếng Tôi và chúng ta, Hồn Trương Ba da hàng thịt của Lưu Quang Vũ cũng được trích giảng trong chương trình Ngữ Văn của trường phổ thông."
  },
  {
    ma: "VH02",
    ten: "Số Đỏ",
    loai: "vanhoc",
    gia: 54000,
    tacGia: "Vũ Trọng Phụng",
    hinh: "../image/VH02.jpg",
    moTa: "Văn học Việt Nam thời xưa có nhiều tác phẩm có giá trị to lớn về mặt nhân văn và nghệ thuật, đã được công nhận và chứng thực qua thời gian. Danh tác : Số đỏ (Vũ Trọng Phụng) cũng vậy. Hy vọng quyển sách sau khi tái bản sẽ giúp đông đảo tầng lớp độc giả thêm hiểu, tự hào và nâng niu kho tàng văn học nước nhà."
  },
  {
    ma: "VH03",
    ten: "Tắt Đèn",
    loai: "vanhoc",
    gia: 40000,
    tacGia: "Ngô Tất Tố",
    hinh: "../image/VH03.jpg",
    moTa: "Tắt Đèn là một trong những tác phẩm văn học tiêu biểu nhất của nhà văn Ngô Tất Tố (tiểu thuyết, in trên báo Việt nữ năm 1937). Đây là một tác phẩm văn học hiện thực phê phán với nội dung nói về cuộc sống khốn khổ của tầng lớp nông dân Việt Nam đầu thế kỉ 20 dưới ách đô hộ của thực dân Pháp."
  },
  {
    ma: "VH04",
    ten: "Crl C",
    loai: "vanhoc",
    gia: 77000,
    tacGia: "Đinh Ngọc Anh",
    hinh: "../image/VH04.jpg",
    moTa: "Chuyện gì sẽ xảy ra nếu như một ngày đẹp trời, tất cả những người xung quanh bạn trở thành một giống loài quái dị và trong mắt của chúng “Nó”, bạn mới là kẻ quái dị bị săn lùng ? Không chỉ là một câu chuyện viễn tưởng mang màu sắc quái dị, giật gân, Ctrl C còn khiến chúng ta suy ngẫm về bản thể con người, rằng điều gì khiến ta là chính mình giữa một xã hội mà người nhà nhà “copy” những người khác."
  },
  {
    ma: "DS01",
    ten: "Đắc Nhân Tâm",
    loai: "doisong",
    gia: 100000,
    tacGia: "Dale Carnegie",
    hinh: "../image/DS01.jpg",
    moTa: "Đắc nhân tâm của Dale Carnegie là quyển sách của mọi thời đại và một hiện tượng đáng kinh ngạc trong ngành xuất bản Hoa Kỳ. Trong suốt nhiều thập kỷ tiếp theo và cho đến tận bây giờ, tác phẩm này vẫn chiếm vị trí số một trong danh mục sách bán chạy nhất và trở thành một sự kiện có một không hai trong lịch sử ngành xuất bản thế giới và được đánh giá là một quyển sách có tầm ảnh hưởng nhất mọi thời đại."
  },
  {
    ma: "DS02",
    ten: "Nhà Giả Kim",
    loai: "doisong",
    gia: 60000,
    tacGia: "Paulo Coelho",
    hinh: "../image/DS02.jpg",
    moTa: "Nhà Giả Kim không đơn thuần là một cuốn tiểu thuyết, mà là bản đồ dẫn lối đến giấc mơ, khao khát và định mệnh của mỗi con người. Câu chuyện về chàng trai chăn cừu Santiago không chỉ mang đến những cuộc phiêu lưu hấp dẫn, mà còn mở ra nhiều tầng triết lý sâu sắc về cuộc sống."
  },
  {
    ma: "DS03",
    ten: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    loai: "doisong",
    gia: 80000,
    tacGia: "Rosie Nguyễn",
    hinh: "../image/DS03.jpg",
    moTa: " Phần giới thiệu sách của tác giả : Bạn hối tiếc vì không nắm bắt lấy một cơ hội nào đó, chẳng có ai phải mất ngủ. Bạn trải qua những ngày tháng nhạt nhẽo với công việc bạn căm ghét, người ta chẳng hề bận lòng. Bạn có chết mòn nơi xó tường với những ước mơ dang dở, đó không phải là việc của họ. Suy cho cùng, quyết định là ở bạn. Muốn có điều gì hay không là tùy bạn. Nên hãy làm những điều bạn thích. Hãy đi theo tiếng nói trái tim. Hãy sống theo cách bạn cho là mình nên sống. Vì sau tất cả, chẳng ai quan tâm."
  },
  {
    ma: "DS04",
    ten: "Cái Tôi Vốn Dĩ Không Tồn Tại – Khai Sáng Bằng Triết Học Phương Đông",
    loai: "doisong",
    gia: 185000,
    tacGia: "Shinmei P",
    hinh: "../image/DS04.jpg",
    moTa: "Cuốn sách “Cái Tôi Vốn Dĩ Không Tồn Tại” là một hành trình nhẹ nhàng nhưng đầy sức mạnh, dẫn dắt bạn bước ra khỏi ảo tưởng về “cái tôi”. Dựa trên tinh hoa của triết học phương Đông như Phật giáo, Lão giáo và Thiền, cuốn sách giúp bạn nhìn sâu vào bên trong, tháo gỡ những khuôn mẫu vô thức, và tìm lại sự bình an vốn có."
  },
  {
    ma: "DS05",
    ten: "Lý Thuyết Trò Chơi - Ứng Dụng Trong Cuộc Sống Thường Ngày",
    loai: "doisong",
    gia: 111000,
    tacGia: "Len Fisher",
    hinh: "../image/DS05.jpg",
    moTa: "Cuốn sách phân tích các chiến lược tâm lý để giúp chúng ta xử lý các tình huống hằng ngày sau cho cả mình lẫn đối phương đều đạt được lợi ích tối đa. Lý thuyết trò chơi phân tích và bóc trần những tình huống này và đưa ra giải pháp dựa theo các tính toán đã được nghiên cứu và chứng mình, nhằm đưa ra những giải pháp hành động để giảm thiểu thiệt hại và tối đa hóa lợi ích cho tất cả các bên. Hướng mọi người tới sự hợp tác thay vì các trò xung đột vô ích."
  },
  {
    ma: "XH01",
    ten: "Sapiens: Lược Sử Loài Người",
    loai: "khxh",
    gia: 189000,
    tacGia: "Yuval Noah Harari",
    hinh: "../image/XH01.jpg",
    moTa: "Sapiens là một câu chuyện lịch sử lớn về nền văn minh nhân loại – cách chúng ta phát triển từ xã hội săn bắt hái lượm thuở sơ khai đến cách chúng ta tổ chức xã hội và nền kinh tế ngày nay."
  },
  {
    ma: "XH02",
    ten: "Việt Nam Sử Lược",
    loai: "khxh",
    gia: 140000,
    tacGia: "Trần Trọng Kim",
    hinh: "../image/XH02.jpg",
    moTa: "Sách sử của nhà nghiên cứu sử học Trần Trọng Kim. Việt Nam sử lược là cuốn sách lịch sử Việt Nam đầu tiên viết bằng chữ quốc ngữ, hệ thống lại toàn bộ lịch sử nước Việt (cho đến thời kỳ Pháp thuộc)."
  },
  {
    ma: "XH03",
    ten: "Việt Nam Sử Lược - Ấn Bản Cao Cấp",
    loai: "khxh",
    gia: 530000,
    tacGia: "Trần Trọng Kim",
    hinh: "../image/XH03.jpg",
    moTa: "Tác phẩm Việt Nam Sử Lược của học giả Trần Trọng Kim, ấn bản kỷ niệm 100 năm xuất bản lần đầu (1920 - 2020). Nhằm kỷ niệm cột mốc này, chúng tôi đã tiến hành tái bản tác phẩm Việt Nam sử lược, dựa theo bản in của nhà Tân Việt năm 1954, có bổ sung một số chi tiết từ các bản in năm 1920, 1928 và 1971. Đồng thời tuyển lựa và thêm vào một số hình ảnh minh họa từ nguồn tranh dân gian, bảo tàng và một số tư liệu sách báo xưa, với mong muốn gửi tới bạn đọc một ấn bản không chỉ chỉn chu về mặt nội dung mà còn trang nhã về mặt hình thức."
  },
  {
    ma: "XH04",
    ten: "Cựu hoàng đế Bảo Đại qua một số tư liệu chưa công bố",
    loai: "khxh",
    gia: 90000,
    tacGia: "Phạm Hy Tùng",
    hinh: "../image/XH04.jpg",
    moTa: "Cuốn sách giới thiệu trích đoạn gần 70 bức thư viết tay của các hoàng tử, công chúa viết tại Pháp trong giai đoạn từ năm 1949 đến đầu năm 1955 gửi cha đang ở Việt Nam, và thư của một số nhân vật khác gửi Cựu hoàng để xâu chuỗi hành trạng của ông cùng những người có liên quan, nhằm giúp nhận dạng rõ nét hơn nữa diện mạo đích thực của nhân vật này."
  },
  {
    ma: "XH05",
    ten: "Các Mác và Tư Bản - Trích tác phẩm kinh điển",
    loai: "khxh",
    gia: 112000,
    tacGia: "Phạm Đức Hải",
    hinh: "../image/XH05.jpg",
    moTa: "Là nhà khoa học thiên tài, Các Mác cùng Ăng-ghen đã sáng tạo ra quy luật phát triển của lịch sử loài người; tìm ra quy luật vận động riêng của phương thức sản xuất tư bản chủ nghĩa hiện đại và của xã hội tư sản do phương thức đó đẻ ra - quy luật giá trị thặng dư; tìm ra sứ mệnh lịch sử của giai cấp vô sản. Đây là những cống hiến có ý nghĩa thời đại, hình thành một thế giới quan, và một phương pháp luận khoa học, cách mạng, đem lại cho nhân loại và cho giai cấp công nhân một công cụ quan trọng để nhận thức và cải tạo thế giới. Càng hiểu thêm về cuộc đời của Các Mác, chúng ta càng trân quý, biết ơn những giá trị mà ông đã dành cả cuộc đời mình để đấu tranh và xây dựng. Điều ý nghĩa hơn khi suy ngẫm về cuộc đời ông chính là giúp chúng ta nhận ra rằng dù trong hoàn cảnh hết sức khó khăn, thử thách của cuộc sống, chúng ta vẫn phải luôn kiên định với mục tiêu, lý tưởng của mình và kiên trì vượt qua mọi nghịch cảnh. (trích Lời nói đầu)"
  },
  {
    ma: "XH06",
    ten: "Hải Cảng Viển Đông",
    loai: "khxh",
    gia: 187000,
    tacGia: "Dr A. Benoist De La Grandière",
    hinh: "../image/XH06.jpg",
    moTa: "Bác sĩ Auguste Benoist de la Grandière đã dành thời gian ở Viễn Đông trong khi người châu Âu, dẫn đầu là Pháp và Anh, đang cố gắng xâm chiếm thuộc địa ở đó. Ông đã chia sẻ khám phá đầy kinh ngạc và thành thực của mình về một thế giới mới: các cảng lớn của châu Á như Hồng Kông, Quảng Châu, Ma Cao, Hạ Môn, Ngô Tùng và Thượng Hải vừa mới được khai quan hoàn toàn cho người phương Tây; trung tâm thương mại thịnh vượng Singapore; và Manila, vẫn còn thuộc Tây Ban Nha nhưng rất đậm chất Trung Hoa. Tất cả những hình ảnh đã khắc sâu trong ký ức về một thế giới đã qua nhưng dường như vẫn luôn mới mẻ."
  },
  {
    ma: "XH07",
    ten: "Lịch Sử Việt Nam Từ Nguồn Gốc Đến Giữa Thế Kỉ XX",
    loai: "khxh",
    gia: 216000,
    tacGia: "Lê Thành Khôi",
    hinh: "../image/XH07.jpg",
    moTa: "Tác phẩm Lịch sử Việt Nam, từ nguồn gốc đến giữa thế kỷ XX này là sự kết hợp của hai chuyên khảo mang tính kinh điển về lịch sử và văn hóa Việt Nam của Giáo sư Lê Thành Khôi, người thuộc về số ít các sử gia Việt đương đại quan trọng nhất. Đó là cuốn Le Viêt-Nam, Histoire et Civilisation (Việt Nam, Lịch sử và Văn minh, Nxb Minuit, Paris, 1955) và Histoire du Viêt Nam, des origines à 1858 (Lịch sử Việt Nam, từ nguồn gốc đến năm 1858, Nxb Sud-Est Asie, Paris, 1982). Công trình từ lâu đã được các nhà Việt Nam coi như sách tham khảo căn bản khi nghiên cứu về lịch sử Việt Nam. Đây là lần đầu tiên tác phẩm được coi như kiệt tác sử học này được xuất bản bằng tiếng Việt."
  },
  {
    ma: "XH08",
    ten: "Lịch Sử Việt Nam Từ Nguồn Gốc Đến Giữa Thế Kỉ XIX",
    loai: "khxh",
    gia: 140000,
    tacGia: "Đào Duy Anh",
    hinh: "../image/XH08.jpg",
    moTa: "Đào Duy Anh (25/4/1904 - 1/4/1988) là nhà sử học, địa lý, từ điển học, ngôn ngữ học, nhà nghiên cứu văn hóa, tôn giáo, văn học dân gian nổi tiếng của Việt Nam. Ông được xem là người mở đầu cho nhiều ngành khoa học xã hội Việt Nam và là một trong số ít người Việt Nam được ghi tên vào bộ từ điển Larousse với tư cách là một nhà bách khoa toàn thư của thời hiện đại. Đặc biệt, ông là một nhà sử học lớn với những công trình nghiên cứu mang tính khai phá, đặt nền tảng cho sự hình thành nền sử học Việt Nam hiện đại. Theo đánh giá của GS-NGND Phan Huy Lê: “GS Đào Duy Anh là người thầy của những thế hệ sử gia đầu tiên được đào tạo từ nền đại học Việt Nam sau Cách mạng tháng Tám 1945” Công trình Lịch Sử Việt Nam Từ Nguồn Gốc Đến Thế Kỷ XIX thuộc cụm công trình lịch sử và văn hóa Việt Nam của Đào Duy Anh vinh dự được truy tặng Giải thưởng Hồ Chí Minh về khoa học xã hội năm 2000. Mời các bạn đón đọc"
  },
  {
    ma: "XH09",
    ten: "Đại Việt Sử Ký Toàn Thư",
    loai: "khxh",
    gia: 233000,
    tacGia: "Dịch Giả Cao Huy Giu - Đào Duy Anh",
    hinh: "../image/XH09.jpg",
    moTa: "Trong các sách lịch sử cũ của ta , thì Đại Việt sử ký toàn thư là một bộ sử lớn chép từ Hồng Bàng đến Ất Mão ( 1675) đời vua Gia Tôn nhà Lê. Đại Việt sử ký toàn thư là bộ sách lịch sử quý báu trong tủ sách sử cũ của nước Việt Nam , rất cần thiết cho những người nghiên cứu lịch sử dân tộc ."
  },
  {
    ma: "XH10",
    ten: "Việt Nam Văn Hóa Sử Cương",
    loai: "khxh",
    gia: 110000,
    tacGia: "Đào Duy Anh",
    hinh: "../image/XH10.jpg",
    moTa: "Việt Nam văn hoá sử cương hẳn là tác phẩm quan trọng bậc nhất trong sự nghiệp trước tác của học giả Đào Duy Anh, trong đó ông đã phác hoạ, mô tả, và minh định được chân dung văn hoá của người Việt, như một dân tộc, một cộng đồng trong chiều dài lịch sử Tác phẩm cũng đồng thời chỉ ra sự thay đổi của văn hoá Việt trong thời đại u hoá, với việc thừa hưởng di sản văn hoá cổ truyền cũng như sự tiếp thu các giá trị mới. Với sự rộng rãi trong dữ liệu khảo cứu, sự sâu sắc trong tìm tòi, Việt Nam văn hoá sử cương dẫu ra đời từ 1938, cho đến nay, vẫn tiếp tục là một tác phẩm quan trọng có giá trị tham khảo cao, làm nền tảng cho ngành văn hoá học Việt Nam hiện đại. Như một cuốn sách cái, Việt Nam văn hoá sử cương trong lĩnh vực văn hoá học, sánh ngang với Việt Nam phong tục trong mảng phong tục học, hay Việt Nam sử lược trong mảng thông sử hiện đại."
  },
  {
    ma: "TN01",
    ten: "Lược Sử Thời Gian",
    loai: "khtn",
    gia: 98000,
    tacGia: "Stephen Hawking",
    hinh: "../image/TN01.jpg",
    moTa: ""
  },
  {
    ma: "TN02",
    ten: "Vũ Trụ Trong Vỏ Hạt Dẻ",
    loai: "khtn",
    gia: 98000,
    tacGia: "Stephen Hawking",
    hinh: "../image/TN02.jpg",
    moTa: ""
  },
  {
    ma: "TN03",
    ten: "Nguồn Gốc Các Loài",
    loai: "khtn",
    gia: 156000,
    tacGia: "Charles Darwin",
    hinh: "../image/TN03.jpg",
    moTa: ""
  },
  {
    ma: "TN04",
    ten: "6 Vật Liệu Định Hình Văn Minh Nhân Loại",
    loai: "khtn",
    gia: 218000,
    tacGia: "Ed Conwayn",
    hinh: "../image/TN04.jpg",
    moTa: "6 vật liệu định hình văn minh nhân loại - Lịch sử, hiện tại và tương lai nhân loại qua lăng kính cát, muối, sắt, đồng, dầu và lithium. Trong lịch sử loài người, người ta thường kể về các vị vua, những nhà tư tưởng, các cuộc cách mạng hay hệ thống thể chế chính trị. Nhưng Ed Conway - nhà báo kinh tế kỳ cựu của Sky News - lại chọn một cách nhìn hoàn toàn khác trong cuốn sách 6 vật liệu định hình văn minh nhân loại: Lịch sử của cát, muối, sắt, đồng, dầu mỏ và lithium. Thay vì đặt con người ở trung tâm, ông kể lại lịch sử từ góc nhìn của sáu vật liệu tưởng chừng bình thường nhưng thực ra là nền móng của toàn bộ văn minh nhân loại."
  },
  {
    ma: "TT01",
    ten: "Doraemon - Tập 1",
    loai: "thieunhi",
    gia: 23000,
    tacGia: "Fujiko F. Fujio",
    hinh: "../image/TT01.jpg",
    moTa: ""
  },
  {
    ma: "TT02",
    ten: "Truyện Cổ Grimm",
    loai: "thieunhi",
    gia: 90000,
    tacGia: "Anh em nhà Grimm",
    hinh: "../image/TT02.jpg",
    moTa: ""
  },
  {
    ma: "TT03",
    ten: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    loai: "thieunhi",
    gia: 82000,
    tacGia: "Nguyễn Nhật Ánh",
    hinh: "../image/TT03.jpg",
    moTa: ""
  },
  {
    ma: "TT04",
    ten: "Dế Mèn Phiêu Lưu Ký",
    loai: "thieunhi",
    gia: 50000,
    tacGia: "Tô Hoài",
    hinh: "../image/TT04.jpg",
    moTa: ""
  },
  {
    ma: "TT05",
    ten: "Truyện Kể Anh Hùng Lịch Sử Việt Nam",
    loai: "thieunhi",
    gia: 77000,
    tacGia: "Tô Hoài",
    hinh: "../image/TT05.jpg",
    moTa: "Truyện kể Anh Hùng Lịch Sử Việt Nam là món quà tuyệt vời ba mẹ dành tặng con, giúp hành trình khám phá lịch sử dân tộc trở nên đầy cảm xúc và gần gũi. Thay vì những con số khô khan, cuốn sách là cầu nối đưa con bước vào thế giới của các nhân vật huyền thoại – từ thời Vua Hùng dựng nước đến các triều đại sau này – những nhân vật đã khắc tên mình vào dáng hình Tổ quốc. Đây không chỉ là truyện kể, mà còn là hành trình bồi đắp lòng tự hào dân tộc, hình thành nhân cách và trách nhiệm cho con ngay từ những năm tháng đầu đời."
  },
  {
    ma: "TT06",
    ten: "Truyện cổ tích Việt Nam - Tập 1 (2025)",
    loai: "thieunhi",
    gia: 72000,
    tacGia: "Nhiều Tác Giả",
    hinh: "../image/TT06.jpg",
    moTa: "Quen thuộc, mộc mạc, gần gũi, đầy phép nhiệm màu và hấp dẫn tuổi thơ là những chuyện kể ngày xửa ngày xưa. Bước vào thế giới cổ tích lung linh kì ảo ấy, bạn sẽ được gặp những ông Bụt, bà tiên, vị thần, công chúa, hoàng tử, cô Tấm, chàng Trương Chi, nàng Tô Thị, Thạch Sanh, Sọ Dừa, chú Cuội… Bạn cũng biết sự tích tên gọi dòng sông, ngọn núi, loài cây, loại quả… và nhiều điều thú vị khác nữa. Những câu chuyện về tình yêu thương từ bao đời nay sẽ vẫn được kể lại. Chúng ta cùng niệm chú “Sách ơi, mở ra!” và đọc Truyện cổ tích Việt Nam bạn nhé !"
  },
  {
    ma: "TT07",
    ten: "10 Vạn Câu Hỏi Vì Sao? - Encyclopedia for Children - Khám Phá Những Sự Kiện Thú Vị Trong Lịch Sử",
    loai: "thieunhi",
    gia: 98000,
    tacGia: "Dương Thanh Vân - Thanh Tâm",
    hinh: "../image/TT07.jpg",
    moTa: "Bộ sách Mười vạn câu hỏi vì sao? có nội dung hấp dẫn, phong phú, được sắp xếp hệ thống theo từng chủ đề nhằm giải đáp câu hỏi một cách dễ hiểu, ngắn gọn, kết hợp hình minh họa sinh động, hấp dẫn. Sách phù hợp với mọi lứa tuổi, cung cấp kiến thức tổng hợp cả về kiến thức trong trường học lẫn trong cuộc sống."
  },
  {
    ma: "TT08",
    ten: "Hành Trang Tỏa Sáng - Học Cách Tự Lập)",
    loai: "thieunhi",
    gia: 64000,
    tacGia: "Khánh Phương",
    hinh: "../image/TT08.jpg",
    moTa: "Hành trang tỏa sáng là bộ sách gồm 5 cuốn mang đến những kiến thức và kỹ năng thiết thực, gần gũi với học sinh. Với nội dung sinh động, dễ hiểu, bộ sách giúp các em tự tin khám phá bản thân, rèn luyện kỹ năng và phát triển tư duy, tạo hành trang vững vàng cho tương lai."
  },
  {
    ma: "GK01",
    ten: "Toán 12 - Tập 1",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK01.jpg",
    moTa: "Sách giáo khoa Toán lớp 12 - tập 1"
  },
  {
    ma: "GK02",
    ten: "Ngữ văn 12 - Tập 1",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK02.jpg",
    moTa: "Sách giáo khoa Ngữ Văn lớp 12 - tập 1"
  },
  {
    ma: "GK03",
    ten: "Toán 12 - Tập 2",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK03.jpg",
    moTa: "Sách giáo khoa Toán lớp 12 - tập 2"
  },
  {
    ma: "GK04",
    ten: "Ngữ Văn 12 - Tập 2",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK04.jpg",
    moTa: "Sách giáo khoa Ngữ Văn lớp 12 - tập 2"
  },
  {
    ma: "GK05",
    ten: "Tiếng Anh 12",
    loai: "giaokhoa",
    gia: 38000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK05.jpg",
    moTa: "Sách giáo khoa Tiếng Anh lớp 12"
  },
  {
    ma: "GK06",
    ten: "Vật Lí 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK06.jpg",
    moTa: "Sách giáo khoa Vật Lí lớp 12"
  },
  {
    ma: "GK07",
    ten: "Hoá Học 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK07.jpg",
    moTa: "Sách giáo khoa Hoá Học lớp 12"
  },
  {
    ma: "GK08",
    ten: "Sinh Học 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK08.jpg",
    moTa: "Sách giáo khoa Sinh Học lớp 12"
  },
  {
    ma: "GK09",
    ten: "Lịch Sử 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK09.jpg",
    moTa: "Sách giáo khoa Lịch Sử lớp 12"
  },
  {
    ma: "GK10",
    ten: "Địa Lí 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK10.jpg",
    moTa: "Sách giáo khoa Địa Lí lớp 12"
  },
  {
    ma: "GK11",
    ten: "Giáo Dục Kinh Tế Và Pháp Luật 12",
    loai: "giaokhoa",
    gia: 20000,
    tacGia: "Bộ Giáo dục và Đào tạo",
    hinh: "../image/GK11.jpg",
    moTa: "Sách giáo khoa Giáo Dục Kinh Tế Và Pháp Luật lớp 12"
  },
];

// ===== 5 PHIẾU NHẬP MẪU (tạm) - bạn tự sửa 5 phiếu này =====
// ma: mã phiếu | ngay: ngày nhập (yyyy-mm-dd) | hoanThanh: true (đã hoàn thành) hoặc false
// dong: các sản phẩm của phiếu, mỗi sản phẩm gồm ma (mã sách), gia (giá nhập), sl (số lượng)
const DS_PHIEU_NHAP_MAU = [
  { ma: "PN001", ngay: "2026-11-01", hoanThanh: true, dong: [{ ma: "NV01", gia: 100000, sl: 50 }] },
  { ma: "PN002", ngay: "2026-11-02", hoanThanh: true, dong: [{ ma: "NV02", gia: 120000, sl: 30 }, { ma: "VH01", gia: 30000, sl: 40 }] },
  { ma: "PN003", ngay: "2026-11-03", hoanThanh: true, dong: [{ ma: "DS01", gia: 60000, sl: 60 }] },
  { ma: "PN004", ngay: "2026-11-04", hoanThanh: false, dong: [{ ma: "XH02", gia: 90000, sl: 25 }] },
  { ma: "PN005", ngay: "2026-11-05", hoanThanh: false, dong: [{ ma: "TN01", gia: 60000, sl: 35 }, { ma: "GK01", gia: 12000, sl: 100 }] }
];

// LocalStorage chưa có data thì seed
if (localStorage.getItem("dsSach") === null) {
  localStorage.setItem("dsSach", JSON.stringify(DU_LIEU_MAU));
}

// Chưa có phiếu nhập thì lấy 5 phiếu mẫu ở trên
if (localStorage.getItem("dsPhieuNhap") === null) {
  localStorage.setItem("dsPhieuNhap", JSON.stringify(DS_PHIEU_NHAP_MAU));
}
