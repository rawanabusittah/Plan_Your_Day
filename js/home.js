// Home page only: smart "how it works" flow
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Smart flow: auto-advances, click to jump, pauses on hover/focus ----
  var flow = document.getElementById("flow");
  if (!flow) return;
  var steps = Array.prototype.slice.call(flow.querySelectorAll(".flow-step"));
  var fill = flow.querySelector(".flow-fill");
  var active = 0, timer = null;

  function show(i) {
    active = i;
    steps.forEach(function (s, n) {
      s.classList.toggle("active", n === i);
      s.classList.toggle("done", n <= i);
      if (n === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    if (fill) fill.style.width = (i / (steps.length - 1)) * 100 + "%";
  }
  function start() {
    if (reduce || timer) return;
    timer = setInterval(function () { show((active + 1) % steps.length); }, 3500);
  }
  function stop() { clearInterval(timer); timer = null; }

  steps.forEach(function (s, n) { s.addEventListener("click", function () { show(n); }); });
  flow.addEventListener("mouseenter", stop);
  flow.addEventListener("mouseleave", start);
  flow.addEventListener("focusin", stop);
  flow.addEventListener("focusout", start);
  show(0);
  start();
})();


// Soft pointer spotlight on cards (pointer devices only)
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".value-card, .feature-card, .about-lead").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
})();
