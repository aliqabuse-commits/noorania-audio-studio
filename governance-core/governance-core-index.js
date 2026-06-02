// ================================
// governance-core-index.js
// فهرس إدارة الحوكمة — تعريف فقط
// لا يشغل شيئًا تلقائيًا
// ================================

console.log("🏛️ governance-core-index.js جاهز — Frozen Index Only");

window.NOORANIYA_GOVERNANCE_CORE = {
  name: "governance-core",
  role: "إدارة الحوكمة التي تضبط علاقة المعرفة بالقرار وتمنع الفوضى المعمارية",
  mode: "frozen-index-only",

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
    "department-registry",
    "knowledge-decision-map",
    "decision-gates",
    "audit-guards",
    "governance-principles"
  ],

  decisions: [
    "هل الإدارة مسجلة؟",
    "هل المعرفة مرتبطة بقرار؟",
    "هل القرار يراجع المعرفة المتاحة؟",
    "هل يوجد ملف بلا أثر؟",
    "هل يوجد تداخل مسؤوليات بين الإدارات؟",
    "هل يجوز ترقية تجربة إلى إدارة رسمية؟"
  ],

  principles: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ]
};

window.getGovernanceCoreIndex = function () {
  return window.NOORANIYA_GOVERNANCE_CORE;
};
