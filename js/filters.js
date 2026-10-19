// filters.js — templates.html: category groups, search, filter chips, count.

function initializeTemplateFilters() {
  var grid = document.querySelector(".templates-grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll(".template-card"),
  );
  if (!cards.length) return;

  // Map each template id (from the button's onclick) to a category.
  var CATS = {
    simple: "daily",
    priority: "daily",
    weekly: "daily",
    goals: "daily",
    habits: "daily",
    timeblock: "daily",
    notes: "daily",
    monthly: "daily",
    project: "work",
    study: "work",
    work: "work",
    budget: "work",
    shopping: "life",
    fitness: "life",
    reading: "life",
    meals: "life",
    home: "life",
    wellness: "life",
    event: "events",
    travel: "events",
  };
  var ORDER = ["daily", "work", "life", "events"];

  cards.forEach(function (card) {
    var b = card.querySelector("button[onclick]");
    var id = null;
    if (b) {
      var m = (b.getAttribute("onclick") || "").match(
        /openTemplate\(\s*['"]([^'"]+)['"]/,
      );
      if (m) id = m[1];
    }
    card.setAttribute("data-category", (id && CATS[id]) || "daily");
    card.setAttribute("data-id", id || "simple");
  });

  // Turn every card into a small paper sheet: icon + title + quote, button underneath
  cards.forEach(function (card) {
    var id = card.getAttribute("data-id");
    var paper = document.createElement("div");
    paper.className = "tpl-paper";
    var icon = card.querySelector(".template-icon");
    var h3 = card.querySelector("h3");
    var desc = card.querySelector(".template-desc");
    var quote = document.createElement("p");
    quote.className = "tpl-quote";
    quote.setAttribute("data-i18n", "quote." + id);
    quote.textContent = typeof t === "function" ? t("quote." + id) : "";
    [icon, h3, desc, quote].forEach(function (el) {
      if (el) paper.appendChild(el);
    });
    card.insertBefore(paper, card.firstChild);
    var btn = card.querySelector("button");
    if (btn) {
      btn.setAttribute("data-i18n", "btn.plan");
      btn.textContent = typeof t === "function" ? t("btn.plan") : "Plan now";
      paper.addEventListener("click", function () {
        btn.click();
      });
    }
  });

  // Build one titled group per category and move the cards into them
  var host = grid.parentNode;
  var groups = {};
  ORDER.forEach(function (cat) {
    var wrap = document.createElement("div");
    wrap.className = "tpl-group";
    wrap.setAttribute("data-group", cat);
    var h = document.createElement("h3");
    h.className = "tpl-group-title";
    var name = document.createElement("span");
    name.className = "tpl-group-name";
    var count = document.createElement("span");
    count.className = "tpl-group-count";
    h.appendChild(name);
    h.appendChild(count);
    var g = document.createElement("div");
    g.className = "templates-grid";
    wrap.appendChild(h);
    wrap.appendChild(g);
    host.insertBefore(wrap, grid);
    groups[cat] = { wrap: wrap, name: name, count: count, grid: g };
  });
  cards.forEach(function (card) {
    groups[card.getAttribute("data-category")].grid.appendChild(card);
  });
  host.removeChild(grid);

  var search = document.getElementById("tplSearch");
  var clearBtn = document.getElementById("tplSearchClear");
  var chips = Array.prototype.slice.call(
    document.querySelectorAll(".filter-chips .chip"),
  );
  var activeFilter = "all";
  var empty = null;

  function apply() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var perGroup = {};

    cards.forEach(function (card) {
      var cat = card.getAttribute("data-category") || "daily";
      var matchCat = activeFilter === "all" || cat === activeFilter;
      var matchQ = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
      var ok = matchCat && matchQ;
      card.style.display = ok ? "" : "none";
      if (ok) {
        perGroup[cat] = (perGroup[cat] || 0) + 1;
      }
    });

    ORDER.forEach(function (cat) {
      var g = groups[cat];
      var n = perGroup[cat] || 0;
      g.wrap.style.display = n ? "" : "none";
      g.count.textContent = n;
      if (typeof t === "function")
        g.name.textContent = t("templates.filter." + cat);
    });

    if (Object.keys(perGroup).length === 0) {
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "templates-empty";
        host.appendChild(empty);
      }
      empty.textContent =
        typeof t === "function"
          ? t("templates.empty")
          : "No matching templates.";
    } else if (empty) {
      empty.parentNode.removeChild(empty);
      empty = null;
    }

    if (clearBtn) clearBtn.hidden = q.length === 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.toggle("active", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      activeFilter = chip.getAttribute("data-filter") || "all";
      apply();
    });
  });

  if (search) {
    search.addEventListener("input", apply);
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (search) {
        search.value = "";
        search.focus();
      }
      apply();
    });
  }

  document.addEventListener("langchange", apply);

  apply();
}
