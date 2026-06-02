// ======================================
// governance-core/governance-core-app.js
// المنسق التنفيذي لإدارة الحوكمة
// السلطة العليا للمشروع
// ======================================

console.log("🧠 governance-core-app.js جاهز — المنسق التنفيذي للحوكمة");


// ======================================
// 1) تشغيل تقرير الحوكمة العام
// ======================================

function runGovernanceAudit() {
  const report = {
    method: "Nooraniya Governance Audit V1",
    createdAt: new Date().toISOString(),

    departments: auditAllDepartments(),
    decisions: auditAllKnownDecisions(),
    orphanKnowledge: runOrphanKnowledgeAudit(),

    summary: {}
  };

  report.summary = buildGovernanceSummary(report);

  console.log("🏛️ تقرير الحوكمة العام:", report);

  return report;
}


// ======================================
// 2) فحص جميع الإدارات
// ======================================

function auditAllDepartments() {
  if (typeof listDepartments !== "function") {
    return {
      ok: false,
      message: "department-registry.js غير محمّل."
    };
  }

  const departments = listDepartments();

  return departments.map(function (dept) {
    if (typeof auditDepartment !== "function") {
      return {
        id: dept.id,
        ok: false,
        message: "auditDepartment غير متاحة."
      };
    }

    return auditDepartment(dept.id);
  });
}


// ======================================
// 3) فحص جميع القرارات المعروفة
// ======================================

function auditAllKnownDecisions() {
  if (typeof DECISION_TYPES === "undefined") {
    return {
      ok: false,
      message: "knowledge-decision-map.js غير محمّل."
    };
  }

  if (typeof gateDecisionExecution !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return Object.values(DECISION_TYPES).map(function (decision) {
    return gateDecisionExecution(decision.id);
  });
}


// ======================================
// 4) فحص المعارف اليتيمة
// ======================================

function runOrphanKnowledgeAudit() {
  if (typeof findOrphanKnowledge !== "function") {
    return {
      ok: false,
      message: "findOrphanKnowledge غير متاحة."
    };
  }

  const orphan = findOrphanKnowledge();

  return {
    ok: orphan.length === 0,
    count: orphan.length,
    items: orphan
  };
}


// ======================================
// 5) بناء ملخص الحوكمة
// ======================================

function buildGovernanceSummary(report) {
  const summary = {
    departmentWarnings: 0,
    unsupportedDecisions: 0,
    orphanKnowledge: 0,
    overallStatus: "unknown",
    message: ""
  };

  if (Array.isArray(report.departments)) {
    report.departments.forEach(function (item) {
      if (!item.ok) {
        summary.departmentWarnings++;
      }

      if (item.warnings && item.warnings.length) {
        summary.departmentWarnings += item.warnings.length;
      }
    });
  }

  if (Array.isArray(report.decisions)) {
    report.decisions.forEach(function (item) {
      if (!item.ok) {
        summary.unsupportedDecisions++;
      }
    });
  }

  if (report.orphanKnowledge && typeof report.orphanKnowledge.count === "number") {
    summary.orphanKnowledge = report.orphanKnowledge.count;
  }

  const totalProblems =
    summary.departmentWarnings +
    summary.unsupportedDecisions +
    summary.orphanKnowledge;

  if (totalProblems === 0) {
    summary.overallStatus = "healthy";
    summary.message = "الحوكمة سليمة: لا توجد معرفة يتيمة ولا قرارات عمياء ظاهرة.";
  } else {
    summary.overallStatus = "needs-attention";
    summary.message =
      "تحتاج الحوكمة إلى مراجعة: توجد مؤشرات معرفة معزولة أو قرارات غير مسنودة.";
  }

  return summary;
}


// ======================================
// 6) فحص طلب إنشاء ملف جديد
// ======================================

function reviewNewFileRequest(request) {
  if (typeof gateNewFile !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateNewFile(request);
}


// ======================================
// 7) فحص طلب إنشاء إدارة جديدة
// ======================================

function reviewNewDepartmentRequest(request) {
  if (typeof gateNewDepartment !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateNewDepartment(request);
}


// ======================================
// 8) فحص اعتماد نتيجة مختبر
// ======================================

function reviewLabAdoptionRequest(request) {
  if (typeof gateLabAdoption !== "function") {
    return {
      ok: false,
      message: "decision-gates.js غير محمّل."
    };
  }

  return gateLabAdoption(request);
}


// ======================================
// 9) سؤال الحوكمة السريع لأي فكرة
// ======================================

function quickGovernanceQuestion(idea) {
  return {
    idea: idea || "",
    mustAnswer: [
      "ما المعرفة التي ستنتجها؟",
      "أي قرار ستخدم؟",
      "هل توجد إدارة حالية تكفي؟",
      "هل يوجد ملف قديم يجب تطويره بدل إنشاء جديد؟",
      "ما الأثر العملي المتوقع؟",
      "هل تخدم الوجهة؟"
    ],
    law:
      "لا تعطني وصفًا، أعطني أثرًا."
  };
}


// ======================================
// 10) تصدير عام
// ======================================

window.runGovernanceAudit = runGovernanceAudit;
window.auditAllDepartments = auditAllDepartments;
window.auditAllKnownDecisions = auditAllKnownDecisions;
window.runOrphanKnowledgeAudit = runOrphanKnowledgeAudit;

window.reviewNewFileRequest = reviewNewFileRequest;
window.reviewNewDepartmentRequest = reviewNewDepartmentRequest;
window.reviewLabAdoptionRequest = reviewLabAdoptionRequest;

window.quickGovernanceQuestion = quickGovernanceQuestion;
