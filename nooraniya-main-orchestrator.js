// ================================
// nooraniya-main-orchestrator.js
// المنظم الرئيسي الآمن للنورانية العالمية
// لا يشغل المحركات
// لا يفتح المختبرات
// لا يسجل صوتًا
// فقط يشغل app.js الإداري لكل إدارة
// ================================

console.log("🌍 nooraniya-main-orchestrator.js جاهز — Safe Main Orchestrator");

window.NOORANIYA_ORCHESTRATOR_STATE = {
  status: "idle",
  startedAt: null,
  completedAt: null,
  departments: {},
  summary: {}
};


function runDepartmentSafely(dept) {
  const state = {
    id: dept.id,
    order: dept.order,
    status: "pending",
    indexFunction: dept.indexFunction,
    appFunction: dept.appFunction,
    indexAvailable: false,
    appAvailable: false,
    index: null,
    appResult: null,
    error: null
  };

  try {
    if (typeof window[dept.indexFunction] === "function") {
      state.indexAvailable = true;
      state.index = window[dept.indexFunction]();
    }

    if (typeof window[dept.appFunction] === "function") {
      state.appAvailable = true;
      state.appResult = window[dept.appFunction]();
      state.status = "checked";
    } else {
      state.status = "app-missing";
    }

  } catch (err) {
    state.status = "error";
    state.error = err.message;
    console.error("❌ فشل فحص الإدارة:", dept.id, err);
  }

  return state;
}


window.runNooraniyaMainOrchestrator = function () {
  const project =
    typeof window.getProjectIndex === "function"
      ? window.getProjectIndex()
      : null;

  const state = window.NOORANIYA_ORCHESTRATOR_STATE;

  state.status = "running";
  state.startedAt = new Date().toISOString();
  state.completedAt = null;
  state.departments = {};
  state.summary = {
    total: 0,
    checked: 0,
    missingIndex: 0,
    missingApp: 0,
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

  departments.forEach(function (dept) {
    const result = runDepartmentSafely(dept);

    state.departments[dept.id] = result;
    state.summary.total++;

    if (result.status === "checked") {
      state.summary.checked++;
    }

    if (!result.indexAvailable) {
      state.summary.missingIndex++;
    }

    if (!result.appAvailable) {
      state.summary.missingApp++;
    }

    if (result.status === "error") {
      state.summary.errors++;
    }
  });

  state.completedAt = new Date().toISOString();
  state.status =
    state.summary.errors ||
    state.summary.missingIndex ||
    state.summary.missingApp
      ? "needs-attention"
      : "healthy";

  console.log("🌍 تقرير المنظم الرئيسي:", state);
  return state;
};


window.getNooraniyaOrchestratorState = function () {
  return window.NOORANIYA_ORCHESTRATOR_STATE;
};
