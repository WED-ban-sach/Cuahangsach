// ===== ORDERS.JS - Lịch sử đơn hàng của khách hàng đang đăng nhập =====

const TEN_THANH_TOAN = {
  COD: "Tiền mặt khi nhận hàng",
  BankTransfer: "Chuyển khoản ngân hàng",
  Online: "Thanh toán trực tuyến",
};

function formatTien(n) {
  return typeof dinhDangGia === "function" ? dinhDangGia(n) : n + " đ";
}

// Vẽ danh sách đơn hàng của khách đang đăng nhập vào #ordersList
function hienThiLichSuDonHang() {
  const box = document.getElementById("ordersList");
  if (!box) return;

  const current = layCurrent();
  if (!current || current.role !== "customer") {
    box.innerHTML = `<p class="orders-empty">Vui lòng đăng nhập để xem đơn hàng.</p>`;
    return;
  }

  let all = [];
  try {
    all = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];
  } catch (e) {
    all = [];
  }

  // Chỉ lấy đơn của khách này; đơn mới nhất lên đầu
  const mine = all.filter((d) => d.username === current.username).reverse();

  if (mine.length === 0) {
    box.innerHTML = `<p class="orders-empty">Bạn chưa có đơn hàng nào.</p>`;
    return;
  }

  box.innerHTML = mine
    .map((d) => {
      const sanPham = (d.danhSachSanPham || [])
        .map(
          (sp) =>
            `<li>${sp.ten} (x${sp.soLuong}) — ${formatTien(sp.gia * sp.soLuong)}</li>`,
        )
        .join("");

      return `
        <details class="order-item">
          <summary>
            <strong>${d.maDonHang}</strong>
            <span>${d.ngayDat}</span>
            <span class="order-status">${d.trangThai}</span>
            <span class="order-total">${formatTien(d.tongTien)}</span>
          </summary>
          <div class="order-detail">
            <p><strong>Người nhận:</strong> ${d.nguoiNhan}${d.dienThoai ? " — " + d.dienThoai : ""}</p>
            <p><strong>Địa chỉ:</strong> ${d.diaChi}</p>
            <p><strong>Thanh toán:</strong> ${TEN_THANH_TOAN[d.phuongThucThanhToan] || d.phuongThucThanhToan}</p>
            <ul>${sanPham}</ul>
          </div>
        </details>`;
    })
    .join("");
}

// Mở panel: vẽ dữ liệu mới nhất rồi nhờ do_an.js mở panel
function moPanelDonHang() {
  hienThiLichSuDonHang();
  document.getElementById("userControl").open = false; // đóng menu tài khoản
  togglePanel("orders"); // hàm có sẵn trong do_an.js
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnOrderHistory");
  if (btn) btn.addEventListener("click", moPanelDonHang);
});
