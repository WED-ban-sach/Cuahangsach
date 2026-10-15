/* Trang chi tiết / mua sách: chitiet.html?ma=<mã sản phẩm>
   Nút để nhóm gắn giỏ hàng: .btn-mua (Thêm vào giỏ) và .btn-mua-ngay (data-id = mã sp) */
$('quayLai').href = TRANG_DANH_SACH;
const sp = layDanhSach().find(s => s.ma === new URLSearchParams(location.search).get('ma'));
if (!sp) {
  $('chiTiet').innerHTML = '<p class="trong">Không tìm thấy sản phẩm này.</p>';
} else {
  document.title = sp.ten + ' - Nhà sách Xanh';
  const dong = (nhan, gt) => gt ? `<tr><th>${nhan}</th><td>${esc(gt)}</td></tr>` : '';
  $('chiTiet').innerHTML = `
    <div class="cot-bia">${biaSach(sp)}
      <div class="nut-mua">
        <button class="nut nut-do btn-mua" data-id="${esc(sp.ma)}">Thêm vào giỏ</button>
        <button class="nut nut-vien btn-mua-ngay" data-id="${esc(sp.ma)}">Mua ngay</button>
      </div>
    </div>
    <div class="cot-tin">
      <h1>${esc(sp.ten)}</h1>
      <p class="gia-lon">${tien(sp.gia)}</p>
      <table class="bang-tin">${dong('Mã sách', sp.ma)}${dong('Thể loại', tenLoai(sp.loai))}${dong('Tác giả', sp.tacGia)}${dong('Dịch giả', sp.dichGia)}${dong('Số trang', sp.soTrang)}${dong('Năm xuất bản', sp.namXB)}</table>
      <p class="mo-ta">${esc(sp.moTa || 'Đang cập nhật.')}</p>
    </div>`;
  const cung = layDanhSach().filter(s => s.loai === sp.loai && s.ma !== sp.ma).slice(0, 5);
  if (cung.length) {
    $('sachLienQuan').innerHTML = cung.map(theSach).join('');
    $('xemThem').href = `${TRANG_DANH_SACH}?loai=${sp.loai}`;
    $('khungLienQuan').hidden = false;
  }
}
