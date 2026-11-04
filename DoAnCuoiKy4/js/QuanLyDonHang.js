// MỤC 7, 8: ĐƠN ĐẶT HÀNG - TỒN KHO
// Hàm dữ liệu lấy từ kho.js, hàm tạo ô/nút lấy từ QuanLySach.js
// Id trong HTML bị trùng giữa các trang nên chọn phần tử kèm id của trang: "#TRANG #id".

// CHI TIẾT DÙNG CHUNG (popup #BANG_CHI_TIET)
const khungChiTiet = document.getElementById("BANG_CHI_TIET");
const noiDungChiTietDon = document.getElementById("NOI_DUNG_CHI_TIET");

// Thêm 1 dòng "không có dữ liệu" khi bảng trống
function themDongTrong(bang, soCot, chu) {
  const hang = document.createElement("tr");
  const o = taoO(chu);
  o.colSpan = soCot;
  hang.appendChild(o);
  bang.appendChild(hang);
}

function themDongChiTietDon(nhan, giaTri) {
  const p = document.createElement("p");
  const chuDam = document.createElement("strong");
  chuDam.textContent = nhan + ": ";
  p.appendChild(chuDam);
  p.appendChild(document.createTextNode(giaTri));
  noiDungChiTietDon.appendChild(p);
}

// Đơn đặt hàng
const bangDon = document.querySelector("#QLY_DONDATHANG tbody");
const oTimDon = document.querySelector("#QLY_DONDATHANG #QLY_LOAISP_INPUT_TIMKIEM");
const locTrangThaiDon = document.querySelector("#QLY_DONDATHANG #QLY_NHAPSP_TRANGTHAI");
const oDonTuNgay = document.querySelector("#QLY_DONDATHANG #NHAPSP_TUNGAY");
const oDonDenNgay = document.querySelector("#QLY_DONDATHANG #NHAPSP_DENNGAY");
const formCapNhatDon = document.getElementById("CAPNHATTINHTRANGDON");
const oTinhTrangMoi = document.getElementById("TINHTRANG_DON_MOI");
let dangCapNhatDon = ""; // mã đơn đang cập nhật

// Màu nhãn: class có sẵn trong NhanVien.css
const LOP_TRANGTHAI_DON = {
  "Mới đặt": "TRANGTHAI DANGXULY",
  "Đã xử lý": "TRANGTHAI NHAP",
  "Đã giao": "TRANGTHAI DAXULY",
  "Đã hủy": "TRANGTHAI DAHUY",
};

// Chữ "Đã giao" -> mã "dagiao" 
function layMaTrangThai(chu) {
  for (const ma in TEN_TRANG_THAI) {
    if (TEN_TRANG_THAI[ma] === chu) {
      return ma;
    }
  }
  return "moidat";
}

function timViTriDon(ds, maDon) {
  for (let i = 0; i < ds.length; i++) {
    if (ds[i].maDonHang === maDon) {
      return i;
    }
  }
  return -1;
}

function tinhSoSachDon(don) {
  const dsSp = don.danhSachSanPham || [];
  let tong = 0;
  for (let i = 0; i < dsSp.length; i++) {
    tong = tong + dsSp[i].soLuong;
  }
  return tong;
}

function veBangDon() {
  const ds = layDsDon().reverse(); // đơn mới nhất lên đầu
  const tuKhoa = oTimDon.value.trim().toLowerCase();
  bangDon.innerHTML = "";
  for (let i = 0; i < ds.length; i++) {
    const don = ds[i];
    const ngay = layNgayDon(don);
    const trangThai = layTrangThaiDon(don);
    // tìm theo mã đơn / tên khách, lọc tình trạng, lọc khoảng ngày đặt
    if (tuKhoa !== "" && (don.maDonHang + " " + don.nguoiNhan + " " + don.username)
        .toLowerCase()
        .indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locTrangThaiDon.value !== "all" && TEN_TRANG_THAI[locTrangThaiDon.value] !== trangThai) {
      continue;
    }
    if (!trongKhoang(ngay, oDonTuNgay.value, oDonDenNgay.value)) {
      continue;
    }

    const hang = document.createElement("tr");
    hang.dataset.ma = don.maDonHang;
    hang.appendChild(taoO(don.maDonHang));
    hang.appendChild(taoO(don.nguoiNhan + " (" + don.username + ")"));
    hang.appendChild(taoO(hienNgay(ngay)));
    hang.appendChild(taoO(tinhSoSachDon(don)));
    hang.appendChild(taoO(dinhDangTien(don.tongTien)));
    hang.appendChild(taoOTrangThai(trangThai, LOP_TRANGTHAI_DON[trangThai]));
    const cacNut = [taoNut("Chi tiết", "BTN_DONDATHANG_CHITIET")];
    if (trangThai !== TEN_TRANG_THAI.dagiao && trangThai !== TEN_TRANG_THAI.huy) {
      cacNut.push(taoNut("Cập nhật tình trạng", "BTN_DONDATHANG_CAPNHATTINHTRANG"));
    }
    hang.appendChild(taoOThaoTac(cacNut));
    bangDon.appendChild(hang);
  }
  if (bangDon.children.length === 0) {
    themDongTrong(bangDon, 7, "Không có đơn hàng phù hợp.");
  }

  phanTrangBang(cacTrang[6]);
}

function hienChiTietDon(don) {
  noiDungChiTietDon.innerHTML = "";
  themDongChiTietDon("Mã đơn hàng", don.maDonHang);
  themDongChiTietDon("Ngày đặt", don.ngayDat);
  themDongChiTietDon("Tài khoản", don.username);
  themDongChiTietDon("Người nhận", don.nguoiNhan + " - " + don.dienThoai);
  themDongChiTietDon("Địa chỉ", don.diaChi);
  themDongChiTietDon("Thanh toán", don.phuongThucThanhToan);
  const dsSp = don.danhSachSanPham || [];
  for (let i = 0; i < dsSp.length; i++) {
    themDongChiTietDon(
      dsSp[i].ma + " - " + dsSp[i].ten,
      dsSp[i].soLuong + " x " + dinhDangTien(dsSp[i].gia) + " = " + dinhDangTien(dsSp[i].gia * dsSp[i].soLuong),
    );
  }
  themDongChiTietDon("Tổng tiền", dinhDangTien(don.tongTien));
  themDongChiTietDon("Tình trạng", layTrangThaiDon(don));
  khungChiTiet.style.display = "flex";
}

// Một sự kiện click trên tbody cho nút Chi tiết / Cập nhật
bangDon.addEventListener("click", function (e) {
  const nut = e.target;
  const hang = nut.closest("tr");
  if (nut.tagName !== "BUTTON" || hang === null) {
    return;
  }
  const ds = layDsDon();
  const don = ds[timViTriDon(ds, hang.dataset.ma)];
  if (nut.classList.contains("BTN_DONDATHANG_CHITIET")) {
    hienChiTietDon(don);
  } else if (nut.classList.contains("BTN_DONDATHANG_CAPNHATTINHTRANG")) {
    dangCapNhatDon = don.maDonHang;
    oTinhTrangMoi.value = layMaTrangThai(layTrangThaiDon(don)); // chọn sẵn tình trạng hiện tại
    formCapNhatDon.style.display = "flex";
  }
});

document.getElementById("BTN_HUY_CAPNHAT_DON").addEventListener("click", function () {
  formCapNhatDon.style.display = "none";
});

document.getElementById("BTN_XACNHAN_CAPNHAT_DON").addEventListener("click", function () {
  const ds = layDsDon();
  const don = ds[timViTriDon(ds, dangCapNhatDon)];
  const moi = TEN_TRANG_THAI[oTinhTrangMoi.value];
  if (moi === TEN_TRANG_THAI.huy && !confirm("Hủy đơn sẽ trả số sách về kho. Tiếp tục?")) {
    return;
  }
  don.trangThai = moi;
  luuDsDon(ds);
  formCapNhatDon.style.display = "none";
  veBangDon();
  veBangSach(); // hủy đơn làm "Số sách còn" ở Danh mục thay đổi
  hienThongBaoThanhCong("Thành công ! ", "Đơn " + don.maDonHang + " chuyển sang: " + moi);
});

oTimDon.addEventListener("input", veBangDon);
locTrangThaiDon.addEventListener("change", veBangDon);
oDonTuNgay.addEventListener("change", veBangDon);
oDonDenNgay.addEventListener("change", veBangDon);

// Tồn kho
const bangTonKho = document.querySelector("#QLY_SOLUONGTONSP tbody");
const oTimTonKho = document.querySelector("#QLY_SOLUONGTONSP #QLY_LOAISP_INPUT_TIMKIEM");
const locLoaiTonKho = document.querySelector("#QLY_SOLUONGTONSP #QLY_GIABAN_LOAI");
const oTaiNgay = document.querySelector("#QLY_SOLUONGTONSP #NHAPSP_DENNGAY");
const locTinhTrangTonKho = document.getElementById("QLY_TONKHO_TINHTRANG");
const modalTonKho = document.getElementById("TK_MODAL");
const tieuDeTonKho = document.querySelector("#TK_MODAL h2");
const oTkTuNgay = document.getElementById("TK_TUNGAY");
const oTkDenNgay = document.getElementById("TK_DENNGAY");
let dangXemTonKho = ""; // mã sách đang xem nhập - xuất - tồn

//Tra cứu tồn theo loại tại một thời điểm (ô ngày trống = hiện tại)
function veBangTonKho() {
  const ds = layDsSach();
  const tuKhoa = oTimTonKho.value.trim().toLowerCase();
  bangTonKho.innerHTML = "";
  for (let i = 0; i < ds.length; i++) {
    const sach = ds[i];
    if (tuKhoa !== "" && (sach.ma + " " + sach.ten).toLowerCase().indexOf(tuKhoa) === -1) {
      continue;
    }
    if (locLoaiTonKho.value !== "all" && sach.loai !== locLoaiTonKho.value) {
      continue;
    }
    const ton = laySoLuong(sach.ma, oTaiNgay.value);
    const tinhTrang = layTinhTrangTon(ton);
    if (locTinhTrangTonKho.value !== "all" && tinhTrang.ma !== locTinhTrangTonKho.value) {
      continue;
    }
    const hang = document.createElement("tr");
    hang.dataset.ma = sach.ma;
    hang.appendChild(taoO(sach.ma));
    hang.appendChild(taoO(sach.ten));
    hang.appendChild(taoO(layTenLoai(sach.loai)));
    hang.appendChild(taoO(ton));
    hang.appendChild(taoOTrangThai(tinhTrang.chu, tinhTrang.lop));
    hang.appendChild(taoOThaoTac([taoNut("Nhập - xuất - tồn", "BTN_CHITIET_TONKHO")]));
    bangTonKho.appendChild(hang);
  }
  if (bangTonKho.children.length === 0) {
    themDongTrong(bangTonKho, 6, "Không có sản phẩm phù hợp.");
  }
  phanTrangBang(cacTrang[7]);
}

//Cảnh báo sắp hết hàng ở trang Tổng quan (bảng thứ 2, thẻ thống kê thứ 4)
function veCanhBaoSapHet() {
  const bang = document.querySelectorAll("#TONGQUAN tbody")[1];
  // const oDem = document.querySelectorAll("#TONGQUAN .THONGTIN_HIENTAI_CHITIET span:last-child")[3];
  const ds = layDsSach().slice(0,5);
  
  let dem = 0;
  bang.innerHTML = "";
  for (let i = 0; i < ds.length; i++) {
    const ton = laySoLuong(ds[i].ma);
    if (ton <= NGUONG_SAPHET) {
      dem++;
      const hang = document.createElement("tr");
      hang.appendChild(taoO(ds[i].ma));
      hang.appendChild(taoO(ds[i].ten));
      hang.appendChild(taoO(ton));
      bang.appendChild(hang);
    }
  }
  // oDem.textContent = dem;
}

//Nhập - xuất - tồn của 1 sản phẩm trong [tuNgay, denNgay]
function veNhapXuatTon() {
  const tuNgay = oTkTuNgay.value;
  const denNgay = oTkDenNgay.value;
  if (tuNgay !== "" && denNgay !== "" && tuNgay > denNgay) {
    alert("Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.");
    return;
  }
  let tonDau = 0;
  if (tuNgay !== "") {
    tonDau = laySoLuong(dangXemTonKho, ngayTruoc(tuNgay));
  }
  const nhap = tinhNhap(dangXemTonKho, tuNgay, denNgay);
  const xuat = tinhXuat(dangXemTonKho, tuNgay, denNgay);
  document.getElementById("TK_TONG_NHAP").textContent = nhap;
  document.getElementById("TK_TONG_XUAT").textContent = xuat;
  document.getElementById("TK_TONG_TON").textContent = tonDau + nhap - xuat;

  const bang = document.getElementById("TK_DANHSACH");
  bang.innerHTML = "";
  const dong = [{ ngay: tuNgay, loai: "Tồn đầu kỳ", sl: tonDau }].concat(layLichSuKho(dangXemTonKho, tuNgay, denNgay));
  for (let i = 0; i < dong.length; i++) {
    const hang = document.createElement("tr");
    hang.appendChild(taoO(hienNgay(dong[i].ngay)));
    hang.appendChild(taoO(dong[i].loai));
    hang.appendChild(taoO(dong[i].sl));
    bang.appendChild(hang);
  }
}

bangTonKho.addEventListener("click", function (e) {
  const nut = e.target;
  const hang = nut.closest("tr");
  if (nut.tagName !== "BUTTON" || hang === null) {
    return;
  }
  const ds = layDsSach();
  const sach = ds[timViTri(ds, hang.dataset.ma)];
  dangXemTonKho = sach.ma;
  tieuDeTonKho.textContent = "Nhập – xuất – tồn: " + sach.ma + " - " + sach.ten;
  veNhapXuatTon();
  modalTonKho.style.display = "flex";
});

document.getElementById("TK_DONG").addEventListener("click", function () {
  modalTonKho.style.display = "none";
});

oTkTuNgay.addEventListener("change", veNhapXuatTon);
oTkDenNgay.addEventListener("change", veNhapXuatTon);
oTimTonKho.addEventListener("input", veBangTonKho);
locLoaiTonKho.addEventListener("change", veBangTonKho);
oTaiNgay.addEventListener("change", veBangTonKho);
locTinhTrangTonKho.addEventListener("change", veBangTonKho);

// ---------- VẼ LẠI KHI MỞ TAB ----------
// Phiếu nhập vừa hoàn thành hay khách vừa đặt đơn thì mở tab là thấy số mới
const veLaiTheoTab = {
  TRANG_TONGQUAN: veCanhBaoSapHet,
  TRANG_QLY_DONDATHANG: veBangDon,
  TRANG_QLY_SOLUONGTONSP: veBangTonKho,
};
document.querySelectorAll("#LEFT > ul > li").forEach(function (li) {
  li.addEventListener("click", function () {
    const ham = veLaiTheoTab[li.getAttribute("name")];
    if (ham !== undefined) {
      ham();
    }
  });
});

napTheLoai(locLoaiTonKho, true);
veBangDon();
veBangTonKho();
veCanhBaoSapHet();
