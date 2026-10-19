// Supabase authentication for the login and sign-up page.
(function () {
  var sw = document.getElementById("authSwitch");
  if (!sw) return;
  var switchButton = sw.querySelector("[data-mode]");
  var forms = {
    login: document.getElementById("loginForm"),
    signup: document.getElementById("signupForm"),
  };
  var title = document.getElementById("authTitle");
  var sub = document.getElementById("authSub");
  var promoTitle = document.getElementById("authPromoTitle");
  var promoText = document.getElementById("authPromoText");
  var pageTitle = document.querySelector("title");
  var msg = document.getElementById("formMessage");
  var sessionBox = document.getElementById("authSession");
  var sessionEmail = document.getElementById("authSessionEmail");
  var signOutButton = document.getElementById("authSignOut");
  var signedInUser = null;

  function T(key, fallback) {
    return typeof t === "function" ? t(key) : fallback;
  }
  function emailOk(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function showMsg(text, ok) {
    msg.textContent = text;
    msg.className = "form-message " + (ok ? "success" : "error");
    msg.hidden = false;
  }
  function setErr(form, prefix, key, text) {
    var group = form.querySelector('[data-field="' + key + '"]');
    var input = document.getElementById(prefix + "-" + key);
    var error = document.getElementById(prefix + "-" + key + "-error");
    if (group) group.classList.toggle("has-error", !!text);
    if (input) input.setAttribute("aria-invalid", text ? "true" : "false");
    if (error) error.textContent = text || "";
  }
  function setBusy(form, busy) {
    var button = form.querySelector('[type="submit"]');
    button.disabled = busy;
    button.setAttribute("aria-busy", busy ? "true" : "false");
  }
  async function getClient() {
    try {
      var client = await window.pydSupabaseReady;
      if (!client) showMsg(T("auth.cloud.setup"), false);
      return client;
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      showMsg(T("auth.cloud.loadError"), false);
      return null;
    }
  }
  function updateSession(user) {
    signedInUser = user || null;
    sessionBox.hidden = !user;
    forms.login.hidden = !!user || sw.getAttribute("data-mode") !== "login";
    forms.signup.hidden = !!user || sw.getAttribute("data-mode") !== "signup";
    if (user) sessionEmail.textContent = user.email || "";
  }

  function setMode(mode) {
    if (!forms[mode]) mode = "login";
    sw.setAttribute("data-mode", mode);
    Object.keys(forms).forEach(function (key) {
      forms[key].hidden = !!signedInUser || key !== mode;
    });
    [title, sub, pageTitle].forEach(function (element, index) {
      var key = "auth." + mode + (index === 1 ? ".subtitle" : ".title");
      element.setAttribute("data-i18n", key);
      element.textContent = T(key, element.textContent);
    });
    var promoMode = mode === "login" ? "signup" : "login";
    var promoTitleKey = "auth.promo." + promoMode + ".title";
    var promoTextKey = "auth.promo." + promoMode + ".body";
    var promoActionKey = "auth.promo." + promoMode + ".action";
    promoTitle.setAttribute("data-i18n", promoTitleKey);
    promoTitle.textContent = T(promoTitleKey, promoTitle.textContent);
    promoText.setAttribute("data-i18n", promoTextKey);
    promoText.textContent = T(promoTextKey, promoText.textContent);
    switchButton.setAttribute("data-mode", promoMode);
    switchButton.setAttribute("aria-controls", promoMode + "Form");
    switchButton.setAttribute("data-i18n", promoActionKey);
    switchButton.textContent = T(promoActionKey, promoActionKey);
    msg.hidden = true;
    msg.className = "form-message";
  }
  function modeFromHash() {
    return location.hash === "#signup" ? "signup" : "login";
  }

  switchButton.addEventListener("click", function () {
    var mode = switchButton.getAttribute("data-mode");
    setMode(mode);
    history.replaceState(null, "", "#" + mode);
  });
  window.addEventListener("hashchange", function () {
    setMode(modeFromHash());
  });
  setMode(modeFromHash());

  forms.login.addEventListener("submit", async function (event) {
    event.preventDefault();
    var email = document.getElementById("li-email").value.trim();
    var password = document.getElementById("li-password").value;
    var valid = true;
    if (!emailOk(email)) {
      setErr(forms.login, "li", "email", T("auth.err.email"));
      valid = false;
    } else setErr(forms.login, "li", "email", "");
    if (password.length < 8) {
      setErr(forms.login, "li", "password", T("auth.err.password"));
      valid = false;
    } else setErr(forms.login, "li", "password", "");
    if (!valid) return;

    setBusy(forms.login, true);
    try {
      var client = await getClient();
      if (!client) return;
      var result = await client.auth.signInWithPassword({ email: email, password: password });
      if (result.error) throw result.error;
      showMsg(T("auth.login.success"), true);
      updateSession(result.data.user);
      setTimeout(function () {
        location.href = "../index.html";
      }, 700);
    } catch (error) {
      console.error("Login failed:", error);
      showMsg(error.message || T("auth.login.invalid"), false);
    } finally {
      setBusy(forms.login, false);
    }
  });

  forms.signup.addEventListener("submit", async function (event) {
    event.preventDefault();
    var name = document.getElementById("su-name").value.trim();
    var email = document.getElementById("su-email").value.trim();
    var password = document.getElementById("su-password").value;
    var confirmation = document.getElementById("su-confirm").value;
    var valid = true;
    if (!name) {
      setErr(forms.signup, "su", "name", T("auth.err.name"));
      valid = false;
    } else setErr(forms.signup, "su", "name", "");
    if (!emailOk(email)) {
      setErr(forms.signup, "su", "email", T("auth.err.email"));
      valid = false;
    } else setErr(forms.signup, "su", "email", "");
    if (password.length < 8) {
      setErr(forms.signup, "su", "password", T("auth.err.password"));
      valid = false;
    } else setErr(forms.signup, "su", "password", "");
    if (confirmation !== password) {
      setErr(forms.signup, "su", "confirm", T("auth.err.confirm"));
      valid = false;
    } else setErr(forms.signup, "su", "confirm", "");
    if (!document.getElementById("su-terms").checked) {
      showMsg(T("auth.err.terms"), false);
      valid = false;
    }
    if (!valid) return;

    setBusy(forms.signup, true);
    try {
      var client = await getClient();
      if (!client) return;
      var result = await client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { full_name: name },
          emailRedirectTo: new URL("account.html", location.href).href,
        },
      });
      if (result.error) throw result.error;
      if (!result.data.session) {
        showMsg(T("auth.cloud.confirmEmail"), true);
        return;
      }
      showMsg(T("auth.signup.success"), true);
      updateSession(result.data.user);
      setTimeout(function () {
        location.href = "../index.html";
      }, 700);
    } catch (error) {
      console.error("Sign-up failed:", error);
      showMsg(error.message || T("auth.cloud.loadError"), false);
    } finally {
      setBusy(forms.signup, false);
    }
  });

  signOutButton.addEventListener("click", async function () {
    var client = await getClient();
    if (!client) return;
    try {
      var result = await client.auth.signOut();
      if (result.error) throw result.error;
      updateSession(null);
      setMode(modeFromHash());
      showMsg(T("auth.logout"), true);
    } catch (error) {
      console.error("Sign-out failed:", error);
      showMsg(error.message || T("auth.cloud.loadError"), false);
    }
  });

  window.pydSupabaseReady.then(function (client) {
    if (!client) return;
    return client.auth.getSession().then(function (result) {
      if (result.error) throw result.error;
      updateSession(result.data.session && result.data.session.user);
      client.auth.onAuthStateChange(function (_event, session) {
        updateSession(session && session.user);
      });
    });
  }).catch(function (error) {
    console.error("Could not restore the authentication session:", error);
    showMsg(T("auth.cloud.loadError"), false);
  });

  [["login", "li", ["email", "password"]], ["signup", "su", ["name", "email", "password", "confirm"]]].forEach(function (entry) {
    entry[2].forEach(function (key) {
      var input = document.getElementById(entry[1] + "-" + key);
      if (input) input.addEventListener("input", function () {
        var group = forms[entry[0]].querySelector('[data-field="' + key + '"]');
        if (group && group.classList.contains("has-error")) {
          setErr(forms[entry[0]], entry[1], key, "");
        }
      });
    });
  });
})();
