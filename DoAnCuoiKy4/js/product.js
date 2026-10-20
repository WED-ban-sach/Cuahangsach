// ===== PRODUCT.JS =====
// Hiển thị danh sách sách, phân trang (15 sách / trang) và lọc theo thể loại.
// Dữ liệu sách nằm trong data.js (biến THE_LOAI và DU_LIEU_MAU).
//
// Ghi chú cho nhóm:
//  - Nút Mua của mỗi sách có class "btn-mua" và thuộc tính data-ma (mã sách):
//    nhóm giỏ hàng gắn sự kiện click vào các nút này.
//  - hienThi(danhSach, trang): hiển thị một danh sách sách bất kỳ có phân trang
//    (dùng cho kết quả tìm kiếm).
//  - layDanhSach(): lấy tất cả sách. themSanPham(sach): thêm sách mới (dùng cho trang admin).

const SO_SACH_MOI_TRANG = 15; // số sách trên 1 trang
let trangHienTai = 1; // trang đang xem
let danhSachDangXem = []; // danh sách đang hiển thị (tất cả sách hoặc sách của 1 thể loại)

// ---------- 1. DỮ LIỆU ----------

// Sách do admin thêm được lưu trong localStorage với tên "sachThemMoi"
function laySachThemMoi() {
  const chuoi = localStorage.getItem("sachThemMoi");
  if (chuoi === null) {
    return [];
  }
  return JSON.parse(chuoi);
}

// Tất cả sách = sách trong data.js + sách thêm mới
function layDanhSach() {
  return DU_LIEU_MAU.concat(laySachThemMoi());
}

// Thêm một sách mới. Trả về false nếu mã sách đã tồn tại
function themSanPham(sachMoi) {
  const tatCaSach = layDanhSach();
  for (let i = 0; i < tatCaSach.length; i++) {
    if (tatCaSach[i].ma === sachMoi.ma) {
      alert("Mã sản phẩm đã tồn tại!");
      return false;
    }
  }
  const sachThemMoi = laySachThemMoi();
  sachThemMoi.push(sachMoi);
  localStorage.setItem("sachThemMoi", JSON.stringify(sachThemMoi));
  return true;
}

// ---------- 2. HÀM HỖ TRỢ ----------

// 160000 -> "160.000 đ"
function dinhDangGia(gia) {
  return gia.toLocaleString("vi-VN") + " đ";
}

// Đổi id thể loại (vd "khxh") thành tên thể loại để hiển thị
function layTenTheLoai(idTheLoai) {
  for (let i = 0; i < THE_LOAI.length; i++) {
    if (THE_LOAI[i].id === idTheLoai) {
      return THE_LOAI[i].ten;
    }
  }
  return "";
}

// ---------- 3. TẠO THẺ SÁCH ----------

function taoTheSach(sach) {
  const the = document.createElement("div");
  the.className = "the-sach";

  const anh = document.createElement("img");
  anh.className = "anh-sach";
  anh.src = sach.hinh;
  anh.alt = sach.ten;
  // Nếu không tìm thấy file ảnh thì dùng ảnh mặc định
  anh.onerror = function () {
    anh.onerror = null;
    anh.src = "images/khong-co-anh.svg";
  };

  const ten = document.createElement("h3");
  ten.className = "ten-sach";
  ten.textContent = sach.ten;

  const loai = document.createElement("p");
  loai.className = "loai-sach";
  loai.textContent = layTenTheLoai(sach.loai);

  const gia = document.createElement("p");
  gia.className = "gia-sach";
  gia.textContent = dinhDangGia(sach.gia);

  const nutMua = document.createElement("button");
  nutMua.className = "btn-mua";
  nutMua.textContent = "Mua";
  nutMua.dataset.ma = sach.ma; // lưu mã sách trên nút để biết đang mua cuốn nào

  the.appendChild(anh);
  the.appendChild(ten);
  the.appendChild(loai);
  the.appendChild(gia);
  the.appendChild(nutMua);
  return the;
}

// ---------- 4. HIỂN THỊ SÁCH VÀ PHÂN TRANG ----------

// Hiển thị 1 trang của danh sách
function hienThi(danhSach, trang) {
  danhSachDangXem = danhSach;

  // Tính tổng số trang và giữ số trang trong khoảng hợp lệ
  let tongTrang = Math.ceil(danhSach.length / SO_SACH_MOI_TRANG);
  if (tongTrang < 1) {
    tongTrang = 1;
  }
  if (trang < 1) {
    trang = 1;
  }
  if (trang > tongTrang) {
    trang = tongTrang;
  }
  trangHienTai = trang;

  const khung = document.getElementById("dsSanPham");
  khung.innerHTML = ""; // xoá các sách cũ

  if (danhSach.length === 0) {
    const thongBao = document.createElement("p");
    thongBao.className = "khong-co-sach";
    thongBao.textContent = "Chưa có sách nào.";
    khung.appendChild(thongBao);
  }

  // Chỉ lấy các sách của trang hiện tại
  const batDau = (trang - 1) * SO_SACH_MOI_TRANG;
  let ketThuc = batDau + SO_SACH_MOI_TRANG;
  if (ketThuc > danhSach.length) {
    ketThuc = danhSach.length;
  }
  for (let i = batDau; i < ketThuc; i++) {
    khung.appendChild(taoTheSach(danhSach[i]));
  }

  hienThiNutPhanTrang(tongTrang);
}

// Tạo 1 nút phân trang. Bấm vào thì chuyển sang trang số "trang"
function taoNutTrang(chu, trang, biKhoa) {
  const nut = document.createElement("button");
  nut.className = "nut-trang";
  nut.textContent = chu;
  nut.disabled = biKhoa;
  nut.addEventListener("click", function () {
    hienThi(danhSachDangXem, trang);
    document.getElementById("tieuDe").scrollIntoView(); // cuộn lên đầu danh sách
  });
  return nut;
}

// Hiển thị hàng nút: mũi tên trước, các số trang, mũi tên sau
function hienThiNutPhanTrang(tongTrang) {
  const khung = document.getElementById("phanTrang");
  khung.innerHTML = "";

  if (tongTrang <= 1) {
    return; // chỉ có 1 trang thì không cần nút
  }

  khung.appendChild(taoNutTrang("◀", trangHienTai - 1, trangHienTai === 1));
  for (let i = 1; i <= tongTrang; i++) {
    const nutSo = taoNutTrang(i, i, false);
    if (i === trangHienTai) {
      nutSo.classList.add("chon"); // đánh dấu trang đang xem
    }
    khung.appendChild(nutSo);
  }
  khung.appendChild(
    taoNutTrang("▶", trangHienTai + 1, trangHienTai === tongTrang),
  );
}

// ---------- 5. THỂ LOẠI TRÊN THANH MENU ----------

// Hiển thị sách của 1 thể loại (idTheLoai = "all" thì hiển thị tất cả)
function locTheoTheLoai(idTheLoai) {
  const tatCaSach = layDanhSach();
  let ketQua = [];

  if (idTheLoai === "all") {
    ketQua = tatCaSach;
    document.getElementById("tieuDe").textContent = "Tất cả sách";
  } else {
    for (let i = 0; i < tatCaSach.length; i++) {
      if (tatCaSach[i].loai === idTheLoai) {
        ketQua.push(tatCaSach[i]);
      }
    }
    document.getElementById("tieuDe").textContent = layTenTheLoai(idTheLoai);
  }

  hienThi(ketQua, 1);
}

// Tạo 1 mục thể loại trong menu. Bấm vào thì lọc sách theo thể loại đó
function taoMucTheLoai(ten, idTheLoai) {
  const muc = document.createElement("li");
  muc.textContent = ten;
  muc.addEventListener("click", function () {
    locTheoTheLoai(idTheLoai);
  });
  return muc;
}

// Đưa các thể loại trong data.js vào danh sách thả xuống "Thể loại" của menu
function hienThiMenuTheLoai() {
  const danhSachMenu = document.getElementById("theloai");
  danhSachMenu.appendChild(taoMucTheLoai("Tất cả sách", "all"));
  for (let i = 0; i < THE_LOAI.length; i++) {
    danhSachMenu.appendChild(taoMucTheLoai(THE_LOAI[i].ten, THE_LOAI[i].id));
  }
}

// ---------- 6. CHẠY KHI MỞ TRANG ----------
hienThiMenuTheLoai();
locTheoTheLoai("all");
