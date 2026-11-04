// HÀM DỮ LIỆU XÀI CHUNG
// ĐỌC GHI LOCAL, TÍNH NHẬP XUẤT TỒN

const NGUONG_SAPHET = 5; // Tồn <= 5 thì báo sắp hết

// Mã trong ô chọn tình trạng -> chữ lưu trong đơn hàng
const TEN_TRANG_THAI = {
  moidat: "Mới đặt",
  daxuly: "Đã xử lý",
  dagiao: "Đã giao",
  huy: "Đã hủy",
};

// ĐỌC GHI DỮ LIỆU
function layDsSach() {
  const chuoi = localStorage.getItem("dsSach");
  if (chuoi === null) {
    return DU_LIEU_MAU.slice();
  }
  return JSON.parse(chuoi);
}

function luuDsSach(ds) {
  localStorage.setItem("dsSach", JSON.stringify(ds));
}

function layDsPhieu() {
  const chuoi = localStorage.getItem("dsPhieuNhap");
  if (chuoi === null) {
    return [];
  }
  return JSON.parse(chuoi);
}

function luuDsPhieu(ds) {
  localStorage.setItem("dsPhieuNhap", JSON.stringify(ds));
}

function layDsDon() {
  const chuoi = localStorage.getItem("danhSachDonHang");
  if (chuoi === null) {
    return [];
  }
  return JSON.parse(chuoi);
}

function luuDsDon(ds) {
  localStorage.setItem("danhSachDonHang", JSON.stringify(ds));
}

// Lấy khách trong users.js theo username (để tạo đơn mẫu)
function timKhachMau(username) {
  for (let i = 0; i < SEED_USERS.length; i++) {
    if (SEED_USERS[i].username === username) {
      return SEED_USERS[i];
    }
  }
  return null;
}

// Tạo 1 đơn mẫu từ thông tin khách + danh sách sách
function taoDonMau(maDon, username, ngayDat, trangThai, phuongThuc, dsSp) {
  const khach = timKhachMau(username);
  let tongTien = 0;
  for (let i = 0; i < dsSp.length; i++) {
    tongTien = tongTien + dsSp[i].gia * dsSp[i].soLuong;
  }
  return {
    maDonHang: maDon,
    username: khach.username,
    nguoiNhan: khach.hoTen,
    dienThoai: khach.sdt || "0393912512", // users.js chưa có sđt -> giống mặc định ở checkout.js
    diaChi: khach.diaChi,
    phuongThucThanhToan: phuongThuc,
    danhSachSanPham: dsSp,
    tongTien: tongTien,
    ngayDat: ngayDat,
    trangThai: trangThai,
  };
}

// Chưa có đơn nào thì tạo 2 đơn mẫu
if (localStorage.getItem("danhSachDonHang") === null) {
  luuDsDon([
    taoDonMau("DH001", "customer01", "09:00:00 20/10/2026", "Mới đặt", "COD", [
      { ma: "VH01", ten: "Dế Mèn Phiêu Lưu Ký", gia: 50000, soLuong: 2 },
    ]),
    taoDonMau(
      "DH002",
      "customer02",
      "14:30:00 25/10/2026",
      "Đã giao",
      "BankTransfer",
      [
        { ma: "DS01", ten: "Đắc Nhân Tâm", gia: 100000, soLuong: 1 },
        {
          ma: "TT03",
          ten: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
          gia: 82000,
          soLuong: 1,
        },
      ],
    ),
  ]);
}
// Chưa có phiếu nhập nào thì tạo 1 phiếu nhập mẫu (đã hoàn thành) cho toàn bộ sách
if (localStorage.getItem("dsPhieuNhap") === null) {
  const dongNhap = [];
  for (let i = 0; i < DU_LIEU_MAU.length; i++) {
    dongNhap.push({ ma: DU_LIEU_MAU[i].ma, gia: 0, sl: 50 });
  }
  luuDsPhieu([
    { ma: "PN001", ngay: "2026-10-01", dong: dongNhap, hoanThanh: true },
  ]);
}

// NGÀY THÁNG
// ngayDat lưu dạng "14:30:05 28/10/2026" -> đổi về "2026-10-28" để so sánh chuỗi được
function layNgayDon(don) {
  const kq = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(don.ngayDat || "");
  if (kq === null) {
    return "";
  }
  return kq[3] + "-" + kq[2].padStart(2, "0") + "-" + kq[1].padStart(2, "0");
}

// "2026-10-28" -> "2026-10-27" (dùng để tính tồn đầu kỳ)
function ngayTruoc(ngay) {
  const p = ngay.split("-");
  const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]) - 1);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

// "2026-10-28" -> "28/10/2026" để hiển thị
function hienNgay(ngay) {
  if (ngay === "") {
    return "";
  }
  const p = ngay.split("-");
  return p[2] + "/" + p[1] + "/" + p[0];
}

// Ngày nằm trong [tuNgay, denNgay]? ("" = không giới hạn đầu đó)
function trongKhoang(ngay, tuNgay, denNgay) {
  if (tuNgay !== "" && ngay < tuNgay) {
    return false;
  }
  if (denNgay !== "" && ngay > denNgay) {
    return false;
  }
  return true;
}

// ĐƠN HÀNG
// Đơn cũ lưu "Chờ xử lý" -> coi là "Mới đặt"
function layTrangThaiDon(don) {
  if (!don.trangThai || don.trangThai === "Chờ xử lý") {
    return TEN_TRANG_THAI.moidat;
  }
  return don.trangThai;
}

// NHẬP XUẤT TỒN
// Liệt kê mọi lần nhập (sl dương) và xuất (sl âm) của 1 sách trong khoảng ngày
function layLichSuKho(maSach, tuNgay, denNgay) {
  const ketQua = [];

  const dsPhieu = layDsPhieu();
  for (let i = 0; i < dsPhieu.length; i++) {
    const phieu = dsPhieu[i];
    if (!phieu.hoanThanh || !trongKhoang(phieu.ngay, tuNgay, denNgay)) {
      continue;
    }
    for (let j = 0; j < phieu.dong.length; j++) {
      if (phieu.dong[j].ma === maSach) {
        ketQua.push({
          ngay: phieu.ngay,
          loai: "Nhập (" + phieu.ma + ")",
          sl: phieu.dong[j].sl,
        });
      }
    }
  }

  const dsDon = layDsDon();
  for (let k = 0; k < dsDon.length; k++) {
    const don = dsDon[k];
    const ngayDon = layNgayDon(don);
    if (
      layTrangThaiDon(don) === TEN_TRANG_THAI.huy ||
      !trongKhoang(ngayDon, tuNgay, denNgay)
    ) {
      continue;
    }
    const dsSp = don.danhSachSanPham || [];
    for (let m = 0; m < dsSp.length; m++) {
      if (dsSp[m].ma === maSach) {
        ketQua.push({
          ngay: ngayDon,
          loai: "Xuất (" + don.maDonHang + ")",
          sl: -dsSp[m].soLuong,
        });
      }
    }
  }

  // sắp theo ngày tăng dần (ngày dạng yyyy-mm-dd nên so sánh chuỗi được)
  ketQua.sort(function (a, b) {
    if (a.ngay < b.ngay) return -1;
    if (a.ngay > b.ngay) return 1;
    return 0;
  });
  return ketQua;
}

function tinhNhap(maSach, tuNgay, denNgay) {
  const ls = layLichSuKho(maSach, tuNgay, denNgay);
  let tong = 0;
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].sl > 0) {
      tong = tong + ls[i].sl;
    }
  }
  return tong;
}

function tinhXuat(maSach, tuNgay, denNgay) {
  const ls = layLichSuKho(maSach, tuNgay, denNgay);
  let tong = 0;
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].sl < 0) {
      tong = tong - ls[i].sl;
    }
  }
  return tong;
}

// Số lượng tồn tính đến hết ngày denNgay (bỏ trống = đến hiện tại)
function laySoLuong(maSach, denNgay = "") {
  return tinhNhap(maSach, "", denNgay) - tinhXuat(maSach, "", denNgay);
}

// Phân loại tồn: dùng cho cột tình trạng và bộ lọc
function layTinhTrangTon(ton) {
  if (ton <= 0) {
    return { ma: "hethang", chu: "Hết hàng", lop: "TRANGTHAI HETHANG" };
  }
  if (ton <= NGUONG_SAPHET) {
    return { ma: "saphet", chu: "Sắp hết", lop: "TRANGTHAI SAPHET" };
  }
  return { ma: "conhang", chu: "Còn hàng", lop: "TRANGTHAI CONHANG" };
}
