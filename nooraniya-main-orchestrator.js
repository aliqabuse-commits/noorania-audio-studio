// ================================
// nooraniya-main-orchestrator.js
// المنظم الرئيسي الآمن للنورانية العالمية
// ينسق التحميل والعرض والمراقبة
// لا يشغل المحركات
// ================================

console.log("🌍 nooraniya-main-orchestrator.js جاهز — Safe Main Orchestrator");

window.NOORANIYA_MAIN_STATE = {
  status: "idle",
  startedAt: null,
  completedAt: null,
  departments: {},
  summary: {}
};

function getMainViews() {
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
  getMainViews().forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
};

window.showNooraniyaView = function (viewId) {
  window.hideAllNooraniyaViews();

  const view = document.getElementById(viewId);

  if (!view) {
    alert("الصفحة غير موجودة: " + viewId);
    return false;
  }

  view.style.display = "block";
  window.scrollTo({ top: 0, behavior: "auto" });

  return true;
};

async function loadDepartmentByRecord(dept) {
  const result = {
    id: dept.id,
    name: dept.name,
    order: dept.order,
    status: "pending",
    indexFunction: dept.indexFunction,
    loadFunction: dept.loadFunction,
    appFunction: dept.appFunction,
    viewId: dept.viewId,
    indexAvailable: false,
    loadAvailable: false,
    appAvailable: false,
    index: null,
    loadReport: null,
    appReport: null,
    error: null
  };

  try {
    if (typeof window[dept.indexFunction] === "function") {
      result.indexAvailable = true;
      result.index = window[dept.indexFunction]();
    }

    if (typeof window[dept.loadFunction] === "function") {
      result.loadAvailable = true;
      result.loadReport = await window[dept.loadFunction]();
    }

    if (typeof window[dept.appFunction] === "function") {
      result.appAvailable = true;

      // app = تسجيل وفحص فقط
      // لا محركات
      result.appReport = window[dept.appFunction]();
    }

    result.status =
      result.indexAvailable && result.loadAvailable && result.appAvailable
        ? "ready"
        : "needs-attention";

  } catch (err) {
    result.status = "error";
    result.error = err.message;
    console.error("❌ خطأ في تحميل الإدارة:", dept.id, err);
  }

  return result;
}

window.runNooraniyaMainOrchestrator = async function () {
  const project =
    typeof window.getProjectIndex === "function"
      ? window.getProjectIndex()
      : null;

  const state = window.NOORANIYA_MAIN_STATE;

  state.status = "running";
  state.startedAt = new Date().toISOString();
  state.completedAt = null;
  state.departments = {};
  state.summary = {
    total: 0,
    ready: 0,
    needsAttention: 0,
    errors: 0
  };

  if (!project || !Array.isArray(project.departments)) {
    state.status = "failed";
    state.error = "project-index-missing-or-invalid";
    console.error("❌ project-index غير موجود أو غير صالح");
    return state;
  }

  const departments = project.departments
    .slice()
    .sort(function (a, b) {
      return Number(a.order || 999) - Number(b.order || 999);
    });

  for (const dept of departments) {
    const report = await loadDepartmentByRecord(dept);

    state.departments[dept.id] = report;
    state.summary.total++;

    if (report.status === "ready") {
      state.summary.ready++;
    } else if (report.status === "error") {
      state.summary.errors++;
    } else {
      state.summary.needsAttention++;
    }
  }

  state.completedAt = new Date().toISOString();

  state.status =
    state.summary.errors || state.summary.needsAttention
      ? "needs-attention"
      : "healthy";

  console.log("🌍 تقرير المنظم الرئيسي:", state);
  return state;
};

window.openNooraniyaDepartment = async function (departmentId) {
  const dept =
    typeof window.getProjectDepartment === "function"
      ? window.getProjectDepartment(departmentId)
      : null;

  if (!dept) {
    alert("الإدارة غير موجودة في project-index: " + departmentId);
    return;
  }

  if (!window.NOORANIYA_MAIN_STATE.departments[departmentId]) {
    await loadDepartmentByRecord(dept);
  }

  window.showNooraniyaView(dept.viewId);

  // المنظم العام يفتح الصفحة
  // المنظم الفرعي يملأ أو يفحص فقط
  if (typeof window[dept.appFunction] === "function") {
    window[dept.appFunction]();
  }
};

window.getNooraniyaMainState = function () {
  return window.NOORANIYA_MAIN_STATE;
};
