


function layDsSachLoai() {
    var chuoi = localStorage.getItem("danhSachLoai");

    if (chuoi === null) {
        var dsLoai;
        dsLoai = THE_LOAI.slice(); 

        for ( let i = 0 ; i < dsLoai.length; i++) {
            dsLoai[i].trangThai = "active";
        }

        localStorage.setItem("danhSachLoai", JSON.stringify(dsLoai));

        return dsLoai;
    }


    return JSON.parse(chuoi);
}

function luuDsSachLoai() {
    localStorage.setItem("danhSachLoai", JSON.stringify(danhSachLoai));
}


var danhSachLoai = layDsSachLoai();




var xacNhanXoa = document.getElementById("XACNHAN_XOA");
var xacNhanXoa_huy = xacNhanXoa.querySelector(".ND_HUY");
var xacNhanXoa_dongY = xacNhanXoa.querySelector(".ND_DONGY");


function hienThongBaoXacNhan(tieuDe, noiDung) {
    xacNhanXoa.querySelector("h3").textContent = tieuDe;
    xacNhanXoa.querySelector("p").textContent = noiDung;

    xacNhanXoa.style.display = "flex";
}

xacNhanXoa_huy.addEventListener("click", function() {
    xacNhanXoa.style.display = "none";
})

xacNhanXoa_dongY.addEventListener("click", function() {
    
    danhSachLoai.splice(viTriXoa, 1);
    hienThiDanhSachLoai();
    luuDsSachLoai();

    xacNhanXoa.style.display = "none";
    hienThongBaoThanhCong("Thành công ! ", "Xóa loại sản phẩm thành công!");


})


var thongBao = document.getElementById("QLY_NGUOIDUNG_XACNHANTHANHCONG");
var thongBao_nutDong = thongBao.querySelector(".ND_DONGY");

thongBao_nutDong.addEventListener("click", function() {
    thongBao.style.display = "none";
})


function hienThongBao(tieuDe, noiDung) {
    thongBao.querySelector("h3").textContent = tieuDe;
    thongBao.querySelector("p").textContent = noiDung;

    thongBao.style.display = "flex";
}



// ----------------------------------------------

var viTriXoa = -1;
//--TIM KIEM
var oTimKiemLoai = document.querySelector("#QLY_LOAISP_INPUT_TIMKIEM");
var locTrangThaiLoai = document.querySelector("#QLY_LOAISP_TRANGTHAI");

oTimKiemLoai.addEventListener("input", function() {

    hienThiDanhSachLoai();

});


locTrangThaiLoai.addEventListener("input", function() {

    hienThiDanhSachLoai();

});


function hienThiDanhSachLoai() {
    var tbody = document.getElementById("LOAISP_BODY");
    tbody.innerHTML = "";

    var tuKhoa = oTimKiemLoai.value.trim().toLowerCase();
    var trangThaiLoc = locTrangThaiLoai.value;

    var danhSachLoc = danhSachLoai.filter(function(sachTim) {
        var tenTim = sachTim.ten.toLowerCase().includes(tuKhoa);
        var idTim = sachTim.id.toLowerCase().includes(tuKhoa);


        var trangThaiTim = ( trangThaiLoc === "all" || sachTim.trangThai === trangThaiLoc )

        return (tenTim || idTim) && trangThaiTim;
    } )
 

    for ( let i = 0 ; i < danhSachLoc.length; i++) {
        let loai = danhSachLoc[i];
        var soSach = 0;
        let viTriGoc = danhSachLoai.indexOf(loai);


        var dsSach = layDsSach();

        for (let j = 0; j < dsSach.length; j++) {
            if (dsSach[j].loai === loai.id) {
                soSach++;
            }
        }

        var tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${loai.id}</td>
            <td>${loai.ten}</td>
            <td>${soSach}</td>
            <td>
                <span class = "TRANGTHAI ${loai.trangThai === "active" ? "HOATDONG" : "BIKHOA"}">

                    ${loai.trangThai === "active" ? "Hoạt động" : "Ẩn"}

                </span>

            </td>

            <td>
                <div class="THAOTAC">

                    <button class="BTN_SUA_LOAI">
                        Sửa
                    </button>

                    <button class="BTN_AN_LOAI">
                        Ẩn
                    </button>

                    <button class="BTN_HIEN_LOAI">
                        Hiện
                    </button>

                    <button class="BTN_XOA_LOAI">
                        Xóa
                    </button>

                </div>
            </td>
        `;

        tbody.appendChild(tr);



        var btn_an = tr.querySelector(".BTN_AN_LOAI");
        btn_an.addEventListener("click", function() {
            danhSachLoai[viTriGoc].trangThai = "locked";
            luuDsSachLoai();
            hienThiDanhSachLoai();
        })


        var btn_hien = tr.querySelector(".BTN_HIEN_LOAI");
        btn_hien.addEventListener("click", function() {
            danhSachLoai[viTriGoc].trangThai = "active";
            luuDsSachLoai();
            hienThiDanhSachLoai();
        })


        var btn_xoa = tr.querySelector(".BTN_XOA_LOAI");
        btn_xoa.addEventListener("click", function() {
            viTriXoa = viTriGoc;
            hienThongBaoXacNhan("XÓA LOẠI SẢN PHẨM", "Bạn có chắc chắc muốn xóa?");
            
        })


        // ------------------SỬA-----------------
        var btn_sua_loai = tr.querySelector(".BTN_SUA_LOAI");
        btn_sua_loai.addEventListener("click", function() {
                viTriSua = viTriGoc;
                var sua_tieu_de = document.getElementById("SUA_TIEUDE");
                var sua_cac_truong = document.getElementById("SUA_CAC_TRUONG");

                sua_tieu_de.textContent = "SỬA LOẠI SẢN PHẨM";
                sua_cac_truong.innerHTML = "";
                
                sua_cac_truong.innerHTML += `
                    <div class="THEM_LOAI_TRUONG">
                        <label>Mã loại sản phẩm</label>
                        <input type="text" id="SUA_MA" value="${loai.id}">
                    </div>
                `;


                sua_cac_truong.innerHTML += `
                    <div class="THEM_LOAI_TRUONG">
                        <label>Tên loại sản phẩm</label>
                        <input type="text" id="SUA_TEN" value="${loai.ten}">
                    </div>`

                sua_chung.style.display  = "flex";

            })

        var btn_them_loai = document.querySelector("#QLY_LOAISP  .BTN_THEM_LOAI");
        btn_them_loai.addEventListener("click", function() {

            qly_loaisp_them_loai.style.display = "flex";

        })
    }
}


// -- SỬA
var sua_chung = document.getElementById("QLY_SUA_CHUNG");

var qly_loaisp_sua_huy = sua_chung.querySelector(".ND_HUY");
var qly_loaisp_sua_dongY = sua_chung.querySelector(".ND_DONGY");

var viTriSua = -1;

    qly_loaisp_sua_huy.addEventListener("click", function() {
        sua_chung.style.display = "none";
    })

    qly_loaisp_sua_dongY.addEventListener("click", function() {

        var maMoi = document.getElementById("SUA_MA").value.trim();
        var tenMoi = document.getElementById("SUA_TEN").value.trim();

        danhSachLoai[viTriSua].id = maMoi;
        danhSachLoai[viTriSua].ten = tenMoi;

        luuDsSachLoai();
        hienThiDanhSachLoai();

        sua_chung.style.display = "none";
        hienThongBaoThanhCong("Thành công ! ", "Sửa loại sách thành công!");

    })



// -- THÊM
var qly_loaisp_them_loai = document.getElementById("QLY_LOAISP_THEM_LOAI");

var qly_loaisp_them_loai_huy = qly_loaisp_them_loai.querySelector(".ND_HUY")
var qly_loaisp_them_loai_dongy = qly_loaisp_them_loai.querySelector(".ND_DONGY");






qly_loaisp_them_loai_huy.addEventListener("click", function() {
    qly_loaisp_them_loai.style.display = "none";
})


qly_loaisp_them_loai_dongy.addEventListener("click", function() {

    var ma_loai_moi = document.getElementById("MA_LOAI_MOI").value.trim();
    var ten_loai_moi = document.getElementById("TEN_LOAI_MOI").value.trim();

    if ( ma_loai_moi == "" || ten_loai_moi == "") {
        hienThongBao("Lỗi ! ", "Vui lòng nhập đầy đủ thông tin!");
        return;
    }


    var tonTaiMa = danhSachLoai.find(function(tonTai) {
        return tonTai.id === ma_loai_moi;
    })

    if ( tonTaiMa !== undefined) {
        hienThongBao("Lỗi ! ", "Mã loại đã tồn tại!");
        return;
    }


    var tonTaiTen = danhSachLoai.find(function(tonTai) {
        return tonTai.ten.toLowerCase() === ten_loai_moi.toLowerCase();
    })

    if (tonTaiTen !== undefined) {
        hienThongBao("Lỗi ! ", "Tên loại sản phẩm đã tồn tại!");
        return;
    }


    var loaiMoi = {

        id: ma_loai_moi,

        ten: ten_loai_moi,

        trangThai: "active"

    };


    danhSachLoai.push(loaiMoi);
    luuDsSachLoai();
    hienThiDanhSachLoai();


    qly_loaisp_them_loai.style.display = "none";


    // xoa dlieu cu
    document.getElementById("MA_LOAI_MOI").value = "";
    document.getElementById("TEN_LOAI_MOI").value = "";
    
    hienThongBaoThanhCong("Thành công ! ", "Thêm loại sản phẩm thành công!");

})



hienThiDanhSachLoai();





















