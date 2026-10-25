function updateCustomerHeader() {
  const current = layCurrent();
  const isCustomer = Boolean(current && current.role === "customer");
  const account = isCustomer
    ? layUsers().find((user) => user.username === current.username && user.role === "customer")
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

updateCustomerHeader();
window.addEventListener("storage", (e) => {
  if (e.key === KEY_CURRENT) updateCustomerHeader();
});
window.addEventListener("authchange", updateCustomerHeader);
window.addEventListener("pageshow", updateCustomerHeader);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("userControl").open = false;
  }
});
document.addEventListener("click", (e) => {
  const userControl = document.getElementById("userControl");
  if (!userControl.contains(e.target)) userControl.open = false;
});

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
  document.getElementById("profile-password").value = "";
  document.getElementById("profileMessage").textContent = "";
  document.getElementById("userControl").open = false;
  togglePanel("profile");
});

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
        candidate.username &&
        candidate.username.toLowerCase() === username.toLowerCase(),
    );

    if (!user || user.password !== password || user.role !== "customer" || user.locked) {
      message.textContent = "Thông tin đăng nhập không hợp lệ.";
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
  document.getElementById("btnLogin").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
  document.getElementById("btnRegister").addEventListener("click", () => {
    window.location.href = "doan.html";
  });
}
