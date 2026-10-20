(function () {
  var status = document.getElementById("status");
  var container = document.getElementById("listsContainer");
  var state = { kind: "loading", message: "loading", rows: [] };
  var clientPromise;
  var refreshId = 0;

  var copy = {
    ar: {
      title: "قوائمي",
      back: "العودة للرئيسية",
      browse: "تصفح القوالب",
      loading: "جارٍ تحميل قوائمك...",
      setup: "تعذر الاتصال بخدمة القوائم. تحقق من إعداد Supabase.",
      login: "سجّل دخولك أو أنشئ حساباً لرؤية قوائمك.",
      loginButton: "تسجيل الدخول",
      signupButton: "إنشاء حساب",
      loadError: "تعذر تحميل القوائم. حاول مرة أخرى.",
      empty: "لا توجد قوائم محفوظة بعد.",
      browse: "تصفح القوالب",
      open: "فتح",
      delete: "حذف",
      confirmDelete: "هل أنت متأكد من حذف هذه القائمة؟",
      deleteError: "تعذر حذف القائمة. حاول مرة أخرى.",
      deleted: "تم حذف القائمة.",
      unknownTemplate: "قالب محفوظ",
      templates: {
        simple: "قائمة يومية بسيطة",
        priority: "الأولويات الثلاث",
        weekly: "خطة أسبوعية",
        shopping: "قائمة التسوق",
        project: "إدارة المشروع",
        study: "جدول الدراسة",
        fitness: "الأهداف الرياضية",
        reading: "قائمة القراءة",
        work: "مشاريع العمل",
        goals: "تحديد الأهداف",
        budget: "تتبع الميزانية",
        meals: "خطة الوجبات",
        habits: "متتبع العادات",
        event: "تخطيط الحفل",
        travel: "قائمة السفر",
        home: "صيانة المنزل",
        timeblock: "تقسيم الوقت",
        notes: "الملاحظات",
        wellness: "العافية",
        monthly: "المراجعة الشهرية",
      },
    },
    en: {
      title: "My Lists",
      back: "Back to home",
      browse: "Browse templates",
      loading: "Loading your lists...",
      setup: "Could not connect to the lists service. Check the Supabase setup.",
      login: "Sign in or create an account to see your lists.",
      loginButton: "Sign in",
      signupButton: "Create account",
      loadError: "Could not load your lists. Please try again.",
      empty: "You don't have any saved lists yet.",
      browse: "Browse templates",
      open: "Open",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this list?",
      deleteError: "Could not delete the list. Please try again.",
      deleted: "List deleted.",
      unknownTemplate: "Saved template",
      templates: {
        simple: "Simple daily list",
        priority: "Three priorities",
        weekly: "Weekly plan",
        shopping: "Shopping list",
        project: "Project management",
        study: "Study schedule",
        fitness: "Fitness goals",
        reading: "Reading list",
        work: "Work projects",
        goals: "Goal setting",
        budget: "Budget tracking",
        meals: "Meal plan",
        habits: "Habit tracker",
        event: "Event planning",
        travel: "Travel checklist",
        home: "Home maintenance",
        timeblock: "Time blocking",
        notes: "Notes",
        wellness: "Wellness plan",
        monthly: "Monthly review",
      },
    },
  };

  function text(key) {
    var language = currentLang === "en" ? "en" : "ar";
    return copy[language][key];
  }

  function getClient() {
    if (clientPromise) return clientPromise;
    clientPromise = (async function () {
      var client = await window.pydSupabaseReady;
      if (client) return client;
      if (!window.PYD_SUPABASE_CONFIG) {
        await loadScript(new URL("../js/supabase-config.js", location.href).href);
      }
      if (!window.supabase) {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
        );
      }
      if (
        !window.PYD_SUPABASE_CONFIG ||
        !window.PYD_SUPABASE_CONFIG.url ||
        !window.PYD_SUPABASE_CONFIG.anonKey
      ) {
        throw new Error("Supabase configuration is missing.");
      }
      if (!window.supabase || !window.supabase.createClient) {
        throw new Error("Supabase SDK did not load.");
      }
      return window.supabase.createClient(
        window.PYD_SUPABASE_CONFIG.url,
        window.PYD_SUPABASE_CONFIG.anonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        },
      );
    })();
    return clientPromise;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Unable to load " + src));
      };
      document.head.appendChild(script);
    });
  }

  function setStatus(message, className) {
    status.replaceChildren();
    status.className = "my-lists-status" + (className ? " " + className : "");
    if (message) {
      var paragraph = document.createElement("p");
      paragraph.className = "my-lists-status-message";
      paragraph.textContent = message;
      status.appendChild(paragraph);
    }
  }

  function addAuthActions() {
    var actions = document.createElement("div");
    actions.className = "my-lists-status-actions";
    [
      ["account.html#login", "loginButton", "btn btn-primary"],
      ["account.html#signup", "signupButton", "btn btn-outline"],
    ].forEach(function (item) {
      var link = document.createElement("a");
      link.href = item[0];
      link.className = item[2];
      link.textContent = text(item[1]);
      actions.appendChild(link);
    });
    status.appendChild(actions);
  }

  function updateStaticText() {
    var language = currentLang === "en" ? "en" : "ar";
    var title = text("title");
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title =
      language === "ar"
        ? "قوائمي - خطط ليومك"
        : "My Lists - Plan Your Day";
    document.getElementById("pageTitle").textContent = title;
    document.querySelector(".my-lists-back").textContent = text("back");
    document.querySelector(".my-lists-browse").textContent = text("browse");
  }

  function templateName(type) {
    return text("templates")[type] || text("unknownTemplate");
  }

  function renderEmpty() {
    container.replaceChildren();
    var empty = document.createElement("div");
    empty.className = "my-list-empty";
    var message = document.createElement("p");
    message.textContent = text("empty");
    var browse = document.createElement("a");
    browse.className = "btn btn-primary";
    browse.href = "templates.html";
    browse.textContent = text("browse");
    empty.append(message, browse);
    container.appendChild(empty);
  }

  function renderRows() {
    container.replaceChildren();
    if (!state.rows.length) {
      renderEmpty();
      return;
    }
    var language = currentLang === "en" ? "en" : "ar";
    state.rows.forEach(function (row) {
      var card = document.createElement("article");
      card.className = "my-list-card";
      var details = document.createElement("div");
      var heading = document.createElement("h2");
      heading.textContent = row.title || templateName(row.template_type);
      var meta = document.createElement("p");
      var date = new Date(row.updated_at).toLocaleString(language);
      meta.textContent = templateName(row.template_type) + " · " + date;
      details.append(heading, meta);

      var actions = document.createElement("div");
      actions.className = "my-list-card-actions";
      var open = document.createElement("a");
      open.className = "btn btn-primary btn-sm";
      open.href =
        "template-" +
        encodeURIComponent(row.template_type) +
        ".html?list=" +
        encodeURIComponent(row.id);
      open.textContent = text("open");
      var remove = document.createElement("button");
      remove.className = "btn btn-outline btn-sm";
      remove.type = "button";
      remove.textContent = text("delete");
      remove.addEventListener("click", function () {
        deleteList(row, card);
      });
      actions.append(open, remove);
      card.append(details, actions);
      container.appendChild(card);
    });
  }

  async function deleteList(row, card) {
    if (!window.confirm(text("confirmDelete"))) return;
    try {
      var client = await getClient();
      var result = await client
        .from("planner_lists")
        .delete()
        .eq("id", row.id);
      if (result.error) throw result.error;
      state.rows = state.rows.filter(function (item) {
        return item.id !== row.id;
      });
      card.remove();
      if (!state.rows.length) renderEmpty();
      setStatus(text("deleted"), "is-success");
    } catch (error) {
      console.error("Could not delete saved list:", error);
      setStatus(text("deleteError"), "is-error");
    }
  }

  async function render() {
    var requestId = ++refreshId;
    updateStaticText();
    container.replaceChildren();
    if (state.kind === "loading") {
      setStatus(text("loading"));
      return;
    }
    if (state.kind === "unauthenticated") {
      setStatus(text("login"));
      addAuthActions();
      return;
    }
    if (state.kind === "error") {
      setStatus(text(state.message), "is-error");
      return;
    }
    if (state.kind === "ready") {
      setStatus("");
      renderRows();
      return;
    }

    state.kind = "loading";
    setStatus(text("loading"));
    try {
      var client = await getClient();
      var sessionResult = await client.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      var user =
        sessionResult.data.session && sessionResult.data.session.user;
      if (requestId !== refreshId) return;
      if (!user) {
        state.kind = "unauthenticated";
        setStatus(text("login"));
        addAuthActions();
        return;
      }
      var listsResult = await client
        .from("planner_lists")
        .select("id, template_type, title, created_at, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (listsResult.error) throw listsResult.error;
      if (requestId !== refreshId) return;
      state.kind = "ready";
      state.rows = listsResult.data || [];
      setStatus("");
      renderRows();
    } catch (error) {
      console.error("Could not load saved lists:", error);
      if (requestId !== refreshId) return;
      state.kind = "error";
      state.message =
        error.message === "Supabase configuration is missing."
          ? "setup"
          : "loadError";
      setStatus(text(state.message), "is-error");
    }
  }

  document.addEventListener("langchange", function () {
    render();
  });
  render();
})();
