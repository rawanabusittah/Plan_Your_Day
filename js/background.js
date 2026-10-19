// background.js — slow floating stationery behind the hero areas.
// Pure CSS animation on inline SVG: no canvas, no video. Pauses when the tab
// is hidden or the hero scrolls out of view, and stays still for
// prefers-reduced-motion. Template pages get icons that match their topic.

(function () {
  var NS = "http://www.w3.org/2000/svg";

  // 24x24 line icons (stroke = currentColor)
  var ICONS = {
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
    pencil: '<path d="M4 20l1-4L16.5 4.5a2 2 0 013 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
    clip: '<path d="M8 12.5l6.5-6.5a3 3 0 014.2 4.2L9.5 19.4a5 5 0 01-7-7L11 4"/>',
    note: '<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
    coin: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5v9M9.5 10c0-1 1-1.6 2.5-1.6s2.5.6 2.5 1.6-1 1.5-2.5 1.8-2.5.8-2.5 1.8 1 1.6 2.5 1.6 2.5-.6 2.5-1.6"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
    plane: '<path d="M3 13l18-8-5 15-4-6z"/><path d="M12 14l9-9"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5M9 7h6"/>',
    dumbbell: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    cake: '<path d="M4 20h16v-6H4z"/><path d="M6 14c0-2 3-2 3-4m3 4c0-2 3-2 3-4M12 6V3"/>',
    fork: '<path d="M7 3v8a2 2 0 004 0V3M9 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
    heartbeat: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    repeat: '<path d="M4 11V9a3 3 0 013-3h11M18 3l3 3-3 3M20 13v2a3 3 0 01-3 3H6M6 21l-3-3 3-3"/>',
  };

  var BASE = ["check", "star", "pencil", "clip", "note"];
  var THEMES = {
    simple: ["check", "pencil", "note"],
    priority: ["star", "target", "check"],
    weekly: ["calendar", "clock", "check"],
    shopping: ["bag", "coin", "check"],
    project: ["layers", "target", "clip"],
    study: ["book", "pencil", "bulb"],
    fitness: ["dumbbell", "heartbeat", "target"],
    reading: ["book", "bulb", "star"],
    work: ["briefcase", "check", "layers"],
    goals: ["target", "star", "check"],
    budget: ["coin", "bag", "target"],
    meals: ["fork", "leaf", "heart"],
    habits: ["repeat", "check", "star"],
    event: ["cake", "star", "heart"],
    travel: ["plane", "bag", "target"],
    home: ["home", "leaf", "clip"],
    timeblock: ["clock", "calendar", "check"],
    notes: ["bulb", "pencil", "note"],
    wellness: ["heartbeat", "leaf", "heart"],
    monthly: ["calendar", "star", "check"],
  };

  // small deterministic random so the layout is stable between visits
  function rng(seed) {
    var h = 1779033703 ^ seed.length;
    for (var i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }

  function makeLayer(host, names, count, seed) {
    var rand = rng(seed);
    var layer = document.createElement("div");
    layer.className = "float-bg";
    layer.setAttribute("aria-hidden", "true");

    var cols = Math.ceil(Math.sqrt(count * 2.2));
    var rows = Math.ceil(count / cols);
    for (var i = 0; i < count; i++) {
      var name = names[Math.floor(rand() * names.length)];
      var cell = i % cols;
      var row = Math.floor(i / cols);
      var x = ((cell + 0.15 + rand() * 0.7) / cols) * 100;
      var y = ((row + 0.15 + rand() * 0.7) / rows) * 100;
      var size = 28 + Math.round(rand() * 34);
      var el = document.createElementNS(NS, "svg");
      el.setAttribute("viewBox", "0 0 24 24");
      el.setAttribute("class", "float-item tone-" + (i % 4));
      el.innerHTML = ICONS[name];
      el.style.cssText =
        "inset-inline-start:" + x.toFixed(1) + "%;top:" + y.toFixed(1) + "%;" +
        "width:" + size + "px;height:" + size + "px;" +
        "--r:" + Math.round(rand() * 50 - 25) + "deg;" +
        "--dx:" + Math.round(rand() * 36 - 18) + "px;" +
        "--dy:" + Math.round(rand() * 44 - 22) + "px;" +
        "--dur:" + (11 + rand() * 12).toFixed(1) + "s;" +
        "--delay:-" + (rand() * 14).toFixed(1) + "s;";
      layer.appendChild(el);
    }
    if (host.classList.contains("hero")) {
      ["b1", "b2", "b3"].forEach(function (c) {
        var blob = document.createElement("span");
        blob.className = "blob " + c;
        layer.insertBefore(blob, layer.firstChild);
      });
    }
    host.insertBefore(layer, host.firstChild);
    return layer;
  }

  window.initializeBackground = function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var small = window.matchMedia("(max-width: 640px)").matches;
    var layers = [];

    var home = document.querySelector(".hero");
    if (home) layers.push(makeLayer(home, BASE.concat(["calendar", "bulb", "heart", "clock"]), small ? 9 : 16, "home"));

    var cta = document.querySelector(".cta-card");
    if (cta) layers.push(makeLayer(cta, ["check", "star", "calendar", "heart", "bulb", "pencil"], small ? 7 : 12, "cta"));

    var tpl = document.querySelector(".tpl-hero");
    var type = document.body.getAttribute("data-tpl") || "simple";
    if (tpl) layers.push(makeLayer(tpl, (THEMES[type] || THEMES.simple).concat(["check", "star"]), small ? 8 : 14, type));

    if (reduce || !layers.length) return;

    // pause when off screen or when the tab is hidden
    var visible = new Set();
    function apply() {
      layers.forEach(function (l) {
        var run = !document.hidden && visible.has(l);
        l.classList.toggle("is-paused", !run);
      });
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var layer = e.target.querySelector(".float-bg");
          if (e.isIntersecting) visible.add(layer);
          else visible.delete(layer);
        });
        apply();
      });
      layers.forEach(function (l) {
        io.observe(l.parentNode);
      });
    } else {
      layers.forEach(function (l) {
        visible.add(l);
      });
      apply();
    }
    document.addEventListener("visibilitychange", apply);
  };
})();
