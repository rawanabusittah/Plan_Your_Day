# خطط ليومك | Plan Your Day

منصة ثنائية اللغة (العربية والإنجليزية) لتنظيم اليوم والمهام بقوالب عملية، ومعاينة مباشرة، وتصميم متجاوب.

[جرّب الموقع](https://rawanabusittah.github.io/Plan_Your_Day/) · [المستودع على GitHub](https://github.com/rawanabusittah/Plan_Your_Day)

![لقطة شاشة للموقع المنشور على GitHub Pages](assets/portfolio-preview.png)

## المزايا

- 20 قالباً لتخطيط اليوم والأسبوع، والأولويات، والدراسة، والعمل، والميزانية، وغيرها.
- محرر مباشر مع إضافة المهام وحذفها وتحديث المعاينة فوراً.
- تعليم المهام كمكتملة من المحرر أو المعاينة ومزامنة الحالة.
- واجهة عربية وإنجليزية، وتصميم متجاوب مع الوضع الداكن.
- طباعة القوالب أو حفظها كملف PDF من المتصفح.
- تسجيل الحسابات وحفظ بيانات كل قالب عبر Supabase Auth وPostgreSQL مع سياسات Row Level Security (RLS).

## التقنيات

HTML · CSS · JavaScript · Supabase Auth · PostgreSQL

## بنية المشروع

```text
.
├── index.html                   الصفحة الرئيسية والتواصل
├── pages/
│   ├── templates.html           تصفح القوالب والبحث والتصفية
│   ├── template-*.html          صفحات القوالب العشرين
│   ├── template.html            صفحة قالب عامة (?type=simple)
│   └── account.html             تسجيل الدخول وإنشاء الحساب
├── css/
│   ├── style.css                الأنماط العامة والمتجاوبة والطباعة
│   ├── templates-workspace.css  تخطيط محرر القوالب والمعاينة
│   └── account.css              تنسيق صفحة الحساب
├── js/
│   ├── i18n.js                  النصوص والترجمة عربي/إنجليزي
│   ├── core.js                  التهيئة والتنقل والمظهر العام
│   ├── templates-data.js        تعريفات القوالب ونماذجها
│   ├── workspace.js             المحرر والمعاينة والحفظ والطباعة
│   ├── filters.js               البحث والتصفية
│   ├── auth.js                  تدفق تسجيل الحساب والدخول
│   ├── supabase.js              إنشاء عميل Supabase
│   └── supabase-config.js       عنوان المشروع ومفتاح النشر العام
├── database/
│   └── schema.sql               الجداول والمشغلات وسياسات RLS
└── assets/
    ├── photo/                   الصور والشعارات
    └── portfolio-preview.png    لقطة شاشة من الموقع المنشور
```

## التشغيل والإعداد

الموقع واجهة ثابتة منشورة على GitHub Pages ولا يحتاج إلى خطوة بناء. يتطلب تسجيل الحساب والحفظ السحابي اتصالاً بالإنترنت وإعداد مشروع Supabase:

1. أنشئ مشروع Supabase وشغّل [`database/schema.sql`](database/schema.sql) من SQL Editor.
2. أضف Project URL ومفتاح `publishable` أو `anon` إلى `url` و`anonKey` في [`js/supabase-config.js`](js/supabase-config.js).
3. في Supabase Authentication، اضبط `Site URL` وعناوين `Redirect URLs` على نطاق ومسار موقع GitHub Pages.
4. فعّل GitHub Pages من إعدادات المستودع، ثم افتح [الموقع المنشور](https://rawanabusittah.github.io/Plan_Your_Day/).

مفتاح `publishable/anon` مخصص للاستخدام في المتصفح؛ لا تضع مفتاح `service_role` أو كلمات مرور قاعدة البيانات في ملفات الواجهة أو المستودع. يتولى Supabase Auth حفظ كلمات المرور والتحقق منها.

## نتائج اختبار الموقع

أُجريت اختبارات تفاعلية في المتصفح على الموقع المنشور في **19 أكتوبر 2026**. النتيجة: **16/16 فحصاً ناجحاً**.

| # | الفحص | النتيجة |
|---:|---|:---:|
| 1 | تحميل الصفحة الرئيسية | ✅ |
| 2 | ظهور القوالب العشرين | ✅ |
| 3 | تصفية القوالب بالبحث | ✅ |
| 4 | التصفية حسب التصنيف | ✅ |
| 5 | إعادة التصفية وإظهار القوالب كلها | ✅ |
| 6 | تهيئة قالب الأولويات الثلاث ومعاينته | ✅ |
| 7 | تحديث المعاينة عند الكتابة | ✅ |
| 8 | ظهور سطر فارغ بعد إضافة مهمة | ✅ |
| 9 | ظهور المهمة الجديدة في المعاينة | ✅ |
| 10 | مزامنة حالة الإنجاز مع المعاينة | ✅ |
| 11 | اختفاء المهمة من المعاينة بعد حذفها | ✅ |
| 12 | تخطيط الهاتف دون تجاوز أفقي | ✅ |
| 13 | تضمين جميع المهام الـ23 في محتوى الطباعة المُنشأ | ✅ |
| 14 | تحميل صفحة الحساب والتبديل بين النموذجين | ✅ |
| 15 | تهيئة عميل Supabase على الموقع المنشور | ✅ |
| 16 | عدم وقوع أخطاء JavaScript غير معالجة أثناء الفحوص | ✅ |

تحققت من اكتمال محتوى الطباعة المُنشأ، وليس من ملف PDF فعلي متعدد الصفحات. كما لم تتضمن الفحوص إنشاء حساب حقيقي أو الكتابة في قاعدة البيانات أو اختبار سياسات RLS؛ تتطلب هذه الخطوات حساباً اختبارياً وإعداداً مخصصاً في Supabase.

### نتائج Lighthouse

أُجري تدقيق Lighthouse على الموقع المنشور (https://rawanabusittah.github.io/Plan_Your_Day/) في **19 أكتوبر 2026**. النتائج:

| الفئة | الدرجة |
|---|---:|
| الأداء (Performance) | 92 |
| إمكانية الوصول (Accessibility) | 100 |
| أفضل الممارسات (Best Practices) | 100 |
| تحسين محركات البحث (SEO) | 100 |
| تصفح الوكلاء (Agentic Browsing) | 100 |

المقاييس الرئيسية: FCP 1.4s، LCP 3.2s، TBT 50ms، CLS 0.037، Speed Index 2.0s. التقرير الكامل: `lighthouse-report.html`.

---

## English

A bilingual (Arabic/English) planner for organizing tasks with practical templates, live previews, and a responsive interface.

[Live demo](https://rawanabusittah.github.io/Plan_Your_Day/) · [GitHub repository](https://github.com/rawanabusittah/Plan_Your_Day)

### Features

- 20 templates for daily and weekly planning, priorities, study, work, budgeting, and more.
- Live task editor with add, remove, and instant preview updates.
- Completion checkboxes synchronized between the editor and preview.
- Arabic and English UI, responsive layouts, and dark mode.
- Browser print and PDF export.
- Supabase Auth and PostgreSQL persistence, protected with Row Level Security (RLS).

### Project structure

See the tree above: `pages/` contains the template and account screens; `css/` contains shared, workspace, and account styles; `js/` contains localization, template definitions, UI behavior, and Supabase integration; `database/schema.sql` defines the database and access policies; `assets/` contains static media and the portfolio screenshot.

### Run and configure

This is a static GitHub Pages site with no build step. Cloud authentication and storage require an internet connection and a configured Supabase project:

1. Create a Supabase project and run [`database/schema.sql`](database/schema.sql) in the SQL Editor.
2. Set the project URL and `publishable` or `anon` key as `url` and `anonKey` in [`js/supabase-config.js`](js/supabase-config.js).
3. Set the Supabase Auth `Site URL` and `Redirect URLs` to the GitHub Pages site origin and path.
4. Enable GitHub Pages in the repository settings and visit the [live site](https://rawanabusittah.github.io/Plan_Your_Day/).

The `publishable/anon` key is intended for browser use. Never put a `service_role` key or database password in frontend files or the repository. Supabase Auth handles password storage and verification.

### Browser test results

Interactive browser checks were run against the deployed site on **October 19, 2026**: **16/16 checks passed**. They covered the homepage, all 20 templates, search and category filters, editor/preview updates, adding and removing tasks, checkbox synchronization, mobile overflow, generated print content with 23 tasks, account form switching, Supabase client initialization, and uncaught JavaScript errors.

The print check verified generated print markup, not an actual multi-page PDF. No real account was created, no live database write was made, and RLS policies were not exercised; these checks require a dedicated Supabase test account and project setup.

### Lighthouse results

A Lighthouse audit was run against the deployed site (https://rawanabusittah.github.io/Plan_Your_Day/) on **October 19, 2026**:

| Category | Score |
|---|---:|
| Performance | 92 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Agentic Browsing | 100 |

Key metrics: FCP 1.4s, LCP 3.2s, TBT 50ms, CLS 0.037, Speed Index 2.0s. Full report: `lighthouse-report.html`.
