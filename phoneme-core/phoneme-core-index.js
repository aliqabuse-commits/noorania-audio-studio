// ================================
// phoneme-core/phoneme-core-index.js
// فهرس إدارة الحرف
// تعريف + تحميل ملفات الإدارة فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runPhonemeCoreApp تلقائيًا
// ================================

console.log("🔤 phoneme-core-index.js جاهز — Safe Department Index");

window.NOORANIYA_PHONEME_CORE = {
  name: "phoneme-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة الحرف",
    law:
      "الحرف ليس ملفًا صوتيًا، بل هوية إدراكية يجب أن تؤثر في المطابقة والفصل والتمييز."
  },

  role:
    "إدارة بناء هوية الحرف وذاكرته وبصمته وجينومه الإدراكي، بما يخدم قرارات المطابقة والفصل والتمييز.",

  files: [
    "phoneme-core/phoneme-training-pack.js",
    "phoneme-core/phoneme-colors.js",
    "phoneme-core/phoneme-color-memory.js",
    "phoneme-core/phoneme-signal-validator.js",
    "phoneme-core/phoneme-memory-trainer.js",
    "phoneme-core/phoneme-timeline-engine.js",
    "phoneme-core/common-payload-finder.js",
    "phoneme-core/burst-signature-engine.js",
    "phoneme-core/spectral-seal-engine.js",
    "phoneme-core/core-purifier-engine.js",
    "phoneme-core/phoneme-cognitive-engine.js",
    "phoneme-core/phoneme-identity-engine.js",
    "phoneme-core/ba-final-identity-engine.js",
    "phoneme-core/ba-identity-match-engine.js",
    "phoneme-core/phoneme-match-engine.js",
    "phoneme-core/ba_master_identity.js",
    "phoneme-core/phoneme-core-app.js"
  ],

  knowledge: [
    "phoneme-training-pack",
    "phoneme-colors",
    "phoneme-color-memory",
    "signal-validation",
    "phoneme-memory",
    "timeline-genome",
    "common-payload",
    "burst-signature",
    "spectral-seal",
    "pure-core",
    "cognitive-genome",
    "phoneme-identity",
    "identity-match",
    "master-identity"
  ],

  decisions: [
    "هل التسجيل صالح لفحص الحرف؟",
    "هل الصوت ينتمي للحرف؟",
    "هل الهوية مستقرة؟",
    "هل البصمة تدعم القرار؟",
    "هل الجينوم صالح للمطابقة؟",
    "هل الفصل يحافظ على هوية الحرف؟"
  ],

  serves: [
    "segment-core",
    "analysis-core",
    "memory-core",
    "training-core",
    "governance-core"
  ],

  principles: [
    "الحرف هوية لا عينة.",
    "اللون والذاكرة يخدمان الحسم.",
    "الجينوم لا يكون تقريرًا؛ بل دليل قرار.",
    "الزمن يصف القرار ولا يحكمه.",
    "الفصل لا يقطع الهوية.",
    "index الفرعي يعرف ويحمّل فقط.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadPhonemeCoreScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="' + src + '"]')) {
      resolve({
        src: src,
        status: "already-loaded"
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      resolve({
        src: src,
        status: "loaded"
      });
    };

    script.onerror = function () {
      reject(new Error("فشل تحميل ملف إدارة الحرف: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadPhonemeCore = async function () {
  const report = {
    department: "phoneme-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة الحرف فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_PHONEME_CORE.files) {
    try {
      const result = await loadPhonemeCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🔤 تقرير تحميل إدارة الحرف:", report);
  return report;
};

window.getPhonemeCoreIndex = function () {
  return window.NOORANIYA_PHONEME_CORE;
};
