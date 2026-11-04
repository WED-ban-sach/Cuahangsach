// ===== MỤC 4, 5, 6: DANH MỤC SẢN PHẨM - NHẬP SẢN PHẨM - GIÁ BÁN =====
// Dữ liệu lưu bằng localStorage: "dsSach" (sách) và "dsPhieuNhap" (phiếu nhập).
// Cách làm giống bài tập DOM & Event: tạo dòng bằng createElement (Bài 7),
// các nút trong bảng dùng 1 sự kiện click trên tbody (Bài 4), kiểm tra form (Bài 5), tìm kiếm bằng sự kiện input (Bài 6).

// ---------- 1. DỮ LIỆU VÀ HÀM HỖ TRỢ ----------
// Hàm đọc/ghi dữ liệu và tính tồn nằm trong kho.js".
// Tìm vị trí của phần tử có mã "ma" trong mảng, không thấy trả về -1
function timViTri(ds, ma) {
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].ma === ma) {
      return i;
    }
  }
  return -1;
}
function layTenLoai(idLoai) {
  for (var i = 0; i < THE_LOAI.length; i++) {
    if (THE_LOAI[i].id === idLoai) {
      return THE_LOAI[i].ten;
    }
  }
  return "";
}
function dinhDangTien(so) {
  return Number(so).toLocaleString("vi-VN") + " đ";
}
// Giá vốn = giá nhập của phiếu đã hoàn thành gần nhất (phiếu nằm sau là phiếu mới hơn)
function layGiaVon(maSach) {
  var dsPhieu = layDsPhieu();
  var giaVon = 0;
  for (var i = 0; i < dsPhieu.length; i++) {
    if (dsPhieu[i].hoanThanh) {
      for (var j = 0; j < dsPhieu[i].dong.length; j++) {
        if (dsPhieu[i].dong[j].ma === maSach) {
          giaVon = dsPhieu[i].dong[j].gia;
        }
      }
    }
  }
  return giaVon;
}

// Giá bán = giá vốn + % lợi nhuận (chỉ tính khi sách đã có giá vốn và % lợi nhuận)
function tinhGiaBan(sach) {
  var giaVon = layGiaVon(sach.ma);
  if (giaVon > 0 && sach.loiNhuan !== undefined) {
    sach.gia = Math.round(giaVon * (1 + sach.loiNhuan / 100));
  }
}

// Các hàm tạo ô của bảng
function taoO(noiDung) {
  var o = document.createElement("td");
  o.textContent = noiDung;
  return o;
}
function taoOTrangThai(chu, tenClass) {
  var o = document.createElement("td");
  var nhan = document.createElement("span");
  nhan.className = tenClass;
  nhan.textContent = chu;
  o.appendChild(nhan);
  return o;
}
function taoNut(chu, tenClass) {
  var nut = document.createElement("button");
  nut.textContent = chu;
  nut.className = tenClass;
  return nut;
}
function taoOThaoTac(cacNut) {
  var o = document.createElement("td");
  var khung = document.createElement("div");
  khung.className = "THAOTAC";
  for (var i = 0; i < cacNut.length; i++) {
    khung.appendChild(cacNut[i]);
  }
  o.appendChild(khung);
  return o;
}
// ---------- PHÂN TRANG (dùng chung cho bảng loại, sách, phiếu nhập) ----------
var SO_DONG_MOI_TRANG = 4; // mỗi trang tối đa 4 dòng

// Tổng số trang (ít nhất 1 trang)
function tinhTongTrang(soDong) {
  var tongTrang = Math.ceil(soDong / SO_DONG_MOI_TRANG);
  if (tongTrang < 1) {
    tongTrang = 1;
  }
  return tongTrang;
}

// Cắt danh sách, chỉ lấy các dòng của 1 trang
function layDongCuaTrang(ds, trang) {
  var batDau = (trang - 1) * SO_DONG_MOI_TRANG;
  return ds.slice(batDau, batDau + SO_DONG_MOI_TRANG);
}

// Vẽ khung phân trang của 1 mục: dòng chữ "Hiển thị x–y trong n ...", nút ‹, các số trang, nút ›
// idMuc: id của mục (vd "QLY_DANHMUCSP"), tenDoiTuong: "sách", "loại"...
// veLai(trang): hàm vẽ lại bảng khi bấm sang trang khác
function veKhungPhanTrang(idMuc, tongDong, trang, tenDoiTuong, veLai) {
  var tongTrang = tinhTongTrang(tongDong);
  var thongTin = document.querySelector("#" + idMuc + " #THONGTIN_TRANG");
  var nutTruoc = document.querySelector("#" + idMuc + " #TRANG_TRUOC");
  var nutSau = document.querySelector("#" + idMuc + " #TRANG_SAU");
  var dsSoTrang = document.querySelector("#" + idMuc + " #DANHSACH_TRANG");

  if (tongDong === 0) {
    thongTin.textContent = "Không có " + tenDoiTuong + " nào";
  } else {
    var tu = (trang - 1) * SO_DONG_MOI_TRANG + 1;
    var den = Math.min(trang * SO_DONG_MOI_TRANG, tongDong);
    thongTin.textContent = "Hiển thị " + tu + "–" + den + " trong " + tongDong + " " + tenDoiTuong;
  }

  // nút ‹ và › (gán onclick để mỗi lần vẽ lại không bị gắn trùng sự kiện)
  nutTruoc.disabled = trang <= 1;
  nutSau.disabled = trang >= tongTrang;
  nutTruoc.onclick = function () {
    veLai(trang - 1);
  };
  nutSau.onclick = function () {
    veLai(trang + 1);
  };

  // các nút số trang
  dsSoTrang.innerHTML = "";
  for (var i = 1; i <= tongTrang; i++) {
    var nutSo = document.createElement("button");
    nutSo.textContent = i;
    nutSo.className = "SO_TRANG";
    if (i === trang) {
      nutSo.classList.add("DANG_CHON"); // đánh dấu trang đang xem
    }
    nutSo.dataset.trang = i;
    nutSo.addEventListener("click", function (e) {
      veLai(Number(e.target.dataset.trang));
    });
    dsSoTrang.appendChild(nutSo);
  }
}

// Đưa các thể loại trong data.js vào ô chọn (giữ lại mục đầu "tất cả" nếu giuMucDau = true)
function napTheLoai(oChon, giuMucDau) {
  if (giuMucDau) {
    while (oChon.options.length > 1) {
      oChon.remove(1);
    }
  } else {
    oChon.innerHTML = "";
  }
  for (var i = 0; i < THE_LOAI.length; i++) {
    var muc = document.createElement("option");
    muc.value = THE_LOAI[i].id;
    muc.textContent = THE_LOAI[i].ten;
    oChon.appendChild(muc);
  }
}

// ---------- 2. MỤC 4: DANH MỤC SẢN PHẨM ----------
var bangSach = document.getElementById("DANHMUC_TBODY");
var oTimSach = document.querySelector("#QLY_DANHMUCSP #QLY_LOAISP_INPUT_TIMKIEM");
var locLoaiSach = document.getElementById("QLY_DANHMUCSP_LOAI");
var locTrangThaiSach = document.querySelector("#QLY_DANHMUCSP #QLY_LOAISP_TRANGTHAI");
var formSach = document.getElementById("QLY_DANHMUC_THEM");
var oLoaiSach = document.getElementById("MA_LOAI");
var oMaSach = document.getElementById("MA_SACH_MOI");
var oTenSach = document.getElementById("TEN_SACH_MOI");
var oHinhSach = document.getElementById("HINH_SACH_MOI");
var oMoTaSach = document.getElementById("MOTA_SACH_MOI");
var dangSuaSach = ""; // "" là đang thêm mới, còn lại là mã sách đang sửa

var trangSach = 1; // trang đang xem của bảng sách

function veBangSach() {
  var ds = layDsSach();
  var tuKhoa = oTimSach.value.trim().toLowerCase();

  // 1. Lọc: chỉ giữ các sách khớp ô tìm kiếm, loại và trạng thái
  var dsLoc = [];
  for (var i = 0; i < ds.length; i++) {
    var sach = ds[i];
    var trangThai = "active";
    if (sach.an) {
      trangThai = "locked";
    }
    if (tuKhoa !== "" && (sach.ma + " " + sach.ten).toLowerCase().indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locLoaiSach.value !== "all" && sach.loai !== locLoaiSach.value) {
      continue;
    }
    if (locTrangThaiSach.value !== "all" && trangThai !== locTrangThaiSach.value) {
      continue;
    }
    dsLoc.push(sach);
  }

  // 2. Chỉ lấy các sách của trang hiện tại (tối đa 4 sách)
  var tongTrang = tinhTongTrang(dsLoc.length);
  if (trangSach > tongTrang) {
    trangSach = tongTrang;
  }
  var dsTrang = layDongCuaTrang(dsLoc, trangSach);

  // 3. Vẽ các dòng của trang
  bangSach.innerHTML = "";
  for (var j = 0; j < dsTrang.length; j++) {
    var sachTrang = dsTrang[j];
    var hang = document.createElement("tr");
    hang.dataset.ma = sachTrang.ma;
    hang.appendChild(taoO(sachTrang.ma));
    hang.appendChild(taoO(layTenLoai(sachTrang.loai)));
    hang.appendChild(taoO(sachTrang.ten));
    hang.appendChild(taoO(laySoLuong(sachTrang.ma)));
    var cacNut = [taoNut("Sửa", "BTN_SUA_SP")];
    if (sachTrang.an) {
      hang.appendChild(taoOTrangThai("Đã ẩn", "TRANGTHAI BIKHOA"));
      cacNut.push(taoNut("Hiện", "BTN_HIEN_SP"));
    } else {
      hang.appendChild(taoOTrangThai("Hoạt động", "TRANGTHAI HOATDONG"));
      cacNut.push(taoNut("Ẩn", "BTN_AN_SP"));
    }
    cacNut.push(taoNut("Xóa", "BTN_XOA_SP"));
    hang.appendChild(taoOThaoTac(cacNut));
    bangSach.appendChild(hang);
  }

  // 4. Vẽ khung phân trang
  veKhungPhanTrang("QLY_DANHMUCSP", dsLoc.length, trangSach, "sách", function (trang) {
    trangSach = trang;
    veBangSach();
  });
}

// Đổi ô tìm kiếm hoặc bộ lọc thì quay về trang 1
function locSachLai() {
  trangSach = 1;
  veBangSach();
}

// Mở form: không truyền sách = thêm mới, truyền sách = sửa (điền sẵn thông tin hiện tại)
function moFormSach(sach) {
  var tieuDe = document.getElementById("DANHMUC_FORM_TIEUDE");
  document.getElementById("DANHMUC_THONGBAO").textContent = "";
  if (sach === undefined) {
    dangSuaSach = "";
    tieuDe.textContent = "Thêm sản phẩm";
    oMaSach.disabled = false;
    oMaSach.value = "";
    oTenSach.value = "";
    oHinhSach.value = "";
    oMoTaSach.value = "";
  } else {
    dangSuaSach = sach.ma;
    tieuDe.textContent = "Sửa sản phẩm";
    oMaSach.disabled = true; // không cho đổi mã
    oMaSach.value = sach.ma;
    oTenSach.value = sach.ten;
    oLoaiSach.value = sach.loai;
    oHinhSach.value = sach.hinh;
    oMoTaSach.value = sach.moTa || "";
  }
  formSach.style.display = "flex";
}

document.querySelector("#QLY_DANHMUCSP .BTN_THEM_SACH").addEventListener("click", function () {
  moFormSach();
});
formSach.querySelector(".ND_HUY").addEventListener("click", function () {
  formSach.style.display = "none";
});
formSach.querySelector(".ND_DONGY").addEventListener("click", function () {
  var thongBao = document.getElementById("DANHMUC_THONGBAO");
  var ma = oMaSach.value.trim();
  var ten = oTenSach.value.trim();
  var ds = layDsSach();
  var laThemMoi = dangSuaSach === "";

  if (ma === "") {
    thongBao.textContent = "Vui lòng nhập mã sách.";
    return;
  }
  if (ten === "") {
    thongBao.textContent = "Vui lòng nhập tên sách.";
    return;
  }
  if (laThemMoi) {
    if (timViTri(ds, ma) !== -1) {
      thongBao.textContent = "Mã sách đã tồn tại.";
      return;
    }
    // sách mới chưa có giá, giá sẽ được tính ở mục Giá bán
    ds.push({ ma: ma, ten: ten, loai: oLoaiSach.value, gia: 0, hinh: oHinhSach.value.trim(), moTa: oMoTaSach.value.trim() });
  } else {
    var sach = ds[timViTri(ds, dangSuaSach)];
    sach.ten = ten;
    sach.loai = oLoaiSach.value;
    sach.hinh = oHinhSach.value.trim();
    sach.moTa = oMoTaSach.value.trim();
  }
  luuDsSach(ds);
  formSach.style.display = "none";
  veBangSach();
  veBangGiaBan();
  if (laThemMoi) {
    hienThongBaoThanhCong("Thành công ! ", "Thêm sách mới thành công!");
  } else {
    hienThongBaoThanhCong("Thành công ! ", "Sửa sách thành công!");
  }
});

// Bài 4: một sự kiện click trên tbody cho các nút Sửa, Ẩn, Hiện, Xóa
bangSach.addEventListener("click", function (e) {
  var nut = e.target;
  var hang = nut.closest("tr");
  if (nut.tagName !== "BUTTON" || hang === null) {
    return;
  }
  var ds = layDsSach();
  var viTri = timViTri(ds, hang.dataset.ma);

  if (nut.classList.contains("BTN_SUA_SP")) {
    moFormSach(ds[viTri]);
    return;
  }
  if (nut.classList.contains("BTN_AN_SP")) {
    ds[viTri].an = true;
  } else if (nut.classList.contains("BTN_HIEN_SP")) {
    ds[viTri].an = false;
  } else if (nut.classList.contains("BTN_XOA_SP")) {
    if (!confirm("Bạn có chắc muốn xóa sách này không?")) {
      return;
    }
    ds.splice(viTri, 1);
  }
  luuDsSach(ds);
  veBangSach();
  veBangGiaBan();
});
oTimSach.addEventListener("input", locSachLai);
locLoaiSach.addEventListener("change", locSachLai);
locTrangThaiSach.addEventListener("change", locSachLai);

// ---------- 3. MỤC 5: NHẬP SẢN PHẨM ----------
var bangPhieu = document.getElementById("NHAPSP_TBODY");
var oTimPhieu = document.querySelector("#QLY_NHAPSP #QLY_LOAISP_INPUT_TIMKIEM");
var locTrangThaiPhieu = document.getElementById("QLY_NHAPSP_TRANGTHAI");
var oTuNgay = document.getElementById("NHAPSP_TUNGAY");
var oDenNgay = document.getElementById("NHAPSP_DENNGAY");
var formPhieu = document.getElementById("QLY_NHAPSP_THEM");
var oMaPhieu = document.getElementById("MA_PHIEU_MOI");
var oNgayPhieu = document.getElementById("NGAYNHAP_PHIEU_MOI");
var khungDong = document.getElementById("NHAPSP_DONG");
var oTongTien = document.getElementById("TONGTIENNHAP_PHIEU_MOI");
var dangSuaPhieu = ""; // "" là đang thêm mới, còn lại là mã phiếu đang sửa

function tinhSoSanPham(phieu) {
  var tong = 0;
  for (var i = 0; i < phieu.dong.length; i++) {
    tong = tong + phieu.dong[i].sl;
  }
  return tong;
}
function tinhTongTien(phieu) {
  var tong = 0;
  for (var i = 0; i < phieu.dong.length; i++) {
    tong = tong + phieu.dong[i].gia * phieu.dong[i].sl;
  }
  return tong;
}

var trangPhieu = 1; // trang đang xem của bảng phiếu nhập

function veBangPhieu() {
  var ds = layDsPhieu();
  var tuKhoa = oTimPhieu.value.trim().toLowerCase();

  // 1. Lọc theo mã phiếu, trạng thái và khoảng ngày (ngày dạng yyyy-mm-dd nên so sánh chuỗi được)
  var dsLoc = [];
  for (var i = 0; i < ds.length; i++) {
    var phieu = ds[i];
    var trangThai = "locked";
    if (phieu.hoanThanh) {
      trangThai = "active";
    }
    if (tuKhoa !== "" && phieu.ma.toLowerCase().indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locTrangThaiPhieu.value !== "all" && trangThai !== locTrangThaiPhieu.value) {
      continue;
    }
    if (oTuNgay.value !== "" && phieu.ngay < oTuNgay.value) {
      continue;
    }
    if (oDenNgay.value !== "" && phieu.ngay > oDenNgay.value) {
      continue;
    }
    dsLoc.push(phieu);
  }

  // 2. Chỉ lấy các phiếu của trang hiện tại (tối đa 4 phiếu)
  var tongTrang = tinhTongTrang(dsLoc.length);
  if (trangPhieu > tongTrang) {
    trangPhieu = tongTrang;
  }
  var dsTrang = layDongCuaTrang(dsLoc, trangPhieu);

  // 3. Vẽ các dòng của trang
  bangPhieu.innerHTML = "";
  for (var j = 0; j < dsTrang.length; j++) {
    var phieuTrang = dsTrang[j];
    var hang = document.createElement("tr");
    hang.dataset.ma = phieuTrang.ma;
    hang.appendChild(taoO(phieuTrang.ma));
    hang.appendChild(taoO(phieuTrang.ngay));
    hang.appendChild(taoO(tinhSoSanPham(phieuTrang)));
    hang.appendChild(taoO(dinhDangTien(tinhTongTien(phieuTrang))));
    var cacNut = [taoNut("Xem", "BTN_XEM_NHAPSP")];
    if (phieuTrang.hoanThanh) {
      hang.appendChild(taoOTrangThai("Hoàn thành", "TRANGTHAI HOANTHANH"));
    } else {
      hang.appendChild(taoOTrangThai("Chưa hoàn thành", "TRANGTHAI CHUAHOANTHANH"));
      cacNut.push(taoNut("Sửa", "BTN_SUA_NHAPSP"));
      cacNut.push(taoNut("Hoàn thành", "BTN_HOANTHANH_NHAPSP"));
    }
    hang.appendChild(taoOThaoTac(cacNut));
    bangPhieu.appendChild(hang);
  }

  // 4. Vẽ khung phân trang
  veKhungPhanTrang("QLY_NHAPSP", dsLoc.length, trangPhieu, "phiếu nhập", function (trang) {
    trangPhieu = trang;
    veBangPhieu();
  });
}

// Đổi ô tìm kiếm hoặc bộ lọc thì quay về trang 1
function locPhieuLai() {
  trangPhieu = 1;
  veBangPhieu();
}

// Thêm 1 dòng sản phẩm vào form phiếu (Bài 7: createElement + appendChild)
function themDongNhap(maSach, gia, soLuong) {
  var dong = document.createElement("div");
  dong.className = "THEM_LOAI_TRUONG";

  var oChon = document.createElement("select");
  var dsSach = layDsSach();
  for (var i = 0; i < dsSach.length; i++) {
    var muc = document.createElement("option");
    muc.value = dsSach[i].ma;
    muc.textContent = dsSach[i].ma + " - " + dsSach[i].ten;
    oChon.appendChild(muc);
  }
  if (maSach !== "") {
    oChon.value = maSach;
  }
  var oGia = document.createElement("input");
  oGia.type = "number";
  oGia.placeholder = "Giá nhập";
  oGia.value = gia;
  var oSoLuong = document.createElement("input");
  oSoLuong.type = "number";
  oSoLuong.placeholder = "Số lượng";
  oSoLuong.value = soLuong;

  dong.appendChild(oChon);
  dong.appendChild(oGia);
  dong.appendChild(oSoLuong);
  dong.appendChild(taoNut("Xóa", "NHAPSP_XOA_DONG"));
  khungDong.appendChild(dong);
}

// Tổng tiền = tổng (giá nhập x số lượng) của các dòng
function capNhatTongTien() {
  var tong = 0;
  for (var i = 0; i < khungDong.children.length; i++) {
    var cacO = khungDong.children[i].querySelectorAll("input");
    tong = tong + Number(cacO[0].value) * Number(cacO[1].value);
  }
  oTongTien.value = tong;
}

// Mở form: không truyền phiếu = thêm mới, truyền phiếu = sửa
function moFormPhieu(phieu) {
  var tieuDe = document.getElementById("NHAPSP_FORM_TIEUDE");
  document.getElementById("NHAPSP_THONGBAO").textContent = "";
  khungDong.innerHTML = "";
  if (phieu === undefined) {
    dangSuaPhieu = "";
    tieuDe.textContent = "Thêm phiếu nhập";
    oMaPhieu.disabled = false;
    oMaPhieu.value = "";
    oNgayPhieu.value = "";
    themDongNhap("", "", "");
  } else {
    dangSuaPhieu = phieu.ma;
    tieuDe.textContent = "Sửa phiếu nhập";
    oMaPhieu.disabled = true;
    oMaPhieu.value = phieu.ma;
    oNgayPhieu.value = phieu.ngay;
    for (var i = 0; i < phieu.dong.length; i++) {
      themDongNhap(phieu.dong[i].ma, phieu.dong[i].gia, phieu.dong[i].sl);
    }
  }
  capNhatTongTien();
  formPhieu.style.display = "flex";
}

// Chi tiết phiếu: dùng lại bảng chi tiết #BANG_CHI_TIET
function themDongChiTiet(nhan, giaTri) {
  var p = document.createElement("p");
  var chuDam = document.createElement("strong");
  chuDam.textContent = nhan + ": ";
  p.appendChild(chuDam);
  p.appendChild(document.createTextNode(giaTri));
  noiDungChiTiet.appendChild(p);
}
function hienChiTietPhieu(phieu) {
  noiDungChiTiet.innerHTML = "";
  themDongChiTiet("Mã phiếu", phieu.ma);
  themDongChiTiet("Ngày nhập", phieu.ngay);
  for (var i = 0; i < phieu.dong.length; i++) {
    themDongChiTiet(phieu.dong[i].ma, "giá nhập " + dinhDangTien(phieu.dong[i].gia) + ", số lượng " + phieu.dong[i].sl);
  }
  themDongChiTiet("Tổng tiền", dinhDangTien(tinhTongTien(phieu)));
  bangChiTiet_chung.style.display = "flex";
}

document.querySelector("#QLY_NHAPSP .BTN_THEM_PHIEU").addEventListener("click", function () {
  moFormPhieu();
});
document.getElementById("NHAPSP_THEM_DONG").addEventListener("click", function () {
  themDongNhap("", "", "");
});
khungDong.addEventListener("input", capNhatTongTien);
khungDong.addEventListener("click", function (e) {
  if (e.target.classList.contains("NHAPSP_XOA_DONG")) {
    e.target.parentElement.remove();
    capNhatTongTien();
  }
});
formPhieu.querySelector(".ND_HUY").addEventListener("click", function () {
  formPhieu.style.display = "none";
});
formPhieu.querySelector(".ND_DONGY").addEventListener("click", function () {
  var thongBao = document.getElementById("NHAPSP_THONGBAO");
  var ma = oMaPhieu.value.trim();
  var ds = layDsPhieu();
  var laThemMoi = dangSuaPhieu === "";

  if (ma === "") {
    thongBao.textContent = "Vui lòng nhập mã phiếu.";
    return;
  }
  if (laThemMoi && timViTri(ds, ma) !== -1) {
    thongBao.textContent = "Mã phiếu đã tồn tại.";
    return;
  }
  if (oNgayPhieu.value === "") {
    thongBao.textContent = "Vui lòng chọn ngày nhập.";
    return;
  }
  if (khungDong.children.length === 0) {
    thongBao.textContent = "Phiếu phải có ít nhất 1 sản phẩm.";
    return;
  }
  // đọc các dòng sản phẩm trong form
  var cacDong = [];
  for (var i = 0; i < khungDong.children.length; i++) {
    var oChon = khungDong.children[i].querySelector("select");
    var cacO = khungDong.children[i].querySelectorAll("input");
    var gia = Number(cacO[0].value);
    var soLuong = Number(cacO[1].value);
    if (gia <= 0 || soLuong <= 0) {
      thongBao.textContent = "Giá nhập và số lượng phải lớn hơn 0.";
      return;
    }
    cacDong.push({ ma: oChon.value, gia: gia, sl: soLuong });
  }

  if (laThemMoi) {
    ds.push({ ma: ma, ngay: oNgayPhieu.value, dong: cacDong, hoanThanh: false });
  } else {
    var phieu = ds[timViTri(ds, dangSuaPhieu)];
    phieu.ngay = oNgayPhieu.value;
    phieu.dong = cacDong;
  }
  luuDsPhieu(ds);
  formPhieu.style.display = "none";
  veBangPhieu();
  if (laThemMoi) {
    hienThongBaoThanhCong("Thành công ! ", "Thêm phiếu mới thành công!");
  } else {
    hienThongBaoThanhCong("Thành công ! ", "Sửa phiếu thành công!");
  }
});

// Bài 4: một sự kiện click trên tbody cho các nút Xem, Sửa, Hoàn thành
bangPhieu.addEventListener("click", function (e) {
  var nut = e.target;
  var hang = nut.closest("tr");
  if (nut.tagName !== "BUTTON" || hang === null) {
    return;
  }
  var ds = layDsPhieu();
  var phieu = ds[timViTri(ds, hang.dataset.ma)];

  if (nut.classList.contains("BTN_XEM_NHAPSP")) {
    hienChiTietPhieu(phieu);
  } else if (nut.classList.contains("BTN_SUA_NHAPSP")) {
    moFormPhieu(phieu);
  } else if (nut.classList.contains("BTN_HOANTHANH_NHAPSP")) {
    phieu.hoanThanh = true; // hoàn thành rồi thì không sửa được nữa
    luuDsPhieu(ds);
    // giá vốn thay đổi nên tính lại giá bán của các sách trong phiếu
    var dsSach = layDsSach();
    for (var i = 0; i < phieu.dong.length; i++) {
      var viTri = timViTri(dsSach, phieu.dong[i].ma);
      if (viTri !== -1) {
        tinhGiaBan(dsSach[viTri]);
      }
    }
    luuDsSach(dsSach);
    veBangPhieu();
    veBangSach();
    veBangGiaBan();
    hienThongBaoThanhCong("Thành công ! ", "Phiếu nhập đã hoàn thành!");
  }
});
oTimPhieu.addEventListener("input", locPhieuLai);
locTrangThaiPhieu.addEventListener("change", locPhieuLai);
oTuNgay.addEventListener("change", locPhieuLai);
oDenNgay.addEventListener("change", locPhieuLai);

// ---------- 4. MỤC 6: GIÁ BÁN ----------
var bangGiaBan = document.getElementById("GIABAN_TBODY");
var oTimGiaBan = document.querySelector("#QLY_GIABAN #QLY_LOAISP_INPUT_TIMKIEM");
var locLoaiGiaBan = document.getElementById("QLY_GIABAN_LOAI");
var formLoiNhuan = document.getElementById("MODAL_LOINHUAN_CHUNG");
var dongLoaiLoiNhuan = document.getElementById("LOINHUAN_DONG_LOAI");
var oLoaiLoiNhuan = document.getElementById("LOINHUAN_LOAI");
var oPhanTram = document.getElementById("LOINHUAN_PHANTRAM");
var thongBaoLoiNhuan = document.getElementById("LOINHUAN_THONGBAO");
var dangSuaLoiNhuan = ""; // "" là đặt % theo loại, còn lại là mã sách đang sửa %

function veBangGiaBan() {
  var ds = layDsSach();
  var tuKhoa = oTimGiaBan.value.trim().toLowerCase();
  bangGiaBan.innerHTML = "";
  for (var i = 0; i < ds.length; i++) {
    var sach = ds[i];
    if (tuKhoa !== "" && (sach.ma + " " + sach.ten).toLowerCase().indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locLoaiGiaBan.value !== "all" && sach.loai !== locLoaiGiaBan.value) {
      continue;
    }
    var giaVon = "Chưa có";
    if (layGiaVon(sach.ma) > 0) {
      giaVon = dinhDangTien(layGiaVon(sach.ma));
    }
    var loiNhuan = "Chưa đặt";
    if (sach.loiNhuan !== undefined) {
      loiNhuan = sach.loiNhuan + "%";
    }

    var hang = document.createElement("tr");
    hang.dataset.ma = sach.ma;
    hang.appendChild(taoO(sach.ma));
    hang.appendChild(taoO(sach.ten));
    hang.appendChild(taoO(layTenLoai(sach.loai)));
    hang.appendChild(taoO(giaVon));
    hang.appendChild(taoO(loiNhuan));
    hang.appendChild(taoO(dinhDangTien(sach.gia)));
    hang.appendChild(taoOThaoTac([taoNut("Sửa % lợi nhuận", "BTN_SUALOINHUAN_GIABAN")]));
    bangGiaBan.appendChild(hang);
  }
}

// Bài 4: sự kiện click trên tbody cho nút "Sửa % lợi nhuận"
bangGiaBan.addEventListener("click", function (e) {
  var nut = e.target;
  var hang = nut.closest("tr");
  if (nut.tagName !== "BUTTON" || hang === null) {
    return;
  }
  var ds = layDsSach();
  var sach = ds[timViTri(ds, hang.dataset.ma)];
  dangSuaLoiNhuan = sach.ma;
  dongLoaiLoiNhuan.style.display = "none"; // sửa 1 sách thì không cần chọn loại
  oPhanTram.value = "";
  if (sach.loiNhuan !== undefined) {
    oPhanTram.value = sach.loiNhuan;
  }
  thongBaoLoiNhuan.textContent = "";
  formLoiNhuan.style.display = "flex";
});
document.querySelector(".BTN_DATTHEOLOAI_GIABAN").addEventListener("click", function () {
  dangSuaLoiNhuan = "";
  dongLoaiLoiNhuan.style.display = ""; // hiện lại ô chọn loại
  oPhanTram.value = "";
  thongBaoLoiNhuan.textContent = "";
  formLoiNhuan.style.display = "flex";
});
document.getElementById("LOINHUAN_HUY").addEventListener("click", function () {
  formLoiNhuan.style.display = "none";
});
document.getElementById("LOINHUAN_LUU").addEventListener("click", function () {
  if (oPhanTram.value.trim() === "") {
    thongBaoLoiNhuan.textContent = "Vui lòng nhập % lợi nhuận.";
    return;
  }
  var phanTram = Number(oPhanTram.value);
  if (phanTram < 0) {
    thongBaoLoiNhuan.textContent = "% lợi nhuận không được nhỏ hơn 0.";
    return;
  }
  var ds = layDsSach();
  for (var i = 0; i < ds.length; i++) {
    // sửa 1 sách: đúng mã sách đó; đặt theo loại: tất cả sách thuộc loại đã chọn
    var trungMa = dangSuaLoiNhuan !== "" && ds[i].ma === dangSuaLoiNhuan;
    var trungLoai = dangSuaLoiNhuan === "" && ds[i].loai === oLoaiLoiNhuan.value;
    if (trungMa || trungLoai) {
      ds[i].loiNhuan = phanTram;
      tinhGiaBan(ds[i]);
    }
  }
  luuDsSach(ds);
  formLoiNhuan.style.display = "none";
  veBangGiaBan();
  hienThongBaoThanhCong("Thành công ! ", "Lưu lợi nhuận thành công!");
});
oTimGiaBan.addEventListener("input", veBangGiaBan);
locLoaiGiaBan.addEventListener("change", veBangGiaBan);

// ---------- 5. CHẠY KHI MỞ TRANG ----------
napTheLoai(locLoaiSach, true);
napTheLoai(locLoaiGiaBan, true);
napTheLoai(oLoaiSach, false);
napTheLoai(oLoaiLoiNhuan, false);
veBangSach();
veBangPhieu();
veBangGiaBan();
