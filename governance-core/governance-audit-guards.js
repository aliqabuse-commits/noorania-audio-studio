// ======================================
// governance-core/governance-audit-guards.js
// حراس التدقيق الحوكمي — نسخة سيادية
// يجمع:
// 1) كشف تكرار المسؤوليات
// 2) كشف المعرفة اليتيمة
// 3) فحص تغطية القرارات بالمعرفة
// 4) فحص حضور الدستور في السجل والخريطة والبوابات
// ======================================

console.log("🛡️ governance-audit-guards.js جاهز — Sovereign Governance Mode");


// ======================================
// 1) دستور حراس الحوكمة
// ======================================

const GOVERNANCE_AUDIT_GUARDS_CHARTER = {
  motto: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ],

  supremeLaw:
    "لا تكفي سلامة الملفات؛ يجب أن تثبت الحوكمة أن كل معرفة تخدم قرارًا، وأن كل قرار يراجع معرفة، وأن كل إدارة تخدم الوجهة.",

  warning:
    "أي تداخل بلا ضبط، أو معرفة بلا قرار، أو قرار بلا معرفة، هو خلل حوكمي لا يجوز تجاهله."
};


// ======================================
// 2) قراءة الإدارات من السجل الجديد أو القديم
// ======================================

function getGovernanceDepartmentsArray() {
  if (typeof getDepartmentRegistry !== "function") {
    return null;
  }

  const registry = getDepartmentRegistry();

  if (!registry) return null;

  if (registry.departments) {
    return Object.values(registry.departments);
  }

  return Object.values(registry);
}


// ======================================
// 3) كشف تكرار المسؤوليات بين الإدارات
// ======================================

function detectDuplicateResponsibilities() {
  const departments = getGovernanceDepartmentsArray();

  if (!departments) {
    return {
      ok: false,
      type: "duplicate-responsibility-audit",
      message: "department-registry.js غير محمّل أو لا يرجع سجلًا صالحًا."
    };
  }

  const duplicates = [];

  for (let i = 0; i < departments.length; i++) {
    for (let j = i + 1; j < departments.length; j++) {
      const a = departments[i];
      const b = departments[j];

      const sharedProduces =
        intersectArrays(a.produces || [], b.produces || []);

      const sharedServes =
        intersectArrays(a.serves || [], b.serves || []);

      if (sharedProduces.length || sharedServes.length) {
        duplicates.push({
          departmentA: a.id || a.englishName || a.name,
          departmentB: b.id || b.englishName || b.name,
          sharedProduces,
          sharedServes,
          warning:
            "يوجد تداخل محتمل. لا يُرفض التداخل تلقائيًا، لكنه يحتاج قرار حوكمة: هل هو تكامل مشروع أم تضارب مسؤوليات؟"
        });
      }
    }
  }

  return {
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
    ok: duplicates.length === 0,
    type: "duplicate-responsibility-audit",
    count: duplicates.length,
    duplicates,
    message: duplicates.length
      ? "توجد تداخلات مسؤولية تحتاج مراجعة سيادية."
      : "لا توجد تداخلات مسؤولية ظاهرة."
  };
}


// ======================================
// 4) كشف المعرفة اليتيمة
// ======================================

function detectOrphanKnowledge() {
  if (typeof getKnowledgeDecisionMap !== "function") {
    return {
      ok: false,
      type: "orphan-knowledge-audit",
      message: "knowledge-decision-map.js غير محمّل."
    };
  }

  const map = getKnowledgeDecisionMap();

  const orphan = Object.values(map).filter(function (item) {
    return !item.mustServe || !item.mustServe.length;
  });

  return {
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
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
          "هذه المعرفة لا تخدم أي قرار مسجل، وهذا يخالف دستور الحوكمة."
      };
    }),
    message: orphan.length
      ? "توجد معرفة يتيمة لا تخدم قرارًا."
      : "لا توجد معرفة يتيمة ظاهرة."
  };
}


// ======================================
// 5) فحص تغطية القرارات بالمعرفة
// ======================================

function auditDecisionCoverage() {
  if (typeof DECISION_TYPES === "undefined") {
    return {
      ok: false,
      type: "decision-coverage-audit",
      message: "DECISION_TYPES غير محمّل."
    };
  }

  if (typeof getKnowledgeForDecision !== "function") {
    return {
      ok: false,
      type: "decision-coverage-audit",
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
        : "هذا القرار لا يملك معرفة مساندة مسجلة، فلا يحق له ادعاء الإدراك."
    };
  });

  const unsupported = results.filter(function (r) {
    return !r.supported;
  });

  return {
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
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
// 6) فحص حضور الدستور في ملفات الحوكمة
// ======================================

function auditGovernanceCharterPresence() {
  const checks = {
    governanceCharter:
      typeof window.GOVERNANCE_CHARTER !== "undefined",

    knowledgeDecisionCharter:
      typeof window.KNOWLEDGE_DECISION_CHARTER !== "undefined",

    decisionGateCharter:
      typeof window.DECISION_GATE_CHARTER !== "undefined",

    auditGuardsCharter:
      typeof GOVERNANCE_AUDIT_GUARDS_CHARTER !== "undefined"
  };

  const missing = Object.keys(checks).filter(function (key) {
    return !checks[key];
  });

  return {
    ok: missing.length === 0,
    type: "governance-charter-presence-audit",
    checks,
    missing,
    message: missing.length
      ? "بعض ملفات الحوكمة لا تُظهر الدستور بوضوح."
      : "الدستور حاضر في ملفات الحوكمة الأساسية."
  };
}


// ======================================
// 7) تشغيل الحراس معًا
// ======================================

function runGovernanceAuditGuards() {
  const duplicateAudit = detectDuplicateResponsibilities();
  const orphanAudit = detectOrphanKnowledge();
  const decisionAudit = auditDecisionCoverage();
  const charterAudit = auditGovernanceCharterPresence();

  const totalProblems =
    (duplicateAudit.count || 0) +
    (orphanAudit.count || 0) +
    (decisionAudit.unsupportedCount || 0) +
    (charterAudit.missing ? charterAudit.missing.length : 0);

  const report = {
    method: "Governance Audit Guards V2 Sovereign",
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
    createdAt: new Date().toISOString(),
    ok: totalProblems === 0,
    totalProblems,
    duplicateAudit,
    orphanAudit,
    decisionAudit,
    charterAudit,
    message: totalProblems
      ? "الحوكمة وجدت مشكلات تحتاج مراجعة سيادية."
      : "الحوكمة لا ترى مشكلات ظاهرة الآن."
  };

  console.log("🛡️ تقرير حراس الحوكمة:", report);

  return report;
}


// ======================================
// 8) أدوات مساعدة
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
// 9) تصدير عام
// ======================================

window.GOVERNANCE_AUDIT_GUARDS_CHARTER =
  GOVERNANCE_AUDIT_GUARDS_CHARTER;

window.detectDuplicateResponsibilities =
  detectDuplicateResponsibilities;

window.detectOrphanKnowledge =
  detectOrphanKnowledge;

window.auditDecisionCoverage =
  auditDecisionCoverage;

window.auditGovernanceCharterPresence =
  auditGovernanceCharterPresence;

window.runGovernanceAuditGuards =
  runGovernanceAuditGuards;
