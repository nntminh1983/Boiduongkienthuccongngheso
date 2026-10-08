/* Hàm dùng chung cho toàn bộ website giả lập.
   Không gọi ra máy chủ nào, không lưu gì. Chạy được cả khi mở bằng file:// */

/* ------------------------------------------------------------- tiện ích */
function el(t, a, c) {
  var e = document.createElement(t);
  if (a) for (var k in a) { if (k === "html") e.innerHTML = a[k]; else e.setAttribute(k, a[k]); }
  if (c) (Array.isArray(c) ? c : [c]).forEach(function (x) {
    e.appendChild(typeof x === "string" ? document.createTextNode(x) : x);
  });
  return e;
}

/* Số kiểu Việt: 9131 -> "9.131" ; 79.43 -> "79,4" */
function sn(x) {
  if (x === "" || x === null || x === undefined) return "—";
  return Math.round(Number(x)).toLocaleString("vi-VN");
}
function sv(x, n) {
  if (x === "" || x === null || x === undefined || isNaN(x)) return "—";
  return Number(x).toFixed(n === undefined ? 1 : n).replace(".", ",");
}
function pc(x, n) { return sv(x, n) + "%"; }

/* Gom nhóm: gom(mang, d => d.ma, d => d.tiep_nhan) -> {ma: tổng} */
function gom(ds, khoa, gia) {
  var r = {};
  ds.forEach(function (d) {
    var k = khoa(d), v = gia ? Number(gia(d)) : 1;
    if (isNaN(v)) v = 0;
    r[k] = (r[k] || 0) + v;
  });
  return r;
}

/* -------------------------------------------------------------- bảng */
function veBang(dich, cot, dong, tuy) {
  tuy = tuy || {};
  var o = typeof dich === "string" ? document.getElementById(dich) : dich;
  o.innerHTML = "";
  var khung = el("div", { "class": "khung-bang" });
  var t = el("table");
  var thead = el("thead"), tr = el("tr");
  cot.forEach(function (c) {
    tr.appendChild(el("th", { "class": c.so ? "so" : "" }, c.ten));
  });
  thead.appendChild(tr); t.appendChild(thead);
  var tb = el("tbody");
  dong.forEach(function (d) {
    var r = el("tr");
    cot.forEach(function (c) {
      var v = c.lay(d);
      var td = el("td", { "class": c.so ? "so" : "" });
      if (v && v.nodeType) td.appendChild(v); else td.textContent = v;
      r.appendChild(td);
    });
    tb.appendChild(r);
  });
  t.appendChild(tb); khung.appendChild(t); o.appendChild(khung);
  if (tuy.ghi) o.appendChild(el("p", { "class": "nho" }, tuy.ghi));
}

function nhanTT(chu, loai) {
  return el("span", { "class": "nhan-tt tt-" + loai }, chu);
}
function thanh(gt, toiDa, loai) {
  var d = el("div", { "class": "thanh" });
  var i = el("i", { "class": loai || "" });
  i.style.width = Math.max(0, Math.min(100, gt / toiDa * 100)) + "%";
  d.appendChild(i);
  return d;
}
function mucNguong(gt, xanh, vang) {
  return gt >= xanh ? "xanh" : (gt >= vang ? "vang" : "do");
}

/* ------------------------------------------------------------ biểu đồ */
/* Cột dọc. tuyChon: {donVi, tuKhong (mặc định true), mau: fn(gt,i)} */
function veCot(dich, nhan, gt, tuy) {
  tuy = tuy || {};
  var W = 900, H = 300, L = 52, R = 14, T = 16, Bo = 62;
  var tuKhong = tuy.tuKhong !== false;
  var hi = Math.max.apply(null, gt), lo = Math.min.apply(null, gt);
  var y0 = tuKhong ? 0 : Math.max(0, lo - (hi - lo) * 0.35);
  var y1 = hi + (hi - y0) * 0.16 || 1;
  var rongC = (W - L - R) / gt.length;
  var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">'];
  for (var k = 0; k <= 4; k++) {
    var gv = y0 + (y1 - y0) * k / 4;
    var yy = H - Bo - (gv - y0) / (y1 - y0) * (H - Bo - T);
    s.push('<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (W - R) +
           '" y2="' + yy.toFixed(1) + '" stroke="#E2E5EA"/>');
    s.push('<text x="' + (L - 7) + '" y="' + (yy + 4).toFixed(1) +
           '" text-anchor="end" font-size="12" fill="#5A5A5A">' + sv(gv, 0) + '</text>');
  }
  gt.forEach(function (v, i) {
    var h = (v - y0) / (y1 - y0) * (H - Bo - T);
    if (h < 0) h = 0;
    var x = L + i * rongC + rongC * 0.18, w = rongC * 0.64;
    var mau = typeof tuy.mau === "function" ? tuy.mau(v, i)
            : (tuy.mau || "#0070C0");
    s.push('<rect x="' + x.toFixed(1) + '" y="' + (H - Bo - h).toFixed(1) +
           '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) +
           '" fill="' + mau + '"/>');
    s.push('<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - Bo - h - 5).toFixed(1) +
           '" text-anchor="middle" font-size="12" font-weight="700" fill="#002060">' +
           sv(v, tuy.le === undefined ? 1 : tuy.le) + (tuy.donVi || "") + '</text>');
    s.push('<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - Bo + 15) +
           '" text-anchor="middle" font-size="11.5" fill="#333" ' +
           'transform="rotate(-32 ' + (x + w / 2).toFixed(1) + ',' + (H - Bo + 15) + ')">' +
           nhan[i] + '</text>');
  });
  s.push('<line x1="' + L + '" y1="' + (H - Bo) + '" x2="' + (W - R) + '" y2="' +
         (H - Bo) + '" stroke="#9AA1AC"/></svg>');
  var o = typeof dich === "string" ? document.getElementById(dich) : dich;
  o.innerHTML = s.join("");
}

/* Đường theo thời gian */
function veDuong(dich, nhan, gt, tuy) {
  tuy = tuy || {};
  var W = 900, H = 290, L = 58, R = 16, T = 16, Bo = 44;
  var hi = Math.max.apply(null, gt), lo = Math.min.apply(null, gt);
  var y0 = tuy.tuKhong === false ? lo - (hi - lo) * 0.2 : 0;
  var y1 = hi + (hi - y0) * 0.14 || 1;
  var b = (W - L - R) / (gt.length - 1 || 1);
  var X = function (i) { return L + i * b; };
  var Y = function (v) { return H - Bo - (v - y0) / (y1 - y0) * (H - Bo - T); };
  var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">'];
  for (var k = 0; k <= 4; k++) {
    var gv = y0 + (y1 - y0) * k / 4, yy = Y(gv);
    s.push('<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (W - R) +
           '" y2="' + yy.toFixed(1) + '" stroke="#E2E5EA"/>');
    s.push('<text x="' + (L - 8) + '" y="' + (yy + 4).toFixed(1) +
           '" text-anchor="end" font-size="12" fill="#5A5A5A">' + sn(gv) + '</text>');
  }
  var d = gt.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
  s.push('<path d="' + d + '" fill="none" stroke="#0070C0" stroke-width="2.6"/>');
  gt.forEach(function (v, i) {
    s.push('<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) +
           '" r="3.6" fill="#002060"/>');
    s.push('<text x="' + X(i).toFixed(1) + '" y="' + (H - Bo + 17) +
           '" text-anchor="middle" font-size="11.5" fill="#333">' + nhan[i] + '</text>');
  });
  s.push('<line x1="' + L + '" y1="' + (H - Bo) + '" x2="' + (W - R) + '" y2="' +
         (H - Bo) + '" stroke="#9AA1AC"/></svg>');
  var o = typeof dich === "string" ? document.getElementById(dich) : dich;
  o.innerHTML = s.join("");
}

/* Nhiều đường trên cùng một hệ trục. cacDuong = [{ten, gt, mau}] */
function veDuongNhieu(dich, nhan, cacDuong, tuy) {
  tuy = tuy || {};
  var W = 900, H = 320, L = 58, R = 16, T = 34, Bo = 46;
  var het = [];
  cacDuong.forEach(function (d) { het = het.concat(d.gt.filter(function (v) {
    return v !== null && v !== undefined && !isNaN(v); })); });
  var hi = Math.max.apply(null, het), lo = Math.min.apply(null, het);
  var y0 = tuy.tuKhong === false ? lo - (hi - lo) * 0.2 : 0;
  var y1 = hi + (hi - y0) * 0.16 || 1;
  var n = nhan.length;
  var b = (W - L - R) / (n - 1 || 1);
  var X = function (i) { return L + i * b; };
  var Y = function (v) { return H - Bo - (v - y0) / (y1 - y0) * (H - Bo - T); };
  var MAU = ["#0070C0", "#B3261E", "#00843D", "#7030A0", "#C2610F"];
  var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">'];
  for (var k = 0; k <= 4; k++) {
    var gv = y0 + (y1 - y0) * k / 4, yy = Y(gv);
    s.push('<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (W - R) +
           '" y2="' + yy.toFixed(1) + '" stroke="#E2E5EA"/>');
    s.push('<text x="' + (L - 8) + '" y="' + (yy + 4).toFixed(1) +
           '" text-anchor="end" font-size="12" fill="#5A5A5A">' +
           sv(gv, tuy.le === undefined ? 0 : tuy.le) + '</text>');
  }
  if (tuy.vach !== undefined && tuy.vach !== null) {
    var xv = X(tuy.vach);
    s.push('<line x1="' + xv.toFixed(1) + '" y1="' + T + '" x2="' + xv.toFixed(1) +
           '" y2="' + (H - Bo) + '" stroke="#C2610F" stroke-width="2" ' +
           'stroke-dasharray="6 4"/>');
    if (tuy.nhanVach) {
      s.push('<text x="' + (xv + 6).toFixed(1) + '" y="' + (T + 12) +
             '" font-size="12" font-weight="700" fill="#C2610F">' +
             tuy.nhanVach + '</text>');
    }
  }
  cacDuong.forEach(function (d, j) {
    var mau = d.mau || MAU[j % MAU.length];
    var dd = "", batDau = true;
    d.gt.forEach(function (v, i) {
      if (v === null || v === undefined || isNaN(v)) { batDau = true; return; }
      dd += (batDau ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1) + " ";
      batDau = false;
    });
    s.push('<path d="' + dd + '" fill="none" stroke="' + mau + '" stroke-width="2.6"/>');
    d.gt.forEach(function (v, i) {
      if (v === null || v === undefined || isNaN(v)) return;
      s.push('<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) +
             '" r="3.4" fill="' + mau + '"/>');
    });
    var lx = L + j * 190;
    s.push('<rect x="' + lx + '" y="6" width="16" height="4" fill="' + mau + '"/>');
    s.push('<text x="' + (lx + 21) + '" y="11.5" font-size="12" fill="#333">' +
           d.ten + '</text>');
  });
  nhan.forEach(function (t, i) {
    if (n > 16 && i % Math.ceil(n / 12) !== 0) return;
    s.push('<text x="' + X(i).toFixed(1) + '" y="' + (H - Bo + 17) +
           '" text-anchor="middle" font-size="11.5" fill="#333">' + t + '</text>');
  });
  s.push('<line x1="' + L + '" y1="' + (H - Bo) + '" x2="' + (W - R) + '" y2="' +
         (H - Bo) + '" stroke="#9AA1AC"/></svg>');
  var o = typeof dich === "string" ? document.getElementById(dich) : dich;
  o.innerHTML = s.join("");
}

/* Thanh ngang có sắp xếp */
function veThanhNgang(dich, nhan, gt, tuy) {
  tuy = tuy || {};
  var n = gt.length, caoD = 26, W = 900, L = 168, R = 58;
  var H = n * caoD + 24;
  var hi = Math.max.apply(null, gt) * 1.02 || 1;
  var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">'];
  gt.forEach(function (v, i) {
    var y = 10 + i * caoD, w = (v / hi) * (W - L - R);
    var mau = tuy.mau ? tuy.mau(v, i) : "#0070C0";
    s.push('<text x="' + (L - 9) + '" y="' + (y + 14) +
           '" text-anchor="end" font-size="12.5" fill="#333">' + nhan[i] + '</text>');
    s.push('<rect x="' + L + '" y="' + (y + 3) + '" width="' + w.toFixed(1) +
           '" height="' + (caoD - 10) + '" fill="' + mau + '" rx="2"/>');
    s.push('<text x="' + (L + w + 7).toFixed(1) + '" y="' + (y + 14) +
           '" font-size="12" font-weight="700" fill="#002060">' +
           sv(v, tuy.le === undefined ? 1 : tuy.le) + (tuy.donVi || "") + '</text>');
  });
  s.push("</svg>");
  var o = typeof dich === "string" ? document.getElementById(dich) : dich;
  o.innerHTML = s.join("");
}

/* ------------------------------------------------------------ tải CSV */
function taiCSV(ten, cot, dong) {
  var d = [cot.join(",")];
  dong.forEach(function (r) {
    d.push(r.map(function (x) {
      x = (x === null || x === undefined) ? "" : String(x);
      return /[",\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x;
    }).join(","));
  });
  var b = new Blob(["﻿" + d.join("\n")], { type: "text/csv;charset=utf-8" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = ten;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

/* ------------------------------------------------------ khung trang */
var TRANG = [
  ["index.html", "Trang chủ"],
  ["du-lieu.html", "Bộ dữ liệu"],
  ["phan-anh.html", "CĐ01 · Phản ánh & AI"],
  ["truong-hoc.html", "CĐ02 · Tuyển sinh"],
  ["giao-thong.html", "CĐ03 · Cảm biến giao thông"],
  ["canh-bao.html", "CĐ04 · Ngưỡng cảnh báo"],
  ["iot.html", "Giám sát IoT"],
  ["goi-y.html", "Gợi ý quyết định"],
  ["quyet-dinh.html", "Công cụ quyết định"]
];

function khungTrang(dangO) {
  var h = '<div class="canh-bao-gl">WEBSITE GIẢ LẬP — PHỤC VỤ ĐÀO TẠO. ' +
    'Không phải hệ thống của bất kỳ cơ quan nào. Mọi địa danh và số liệu đều hư cấu.</div>' +
    '<header class="dau"><div class="bao">' +
    '<div class="huy">GIẢ<br>LẬP</div>' +
    '<div><p class="ten-kh">Sáu lĩnh vực · trợ lý AI, dữ liệu IoT và ra quyết định</p>' +
    '<p class="ten-web">Sàn tập Tình huống AI và IoT</p></div>' +
    '</div></header><nav class="menu"><ul>';
  TRANG.forEach(function (m) {
    h += '<li><a href="' + m[0] + '"' + (m[0] === dangO ? ' class="dang"' : "") +
      ">" + m[1] + "</a></li>";
  });
  h += "</ul></nav>";
  h += _lopXacNhan();
  document.write(h);
}

function chanTrang() {
  document.write(
    '<footer><div class="bao">' +
    "<div><b>Sàn tập Tình huống AI và IoT</b>" +
    "Website giả lập phục vụ năm chuyên đề thực hành về ra quyết định với trợ lý " +
    "AI và dữ liệu cảm biến.<br>Giảng viên: TS. Nguyễn Ngọc Trường Minh</div>" +
    "<div><b>Lưu ý</b>" +
    "Địa danh “thị xã Mẫu Giang, Tỉnh Mẫu”, các trường học, nút giao, trạm quan " +
    "trắc, trạm y tế, công trình và nhà trọ trên trang đều là hư cấu. Mọi số liệu do chương trình sinh ra.<br>" +
    "Trang không thu thập và không lưu bất kỳ thông tin nào bạn nhập.</div>" +
    "</div></footer>");
}

function _lopXacNhan() {
  var can = true;
  try { can = sessionStorage.getItem("gl_da_doc") !== "1"; } catch (e) { can = true; }
  if (!can) return "";
  return '<div class="gl-phu" id="glPhu"><div class="gl-hop">' +
    "<h2>Đây là website giả lập, dùng để đào tạo</h2>" +
    "<p>Trang này <b>không phải</b> hệ thống của bất kỳ cơ quan nhà nước nào. " +
    "Trang được dựng riêng cho năm chuyên đề thực hành về ra quyết định với trợ " +
    "lý AI và dữ liệu cảm biến IoT.</p>" +
    "<ul>" +
    "<li>Địa danh <b>“thị xã Mẫu Giang, Tỉnh Mẫu”</b>, tên trường học, nút giao, " +
    "trạm quan trắc và trạm y tế đều là hư cấu.</li>" +
    "<li>Mọi số liệu đều do chương trình sinh ra, không lấy từ hệ thống nào.</li>" +
    "<li>Trang không nhận và không lưu thông tin bạn nhập vào.</li>" +
    "<li>Không trích dẫn số liệu trên trang vào bất kỳ văn bản chính thức nào.</li>" +
    "</ul>" +
    "<p>Nếu bạn nhận được đường dẫn này mà không tham gia khoá học, xin bỏ qua trang.</p>" +
    '<button type="button" onclick="glDong()">Tôi đã hiểu, tiếp tục xem</button>' +
    '<p class="cuoi">Năm tình huống ra quyết định với trợ lý AI và dữ liệu IoT ' +
    '— TS. Nguyễn Ngọc Trường Minh</p></div></div>';
}

function glDong() {
  try { sessionStorage.setItem("gl_da_doc", "1"); } catch (e) {}
  var o = document.getElementById("glPhu");
  if (o && o.parentNode) o.parentNode.removeChild(o);
}

/* ------------------------------------------- chuẩn hoá và chấm điểm MCDM */
function chamDiem(tieuChi, phuongAn, trongSo) {
  /* tieuChi = [{ma, ten, donVi, huong}] ; phuongAn = [{ma, ten, gt:{TC1:..}}] */
  var ket = phuongAn.map(function (p) {
    var diem = 0;
    tieuChi.forEach(function (t) {
      var cot = phuongAn.map(function (q) { return q.gt[t.ma]; });
      var lo = Math.min.apply(null, cot), hi = Math.max.apply(null, cot);
      var ch = (hi === lo) ? 1 : (p.gt[t.ma] - lo) / (hi - lo);
      if (t.huong < 0) ch = 1 - ch;
      diem += (trongSo[t.ma] || 0) * ch * 100;
    });
    return { ma: p.ma, ten: p.ten, diem: diem };
  });
  ket.sort(function (a, b) { return b.diem - a.diem; });
  return ket;
}
