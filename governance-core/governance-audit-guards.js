// ======================================
// governance-core/governance-audit-guards.js
// حراس التدقيق الحوكمي — V3
// يجمع:
// 1) كشف تكرار المسؤوليات
// 2) كشف المعرفة اليتيمة
// 3) فحص تغطية القرارات بالمعرفة
// 4) فحص حضور الدستور
// 5) فحص انحراف الاندكسات عن خريطة الحوكمة
// 6) فحص العائلة الإدراكية والذاكرة التراكمية
// ======================================

console.log("🛡️ governance-audit-guards.js جاهز — V3 Sovereign Audit Guards");


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

  indexLaw:
    "كل ملف معرفي يظهر في index فرعي يجب أن يظهر أثره في خريطة المعرفة والقرار، وإلا فهو يعمل من خلف العداد.",

  warning:
    "أي تداخل بلا ضبط، أو معرفة بلا قرار، أو قرار بلا معرفة، أو ملف معرفي بلا تسجيل حوكمي، هو خلل لا يجوز تجاهله."
};


// ======================================
// 2) قراءة الإدارات من السجل
// ======================================

function getGovernanceDepartmentsArray() {
  if (typeof getDepartmentRegistry !== "function") {
    return null;
  }

  const registry = getDepartmentRegistry();
  if (!registry) return null;

  if (registry.departments) return Object.values(registry.departments);
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

      const sharedProduces = intersectArrays(a.produces || [], b.produces || []);
      const sharedServes = intersectArrays(a.serves || [], b.serves || []);

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
        warning: "هذه المعرفة لا تخدم أي قرار مسجل، وهذا يخالف دستور الحوكمة."
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
    governanceCharter: typeof window.GOVERNANCE_CHARTER !== "undefined",
    knowledgeDecisionCharter: typeof window.KNOWLEDGE_DECISION_CHARTER !== "undefined",
    decisionGateCharter: typeof window.DECISION_GATE_CHARTER !== "undefined",
    auditGuardsCharter: typeof window.GOVERNANCE_AUDIT_GUARDS_CHARTER !== "undefined"
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
// 7) فحص انحراف الاندكسات عن الحوكمة
// ======================================

function auditDepartmentIndexAlignment() {
  const knownIndexes = [
    window.NOORANIYA_GOVERNANCE_CORE,
    window.NOORANIYA_PHONEME_CORE,
    window.NOORANIYA_SEGMENT_CORE,
    window.NOORANIYA_ANALYSIS_CORE,
    window.NOORANIYA_MEMORY_CORE,
    window.NOORANIYA_TRAINING_CORE,
    window.NOORANIYA_OPERATION_LABS
  ].filter(Boolean);

  if (!knownIndexes.length) {
    return {
      ok: false,
      type: "department-index-alignment-audit",
      message: "لم يتم العثور على اندكسات فرعية محملة داخل window."
    };
  }

  if (typeof getKnowledgeDecisionMap !== "function") {
    return {
      ok: false,
      type: "department-index-alignment-audit",
      message: "خريطة المعرفة والقرار غير محملة."
    };
  }

  const map = getKnowledgeDecisionMap();
  const knowledgeIds = Object.values(map).map(function (item) { return item.id; });
  const sourceFiles = [];

  Object.values(map).forEach(function (item) {
    (item.sourceFiles || []).forEach(function (file) {
      sourceFiles.push(file);
    });
  });

  const indexReports = knownIndexes.map(function (index) {
    const missingKnowledge = (index.knowledge || []).filter(function (k) {
      return !knowledgeIds.includes(k);
    });

    const filesLikelyKnowledgeButUnmapped = (index.files || []).filter(function (file) {
      if (sourceFiles.includes(file)) return false;
      if (/app\.js$/.test(file)) return false;
      if (/index\.js$/.test(file)) return false;
      if (/README\.md$/.test(file)) return false;
      return /engine|memory|map|validator|identity|payload|recorder|lab|timeline|colors|pack/.test(file);
    });

    return {
      department: index.name,
      knowledgeCount: (index.knowledge || []).length,
      fileCount: (index.files || []).length,
      missingKnowledge,
      filesLikelyKnowledgeButUnmapped,
      ok: missingKnowledge.length === 0 && filesLikelyKnowledgeButUnmapped.length === 0
    };
  });

  const bad = indexReports.filter(function (r) { return !r.ok; });

  return {
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
    ok: bad.length === 0,
    type: "department-index-alignment-audit",
    count: bad.length,
    indexReports,
    message: bad.length
      ? "توجد معرفة أو ملفات في الاندكسات لا تظهر بوضوح في خريطة الحوكمة."
      : "الاندكسات المحملة منسجمة ظاهريًا مع خريطة المعرفة والقرار."
  };
}


// ======================================
// 8) فحص خاص لإضافات العائلة والذاكرة التراكمية
// ======================================

function auditPhonemeFamilyAndCumulativeMemoryGovernance() {
  const warnings = [];

  if (typeof getKnowledgeDecisionMap !== "function") {
    return {
      ok: false,
      type: "family-cumulative-memory-governance-audit",
      message: "knowledge-decision-map.js غير محمّل."
    };
  }

  const map = getKnowledgeDecisionMap();
  const items = Object.values(map);

  const family = items.find(function (item) { return item.id === "phoneme-family-map"; });
  const cumulative = items.find(function (item) { return item.id === "phoneme-cumulative-memory"; });

  if (!family) {
    warnings.push("phoneme-family-map غير مسجلة في خريطة المعرفة والقرار.");
  } else {
    if (!(family.mustServe || []).includes("compare-phoneme-family")) {
      warnings.push("phoneme-family-map لا تخدم قرار compare-phoneme-family.");
    }

    if (!(family.mustServe || []).includes("approve-match-result")) {
      warnings.push("phoneme-family-map لا تؤثر في اعتماد نتيجة المطابقة.");
    }
  }

  if (!cumulative) {
    warnings.push("phoneme-cumulative-memory غير مسجلة في خريطة المعرفة والقرار.");
  } else {
    if (!(cumulative.mustServe || []).includes("review-cumulative-memory")) {
      warnings.push("phoneme-cumulative-memory لا تخدم قرار مراجعة الذاكرة التراكمية.");
    }

    if (!(cumulative.mustServe || []).includes("approve-match-result")) {
      warnings.push("phoneme-cumulative-memory لا تؤثر في اعتماد نتيجة المطابقة.");
    }
  }

  if (typeof window.DECISION_GATES === "undefined") {
    warnings.push("DECISION_GATES غير محملة؛ لا يمكن التأكد من بوابات العائلة والذاكرة.");
  } else {
    if (!window.DECISION_GATES.phonemeFamilyComparisonGate) {
      warnings.push("بوابة مقارنة العائلة الإدراكية غير موجودة.");
    }

    if (!window.DECISION_GATES.cumulativeMemoryGate) {
      warnings.push("بوابة الذاكرة التراكمية غير موجودة.");
    }

    if (!window.DECISION_GATES.matchResultAdoptionGate) {
      warnings.push("بوابة اعتماد نتيجة المطابقة غير موجودة.");
    }
  }

  return {
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
    ok: warnings.length === 0,
    type: "family-cumulative-memory-governance-audit",
    warnings,
    message: warnings.length
      ? "الإضافات الأخيرة لم تكتمل حوكمتها بعد."
      : "خريطة العائلة والذاكرة التراكمية ظاهرتان في القرار والبوابات."
  };
}


// ======================================
// 9) تشغيل الحراس معًا
// ======================================

function runGovernanceAuditGuards() {
  const duplicateAudit = detectDuplicateResponsibilities();
  const orphanAudit = detectOrphanKnowledge();
  const decisionAudit = auditDecisionCoverage();
  const charterAudit = auditGovernanceCharterPresence();
  const indexAlignmentAudit = auditDepartmentIndexAlignment();
  const familyMemoryAudit = auditPhonemeFamilyAndCumulativeMemoryGovernance();

  const totalProblems =
    (duplicateAudit.count || 0) +
    (orphanAudit.count || 0) +
    (decisionAudit.unsupportedCount || 0) +
    (charterAudit.missing ? charterAudit.missing.length : 0) +
    (indexAlignmentAudit.count || 0) +
    (familyMemoryAudit.warnings ? familyMemoryAudit.warnings.length : 0);

  const report = {
    method: "Governance Audit Guards V3 Sovereign",
    charter: GOVERNANCE_AUDIT_GUARDS_CHARTER,
    createdAt: new Date().toISOString(),
    ok: totalProblems === 0,
    totalProblems,
    duplicateAudit,
    orphanAudit,
    decisionAudit,
    charterAudit,
    indexAlignmentAudit,
    familyMemoryAudit,
    message: totalProblems
      ? "الحوكمة وجدت مشكلات أو انحرافات تحتاج مراجعة سيادية."
      : "الحوكمة لا ترى مشكلات ظاهرة الآن."
  };

  console.log("🛡️ تقرير حراس الحوكمة:", report);
  return report;
}


// ======================================
// 10) أدوات مساعدة
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
// 11) تصدير عام
// ======================================

window.GOVERNANCE_AUDIT_GUARDS_CHARTER = GOVERNANCE_AUDIT_GUARDS_CHARTER;

window.detectDuplicateResponsibilities = detectDuplicateResponsibilities;
window.detectOrphanKnowledge = detectOrphanKnowledge;
window.auditDecisionCoverage = auditDecisionCoverage;
window.auditGovernanceCharterPresence = auditGovernanceCharterPresence;
window.auditDepartmentIndexAlignment = auditDepartmentIndexAlignment;
window.auditPhonemeFamilyAndCumulativeMemoryGovernance = auditPhonemeFamilyAndCumulativeMemoryGovernance;
window.runGovernanceAuditGuards = runGovernanceAuditGuards;
