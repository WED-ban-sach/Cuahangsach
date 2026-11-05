// ===== PRODUCT.JS =====
// Hiển thị danh sách sách, phân trang (15 sách / trang) và lọc theo thể loại.
// Dữ liệu sách nằm trong data.js (biến THE_LOAI và DU_LIEU_MAU).
//
// Ghi chú cho nhóm:
//  - Nút Mua của mỗi sách có class "btn-mua" và thuộc tính data-ma (mã sách):
//    nhóm giỏ hàng gắn sự kiện click vào các nút này.
//  - hienThi(danhSach, trang): hiển thị một danh sách sách bất kỳ có phân trang
//    (dùng cho kết quả tìm kiếm).
//  - layDanhSach(): lấy tất cả sách đang bán.

const SO_SACH_MOI_TRANG = 15; // số sách trên 1 trang
let trangHienTai = 1; // trang đang xem
let danhSachDangXem = []; // danh sách đang hiển thị (tất cả sách hoặc sách của 1 thể loại)

// ---------- 1. DỮ LIỆU ----------

// Sách đang bán: lấy từ khoá "dsSach", bỏ sách ẩn và sách thuộc loại đã ẩn
function layDanhSach() {
  // Nếu admin đã quản lý sách (khoá "dsSach") thì dùng danh sách đó, chưa có thì dùng data.js
  let tatCaSach = DU_LIEU_MAU;
  const chuoi = localStorage.getItem("dsSach");
  if (chuoi !== null) {
    tatCaSach = JSON.parse(chuoi);
  }
  // Bỏ các sách admin đã ẩn và các sách thuộc loại đã bị ẩn
  const dsLoaiHienThi = layDanhSachLoai();
  const sachDangBan = [];
  for (let i = 0; i < tatCaSach.length; i++) {
    if (!tatCaSach[i].an && coLoaiHienThi(dsLoaiHienThi, tatCaSach[i].loai)) {
      sachDangBan.push(tatCaSach[i]);
    }
  }
  return sachDangBan;
}
// Kiểm tra loại có nằm trong danh sách loại đang hiển thị không
function coLoaiHienThi(dsLoai, idLoai) {
  for (let i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === idLoai) {
      return true;
    }
  }
  return false;
}
// Lấy thể loại sách, bỏ qua sách ẩn
function layDanhSachLoai() {
  const chuoi = localStorage.getItem("danhSachLoai");
  if (chuoi === null) {
    return THE_LOAI;
  }
  const dsLoai = JSON.parse(chuoi);
  const ketQua = [];
  for (let i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].trangThai !== "locked") ketQua.push(dsLoai[i]);
  }
  return ketQua;
}
// Lọc sách theo nhiều tiêu chí cùng lúc
function timSach(tuKhoa, idTheLoai, giaTu, giaDen) {
  const tatCaSach = layDanhSach();
  const tuKhoaChuan = chuanHoa(tuKhoa);
  const ketQua = [];
  for (let i = 0; i < tatCaSach.length; i++) {
    const sach = tatCaSach[i];
    const gia = Number(sach.gia) || 0;
    if (tuKhoaChuan !== "" && chuanHoa(sach.ten).indexOf(tuKhoaChuan) === -1)
      continue;
    if (idTheLoai !== "all" && sach.loai != idTheLoai) continue;
    if (giaTu !== "" && gia < Number(giaTu)) continue;
    if (giaDen !== "" && gia > Number(giaDen)) continue;
    ketQua.push(sach);
  }
  return ketQua;
}
// Tìm trên search
function timCoBan(tuKhoa) {
  const ketQua = timSach(tuKhoa, "all", "", "");
  document.getElementById("tieuDe").textContent =
    'Kết quả tìm "' + tuKhoa + '" (' + ketQua.length + " sách)";
  hienThi(ketQua, 1, "Không tìm thấy sách phù hợp.");
}
const formTimNangCao = document.getElementById("formTimNangCao");
formTimNangCao.addEventListener("submit", function (e) {
  e.preventDefault();
  const giaTu = document.getElementById("tnGiaTu").value;
  const giaDen = document.getElementById("tnGiaDen").value;
  const ten = document.getElementById("tnTen").value;
  const loai = document.getElementById("tnLoai").value;
  if (giaTu !== "" && giaDen !== "" && Number(giaTu) > Number(giaDen)) {
    document.getElementById("tnThongBao").textContent =
      "Giá từ không được lớn hơn giá đến.";
    return;
  }
  const ketQua = timSach(ten, loai, giaTu, giaDen);
  document.getElementById("tieuDe").textContent =
    "Kết quả tìm kiếm nâng cao (" + ketQua.length + " sách)";
  hienThi(ketQua, 1, "Không tìm thấy sách phù hợp.");
});
formTimNangCao.addEventListener("reset", function () {
  document.getElementById("tnThongBao").textContent = "";
  locTheoTheLoai("all"); // Xoá lọc thì hiện lại tất cả sách
});

// Đổ thể loại vào ô chọn của tìm nâng cao
function hienThiSelectTheLoai() {
  const oChon = document.getElementById("tnLoai");
  const dsLoai = layDanhSachLoai();
  oChon.appendChild(new Option("Tất cả thể loại", "all"));
  for (let i = 0; i < dsLoai.length; i++) {
    oChon.appendChild(new Option(dsLoai[i].ten, dsLoai[i].id));
  }
}
// ---------- 2. HÀM HỖ TRỢ ----------

// 160000 -> "160.000 đ"
function dinhDangGia(gia) {
  if (gia === null || gia === undefined || gia === "") {
    return "Chưa cập nhật giá";
  }

  const giaSo = Number(gia);
  if (!Number.isFinite(giaSo)) {
    return "Chưa cập nhật giá";
  }

  return giaSo.toLocaleString("vi-VN") + " đ";
}

// Đổi id thể loại (vd "khxh") thành tên thể loại để hiển thị
function layTenTheLoai(idTheLoai) {
  const dsLoai = layDanhSachLoai();
  for (let i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === idTheLoai) {
      return dsLoai[i].ten;
    }
  }
  return "";
}
// Chuẩn hoá chuỗi
function chuanHoa(chuoi) {
  return String(chuoi)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}
/*
normalize("NFD") tách chữ có dấu -> chữ gốc + dấu (â -> a ^)
replace(/[\u0300-\u036f]/g, "") xoá dấu vừa tách
replace(/đ/g, "d") xoá dấu chữ đ -> d
trim() xoá khoảng cách đôi ta
*/
// ---------- 3. TẠO THẺ SÁCH ----------

function taoTheSach(sach) {
  const the = document.createElement("div");
  the.className = "the-sach";

  const anh = document.createElement("img");
  anh.className = "anh-sach";
  anh.src = sach.hinh || "../image/khong-co-anh.svg";
  anh.alt = sach.ten;
  // Nếu không tìm thấy file ảnh thì dùng ảnh mặc định
  anh.onerror = function () {
    anh.onerror = null;
    anh.src = "../image/khong-co-anh.svg";
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
  nutMua.dataset.ma = sach.ma;
  // Hết hàng thì khóa nút Mua
  if (typeof laySoLuong === "function" && laySoLuong(sach.ma) <= 0) {
    nutMua.textContent = "Hết hàng";
    nutMua.disabled = true;
  }
  // lưu mã sách trên nút để biết đang mua cuốn nào

  the.appendChild(anh);
  the.appendChild(ten);
  the.appendChild(loai);
  the.appendChild(gia);
  the.appendChild(nutMua);
  return the;
}

// ---------- 4. HIỂN THỊ SÁCH VÀ PHÂN TRANG ----------

// Hiển thị 1 trang của danh sách
function hienThi(danhSach, trang, thongBaoRong) {
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
    thongBao.textContent = thongBaoRong || "Chưa có sách nào.";
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
  const dsLoai = layDanhSachLoai();
  danhSachMenu.appendChild(taoMucTheLoai("Tất cả sách", "all"));
  for (let i = 0; i < dsLoai.length; i++) {
    danhSachMenu.appendChild(taoMucTheLoai(dsLoai[i].ten, dsLoai[i].id));
  }
}

// ---------- 6. CHẠY KHI MỞ TRANG ----------
hienThiMenuTheLoai();
hienThiSelectTheLoai();
//lấy phần sau dấu ? trên URL, để đọc được giá trị q =
const thamSo = new URLSearchParams(window.location.search);
// Đến từ ô tìm kiếm ở trang khác -> hiện kết quả tìm
if (thamSo.has("q")) {
  document.getElementById("oTimKiem").value = thamSo.get("q");
  timCoBan(thamSo.get("q"));
} else {
  // Ở trang sản phẩm thì mở bình thường
  locTheoTheLoai("all");
}
