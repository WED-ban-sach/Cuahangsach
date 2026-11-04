// Cập nhật nút đăng nhập, giỏ hàng và thông tin tài khoản theo trạng thái khách hàng.
function updateCustomerHeader() {
  const current = layCurrent();
  const isCustomer = Boolean(current && current.role === "customer");
  const account = isCustomer
    ? layUsers().find(
        (user) =>
          user.username === current.username && user.role === "customer",
      )
    : null;

  document.querySelector(".auth").hidden = isCustomer;
  document.querySelector(".cart-control").hidden = !isCustomer;
  document.getElementById("userControl").hidden = !isCustomer;

  if (isCustomer) {
    document.getElementById("userFullName").textContent =
      (account && account.hoTen) || current.hoTen || "";
    document.getElementById("userName").textContent = current.username || "";
    document.getElementById("userEmail").textContent =
      (account && account.email) || current.email || "";
  } else {
    document.getElementById("userControl").open = false;
  }
}

// Làm mới giao diện khi trạng thái đăng nhập thay đổi hoặc trang được mở lại.
updateCustomerHeader();
window.addEventListener("storage", (e) => {
  if (e.key === KEY_CURRENT) updateCustomerHeader();
});
window.addEventListener("authchange", updateCustomerHeader);
window.addEventListener("pageshow", updateCustomerHeader);

// Đóng menu tài khoản khi nhấn Escape hoặc bấm ra ngoài menu.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("userControl").open = false;
  }
});
document.addEventListener("click", (e) => {
  const userControl = document.getElementById("userControl");
  if (!userControl.contains(e.target)) userControl.open = false;
});

// Mở biểu mẫu chỉnh sửa với thông tin hiện tại của khách hàng.
document.getElementById("btnEditProfile").addEventListener("click", () => {
  const current = layCurrent();
  if (!current || current.role !== "customer") return;
  const account = layUsers().find(
    (user) => user.username === current.username && user.role === "customer",
  );

  document.getElementById("profile-username").value = current.username || "";
  document.getElementById("profile-name").value =
    (account && account.hoTen) || current.hoTen || "";
  document.getElementById("profile-email").value =
    (account && account.email) || current.email || "";
  document.getElementById("profile-diaChi").value =
    (account && account.diaChi) || current.diaChi || "";
  document.getElementById("profile-password").value = "";
  document.getElementById("profileMessage").textContent = "";
  document.getElementById("userControl").open = false;
  togglePanel("profile");
});

// Lưu thông tin hồ sơ khách hàng và cập nhật trạng thái đăng nhập.
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("profileMessage");
  const current = layCurrent();
  if (!current || current.role !== "customer") {
    message.textContent = "Vui lòng đăng nhập lại để sửa thông tin.";
    return;
  }

  const hoTen = document.getElementById("profile-name").value.trim();
  const email = document.getElementById("profile-email").value.trim();
  const diaChi = document.getElementById("profile-diachi").value.trim();
  const password = document.getElementById("profile-password").value;
  if (!hoTen || !email) {
    message.textContent = "Vui lòng nhập họ tên và email.";
    return;
  }

  try {
    const users = layUsers();
    const userIndex = users.findIndex(
      (user) => user.username === current.username && user.role === "customer",
    );
    if (userIndex < 0) {
      message.textContent = "Không tìm thấy tài khoản. Vui lòng đăng nhập lại.";
      return;
    }

    users[userIndex] = {
      ...users[userIndex],
      hoTen,
      email,
      diaChi,
      ...(password ? { password } : {}),
    };
    luuUsers(users);

    const updatedCurrent = { ...current, hoTen, email };
    luuCurrent(updatedCurrent);
    window.dispatchEvent(new Event("authchange"));
    closeAll();
  } catch (error) {
    console.error("Không thể lưu thông tin tài khoản.", error);
    message.textContent = "Không thể lưu thông tin. Vui lòng thử lại.";
  }
});

// Đăng xuất khách hàng và cập nhật lại giao diện.
document.getElementById("btnLogout").addEventListener("click", () => {
  try {
    luuCurrent(null);
  } catch (error) {
    console.error("Không thể đăng xuất.", error);
    return;
  }

  closeAll();
  window.dispatchEvent(new Event("authchange"));
});

// Kiểm tra thông tin đăng nhập khách hàng và lưu phiên đăng nhập.
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("loginMessage");
    message.textContent = "";

    const username = document.getElementById("login-user").value.trim();
    const password = document.getElementById("login-pass").value;
    const user = layUsers().find(
      (candidate) =>
        candidate &&
        typeof candidate.username === "string" &&
        candidate.username.toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      message.textContent =
        "Không tìm thấy tài khoản. Dữ liệu users có thể đã cũ.";
      return;
    }
    if (user.locked) {
      message.textContent =
        "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.";
      return;
    }
    if (user.password !== password) {
      message.textContent = "Sai mật khẩu.";
      return;
    }
    if (user.role !== "customer") {
      message.textContent =
        "Đây không phải tài khoản khách. Admin đăng nhập ở trang quản trị.";
      return;
    }

    try {
      luuCurrent({
        username: user.username,
        hoTen: user.hoTen,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Không thể lưu trạng thái đăng nhập.", error);
      message.textContent = "Không thể lưu trạng thái đăng nhập.";
      return;
    }

    loginForm.reset();
    document.getElementById("loginPanel").classList.remove("open");
    document.getElementById("loginPanel").setAttribute("aria-hidden", "true");
    document.getElementById("overlay").classList.remove("show");
    window.dispatchEvent(new Event("authchange"));
  });
} else {
  // Chuyển nút đăng nhập/đăng ký sang trang chủ nếu trang hiện tại không có biểu mẫu.
  document.getElementById("btnLogin").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
  document.getElementById("btnRegister").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
}

// Lấy id khách lớn nhất
function taoIdUser(users) {
  let max = 0;
  for (const user of users) {
    // "U001" - > "001"
    const so = Number(String(user.id).slice(1));
    if (so > max) max = so;
  }
  const soMoi = max + 1;
  // 13 -> "013" -> "U013"
  return "U" + String(soMoi).padStart(3, "0");
}
// Đăng ký tài khoản khách hàng
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("registerMessage");
    message.textContent = "";

    const hoTen = document.getElementById("hoten").value.trim();
    const username = document.getElementById("reg-user").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("reg-pass").value;

    if (!username || !hoTen || !email || !password) {
      message.textContent = "Vui lòng nhập đầy đủ thông tin.";
      return;
    }
    if (password.length < 6) {
      message.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      return;
    }
    const users = layUsers();
    const trungUsername = users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
    if (trungUsername) {
      message.textContent = "Tên đăng nhập đã tồn tại.";
      return;
    }
    const trungEmail = users.some(
      (user) => (user.email || "").toLowerCase() === email.toLowerCase(),
    );
    if (trungEmail) {
      message.textContent = "Email đã được sử dụng.";
      return;
    }
    const newUser = {
      id: taoIdUser(users),
      username,
      password,
      hoTen,
      email,
      role: "customer",
      diaChi: "",
      locked: false,
      createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    };
    try {
      luuUsers([...users, newUser]);
      luuCurrent({ username, hoTen, email, role: "customer" });
    } catch (error) {
      console.error("Không thể lưu tài khoản mới.", error);
      message.textContent = "Không thể đăng ký. Vui lòng thử lại.";
      return;
    }

    registerForm.reset();
    closeAll();
    document.getElementById("registerPanel").classList.remove("open");
    document
      .getElementById("registerPanel")
      .setAttribute("aria-hidden", "true");
    document.getElementById("overlay").classList.remove("show");
    window.dispatchEvent(new Event("authchange"));
  });
} else {
  // Chuyển nút đăng nhập/đăng ký sang trang chủ nếu trang hiện tại không có biểu mẫu.
  document.getElementById("btnLogin").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
  document.getElementById("btnRegister").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
}
//3 4
// ===== CART.JS - Quản lý giỏ hàng VNBook =====

// Lấy key giỏ hàng riêng theo tài khoản đăng nhập hiện tại để tránh nhầm lẫn giữa các user
function layKeyGioHang() {
  const current = layCurrent();
  if (!current || !current.username) return null;
  return "gioHang_" + current.username;
}

// Lấy danh sách sản phẩm trong giỏ hàng
function layGioHang() {
  const key = layKeyGioHang();
  if (!key) return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Lưu danh sách giỏ hàng
function luuGioHang(gioHang) {
  const key = layKeyGioHang();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(gioHang));
  capNhatSoLuongGioHang();
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng ở header
function capNhatSoLuongGioHang() {
  const gioHang = layGioHang();
  let tongSoLuong = 0;
  for (let i = 0; i < gioHang.length; i++) {
    tongSoLuong += gioHang[i].soLuong;
  }
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = tongSoLuong;
  }
}

// Thêm sản phẩm vào giỏ hàng (Gọi từ nút "Mua" ở trang sản phẩm hoặc chi tiết)
// Lấy số tồn của 1 sách. Nếu trang chưa nạp kho.js thì coi như không giới hạn.
function laySoTonKho(maSach) {
  return typeof laySoLuong === "function" ? laySoLuong(maSach) : Infinity;
}

function themVaoGioHang(maSach) {
  const current = layCurrent();
  if (!current || current.role !== "customer") {
    alert(
      "Vui lòng đăng nhập tài khoản khách hàng để sử dụng chức năng giỏ hàng!",
    );
    const loginPanel = document.getElementById("loginPanel");
    const overlay = document.getElementById("overlay");
    if (loginPanel && overlay) {
      loginPanel.classList.add("open");
      loginPanel.setAttribute("aria-hidden", "false");
      overlay.classList.add("show");
    }
    return;
  }

  const tatCaSach = typeof layDanhSach === "function" ? layDanhSach() : [];
  const sach = tatCaSach.find((s) => s.ma === maSach);
  if (!sach) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }

  let gioHang = layGioHang();
  let index = gioHang.findIndex((item) => item.ma === maSach);
  const soLuongTrongGio = index >= 0 ? gioHang[index].soLuong : 0;

  // ===== KIỂM TRA TỒN KHO =====
  const tonKho = laySoTonKho(maSach);
  if (tonKho <= 0) {
    alert('Sách "' + sach.ten + '" đã hết hàng!');
    return;
  }
  if (soLuongTrongGio + 1 > tonKho) {
    alert(
      "Kho chỉ còn " +
        tonKho +
        ' cuốn "' +
        sach.ten +
        '", bạn đã có ' +
        soLuongTrongGio +
        " cuốn trong giỏ!",
    );
    return;
  }
  // ===== HẾT KIỂM TRA =====

  if (index >= 0) {
    gioHang[index].soLuong += 1;
  } else {
    gioHang.push({
      ma: sach.ma,
      ten: sach.ten,
      gia: sach.gia,
      hinh: sach.hinh,
      soLuong: 1,
    });
  }

  luuGioHang(gioHang);
  hienThiGioHangPanel();
  alert("Đã thêm sách vào giỏ hàng thành công!");
}

// Thay đổi số lượng sản phẩm trong giỏ hàng (+1 hoặc -1)
function thayDoiSoLuong(maSach, delta) {
  let gioHang = layGioHang();
  let index = gioHang.findIndex((item) => item.ma === maSach);
  if (index < 0) return;

  // Chỉ kiểm tra khi tăng số lượng
  if (delta > 0) {
    const tonKho = laySoTonKho(maSach);
    if (gioHang[index].soLuong + delta > tonKho) {
      alert("Kho chỉ còn " + tonKho + " cuốn, không thể thêm nữa!");
      return;
    }
  }

  gioHang[index].soLuong += delta;
  if (gioHang[index].soLuong <= 0) {
    gioHang.splice(index, 1);
  }
  luuGioHang(gioHang);
  hienThiGioHangPanel();
}

// Hiển thị danh sách sản phẩm trong khung/panel giỏ hàng
function hienThiGioHangPanel() {
  const container = document.getElementById("cartItems");
  const totalContainer = document.getElementById("cartTotal");
  if (!container) return;

  const gioHang = layGioHang();
  if (gioHang.length === 0) {
    container.innerHTML = `<p class="cart-empty">Giỏ hàng của bạn đang trống.</p>`;
    if (totalContainer) totalContainer.textContent = "0 đ";
    return;
  }

  let html = "";
  let tongTien = 0;

  for (let i = 0; i < gioHang.length; i++) {
    const item = gioHang[i];
    const thanhTien = item.gia * item.soLuong;
    tongTien += thanhTien;

    html += `
      <div class="cart-item">
        <img src="${item.hinh || "../image/khong-co-anh.svg"}" alt="${item.ten}">
        <div class="cart-item-info">
          <p><strong>${item.ten}</strong></p>
          <p>${typeof dinhDangGia === "function" ? dinhDangGia(item.gia) : item.gia + " đ"}</p>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <button type="button" onclick="thayDoiSoLuong('${item.ma}', -1)" style="padding: 2px 6px;">-</button>
            <span>${item.soLuong}</span>
            <button type="button" onclick="thayDoiSoLuong('${item.ma}', 1)" style="padding: 2px 6px;">+</button>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  if (totalContainer) {
    totalContainer.textContent =
      typeof dinhDangGia === "function"
        ? dinhDangGia(tongTien)
        : tongTien + " đ";
  }
}

// Gắn sự kiện click tự động cho các nút "Mua" trên toàn trang
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("btn-mua")) {
    const maSach = e.target.dataset.ma;
    if (maSach) {
      themVaoGioHang(maSach);
    }
  }
});

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  capNhatSoLuongGioHang();
  hienThiGioHangPanel();
});
window.addEventListener("authchange", () => {
  capNhatSoLuongGioHang();
  hienThiGioHangPanel();
});
