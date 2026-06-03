// ================================
// memory-core/memory-core-index.js
// فهرس إدارة الذاكرة
// تعريف + تحميل ملفات الإدارة الموجودة فعليًا فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runMemoryCoreApp تلقائيًا
// ================================

console.log("🧠 memory-core-index.js جاهز — Safe Department Index");

window.NOORANIYA_MEMORY_CORE = {
  name: "memory-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة الذاكرة",
    law:
      "الذاكرة التي لا تعود لتصحح القرار ليست ذاكرة إدراكية، بل أرشيف صامت."
  },

  role:
    "إدارة حفظ الأثر ومصفوفة الالتباس والتخزين المرتبط بالذاكرة وسجل الملفات الصوتية المعتمدة للرجوع إليها عند القرار.",

  files: [
    "memory-core/storage.js",
    "memory-core/recording-manifest.js",
    "memory-core/cognitive-confusion-matrix.js",
    "memory-core/memory-core-app.js"
  ],

  knowledge: [
    "storage-layer",
    "recording-manifest",
    "cognitive-confusion-matrix",
    "match-results-log",
    "decision-feedback",
    "historical-error-patterns",
    "repeated-confusion-memory"
  ],

  decisions: [
    "هل يوجد تسجيل محفوظ يمكن الرجوع إليه؟",
    "هل توجد وحدة صوتية معتمدة؟",
    "هل يوجد التباس متكرر؟",
    "هل الجينوم يسحب حرفًا آخر؟",
    "هل القرار الحالي يخالف الذاكرة؟",
    "هل يلزم إعادة تدريب؟",
    "هل الخطأ المتكرر تحول إلى معرفة قرار؟"
  ],

  serves: [
    "phoneme-core",
    "segment-core",
    "analysis-core",
    "training-core",
    "governance-core"
  ],

  principles: [
    "الذاكرة أثر راجع لا أرشيف.",
    "التخزين لا قيمة له إذا لم يخدم قرارًا.",
    "سجل التسجيلات لا يكون حيًا إلا إذا أمكن الرجوع إليه عند الفحص.",
    "كل خطأ متكرر يجب أن يغيّر قرارًا.",
    "لا قرار ناضج بلا ذاكرة.",
    "الإحصاء يخدم الحسم ولا ينفرد به.",
    "الذاكرة تكشف الضعف ولا تبني الهوية بدل الحرف.",
    "index الفرعي يعرف ويحمّل فقط.",
    "app يسجل ويفحص ويبني لوحة الإدارة فقط.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadMemoryCoreScript(src) {
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
      reject(new Error("فشل تحميل ملف إدارة الذاكرة: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadMemoryCore = async function () {
  const report = {
    department: "memory-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة الذاكرة الموجودة فعليًا فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_MEMORY_CORE.files) {
    try {
      const result = await loadMemoryCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🧠 تقرير تحميل إدارة الذاكرة:", report);
  return report;
};

window.getMemoryCoreIndex = function () {
  return window.NOORANIYA_MEMORY_CORE;
};
