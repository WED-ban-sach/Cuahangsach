// js/admin.js - điều khiển duy nhất file admin.html (gộp login + register + quản trị)
// Phụ thuộc js/auth.js (phải nạp trước) để có esc(), layUsers(), layCurrent()...
// Toàn bộ chạy file:// - không dùng fetch, chỉ localStorage

document.addEventListener('DOMContentLoaded', function() {

  // ---- 1. Tham chiếu 3 view trong admin.html ----
  var vLogin = document.getElementById('view-login');     // form đăng nhập
  var vReg   = document.getElementById('view-register');  // form đăng ký
  var vAdmin = document.getElementById('view-admin');     // layout quản trị (hiện sau khi đăng nhập)

  // showView: ẩn hết 3 view rồi hiện đúng 1 view theo id
  // Dùng class active (display:block) đã định nghĩa trong css/admin-auth.css
  function showView(id) {
    [vLogin, vReg, vAdmin].forEach(function(v) { v.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
  }

  // ---- 2. Quyết định view ban đầu khi mở file ----
  var cur = layCurrent(); // đọc từ localStorage key currentUser (auth.js)
  if (cur && cur.role === 'admin') {
    showView('view-admin'); // đã đăng nhập admin -> vào thẳng quản trị
  } else {
    showView('view-login'); // chưa đăng nhập -> bắt đăng nhập
  }
  // Hiện tên admin lên sidebar
  if (cur) {
    var el = document.getElementById('tenAdmin');
    if (el) el.textContent = cur.hoTen || cur.username;
  }

  // ---- 3. Chuyển qua lại login <-> register (vẫn là 1 file html, không nhảy trang) ----
  var linkToReg = document.getElementById('linkToReg');
  if (linkToReg) linkToReg.addEventListener('click', function(e) { e.preventDefault(); showView('view-register'); });

  var linkToLogin = document.getElementById('linkToLogin');
  if (linkToLogin) linkToLogin.addEventListener('click', function(e) { e.preventDefault(); showView('view-login'); });

  // ---- 4. Nút mắt hiện/ẩn mật khẩu ----
  var btnMat = document.getElementById('btnMat');
  if (btnMat) btnMat.addEventListener('click', function() {
    var inp = document.getElementById('adminPass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
    this.textContent = inp.type === 'password' ? '👁' : '🙈';
  });

  var btnMatReg = document.getElementById('btnMatReg');
  if (btnMatReg) btnMatReg.addEventListener('click', function() {
    var inp = document.getElementById('regPass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
    this.textContent = inp.type === 'password' ? '👁' : '🙈';
  });

  // Quên mật khẩu - demo alert
  var quenMk = document.getElementById('quenMk');
  if (quenMk) quenMk.addEventListener('click', function(e) { e.preventDefault(); alert('Demo: dùng admin / admin123'); });

  // ---- 5. Xử lý ĐĂNG NHẬP admin ----
  var formLogin = document.getElementById('formAdminLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault(); // chặn reload mặc định của form

      var u  = document.getElementById('adminUser').value.trim(); // trim bỏ khoảng trắng đầu/cuối
      var p  = document.getElementById('adminPass').value;        // mật khẩu giữ nguyên
      var loiU = document.getElementById('loiUser');
      var loiP = document.getElementById('loiPass');
      var tb   = document.getElementById('thongBao');

      // Xóa lỗi cũ
      loiU.textContent = ''; loiP.textContent = '';
      tb.textContent = ''; tb.className = 'thong-bao';

      // Validate rỗng
      if (!u) { loiU.textContent = 'Nhập tên đăng nhập'; return; }
      if (!p) { loiP.textContent = 'Nhập mật khẩu'; return; }

      // Tìm user không phân biệt hoa thường (AUDIT finding 5)
      var found = layUsers().find(function(x) { return x.username.toLowerCase() === u.toLowerCase(); });

      if (!found) { tb.textContent = 'Tài khoản không tồn tại'; tb.className = 'thong-bao err'; return; }
      if (found.locked) { tb.textContent = 'Tài khoản bị khóa'; tb.className = 'thong-bao err'; return; }
      if (found.password !== p) { tb.textContent = 'Sai mật khẩu'; tb.className = 'thong-bao err'; return; }
      if (found.role !== 'admin') { tb.textContent = 'Tài khoản khách, không có quyền admin. Dùng admin/admin123'; tb.className = 'thong-bao err'; return; }

      // Lưu currentUser rồi reload để chuyển sang view-admin
      luuCurrent({ username: found.username, hoTen: found.hoTen, role: found.role });
      tb.textContent = 'Đăng nhập thành công!'; tb.className = 'thong-bao ok';
      setTimeout(function() { location.reload(); }, 500);
    });
  }

  // ---- 6. Xử lý ĐĂNG KÝ admin ----
  var formReg = document.getElementById('formAdminRegister');
  if (formReg) {
    formReg.addEventListener('submit', function(e) {
      e.preventDefault();

      var u  = document.getElementById('regUser').value.trim();
      var ht = document.getElementById('regHoTen').value.trim();
      var em = document.getElementById('regEmail').value.trim();
      var p  = document.getElementById('regPass').value;
      var p2 = document.getElementById('regPass2').value;

      var eU = document.getElementById('loiRegUser');
      var eH = document.getElementById('loiHoTen');
      var eE = document.getElementById('loiEmail');
      var eP = document.getElementById('loiRegPass');
      var eP2= document.getElementById('loiRegPass2');
      var tb = document.getElementById('tbReg');

      // Xóa lỗi cũ
      [eU, eH, eE, eP, eP2].forEach(function(x) { x.textContent = ''; });
      tb.textContent = ''; tb.className = 'thong-bao';

      var ok = true;
      // Tên đăng nhập: 4-20 ký tự, cấm dấu cách
      if (!u || u.length < 4 || u.length > 20 || /\s/.test(u)) { eU.textContent = '4-20 ký tự, không dấu cách'; ok = false; }
      // Trùng tên (không phân biệt hoa thường)
      if (layUsers().some(function(x) { return x.username.toLowerCase() === u.toLowerCase(); })) { eU.textContent = 'Tên đã tồn tại'; ok = false; }
      if (!ht) { eH.textContent = 'Nhập họ tên'; ok = false; }
      // Regex email cơ bản
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { eE.textContent = 'Email không hợp lệ'; ok = false; }
      if (!p || p.length < 6) { eP.textContent = 'Mật khẩu ≥6 ký tự'; ok = false; }
      if (p !== p2) { eP2.textContent = 'Xác nhận không khớp'; ok = false; }
      if (!ok) return;

      // Chỉ admin đang đăng nhập mới được tạo thêm admin (nếu hệ thống đã có admin)
      var hasAdmin = layUsers().some(function(x) { return x.role === 'admin'; });
      var cur2 = layCurrent();
      if (hasAdmin && (!cur2 || cur2.role !== 'admin')) {
        tb.textContent = 'Chỉ admin đang đăng nhập mới tạo thêm được. Hãy đăng nhập admin trước.';
        tb.className = 'thong-bao err'; return;
      }

      // Tạo id duy nhất bằng timestamp
      var arr = layUsers();
      arr.push({
        id: 'U' + Date.now(),
        username: u, password: p, hoTen: ht, email: em,
        role: 'admin', locked: false,
        createdAt: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      });
      luuUsers(arr);
      tb.textContent = 'Tạo thành công! Chuyển về đăng nhập...'; tb.className = 'thong-bao ok';
      setTimeout(function() { showView('view-login'); }, 800);
    });
  }

  // ---- 7. Đăng xuất + chuyển tab trong view-admin ----
  var btnLogout = document.getElementById('btnDangXuat');
  if (btnLogout) btnLogout.addEventListener('click', function() { luuCurrent(null); location.reload(); });

  // Mỗi nút nav có data-tab="tab-donhang" -> click thì ẩn hết .tab rồi hiện đúng tab
  document.querySelectorAll('[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
      document.getElementById(btn.dataset.tab).classList.add('active');
      btn.classList.add('active');
    });
  });

  // ---- 8. Khởi tạo dữ liệu I.7 và I.8 nếu đã là admin ----
  if (cur && cur.role === 'admin') {
    seedDonHang();
    seedPhieuNhap();
    renderDonHang();
    initTonKho();
  }
});

/* ============================================================
   I.7 - QUẢN LÝ ĐƠN HÀNG
   ============================================================ */

// Đọc / ghi đơn hàng (key "donHang")
function layDonHang() {
  try { return JSON.parse(localStorage.getItem('donHang')) || []; } catch (e) { return []; }
}
function luuDonHang(arr) {
  localStorage.setItem('donHang', JSON.stringify(arr));
}

// Seed 6 đơn mẫu rải từ 2026-09-20 đến 2026-10-15, mỗi trạng thái có ít nhất 1 đơn để GV lọc
function seedDonHang() {
  if (layDonHang().length > 0) return;
  var d = [
    { maDH:'DH001', userId:'customer01', hoTen:'Nguyễn Văn A', ngayDat:'2026-10-10', trangThai:'moi_dat',  diaChi:'227 Nguyễn Văn Cừ, Q5',     items:[{ma:'NV01', ten:'Việt Nam Sử Lược', gia:160000, soLuong:2}], tongTien:320000 },
    { maDH:'DH002', userId:'customer02', hoTen:'Trần Thị B', ngayDat:'2026-10-12', trangThai:'da_xu_ly', diaChi:'273 An Dương Vương, Q5', items:[{ma:'VH02', ten:'Dế Mèn',          gia:80000,  soLuong:1}], tongTien:80000  },
    { maDH:'DH003', userId:'customer01', hoTen:'Nguyễn Văn A', ngayDat:'2026-10-13', trangThai:'da_giao',  diaChi:'227 Nguyễn Văn Cừ',       items:[{ma:'NV03', ten:'Harry Potter',    gia:210000, soLuong:3}], tongTien:630000 },
    { maDH:'DH004', userId:'customer02', hoTen:'Trần Thị B', ngayDat:'2026-09-20', trangThai:'huy',      diaChi:'Q1',                      items:[{ma:'NH01', ten:'Doraemon',        gia:25000,  soLuong:2}], tongTien:50000  },
    { maDH:'DH005', userId:'customer01', hoTen:'Nguyễn Văn A', ngayDat:'2026-10-14', trangThai:'moi_dat',  diaChi:'Q5',                      items:[{ma:'GK01', ten:'Toán 12',         gia:22000,  soLuong:1}], tongTien:22000  },
    { maDH:'DH006', userId:'customer02', hoTen:'Trần Thị B', ngayDat:'2026-10-15', trangThai:'moi_dat',  diaChi:'Q3',                      items:[{ma:'DS01', ten:'Đắc nhân tâm',    gia:86000,  soLuong:1}], tongTien:86000  }
  ];
  luuDonHang(d);
}

// Render bảng đơn hàng ra #tblDonHang tbody
// list: mảng đã lọc, nếu không truyền thì lấy toàn bộ
function renderDonHang(list) {
  var data = list || layDonHang();
  var tb = document.querySelector('#tblDonHang tbody');
  if (!tb) return;
  if (data.length === 0) {
    tb.innerHTML = '<tr><td colspan="6" class="cell-empty">Không có đơn</td></tr>';
    return;
  }
  tb.innerHTML = data.map(function(d) {
    return '<tr>'
      + '<td>' + esc(d.maDH) + '</td>'
      + '<td>' + esc(d.ngayDat) + '</td>'
      + '<td>' + esc(d.hoTen) + '</td>'
      + '<td>' + d.tongTien.toLocaleString('vi-VN') + 'đ</td>'
      + '<td><span class="badge-tt tt-' + d.trangThai + '">' + d.trangThai + '</span></td>'
      + '<td><button class="btn-phu" onclick="xemDon(\'' + d.maDH + '\')">Xem</button></td>'
      + '</tr>';
  }).join('');
}

// Lọc AND theo 3 tiêu chí: từ ngày - đến ngày - trạng thái (yêu cầu 0.25đ)
function locDonHang() {
  var ds = layDonHang();
  var tu  = document.getElementById('dhTu').value;       // YYYY-MM-DD
  var den = document.getElementById('dhDen').value;
  var tt  = document.getElementById('dhTrangThai').value; // "" = tất cả
  if (tu)  ds = ds.filter(function(d) { return d.ngayDat >= tu; });
  if (den) ds = ds.filter(function(d) { return d.ngayDat <= den; });
  if (tt)  ds = ds.filter(function(d) { return d.trangThai === tt; });
  renderDonHang(ds);
}

// Gắn sự kiện nút Tra cứu / Đặt lại (chạy sau DOMContentLoaded nên element đã tồn tại)
var btnLocDH = document.getElementById('btnLocDH');
if (btnLocDH) btnLocDH.addEventListener('click', locDonHang);

var btnResetDH = document.getElementById('btnResetDH');
if (btnResetDH) btnResetDH.addEventListener('click', function() {
  document.getElementById('dhTu').value = '';
  document.getElementById('dhDen').value = '';
  document.getElementById('dhTrangThai').value = '';
  renderDonHang();
});

// Dialog xem chi tiết + đổi trạng thái
var currentDH = null; // mã đơn đang mở trong dialog

function xemDon(ma) {
  var d = layDonHang().find(function(x) { return x.maDH === ma; });
  if (!d) return;
  currentDH = ma;
  document.getElementById('dlgTrangThai').value = d.trangThai;
  document.getElementById('dlgContent').innerHTML =
    '<h3 class="dlg-title">' + esc(d.maDH) + ' - ' + esc(d.hoTen) + '</h3>'
    + '<p class="dlg-meta">' + esc(d.ngayDat) + ' · ' + esc(d.diaChi) + '</p>'
    + '<hr class="dlg-hr">'
    + d.items.map(function(i) {
        return '<div class="dlg-row"><span>' + esc(i.ten) + ' x' + i.soLuong + '</span><span>' + (i.gia * i.soLuong).toLocaleString('vi-VN') + 'đ</span></div>';
      }).join('')
    + '<p class="dlg-total">Tổng: ' + d.tongTien.toLocaleString('vi-VN') + 'đ</p>';
  document.getElementById('dlgDon').showModal(); // API native của <dialog>, chạy tốt trên Chrome file://
}

// Lưu trạng thái mới, có validate không cho quay ngược
var btnLuuTT = document.getElementById('btnLuuTT');
if (btnLuuTT) btnLuuTT.addEventListener('click', function() {
  if (!currentDH) return;
  var arr = layDonHang();
  var idx = arr.findIndex(function(x) { return x.maDH === currentDH; });
  var moi = document.getElementById('dlgTrangThai').value;
  var cu  = arr[idx].trangThai;
  // Validate: đã giao không quay về mới đặt, đã hủy không đổi nữa
  if (cu === 'da_giao' && moi === 'moi_dat') { alert('Không cho quay ngược đã giao → mới đặt'); return; }
  if (cu === 'huy' && moi !== 'huy') { alert('Đơn đã hủy không đổi nữa'); return; }
  arr[idx].trangThai = moi;
  luuDonHang(arr);
  renderDonHang();
  document.getElementById('dlgDon').close();
});

/* ============================================================
   I.8 - QUẢN LÝ TỒN KHO
   Công thức: Tồn = Tổng nhập (phiếu hoan_thanh) - Tổng xuất (đơn không hủy)
   ============================================================ */

function layPhieu() {
  try { return JSON.parse(localStorage.getItem('phieuNhap')) || []; } catch (e) { return []; }
}
function luuPhieu(arr) {
  localStorage.setItem('phieuNhap', JSON.stringify(arr));
}

function seedPhieuNhap() {
  if (layPhieu().length > 0) return;
  var p = [
    { maPN:'PN001', ngayNhap:'2026-10-01', trangThai:'hoan_thanh', items:[{ma:'NV01', giaNhap:100000, soLuong:20}, {ma:'VH02', giaNhap:50000, soLuong:30}] },
    { maPN:'PN002', ngayNhap:'2026-10-05', trangThai:'hoan_thanh', items:[{ma:'XH02', giaNhap:70000, soLuong:15}, {ma:'NH01', giaNhap:30000, soLuong:25}] },
    { maPN:'PN003', ngayNhap:'2026-10-10', trangThai:'nhap',       items:[{ma:'GK01', giaNhap:60000, soLuong:10}] } // chưa hoàn thành -> không tính tồn
  ];
  luuPhieu(p);
}

// Tính tồn của 1 mã SP tại 1 thời điểm (dateStr YYYY-MM-DD, rỗng = hiện tại)
// Duyệt phiếu nhập cộng nhap, duyệt đơn hàng cộng xuat, trả về nhap - xuat
function tonTaiThoiDiem(ma, dateStr) {
  var den = dateStr || new Date().toISOString().slice(0, 10);
  var nhap = 0, xuat = 0;
  layPhieu().forEach(function(p) {
    if (p.trangThai === 'hoan_thanh' && p.ngayNhap <= den) {
      p.items.forEach(function(i) { if (i.ma === ma) nhap += i.soLuong; });
    }
  });
  layDonHang().forEach(function(d) {
    if (d.trangThai !== 'huy' && d.ngayDat <= den) {
      d.items.forEach(function(i) { if (i.ma === ma) xuat += i.soLuong; });
    }
  });
  return nhap - xuat;
}

// Khởi tạo tab tồn kho: fill select, gắn 3 nút A/B/C và render mặc định
function initTonKho() {
  // Lấy danh sách sản phẩm từ localStorage key dsSanPham (do product.js quản lý)
  var ds = [];
  try { ds = JSON.parse(localStorage.getItem('dsSanPham')) || []; } catch (e) { ds = []; }
  // Fallback nếu chưa có thì dùng DU_LIEU_MAU từ data.js
  if (ds.length === 0 && typeof DU_LIEU_MAU !== 'undefined') ds = DU_LIEU_MAU.slice();

  // Fill select C: chọn sản phẩm để tra N-X-T
  var sel = document.getElementById('nxtSanPham');
  if (sel) sel.innerHTML = ds.map(function(s) { return '<option value="' + esc(s.ma) + '">' + esc(s.ma) + ' - ' + esc(s.ten) + '</option>'; }).join('');

  // Nút A: Tồn tại thời điểm - lọc theo loại + ngày
  var btnXemTon = document.getElementById('btnXemTon');
  if (btnXemTon) btnXemTon.addEventListener('click', function() {
    var ngay = document.getElementById('tonNgay').value;
    var loai = document.getElementById('tonLoai').value;
    var list = ds;
    if (loai) list = list.filter(function(s) { return s.loai === loai; });
    var rows = list.map(function(s) {
      return '<tr><td>' + esc(s.ma) + '</td><td>' + esc(s.ten) + '</td><td>' + esc(s.loai) + '</td><td>' + tonTaiThoiDiem(s.ma, ngay) + '</td></tr>';
    }).join('');
    var tbody = document.querySelector('#tblTon tbody');
    tbody.innerHTML = rows || '<tr><td colspan="4" class="cell-empty">Không có sản phẩm</td></tr>';
  });

  // Nút B: Cảnh báo sắp hết - lọc ton <= ngưỡng, sort tăng dần, tô màu
  var btnCanhBao = document.getElementById('btnCanhBao');
  if (btnCanhBao) btnCanhBao.addEventListener('click', function() {
    var nguong = parseInt(document.getElementById('nguong').value) || 5;
    var rows = ds.map(function(s) {
      return { ma: s.ma, ten: s.ten, ton: tonTaiThoiDiem(s.ma) };
    }).filter(function(x) { return x.ton <= nguong; })
      .sort(function(a, b) { return a.ton - b.ton; })
      .map(function(x) {
        var rowClass = x.ton <= 0 ? 'row-het' : 'row-gan';           // nền đỏ / vàng
        var tonClass = x.ton <= 0 ? 'ton-het' : x.ton <= nguong ? 'ton-gan' : 'ton-ok';
        return '<tr class="' + rowClass + '"><td>' + esc(x.ma) + '</td><td>' + esc(x.ten) + '</td><td class="' + tonClass + '">' + x.ton + '</td></tr>';
      }).join('');
    document.querySelector('#tblCanhBao tbody').innerHTML = rows || '<tr><td colspan="3" class="cell-empty">Không có SP dưới ngưỡng</td></tr>';
  });

  // Nút C: Nhập - Xuất - Tồn trong khoảng - chọn 1 SP + từ/đến ngày
  var btnNXT = document.getElementById('btnNXT');
  if (btnNXT) btnNXT.addEventListener('click', function() {
    var ma  = document.getElementById('nxtSanPham').value;
    var tu  = document.getElementById('nxtTu').value;
    var den = document.getElementById('nxtDen').value;
    if (!ma) return;

    // Tồn đầu kỳ: tính đến ngày trước tu (nếu có tu thì lùi 1 ngày, không có thì 0)
    var ngayTruoc = tu ? new Date(new Date(tu).getTime() - 86400000).toISOString().slice(0, 10) : '';
    var dau = tu ? tonTaiThoiDiem(ma, ngayTruoc) : 0;

    var nhap = 0, xuat = 0;
    var ctNhap = [], ctXuat = []; // chi tiết để đổ ra 2 bảng nhỏ

    layPhieu().forEach(function(p) {
      if (p.trangThai === 'hoan_thanh' && (!tu || p.ngayNhap >= tu) && (!den || p.ngayNhap <= den)) {
        p.items.forEach(function(i) { if (i.ma === ma) { nhap += i.soLuong; ctNhap.push(p); } });
      }
    });
    layDonHang().forEach(function(d) {
      if (d.trangThai !== 'huy' && (!tu || d.ngayDat >= tu) && (!den || d.ngayDat <= den)) {
        d.items.forEach(function(i) { if (i.ma === ma) { xuat += i.soLuong; ctXuat.push(d); } });
      }
    });

    var cuoi = dau + nhap - xuat;
    document.getElementById('kqNXT').textContent = 'Tồn đầu: ' + dau + ' | Nhập: ' + nhap + ' | Xuất: ' + xuat + ' | Tồn cuối: ' + cuoi;

    document.querySelector('#tblNhapCT tbody').innerHTML = ctNhap.map(function(p) {
      var sl = p.items.find(function(i) { return i.ma === ma; }).soLuong;
      return '<tr><td>' + esc(p.maPN) + '</td><td>' + esc(p.ngayNhap) + '</td><td>' + sl + '</td></tr>';
    }).join('') || '<tr><td colspan="3" class="cell-empty">Không có</td></tr>';

    document.querySelector('#tblXuatCT tbody').innerHTML = ctXuat.map(function(d) {
      var sl = d.items.find(function(i) { return i.ma === ma; }).soLuong;
      return '<tr><td>' + esc(d.maDH) + '</td><td>' + esc(d.ngayDat) + '</td><td>' + sl + '</td></tr>';
    }).join('') || '<tr><td colspan="3" class="cell-empty">Không có</td></tr>';
  });

  // Render mặc định khối A khi vào tab
  if (btnXemTon) btnXemTon.click();
}
