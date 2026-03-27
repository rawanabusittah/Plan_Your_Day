// ======================== INITIALIZATION ========================
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeEventListeners();
  initializeLightToggle();
  initializeThemeToggle();
  initializeScrollReveal();
  console.log("✨ منصة خطط ليومك - تم التحميل بنجاح");
});

// ======================== NAVIGATION ========================
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger) return;

  hamburger.addEventListener("click", toggleMobileMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) closeMobileMenu();
  });
}

function toggleMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function closeMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  navLinks.classList.remove("active");
  hamburger?.classList.remove("active");
}

// ======================== EVENT LISTENERS ========================
function initializeEventListeners() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

// ======================== CONTACT FORM ========================
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const formMsg = document.getElementById("formMessage");

  if (!name || !email || !subject || !message) {
    showMessage("يرجى ملء جميع الحقول", "error", formMsg);
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("البريد الإلكتروني غير صحيح", "error", formMsg);
    return;
  }

  if (message.length < 10) {
    showMessage("الرسالة قصيرة جداً (10 أحرف على الأقل)", "error", formMsg);
    return;
  }

  showMessage(
    "✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً",
    "success",
    formMsg,
  );
  document.getElementById("contactForm").reset();

  setTimeout(() => {
    formMsg.className = "form-message";
    formMsg.textContent = "";
  }, 6000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type, element) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${type}`;
}

// ======================== LIGHT TOGGLE (LAMP) ========================
function initializeLightToggle() {
  const lightToggle = document.getElementById("lightToggle");
  const contactCards = document.querySelectorAll(".contact-card");
  if (!lightToggle) return;

  lightToggle.addEventListener("click", function () {
    const isOn = lightToggle.classList.toggle("active");

    contactCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.toggle("revealed", isOn);
      }, i * 100);
    });

    console.log(`💡 المصباح ${isOn ? "مضاء" : "مطفأ"}`);
  });
}

// ======================== THEME TOGGLE ========================
function initializeThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.title = "تبديل الوضع الليلي/النهاري";
  document.body.appendChild(themeToggle);

  const savedTheme = localStorage.getItem("theme") || "light";
  const isDark = savedTheme === "dark";
  document.documentElement.classList.toggle("dark-mode", isDark);
  themeToggle.innerHTML = isDark ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    const nowDark = document.documentElement.classList.toggle("dark-mode");
    themeToggle.innerHTML = nowDark ? "☀️" : "🌙";
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  });
}

// ======================== SCROLL REVEAL ========================
function initializeScrollReveal() {
  // Add data-reveal to major elements
  const selectors = [
    ".feature-card",
    ".step",
    ".template-card",
    ".template-preview-card",
    ".about-card",
    ".contact-card",
    ".hero-text",
    ".hero-animation",
    ".section-title",
    ".section-subtitle",
  ];

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
        const delay = Math.min(i % 4, 3);
        if (delay > 0) el.setAttribute("data-reveal-delay", delay);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    observer.observe(el);
  });
}

// ======================== TEMPLATE SYSTEM ========================
const TEMPLATES = {
  simple: {
    title: "قائمة يومية بسيطة",
    html: `
            <div class="template-editor">
                <h2>📋 قائمة يومية بسيطة</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>التاريخ:</label>
                        <input type="date" class="template-input" id="date">
                    </div>
                    <div class="items-list" id="items">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="أدخل المهمة">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('items')">+ إضافة مهمة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('simple')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('simple')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  priority: {
    title: "الأولويات الثلاث",
    html: `
            <div class="template-editor">
                <h2>⭐ الأولويات الثلاث</h2>
                <div class="editor-content">
                    <div class="priority-section">
                        <h3>🔴 المهام العاجلة</h3>
                        <div class="items-list" id="urgent">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="مهمة عاجلة">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('urgent')">+ إضافة</button>
                    </div>
                    
                    <div class="priority-section">
                        <h3>🟡 المهام المتوسطة</h3>
                        <div class="items-list" id="medium">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="مهمة متوسطة">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('medium')">+ إضافة</button>
                    </div>

                    <div class="priority-section">
                        <h3>🟢 المهام المنخفضة</h3>
                        <div class="items-list" id="low">
                            <div class="item-row">
                                <input type="checkbox" class="item-checkbox">
                                <input type="text" class="item-input" placeholder="مهمة منخفضة">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('low')">+ إضافة</button>
                    </div>

                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('priority')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('priority')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  weekly: { title: "خطة أسبوعية", html: getWeeklyTemplate() },
  shopping: {
    title: "قائمة التسوق",
    html: `
            <div class="template-editor">
                <h2>🛒 قائمة التسوق</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>التاريخ:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="shopping">
                        <div class="shopping-item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="المنتج">
                            <input type="number" class="item-input" style="width: 100px; flex: none;" placeholder="السعر" onchange="calculateTotal()">
                            <button class="btn-remove" onclick="removeItem(this); calculateTotal()">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('shopping')">+ إضافة منتج</button>
                    <div style="padding: 14px; background: rgba(200,106,142,0.12); border-radius: 10px; margin: 14px 0; font-weight: 700; text-align: center; color: var(--primary-dark);" id="total">المجموع: 0 ل.س</div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('shopping')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('shopping')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  project: {
    title: "إدارة المشروع",
    html: `
            <div class="template-editor">
                <h2>🚀 إدارة المشروع</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>اسم المشروع:</label>
                        <input type="text" class="template-input" placeholder="اسم المشروع">
                    </div>
                    <div class="items-list" id="project">
                        <div class="project-item-row">
                            <input type="text" class="item-input" placeholder="المهمة">
                            <select class="status-select">
                                <option>لم تبدأ</option>
                                <option>قيد التنفيذ</option>
                                <option>مكتملة</option>
                            </select>
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('project')">+ إضافة مهمة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('project')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('project')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  study: {
    title: "جدول الدراسة",
    html: `
            <div class="template-editor">
                <h2>📚 جدول الدراسة</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>من التاريخ:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="study">
                        <div class="study-item-row">
                            <input type="text" class="item-input" placeholder="الموضوع/المادة">
                            <input type="number" class="item-input" style="width: 90px; flex: none;" placeholder="ساعات">
                            <input type="text" class="item-input" placeholder="ملاحظات">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('study')">+ إضافة دراسة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('study')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('study')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  fitness: {
    title: "أهدافك الرياضية",
    html: `
            <div class="template-editor">
                <h2>💪 أهدافك الرياضية</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الأسبوع من:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="fitness">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="التمرين">
                            <input type="text" class="item-input" style="width: 110px; flex: none;" placeholder="المدة">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('fitness')">+ إضافة تمرين</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('fitness')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('fitness')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  reading: {
    title: "قائمة القراءة",
    html: `
            <div class="template-editor">
                <h2>📖 قائمة القراءة</h2>
                <div class="editor-content">
                    <div class="items-list" id="reading">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="اسم الكتاب">
                            <input type="text" class="item-input" style="width: 100px; flex: none;" placeholder="الكاتب">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('reading')">+ إضافة كتاب</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('reading')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('reading')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  work: {
    title: "مشاريع العمل",
    html: `
            <div class="template-editor">
                <h2>💼 مشاريع العمل</h2>
                <div class="editor-content">
                    <div class="items-list" id="work">
                        <div class="project-item-row">
                            <input type="text" class="item-input" placeholder="اسم المشروع">
                            <select class="status-select">
                                <option>في الانتظار</option>
                                <option>قيد التنفيذ</option>
                                <option>مكتمل</option>
                            </select>
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('work')">+ إضافة مشروع</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('work')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('work')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  goals: {
    title: "تحديد الأهداف",
    html: `
            <div class="template-editor">
                <h2>🎯 تحديد الأهداف</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الفترة الزمنية:</label>
                        <input type="text" class="template-input" placeholder="مثال: 3 أشهر">
                    </div>
                    <div class="items-list" id="goals">
                        <div class="item-row">
                            <input type="text" class="item-input" placeholder="الهدف">
                            <input type="text" class="item-input" style="width: 120px; flex: none;" placeholder="الموعد النهائي">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('goals')">+ إضافة هدف</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('goals')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('goals')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  budget: {
    title: "تتبع الميزانية",
    html: `
            <div class="template-editor">
                <h2>💰 تتبع الميزانية</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الشهر:</label>
                        <input type="month" class="template-input">
                    </div>
                    <div class="items-list" id="budget">
                        <div class="shopping-item-row">
                            <input type="text" class="item-input" placeholder="البند">
                            <input type="number" class="item-input" style="width: 100px; flex: none;" placeholder="المبلغ" onchange="calculateTotal()">
                            <button class="btn-remove" onclick="removeItem(this); calculateTotal()">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('budget')">+ إضافة بند</button>
                    <div style="padding: 14px; background: rgba(200,106,142,0.12); border-radius: 10px; margin: 14px 0; font-weight: 700; text-align: center; color: var(--primary-dark);" id="total">الإجمالي: 0 ل.س</div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('budget')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('budget')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  meals: { title: "خطة الوجبات", html: getWeeklyMealsTemplate() },
  habits: {
    title: "متتبع العادات",
    html: `
            <div class="template-editor">
                <h2>🔄 متتبع العادات</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الأسبوع من:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="habits">
                        <div class="item-row">
                            <input type="text" class="item-input" placeholder="العادة" style="flex: 2;">
                            <input type="checkbox"> السبت
                            <input type="checkbox"> الأحد
                            <input type="checkbox"> الاثنين
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('habits')">+ إضافة عادة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('habits')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('habits')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  event: {
    title: "تخطيط الحفل",
    html: `
            <div class="template-editor">
                <h2>🎉 تخطيط الحفل</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>اسم الحفل:</label>
                        <input type="text" class="template-input" placeholder="اسم الحفل">
                    </div>
                    <div class="form-group">
                        <label>التاريخ:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="event">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="المهمة">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('event')">+ إضافة مهمة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('event')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('event')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  travel: {
    title: "قائمة السفر",
    html: `
            <div class="template-editor">
                <h2>✈️ قائمة السفر</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الوجهة:</label>
                        <input type="text" class="template-input" placeholder="الوجهة">
                    </div>
                    <div class="items-list" id="travel">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="الشيء المراد حمله">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('travel')">+ إضافة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('travel')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('travel')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  home: {
    title: "صيانة المنزل",
    html: `
            <div class="template-editor">
                <h2>🏠 صيانة المنزل</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الشهر:</label>
                        <input type="month" class="template-input">
                    </div>
                    <div class="items-list" id="home">
                        <div class="item-row">
                            <input type="checkbox" class="item-checkbox">
                            <input type="text" class="item-input" placeholder="عملية الصيانة">
                            <input type="text" class="item-input" style="width: 120px; flex: none;" placeholder="الموعد">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('home')">+ إضافة</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('home')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('home')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  timeblock: { title: "تقسيم الوقت", html: getTimeBlockTemplate() },
  notes: {
    title: "الأفكار والملاحظات",
    html: `
            <div class="template-editor">
                <h2>💡 الأفكار والملاحظات</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>التاريخ:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="form-group">
                        <label>الموضوع:</label>
                        <input type="text" class="template-input" placeholder="موضوع الأفكار">
                    </div>
                    <div class="form-group">
                        <label>الملاحظات:</label>
                        <textarea class="item-input" style="width: 100%; height: 280px; padding: 15px; resize: vertical;" placeholder="اكتب أفكارك بحرية..."></textarea>
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('notes')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('notes')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  wellness: {
    title: "تتبع الصحة",
    html: `
            <div class="template-editor">
                <h2>💚 تتبع الصحة</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الأسبوع من:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="items-list" id="wellness">
                        <div class="item-row">
                            <input type="text" class="item-input" placeholder="المؤشر الصحي" style="flex: 2;">
                            <input type="text" class="item-input" style="width: 80px; flex: none;" placeholder="القيمة">
                            <button class="btn-remove" onclick="removeItem(this)">✕</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addItem('wellness')">+ إضافة مؤشر</button>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('wellness')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('wellness')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
  monthly: {
    title: "مراجعة شهرية",
    html: `
            <div class="template-editor">
                <h2>📊 مراجعة شهرية</h2>
                <div class="editor-content">
                    <div class="form-group">
                        <label>الشهر:</label>
                        <input type="date" class="template-input">
                    </div>
                    <div class="priority-section">
                        <h3>✨ الإنجازات</h3>
                        <div class="items-list" id="achievements">
                            <div class="item-row">
                                <input type="text" class="item-input" placeholder="إنجاز">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('achievements')">+ إضافة</button>
                    </div>
                    <div class="priority-section">
                        <h3>💪 التحديات</h3>
                        <div class="items-list" id="challenges">
                            <div class="item-row">
                                <input type="text" class="item-input" placeholder="تحدي واجهته">
                                <button class="btn-remove" onclick="removeItem(this)">✕</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addItem('challenges')">+ إضافة</button>
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-primary" onclick="generatePDFPreview('monthly')">👁️ مشاهدة</button>
                        <button class="btn btn-outline" onclick="downloadPDF('monthly')">📥 تحميل</button>
                    </div>
                </div>
            </div>
        `,
  },
};

// ======================== TEMPLATE HELPERS ========================
function getWeeklyTemplate() {
  const days = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  let html = `<div class="template-editor"><h2>📅 خطة أسبوعية</h2><div class="editor-content"><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">`;

  days.forEach((day) => {
    html += `
            <div style="padding: 18px; background: var(--rose-50); border-radius: 14px; border: 1.5px solid var(--border);">
                <h4 style="color: var(--primary-dark); margin-bottom: 12px; font-weight: 700;">${day}</h4>
                <div class="items-list" id="${day}">
                    <div class="item-row">
                        <input type="checkbox" class="item-checkbox">
                        <input type="text" class="item-input" placeholder="مهمة">
                        <button class="btn-remove" onclick="removeItem(this)">✕</button>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="addItem('${day}')">+ إضافة</button>
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('weekly')">👁️ مشاهدة</button>
            <button class="btn btn-outline" onclick="downloadPDF('weekly')">📥 تحميل</button>
        </div>
        </div></div>`;
  return html;
}

function getWeeklyMealsTemplate() {
  const days = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  let html = `<div class="template-editor"><h2>🍽️ خطة الوجبات</h2><div class="editor-content"><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">`;

  days.forEach((day) => {
    html += `
            <div style="padding: 18px; background: var(--rose-50); border-radius: 14px; border: 1.5px solid var(--border);">
                <h4 style="color: var(--primary-dark); margin-bottom: 12px; font-weight: 700;">${day}</h4>
                <div class="priority-section" style="margin: 0 0 10px; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">الإفطار</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="الوجبة">
                </div>
                <div class="priority-section" style="margin: 0 0 10px; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">الغداء</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="الوجبة">
                </div>
                <div class="priority-section" style="margin: 0; padding: 10px;">
                    <h5 style="margin: 0 0 8px; font-size: 0.88rem; color: var(--text-light);">العشاء</h5>
                    <input type="text" class="item-input" style="width:100%;" placeholder="الوجبة">
                </div>
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('meals')">👁️ مشاهدة</button>
            <button class="btn btn-outline" onclick="downloadPDF('meals')">📥 تحميل</button>
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
  let html = `<div class="template-editor"><h2>⏰ تقسيم الوقت</h2><div class="editor-content">
        <div class="form-group"><label>التاريخ:</label><input type="date" class="template-input"></div>
        <div style="max-height: 480px; overflow-y: auto; padding-left: 4px;">`;

  hours.forEach((hour) => {
    html += `
            <div class="item-row" style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--border);">
                <span style="width: 65px; font-weight: 700; color: var(--primary); flex-shrink: 0; font-size: 0.95rem;">${hour}</span>
                <input type="text" class="item-input" placeholder="النشاط" style="flex: 1;">
            </div>
        `;
  });

  html += `</div>
        <div class="template-actions" style="margin-top: 28px;">
            <button class="btn btn-primary" onclick="generatePDFPreview('timeblock')">👁️ مشاهدة</button>
            <button class="btn btn-outline" onclick="downloadPDF('timeblock')">📥 تحميل</button>
        </div>
        </div></div>`;
  return html;
}

// ======================== TEMPLATE FUNCTIONS ========================
function openTemplate(templateType) {
  const modal = document.getElementById("templateModal");
  const modalBody = document.getElementById("modalBody");
  const template = TEMPLATES[templateType];

  if (template && modal && modalBody) {
    modalBody.innerHTML = template.html;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeTemplate() {
  const modal = document.getElementById("templateModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("templateModal");
  if (event.target === modal) closeTemplate();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("templateModal");
    if (modal && modal.style.display === "block") closeTemplate();
  }
});

function addItem(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const div = document.createElement("div");
  div.innerHTML = `
        <div class="item-row">
            <input type="checkbox" class="item-checkbox">
            <input type="text" class="item-input" placeholder="أدخل البيانات">
            <button class="btn-remove" onclick="removeItem(this)">✕</button>
        </div>
    `;
  container.appendChild(div.firstElementChild);

  // Focus the new input
  const newInput = container.lastElementChild?.querySelector(".item-input");
  newInput?.focus();
}

function removeItem(button) {
  button
    .closest(
      ".item-row, .shopping-item-row, .project-item-row, .study-item-row",
    )
    ?.remove();
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
  if (el) el.textContent = `الإجمالي: ${total.toFixed(2)} ل.س`;
}

// ======================== PDF PREVIEW ========================
function generatePDFPreview(templateType) {
  const modal = document.getElementById("templateModal");
  const editor = document.querySelector(".template-editor");
  if (!editor) return;

  const title = editor.querySelector("h2")?.textContent || templateType;
  const content = collectTemplateContent();

  const previewHTML = `
        <div class="pdf-preview-container">
            <div class="pdf-preview-header">
                <h2>${title}</h2>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 0.95rem;">تاريخ الإنشاء: ${new Date().toLocaleDateString("ar-SA")}</p>
            </div>
            <div class="pdf-preview-content">
                ${content}
            </div>
            <div class="preview-actions">
                <button class="btn btn-primary" onclick="downloadPDF('${templateType}')">📥 تحميل PDF</button>
                <button class="btn btn-outline" onclick="location.reload()">✕ إغلاق المعاينة</button>
            </div>
        </div>
    `;

  modal.innerHTML = previewHTML;
  modal.style.display = "block";
}

function collectTemplateContent() {
  const inputs = document.querySelectorAll(
    ".item-input, .template-input, textarea",
  );
  const items = document.querySelectorAll(
    ".item-row, .shopping-item-row, .project-item-row, .study-item-row",
  );

  let content = "";

  inputs.forEach((input) => {
    if (input.value && !input.classList.contains("item-input")) {
      const label = input.previousElementSibling?.textContent || "البيان";
      content += `<div class="pdf-preview-item"><strong>${label}</strong> ${input.value}</div>`;
    }
  });

  items.forEach((item) => {
    const textInputs = item.querySelectorAll(".item-input, textarea");
    let itemText = "";
    textInputs.forEach((input) => {
      if (input.value) itemText += input.value + " | ";
    });

    if (itemText) {
      const isChecked = item.querySelector(".item-checkbox")?.checked;
      const checkMark = isChecked ? "✓" : "○";
      content += `<div class="pdf-preview-item">${checkMark} ${itemText.slice(0, -3)}</div>`;
    }
  });

  return (
    content ||
    '<p style="text-align: center; color: #999; padding: 20px;">لا توجد بيانات لعرضها</p>'
  );
}

function downloadPDF(templateType) {
  const previewContainer =
    document.querySelector(".pdf-preview-container") ||
    document.querySelector(".template-editor");
  if (!previewContainer) return;

  const printWindow = window.open("", "_blank");
  const html = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>خطط ليومك - ${templateType}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
                    padding: 40px;
                    background: white;
                    color: #2A2030;
                    line-height: 1.8;
                }
                .pdf-preview-container { max-width: 900px; margin: 0 auto; }
                .pdf-preview-header {
                    background: linear-gradient(135deg, #7A2B4A 0%, #C86A8E 100%);
                    color: white;
                    padding: 40px;
                    border-radius: 14px;
                    text-align: center;
                    margin-bottom: 32px;
                    box-shadow: 0 8px 24px rgba(120,43,74,0.2);
                }
                .pdf-preview-header h2 { font-size: 28px; margin-bottom: 8px; font-weight: 800; }
                .pdf-preview-header p  { font-size: 13px; opacity: 0.92; }
                .pdf-preview-content {
                    background: white;
                    padding: 36px;
                    border-radius: 14px;
                    border: 1.5px solid #F0D8E4;
                }
                .pdf-preview-item {
                    background: linear-gradient(135deg, rgba(245,198,224,0.15), rgba(212,237,232,0.15));
                    padding: 13px 16px;
                    margin: 10px 0;
                    border-radius: 10px;
                    border-right: 4px solid #C86A8E;
                    font-size: 14px;
                }
                .pdf-preview-item strong { color: #A84568; font-weight: 700; }
                h3 {
                    color: #A84568;
                    margin: 22px 0 12px;
                    font-size: 17px;
                    border-bottom: 2px solid #F5D8E4;
                    padding-bottom: 8px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px 0;
                    border: none;
                    border-bottom: 1.5px solid #DDD;
                    font-family: inherit;
                    margin: 8px 0;
                    font-size: 14px;
                }
                .priority-section {
                    margin: 22px 0;
                    padding: 18px;
                    background: #FAF8FF;
                    border-right: 4px solid #C86A8E;
                    border-radius: 10px;
                }
                @page { size: A4; margin: 1cm; }
                @media print {
                    body { padding: 0; }
                    .preview-actions { display: none !important; }
                    input, textarea {
                        border-bottom: 1.5px solid #555 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            ${previewContainer.innerHTML.replace(/<button.*?<\/button>/gs, "").replace(/onclick="[^"]*"/g, "")}
        </body>
        </html>
    `;

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 300);
}

console.log("🎉 خطط ليومك - جميع الميزات جاهزة!");
