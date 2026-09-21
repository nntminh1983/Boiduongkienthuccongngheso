/* Ham dung chung cho website gia lap phuc vu dao tao */

function el(id) { return document.getElementById(id); }

function so(n, le) {
  if (n === null || n === undefined || n === "" || isNaN(n)) return "–";
  return Number(n).toLocaleString("vi-VN", {
    minimumFractionDigits: le || 0, maximumFractionDigits: le || 0
  });
}

function ngay(s) {
  if (!s) return "–";
  var p = String(s).substring(0, 10).split("-");
  return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : s;
}

function nhan(text, loai) {
  return '<span class="nhan nhan-' + loai + '">' + text + "</span>";
}

function nhanTrangThai(tt) {
  if (tt === "Đúng hạn") return nhan(tt, "luc");
  if (tt === "Trễ hạn") return nhan(tt, "do");
  if (tt === "Đã trả kết quả") return nhan(tt, "luc");
  if (tt === "Đang xử lý") return nhan(tt, "cam");
  if (tt === "Chờ bổ sung") return nhan(tt, "cam");
  if (tt === "Đã xử lý") return nhan(tt, "luc");
  if (tt === "Đang xử lý quá hạn") return nhan(tt, "do");
  return nhan(tt || "–", "xanh");
}

function thanh(giaTri, toiDa, loai, le) {
  var pct = Math.max(0, Math.min(100, (giaTri / toiDa) * 100));
  return '<div class="o-thanh"><div class="thanh-nen" style="flex:1">' +
    '<div class="thanh ' + (loai || "") + '" style="width:' + pct.toFixed(1) +
    '%"></div></div><span>' + so(giaTri, le === undefined ? 1 : le) + "</span></div>";
}

/* Dung bang tu mang du lieu.
   cot: [{ten, khoa, ve(row) tuy chon, canh}] */
function veBang(dich, cot, hang) {
  var h = "<table><thead><tr>";
  cot.forEach(function (c) {
    h += "<th" + (c.canh ? ' style="text-align:' + c.canh + '"' : "") + ">" +
      c.ten + "</th>";
  });
  h += "</tr></thead><tbody>";
  if (!hang.length) {
    h += '<tr><td colspan="' + cot.length +
      '" class="giua nho">Không có dữ liệu phù hợp</td></tr>';
  }
  hang.forEach(function (r) {
    h += "<tr>";
    cot.forEach(function (c) {
      var v = c.ve ? c.ve(r) : (r[c.khoa] === null || r[c.khoa] === undefined ||
        r[c.khoa] === "" ? "–" : r[c.khoa]);
      h += "<td" + (c.canh ? ' style="text-align:' + c.canh + '"' : "") + ">" +
        v + "</td>";
    });
    h += "</tr>";
  });
  h += "</tbody></table>";
  dich.innerHTML = h;
}

/* Do danh sach lua chon duy nhat vao mot the select */
function doChon(sel, mang, khoa, nhanTatCa) {
  var ds = [];
  mang.forEach(function (r) {
    if (r[khoa] && ds.indexOf(r[khoa]) < 0) ds.push(r[khoa]);
  });
  ds.sort(function (a, b) { return String(a).localeCompare(String(b), "vi"); });
  var h = '<option value="">' + (nhanTatCa || "— Tất cả —") + "</option>";
  ds.forEach(function (v) { h += "<option>" + v + "</option>"; });
  sel.innerHTML = h;
  return ds;
}

/* Bieu do cot don gian bang SVG, khong can thu vien ngoai.
   Dung he toa do rong 900 va giu ti le de chu khong bi keo gian. */
function veCot(dich, nhanTruc, giaTri, mau, donVi) {
  var W = 900, H = 260, DAY = 42, TREN = 18;
  var bRong = W / Math.max(1, giaTri.length);
  var max = Math.max.apply(null, giaTri.concat([1]));
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" ' +
    'style="display:block;height:auto">';
  s += '<line x1="0" y1="' + (H - DAY) + '" x2="' + W + '" y2="' + (H - DAY) +
    '" stroke="#D9D9D9" stroke-width="1"/>';
  giaTri.forEach(function (v, i) {
    var h = (v / max) * (H - DAY - TREN);
    var x = i * bRong + bRong * 0.18, bw = bRong * 0.64;
    s += '<rect x="' + x.toFixed(1) + '" y="' + (H - DAY - h).toFixed(1) +
      '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) +
      '" fill="' + (mau || "#C55A11") + '" rx="2"/>';
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - DAY - h - 5).toFixed(1) +
      '" font-size="13" font-family="Arial" text-anchor="middle" fill="#12404F">' +
      so(v, v < 100 ? 1 : 0) + "</text>";
    var nh = String(nhanTruc[i]);
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - DAY + 15) +
      '" font-size="11.5" font-family="Arial" text-anchor="middle" fill="#595959"' +
      (nh.length > 11 ? ' transform="rotate(-18 ' + (x + bw / 2).toFixed(1) + ' ' +
        (H - DAY + 15) + ')"' : "") + ">" + nh + "</text>";
  });
  s += "</svg>";
  if (donVi) s += '<div class="nho giua">' + donVi + "</div>";
  dich.innerHTML = s;
}

/* Bieu do duong cho chuoi thoi gian */
function veDuong(dich, nhanTruc, chuoi, donVi) {
  var W = 900, H = 260, TRAI = 46, DAY = 30, TREN = 10;
  var vW = W - TRAI, vH = H - DAY - TREN;
  var tatCa = [];
  chuoi.forEach(function (c) {
    tatCa = tatCa.concat(c.gia_tri.filter(function (v) { return v !== null; }));
  });
  if (!tatCa.length) {
    dich.innerHTML = '<div class="nho giua">Không có dữ liệu</div>';
    return;
  }
  var max = Math.max.apply(null, tatCa), min = Math.min.apply(null, tatCa);
  if (max === min) max = min + 1;
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" ' +
    'style="display:block;height:auto">';
  for (var k = 0; k <= 4; k++) {
    var yy = TREN + (vH / 4) * k;
    s += '<line x1="' + TRAI + '" y1="' + yy.toFixed(1) + '" x2="' + W + '" y2="' +
      yy.toFixed(1) + '" stroke="#E3E6E4" stroke-width="1"/>';
    s += '<text x="' + (TRAI - 6) + '" y="' + (yy + 4).toFixed(1) +
      '" font-size="11.5" font-family="Arial" text-anchor="end" fill="#8a8a8a">' +
      (max - (max - min) * k / 4).toFixed(2) + "</text>";
  }
  chuoi.forEach(function (c) {
    var d = "", n = c.gia_tri.length;
    c.gia_tri.forEach(function (v, i) {
      if (v === null) { d += ""; return; }
      var x = TRAI + (i / Math.max(1, n - 1)) * vW;
      var y = TREN + vH - ((v - min) / (max - min)) * vH;
      d += (d ? " L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    });
    s += '<path d="' + d + '" fill="none" stroke="' + c.mau +
      '" stroke-width="1.8" stroke-linejoin="round"/>';
  });
  var buoc = Math.max(1, Math.round(nhanTruc.length / 8));
  nhanTruc.forEach(function (t, i) {
    if (i % buoc) return;
    var x = TRAI + (i / Math.max(1, nhanTruc.length - 1)) * vW;
    s += '<text x="' + x.toFixed(1) + '" y="' + (H - 10) +
      '" font-size="11.5" font-family="Arial" text-anchor="middle" fill="#595959">' +
      t + "</text>";
  });
  s += "</svg>";
  var ct = '<div class="nho giua" style="margin-top:6px">';
  chuoi.forEach(function (c) {
    ct += '<span style="margin:0 9px;white-space:nowrap">' +
      '<span style="display:inline-block;width:14px;height:3px;background:' + c.mau +
      ';vertical-align:middle"></span> ' + c.ten + "</span>";
  });
  ct += (donVi ? ' &nbsp;—&nbsp; <b>' + donVi + "</b>" : "") + "</div>";
  dich.innerHTML = s + ct;
}

/* Tai mot mang du lieu ve tep CSV */
function taiCSV(ten, cot, hang) {
  var d = cot.join(",") + "\n";
  hang.forEach(function (r) {
    d += cot.map(function (c) {
      var v = r[c] === null || r[c] === undefined ? "" : String(r[c]);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(",") + "\n";
  });
  var b = new Blob(["﻿" + d], { type: "text/csv;charset=utf-8;" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = ten;
  a.click();
}

/* Dau trang va thanh dieu huong dung chung */
function khungTrang(dangO) {
  var muc = [
    ["index.html", "Trang chủ"],
    ["tra-cuu.html", "Tra cứu hồ sơ"],
    ["thu-tuc.html", "Thủ tục hành chính"],
    ["phan-anh.html", "Phản ánh, kiến nghị"],
    ["dashboard.html", "Bảng thông tin điều hành"],
    ["iot.html", "Giám sát cảm biến"],
    ["he-thong-ai.html", "Sổ hệ thống AI"]
  ];
  var h = '<div class="canh-bao-gl">WEBSITE GIẢ LẬP — DÙNG CHO ĐÀO TẠO. ' +
    'Không phải cổng thông tin của bất kỳ cơ quan nào. Mọi dữ liệu đều hư cấu.</div>' +
    '<header class="dau"><div class="bao">' +
    '<div class="quoc-huy">GIẢ<br>LẬP</div>' +
    '<div><p class="ten-cq">ỦY BAN NHÂN DÂN HUYỆN MINH KHÊ (địa danh hư cấu)</p>' +
    '<p class="ten-cong">Cổng Dịch vụ công giả lập</p></div>' +
    '</div></header><nav class="menu"><ul>';
  muc.forEach(function (m) {
    h += '<li><a href="' + m[0] + '"' + (m[0] === dangO ? ' class="dang"' : "") +
      ">" + m[1] + "</a></li>";
  });
  h += "</ul></nav>";
  h += _glLopXacNhan();
  document.write(h);
}

function chanTrang() {
  document.write(
    '<footer><div class="bao">' +
    "<div><b>Cổng Dịch vụ công giả lập</b><br>" +
    "Xây dựng phục vụ khoá bồi dưỡng kiến thức nền tảng về ứng dụng công nghệ mới<br>" +
    "Giảng viên: TS. Nguyễn Ngọc Trường Minh — iPMAC</div>" +
    "<div><b>Lưu ý quan trọng</b><br>" +
    "Toàn bộ tên địa danh, tên người, số liệu trên trang này đều là hư cấu.<br>" +
    "Không sử dụng cho bất kỳ mục đích nào ngoài học tập.</div>" +
    "</div></footer>");
}

// canhbao-batdau
/* Lop xac nhan hien mot lan moi phien truy cap. Khi trang duoc chia se tren
   internet, nguoi nhan duong dan co the khong biet day la trang mo phong. */
function _glLopXacNhan() {
  var can = true;
  try { can = sessionStorage.getItem("gl_da_doc") !== "1"; } catch (e) { can = true; }
  if (!can) return "";
  return '<div class="gl-phu" id="glPhu"><div class="gl-hop">' +
    "<h2>Đây là website giả lập, dùng để đào tạo</h2>" +
    "<p>Trang này <b>không phải</b> cổng dịch vụ công của bất kỳ cơ quan nhà nước nào. " +
    "Trang được dựng riêng cho khoá bồi dưỡng kiến thức nền tảng về ứng dụng công nghệ mới.</p>" +
    "<ul>" +
    "<li>Địa danh <b>“huyện Minh Khê”</b> và tên tám xã, phường trên trang đều là hư cấu.</li>" +
    "<li>Mọi họ tên, số giấy tờ, số điện thoại, hồ sơ, số liệu đều do chương trình sinh ra.</li>" +
    "<li>Trang không kết nối với hệ thống nào, không nhận và không lưu thông tin bạn nhập.</li>" +
    "<li>Không trích dẫn số liệu trên trang vào bất kỳ văn bản chính thức nào.</li>" +
    "</ul>" +
    "<p>Nếu bạn nhận được đường dẫn này mà không tham gia khoá học, xin bỏ qua trang.</p>" +
    '<button type="button" onclick="glDongLop()">Tôi đã hiểu, tiếp tục xem</button>' +
    '<p class="cuoi">Khoá bồi dưỡng kiến thức nền tảng về ứng dụng công nghệ mới — ' +
    "TS. Nguyễn Ngọc Trường Minh, iPMAC</p>" +
    "</div></div>";
}

function glDongLop() {
  try { sessionStorage.setItem("gl_da_doc", "1"); } catch (e) {}
  var o = document.getElementById("glPhu");
  if (o && o.parentNode) o.parentNode.removeChild(o);
}
// canhbao-ketthuc
