// ===== POPUP CHI TIẾT SÁCH =====
// Di chuột vào card sách thì hiện popup thông tin sách.
// Dùng chung cho trang chủ (doan.html) và trang sản phẩm (sanpham.html).
// Cần nạp SAU data.js (dùng biến DU_LIEU_MAU và THE_LOAI).

var CHON_CARD = ".the-sach, #noibat > div"; // các card hiện popup (trang sản phẩm, trang chủ)
var CHON_TEN = ".ten-sach, p"; // phần tử chứa tên sách bên trong card

var popupKhung = document.createElement("div");
popupKhung.id = "popupChiTiet";
document.body.appendChild(popupKhung);
var popupCardDangXem = null; // card đang hiện popup

// Lấy danh sách sách: ưu tiên danh sách do admin quản lý, chưa có thì dùng data.js
function popupLayDanhSach() {
  var chuoi = localStorage.getItem("dsSach");
  if (chuoi !== null) {
    return JSON.parse(chuoi);
  }
  return DU_LIEU_MAU;
}

// Tìm sách theo tên, không thấy trả về null
function popupTimSach(ten) {
  var ds = popupLayDanhSach();
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].ten === ten) {
      return ds[i];
    }
  }
  return null;
}

function popupTenTheLoai(idLoai) {
  for (var i = 0; i < THE_LOAI.length; i++) {
    if (THE_LOAI[i].id === idLoai) {
      return THE_LOAI[i].ten;
    }
  }
  return "";
}

// Thêm 1 dòng "Nhãn: nội dung" vào popup
function popupThemDong(nhan, noiDung) {
  var p = document.createElement("p");
  var chuDam = document.createElement("strong");
  chuDam.textContent = nhan + ": ";
  p.appendChild(chuDam);
  p.appendChild(document.createTextNode(noiDung));
  popupKhung.appendChild(p);
}

// Điền thông tin sách vào popup rồi đặt popup cạnh card
function popupHienThi(card) {
  var oTen = card.querySelector(CHON_TEN);
  if (oTen === null) {
    return;
  }
  var ten = oTen.textContent.trim();
  var sach = popupTimSach(ten);

  popupKhung.innerHTML = "";
  var tieuDe = document.createElement("h3");
  tieuDe.textContent = ten;
  popupKhung.appendChild(tieuDe);

  if (sach === null) {
    popupThemDong("Thông tin", "Chưa có thông tin chi tiết");
  } else {
    popupThemDong("Mã sách", sach.ma);
    popupThemDong("Thể loại", popupTenTheLoai(sach.loai));
    if (sach.tacGia) {
      popupThemDong("Tác giả", sach.tacGia.trim());
    }
    popupThemDong("Giá", Number(sach.gia).toLocaleString("vi-VN") + " đ");
    if (sach.moTa) {
      popupThemDong("Mô tả", sach.moTa);
    }
  }

  // đặt popup bên phải card, hết chỗ thì đặt bên trái
  popupKhung.style.display = "block";
  var viTri = card.getBoundingClientRect();
  var trai = viTri.right + 12;
  if (trai + popupKhung.offsetWidth > window.innerWidth) {
    trai = viTri.left - popupKhung.offsetWidth - 12;
  }
  var tren = viTri.top;
  if (tren + popupKhung.offsetHeight > window.innerHeight) {
    tren = window.innerHeight - popupKhung.offsetHeight - 12;
  }
  if (tren < 12) {
    tren = 12;
  }
  popupKhung.style.left = trai + "px";
  popupKhung.style.top = tren + "px";
}

// Một sự kiện cho cả trang (card trang sản phẩm được vẽ lại khi chuyển trang nên không gắn riêng từng card)
document.addEventListener("mouseover", function (e) {
  var card = e.target.closest(CHON_CARD);
  if (card === popupCardDangXem) {
    return; // vẫn đang ở trong card cũ
  }
  popupCardDangXem = card;
  if (card === null) {
    popupKhung.style.display = "none";
  } else {
    popupHienThi(card);
  }
});

// Cuộn trang thì ẩn popup
window.addEventListener("scroll", function () {
  popupKhung.style.display = "none";
  popupCardDangXem = null;
});
