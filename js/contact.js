var CONTACT_ENDPOINT = "https://formsubmit.co/ajax/rawanabusittah@gmail.com";
function initializeFormInlineValidation() {
  var e = document.getElementById("contactForm");
  if (e) {
    var n = {
        name: { required: !0, min: 2 },
        email: { required: !0, email: !0 },
        subject: { required: !0, min: 2 },
        message: { required: !0, min: 10 },
      },
      r = document.getElementById("formMessage"),
      i = e.querySelector('button[type="submit"]'),
      a = !1;
    (Object.keys(n).forEach(function (t) {
      var n = document.getElementById(t);
      n &&
        (n.addEventListener("input", function () {
          e.querySelector('[data-field="' + t + '"].has-error') && u(t);
        }),
        n.addEventListener("blur", function () {
          u(t);
        }));
    }),
      e.addEventListener("submit", function (t) {
        if ((t.preventDefault(), !a)) {
          var i = !0,
            m = null;
          if (
            (Object.keys(n).forEach(function (e) {
              u(e) || ((i = !1), m || (m = document.getElementById(e)));
            }),
            !i)
          )
            return (
              c(
                o("form.error.empty", "Please check the highlighted fields"),
                "error",
              ),
              void (m && m.focus())
            );
          var l = e.querySelector('[name="_honey"]');
          if (!l || !l.value) {
            var f = {
              name: document.getElementById("name").value.trim(),
              email: document.getElementById("email").value.trim(),
              subject: document.getElementById("subject").value.trim(),
              message: document.getElementById("message").value.trim(),
              _subject:
                "[خطط ليومك] " +
                document.getElementById("subject").value.trim(),
              _template: "table",
              _captcha: "false",
              _honey: "",
            };
            (d(!0),
              c(o("form.sending", "Sending..."), "success"),
              fetch(CONTACT_ENDPOINT, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(f),
              })
                .then(function (e) {
                  return e.json().then(function (t) {
                    return { ok: e.ok, data: t };
                  });
                })
                .then(function (t) {
                  if (!t.ok || "false" === String(t.data.success))
                    throw new Error(t.data.message || "rejected");
                  (e.reset(),
                    Object.keys(n).forEach(function (e) {
                      s(e, "");
                    }),
                    c(
                      o("form.success", "Message sent successfully"),
                      "success",
                    ),
                    setTimeout(function () {
                      ((r.className = "form-message"), (r.textContent = ""));
                    }, 8e3));
                })
                .catch(function () {
                  c(
                    o(
                      "form.fail",
                      "Could not send. Please try again or email us directly.",
                    ),
                    "error",
                  );
                })
                .then(function () {
                  d(!1);
                }));
          }
        }
      }),
      document.addEventListener("langchange", function () {
        (Object.keys(n).forEach(function (t) {
          var n = e.querySelector('[data-field="' + t + '"]');
          n && n.classList.contains("has-error") && u(t);
        }),
          i && !a && (i.textContent = o("form.submit", "Send")));
      }),
      (window.validateField = u),
      (window.setFieldError = s));
  }
  function o(e, n) {
    return "function" == typeof t ? t(e) : n;
  }
  function s(t, n) {
    var r = e.querySelector('[data-field="' + t + '"]'),
      i = document.getElementById(t),
      a = document.getElementById(t + "-error");
    (r && r.classList.toggle("has-error", !!n),
      i && i.setAttribute("aria-invalid", n ? "true" : "false"),
      a && (a.textContent = n || ""));
  }
  function u(e) {
    var t = document.getElementById(e);
    if (!t) return !0;
    var r = n[e] || {},
      i = (t.value || "").trim();
    return r.required && !i
      ? (s(e, o("form.err.required", "This field is required")), !1)
      : r.email && i && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i)
        ? (s(e, o("form.err.email", "Enter a valid email")), !1)
        : r.min && i && i.length < r.min
          ? (s(e, o("form.err.short", "Too short")), !1)
          : (s(e, ""), !0);
  }
  function c(e, t) {
    showMessage(e, t, r);
  }
  function d(e) {
    ((a = e),
      i &&
        ((i.disabled = e),
        i.setAttribute("aria-busy", e ? "true" : "false"),
        (i.textContent = o(e ? "form.sending" : "form.submit", "Send"))));
  }
}
"loading" === document.readyState
  ? document.addEventListener(
      "DOMContentLoaded",
      initializeFormInlineValidation,
    )
  : initializeFormInlineValidation();
