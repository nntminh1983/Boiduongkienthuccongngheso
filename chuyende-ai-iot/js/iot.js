/* Bộ máy "Trung tâm giám sát IoT" giả lập.
   Phát lại dữ liệu cảm biến đã ghi theo thời gian, như thể đang nhận trực tiếp.
   Không gọi ra máy chủ nào; mọi dữ liệu nằm trong du_lieu/*.js. */

function ngayVN(s) { var p = String(s).split("-"); return p.length === 3 ? p[2] + "/" + p[1] : s; }

/* Mức cảnh báo theo ngưỡng. huong = 1: càng cao càng xấu; -1: càng thấp càng xấu */
function mucCB(v, cs) {
  if (v === "" || v === null || v === undefined || isNaN(v)) return "xam";
  if (cs.huong === -1) return v <= cs.do ? "do" : (v <= cs.vang ? "vang" : "xanh");
  return v >= cs.do ? "do" : (v >= cs.vang ? "vang" : "xanh");
}
function hienSo(v, cs) {
  if (v === "" || v === null || v === undefined || isNaN(v)) return "—";
  return cs.phanTram ? sv(v * 100, 0) + "%" : sv(v, cs.le === undefined ? 1 : cs.le) + (cs.dv ? " " + cs.dv : "");
}

function GiamSat(goc, cfg) {
  this.goc = goc; this.cfg = cfg;
  var ds = cfg.du_lieu().filter(function (d) { return cfg.lucDo(d); });
  ds.sort(function (a, b) { return cfg.lucDo(a) < cfg.lucDo(b) ? -1 : 1; });
  this.ds = ds;
  var tg = {}, t = [];
  ds.forEach(function (d) { var k = cfg.lucDo(d); if (!tg[k]) { tg[k] = 1; t.push(k); } });
  this.thoiGian = t;
  var tb = {}, thuTu = [];
  ds.forEach(function (d) {
    var k = d[cfg.khoa];
    if (!tb[k]) { tb[k] = { ma: k, ten: cfg.ten(d), ban: [] }; thuTu.push(k); }
    tb[k].ban.push(d);
  });
  this.tb = tb; this.thuTu = thuTu;
  this.chiSo = 0; this.hen = null;
  this.dung();
}

GiamSat.prototype.dung = function () {
  var self = this, c = this.cfg, g = this.goc;
  g.innerHTML = "";
  g.appendChild(el("p", { "class": "nho", html: c.moTa }));
  var dk = el("div", { "class": "hang-dk dieu-khien" });
  this.nutChay = el("button", { type: "button" }, "▶ Phát lại");
  this.nutChay.onclick = function () { self.batTat(); };
  this.thanhTruot = el("input", { type: "range", min: "0", max: String(this.thoiGian.length - 1),
                                  value: String(this.thoiGian.length - 1), "aria-label": "Thời điểm dữ liệu" });
  this.thanhTruot.oninput = function () { self.toi(Number(this.value)); };
  this.nhanTG = el("b", { "class": "nhan-tg" });
  this.chonTb = el("select", { "aria-label": "Thiết bị xem biểu đồ" });
  this.thuTu.forEach(function (k) { self.chonTb.appendChild(el("option", { value: k }, self.tb[k].ten)); });
  this.chonTb.onchange = function () { self.veBieuDo(); };
  dk.appendChild(el("div", {}, [el("label", {}, "Phát lại dữ liệu đã thu thập"), this.nutChay]));
  dk.appendChild(el("div", { "class": "o-truot" }, [el("label", {}, "Thời điểm"), this.thanhTruot, this.nhanTG]));
  g.appendChild(dk);
  this.oChiSo = el("div", { "class": "luoi luoi-4" }); g.appendChild(this.oChiSo);
  var hai = el("div", { "class": "luoi luoi-2c" });
  this.oThietBi = el("div", { "class": "luoi-tb" });
  this.oCanhBao = el("div", { "class": "nhat-ky" });
  hai.appendChild(el("div", {}, [el("h3", {}, "Số đọc mới nhất từ " + this.thuTu.length + " " + c.donViTb), this.oThietBi]));
  hai.appendChild(el("div", {}, [el("h3", {}, "Nhật ký cảnh báo"), this.oCanhBao]));
  g.appendChild(hai);
  g.appendChild(el("h3", {}, "Diễn biến theo thời gian – " + c.chi[0].ten));
  var hb = el("div", { "class": "hang-dk" }, [el("div", {}, [el("label", {}, "Chọn " + c.donViTb), this.chonTb])]);
  g.appendChild(hb);
  this.oBieuDo = el("div", { "class": "bieu-do" }); g.appendChild(this.oBieuDo);
  if (c.ghiChu) g.appendChild(el("p", { "class": "nho", html: c.ghiChu }));
  /* mở sẵn ở thời điểm có nhiều điểm vượt ngưỡng nhất để thấy ngay vấn đề */
  var dem = {}, tot = this.thoiGian.length - 1, maxD = -1, self2 = this;
  this.ds.forEach(function (d) { if (self2.danhGia(d).muc === "do") { var k = c.lucDo(d); dem[k] = (dem[k] || 0) + 1; } });
  this.thoiGian.forEach(function (t, i) { if ((dem[t] || 0) > maxD) { maxD = dem[t] || 0; tot = i; } });
  this.toi(tot);
};

GiamSat.prototype.batTat = function () {
  var self = this;
  if (this.hen) { clearInterval(this.hen); this.hen = null; this.nutChay.textContent = "▶ Phát lại"; return; }
  if (this.chiSo >= this.thoiGian.length - 1) this.toi(0);
  this.nutChay.textContent = "❚❚ Tạm dừng";
  var buoc = Math.max(1, Math.round(this.thoiGian.length / 120));
  this.hen = setInterval(function () {
    if (self.chiSo >= self.thoiGian.length - 1) { self.batTat(); return; }
    self.toi(Math.min(self.thoiGian.length - 1, self.chiSo + buoc));
  }, 350);
};

/* Đánh giá một bản ghi: trả về {muc, lyDo[]} */
GiamSat.prototype.danhGia = function (d) {
  var c = this.cfg, lyDo = [], coDo = false, coVang = false;
  var tt = c.trangThai ? c.trangThai(d) : "";
  if (tt) return { muc: "xam", lyDo: [tt] };
  c.chi.forEach(function (cs) {
    var m = mucCB(d[cs.k], cs);
    if (m === "do") { coDo = true; lyDo.push(cs.ten + " " + hienSo(d[cs.k], cs) + " (vượt ngưỡng)"); }
    else if (m === "vang") { coVang = true; lyDo.push(cs.ten + " " + hienSo(d[cs.k], cs) + " (gần ngưỡng)"); }
  });
  (c.quyTacThem ? c.quyTacThem(d) : []).forEach(function (x) { lyDo.push(x); coDo = true; });
  return { muc: coDo ? "do" : (coVang ? "vang" : "xanh"), lyDo: lyDo };
};

GiamSat.prototype.toi = function (i) {
  var self = this, c = this.cfg;
  this.chiSo = i; this.thanhTruot.value = String(i);
  var t = this.thoiGian[i];
  this.nhanTG.textContent = c.hienTG(t);
  var moi = [];
  this.thuTu.forEach(function (k) {
    var ban = self.tb[k].ban, cuoi = null;
    for (var j = ban.length - 1; j >= 0; j--) if (c.lucDo(ban[j]) <= t) { cuoi = ban[j]; break; }
    moi.push({ tb: self.tb[k], d: cuoi });
  });
  /* chỉ số tổng hợp */
  var onl = 0, doN = 0, vangN = 0, tong = 0, n = 0, cs0 = c.chi[0];
  moi.forEach(function (x) {
    if (!x.d) return;
    var dg = self.danhGia(x.d);
    if (dg.muc !== "xam") onl++;
    if (dg.muc === "do") doN++; else if (dg.muc === "vang") vangN++;
    var v = x.d[cs0.k];
    if (v !== "" && !isNaN(v)) { tong += v; n++; }
  });
  var tb = n ? tong / n : NaN;
  var o = this.oChiSo; o.innerHTML = "";
  [["Thiết bị đang gửi số liệu", onl + "/" + this.thuTu.length, onl < this.thuTu.length ? "vang" : "xanh",
    onl < this.thuTu.length ? (this.thuTu.length - onl) + " thiết bị mất kết nối hoặc nghi ngờ" : "đủ"],
   ["Đang vượt ngưỡng", String(doN), doN ? "do" : "xanh", "điểm cần xử lý ngay"],
   ["Gần ngưỡng", String(vangN), vangN ? "vang" : "xanh", "theo dõi thêm"],
   [cs0.ten + " – trung bình", hienSo(tb, cs0), mucCB(tb, cs0), "trên các điểm đang gửi số liệu"]
  ].forEach(function (x) {
    o.appendChild(el("div", { "class": "chi-so " + x[2], html: '<div class="nhan">' + x[0] +
      '</div><div class="so">' + x[1] + '</div><div class="phu">' + x[3] + "</div>" }));
  });
  /* thẻ thiết bị */
  var ot = this.oThietBi; ot.innerHTML = "";
  moi.forEach(function (x) {
    var the = el("div", { "class": "the-tb" });
    if (!x.d) { the.className += " tb-xam"; the.appendChild(el("b", {}, x.tb.ten)); the.appendChild(el("div", { "class": "nho" }, "chưa có số liệu")); ot.appendChild(the); return; }
    var dg = self.danhGia(x.d);
    the.className += " tb-" + dg.muc;
    the.appendChild(el("b", {}, x.tb.ten));
    var dong = c.chi.map(function (cs) { return cs.ten + ": <b>" + hienSo(x.d[cs.k], cs) + "</b>"; }).join("<br>");
    the.appendChild(el("div", { "class": "gt-tb", html: dong }));
    the.appendChild(el("div", { "class": "nho" }, (dg.muc === "xam" ? "⚠ " + dg.lyDo[0] + " · " : "") + "cập nhật " + c.hienTG(c.lucDo(x.d))));
    the.onclick = function () { self.chonTb.value = x.tb.ma; self.veBieuDo(); };
    ot.appendChild(the);
  });
  /* nhật ký cảnh báo: sự kiện chuyển sang đỏ hoặc mất số liệu, tính tới thời điểm t */
  var su = [];
  this.thuTu.forEach(function (k) {
    var truoc = "xanh";
    self.tb[k].ban.forEach(function (d) {
      if (c.lucDo(d) > t) return;
      var dg = self.danhGia(d);
      if ((dg.muc === "do" || dg.muc === "xam") && truoc !== dg.muc) su.push({ t: c.lucDo(d), ten: self.tb[k].ten, dg: dg });
      truoc = dg.muc;
    });
  });
  su.sort(function (a, b) { return a.t < b.t ? 1 : -1; });
  var oc = this.oCanhBao; oc.innerHTML = "";
  if (!su.length) oc.appendChild(el("p", { "class": "nho" }, "Chưa có cảnh báo nào tới thời điểm này."));
  su.slice(0, 14).forEach(function (s) {
    oc.appendChild(el("div", { "class": "cb cb-" + s.dg.muc, html: "<span class='tg'>" + c.hienTG(s.t) + "</span> <b>" +
      s.ten + "</b>: " + s.dg.lyDo.join("; ") }));
  });
  if (su.length > 14) oc.appendChild(el("p", { "class": "nho" }, "… và " + (su.length - 14) + " cảnh báo trước đó."));
  this.veBieuDo();
};

GiamSat.prototype.veBieuDo = function () {
  var c = this.cfg, k = this.chonTb.value, ban = this.tb[k].ban, t = this.thoiGian[this.chiSo];
  var nhan = ban.map(function (d) { return c.nhanTruc(d); });
  var cs = c.chi[0], vach = null;
  ban.forEach(function (d, i) { if (c.lucDo(d) <= t) vach = i; });
  var gt = ban.map(function (d) {
    var v = d[cs.k]; return (v === "" || isNaN(v)) ? null : (cs.phanTram ? v * 100 : v);
  });
  var nguong = ban.map(function () { return cs.phanTram ? cs.do * 100 : cs.do; });
  veDuongNhieu(this.oBieuDo, nhan,
    [{ ten: cs.ten, gt: gt, mau: "#0070C0" }, { ten: "Ngưỡng cảnh báo đỏ", gt: nguong, mau: "#B3261E" }],
    { tuKhong: cs.tuKhong !== false ? undefined : false, vach: vach, nhanVach: "đang xem", le: cs.le === undefined ? 0 : cs.le });
};
