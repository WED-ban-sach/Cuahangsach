// ===== CHITIET.JS =====
// Dùng cho trang chủ, trang sản phẩm và trang chi tiết:
//  1. Bấm vào card sách thì mở trang chi tiết (chitiet.html?ma=<mã sách>)
//  2. Trang chi tiết sách (chỉ chạy khi trang có #chiTiet, tức là chitiet.html)
// Cần nạp SAU data.js (dùng biến DU_LIEU_MAU và THE_LOAI).

var CHON_CARD = ".the-sach, #noibat > div"; // các card sách (trang sản phẩm, trang chủ, sách cùng thể loại)
var CHON_TEN = ".ten-sach, p"; // phần tử chứa tên sách bên trong card

// ---------- HÀM DÙNG CHUNG ----------

// Danh sách id các loại đang hiển thị (loại bị ẩn thì sách của loại đó cũng không bán)
function ctLayIdLoaiHienThi() {
  var dsLoai = THE_LOAI;
  var chuoi = localStorage.getItem("danhSachLoai");
  if (chuoi !== null) {
    dsLoai = JSON.parse(chuoi);
  }
  var ketQua = [];
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].trangThai !== "locked") {
      ketQua.push(dsLoai[i].id);
    }
  }
  return ketQua;
}

// Danh sách sách đang bán: lấy từ admin (khoá "dsSach"), bỏ các sách đã ẩn
function ctLayDanhSach() {
  var tatCaSach = DU_LIEU_MAU;
  var chuoi = localStorage.getItem("dsSach");
  if (chuoi !== null) {
    tatCaSach = JSON.parse(chuoi);
  }
  var idLoaiHienThi = ctLayIdLoaiHienThi();
  var sachDangBan = [];
  for (var i = 0; i < tatCaSach.length; i++) {
    if (!tatCaSach[i].an && idLoaiHienThi.indexOf(tatCaSach[i].loai) !== -1) {
      sachDangBan.push(tatCaSach[i]);
    }
  }
  return sachDangBan;
}

// Tìm sách theo mã, không thấy trả về null
function ctTimSachTheoMa(ma) {
  var ds = ctLayDanhSach();
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].ma === ma) {
      return ds[i];
    }
  }
  return null;
}

// Tìm sách theo tên (không phân biệt hoa thường), không thấy trả về null
function ctTimSachTheoTen(ten) {
  var ds = ctLayDanhSach();
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].ten.toLowerCase() === ten.toLowerCase()) {
      return ds[i];
    }
  }
  return null;
}

// Đổi id thể loại thành tên thể loại (ưu tiên danh sách loại do admin quản lý)
function ctTenTheLoai(idLoai) {
  var dsLoai = THE_LOAI;
  var chuoi = localStorage.getItem("danhSachLoai");
  if (chuoi !== null) {
    dsLoai = JSON.parse(chuoi);
  }
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === idLoai) {
      return dsLoai[i].ten;
    }
  }
  return "";
}

// 160000 -> "160.000 đ"
function ctDinhDangGia(gia) {
  if (gia === undefined || gia === null || gia === "") {
    return "Chưa cập nhật giá";
  }
  return Number(gia).toLocaleString("vi-VN") + " đ";
}

// Lấy tên sách trong 1 card
function ctLayTenCard(card) {
  var oTen = card.querySelector(CHON_TEN);
  if (oTen === null) {
    return "";
  }
  return oTen.textContent.trim();
}

// Trang chi tiết không nạp product.js, nên khai báo sẵn 2 hàm mà giỏ hàng (cart-visibility.js) cần
if (typeof layDanhSach !== "function") {
  window.layDanhSach = ctLayDanhSach;
}
if (typeof dinhDangGia !== "function") {
  window.dinhDangGia = ctDinhDangGia;
}

// ---------- 1. BẤM VÀO CARD ĐỂ MỞ TRANG CHI TIẾT ----------
document.addEventListener("click", function (e) {
  if (e.target.closest("button") !== null) {
    return; // bấm nút Mua thì để giỏ hàng xử lý
  }
  var card = e.target.closest(CHON_CARD);
  if (card === null) {
    return;
  }
  var sach = ctTimSachTheoTen(ctLayTenCard(card));
  if (sach !== null) {
    window.location.href = "chitiet.html?ma=" + encodeURIComponent(sach.ma);
  }
});

// ---------- 2. TRANG CHI TIẾT SÁCH (chitiet.html) ----------

// Tạo 1 dòng "Nhãn | Giá trị" cho bảng thông tin
function ctTaoDong(nhan, giaTri) {
  var hang = document.createElement("tr");
  var oNhan = document.createElement("th");
  oNhan.textContent = nhan;
  var oGiaTri = document.createElement("td");
  oGiaTri.textContent = giaTri;
  hang.appendChild(oNhan);
  hang.appendChild(oGiaTri);
  return hang;
}

// Hiển thị thông tin đầy đủ của 1 cuốn sách
function ctHienThiChiTiet(sach) {
  var khung = document.getElementById("chiTiet");
  khung.innerHTML = "";
  document.title = sach.ten + " - VNBook";

  // Cột trái: ảnh bìa và nút thêm vào giỏ
  var cotAnh = document.createElement("div");
  var anh = document.createElement("img");
  anh.className = "anh-chi-tiet";
  anh.src = sach.hinh || "../image/khong-co-anh.svg";
  anh.alt = sach.ten;
  anh.onerror = function () {
    anh.onerror = null;
    anh.src = "../image/khong-co-anh.svg";
  };
  var nutMua = document.createElement("button");
  nutMua.className = "btn-mua"; // giỏ hàng (cart-visibility.js) tự bắt sự kiện click của nút này
  nutMua.textContent = "Thêm vào giỏ";
  nutMua.dataset.ma = sach.ma;
  cotAnh.appendChild(anh);
  cotAnh.appendChild(nutMua);

  // Cột phải: tên, giá, bảng thông tin, mô tả
  var cotTin = document.createElement("div");
  var ten = document.createElement("h1");
  ten.className = "ten-chi-tiet";
  ten.textContent = sach.ten;
  var gia = document.createElement("p");
  gia.className = "gia-chi-tiet";
  gia.textContent = ctDinhDangGia(sach.gia);
  var bang = document.createElement("table");
  bang.className = "bang-tin";
  bang.appendChild(ctTaoDong("Mã sách", sach.ma));
  bang.appendChild(ctTaoDong("Thể loại", ctTenTheLoai(sach.loai)));
  if (sach.tacGia) {
    bang.appendChild(ctTaoDong("Tác giả", sach.tacGia.trim()));
  }
  var moTa = document.createElement("p");
  moTa.className = "mo-ta";
  moTa.textContent = "Đang cập nhật.";
  if (sach.moTa) {
    moTa.textContent = sach.moTa;
  }
  cotTin.appendChild(ten);
  cotTin.appendChild(gia);
  cotTin.appendChild(bang);
  cotTin.appendChild(moTa);

  khung.appendChild(cotAnh);
  khung.appendChild(cotTin);
}

// Tạo 1 card sách (giống card ở trang sản phẩm) cho mục "Sách cùng thể loại"
function ctTaoTheSach(sach) {
  var the = document.createElement("div");
  the.className = "the-sach";

  var anh = document.createElement("img");
  anh.className = "anh-sach";
  anh.src = sach.hinh || "../image/khong-co-anh.svg";
  anh.alt = sach.ten;
  anh.onerror = function () {
    anh.onerror = null;
    anh.src = "../image/khong-co-anh.svg";
  };
  var ten = document.createElement("h3");
  ten.className = "ten-sach";
  ten.textContent = sach.ten;
  var loai = document.createElement("p");
  loai.className = "loai-sach";
  loai.textContent = ctTenTheLoai(sach.loai);
  var gia = document.createElement("p");
  gia.className = "gia-sach";
  gia.textContent = ctDinhDangGia(sach.gia);
  var nutMua = document.createElement("button");
  nutMua.className = "btn-mua";
  nutMua.textContent = "Mua";
  nutMua.dataset.ma = sach.ma;

  the.appendChild(anh);
  the.appendChild(ten);
  the.appendChild(loai);
  the.appendChild(gia);
  the.appendChild(nutMua);
  return the;
}

// Hiển thị tối đa 5 sách cùng thể loại (không tính cuốn đang xem)
function ctHienThiSachCungLoai(sach) {
  var khung = document.getElementById("sachLienQuan");
  var ds = ctLayDanhSach();
  var soSach = 0;
  for (var i = 0; i < ds.length && soSach < 5; i++) {
    if (ds[i].loai === sach.loai && ds[i].ma !== sach.ma) {
      khung.appendChild(ctTaoTheSach(ds[i]));
      soSach = soSach + 1;
    }
  }
  if (soSach > 0) {
    document.getElementById("khungLienQuan").hidden = false;
  }
}

// Chạy khi mở chitiet.html: đọc mã sách trên đường dẫn (?ma=...) rồi hiển thị
if (document.getElementById("chiTiet") !== null) {
  var maSach = new URLSearchParams(window.location.search).get("ma");
  var sachDangXem = ctTimSachTheoMa(maSach);
  if (sachDangXem === null) {
    document.getElementById("chiTiet").textContent = "Không tìm thấy sách này.";
  } else {
    ctHienThiChiTiet(sachDangXem);
    ctHienThiSachCungLoai(sachDangXem);
  }
}
