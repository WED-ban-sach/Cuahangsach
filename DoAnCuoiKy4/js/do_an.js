/* ===== ĐĂNG NHẬP / ĐĂNG KÝ ===== */
const overlay = document.getElementById("overlay");
const panels = {
  login: document.getElementById("loginPanel"),
  register: document.getElementById("registerPanel"),
  profile: document.getElementById("profilePanel"),
  orders: document.getElementById("ordersPanel"),
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
//Ô tìm kiếm trên header: ở trang sản phẩm thì tìm luôn, ở trang khác thì chuyển sang trang sản phẩm
function xuLyTimKiem() {
  const tuKhoa = document.getElementById("oTimKiem").value.trim();
  // kiểm tra có phải hàm kh, đúng thì tìm, sai thì chuyển về trang sản phẩm
  if (typeof timCoBan === "function") {
    timCoBan(tuKhoa);
  } else {
    window.location.href = "sanpham.html?q=" + encodeURIComponent(tuKhoa);
  }
}
document.getElementById("nutTimKiem").addEventListener("click", xuLyTimKiem);
document.getElementById("oTimKiem").addEventListener("keydown", (e) => {
  if (e.key === "Enter") xuLyTimKiem();
});
// tạm thời chặn submit để không bị load lại trang
document
  .getElementById("loginForm")
  .addEventListener("submit", (e) => e.preventDefault());
document
  .getElementById("registerForm")
  .addEventListener("submit", (e) => e.preventDefault());
