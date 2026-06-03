// ================================
// nooraniya-main-orchestrator.js
// المنظم الرئيسي الآمن للنورانية العالمية
// ينسق الإدارات ويراقب التحميل والعرض العام
// لا يشغل المحركات
// لا يبني معرفة
// لا يتخذ قرارًا إدراكيًا
// ================================

console.log("🌍 nooraniya-main-orchestrator.js جاهز — Safe Main Orchestrator");

window.NOORANIYA_MAIN_STATE = {
  status: "idle",
  startedAt: null,
  completedAt: null,
  activeView: null,
  departments: {},
  summary: {}
};


// ======================================
// 1) دستور المنظم العام
// ======================================

window.NOORANIYA_MAIN_ORCHESTRATOR_CHARTER = {
  title: "دستور المنظم الرئيسي",
  law:
    "المنظم العام ينسق ولا يحكم، يفتح العرض العام ولا يشغل المحركات، ويراقب أن كل إدارة تحمل نفسها وتفحص نفسها عبر منظمها الفرعي.",

  principles: [
    "index.html يعرض الواجهات فقط.",
    "project-index.js يعرف المشروع.",
    "department-index.js يعرف الإدارة ويحمّل ملفاتها.",
    "department-app.js يسجل ويفحص ويبني لوحة الإدارة.",
    "nooraniya-main-orchestrator.js ينسق ويراقب ويفتح العرض العام.",
    "المحركات تعمل عند الطلب فقط.",
    "لا تشغيل تلقائي للمحركات.",
    "لا معرفة بلا قرار.",
    "لا قرار بلا مراجعة معرفة."
  ]
};


// ======================================
// 2) صفحات العرض العامة
// ======================================

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


// ======================================
// 3) إخفاء جميع الصفحات
// ======================================

window.hideAllNooraniyaViews = function () {
  getNooraniyaViewIds().forEach(function (id) {
    const el = document.getElementById(id);

    if (el) {
      el.style.display = "none";
    }
  });
};


// ======================================
// 4) إظهار صفحة واحدة فقط
// ======================================

window.showNooraniyaView = function (viewId) {
  window.hideAllNooraniyaViews();

  const view = document.getElementById(viewId);

  if (!view) {
    alert("الصفحة غير موجودة: " + viewId);
    return false;
  }

  view.style.display = "block";

  window.NOORANIYA_MAIN_STATE.activeView = viewId;

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

  return true;
};


// ======================================
// 5) قراءة فهرس المشروع
// ======================================

function getSafeProjectIndex() {
  if (typeof window.getProjectIndex !== "function") {
    return null;
  }

  return window.getProjectIndex();
}


// ======================================
// 6) تحميل إدارة واحدة بأمان
// ======================================

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
    // 1) قراءة index
    if (typeof window[dept.indexFunction] === "function") {
      result.indexAvailable = true;
      result.index = window[dept.indexFunction]();
    }

    // 2) تحميل ملفات الإدارة عبر index الفرعي
    if (typeof window[dept.loadFunction] === "function") {
      result.loadAvailable = true;
      result.loadReport = await window[dept.loadFunction]();
    }

    // 3) تشغيل app الإداري للفحص فقط
    // لا محركات، لا قرار، لا تشغيل صوتي
    if (typeof window[dept.appFunction] === "function") {
      result.appAvailable = true;
      result.appReport = window[dept.appFunction]();
    }

    result.status =
      result.indexAvailable &&
      result.loadAvailable &&
      result.appAvailable
        ? "ready"
        : "needs-attention";

  } catch (err) {
    result.status = "error";
    result.error = err.message;
    console.error("❌ خطأ أثناء تجهيز الإدارة:", dept.id, err);
  }

  return result;
}


// ======================================
// 7) تشغيل المنظم العام
// ======================================

window.runNooraniyaMainOrchestrator = async function () {
  const project = getSafeProjectIndex();
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


// ======================================
// 8) فتح إدارة من البوابة العامة
// ======================================

window.openNooraniyaDepartment = async function (departmentId) {
  const dept =
    typeof window.getProjectDepartment === "function"
      ? window.getProjectDepartment(departmentId)
      : null;

  if (!dept) {
    alert("الإدارة غير موجودة في project-index: " + departmentId);
    return null;
  }

  let report = window.NOORANIYA_MAIN_STATE.departments[departmentId];

  if (!report || report.status !== "ready") {
    report = await loadDepartmentByRecord(dept);
    window.NOORANIYA_MAIN_STATE.departments[departmentId] = report;
  }

  window.showNooraniyaView(dept.viewId);

  // المنظم العام يفتح الصفحة فقط
  // app الفرعي فحص وتسجيل فقط
  if (typeof window[dept.appFunction] === "function") {
    report.appReport = window[dept.appFunction]();
  }

  return report;
};


// ======================================
// 9) قراءة حالة المنظم
// ======================================

window.getNooraniyaMainState = function () {
  return window.NOORANIYA_MAIN_STATE;
};


// ======================================
// 10) فحص سريع للعرض
// ======================================

window.auditNooraniyaViews = function () {
  const ids = getNooraniyaViewIds();

  const report = {
    type: "view-audit",
    total: ids.length,
    existing: [],
    missing: [],
    checkedAt: new Date().toISOString()
  };

  ids.forEach(function (id) {
    if (document.getElementById(id)) {
      report.existing.push(id);
    } else {
      report.missing.push(id);
    }
  });

  report.ok = report.missing.length === 0;

  console.log("🖥️ تقرير صفحات العرض:", report);

  return report;
};
