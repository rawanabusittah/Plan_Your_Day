// home-fixes.js — يُحمَّل بعد core.js و home.js.
// شريط البطاقات قطعة واحدة متصلة، لذلك نمنع core.js من تحريك/إمالة كل بطاقة على حدة.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".feature-strip .feature-card").forEach(function (el) {
    ["data-reveal", "data-reveal-delay", "data-tilt"].forEach(function (a) {
      el.removeAttribute(a);
    });
    el.classList.remove("revealed");
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  });
});
