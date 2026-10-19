// contact.js — homepage contact form: inline validation + real email delivery.
// Messages are delivered to rawanabusittah@gmail.com through FormSubmit
// (https://formsubmit.co), a free form-to-email service that needs no server.
// First message ever sent: FormSubmit emails that inbox once with an
// "Activate Form" link — click it once and all later messages arrive normally.

var CONTACT_ENDPOINT = "https://formsubmit.co/ajax/rawanabusittah@gmail.com";

function initializeFormInlineValidation() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var rules = {
    name: { required: true, min: 2 },
    email: { required: true, email: true },
    subject: { required: true, min: 2 },
    message: { required: true, min: 10 },
  };
  var box = document.getElementById("formMessage");
  var submitBtn = form.querySelector('button[type="submit"]');
  var sending = false;

  function msg(key, fallback) {
    return typeof t === "function" ? t(key) : fallback;
  }

  function setError(field, text) {
    var group = form.querySelector('[data-field="' + field + '"]');
    var input = document.getElementById(field);
    var err = document.getElementById(field + "-error");
    if (group) group.classList.toggle("has-error", !!text);
    if (input) input.setAttribute("aria-invalid", text ? "true" : "false");
    if (err) err.textContent = text || "";
  }

  function validateField(field) {
    var input = document.getElementById(field);
    if (!input) return true;
    var rule = rules[field] || {};
    var val = (input.value || "").trim();
    if (rule.required && !val) {
      setError(field, msg("form.err.required", "This field is required"));
      return false;
    }
    if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError(field, msg("form.err.email", "Enter a valid email"));
      return false;
    }
    if (rule.min && val && val.length < rule.min) {
      setError(field, msg("form.err.short", "Too short"));
      return false;
    }
    setError(field, "");
    return true;
  }

  function show(text, type) {
    showMessage(text, type, box);
  }

  function setSending(on) {
    sending = on;
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.setAttribute("aria-busy", on ? "true" : "false");
    submitBtn.textContent = msg(on ? "form.sending" : "form.submit", "Send");
  }

  Object.keys(rules).forEach(function (field) {
    var input = document.getElementById(field);
    if (!input) return;
    input.addEventListener("input", function () {
      if (form.querySelector('[data-field="' + field + '"].has-error')) validateField(field);
    });
    input.addEventListener("blur", function () {
      validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (sending) return;

    var ok = true;
    var firstBad = null;
    Object.keys(rules).forEach(function (field) {
      if (!validateField(field)) {
        ok = false;
        if (!firstBad) firstBad = document.getElementById(field);
      }
    });
    if (!ok) {
      show(msg("form.error.empty", "Please check the highlighted fields"), "error");
      if (firstBad) firstBad.focus();
      return;
    }

    // honeypot: real people never see this field
    var trap = form.querySelector('[name="_honey"]');
    if (trap && trap.value) return;

    var payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      _subject: "[خطط ليومك] " + document.getElementById("subject").value.trim(),
      _template: "table",
      _captcha: "false",
      _honey: "",
    };

    setSending(true);
    show(msg("form.sending", "Sending..."), "success");

    fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        var accepted = r.ok && String(r.data.success) !== "false";
        if (!accepted) throw new Error(r.data.message || "rejected");
        form.reset();
        Object.keys(rules).forEach(function (f) {
          setError(f, "");
        });
        show(msg("form.success", "Message sent successfully"), "success");
        setTimeout(function () {
          box.className = "form-message";
          box.textContent = "";
        }, 8000);
      })
      .catch(function () {
        show(msg("form.fail", "Could not send. Please try again or email us directly."), "error");
      })
      .then(function () {
        setSending(false);
      });
  });

  document.addEventListener("langchange", function () {
    Object.keys(rules).forEach(function (field) {
      var group = form.querySelector('[data-field="' + field + '"]');
      if (group && group.classList.contains("has-error")) validateField(field);
    });
    if (submitBtn && !sending) submitBtn.textContent = msg("form.submit", "Send");
  });

  window.validateField = validateField;
  window.setFieldError = setError;
}
