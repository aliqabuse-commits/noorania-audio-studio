// ================================
// segment-core/segment-core-index.js
// فهرس إدارة المقاطع
// تعريف + تحميل ملفات الإدارة الموجودة فعليًا فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runSegmentCoreApp تلقائيًا
// ================================

console.log("🧩 segment-core-index.js جاهز — Safe Department Index");

window.NOORANIYA_SEGMENT_CORE = {
  name: "segment-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة المقاطع",
    law:
      "الفصل والدمج لا يكونان إدراكيين حتى يراجعا هوية الحرف والتحليل والذاكرة وحدود الحامل والمحمول."
  },

  role:
    "إدارة حدود المقطع، والحامل، والمحمول، والفصل، والدمج الرسمي بما يحفظ الهوية.",

  files: [
    "segment-core/payload-extractor-engine.js",
    "segment-core/payload-lock-engine.js",
    "segment-core/payload-purifier-engine.js",
    "segment-core/phoneme-boundary-engine.js",
    "segment-core/segment-merge-engine.js",
    "segment-core/segment-split-engine.js",
    "segment-core/segment-core-app.js"
  ],

  knowledge: [
    "payload-extraction",
    "payload-locking",
    "payload-purification",
    "phoneme-boundary",
    "segment-merging",
    "segment-splitting",
    "carrier-payload-boundaries"
  ],

  decisions: [
    "أين يبدأ الحرف؟",
    "أين ينتهي الحرف؟",
    "ما الحامل؟",
    "ما المحمول؟",
    "هل الفصل حافظ على الهوية؟",
    "هل الدمج حافظ على الهوية؟",
    "هل منطقة الاشتباك صالحة؟"
  ],

  serves: [
    "phoneme-core",
    "analysis-core",
    "memory-core",
    "operation-labs",
    "governance-core"
  ],

  principles: [
    "الفصل يخدم الهوية.",
    "الدمج يخدم الهوية.",
    "الحامل ليس المحمول.",
    "منطقة الاشتباك معرفة لا ضجيج.",
    "لا قص بلا قرار إدراكي.",
    "index الفرعي يعرف ويحمّل الملفات الموجودة فعليًا فقط.",
    "app يسجل ويفحص ويبني لوحة الإدارة فقط.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadSegmentCoreScript(src) {
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
      reject(new Error("فشل تحميل ملف إدارة المقاطع: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadSegmentCore = async function () {
  const report = {
    department: "segment-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة المقاطع الموجودة فعليًا فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_SEGMENT_CORE.files) {
    try {
      const result = await loadSegmentCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🧩 تقرير تحميل إدارة المقاطع:", report);
  return report;
};

window.getSegmentCoreIndex = function () {
  return window.NOORANIYA_SEGMENT_CORE;
};
