function updateCustomerHeader() {
  const current = layCurrent();
  const isCustomer = Boolean(current && current.role === "customer");

  document.querySelector(".auth").hidden = isCustomer;
  document.querySelector(".cart-control").hidden = !isCustomer;
}

updateCustomerHeader();
window.addEventListener("storage", (event) => {
  if (event.key === KEY_CURRENT) updateCustomerHeader();
});
window.addEventListener("authchange", updateCustomerHeader);

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
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
