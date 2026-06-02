// ======================================
// governance-core/governance-audit-guards.js
// حراس التدقيق الحوكمي
// يجمع:
// 1) كشف تكرار المسؤوليات
// 2) كشف المعرفة اليتيمة
// 3) فحص تغطية القرارات بالمعرفة
// ======================================

console.log("🛡️ governance-audit-guards.js جاهز");


// ======================================
// 1) كشف تكرار المسؤوليات بين الإدارات
// ======================================

function detectDuplicateResponsibilities() {
  if (typeof getDepartmentRegistry !== "function") {
    return {
      ok: false,
      message: "department-registry.js غير محمّل."
    };
  }

  const registry = getDepartmentRegistry();
  const departments = Object.values(registry);
  const duplicates = [];

  for (let i = 0; i < departments.length; i++) {
    for (let j = i + 1; j < departments.length; j++) {
      const a = departments[i];
      const b = departments[j];

      const sharedProduces = intersectArrays(a.produces || [], b.produces || []);
      const sharedServes = intersectArrays(a.serves || [], b.serves || []);

      if (sharedProduces.length || sharedServes.length) {
        duplicates.push({
          departmentA: a.id,
          departmentB: b.id,
          sharedProduces,
          sharedServes,
          warning:
            "يوجد تداخل محتمل بين الإدارتين. راجع هل نحتاج تطوير إدارة قائمة بدل إنشاء/توسيع إدارة أخرى."
        });
      }
    }
  }

  return {
    ok: duplicates.length === 0,
    type: "duplicate-responsibility-audit",
    count: duplicates.length,
    duplicates,
    message: duplicates.length
      ? "توجد تداخلات مسؤولية تحتاج مراجعة."
      : "لا توجد تداخلات مسؤولية ظاهرة."
  };
}


// ======================================
// 2) كشف المعرفة اليتيمة
// معرفة موجودة في الخريطة لكنها لا تخدم أي قرار
// ======================================

function detectOrphanKnowledge() {
  if (typeof getKnowledgeDecisionMap !== "function") {
    return {
      ok: false,
      message: "knowledge-decision-map.js غير محمّل."
    };
  }

  const map = getKnowledgeDecisionMap();

  const orphan = Object.values(map).filter(function (item) {
    return !item.mustServe || !item.mustServe.length;
  });

  return {
    ok: orphan.length === 0,
    type: "orphan-knowledge-audit",
    count: orphan.length,
    orphanKnowledge: orphan.map(function (item) {
      return {
        id: item.id,
        type: item.knowledgeType,
        department: item.sourceDepartment,
        sourceFiles: item.sourceFiles || [],
        warning:
          "هذه المعرفة لا تخدم أي قرار مسجل، وهذا يخالف ميثاق الحوكمة."
      };
    }),
    message: orphan.length
      ? "توجد معرفة يتيمة لا تخدم قرارًا."
      : "لا توجد معرفة يتيمة ظاهرة."
  };
}


// ======================================
// 3) فحص تغطية القرارات بالمعرفة
// قرار موجود لكنه لا يملك معرفة مساندة
// ======================================

function auditDecisionCoverage() {
  if (typeof DECISION_TYPES === "undefined") {
    return {
      ok: false,
      message: "DECISION_TYPES غير محمّل."
    };
  }

  if (typeof getKnowledgeForDecision !== "function") {
    return {
      ok: false,
      message: "getKnowledgeForDecision غير متاح."
    };
  }

  const results = Object.values(DECISION_TYPES).map(function (decision) {
    const knowledge = getKnowledgeForDecision(decision.id);

    return {
      decisionId: decision.id,
      decisionName: decision.name,
      supported: knowledge.length > 0,
      knowledgeCount: knowledge.length,
      knowledge: knowledge.map(function (item) {
        return {
          id: item.id,
          type: item.knowledgeType,
          department: item.sourceDepartment,
          status: item.status
        };
      }),
      warning: knowledge.length
        ? null
        : "هذا القرار لا يملك معرفة مساندة مسجلة."
    };
  });

  const unsupported = results.filter(function (r) {
    return !r.supported;
  });

  return {
    ok: unsupported.length === 0,
    type: "decision-coverage-audit",
    unsupportedCount: unsupported.length,
    decisions: results,
    message: unsupported.length
      ? "توجد قرارات لا تراجع معرفة مسجلة."
      : "كل القرارات المسجلة لها معرفة مساندة."
  };
}


// ======================================
// 4) تشغيل الحراس الثلاثة معًا
// ======================================

function runGovernanceAuditGuards() {
  const duplicateAudit = detectDuplicateResponsibilities();
  const orphanAudit = detectOrphanKnowledge();
  const decisionAudit = auditDecisionCoverage();

  const totalProblems =
    (duplicateAudit.count || 0) +
    (orphanAudit.count || 0) +
    (decisionAudit.unsupportedCount || 0);

  const report = {
    method: "Governance Audit Guards V1",
    createdAt: new Date().toISOString(),
    ok: totalProblems === 0,
    totalProblems,
    duplicateAudit,
    orphanAudit,
    decisionAudit,
    message: totalProblems
      ? "الحوكمة وجدت مشكلات تحتاج مراجعة."
      : "الحوكمة لا ترى مشكلات ظاهرة الآن."
  };

  console.log("🛡️ تقرير حراس الحوكمة:", report);

  return report;
}


// ======================================
// 5) أدوات مساعدة
// ======================================

function normalizeGovernanceText(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function intersectArrays(a, b) {
  const setB = {};
  b.forEach(function (item) {
    setB[normalizeGovernanceText(item)] = true;
  });

  return a.filter(function (item) {
    return setB[normalizeGovernanceText(item)];
  });
}


// ======================================
// 6) تصدير عام
// ======================================

window.detectDuplicateResponsibilities = detectDuplicateResponsibilities;
window.detectOrphanKnowledge = detectOrphanKnowledge;
window.auditDecisionCoverage = auditDecisionCoverage;
window.runGovernanceAuditGuards = runGovernanceAuditGuards;
