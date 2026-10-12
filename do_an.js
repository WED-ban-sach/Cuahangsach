/* ===== ĐĂNG NHẬP / ĐĂNG KÝ ===== */
const overlay = document.getElementById("overlay");
const panels = {
  login: document.getElementById("loginPanel"),
  register: document.getElementById("registerPanel"),
};

function closeAll() {
  Object.values(panels).forEach((p) => {
    p.classList.remove("open");
    p.setAttribute("aria-hidden", "true");
  });
  overlay.classList.remove("show");
}

function togglePanel(name) {
  const target = panels[name];
  const isOpen = target.classList.contains("open");
  closeAll();
  if (!isOpen) {
    target.classList.add("open");
    target.setAttribute("aria-hidden", "false");
    overlay.classList.add("show");
  }
}

document
  .getElementById("btnLogin")
  .addEventListener("click", () => togglePanel("login"));
document
  .getElementById("btnRegister")
  .addEventListener("click", () => togglePanel("register"));

// nút đóng (×)
document
  .querySelectorAll("[data-close]")
  .forEach((b) => b.addEventListener("click", closeAll));

// chuyển qua lại giữa 2 form
document.querySelectorAll("[data-switch]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    closeAll();
    togglePanel(a.dataset.switch);
  });
});

// bấm nền tối hoặc nhấn Esc để đóng
overlay.addEventListener("click", closeAll);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

// tạm thời chặn submit để không bị load lại trang
document
  .getElementById("loginForm")
  .addEventListener("submit", (e) => e.preventDefault());
document
  .getElementById("registerForm")
  .addEventListener("submit", (e) => e.preventDefault());
