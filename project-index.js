// ================================
// project-index.js
// الفهرس السيادي العام للنورانية العالمية
// تعريف فقط — لا تحميل — لا تشغيل
// ================================

console.log("🌍 project-index.js جاهز — Sovereign Project Index");

window.NOORANIYA_PROJECT_INDEX = {
  name: "nooraniya-global",
  title: "النورانية العالمية",
  mode: "sovereign-project-index-only",

  charter: {
    title: "دستور فهرس المشروع",
    law:
      "المشروع لا يُدار كملفات متفرقة، بل كمنظومة معرفة وقرار وأثر.",
    rules: [
      "كل إدارة يجب أن تكون مسجلة في department-registry.js.",
      "كل index تعريف فقط ولا يشغل شيئًا.",
      "كل app يفحص ويسجل ولا يشغل المحركات.",
      "كل معرفة يجب أن تخدم قرارًا.",
      "كل قرار يجب أن يراجع المعرفة.",
      "المنظم الرئيسي لا يشغل المحركات، بل يجمع تقارير الإدارات."
    ]
  },

  governanceAuthority: "governance-core",

  departments: [
    {
      id: "governance-core",
      order: 1,
      status: "official",
      indexFunction: "getGovernanceCoreIndex",
      appFunction: "runGovernanceCoreApp"
    },
    {
      id: "phoneme-core",
      order: 2,
      status: "official",
      indexFunction: "getPhonemeCoreIndex",
      appFunction: "runPhonemeCoreApp"
    },
    {
      id: "segment-core",
      order: 3,
      status: "official",
      indexFunction: "getSegmentCoreIndex",
      appFunction: "runSegmentCoreApp"
    },
    {
      id: "training-core",
      order: 4,
      status: "official",
      indexFunction: "getTrainingCoreIndex",
      appFunction: "runTrainingCoreApp"
    },
    {
      id: "analysis-core",
      order: 5,
      status: "official",
      indexFunction: "getAnalysisCoreIndex",
      appFunction: "runAnalysisCoreApp"
    },
    {
      id: "memory-core",
      order: 6,
      status: "official",
      indexFunction: "getMemoryCoreIndex",
      appFunction: "runMemoryCoreApp"
    },
    {
      id: "operation-labs",
      order: 7,
      status: "experimental",
      indexFunction: "getOperationLabsIndex",
      appFunction: "runOperationLabsApp"
    }
  ],

  principles: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ]
};

window.getProjectIndex = function () {
  return window.NOORANIYA_PROJECT_INDEX;
};
