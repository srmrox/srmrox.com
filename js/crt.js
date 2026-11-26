// CRT filter toggle. The filter is on while <html> has class "crt".
// The default comes from the class in the HTML. The visitor's choice is saved.
(function () {
  var root = document.documentElement, saved;
  try { saved = localStorage.getItem("crt"); } catch (e) {}
  if (saved) root.classList.toggle("crt", saved === "on");

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("crt-toggle");
    if (!btn) return;
    function show() {
      var on = root.classList.contains("crt");
      btn.textContent = "CRT: " + (on ? "on" : "off");
      btn.setAttribute("aria-pressed", on);
    }
    btn.hidden = false;
    show();
    btn.addEventListener("click", function () {
      var on = root.classList.toggle("crt");
      try { localStorage.setItem("crt", on ? "on" : "off"); } catch (e) {}
      show();
    });
  });
})();
