// ======================================
// governance-core/governance-core-app.js
// المنسق الرقابي لإدارة الحوكمة — V3
// تسجيل + فحص + بناء لوحة الحوكمة
// لا يشغل محركات صوتية تلقائيًا
// لا يعيد تعريف registerDepartment
// ======================================

console.log("🧠 governance-core-app.js جاهز — V3 Sovereign Safe App");


// ======================================
// 1) دستور المنظم الحوكمي
// ======================================

const GOVERNANCE_CORE_APP_CHARTER = {
  title: "دستور منسق الحوكمة",
  law:
    "منسق الحوكمة لا يبني القرار بدل الإدارات، بل يفحص أن كل إدارة ومعرفة وقرار يخضع للدستور.",
  warning:
    "أي منسق يعيد تعريف سلطة السجل أو يشغل المحركات تلقائيًا يتحول من حارس إلى متجاوز.",
  rules: [
    "لا يعيد تعريف registerDepartment.",
    "لا يشغل محركًا صوتيًا أو تحليليًا أو تجريبيًا.",
    "لا يحمّل ملفات تلقائيًا.",
    "يفحص فقط وجود الدوال والسيادة الحوكمية.",
    "يبني لوحة الحوكمة داخل الحاوية فقط.",
    "يرجع تقريرًا موحدًا يمكن للمنظم الرئيسي قراءته.",
    "يراقب أن الإضافات الجديدة لا تمر من خلف العداد."
  ]
};


// ======================================
// 2) الدوال المتوقعة من ملفات الحوكمة
// ======================================

const GOVERNANCE_EXPECTED_FUNCTIONS = [
  "getGovernanceCoreIndex",

  "getDepartmentRegistry",
  "getDepartmentById",
  "listDepartments",
  "getOrderedDepartments",
  "getDepartmentRecord",
  "registerDepartment",
  "auditDepartment",
  "auditDepartmentRegistry",

  "getDecisionTypes",
  "getKnowledgeDecisionMap",
  "getKnowledgeForDecision",
  "getDecisionsForKnowledge",
  "getKnowledgeByDepartment",
  "getKnowledgeBySourceFile",
  "auditDecisionKnowledge",
  "auditKnowledgeUsage",
  "findOrphanKnowledge",
  "auditKnowledgeDecisionMap",

  "gateNewFile",
  "gateNewDepartment",
  "gateDecisionExecution",
  "gateTrainingSample",
  "gatePhonemeFamilyComparison",
  "gateCumulativeMemoryReview",
  "gateMatchResultAdoption",
  "gateLabAdoption",
  "auditDecisionGates",

  "detectDuplicateResponsibilities",
  "detectOrphanKnowledge",
  "auditDecisionCoverage",
  "auditGovernanceCharterPresence",
  "auditDepartmentIndexAlignment",
  "auditPhonemeFamilyAndCumulativeMemoryGovernance",
  "runGovernanceAuditGuards"
];


// ======================================
// 3) تشغيل منظم الحوكمة الآمن
// ======================================

window.runGovernanceCoreApp = function () {
  const index =
    typeof window.getGovernanceCoreIndex === "function"
      ? window.getGovernanceCoreIndex()
      : null;

  const result = {
    department: "governance-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: GOVERNANCE_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    sovereignChecks: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0,
      charterChecksPassed: 0,
      charterChecksFailed: 0
    },
    note:
      "تم تسجيل وفحص إدارة الحوكمة فقط دون تحميل أو تشغيل تلقائي."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  GOVERNANCE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
    const state = typeof window[fnName] === "function" ? "available" : "missing";
    result.functions[fnName] = state;

    if (state === "available") result.summary.functionsAvailable++;
    else result.summary.functionsMissing++;
  });

  if (typeof window.registerDepartment === "function" && index) {
    window.registerDepartment(index);
    result.registration = "registered";
  } else {
    result.registration = "missing";
  }

  result.sovereignChecks.governanceCharter =
    typeof window.GOVERNANCE_CHARTER !== "undefined" ? "available" : "missing";

  result.sovereignChecks.knowledgeDecisionCharter =
    typeof window.KNOWLEDGE_DECISION_CHARTER !== "undefined" ? "available" : "missing";

  result.sovereignChecks.decisionGateCharter =
    typeof window.DECISION_GATE_CHARTER !== "undefined" ? "available" : "missing";

  result.sovereignChecks.auditGuardsCharter =
    typeof window.GOVERNANCE_AUDIT_GUARDS_CHARTER !== "undefined" ? "available" : "missing";

  result.sovereignChecks.trainingCoreRegistered =
    typeof window.getDepartmentById === "function" && window.getDepartmentById("training-core")
      ? "registered"
      : "missing";

  result.sovereignChecks.phonemeFamilyMapGoverned =
    isGovernanceKnowledgeAvailable("phoneme-family-map") ? "available" : "missing";

  result.sovereignChecks.phonemeCumulativeMemoryGoverned =
    isGovernanceKnowledgeAvailable("phoneme-cumulative-memory") ? "available" : "missing";

  Object.keys(result.sovereignChecks).forEach(function (key) {
    if (
      result.sovereignChecks[key] === "available" ||
      result.sovereignChecks[key] === "registered"
    ) {
      result.summary.charterChecksPassed++;
    } else {
      result.summary.charterChecksFailed++;
    }
  });

  console.log("✅ governance-core safe report:", result);
  return result;
};


function isGovernanceKnowledgeAvailable(knowledgeId) {
  if (typeof window.getKnowledgeDecisionMap !== "function") return false;

  const map = window.getKnowledgeDecisionMap();
  return Object.values(map).some(function (item) {
    return item.id === knowledgeId;
  });
}


// ======================================
// 4) بناء لوحة إدارة الحوكمة
// ======================================

window.renderGovernanceCorePanel = function (containerId) {
  const container = document.getElementById(containerId || "governance-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية الحوكمة:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report = window.runGovernanceCoreApp();

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة الحوكمة:</b> " +
    (report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " + report.summary.functionsAvailable +
    "<br><b>الدوال الناقصة:</b> " + report.summary.functionsMissing +
    "<br><b>فحوص الدستور الناجحة:</b> " + report.summary.charterChecksPassed +
    "<br><b>فحوص الدستور الناقصة:</b> " + report.summary.charterChecksFailed +
    "<br><b>خريطة العائلة:</b> " + report.sovereignChecks.phonemeFamilyMapGoverned +
    "<br><b>الذاكرة التراكمية:</b> " + report.sovereignChecks.phonemeCumulativeMemoryGoverned +
    "<br><span style='color:#94a3b8;'>الحوكمة تفحص ولا تشغل المحركات.</span>";

  container.appendChild(statusBox);
function renderGovernanceResult(title, data) {
  let box = document.getElementById("governance-result-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "governance-result-box";
    box.style.background = "#020617";
    box.style.color = "#e5e7eb";
    box.style.border = "1px solid #38bdf8";
    box.style.borderRadius = "12px";
    box.style.padding = "12px";
    box.style.margin = "16px auto";
    box.style.width = "92%";
    box.style.maxHeight = "420px";
    box.style.overflow = "auto";
    box.style.direction = "ltr";
    box.style.textAlign = "left";

    const container = document.getElementById("governance-actions");
    if (container) container.appendChild(box);
  }

  box.innerHTML =
    "<h3 style='direction:rtl;text-align:right;color:#38bdf8;'>" +
    title +
    "</h3><pre style='white-space:pre-wrap;font-size:12px;'>" +
    JSON.stringify(data, null, 2) +
    "</pre>";

  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
  addGovernanceButton(container, "🏛️ تقرير الحوكمة العام", function () {
  if (typeof window.runGovernanceAudit === "function") {
    const report = window.runGovernanceAudit();
    renderGovernanceResult("🏛️ تقرير الحوكمة العام", report);
  } else {
    alert("runGovernanceAudit غير متاحة.");
  }
});

  addGovernanceButton(container, "🧭 فحص سجل الإدارات", function () {
    if (typeof window.auditDepartmentRegistry === "function") window.auditDepartmentRegistry();
    else alert("auditDepartmentRegistry غير متاحة.");
  });

  addGovernanceButton(container, "🗺️ فحص خريطة المعرفة والقرار", function () {
    if (typeof window.auditKnowledgeDecisionMap === "function") window.auditKnowledgeDecisionMap();
    else alert("auditKnowledgeDecisionMap غير متاحة.");
  });

  addGovernanceButton(container, "🚦 فحص بوابات القرار", function () {
    if (typeof window.auditDecisionGates === "function") window.auditDecisionGates();
    else alert("auditDecisionGates غير متاحة.");
  });

  addGovernanceButton(container, "🛡️ تشغيل حراس الحوكمة", function () {
    if (typeof window.runGovernanceAuditGuards === "function") window.runGovernanceAuditGuards();
    else alert("runGovernanceAuditGuards غير متاحة.");
  });

  addGovernanceButton(container, "🔎 فحص الاندكسات ضد الحوكمة", function () {
    if (typeof window.auditDepartmentIndexAlignment === "function") window.auditDepartmentIndexAlignment();
    else alert("auditDepartmentIndexAlignment غير متاحة.");
  });

  addGovernanceButton(container, "🧬 فحص العائلة والذاكرة التراكمية", function () {
    if (typeof window.auditPhonemeFamilyAndCumulativeMemoryGovernance === "function") {
      window.auditPhonemeFamilyAndCumulativeMemoryGovernance();
    } else {
      alert("فحص العائلة والذاكرة التراكمية غير متاح.");
    }
  });

  return report;
};


// ======================================
// 5) تقرير الحوكمة العام — يدوي عند الطلب فقط
// ======================================

window.runGovernanceAudit = function () {
  const report = {
    method: "Nooraniya Governance Audit V3 Sovereign",
    charter: GOVERNANCE_CORE_APP_CHARTER,
    createdAt: new Date().toISOString(),

    departments:
      typeof window.auditDepartmentRegistry === "function"
        ? window.auditDepartmentRegistry()
        : { ok: false, message: "auditDepartmentRegistry غير متاحة." },

    knowledge:
      typeof window.auditKnowledgeDecisionMap === "function"
        ? window.auditKnowledgeDecisionMap()
        : { ok: false, message: "auditKnowledgeDecisionMap غير متاحة." },

    gates:
      typeof window.auditDecisionGates === "function"
        ? window.auditDecisionGates()
        : { ok: false, message: "auditDecisionGates غير متاحة." },

    guards:
      typeof window.runGovernanceAuditGuards === "function"
        ? window.runGovernanceAuditGuards()
        : { ok: false, message: "runGovernanceAuditGuards غير متاحة." },

    familyMemory:
      typeof window.auditPhonemeFamilyAndCumulativeMemoryGovernance === "function"
        ? window.auditPhonemeFamilyAndCumulativeMemoryGovernance()
        : { ok: false, message: "فحص العائلة والذاكرة التراكمية غير متاح." }
  };

  report.summary = buildGovernanceSummary(report);

  console.log("🏛️ تقرير الحوكمة العام:", report);
  return report;
};


// ======================================
// 6) بناء ملخص الحوكمة
// ======================================

function buildGovernanceSummary(report) {
  let totalProblems = 0;

  if (report.departments && report.departments.summary) {
    totalProblems +=
      Number(report.departments.summary.missingIndexFunction || 0) +
      Number(report.departments.summary.missingAppFunction || 0) +
      Number(report.departments.summary.unregisteredNew || 0) +
      Number(report.departments.summary.failedDepartments || 0);
  }

  if (report.knowledge) {
    totalProblems += Number(report.knowledge.orphanKnowledgeCount || 0);
    totalProblems += Array.isArray(report.knowledge.warnings) ? report.knowledge.warnings.length : 0;
  }

  if (report.gates) {
    totalProblems += Array.isArray(report.gates.warnings) ? report.gates.warnings.length : 0;
  }

  if (report.guards) {
    totalProblems += Number(report.guards.totalProblems || 0);
  }

  if (report.familyMemory && Array.isArray(report.familyMemory.warnings)) {
    totalProblems += report.familyMemory.warnings.length;
  }

  return {
    totalProblems,
    overallStatus: totalProblems === 0 ? "healthy" : "needs-attention",
    message:
      totalProblems === 0
        ? "الحوكمة سليمة ظاهريًا: لا توجد مؤشرات سيادية خطرة الآن."
        : "الحوكمة تحتاج مراجعة: توجد مؤشرات يجب عدم تجاهلها."
  };
}


// ======================================
// 7) مراجعات حوكمية يدوية
// ======================================

window.reviewNewFileRequest = function (request) {
  if (typeof window.gateNewFile !== "function") return { ok: false, message: "decision-gates.js غير محمّل." };
  return window.gateNewFile(request);
};

window.reviewNewDepartmentRequest = function (request) {
  if (typeof window.gateNewDepartment !== "function") return { ok: false, message: "decision-gates.js غير محمّل." };
  return window.gateNewDepartment(request);
};

window.reviewTrainingSampleRequest = function (request) {
  if (typeof window.gateTrainingSample !== "function") return { ok: false, message: "بوابة عينة التدريب غير محمّلة." };
  return window.gateTrainingSample(request);
};

window.reviewLabAdoptionRequest = function (request) {
  if (typeof window.gateLabAdoption !== "function") return { ok: false, message: "decision-gates.js غير محمّل." };
  return window.gateLabAdoption(request);
};

window.reviewPhonemeFamilyComparison = function (request) {
  if (typeof window.gatePhonemeFamilyComparison !== "function") return { ok: false, message: "بوابة العائلة الإدراكية غير محمّلة." };
  return window.gatePhonemeFamilyComparison(request);
};

window.reviewCumulativeMemoryDecision = function (request) {
  if (typeof window.gateCumulativeMemoryReview !== "function") return { ok: false, message: "بوابة الذاكرة التراكمية غير محمّلة." };
  return window.gateCumulativeMemoryReview(request);
};

window.reviewMatchResultAdoption = function (request) {
  if (typeof window.gateMatchResultAdoption !== "function") return { ok: false, message: "بوابة اعتماد نتيجة المطابقة غير محمّلة." };
  return window.gateMatchResultAdoption(request);
};


// ======================================
// 8) سؤال الحوكمة السريع
// ======================================

window.quickGovernanceQuestion = function (idea) {
  return {
    idea: idea || "",
    charter: GOVERNANCE_CORE_APP_CHARTER,
    mustAnswer: [
      "ما المعرفة التي ستنتجها؟",
      "أي قرار ستخدم؟",
      "ما الإدارة المالكة؟",
      "ما الإدارات المستفيدة؟",
      "ما الاندكسات التي يجب تحديثها؟",
      "هل يجب تحديث knowledge-decision-map؟",
      "هل يجب تحديث decision-gates؟",
      "هل يجب تحديث governance-audit-guards؟",
      "هل يوجد ملف قديم يجب تطويره بدل إنشاء جديد؟",
      "ما الأثر العملي المتوقع؟",
      "هل تخدم الوجهة؟",
      "هل يمر هذا عبر دستور الحوكمة؟"
    ],
    law: "#لا_تعطني_وصفا_اعطني_أثرا"
  };
};


// ======================================
// 9) زر آمن للوحة الحوكمة
// ======================================

function addGovernanceButton(container, label, handler) {
  const btn = document.createElement("button");
  btn.innerText = label;

  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر الحوكمة:", err);
      alert("حدث خطأ أثناء تنفيذ الإجراء:\n" + err.message);
    }
  };

  container.appendChild(btn);
}
