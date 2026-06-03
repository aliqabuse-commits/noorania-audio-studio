// ================================
// analysis-core/analysis-core-index.js
// فهرس إدارة التحليل
// تعريف + تحميل ملفات الإدارة فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runAnalysisCoreApp تلقائيًا
// ================================

console.log("📊 analysis-core-index.js جاهز — Safe Department Index");

window.NOORANIYA_ANALYSIS_CORE = {
  name: "analysis-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة التحليل",
    law:
      "التحليل الذي لا يغيّر قرارًا يبقى وصفًا لا معرفة."
  },

  role:
    "إدارة استخراج المؤشرات الصوتية والإحصائية التي تخدم الحرف والمقطع والذاكرة دون أن تتحول إلى سلطة حكم مستقلة.",

  files: [
    "analysis-core/burst-onset-engine.js",
    "analysis-core/burst-signature-engine.js",
    "analysis-core/cognitive-confusion-matrix.js",
    "analysis-core/cognitive-statistics-engine.js",
    "analysis-core/phoneme-signal-validator.js",
    "analysis-core/analysis-core-app.js"
  ],

  knowledge: [
    "burst-onset",
    "burst-signature",
    "signal-validation",
    "cognitive-confusion-matrix",
    "cognitive-statistics",
    "energy-features",
    "zcr-features",
    "spectral-indicators",
    "audio-analysis-evidence"
  ],

  decisions: [
    "هل توجد بداية انفجار؟",
    "هل الانفجار يدعم هوية الحرف؟",
    "هل التسجيل صالح للتحليل؟",
    "هل توجد مؤشرات التباس؟",
    "هل الإحصاء يخدم الحسم؟",
    "هل المؤشر يدعم المطابقة؟",
    "هل المؤشر يدعم الفصل؟",
    "هل التقرير التحليلي له أثر في قرار؟"
  ],

  serves: [
    "phoneme-core",
    "segment-core",
    "memory-core",
    "training-core",
    "governance-core"
  ],

  principles: [
    "التحليل دليل لا حاكم نهائي.",
    "كل رقم يجب أن يخدم قرارًا.",
    "لا تقرير بلا أثر.",
    "التحليل يخدم الإدراك ولا يستبدله.",
    "الطيف والطاقة والإحصاء أدلة لا وجهة.",
    "index الفرعي يعرف ويحمّل فقط.",
    "app يسجل ويفحص ويبني لوحة الإدارة فقط.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadAnalysisCoreScript(src) {
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
      reject(new Error("فشل تحميل ملف إدارة التحليل: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadAnalysisCore = async function () {
  const report = {
    department: "analysis-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة التحليل فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_ANALYSIS_CORE.files) {
    try {
      const result = await loadAnalysisCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("📊 تقرير تحميل إدارة التحليل:", report);
  return report;
};

window.getAnalysisCoreIndex = function () {
  return window.NOORANIYA_ANALYSIS_CORE;
};
