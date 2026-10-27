    function layDsNguoiDung() {
        var chuoi = localStorage.getItem("users");

        if ( chuoi === null ) {
            var dsUser = SEED_USERS.slice();
            localStorage.setItem("users", JSON.stringify(dsUser));

            return dsUser;
        }

        return JSON.parse(chuoi);
    }


    function luuDsNguoiDung() {
        localStorage.setItem("users", JSON.stringify(danhSachNguoiDung));
    }


    var danhSachNguoiDung = layDsNguoiDung();
    var oTimKiemNguoiDung = document.getElementById("QLY_NGUOIDUNG_INPUT_TIMKIEM");
    var locTrangThai = document.getElementById("QLY_NGUOIDUNG_TRANGTHAI");

    oTimKiemNguoiDung.addEventListener("input", function() {
        hienThiDanhSachNguoiDung();
    })

    locTrangThai.addEventListener("change", function() {
        hienThiDanhSachNguoiDung();
    })


    function hienThiDanhSachNguoiDung() {
        var tbody = document.getElementById("QLY_NGUOIDUNG_BODY");

        tbody.innerHTML = "";

        var tuKhoa = oTimKiemNguoiDung  .value.trim().toLowerCase();
        var trangThaiLoc = locTrangThai.value;

        var danhSachLoc = danhSachNguoiDung.filter( function(user) {

            if ( user.role === "admin") {
                return false;
            }
            
            var tenTim = user.hoTen.toLowerCase().includes(tuKhoa);
            var trangThaiTim = trangThaiLoc === "all" || user.locked == (trangThaiLoc === "locked");
            var idTim = user.id.toLowerCase().includes(tuKhoa);


            return (tenTim || idTim) && trangThaiTim;
        })


        for ( let i = 0 ; i < danhSachLoc.length; i++ ) {
            let user = danhSachLoc[i];

            var tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.hoTen}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <span class = "TRANGTHAI ${user.locked ? "BIKHOA" : "HOATDONG"}"> 
                        ${user.locked ? "Đã khóa" : "Hoạt động"}
                    </span>
                </td>

                <td>
                    <div class="THAOTAC">
                        <button class="BTN_KHOA">Khóa</button>
                        <button class="BTN_MOKHOA">Mở khóa</button>
                        <button class="BTN_RESETMK">Reset MK</button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);

            var btn_khoa = tr.querySelector(".BTN_KHOA");
            btn_khoa.addEventListener("click", function() {
                user.locked = true;
                luuDsNguoiDung();
                hienThiDanhSachNguoiDung();
            } )


            var btn_moKhoa = tr.querySelector(".BTN_MOKHOA");
            btn_moKhoa.addEventListener("click", function() {
                user.locked = false;
                luuDsNguoiDung();
                hienThiDanhSachNguoiDung();
            })


            var btn_resetmk = tr.querySelector(".BTN_RESETMK");
            btn_resetmk.addEventListener("click", function() {
                userCanReset = user;
                qly_nguoidung_resetmk.style.display = "flex";


            })
        }
    }


    var qly_nguoidung_resetmk = document.getElementById("QLY_NGUOIDUNG_RESETMK");
    var resetmk_huy = qly_nguoidung_resetmk.querySelector(".ND_HUY");
    var resetmk_dongy = qly_nguoidung_resetmk.querySelector(".ND_DONGY");

    var userCanReset = null;

    resetmk_huy.addEventListener("click", function() {
        qly_nguoidung_resetmk.style.display = "none";

        userCanReset = null;
    })


    resetmk_dongy.addEventListener("click", function() {
        if (userCanReset === null) {
            return;
        }

        userCanReset.password = "123456";

        luuDsNguoiDung();
        hienThiDanhSachNguoiDung();

        qly_nguoidung_resetmk.style.display = "none";
        userCanReset = null;
        hienThongBaoThanhCong("Thành công !", "Đã reset mật khẩu về mặc định");

    })


    hienThiDanhSachNguoiDung();




