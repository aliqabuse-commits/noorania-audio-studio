// ================================
// nooraniya-main-orchestrator.js
// المنظم العام للنورانية العالمية
// تحميل الإدارات + فتح الصفحات + استدعاء renderFunction
// لا يعيد المستخدم للرئيسية بعد فتح الإدارة
// ================================

console.log("🧭 nooraniya-main-orchestrator.js جاهز — Stable Navigation");

window.NOORANIYA_CURRENT_VIEW = "homeView";
window.NOORANIYA_CURRENT_DEPARTMENT = null;
window.NOORANIYA_ORCHESTRATOR_READY = false;

function getNooraniyaViewIds() {
  return [
    "homeView",
    "governanceCoreView",
    "phonemeCoreView",
    "segmentCoreView",
    "trainingCoreView",
    "analysisCoreView",
    "memoryCoreView",
    "perceptualTrainingView",
    "recordView",
    "cognitiveStatisticsView",
    "cognitiveExperimentsRoomView",
    "operationLabDynamicView",
    "mergeSplitView"
  ];
}

window.hideAllNooraniyaViews = function () {
  getNooraniyaViewIds().forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
};

window.showNooraniyaView = function (viewId) {
  const view = document.getElementById(viewId);

  if (!view) {
    alert("الصفحة غير موجودة: " + viewId);
    return false;
  }

  window.hideAllNooraniyaViews();

  view.style.display = "block";
  window.NOORANIYA_CURRENT_VIEW = viewId;

  window.scrollTo({ top: 0, behavior: "auto" });

  return true;
};

window.openNooraniyaDepartment = async function (departmentId) {
  const dept =
    typeof window.getProjectDepartment === "function"
      ? window.getProjectDepartment(departmentId)
      : null;

  if (!dept) {
    alert("الإدارة غير مسجلة في project-index.js: " + departmentId);
    return null;
  }

  window.NOORANIYA_CURRENT_DEPARTMENT = departmentId;

  if (dept.loadFunction && typeof window[dept.loadFunction] === "function") {
    await window[dept.loadFunction]();
  }

  window.showNooraniyaView(dept.viewId);

  let report = null;

  if (dept.appFunction && typeof window[dept.appFunction] === "function") {
    report = window[dept.appFunction]();
  }

  if (dept.renderFunction && typeof window[dept.renderFunction] === "function") {
    window[dept.renderFunction](dept.panelContainerId);
  }

  return {
    department: departmentId,
    viewId: dept.viewId,
    report: report
  };
};

window.runNooraniyaMainOrchestrator = async function () {
  window.NOORANIYA_ORCHESTRATOR_READY = true;

  const report = {
    project:
      typeof window.getProjectIndex === "function"
        ? window.getProjectIndex()
        : null,
    departments:
      typeof window.getProjectDepartments === "function"
        ? window.getProjectDepartments()
        : [],
    ready: true,
    note:
      "المنظم العام جاهز. لا يفتح الإدارات تلقائيًا ولا يعيد الصفحة للرئيسية بعد فتح إدارة."
  };

  console.log("🧭 تقرير المنظم العام:", report);

  return report;
};

window.goHome = function () {
  window.NOORANIYA_CURRENT_DEPARTMENT = null;
  window.showNooraniyaView("homeView");

  if (typeof window.renderHome === "function") {
    window.renderHome();
  }
};

console.log("🧭 المنظم العام مستقر — لا رجوع تلقائي للرئيسية");
