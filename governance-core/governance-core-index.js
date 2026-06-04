// ================================
// governance-core/governance-core-index.js
// فهرس إدارة الحوكمة — V3
// تعريف + تحميل ملفات الإدارة فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runGovernanceCoreApp تلقائيًا
// ================================

console.log("🏛️ governance-core-index.js جاهز — V3 Safe Department Index");

window.NOORANIYA_GOVERNANCE_CORE = {
  name: "governance-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة الحوكمة",
    law:
      "المعرفة التي لا تؤثر في القرار ليست جزءًا من المنظومة بعد، " +
      "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد.",
    integrationLaw:
      "كل إضافة أو نقل أو تعديل يجب أن يظهر في الإدارة المالكة والاندكس وخريطة المعرفة والقرار وبوابات التدقيق عند الحاجة."
  },

  role:
    "إدارة الحوكمة التي تضبط علاقة المعرفة بالقرار، وتحرس الوجهة، وتمنع الفوضى المعمارية ومرور المعرفة من خلف العداد.",

  files: [
    "governance-core/department-registry.js",
    "governance-core/knowledge-decision-map.js",
    "governance-core/decision-gates.js",
    "governance-core/governance-audit-guards.js",
    "governance-core/governance-report-center.js",
    "governance-core/governance-core-app.js"
  ],

  knowledge: [
    "department-registry",
    "knowledge-decision-map",
    "decision-gates",
    "governance-audit-guards",
    "department-index-alignment",
    "family-memory-governance-audit",
    "governance-report-center"
  ],

  decisions: [
    "هل الإدارة مسجلة؟",
    "هل المعرفة تخدم قرارًا؟",
    "هل القرار يراجع المعرفة؟",
    "هل يوجد تداخل مسؤوليات؟",
    "هل توجد معرفة يتيمة؟",
    "هل الاندكس الفرعي منسجم مع خريطة المعرفة؟",
    "هل الإضافة الجديدة ظهرت في البوابات والتدقيق؟",
    "هل نتيجة المطابقة تملك عائلة وذاكرة وهامش فصل قبل اعتمادها؟",
    "هل تقارير الحوكمة قابلة للقراءة والنسخ واتخاذ القرار؟"
  ],

  serves: [
    "all-departments",
    "project-index",
    "main-orchestrator",
    "phoneme-core",
    "segment-core",
    "analysis-core",
    "memory-core",
    "training-core",
    "operation-labs"
  ],

  principles: [
    "index الفرعي يعرف الإدارة ويحمّل ملفاتها فقط.",
    "app يسجل ويفحص ولا يشغل المحركات.",
    "orchestrator ينسق ويراقب العرض العام.",
    "المحركات تعمل عند الطلب فقط.",
    "لا ملف معرفي بلا قرار.",
    "لا قرار بلا معرفة.",
    "لا إضافة تمر من خلف العداد.",
    "خريطة العائلة والذاكرة التراكمية يجب أن تؤثرا في قرار المطابقة.",
    "النجاح التشغيلي لا يساوي اعتمادًا إدراكيًا.",
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ]
};

function loadGovernanceCoreScript(src) {
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
      reject(new Error("فشل تحميل ملف الحوكمة: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadGovernanceCore = async function () {
  const report = {
    department: "governance-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة الحوكمة فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_GOVERNANCE_CORE.files) {
    try {
      const result = await loadGovernanceCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🏛️ تقرير تحميل إدارة الحوكمة:", report);
  return report;
};

window.getGovernanceCoreIndex = function () {
  return window.NOORANIYA_GOVERNANCE_CORE;
};
