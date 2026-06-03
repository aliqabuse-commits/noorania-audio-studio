// ================================
// project-index.js
// الفهرس السيادي العام للنورانية العالمية
// تعريف المشروع والإدارات فقط
// لا يفتح صفحات
// لا يحمّل محركات
// لا يشغل app
// ================================

console.log("🌍 project-index.js جاهز — Sovereign Project Index");

window.NOORANIYA_PROJECT_INDEX = {
  name: "nooraniya-global",
  title: "النورانية العالمية",
  mode: "safe-project-index",

  charter: {
    title: "دستور المشروع",
    law:
      "المعرفة التي لا تؤثر في القرار ليست جزءًا من المنظومة بعد. " +
      "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد.",
    principles: [
      "#الحوكمة",
      "#لا_تعطني_وصفا_اعطني_أثرا",
      "#المعرفة_تخدم_القرار",
      "#القرار_يراجع_المعرفة",
      "#كل_شيء_يخدم_الوجهة"
    ]
  },

  governanceAuthority: "governance-core",

  departments: [
    {
      order: 1,
      id: "governance-core",
      name: "إدارة الحوكمة",
      status: "official",
      viewId: "governanceCoreView",
      panelContainerId: "governance-actions",
      indexFunction: "getGovernanceCoreIndex",
      loadFunction: "loadGovernanceCore",
      appFunction: "runGovernanceCoreApp",
      renderFunction: "renderGovernanceCorePanel"
    },
    {
      order: 2,
      id: "phoneme-core",
      name: "إدارة الحرف",
      status: "official",
      viewId: "phonemeCoreView",
      panelContainerId: "phoneme-actions",
      indexFunction: "getPhonemeCoreIndex",
      loadFunction: "loadPhonemeCore",
      appFunction: "runPhonemeCoreApp",
      renderFunction: "renderPhonemeCorePanel"
    },
    {
      order: 3,
      id: "segment-core",
      name: "إدارة المقاطع",
      status: "official",
      viewId: "segmentCoreView",
      panelContainerId: "segment-actions",
      indexFunction: "getSegmentCoreIndex",
      loadFunction: "loadSegmentCore",
      appFunction: "runSegmentCoreApp",
      renderFunction: "renderSegmentCorePanel"
    },
    {
      order: 4,
      id: "training-core",
      name: "إدارة التدريب والتسجيل",
      status: "official",
      viewId: "trainingCoreView",
      panelContainerId: "training-actions",
      indexFunction: "getTrainingCoreIndex",
      loadFunction: "loadTrainingCore",
      appFunction: "runTrainingCoreApp",
      renderFunction: "renderTrainingCorePanel"
    },
    {
      order: 5,
      id: "analysis-core",
      name: "إدارة التحليل",
      status: "official",
      viewId: "analysisCoreView",
      panelContainerId: "analysis-actions",
      indexFunction: "getAnalysisCoreIndex",
      loadFunction: "loadAnalysisCore",
      appFunction: "runAnalysisCoreApp",
      renderFunction: "renderAnalysisCorePanel"
    },
    {
      order: 6,
      id: "memory-core",
      name: "إدارة الذاكرة",
      status: "official",
      viewId: "memoryCoreView",
      panelContainerId: "memory-actions",
      indexFunction: "getMemoryCoreIndex",
      loadFunction: "loadMemoryCore",
      appFunction: "runMemoryCoreApp",
      renderFunction: "renderMemoryCorePanel"
    },
    {
      order: 7,
      id: "operation-labs",
      name: "إدارة المختبرات",
      status: "experimental",
      viewId: "cognitiveExperimentsRoomView",
      panelContainerId: "operation-labs-grid",
      indexFunction: "getOperationLabsIndex",
      loadFunction: "loadOperationLabs",
      appFunction: "runOperationLabsApp",
      renderFunction: "renderOperationLabsPanel"
    }
  ]
};

window.getProjectIndex = function () {
  return window.NOORANIYA_PROJECT_INDEX;
};

window.getProjectDepartments = function () {
  return window.NOORANIYA_PROJECT_INDEX.departments || [];
};

window.getProjectDepartment = function (id) {
  return (
    window.getProjectDepartments().find(function (dept) {
      return dept.id === id;
    }) || null
  );
};
