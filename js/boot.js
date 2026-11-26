// Decides, before the page paints, whether index.html shows the WebGL CRT terminal
// or the plain website. Plain site = fallback (no WebGL, script error, or visitor chose "gui").
(function () {
  var root = document.documentElement, pref;
  try { pref = localStorage.getItem("term"); } catch (e) {}
  var gl = false;
  try {
    var c = document.createElement("canvas");
    gl = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {}
  var isHome = !!document.querySelector('meta[name="srmrox-terminal"]');
  var useTerm = gl && isHome && pref !== "off" && !/[?&]plain\b/.test(location.search);

  function fallback() {
    root.classList.remove("term", "term-ready");
    var t = document.getElementById("term"); if (t) t.innerHTML = "";
  }
  window.srmroxFallback = fallback;

  if (useTerm) {
    root.classList.add("term");
    window.addEventListener("error", function (e) {
      if (!root.classList.contains("term-ready") && /terminal\.bundle/.test(e.filename || "")) fallback();
    });
    setTimeout(function () { if (!root.classList.contains("term-ready")) fallback(); }, 15000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (useTerm) {
      var s = document.createElement("script");
      s.src = "js/terminal.bundle.js";
      s.onerror = fallback;
      document.body.appendChild(s);
    }
    // Footer button on the plain site: go back to the terminal.
    var btn = document.getElementById("term-toggle");
    if (btn && gl) {
      btn.hidden = false;
      btn.addEventListener("click", function () {
        try { localStorage.setItem("term", "on"); } catch (e) {}
        location.href = btn.getAttribute("data-home") || "index.html";
      });
    }
  });
})();
