const KEY_USERS = "users";
const KEY_CURRENT = "currentUser";

// Nạp tài khoản mẫu vào localStorage khi chưa có danh sách tài khoản.
function seedUsers() {
  const users = layUsers();
  if (users.length > 0) return users;

  luuUsers(SEED_USERS);
  return SEED_USERS;
}

// Đọc danh sách tài khoản đã lưu trong localStorage.
function layUsers() {
  const raw = localStorage.getItem(KEY_USERS);
  if (raw === null) return [];

  try {
    const users = JSON.parse(raw);
    if (!Array.isArray(users)) throw new TypeError("Dữ liệu users phải là một mảng.");
    return users;
  } catch (error) {
    console.error("Không thể đọc danh sách tài khoản trong localStorage.", error);
    return [];
  }
}

// Lưu danh sách tài khoản vào localStorage.
function luuUsers(users) {
  if (!Array.isArray(users)) throw new TypeError("Danh sách tài khoản phải là một mảng.");
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

// Đọc thông tin tài khoản đang đăng nhập.
function layCurrent() {
  const raw = localStorage.getItem(KEY_CURRENT);
  if (raw === null) return null;

  try {
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch (error) {
    console.error("Không thể đọc tài khoản hiện đang đăng nhập.", error);
    return null;
  }
}

// Lưu hoặc xóa thông tin tài khoản đang đăng nhập.
function luuCurrent(user) {
  if (user) localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
  else localStorage.removeItem(KEY_CURRENT);
}


// Khởi tạo dữ liệu mẫu trước khi dùng các chức năng xác thực.
seedUsers();

// Chuyển giữa màn hình đăng nhập và giao diện quản trị.
function showAdminView(id) {
  ["view-login", "view-admin"].forEach((viewId) => {
    const view = document.getElementById(viewId);
    if (view) view.classList.toggle("active", viewId === id);
  });
}

// Thiết lập đăng nhập, đăng xuất và các thao tác phụ cho trang quản trị.
function initAdminAuthentication() {
  const form = document.getElementById("formAdminLogin");
  if (!form) return;

  const current = layCurrent();
  showAdminView(current && current.role === "admin" ? "view-admin" : "view-login");

  const eyeButton = document.getElementById("btnMat");
  if (eyeButton) {
    eyeButton.addEventListener("click", () => {
      const input = document.getElementById("adminPass");
      input.type = input.type === "password" ? "text" : "password";
      eyeButton.textContent = input.type === "password" ? "👁" : "🙈";
    });
  }

  const forgotPassword = document.getElementById("quenMk");
  if (forgotPassword) {
    forgotPassword.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Demo: dùng admin / admin123");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value;
    const usernameError = document.getElementById("loiUser");
    const passwordError = document.getElementById("loiPass");
    const message = document.getElementById("thongBao");

    usernameError.textContent = "";
    passwordError.textContent = "";
    message.textContent = "";
    message.className = "thong-bao";

    if (!username) {
      usernameError.textContent = "Nhập tên đăng nhập";
      return;
    }
    if (!password) {
      passwordError.textContent = "Nhập mật khẩu";
      return;
    }

    const user = layUsers().find(
      (candidate) =>
        candidate &&
        typeof candidate.username === "string" &&
        candidate.username.toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      message.textContent = "Tài khoản không tồn tại";
      message.className = "thong-bao err";
      return;
    }
    if (user.locked) {
      message.textContent = "Tài khoản bị khóa";
      message.className = "thong-bao err";
      return;
    }
    if (user.password !== password) {
      message.textContent = "Sai mật khẩu";
      message.className = "thong-bao err";
      return;
    }
    if (user.role !== "admin") {
      message.textContent = "Tài khoản khách, không có quyền admin. Dùng admin/admin123";
      message.className = "thong-bao err";
      return;
    }

    try {
      luuCurrent({ username: user.username, hoTen: user.hoTen, role: user.role });
    } catch (error) {
      console.error("Không thể lưu trạng thái đăng nhập admin.", error);
      message.textContent = "Không thể lưu trạng thái đăng nhập.";
      message.className = "thong-bao err";
      return;
    }

    message.textContent = "Đăng nhập thành công!";
    message.className = "thong-bao ok";
    setTimeout(() => location.reload(), 500);
  });

  const logoutButton = document.getElementById("btnDangXuat") ||
    document.querySelector(".DANGXUAT");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      try {
        luuCurrent(null);
      } catch (error) {
        console.error("Không thể đăng xuất admin.", error);
        return;
      }
      location.reload();
    });
  }
}

// Gắn các sự kiện xác thực sau khi cấu trúc trang đã được tải.
document.addEventListener("DOMContentLoaded", initAdminAuthentication);
