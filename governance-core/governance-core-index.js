// ================================
// governance-core/governance-core-index.js
// فهرس إدارة الحوكمة — تعريف سيادي فقط
// لا تحميل
// لا تشغيل
// ================================

console.log("🏛️ governance-core-index.js جاهز — Sovereign Frozen Index");

window.NOORANIYA_GOVERNANCE_CORE = {
  name: "governance-core",
  mode: "frozen-index-only",

  charter: {
    title: "دستور إدارة الحوكمة",
    law:
      "المعرفة التي لا تؤثر في القرار ليست جزءًا من المنظومة بعد، " +
      "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد.",
    motto: [
      "#الحوكمة",
      "#لا_تعطني_وصفا_اعطني_أثرا",
      "#المعرفة_تخدم_القرار",
      "#القرار_يراجع_المعرفة",
      "#كل_شيء_يخدم_الوجهة"
    ]
  },

  role:
    "إدارة الحوكمة التي تضبط علاقة المعرفة بالقرار، وتمنع الفوضى المعمارية، وتحرس الوجهة العليا للمشروع.",

  files: [
    "governance-core-index.js",
    "department-registry.js",
    "knowledge-decision-map.js",
    "decision-gates.js",
    "governance-audit-guards.js",
    "governance-core-app.js",
    "README.md"
  ],

  knowledge: [
    "governance-charter",
    "department-registry",
    "knowledge-decision-map",
    "decision-gates",
    "governance-audit-guards",
    "governance-audit-report"
  ],

  decisions: [
    "هل الإدارة مسجلة رسميًا؟",
    "هل المعرفة مرتبطة بقرار؟",
    "هل القرار يراجع المعرفة المتاحة؟",
    "هل يوجد ملف بلا أثر؟",
    "هل يوجد تداخل مسؤوليات بين الإدارات؟",
    "هل يجوز إنشاء إدارة جديدة؟",
    "هل يجوز اعتماد نتيجة مختبر؟",
    "هل training-core مسجلة ومضبوطة داخل السجل؟"
  ],

  serves: [
    "phoneme-core",
    "segment-core",
    "training-core",
    "analysis-core",
    "memory-core",
    "operation-labs",
    "project-index",
    "main-orchestrator"
  ],

  principles: [
    "index.js تعريف فقط، لا تحميل ولا تشغيل.",
    "app.js فحص وتنسيق فقط، لا يشغل محركات تلقائيًا.",
    "لا تُقبل معرفة لا تخدم قرارًا.",
    "لا يُقبل قرار لا يراجع المعرفة.",
    "لا تُقبل إدارة جديدة إلا عبر السجل والبوابات.",
    "لا يُعتمد مختبر إلا بأثر وقرار.",
    "الحوكمة سلطة سيادية لا تُتجاوز."
  ]
};

window.getGovernanceCoreIndex = function () {
  return window.NOORANIYA_GOVERNANCE_CORE;
};
