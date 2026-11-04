// ===== CHECKOUT.JS - Xử lý thanh toán trực tiếp trên trang =====

document.addEventListener("DOMContentLoaded", () => {
  const checkoutPanel = document.getElementById("checkoutPanel");
  const overlay = document.getElementById("overlay");
  const btnOpenCheckout = document.getElementById("btnOpenCheckout");

  // 1. Xử lý mở panel thanh toán khi bấm nút "Thanh toán" trong giỏ hàng
  if (btnOpenCheckout) {
    btnOpenCheckout.addEventListener("click", () => {
      const gioHang = typeof layGioHang === "function" ? layGioHang() : [];
      if (gioHang.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
      }

      // Đóng panel giỏ hàng lại
      const cartDetails = document.querySelector(".cart-control");
      if (cartDetails) cartDetails.open = false;

      // Lấy thông tin user hiện tại
      const current = typeof layCurrent === "function" ? layCurrent() : null;
      if (!current || current.role !== "customer") {
        alert("Vui lòng đăng nhập tài khoản khách hàng để thanh toán!");
        return;
      }

      const users = typeof layUsers === "function" ? layUsers() : [];
      const userAcc =
        users.find((u) => u.username === current.username) || current;

      // Hiển thị địa chỉ mặc định trong tài khoản
      const accAddrText = document.getElementById("accAddrTextInline");
      const savedAddr =
        userAcc.diaChi ||
        "Chưa có địa chỉ trong tài khoản (Vui lòng cập nhật trong mục Tài khoản hoặc nhập mới bên dưới)";
      if (accAddrText) {
        accAddrText.textContent = `Họ tên: ${userAcc.hoTen} | Địa chỉ: ${savedAddr}`;
      }

      // Chọn sẵn phương thức thanh toán mặc định từ tài khoản
      const savedPayment = userAcc.phuongThucThanhToan || "COD";
      const paymentRadio = document.querySelector(
        `input[name="paymentInline"][value="${savedPayment}"]`,
      );
      if (paymentRadio) {
        paymentRadio.checked = true;
      }

      // Tóm tắt sản phẩm trong giỏ hàng
      const summaryBox = document.getElementById("checkoutSummaryInline");
      let summaryHtml = "";
      let tongTien = 0;
      for (let i = 0; i < gioHang.length; i++) {
        const item = gioHang[i];
        tongTien += item.gia * item.soLuong;
        summaryHtml += `<div>• ${item.ten} (x${item.soLuong}) — <strong>${typeof dinhDangGia === "function" ? dinhDangGia(item.gia * item.soLuong) : item.gia * item.soLuong + " đ"}</strong></div>`;
      }
      if (summaryBox) {
        summaryBox.innerHTML = summaryHtml;
      }
      const totalInline = document.getElementById("checkoutTotalInline");
      if (totalInline) {
        totalInline.textContent =
          typeof dinhDangGia === "function"
            ? dinhDangGia(tongTien)
            : tongTien + " đ";
      }

      // Mở panel thanh toán và hiện overlay
      if (checkoutPanel && overlay) {
        checkoutPanel.classList.add("open");
        checkoutPanel.setAttribute("aria-hidden", "false");
        overlay.classList.add("show");
      }
    });
  }

  // 2. Xử lý ĐÓNG panel khi bấm nút "X" (close) hoặc click vào overlay
  if (checkoutPanel) {
    const closeBtn = checkoutPanel.querySelector("[data-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        checkoutPanel.classList.remove("open");
        checkoutPanel.setAttribute("aria-hidden", "true");
        if (overlay) overlay.classList.remove("show");
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      if (checkoutPanel) {
        checkoutPanel.classList.remove("open");
        checkoutPanel.setAttribute("aria-hidden", "true");
      }
      overlay.classList.remove("show");
    });
  }

  // 3. Xử lý ẩn/hiện form nhập địa chỉ mới ngay trong panel thanh toán
  const radioAccAddr = document.getElementById("useAccAddrInline");
  const radioNewAddr = document.getElementById("useNewAddrInline");
  const newAddrBox = document.getElementById("newAddrBoxInline");

  if (radioAccAddr && radioNewAddr && newAddrBox) {
    radioAccAddr.addEventListener("change", () => {
      if (radioAccAddr.checked) newAddrBox.style.display = "none";
    });
    radioNewAddr.addEventListener("change", () => {
      if (radioNewAddr.checked) newAddrBox.style.display = "block";
    });
  }

  // 4. Xử lý submit xác nhận đặt hàng trực tiếp
  const checkoutFormInline = document.getElementById("checkoutFormInline");
  if (checkoutFormInline) {
    checkoutFormInline.addEventListener("submit", (e) => {
      e.preventDefault();
      const current = typeof layCurrent === "function" ? layCurrent() : null;
      if (!current) return;

      const users = typeof layUsers === "function" ? layUsers() : [];
      const userAcc =
        users.find((u) => u.username === current.username) || current;

      let giaoHangDiaChi = "";
      let nguoiNhan = userAcc.hoTen;
      let sdtNhan = userAcc.sdt || "0393912512";

      if (radioNewAddr && radioNewAddr.checked) {
        const rName = document.getElementById("newReceiverInline").value.trim();
        const rPhone = document.getElementById("newPhoneInline").value.trim();
        const rAddr = document.getElementById("newAddressInline").value.trim();
        if (!rName || !rPhone || !rAddr) {
          alert("Vui lòng nhập đầy đủ thông tin địa chỉ nhận hàng mới!");
          return;
        }
        nguoiNhan = rName;
        sdtNhan = rPhone;
        giaoHangDiaChi = rAddr;
      } else {
        if (!userAcc.diaChi) {
          alert(
            "Bạn chưa thiết lập địa chỉ trong tài khoản. Vui lòng chọn 'Nhập địa chỉ giao hàng mới' hoặc cập nhật trong cài đặt tài khoản!",
          );
          return;
        }
        giaoHangDiaChi = userAcc.diaChi;
      }

      const paymentMethodElement = document.querySelector(
        'input[name="paymentInline"]:checked',
      );
      const paymentMethod = paymentMethodElement
        ? paymentMethodElement.value
        : "COD";

      const gioHang = typeof layGioHang === "function" ? layGioHang() : [];
      let tongTien = 0;
      for (let i = 0; i < gioHang.length; i++) {
        tongTien += gioHang[i].gia * gioHang[i].soLuong;
      }

      // Tạo đối tượng đơn hàng mới lưu vào localStorage
      const donHangMoi = {
        maDonHang: "DH" + Date.now(),
        username: current.username,
        nguoiNhan: nguoiNhan,
        dienThoai: sdtNhan,
        diaChi: giaoHangDiaChi,
        phuongThucThanhToan: paymentMethod,
        danhSachSanPham: gioHang,
        tongTien: tongTien,
        ngayDat: new Date().toLocaleString("vi-VN"),
        trangThai: "Chờ xử lý",
      };

      let dsDonHang = localStorage.getItem("danhSachDonHang");
      dsDonHang = dsDonHang ? JSON.parse(dsDonHang) : [];
      dsDonHang.push(donHangMoi);
      localStorage.setItem("danhSachDonHang", JSON.stringify(dsDonHang));

      // Xóa giỏ hàng hiện tại sau khi đặt thành công
      if (typeof layKeyGioHang === "function") {
        localStorage.removeItem(layKeyGioHang());
      }

      alert(
        "Đặt hàng thành công! Mã đơn hàng của bạn là: " + donHangMoi.maDonHang,
      );

      // Đóng panel thanh toán và ẩn overlay
      if (checkoutPanel && overlay) {
        checkoutPanel.classList.remove("open");
        checkoutPanel.setAttribute("aria-hidden", "true");
        overlay.classList.remove("show");
      }

      // Cập nhật lại giao diện giỏ hàng trống
      // Xóa giỏ hàng hiện tại sau khi đặt thành công
      if (typeof luuGioHang === "function") {
        luuGioHang([]); // lưu giỏ rỗng và tự gọi capNhatSoLuongGioHang() => badge về 0
      }
    });
  }
});
