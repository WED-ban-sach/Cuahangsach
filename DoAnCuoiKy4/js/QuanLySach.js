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
// Danh sách loại do admin quản lý (khoá "danhSachLoai", có thêm/sửa/ẩn ở mục Quản lý loại), chưa có thì dùng THE_LOAI
function layDsLoaiAdmin() {
  var chuoi = localStorage.getItem("danhSachLoai");
  if (chuoi === null) {
    return THE_LOAI;
  }
  return JSON.parse(chuoi);
}
function layTenLoai(idLoai) {
  var dsLoai = layDsLoaiAdmin();
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === idLoai) {
      return dsLoai[i].ten;
    }
  }
  return "";
}
function dinhDangTien(so) {
  return Number(so).toLocaleString("vi-VN") + " đ";
}
// Giá vốn = giá nhập của phiếu đã hoàn thành gần nhất (phiếu nằm sau là phiếu mới hơn).
// Sách chưa có phiếu nhập nào thì dùng giá vốn ban đầu (giaVon) của sách trong data.js
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
  if (giaVon === 0) {
    for (var k = 0; k < DU_LIEU_MAU.length; k++) {
      if (DU_LIEU_MAU[k].ma === maSach && DU_LIEU_MAU[k].giaVon) {
        giaVon = DU_LIEU_MAU[k].giaVon;
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
// Đưa các loại vào ô chọn.
// giuMucDau = true: ô lọc (giữ mục "tất cả", liệt kê mọi loại).
// giuMucDau = false: ô chọn loại cho sách (chỉ các loại đang hoạt động, bỏ loại đã ẩn)
function napTheLoai(oChon, giuMucDau) {
  var dsLoai = layDsLoaiAdmin();
  var giaTriCu = oChon.value; // nhớ lựa chọn hiện tại để nạp lại xong vẫn giữ
  if (giuMucDau) {
    while (oChon.options.length > 1) {
      oChon.remove(1);
    }
  } else {
    oChon.innerHTML = "";
  }
  for (var i = 0; i < dsLoai.length; i++) {
    if (!giuMucDau && dsLoai[i].trangThai === "locked") {
      continue;
    }
    var muc = document.createElement("option");
    muc.value = dsLoai[i].id;
    muc.textContent = dsLoai[i].ten;
    oChon.appendChild(muc);
  }
  if (giaTriCu !== "") {
    oChon.value = giaTriCu;
  }
}

// Gọi khi loại sản phẩm thay đổi (thêm, sửa, ẩn, xóa): nạp lại các ô chọn loại và vẽ lại bảng
function capNhatOChonLoai() {
  napTheLoai(locLoaiSach, true);
  napTheLoai(locLoaiGiaBan, true);
  napTheLoai(oLoaiSach, false);
  napTheLoai(oLoaiLoiNhuan, false);
  veBangSach();
  veBangGiaBan();
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

function veBangSach() {
  var ds = layDsSach();
  var tuKhoa = oTimSach.value.trim().toLowerCase();
  bangSach.innerHTML = "";
  for (var i = 0; i < ds.length; i++) {
    var sach = ds[i];
    var trangThai = "active";
    if (sach.an) {
      trangThai = "locked";
    }
    // lọc theo ô tìm kiếm, loại và trạng thái
    if (tuKhoa !== "" && (sach.ma + " " + sach.ten).toLowerCase().indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locLoaiSach.value !== "all" && sach.loai !== locLoaiSach.value) {
      continue;
    }
    if (locTrangThaiSach.value !== "all" && trangThai !== locTrangThaiSach.value) {
      continue;
    }

    var hang = document.createElement("tr");
    hang.dataset.ma = sach.ma;
    hang.appendChild(taoO(sach.ma));
    hang.appendChild(taoO(layTenLoai(sach.loai)));
    hang.appendChild(taoO(sach.ten));
    hang.appendChild(taoO(laySoLuong(sach.ma)));
    var cacNut = [taoNut("Sửa", "BTN_SUA_SP")];
    if (sach.an) {
      hang.appendChild(taoOTrangThai("Đã ẩn", "TRANGTHAI BIKHOA"));
      cacNut.push(taoNut("Hiện", "BTN_HIEN_SP"));
    } else {
      hang.appendChild(taoOTrangThai("Hoạt động", "TRANGTHAI HOATDONG"));
      cacNut.push(taoNut("Ẩn", "BTN_AN_SP"));
    }
    cacNut.push(taoNut("Xóa", "BTN_XOA_SP"));
    hang.appendChild(taoOThaoTac(cacNut));
    bangSach.appendChild(hang);

    phanTrangBang(cacTrang[3]); 
  }
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
oTimSach.addEventListener("input", veBangSach);
locLoaiSach.addEventListener("change", veBangSach);
locTrangThaiSach.addEventListener("change", veBangSach);

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

function veBangPhieu() {
  var ds = layDsPhieu();
  var tuKhoa = oTimPhieu.value.trim().toLowerCase();
  bangPhieu.innerHTML = "";
  for (var i = 0; i < ds.length; i++) {
    var phieu = ds[i];
    var trangThai = "locked";
    if (phieu.hoanThanh) {
      trangThai = "active";
    }
    // lọc theo mã phiếu, trạng thái và khoảng ngày (ngày dạng yyyy-mm-dd nên so sánh chuỗi được)
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

    var hang = document.createElement("tr");
    hang.dataset.ma = phieu.ma;
    hang.appendChild(taoO(phieu.ma));
    hang.appendChild(taoO(phieu.ngay));
    hang.appendChild(taoO(tinhSoSanPham(phieu)));
    hang.appendChild(taoO(dinhDangTien(tinhTongTien(phieu))));
    var cacNut = [taoNut("Xem", "BTN_XEM_NHAPSP")];
    if (phieu.hoanThanh) {
      hang.appendChild(taoOTrangThai("Hoàn thành", "TRANGTHAI HOANTHANH"));
    } else {
      hang.appendChild(taoOTrangThai("Chưa hoàn thành", "TRANGTHAI CHUAHOANTHANH"));
      cacNut.push(taoNut("Sửa", "BTN_SUA_NHAPSP"));
      cacNut.push(taoNut("Hoàn thành", "BTN_HOANTHANH_NHAPSP"));
    }
    hang.appendChild(taoOThaoTac(cacNut));
    bangPhieu.appendChild(hang);


    phanTrangBang(cacTrang[4]); 
  }
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
oTimPhieu.addEventListener("input", veBangPhieu);
locTrangThaiPhieu.addEventListener("change", veBangPhieu);
oTuNgay.addEventListener("change", veBangPhieu);
oDenNgay.addEventListener("change", veBangPhieu);

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
    if (layGiaVon(sach.ma) >= 0) {
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

    phanTrangBang(cacTrang[5]);

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
