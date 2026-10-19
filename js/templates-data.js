// templates-data.js — the 20 template editors (HTML builders) and openTemplate().
// Needs i18n.js (t). Used by templates.html and every template page.

// ======================== TEMPLATE SYSTEM ========================
let TEMPLATES = buildTemplates();

function buildTemplates() {
  return {
    simple: {
      title: t("tpl.simple.title"),
      html: `
            <div class="template-editor">
                <h2>📋 ${t("tpl.simple.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.date")}</label>
                        <input type="date" class="template-input" id="date">
                    </div>
                    <div class="items-list" id="items">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.task")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('items')">${t("ed.addTask")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('simple')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('simple')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    priority: {
      title: t("tpl.priority.title"),
      html: `
            <div class="template-editor">
                <h2>⭐ ${t("tpl.priority.title")}</h2>
                <div class="editor-content">
                    <div class="priority-section">
                        <h3>${t("ed.section.urgent")}</h3>
                        <div class="items-list" id="urgent">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="${t("ed.ph.urgent")}">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('urgent')">${t("ed.add")}</button>
                    </div>
                    
                    <div class="priority-section">
                        <h3>${t("ed.section.medium")}</h3>
                        <div class="items-list" id="medium">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="${t("ed.ph.medium")}">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('medium')">${t("ed.add")}</button>
                    </div>

                    <div class="priority-section">
                        <h3>${t("ed.section.low")}</h3>
                        <div class="items-list" id="low">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="${t("ed.ph.low")}">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('low')">${t("ed.add")}</button>
                    </div>

                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('priority')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('priority')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    weekly: { title: t("tpl.weekly.title"), html: getWeeklyTemplate() },
    shopping: {
      title: t("tpl.shopping.title"),
      html: `
            <div class="template-editor">
                <h2>🛒 ${t("tpl.shopping.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.date")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="shopping">
                        <div class="shopping-item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.product")}">
                            <input type="number" class="item-input" style="width: 100px; flex: none;" placeholder="${t("ed.ph.price")}" onchange="calculateTotal()">
                            <button class="btn-remove" onclick="removeItem(this); calculateTotal()">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('shopping')">${t("ed.addProduct")}</button>
                    <div style="padding: 14px; background: var(--accent-soft); border-radius: 10px; margin: 14px 0; font-weight: 700; text-align: center; color: var(--ink);" id="total">${t("total.sum", { n: 0 })}</div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('shopping')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('shopping')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    project: {
      title: t("tpl.project.title"),
      html: `
            <div class="template-editor">
                <h2>🚀 ${t("tpl.project.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.projectName")}</label>
                        <input type="text" class="template-input" placeholder="${t("ed.ph.project")}">
                    </div>
                    <div class="items-list" id="project">
                        <div class="project-item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.taskShort")}">
                            <select class="status-select">
                                <option>${t("ed.status.notStarted")}</option>
                                <option>${t("ed.status.inProgress")}</option>
                                <option>${t("ed.status.completed")}</option>
                            </select>
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('project')">${t("ed.addTask")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('project')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('project')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    study: {
      title: t("tpl.study.title"),
      html: `
            <div class="template-editor">
                <h2>📚 ${t("tpl.study.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.dateFrom")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="study">
                        <div class="study-item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.subject")}">
                            <input type="number" class="item-input" style="width: 90px; flex: none;" placeholder="${t("ed.ph.hours")}">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.remarks")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('study')">${t("ed.addStudy")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('study')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('study')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    fitness: {
      title: t("tpl.fitness.title"),
      html: `
            <div class="template-editor">
                <h2>💪 ${t("tpl.fitness.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.weekFrom")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="fitness">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.exercise")}">
                            <input type="text" class="item-input" style="width: 110px; flex: none;" placeholder="${t("ed.ph.duration")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('fitness')">${t("ed.addExercise")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('fitness')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('fitness')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    reading: {
      title: t("tpl.reading.title"),
      html: `
            <div class="template-editor">
                <h2>📖 ${t("tpl.reading.title")}</h2>
                <div class="editor-content">
                    <div class="items-list" id="reading">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.book")}">
                            <input type="text" class="item-input" style="width: 100px; flex: none;" placeholder="${t("ed.ph.author")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('reading')">${t("ed.addBook")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('reading')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('reading')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    work: {
      title: t("tpl.work.title"),
      html: `
            <div class="template-editor">
                <h2>💼 ${t("tpl.work.title")}</h2>
                <div class="editor-content">
                    <div class="items-list" id="work">
                        <div class="project-item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.project")}">
                            <select class="status-select">
                                <option>${t("ed.status.pending")}</option>
                                <option>${t("ed.status.inProgress")}</option>
                                <option>${t("ed.status.done")}</option>
                            </select>
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('work')">${t("ed.addProject")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('work')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('work')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    goals: {
      title: t("tpl.goals.title"),
      html: `
            <div class="template-editor">
                <h2>🎯 ${t("tpl.goals.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.timeline")}</label>
                        <input type="text" class="template-input" placeholder="${t("ed.ph.timeline")}">
                    </div>
                    <div class="items-list" id="goals">
                        <div class="item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.goal")}">
                            <input type="text" class="item-input" style="width: 120px; flex: none;" placeholder="${t("ed.ph.deadline")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('goals')">${t("ed.addGoal")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('goals')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('goals')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    budget: {
      title: t("tpl.budget.title"),
      html: `
            <div class="template-editor">
                <h2>💰 ${t("tpl.budget.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.month")}</label>
                        <input type="month" class="template-input">
                    </div>
                    <div class="items-list" id="budget">
                        <div class="shopping-item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.entry")}">
                            <input type="number" class="item-input" style="width: 100px; flex: none;" placeholder="${t("ed.ph.amount")}" onchange="calculateTotal()">
                            <button class="btn-remove" onclick="removeItem(this); calculateTotal()">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('budget')">${t("ed.addEntry")}</button>
                    <div style="padding: 14px; background: var(--accent-soft); border-radius: 10px; margin: 14px 0; font-weight: 700; text-align: center; color: var(--ink);" id="total">${t("total.label", { n: 0 })}</div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('budget')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('budget')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    meals: { title: t("tpl.meals.title"), html: getWeeklyMealsTemplate() },
    habits: {
      title: t("tpl.habits.title"),
      html: `
            <div class="template-editor">
                <h2>🔄 ${t("tpl.habits.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.weekFrom")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="habits">
                        <div class="item-row habit-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.habit")}" style="flex: 2;">
                            <div class="day-checks" role="group">
                                ${["sat", "sun", "mon", "tue", "wed", "thu", "fri"]
                                  .map((d) => `<label class="day-check" title="${t("day." + d)}"><input type="checkbox" class="day-cb"><span>${t("dayS." + d)}</span></label>`)
                                  .join("")}
                            </div>
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('habits')">${t("ed.addHabit")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('habits')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('habits')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    event: {
      title: t("tpl.event.title"),
      html: `
            <div class="template-editor">
                <h2>🎉 ${t("tpl.event.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.eventName")}</label>
                        <input type="text" class="template-input" placeholder="${t("ed.ph.event")}">
                    </div>
                    <div class="form-group">
                        <label>${t("ed.date")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="event">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.taskShort")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('event')">${t("ed.addTask")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('event')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('event')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    travel: {
      title: t("tpl.travel.title"),
      html: `
            <div class="template-editor">
                <h2>✈️ ${t("tpl.travel.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.destination")}</label>
                        <input type="text" class="template-input" placeholder="${t("ed.ph.destination")}">
                    </div>
                    <div class="items-list" id="travel">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.pack")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('travel')">${t("ed.add")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('travel')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('travel')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    home: {
      title: t("tpl.home.title"),
      html: `
            <div class="template-editor">
                <h2>🏠 ${t("tpl.home.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.month")}</label>
                        <input type="month" class="template-input">
                    </div>
                    <div class="items-list" id="home">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.maintenance")}">
                            <input type="text" class="item-input" style="width: 120px; flex: none;" placeholder="${t("ed.ph.due")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('home')">${t("ed.add")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('home')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('home')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    timeblock: {
      title: t("tpl.timeblock.title"),
      html: getTimeBlockTemplate(),
    },
    notes: {
      title: t("tpl.notes.title"),
      html: `
            <div class="template-editor">
                <h2>💡 ${t("tpl.notes.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.date")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="form-group">
                        <label>${t("ed.topic")}</label>
                        <input type="text" class="template-input" placeholder="${t("ed.ph.ideaTopic")}">
                    </div>
                    <div class="form-group">
                        <label>${t("ed.notesLabel")}</label>
                        <textarea class="item-input" style="width: 100%; height: 280px; padding: 15px; resize: vertical;" placeholder="${t("ed.ph.ideas")}"></textarea>
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('notes')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('notes')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    wellness: {
      title: t("tpl.wellness.title"),
      html: `
            <div class="template-editor">
                <h2>💚 ${t("tpl.wellness.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.weekFrom")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="wellness">
                        <div class="item-row">
                            <input type="text" class="item-input" placeholder="${t("ed.ph.metric")}" style="flex: 2;">
                            <input type="text" class="item-input" style="width: 80px; flex: none;" placeholder="${t("ed.ph.value")}">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('wellness')">${t("ed.addMetric")}</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('wellness')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('wellness')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
    monthly: {
      title: t("tpl.monthly.title"),
      html: `
            <div class="template-editor">
                <h2>📊 ${t("tpl.monthly.title")}</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>${t("ed.month")}</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="priority-section">
                        <h3>${t("ed.section.achievements")}</h3>
                        <div class="items-list" id="achievements">
                            <div class="item-row">
                                <input type="text" class="item-input" placeholder="${t("ed.ph.achievement")}">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('achievements')">${t("ed.add")}</button>
                    </div>
                    <div class="priority-section">
                        <h3>${t("ed.section.challenges")}</h3>
                        <div class="items-list" id="challenges">
                            <div class="item-row">
                                <input type="text" class="item-input" placeholder="${t("ed.ph.challenge")}">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('challenges')">${t("ed.add")}</button>
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('monthly')">👁️ ${t("ed.preview")}</button>
                        <button class="btn btn-outline" onclick="downloadPDF('monthly')">📥 ${t("ed.download")}</button>
                    </div>
                </div>
            </div>
        `,
    },
  };
}

// ======================== TEMPLATE HELPERS ========================
function getWeeklyTemplate() {
  const days = [
    ["sat", t("day.sat")],
    ["sun", t("day.sun")],
    ["mon", t("day.mon")],
    ["tue", t("day.tue")],
    ["wed", t("day.wed")],
    ["thu", t("day.thu")],
    ["fri", t("day.fri")],
  ];
  let html = `<div class="template-editor"><h2>📅 ${t("tpl.weekly.title")}</h2><div class="editor-content"><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">`;

  days.forEach(([dayId, dayLabel]) => {
    html += `
            <div class="day-card">
                <h4 style="color: var(--ink); margin-bottom: 12px; font-weight: 700;">${dayLabel}</h4>
                <div class="items-list" id="day-${dayId}">
                    <div class="item-row">
                        <input type="checkbox" class="item-checkbox">
                        <input type="text" class="item-input" placeholder="${t("ed.ph.dayTask")}">
                        <button class="btn-remove" onclick="removeItem(this)">✕</button>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="addItem('day-${dayId}')">${t("ed.add")}</button>
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('weekly')">👁️ ${t("ed.preview")}</button>
            <button class="btn btn-outline" onclick="downloadPDF('weekly')">📥 ${t("ed.download")}</button>
        </div>
        </div></div>`;
  return html;
}

function getWeeklyMealsTemplate() {
  const days = [
    ["sat", t("day.sat")],
    ["sun", t("day.sun")],
    ["mon", t("day.mon")],
    ["tue", t("day.tue")],
    ["wed", t("day.wed")],
    ["thu", t("day.thu")],
    ["fri", t("day.fri")],
  ];
  let html = `<div class="template-editor"><h2>🍽️ ${t("tpl.meals.title")}</h2><div class="editor-content"><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">`;

  days.forEach(([dayId, dayLabel]) => {
    html += `
            <div class="day-card">
                <h4 style="color: var(--ink); margin-bottom: 12px; font-weight: 700;">${dayLabel}</h4>
                <div class="priority-section" style="margin: 0 0 10px; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">${t("ed.breakfast")}</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="${t("ed.ph.meal")}">
                </div>
                <div class="priority-section" style="margin: 0 0 10px; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">${t("ed.lunch")}</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="${t("ed.ph.meal")}">
                </div>
                <div class="priority-section" style="margin: 0; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">${t("ed.dinner")}</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="${t("ed.ph.meal")}">
                </div>
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('meals')">👁️ ${t("ed.preview")}</button>
            <button class="btn btn-outline" onclick="downloadPDF('meals')">📥 ${t("ed.download")}</button>
        </div>
        </div></div>`;
  return html;
}

function getTimeBlockTemplate() {
  const hours = [
    "6:00",
    "7:00",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];
  let html = `<div class="template-editor"><h2>⏰ ${t("tpl.timeblock.title")}</h2><div class="editor-content">
        <div class="form-group"><label>${t("ed.date")}</label><input type="date" class="template-input"></div>
        <div class="time-list">`;

  hours.forEach((hour) => {
    html += `
            <div class="item-row" style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--border);">
                <span style="width: 65px; font-weight: 700; color: var(--accent, var(--brand)); flex-shrink: 0; font-size: 0.95rem;">${hour}</span>
                <input type="text" class="item-input" placeholder="${t("ed.ph.activity")}" style="flex: 1;">
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('timeblock')">👁️ ${t("ed.preview")}</button>
            <button class="btn btn-outline" onclick="downloadPDF('timeblock')">📥 ${t("ed.download")}</button>
        </div>
        </div></div>`;
  return html;
}


// ======================== TEMPLATE FUNCTIONS ========================
let currentWorkspaceTemplate = null;

function openTemplate(templateType) {
  if (!TEMPLATES[templateType]) return;
  window.location.href = `template-${encodeURIComponent(templateType)}.html`;
}
