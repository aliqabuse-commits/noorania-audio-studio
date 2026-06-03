// ======================================
// governance-core/governance-core-app.js
// المنسق الرقابي لإدارة الحوكمة
// لا يشغّل محركات تلقائيًا
// لا يعيد تعريف registerDepartment
// ======================================

console.log("🧠 governance-core-app.js جاهز — Sovereign Safe App");


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
    "يرجع تقريرًا موحدًا يمكن للمنظم الرئيسي قراءته."
  ]
};


// ======================================
// 2) الدوال المتوقعة من ملفات الحوكمة
// ======================================

const GOVERNANCE_EXPECTED_FUNCTIONS = [
  // governance-core-index.js
  "getGovernanceCoreIndex",

  // department-registry.js
  "getDepartmentRegistry",
  "getDepartmentById",
  "listDepartments",
  "getOrderedDepartments",
  "getDepartmentRecord",
  "registerDepartment",
  "auditDepartment",
  "auditDepartmentRegistry",

  // knowledge-decision-map.js
  "getDecisionTypes",
  "getKnowledgeDecisionMap",
  "getKnowledgeForDecision",
  "getDecisionsForKnowledge",
  "getKnowledgeByDepartment",
  "auditDecisionKnowledge",
  "auditKnowledgeUsage",
  "findOrphanKnowledge",
  "auditKnowledgeDecisionMap",

  // decision-gates.js
  "gateNewFile",
  "gateNewDepartment",
  "gateDecisionExecution",
  "gateTrainingSample",
  "gateLabAdoption",
  "auditDecisionGates",

  // governance-audit-guards.js
  "detectDuplicateResponsibilities",
  "detectOrphanKnowledge",
  "auditDecisionCoverage",
  "auditGovernanceCharterPresence",
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
    mode: "safe-registry-only",
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

  // ======================================
  // 3.1 فحص الملفات المسجلة في index
  // ======================================

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  // ======================================
  // 3.2 فحص الدوال المتوقعة
  // ======================================

  GOVERNANCE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
    const state =
      typeof window[fnName] === "function"
        ? "available"
        : "missing";

    result.functions[fnName] = state;

    if (state === "available") {
      result.summary.functionsAvailable++;
    } else {
      result.summary.functionsMissing++;
    }
  });

  // ======================================
  // 3.3 تسجيل إدارة الحوكمة في السجل الرسمي
  // لا نعيد تعريف registerDepartment هنا
  // ======================================

  if (typeof window.registerDepartment === "function" && index) {
    const registration = window.registerDepartment(index);
    result.registration = registration;
  } else {
    result.registration = {
      ok: false,
      reason: "registerDepartment-missing-or-index-missing"
    };
  }

  // ======================================
  // 3.4 فحوص سيادية لا تشغل محركات
  // ======================================

  result.sovereignChecks.governanceCharter =
    typeof window.GOVERNANCE_CHARTER !== "undefined"
      ? "available"
      : "missing";

  result.sovereignChecks.knowledgeDecisionCharter =
    typeof window.KNOWLEDGE_DECISION_CHARTER !== "undefined"
      ? "available"
      : "missing";

  result.sovereignChecks.decisionGateCharter =
    typeof window.DECISION_GATE_CHARTER !== "undefined"
      ? "available"
      : "missing";

  result.sovereignChecks.auditGuardsCharter =
    typeof window.GOVERNANCE_AUDIT_GUARDS_CHARTER !== "undefined"
      ? "available"
      : "missing";

  result.sovereignChecks.trainingCoreRegistered =
    typeof window.getDepartmentById === "function" &&
    window.getDepartmentById("training-core")
      ? "registered"
      : "missing";

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


// ======================================
// 4) تقرير الحوكمة العام — يدوي عند الطلب فقط
// ======================================

window.runGovernanceAudit = function () {
  const report = {
    method: "Nooraniya Governance Audit V2 Sovereign",
    charter: GOVERNANCE_CORE_APP_CHARTER,
    createdAt: new Date().toISOString(),
    departments:
      typeof auditDepartmentRegistry === "function"
        ? auditDepartmentRegistry()
        : { ok: false, message: "auditDepartmentRegistry غير متاحة." },
    knowledge:
      typeof auditKnowledgeDecisionMap === "function"
        ? auditKnowledgeDecisionMap()
        : { ok: false, message: "auditKnowledgeDecisionMap غير متاحة." },
    gates:
      typeof auditDecisionGates === "function"
        ? auditDecisionGates()
        : { ok: false, message: "auditDecisionGates غير متاحة." },
    guards:
      typeof runGovernanceAuditGuards === "function"
        ? runGovernanceAuditGuards()
        : { ok: false, message: "runGovernanceAuditGuards غير متاحة." }
  };

  report.summary = buildGovernanceSummary(report);

  console.log("🏛️ تقرير الحوكمة العام:", report);
  return report;
};


// ======================================
// 5) بناء ملخص الحوكمة
// ======================================

function buildGovernanceSummary(report) {
  let totalProblems = 0;

  if (report.departments && report.departments.summary) {
    totalProblems +=
      Number(report.departments.summary.missingIndexFunction || 0) +
      Number(report.departments.summary.missingAppFunction || 0) +
      Number(report.departments.summary.unregisteredNew || 0);
  }

  if (report.knowledge) {
    totalProblems += Number(report.knowledge.orphanKnowledgeCount || 0);
    totalProblems += Array.isArray(report.knowledge.warnings)
      ? report.knowledge.warnings.length
      : 0;
  }

  if (report.gates) {
    totalProblems += Array.isArray(report.gates.warnings)
      ? report.gates.warnings.length
      : 0;
  }

  if (report.guards) {
    totalProblems += Number(report.guards.totalProblems || 0);
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
// 6) مراجعات حوكمية يدوية
// ======================================

window.reviewNewFileRequest = function (request) {
  if (typeof gateNewFile !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateNewFile(request);
};


window.reviewNewDepartmentRequest = function (request) {
  if (typeof gateNewDepartment !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateNewDepartment(request);
};


window.reviewTrainingSampleRequest = function (request) {
  if (typeof gateTrainingSample !== "function") {
    return {
      ok: false,
      message: "بوابة عينة التدريب غير محمّلة."
    };
  }

  return gateTrainingSample(request);
};


window.reviewLabAdoptionRequest = function (request) {
  if (typeof gateLabAdoption !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateLabAdoption(request);
};


// ======================================
// 7) سؤال الحوكمة السريع
// ======================================

window.quickGovernanceQuestion = function (idea) {
  return {
    idea: idea || "",
    charter: GOVERNANCE_CORE_APP_CHARTER,
    mustAnswer: [
      "ما المعرفة التي ستنتجها؟",
      "أي قرار ستخدم؟",
      "هل توجد إدارة حالية تكفي؟",
      "هل يوجد ملف قديم يجب تطويره بدل إنشاء جديد؟",
      "ما الأثر العملي المتوقع؟",
      "هل تخدم الوجهة؟",
      "هل يمر هذا عبر دستور الحوكمة؟"
    ],
    law: "#لا_تعطني_وصفا_اعطني_أثرا"
  };
};
