// workspace.js — a template page: form <-> notebook preview, hero, pager, print.
// Needs i18n.js and templates-data.js.

const TPL_ORDER = ["simple","priority","weekly","shopping","project","study","fitness","reading","work","goals","budget","meals","habits","event","travel","home","timeblock","notes","wellness","monthly"];

function initializeTemplateWorkspace() {
  const mount = document.getElementById("templateEditorMount");
  if (!mount) return;

  const templateType =
    document.body.dataset.tpl ||
    new URLSearchParams(window.location.search).get("type");
  if (!TEMPLATES[templateType]) {
    document.getElementById("templateWorkspace").hidden = true;
    const hero = document.querySelector(".tpl-hero");
    if (hero) hero.hidden = true;
    document.getElementById("workspaceTitle").textContent = t("workspace.notFound");
    document.title = `${t("workspace.notFound")} - ${t("brand")}`;
    document.getElementById("workspaceNotFound").hidden = false;
    return;
  }

  currentWorkspaceTemplate = templateType;
  document.body.dataset.tpl = templateType;
  mount.addEventListener("input", () => updateWorkspacePreview(templateType));
  mount.addEventListener("change", () => updateWorkspacePreview(templateType));

  // ticking a box in the notebook ticks it in the form too
  const preview = document.getElementById("workspacePreviewContent");
  if (preview) {
    preview.addEventListener("click", (e) => {
      const box = e.target.closest(".nb-box[data-cb]");
      if (!box) return;
      const cb = mount.querySelectorAll(".item-checkbox")[Number(box.dataset.cb)];
      if (!cb) return;
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
  renderTemplateWorkspace(templateType);
}

function renderTemplateHero(type) {
  const backArrow = document.querySelector(".workspace-back span[aria-hidden='true']");
  if (backArrow) backArrow.textContent = currentLang === "ar" ? "→" : "←";

  const title = document.getElementById("workspaceTitle");
  if (title) title.setAttribute("data-i18n", `tpl.${type}.title`);
  const desc = document.getElementById("tplHeroDesc");
  if (desc) {
    desc.setAttribute("data-i18n", `tpl.${type}.desc`);
    desc.textContent = t(`tpl.${type}.desc`);
  }
  const pager = document.getElementById("tplPager");
  if (pager) {
    const i = TPL_ORDER.indexOf(type);
    const prev = TPL_ORDER[(i - 1 + TPL_ORDER.length) % TPL_ORDER.length];
    const next = TPL_ORDER[(i + 1) % TPL_ORDER.length];
    const rtl = currentLang === "ar";
    pager.innerHTML =
      `<a class="pager-prev" href="template-${prev}.html"><small>${rtl ? "→ " : "← "}${escapeTemplateHTML(t("nav.prev"))}</small><strong>${escapeTemplateHTML(t("tpl." + prev + ".title"))}</strong></a>` +
      `<a class="pager-all" href="templates.html">${escapeTemplateHTML(t("workspace.browse"))}</a>` +
      `<a class="pager-next" href="template-${next}.html"><small>${escapeTemplateHTML(t("nav.next"))} ${rtl ? "←" : "→"}</small><strong>${escapeTemplateHTML(t("tpl." + next + ".title"))}</strong></a>`;
  }
}

function renderTemplateWorkspace(templateType, savedState = {}) {
  const template = TEMPLATES[templateType];
  const mount = document.getElementById("templateEditorMount");
  if (!template || !mount) return;

  mount.innerHTML = template.html;

  (savedState.lists || []).forEach(({ id, count }) => {
    const list = Array.from(mount.querySelectorAll(".items-list")).find(
      (itemList) => itemList.id === id,
    );
    if (!list || !list.lastElementChild) return;
    while (list.children.length < count) {
      list.appendChild(list.lastElementChild.cloneNode(true));
    }
    while (list.children.length > count) {
      list.lastElementChild.remove();
    }
  });

  const controls = mount.querySelectorAll("input, textarea, select");
  controls.forEach((control, index) => {
    const saved = savedState.controls?.[index];
    if (!saved) return;
    if (control.type === "checkbox") {
      control.checked = saved.checked;
    } else if (
      control.tagName === "SELECT" &&
      Number.isInteger(saved.selectedIndex)
    ) {
      control.selectedIndex = saved.selectedIndex;
    } else {
      control.value = saved.value;
    }
  });

  mount
    .querySelectorAll('.template-actions button[onclick^="generatePDFPreview"]')
    .forEach((button) => {
      button.hidden = true;
    });

  const cloudActions = document.createElement("div");
  cloudActions.className = "workspace-cloud-actions";
  cloudActions.innerHTML =
    `<button type="button" class="btn btn-outline">${escapeTemplateHTML(t("workspace.cloud.save"))}</button>` +
    `<button type="button" class="btn btn-outline">${escapeTemplateHTML(t("workspace.cloud.load"))}</button>` +
    `<button type="button" class="btn btn-outline" hidden>${escapeTemplateHTML(t("auth.logout"))}</button>` +
    `<p class="workspace-cloud-status" role="status" aria-live="polite"></p>`;
  const [saveButton, loadButton, signOutButton] =
    cloudActions.querySelectorAll("button");
  function setCloudStatus(key) {
    const status = mount.querySelector(".workspace-cloud-status");
    if (status) status.textContent = t(key);
  }
  saveButton.addEventListener("click", async () => {
    try {
      const client = await window.pydSupabaseReady;
      if (!client) {
        setCloudStatus("workspace.cloud.setup");
        return;
      }
      const { data, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const user = data.session && data.session.user;
      if (!user) {
        setCloudStatus("workspace.cloud.signIn");
        return;
      }
      const { error } = await client.from("planner_lists").upsert(
        {
          user_id: user.id,
          template_type: templateType,
          data: captureWorkspaceValues(),
        },
        { onConflict: "user_id,template_type" },
      );
      if (error) throw error;
      setCloudStatus("workspace.cloud.saved");
    } catch (error) {
      console.error("Could not save the planner list:", error);
      setCloudStatus("workspace.cloud.error");
    }
  });
  loadButton.addEventListener("click", async () => {
    try {
      const client = await window.pydSupabaseReady;
      if (!client) {
        setCloudStatus("workspace.cloud.setup");
        return;
      }
      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session && sessionData.session.user;
      if (!user) {
        setCloudStatus("workspace.cloud.signIn");
        return;
      }
      const { data, error } = await client
        .from("planner_lists")
        .select("data")
        .eq("user_id", user.id)
        .eq("template_type", templateType)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setCloudStatus("workspace.cloud.empty");
        return;
      }
      if (
        !data.data ||
        !Array.isArray(data.data.controls) ||
        !Array.isArray(data.data.lists)
      ) {
        throw new Error("Saved planner data has an invalid shape.");
      }
      renderTemplateWorkspace(templateType, data.data);
      setCloudStatus("workspace.cloud.loaded");
    } catch (error) {
      console.error("Could not load the planner list:", error);
      setCloudStatus("workspace.cloud.error");
    }
  });
  mount.querySelector(".template-actions")?.before(cloudActions);
  window.pydSupabaseReady.then(async (client) => {
    if (!client) {
      setCloudStatus("workspace.cloud.setup");
      return;
    }
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    signOutButton.hidden = !data.session;
    setCloudStatus(
      data.session ? "workspace.cloud.ready" : "workspace.cloud.signIn",
    );
  }).catch((error) => {
    console.error("Could not check the account session:", error);
    setCloudStatus("workspace.cloud.error");
  });
  signOutButton.addEventListener("click", async () => {
    try {
      const client = await window.pydSupabaseReady;
      if (!client) {
        setCloudStatus("workspace.cloud.setup");
        return;
      }
      const { error } = await client.auth.signOut();
      if (error) throw error;
      signOutButton.hidden = true;
      setCloudStatus("workspace.cloud.signIn");
    } catch (error) {
      console.error("Could not sign out:", error);
      setCloudStatus("workspace.cloud.error");
    }
  });

  if (templateType === "shopping" || templateType === "budget") {
    calculateTotal();
  }

  renderTemplateHero(templateType);
  document.getElementById("workspaceTitle").textContent = template.title;
  document.title = `${template.title} - ${t("brand")}`;
  updateWorkspacePreview(templateType);
}

function captureWorkspaceValues() {
  const mount = document.getElementById("templateEditorMount");
  if (!mount) return {};
  return {
    controls: Array.from(mount.querySelectorAll("input, textarea, select")).map(
      (control) => ({
        value: control.value,
        checked: control.type === "checkbox" ? control.checked : false,
        selectedIndex:
          control.tagName === "SELECT" ? control.selectedIndex : null,
      }),
    ),
    lists: Array.from(mount.querySelectorAll(".items-list")).map((list) => ({
      id: list.id,
      count: list.children.length,
    })),
  };
}

function nbFormatValue(input) {
  const v = input.value;
  if (!v) return "";
  const loc = currentLang === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-US";
  try {
    if (input.type === "date")
      return new Date(v + "T00:00:00").toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (input.type === "month")
      return new Date(v + "-01T00:00:00").toLocaleDateString(loc, { month: "long", year: "numeric" });
  } catch (err) {}
  return v;
}

function nbBlankRow() {
  return '<li class="nb-item nb-blank"><span class="nb-box" data-state="todo" aria-hidden="true"></span></li>';
}

function nbRow(row, ctx) {
  const e = escapeTemplateHTML;
  const timeEl = row.querySelector(":scope > span");
  const inputs = Array.from(row.querySelectorAll("input.item-input, textarea.item-input"));
  const select = row.querySelector("select");
  const cb = row.querySelector(".item-checkbox");
  const dayChecks = Array.from(row.querySelectorAll(".day-cb"));
  const filled = inputs.filter((i) => i.value.trim());
  const anyDay = dayChecks.some((d) => d.checked);
  if (!timeEl && !filled.length && !(cb && cb.checked) && !anyDay) return null;

  const main = inputs[0] ? inputs[0].value.trim() : "";
  const isMoney = row.classList.contains("shopping-item-row");
  let done = false;
  let lead = '<span class="nb-dot" aria-hidden="true"></span>';

  if (timeEl) {
    lead = `<span class="nb-time">${e(timeEl.textContent.trim())}</span>`;
  } else if (cb) {
    ctx.total++;
    if (cb.checked) ctx.done++;
    done = cb.checked;
    lead = `<button type="button" class="nb-box" role="checkbox" aria-checked="${cb.checked}" data-cb="${ctx.cbs.indexOf(cb)}" aria-label="${e(main)}"></button>`;
  } else if (select) {
    const st = select.selectedIndex;
    ctx.total++;
    if (st === 2) ctx.done++;
    done = st === 2;
    lead = `<span class="nb-box" data-state="${st === 2 ? "done" : st === 1 ? "half" : "todo"}" aria-hidden="true"></span>`;
  }

  let extras = "";
  inputs.slice(1).forEach((i) => {
    const val = i.value.trim();
    if (!val) return;
    if (isMoney && i.type === "number") extras += `<span class="nb-amount">${e(val)}</span>`;
    else extras += `<span class="nb-pill"><em>${e(i.getAttribute("placeholder") || "")}</em>${e(val)}</span>`;
  });
  if (select && (main || filled.length)) {
    const st = select.selectedIndex;
    extras += `<span class="nb-pill nb-st-${st}">${e(select.options[st].text)}</span>`;
  }
  if (dayChecks.length) {
    extras += `<span class="nb-days">${dayChecks.map((d) => `<span class="nb-day${d.checked ? " on" : ""}">${e(d.nextElementSibling.textContent)}</span>`).join("")}</span>`;
  }
  return `<li class="nb-item${done ? " is-done" : ""}">${lead}<span class="nb-text">${e(main)}</span>${extras ? `<span class="nb-extras">${extras}</span>` : ""}</li>`;
}

function nbList(listEl, ctx) {
  const rows = Array.from(listEl.children).map((r) => nbRow(r, ctx) || nbBlankRow());
  return `<ul class="nb-list">${rows.length ? rows.join("") : nbBlankRow()}</ul>`;
}

function nbSection(title, inner) {
  return `<section class="nb-section"><h4 class="nb-h"><span>${escapeTemplateHTML(title.trim())}</span></h4>${inner}</section>`;
}

function buildNotebook(editor, title, type) {
  const e = escapeTemplateHTML;
  const ctx = { done: 0, total: 0, cbs: Array.from(editor.querySelectorAll(".item-checkbox")) };
  const content = editor.querySelector(".editor-content");
  let meta = "", body = "", total = "";

  Array.from(content ? content.children : []).forEach((child) => {
    if (child.classList.contains("form-group")) {
      const label = (child.querySelector("label")?.textContent || "").replace(/[:：]\s*$/, "").trim();
      const ta = child.querySelector("textarea");
      const inp = child.querySelector("input");
      if (ta) {
        if (ta.value.trim()) body += `<div class="nb-note">${e(ta.value)}</div>`;
      } else if (inp && inp.value) {
        meta += `<div class="nb-meta-item"><span>${e(label)}</span><b>${e(nbFormatValue(inp))}</b></div>`;
      }
      return;
    }
    if (child.classList.contains("priority-section")) {
      const list = child.querySelector(".items-list");
      body += nbSection(child.querySelector("h3")?.textContent || "", list ? nbList(list, ctx) : "");
      return;
    }
    if (child.classList.contains("items-list") || child.classList.contains("time-list")) {
      body += nbList(child, ctx);
      return;
    }
    if (child.id === "total") {
      total = `<div class="nb-total">${e(child.textContent)}</div>`;
      return;
    }
    child.querySelectorAll(".day-card").forEach((card) => {
      const name = card.querySelector("h4")?.textContent || "";
      const list = card.querySelector(".items-list");
      if (list) {
        body += nbSection(name, nbList(list, ctx));
        return;
      }
      const meals = Array.from(card.querySelectorAll(".priority-section"))
        .map((sec) => {
          const v = sec.querySelector("input")?.value.trim();
          return v ? `<li class="nb-item"><span class="nb-meal">${e(sec.querySelector("h5")?.textContent || "")}</span><span class="nb-text">${e(v)}</span></li>` : "";
        })
        .filter(Boolean)
        .join("");
      body += nbSection(name, `<ul class="nb-list">${meals || nbBlankRow()}</ul>`);
    });
  });

  if (!body && !meta) body = `<p class="nb-empty">${e(t("pdf.empty"))}</p>`;
  const date = new Date().toLocaleDateString(currentLang === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-US");
  const pct = ctx.total ? Math.round((ctx.done / ctx.total) * 100) : 0;
  const progress = ctx.total
    ? `<div class="nb-progress"><span>${e(t("nb.progress", { done: ctx.done, total: ctx.total }))}</span><i style="--p:${pct}%"></i></div>`
    : "";

  return `<article class="notebook">
    <span class="nb-tape" aria-hidden="true"></span>
    <header class="nb-head">
      <p class="nb-created">${e(t("pdf.created"))}: ${e(date)}</p>
      <h3 class="nb-title">${e(title)}</h3>
      ${type && I18N["quote." + type] ? `<p class="nb-quote">${e(t("quote." + type))}</p>` : ""}
      ${progress}
    </header>
    <div class="nb-body">${meta ? `<div class="nb-meta">${meta}</div>` : ""}${body}${total}</div>
    <footer class="nb-foot">${e(t("brand"))}</footer>
  </article>`;
}

function updateWorkspacePreview(templateType) {
  const preview = document.getElementById("workspacePreviewContent");
  const editor = document.querySelector("#templateEditorMount .template-editor");
  if (!preview || !editor) return;
  if (templateType === "shopping" || templateType === "budget") calculateTotal();
  preview.innerHTML = buildNotebook(editor, TEMPLATES[templateType].title, templateType);
}

document.addEventListener("langchange", function () {
  TEMPLATES = buildTemplates();
  if (currentWorkspaceTemplate) {
    renderTemplateWorkspace(currentWorkspaceTemplate, captureWorkspaceValues());
  }
});

function addItem(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const existingRow = container.lastElementChild;
  let newRow;
  if (existingRow) {
    newRow = existingRow.cloneNode(true);
    newRow.querySelectorAll("input").forEach((input) => {
      if (input.type === "checkbox") input.checked = false;
      else input.value = "";
    });
    newRow.querySelectorAll("textarea").forEach((textarea) => {
      textarea.value = "";
    });
    newRow.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
    });
  } else {
    const fallback = document.createElement("div");
    fallback.innerHTML = `
      <div class="item-row">
        <input type="checkbox" class="item-checkbox">
        <input type="text" class="item-input" placeholder="${t("ed.ph.data")}">
        <button class="btn-remove" onclick="removeItem(this)">✕</button>
      </div>
    `;
    newRow = fallback.firstElementChild;
  }
  container.appendChild(newRow);

  // Focus the new input
  const newInput = newRow.querySelector(".item-input, textarea");
  newInput?.focus();
  if (containerId === "shopping" || containerId === "budget") calculateTotal();
  if (currentWorkspaceTemplate)
    updateWorkspacePreview(currentWorkspaceTemplate);
}

function removeItem(button) {
  button
    .closest(
      ".item-row, .shopping-item-row, .project-item-row, .study-item-row",
    )
    ?.remove();
  if (currentWorkspaceTemplate)
    updateWorkspacePreview(currentWorkspaceTemplate);
}

function calculateTotal() {
  const inputs = document.querySelectorAll(
    '.shopping-item-row input[type="number"], #budget input[type="number"]',
  );
  const total = Array.from(inputs).reduce(
    (sum, input) => sum + (parseFloat(input.value) || 0),
    0,
  );
  const el = document.getElementById("total");
  if (el) el.textContent = t("total.label", { n: total.toFixed(2) });
}

// ======================== PDF PREVIEW ========================
function generatePDFPreview(templateType) {
  if (document.getElementById("workspacePreviewContent")) {
    updateWorkspacePreview(templateType);
  }
}

function escapeTemplateHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function downloadPDF(templateType) {
  const nb = document.querySelector("#workspacePreviewContent .notebook");
  if (!nb) return;
  const clone = nb.cloneNode(true);
  clone.querySelectorAll("button").forEach((b) => {
    const span = document.createElement("span");
    span.className = b.className;
    span.setAttribute("aria-checked", b.getAttribute("aria-checked") || "false");
    b.replaceWith(span);
  });
  const cssHref = new URL("../css/style.css", window.location.href).href;
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const name = (TEMPLATES[templateType] && TEMPLATES[templateType].title) || templateType;
  printWindow.document.write(`<!DOCTYPE html>
<html lang="${currentLang}" dir="${currentLang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="UTF-8">
<title>${t("brand")} - ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${cssHref}">
</head>
<body class="print-sheet" data-tpl="${templateType}">
${clone.outerHTML}
<script>window.addEventListener("load", function () { setTimeout(function () { window.focus(); window.print(); }, 300); });<\/script>
</body>
</html>`);
  printWindow.document.close();
}
