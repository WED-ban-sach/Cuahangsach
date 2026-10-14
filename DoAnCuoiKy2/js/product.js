/* Ghi chú cho nhóm:
 - Trang danh sách: index.html (?loai=<id thể loại> để mở sẵn một thể loại) | Trang chi tiết/mua sách: chitiet.html?ma=<mã sp> (js/chitiet.js)
 - layDanhSach() / luuDanhSach(ds): đọc/ghi danh sách sản phẩm (localStorage, khoá "dsSanPham")
 - hienThi(ds, trang): hiện danh sách ds bất kỳ có phân trang (Kiệt dùng cho kết quả tìm kiếm)
 - Trang khách (index.html): nút .btn-mua | Trang admin (admin.html): .btn-sua, .btn-xoa, nút thêm. Mỗi nút (data-id = mã sp); form thêm: #formThem trong dialog #hopThem
 - Tìm kiếm: #oTimKiem, #nutTim | Đăng nhập/Đăng ký/Giỏ hàng: #nutDangNhap, #nutDangKy, #nutGioHang */
const SO_SP_MOT_TRANG = 15, KHOA = 'dsSanPham', KHOA_MAU = 'dsSanPhamBanMau';
const TRANG_DANH_SACH = 'index.html', TRANG_CHI_TIET = 'chitiet.html'; // đổi ở đây nếu nhóm đổi tên file
const LA_ADMIN = document.body.dataset.vaiTro === 'admin'; // admin.html có data-vai-tro="admin"
let loaiDangChon = 'all', dsDangXem = [], trangHienTai = 1;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
const tenLoai = id => (THE_LOAI.find(l => l.id === id) || {}).ten || '';
const tien = n => Number(n).toLocaleString('vi-VN') + ' đ';

function layDanhSach() {
  try { const d = JSON.parse(localStorage.getItem(KHOA)); if (Array.isArray(d)) return d; } catch (e) {}
  luuDanhSach(DU_LIEU_MAU);
  return DU_LIEU_MAU.slice();
}
function luuDanhSach(ds) {
  try { localStorage.setItem(KHOA, JSON.stringify(ds)); return true; } catch (e) { return false; }
}

// Đồng bộ với data.js: data.js đổi thì danh sách tự cập nhật theo, sản phẩm thêm bằng nút Thêm vẫn được giữ
function dongBoDuLieuMau() {
  try {
    const mau = JSON.stringify(DU_LIEU_MAU), cu = localStorage.getItem(KHOA_MAU);
    const dsLuu = JSON.parse(localStorage.getItem(KHOA)) || [];
    if (cu === mau && Array.isArray(dsLuu) && dsLuu.length) return;
    const maCu = cu ? JSON.parse(cu).map(s => s.ma) : null, maMoi = DU_LIEU_MAU.map(s => s.ma);
    const them = maCu ? dsLuu.filter(s => !maCu.includes(s.ma) && !maMoi.includes(s.ma)) : [];
    luuDanhSach(DU_LIEU_MAU.concat(them));
    localStorage.setItem(KHOA_MAU, mau);
  } catch (e) { luuDanhSach(DU_LIEU_MAU); }
}

function biaSach(sp, nhanh) {
  const mau = (Math.max(0, THE_LOAI.findIndex(l => l.id === sp.loai)) * 47 + 205) % 360;
  const anh = sp.hinh ? `<img src="${esc(sp.hinh)}" alt="" onerror="this.remove()">` : '';
  const them = nhanh ? `<div class="xem-nhanh"><p>${sp.tacGia ? `<b>${esc(sp.tacGia)}</b><br>` : ''}${esc(sp.moTa || '')}</p><small>Nhấp để xem chi tiết</small></div>` : '';
  return `<div class="bia" style="background:hsl(${mau} 45% 38%)"><span>${esc(sp.ten)}</span>${anh}${them}</div>`;
}

function theSach(sp) {
  const ma = esc(sp.ma);
  const [mo, dong] = LA_ADMIN ? ['<div class="the-lien-ket">', '</div>']
    : [`<a class="the-lien-ket" href="${TRANG_CHI_TIET}?ma=${encodeURIComponent(sp.ma)}">`, '</a>'];
  return `<article class="the-sp" data-id="${ma}">
    ${mo}${biaSach(sp, !LA_ADMIN)}
    <h3>${esc(sp.ten)}</h3>
    <p class="loai">${esc(tenLoai(sp.loai))}</p>
    <p class="gia">${tien(sp.gia)}</p>${dong}
    <div class="nut-the">
      ${LA_ADMIN
        ? `<button class="nut btn-sua" data-id="${ma}">Sửa</button><button class="nut btn-xoa" data-id="${ma}">Xoá</button>`
        : `<button class="nut btn-mua" data-id="${ma}">Mua</button>`}
    </div></article>`;
}

function hienThi(ds, trang = 1) {
  dsDangXem = ds;
  const tong = Math.max(1, Math.ceil(ds.length / SO_SP_MOT_TRANG));
  trangHienTai = Math.min(Math.max(trang, 1), tong);
  const dau = (trangHienTai - 1) * SO_SP_MOT_TRANG;
  $('dsSanPham').innerHTML = ds.length ? ds.slice(dau, dau + SO_SP_MOT_TRANG).map(theSach).join('') : '<p class="trong">Chưa có sản phẩm nào.</p>';
  veNutTrang(tong);
}

function veNutTrang(tong) {
  if (tong <= 1) { $('phanTrang').innerHTML = ''; return; }
  let h = `<button class="nut" aria-label="Trang trước" data-t="${trangHienTai - 1}" ${trangHienTai === 1 ? 'disabled' : ''}>◀</button>`;
  for (let i = 1; i <= tong; i++) h += `<button class="nut ${i === trangHienTai ? 'chon' : ''}" data-t="${i}">${i}</button>`;
  h += `<button class="nut" aria-label="Trang sau" data-t="${trangHienTai + 1}" ${trangHienTai === tong ? 'disabled' : ''}>▶</button>`;
  $('phanTrang').innerHTML = h;
}

function veTheLoai() {
  if (!$('dsTheLoai')) return; // index.html không có phần danh mục
  $('dsTheLoai').innerHTML = [{id:'all', ten:'Tất cả sách', icon:'📚'}, ...THE_LOAI]
    .map(l => `<button class="tl ${l.id === loaiDangChon ? 'chon' : ''}" data-loai="${l.id}"><span>${l.icon}</span>${l.ten}</button>`).join('');
}

function chonLoai(id) {
  loaiDangChon = id;
  veTheLoai();
  $('tieuDe').textContent = id === 'all' ? 'Tất cả sách' : tenLoai(id);
  const ds = layDanhSach();
  hienThi(id === 'all' ? ds : ds.filter(s => s.loai === id), 1);
}

function themSanPham(sp) {
  const ds = layDanhSach();
  if (ds.some(s => s.ma.toLowerCase() === sp.ma.toLowerCase())) { alert('Mã sản phẩm đã tồn tại.'); return false; }
  ds.push(sp);
  if (!luuDanhSach(ds)) { alert('Không lưu được, hãy chọn ảnh nhỏ hơn.'); return false; }
  chonLoai(sp.loai);
  return true;
}

dongBoDuLieuMau();
if ($('dsSanPham')) { // trang danh sách (trang chi tiết không có các phần tử này)
if (LA_ADMIN) $('spLoai').innerHTML = THE_LOAI.map(l => `<option value="${l.id}">${l.ten}</option>`).join('');
$('dsTheLoai')?.addEventListener('click', e => { const b = e.target.closest('[data-loai]'); if (b) chonLoai(b.dataset.loai); });
$('phanTrang').addEventListener('click', e => {
  const b = e.target.closest('[data-t]');
  if (b && !b.disabled) { hienThi(dsDangXem, +b.dataset.t); $('tieuDe').scrollIntoView({behavior: 'smooth'}); }
});
if (LA_ADMIN) {
$('nutMoThem').onclick = () => $('hopThem').showModal();
$('nutHuy').onclick = () => $('hopThem').close();
$('formThem').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, file = f.spHinh.files[0];
  const luu = hinh => {
    const sp = {ma: f.spMa.value.trim(), ten: f.spTen.value.trim(), loai: f.spLoai.value, gia: +f.spGia.value, hinh, moTa: f.spMoTa.value.trim()};
    if (themSanPham(sp)) { f.reset(); $('hopThem').close(); }
  };
  if (file) { const r = new FileReader(); r.onload = () => luu(r.result); r.readAsDataURL(file); } else luu('');
});
}

const loaiUrl = new URLSearchParams(location.search).get('loai');
chonLoai(THE_LOAI.some(l => l.id === loaiUrl) ? loaiUrl : 'all');
}
