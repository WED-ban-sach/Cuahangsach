// var menu = document.getElementById("MENU");
// var left = document.getElementById("LEFT");
// var container = document.getElementById("CONTAINER");


// menu.addEventListener("click", function() {
//     left.classList.toggle("hide");

//     container.classList.toggle("full");

// });

// --------------xoa tren day---------------

// ------------------THEM ( FIX LOI MAN HINH NHO )------------


var menu = document.getElementById("MENU");
var left = document.getElementById("LEFT");
var container = document.getElementById("CONTAINER");
 
var MOBILE_MAX = 768; 

var overlay = document.createElement("div");
overlay.id = "OVERLAY";
document.body.appendChild(overlay);
 
function laManHinhNho() {
    return window.innerWidth <= MOBILE_MAX;
}
 
function capNhatOverlay() {
    var dangMo = !left.classList.contains("hide");
    if (laManHinhNho() && dangMo) {
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}
 

function dongMenuManHinhNho() {
    if (laManHinhNho()) {
        left.classList.add("hide");
        capNhatOverlay();
    }
}
 

if (laManHinhNho()) {
    left.classList.add("hide");
}
 
menu.addEventListener("click", function() {
    left.classList.toggle("hide");
 

    container.classList.toggle("full");
 
    capNhatOverlay();
});
 

overlay.addEventListener("click", function() {
    left.classList.add("hide");
    container.classList.add("full");
    capNhatOverlay();
});
 

var tungLaManHinhNho = laManHinhNho();
 
window.addEventListener("resize", function() {
    var bayGio = laManHinhNho();
 
    if (bayGio !== tungLaManHinhNho) {
        if (bayGio) {

            left.classList.add("hide");
            container.classList.add("full");
        } else {

            left.classList.remove("hide");
            container.classList.remove("full");
        }
        tungLaManHinhNho = bayGio;
    }
 
    capNhatOverlay();
});
 
//  -----------------------------------------------




// =====================CHUYEN DOI TRANG ===============================


var tabmenu = document.querySelectorAll("#LEFT > ul > li ");
var cacTrang = document.querySelectorAll(".TRANG");


for ( var i = 0; i < tabmenu.length; i++ ) {

    tabmenu[i].addEventListener("click", function(e) {
        e.preventDefault();

        var namePage = this.getAttribute("name");


        for ( var j = 0 ; j < cacTrang.length; j++ ) {
            cacTrang[j].style.display = "none";
        }


        if ( namePage == "TRANG_TONGQUAN") {
            document.getElementById("TONGQUAN").style.display = "block";
            capNhatTongQuan();
        }

        else if ( namePage == "TRANG_QLY_NGUOIDUNG") {
            document.getElementById("QLY_NGUOIDUNG").style.display = "block";
        }

        else if ( namePage == "TRANG_QLY_LOAISP") {
            document.getElementById("QLY_LOAISP").style.display = "block";
        }

        else if ( namePage == "TRANG_QLY_DANHMUCSP") {
            document.getElementById("QLY_DANHMUCSP").style.display = "block";
            
        }

        else if ( namePage  == "TRANG_QLY_NHAPSP") {
            document.getElementById("QLY_NHAPSP").style.display = "block";
        }

        else if ( namePage == "TRANG_QLY_GIABAN") {
            document.getElementById("QLY_GIABAN").style.display = "block";


        }


        else if ( namePage == "TRANG_QLY_DONDATHANG") {
            document.getElementById("QLY_DONDATHANG").style.display = "block";


        }


        else {
            document.getElementById("QLY_SOLUONGTONSP").style.display = "block";
        }
    })
}




// ------------------------QUAN LY NGUOI DUNG-----------------------------




var btn_khoa = document.querySelectorAll(".BTN_KHOA");
var btn_mokhoa = document.querySelectorAll(".BTN_MOKHOA");
var btn_resetmk = document.querySelectorAll(".BTN_RESETMK");

var tb_xacnhan = document.getElementById("QLY_NGUOIDUNG_THONGBAOXACNHAN");
var tb_thanhcong = document.getElementById("QLY_NGUOIDUNG_XACNHANTHANHCONG");
// var tb_resetmk = document.getElementById("QLY_NGUOIDUNG_RESETMK");


var nutDongY = tb_xacnhan.querySelector(".ND_DONGY");
var nutHuy = tb_xacnhan.querySelector(".ND_HUY");

var nutDong = tb_thanhcong.querySelector(".ND_DONGY");


// var nutXacNhanReset = tb_resetmk.querySelector(".ND_DONGY");
// var nutHuyReset = tb_resetmk.querySelector(".ND_HUY");

var oMatKhauMoi = document.getElementById("RESETMK_MOI");
var thaoTacHienTai = "";


var cacNutKhoa = document.querySelectorAll(".BTN_KHOA");

cacNutKhoa.forEach(function(nut) {

    nut.addEventListener("click", function() {

        thaoTacHienTai = "khoa";

        tb_xacnhan.querySelector("h3").textContent = "Xác nhận khóa tài khoản";

        tb_xacnhan.querySelector("p").textContent = "Bạn có chắc chắn muốn khóa tài khoản này không?";

        tb_xacnhan.style.display = "flex";

    });

});


var cacNutMoKhoa = document.querySelectorAll(".BTN_MOKHOA");

cacNutMoKhoa.forEach(function(nut) {

    nut.addEventListener("click", function() {

        thaoTacHienTai = "mokhoa";

        tb_xacnhan.querySelector("h3").textContent = "Xác nhận mở khóa";

        tb_xacnhan.querySelector("p").textContent = "Bạn có chắc chắn muốn mở khóa tài khoản này không?";

        tb_xacnhan.style.display = "flex";

    });

});


nutDongY.addEventListener("click", function() {
    tb_xacnhan.style.display = "none";

    if ( thaoTacHienTai == "khoa") {
        tb_thanhcong.querySelector("p").textContent = "Khóa tài khoản thành công!";
    }

    else if ( thaoTacHienTai == "mokhoa") {
        tb_thanhcong.querySelector("p").textContent = "Mở khóa tài khoản thành công!";

    }
    tb_thanhcong.style.display = "flex";
})


nutHuy.addEventListener("click", function() {
    tb_xacnhan.style.display = "none";
})


nutDong.addEventListener("click", function() {

    tb_thanhcong.style.display = "none";

});


// var cacNutResetMK = document.querySelectorAll(".BTN_RESETMK");

// cacNutResetMK.forEach(function(nut) {

//     nut.addEventListener("click", function() {

//         oMatKhauMoi.value = "";

//         tb_resetmk.style.display = "flex";

//     });

// });



/*
nutXacNhanReset.addEventListener("click", function() {

    if (oMatKhauMoi.value.trim() === "") {


        oMatKhauMoi.focus();

        return;

    }

    tb_resetmk.style.display = "none";


    tb_thanhcong.querySelector("p").textContent = "Đặt lại mật khẩu thành công!";

    tb_thanhcong.style.display = "flex";

});



nutHuyReset.addEventListener("click", function() {

    tb_resetmk.style.display = "none";
});
*/




// ------------------ quan ly loai sp ------------------------


var btn_them_loai = document.querySelector("#QLY_LOAISP  .BTN_THEM_LOAI");
var qly_loaisp_them_loai = document.getElementById("QLY_LOAISP_THEM_LOAI");

var qly_loaisp_them_loai_huy = qly_loaisp_them_loai.querySelector(".ND_HUY")
var qly_loaisp_them_loai_dongy = qly_loaisp_them_loai.querySelector(".ND_DONGY");



var ma_loai_moi = document.getElementById("MA_LOAI_MOI");
var ten_loai_moi = document.getElementById("TEN_LOAI_MOI");



function hienThongBaoThanhCong(tieuDe, noiDung) {
    tb_thanhcong.querySelector("h3").textContent = tieuDe;
    tb_thanhcong.querySelector("p").textContent = noiDung;

    tb_thanhcong.style.display = "flex";
}

btn_them_loai.addEventListener("click", function() {
    qly_loaisp_them_loai.style.display = "flex";

    ma_loai_moi.value = "";
    ten_loai_moi.value = "";
})


qly_loaisp_them_loai_huy.addEventListener("click", function() {
    qly_loaisp_them_loai.style.display = "none";
})


qly_loaisp_them_loai_dongy.addEventListener("click", function() {

    qly_loaisp_them_loai.style.display = "none";
    
    hienThongBaoThanhCong("Thành công ! ", "Thêm loại sản phẩm thành công!");

})




var btn_sua_loai = document.querySelectorAll(".BTN_SUA_LOAI");
var sua_chung = document.getElementById("QLY_SUA_CHUNG");

var qly_loaisp_sua_huy = sua_chung.querySelector(".ND_HUY");
var qly_loaisp_sua_dongY = sua_chung.querySelector(".ND_DONGY");


btn_sua_loai.forEach(function(nut) {
    
    nut.addEventListener("click", function() {
        var sua_tieu_de = document.getElementById("SUA_TIEUDE");
        var sua_cac_truong = document.getElementById("SUA_CAC_TRUONG");

        sua_tieu_de.textContent = "SỦA LOẠI SẢN PHẨM";
        sua_cac_truong.innerHTML = "";
        
        sua_cac_truong.innerHTML += `
            <div class="THEM_LOAI_TRUONG">
                <label>Mã loại sản phẩm</label>
                <input type="text" id="SUA_MA" value="">
            </div>
        `;


        sua_cac_truong.innerHTML += `
            <div class="THEM_LOAI_TRUONG">
                <label>Tên loại sản phẩm</label>
                <input type="text" id="SUA_TEN" value="">
            </div>`

        sua_chung.style.display  = "flex";


        qly_loaisp_sua_huy.addEventListener("click", function() {
            sua_chung.style.display = "none";
        })

        qly_loaisp_sua_dongY.addEventListener("click", function() {
            sua_chung.style.display = "none";
            hienThongBaoThanhCong("Thành công ! ", "Sửa loại sách thành công!");

        })
    })



})




// ------------------------- quan ly danh muc: xem QuanLySach.js


// ------------------------- quan ly nhap sp: xem QuanLySach.js


var bangChiTiet_chung = document.getElementById("BANG_CHI_TIET");
var noiDungChiTiet = document.getElementById("NOI_DUNG_CHI_TIET");

var nut_chiTietDong = document.querySelector(".CHI_TIET_CUOI");


nut_chiTietDong.addEventListener("click", function() {
    bangChiTiet_chung.style.display = "none";
})




/*
var capnhattinhtrangdon = document.getElementById("CAPNHATTINHTRANGDON");
var btn_capnhattinhtrangdon = document.querySelectorAll(".BTN_DONDATHANG_CAPNHATTINHTRANG");
var capnhattinhtrangdon_huy = capnhattinhtrangdon.querySelector(".ND_HUY");

btn_capnhattinhtrangdon.forEach( function(nut) {
    nut.addEventListener("click", function() {

        capnhattinhtrangdon.style.display = "flex";

    })

})


capnhattinhtrangdon_huy.addEventListener("click", function() {
    capnhattinhtrangdon.style.display = "none";
})

// bangChiTiet_chung noiDungChiTiet nut_chiTietDong

var btn_dondathang_chitiet = document.querySelectorAll(".BTN_DONDATHANG_CHITIET");

btn_dondathang_chitiet.forEach( function(nut) {
    nut.addEventListener("click", function() {

        noiDungChiTiet.innerHTML = `
            <p><strong>Mã đơn hàng:</strong> DH001</p>
            <p><strong>Ngày đặt:</strong> 18/10/2026</p>
            <p><strong>Tên khách hàng:</strong> Nguyễn Văn An</p>
            <p><strong>Tên sản phẩm:</strong> Lập trình Java</p>
            <p><strong>Số lượng:</strong> 2</p>
            <p><strong>Đơn giá:</strong> 85.000 đ</p>
            <p><strong>Tổng tiền:</strong> 170.000 đ</p>
            <p><strong>Trạng thái:</strong> Đang xử lý</p>
        `;

        bangChiTiet_chung.style.display = "flex";

    })
})
*/




// ------------------------- quan ly gia ban: xem QuanLySach.js


/*
var tk_modal = document.getElementById("TK_MODAL");
var btn_chitiet_tonkho = document.querySelectorAll(".BTN_CHITIET_TONKHO");

var tk_dong = document.getElementById("TK_DONG");


btn_chitiet_tonkho.forEach(function(nut) {
    nut.addEventListener("click", function() {
        tk_modal.style.display = "flex";
    })
})


tk_dong.addEventListener("click", function() {
    tk_modal.style.display = "none";
})
*/




// -------------------------THEM ( CAP NHAT PHAN TONG QUAN )--------------------


function chuoiVeNgay(chuoi) {
  if (!chuoi) return null;
  var kq;
  if (chuoi.indexOf("T") !== -1) {
    var d = new Date(chuoi);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  kq = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(chuoi);
  if (kq) return new Date(+kq[1], +kq[2] - 1, +kq[3]);
  kq = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(chuoi);
  if (kq) return new Date(+kq[3], +kq[2] - 1, +kq[1]);
  return null;
}


function laKhachMoi(chuoiNgayTao, soNgay) {
  var ngayTao = chuoiVeNgay(chuoiNgayTao);
  if (ngayTao === null) return false;
  var now = new Date();
  var homNay0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var chenhLech = Math.round((homNay0 - ngayTao) / 86400000);
  return chenhLech >= 0 && chenhLech <= soNgay;
}



function capNhatTongQuan() {

  var ngayHienTai = new Date();
  var homNay = ngayHienTai.getFullYear() + "-"
    + String(ngayHienTai.getMonth() + 1).padStart(2, "0") + "-"
    + String(ngayHienTai.getDate()).padStart(2, "0");


  var dsDon = layDsDon();
  var donHomNay = dsDon.filter(function(don) {
    return (layNgayDon(don) === homNay ) && (layTrangThaiDon(don)!== TEN_TRANG_THAI.huy) ;
  }).length;

  var TQ_DON_HOMAY = document.getElementById("TQ_DON_HOMNAY");
  TQ_DON_HOMAY.textContent = donHomNay;




  var dsSach = layDsSach();
  var dangBan = dsSach.filter(function(sach) {
    return !sach.an;
  }).length;

  var TQ_SP_DANGBAN = document.getElementById("TQ_SP_DANGBAN");
  TQ_SP_DANGBAN.textContent = dangBan;




  // KHACH MOI = tao tai khoan <= 7 ngay
  var users = layUsers();
  var khachMoi = users.filter(function(u) {
    return u.role === "customer" && laKhachMoi(u.createdAt,7);
  }).length;

  var TQ_KHACH_MOI = document.getElementById("TQ_KHACH_MOI");
  TQ_KHACH_MOI.textContent = khachMoi;




  var sapHet = dsSach.filter(function(s) {
    var ton = laySoLuong(s.ma);
    return ton <= NGUONG_SAPHET;
  }).length;

  var TQ_SAP_HET = document.getElementById("TQ_SAP_HET");
  TQ_SAP_HET.textContent = sapHet;


  // BANG DON HANG GAN DAY (5 don moi nhat, khong tinh don huy)
  var tbodyDon = document.getElementById("tbody_Donhangganday");
  tbodyDon.innerHTML = "";
  var dsDonMoiNhat = dsDon.slice().reverse().slice(0, 5); // cho don moi naht len dau va chon 5 don
  if (dsDonMoiNhat.length === 0) {
    tbodyDon.innerHTML = '<tr><td colspan="4" style="text-align:center">Chưa có đơn hàng</td></tr>';
  } else {
    dsDonMoiNhat.forEach(function(don) {
      var trangThai = layTrangThaiDon(don);
      var lopCss;
      
      if (trangThai === TEN_TRANG_THAI.dagiao) lopCss = "DAXULY";
      else if (trangThai === TEN_TRANG_THAI.huy) lopCss = "DAHUY";
      else lopCss = "DANGXULY";

      
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + don.maDonHang + "</td>"
        + "<td>" + don.nguoiNhan + "</td>"
        + "<td>" + don.ngayDat + "</td>"
        + "<td><span class='TRANGTHAI " + lopCss + "'>" + trangThai + "</span></td>";
      tbodyDon.appendChild(tr);
    });
  }
}

capNhatTongQuan();






// =============== PHAN TRANG DON GIAN ===============
var SO_DONG = 5;   // moi trang hien 5 dong

// Goi ham nay SAU KHI da do du lieu vao tbody
function phanTrangBang(trang) {
  var cacDong = trang.querySelectorAll("tbody > tr");     // tat ca dong dang co
  var tongTrang = Math.ceil(cacDong.length / SO_DONG);
  if (tongTrang < 1) tongTrang = 1;

  // nho trang hien tai ngay tren phan tu trang (mac dinh la 1)
  var trangNay = Number(trang.dataset.trang) || 1;
  if (trangNay > tongTrang) trangNay = tongTrang;
  trang.dataset.trang = trangNay;

  var batDau = (trangNay - 1) * SO_DONG;
  var ketThuc = batDau + SO_DONG;

  // dong nao nam trong [batDau, ketThuc) thi hien, con lai an
  for (var i = 0; i < cacDong.length; i++) {
    if (i >= batDau && i < ketThuc) {
      cacDong[i].style.display = "";
    } else {
      cacDong[i].style.display = "none";
    }
  }

  // dong thong tin
  var thongTin = trang.querySelector("#THONGTIN_TRANG");
  if (cacDong.length === 0) {
    thongTin.textContent = "Không có dữ liệu";
  } else {
    thongTin.textContent = "Hiển thị " + (batDau + 1) + "–"
      + Math.min(ketThuc, cacDong.length) + " trong " + cacDong.length;
  }

  // cac nut so trang
  var html = "";
  for (var s = 1; s <= tongTrang; s++) {
    var lop = (s === trangNay) ? "SO_TRANG DANG_CHON" : "SO_TRANG";
    html += '<button class="' + lop + '">' + s + "</button>";
  }
  trang.querySelector("#DANHSACH_TRANG").innerHTML = html;

  trang.querySelector("#TRANG_TRUOC").disabled = (trangNay === 1);
  trang.querySelector("#TRANG_SAU").disabled = (trangNay === tongTrang);
}

// Gan su kien cho cac trang co phan trang (trang 1 den 7), chi chay 1 lan
for (var t = 1; t < cacTrang.length; t++) {
  ganSuKienPhanTrang(cacTrang[t]);
}

function ganSuKienPhanTrang(trang) {
  // bam nut truoc / sau / so trang
  trang.addEventListener("click", function (e) {
    var nut = e.target;
    var trangNay = Number(trang.dataset.trang) || 1;

    if (nut.id === "TRANG_TRUOC") {
      trang.dataset.trang = trangNay - 1;
    } else if (nut.id === "TRANG_SAU") {
      trang.dataset.trang = trangNay + 1;
    } else if (nut.classList.contains("SO_TRANG")) {
      trang.dataset.trang = Number(nut.textContent);
    } else {
      return;
    }
    phanTrangBang(trang);
  });

  // go tim kiem hoac doi o loc -> quay ve trang 1
  // (true = chay TRUOC ham ve bang cu)
  trang.addEventListener("input", function () { trang.dataset.trang = 1; }, true);
  trang.addEventListener("change", function () { trang.dataset.trang = 1; }, true);
}