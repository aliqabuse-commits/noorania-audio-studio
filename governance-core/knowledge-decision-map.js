// ======================================
// governance-core/knowledge-decision-map.js
// خريطة ربط المعرفة بالقرار — V5
// تضيف: تتبع أثر المعرفة على القرار
// لا تنشئ ملفًا جديدًا
// ======================================

console.log("🧭 knowledge-decision-map.js جاهز — V5 Knowledge/Decision Influence Map");


// ======================================
// 1) الاستدعاء الدستوري
// ======================================

const KNOWLEDGE_DECISION_CHARTER = {
  source: "GOVERNANCE_CHARTER",

  motto: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ],

  supremeLaw:
    "المعرفة التي لا تؤثر في القرار ليست جزءًا من المنظومة بعد. " +
    "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد.",

  rule:
    "كل معرفة يجب أن تجد طريقها إلى قرار، وكل قرار يجب أن يراجع المعرفة المتاحة.",

  influenceLaw:
    "لا يكفي أن تكون المعرفة مسجلة لخدمة القرار؛ يجب أن نعرف هل استُدعيت وهل أثّرت فعلاً.",

  warning:
    "أي معرفة مسجلة لا تظهر في أثر القرار تبقى معرفة غير ممتحنة."
};


// ======================================
// 2) أنواع القرارات الكبرى
// ======================================

const DECISION_TYPES = {
  governanceReview: {
    id: "governance-review",
    name: "مراجعة الحوكمة",
    description: "مراجعة سلامة ربط المعرفة بالقرار داخل إدارة الحوكمة."
  },

  auditDepartment: {
    id: "audit-department",
    name: "تدقيق إدارة",
    description: "فحص انسجام الإدارة مع سجل الحوكمة والاندكس والخريطة."
  },

  auditKnowledgeDecision: {
    id: "audit-knowledge-decision",
    name: "تدقيق خريطة المعرفة والقرار",
    description: "فحص أن كل معرفة تخدم قرارًا وأن كل قرار يراجع معرفة."
  },

  auditIndexAlignment: {
    id: "audit-index-alignment",
    name: "تدقيق مواءمة الاندكسات",
    description: "فحص تطابق معارف الاندكسات مع خريطة المعرفة والقرار."
  },

  auditDecisionGates: {
    id: "audit-decision-gates",
    name: "تدقيق بوابات القرار",
    description: "فحص أن بوابات القرار تسأل عن الأثر والمعرفة والوجهة قبل السماح بالمرور."
  },

  auditGovernanceGuards: {
    id: "audit-governance-guards",
    name: "تدقيق حراس الحوكمة",
    description: "فحص أن حراس الحوكمة يكشفون الانحراف ولا يخفونه."
  },

  prepareTrainingSample: {
    id: "prepare-training-sample",
    name: "تجهيز عينة التدريب",
    description: "تجهيز التسجيل الخام وحفظه وفحص صلاحيته قبل دخوله إلى الإدراك."
  },

  validateSignal: {
    id: "validate-signal",
    name: "فحص جودة الإشارة",
    description: "الحكم على صلاحية التسجيل قبل بناء الذاكرة أو الجينوم."
  },

  identifyPhoneme: {
    id: "identify-phoneme",
    name: "تمييز الحرف",
    description: "الحكم على هوية الحرف المنطوق."
  },

  matchPhoneme: {
    id: "match-phoneme",
    name: "مطابقة الحرف",
    description: "تحديد هل التسجيل يطابق الهوية المرجعية للحرف."
  },

  comparePhonemeFamily: {
    id: "compare-phoneme-family",
    name: "مقارنة العائلة الإدراكية",
    description: "تحديد المنافسين الأقرب للحرف قبل إعلان الحسم."
  },

  reviewCumulativeMemory: {
    id: "review-cumulative-memory",
    name: "مراجعة الذاكرة التراكمية",
    description: "مراجعة تاريخ المحاولات والذاكرة السابقة قبل اعتماد القرار."
  },

  approveMatchResult: {
    id: "approve-match-result",
    name: "اعتماد نتيجة المطابقة",
    description: "تحويل نتيجة الاختبار من نجاح تشغيلي إلى حكم إدراكي معتمد أو غير معتمد."
  },

  buildCognitiveGenome: {
    id: "build-cognitive-genome",
    name: "بناء الجينوم المركزي",
    description: "بناء هوية إدراكية مركزية للحرف أو للحالة الصوتية."
  },

  buildTimelineGenome: {
    id: "build-timeline-genome",
    name: "بناء الجينوم الزمني",
    description: "تحويل المسار الزمني للصوت إلى دليل قرار لا إلى وصف فقط."
  },

  splitSegment: {
    id: "split-segment",
    name: "فصل المقطع",
    description: "تحديد حدود الحامل والمحمول ومنطقة الاشتباك."
  },

  mergeSegment: {
    id: "merge-segment",
    name: "دمج المقطع",
    description: "بناء مقطع جديد من حامل ومحمول مع احترام الاشتباك."
  },

  evaluateReading: {
    id: "evaluate-reading",
    name: "تقييم القراءة",
    description: "الحكم على جودة الأداء القرائي.",
    status: "deferred",
    note: "مؤجل حوكمياً حتى تُسجل معارف تقييم القراءة صراحة."
  },

  improveMemory: {
    id: "improve-memory",
    name: "تحسين الذاكرة",
    description: "تحويل نتائج الالتباس والتجارب إلى معرفة تراكمية مؤثرة."
  },

  promoteExperiment: {
    id: "promote-experiment",
    name: "ترقية تجربة",
    description: "تحديد هل تصلح نتيجة مختبرية للانتقال إلى إدارة رسمية."
  }
};


// ======================================
// 3) خريطة المعرفة ← القرار
// ======================================

const KNOWLEDGE_DECISION_MAP = {
  departmentRegistry: {
    id: "department-registry",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/department-registry.js"],
    knowledgeType: "سجل الإدارات",
    mustServe: ["governance-review", "audit-department"],
    status: "active"
  },

  knowledgeDecisionMap: {
    id: "knowledge-decision-map",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/knowledge-decision-map.js"],
    knowledgeType: "خريطة ربط المعرفة بالقرار",
    mustServe: ["governance-review", "audit-knowledge-decision", "audit-index-alignment"],
    status: "active"
  },

  decisionGates: {
    id: "decision-gates",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/decision-gates.js"],
    knowledgeType: "بوابات القرار الحوكمي",
    mustServe: ["governance-review", "audit-decision-gates"],
    status: "active"
  },

  governanceAuditGuards: {
    id: "governance-audit-guards",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-audit-guards.js"],
    knowledgeType: "حراس التدقيق الحوكمي",
    mustServe: ["governance-review", "audit-governance-guards", "audit-index-alignment"],
    status: "active"
  },

  departmentIndexAlignment: {
    id: "department-index-alignment",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-audit-guards.js"],
    knowledgeType: "مواءمة الاندكسات الفرعية مع خريطة الحوكمة",
    mustServe: ["governance-review", "audit-index-alignment"],
    status: "active"
  },

  familyMemoryGovernanceAudit: {
    id: "family-memory-governance-audit",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-audit-guards.js"],
    knowledgeType: "تدقيق حضور العائلة والذاكرة التراكمية في القرار",
    mustServe: [
      "governance-review",
      "approve-match-result",
      "review-cumulative-memory",
      "compare-phoneme-family"
    ],
    status: "active"
  },

  governanceReportCenter: {
    id: "governance-report-center",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-report-center.js"],
    knowledgeType: "مركز تقارير المجلس الحوكمي",
    mustServe: [
      "governance-review",
      "audit-department",
      "audit-knowledge-decision",
      "audit-index-alignment",
      "audit-governance-guards"
    ],
    status: "active"
  },

  trainingRecorder: {
    id: "training-recorder",
    sourceDepartment: "training-core",
    sourceFiles: ["training-core/training-recorder.js"],
    knowledgeType: "تسجيل تدريبي خام",
    mustServe: ["prepare-training-sample", "validate-signal", "identify-phoneme"],
    status: "active"
  },

  audioLab: {
    id: "audio-lab",
    sourceDepartment: "training-core",
    sourceFiles: ["training-core/audio-lab.js"],
    knowledgeType: "غرفة عمليات صوتية ومناطق موجية",
    mustServe: ["prepare-training-sample", "split-segment", "validate-signal"],
    status: "active"
  },

  signalValidation: {
    id: "signal-validation",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-signal-validator.js"],
    knowledgeType: "فحص جودة الإشارة",
    mustServe: [
      "validate-signal",
      "prepare-training-sample",
      "identify-phoneme",
      "match-phoneme",
      "approve-match-result"
    ],
    status: "active"
  },

  phonemeTrainingPack: {
    id: "phoneme-training-pack",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-training-pack.js"],
    knowledgeType: "تعريف حقيبة الحرف وحالاته التدريبية",
    mustServe: [
      "prepare-training-sample",
      "identify-phoneme",
      "build-cognitive-genome",
      "build-timeline-genome"
    ],
    status: "active"
  },

  phonemeColors: {
    id: "phoneme-colors",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-colors.js"],
    knowledgeType: "ألوان إدراكية للحروف",
    mustServe: ["identify-phoneme", "match-phoneme", "improve-memory"],
    status: "active"
  },

  phonemeColorMemory: {
    id: "phoneme-color-memory",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-color-memory.js"],
    knowledgeType: "ذاكرة لون الحرف",
    mustServe: ["identify-phoneme", "match-phoneme", "review-cumulative-memory"],
    status: "active"
  },

  phonemeMemory: {
    id: "phoneme-memory",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-memory-trainer.js"],
    knowledgeType: "ذاكرة إدراكية للحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "review-cumulative-memory",
      "approve-match-result",
      "improve-memory"
    ],
    status: "active"
  },

  phonemeCumulativeMemory: {
    id: "phoneme-cumulative-memory",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-cumulative-memory.js"],
    knowledgeType: "ذاكرة تراكمية إدراكية للحرف",
    mustServe: [
      "review-cumulative-memory",
      "match-phoneme",
      "approve-match-result",
      "identify-phoneme",
      "improve-memory"
    ],
    status: "active"
  },

  phonemeFamilyMap: {
    id: "phoneme-family-map",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-family-map.js"],
    knowledgeType: "خريطة العائلات الإدراكية والمنافسين",
    mustServe: [
      "compare-phoneme-family",
      "match-phoneme",
      "identify-phoneme",
      "approve-match-result",
      "split-segment"
    ],
    status: "active"
  },

  cognitiveGenome: {
    id: "cognitive-genome",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-cognitive-engine.js"],
    knowledgeType: "جينوم إدراكي مركزي",
    mustServe: [
      "build-cognitive-genome",
      "identify-phoneme",
      "match-phoneme",
      "approve-match-result",
      "split-segment"
    ],
    status: "active"
  },

  timelineGenome: {
    id: "timeline-genome",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-timeline-engine.js"],
    knowledgeType: "جينوم زمني للحرف",
    mustServe: [
      "build-timeline-genome",
      "identify-phoneme",
      "match-phoneme",
      "approve-match-result",
      "split-segment"
    ],
    status: "active"
  },

  phonemeIdentity: {
    id: "phoneme-identity",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-identity-engine.js"],
    knowledgeType: "هوية الحرف",
    mustServe: ["identify-phoneme", "match-phoneme"],
    status: "active"
  },

  phonemeMatch: {
    id: "phoneme-match",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-match-engine.js"],
    knowledgeType: "نتيجة مطابقة وفصل",
    mustServe: [
      "match-phoneme",
      "compare-phoneme-family",
      "approve-match-result",
      "improve-memory"
    ],
    status: "active"
  },

  baMasterIdentity: {
    id: "ba-master-identity",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/ba-final-identity-engine.js",
      "phoneme-core/ba_master_identity.js"
    ],
    knowledgeType: "هوية مرجعية للحرف",
    mustServe: ["identify-phoneme", "match-phoneme", "split-segment"],
    status: "active"
  },

  baIdentityMatch: {
    id: "ba-identity-match",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/ba-identity-match-engine.js"],
    knowledgeType: "مطابقة هوية الباء",
    mustServe: ["match-phoneme", "approve-match-result"],
    status: "active"
  },

  spectralSeal: {
    id: "spectral-seal",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/spectral-seal-engine.js"],
    knowledgeType: "ختم طيفي",
    mustServe: ["match-phoneme", "identify-phoneme", "approve-match-result"],
    status: "active"
  },

  pureCore: {
    id: "pure-core",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/core-purifier-engine.js"],
    knowledgeType: "نواة طيفية نقية",
    mustServe: ["match-phoneme", "identify-phoneme", "split-segment"],
    status: "active"
  },

  burstSignature: {
    id: "burst-signature",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/burst-signature-engine.js"],
    knowledgeType: "بصمة انفجار",
    mustServe: ["identify-phoneme", "match-phoneme", "split-segment", "approve-match-result"],
    status: "active"
  },

  burstOnset: {
    id: "burst-onset",
    sourceDepartment: "analysis-core",
    sourceFiles: ["analysis-core/burst-onset-engine.js"],
    knowledgeType: "بداية حدث صوتي",
    mustServe: ["split-segment", "match-phoneme", "build-timeline-genome"],
    status: "active"
  },

  commonPayload: {
    id: "common-payload",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/common-payload-finder.js"],
    knowledgeType: "المحمول المشترك للحرف",
    mustServe: ["identify-phoneme", "match-phoneme", "split-segment"],
    status: "active"
  },

  lockedPayload: {
    id: "locked-payload",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/payload-lock-engine.js"],
    knowledgeType: "تثبيت المحمول",
    mustServe: ["split-segment", "merge-segment"],
    status: "active"
  },

  payloadExtraction: {
    id: "payload-extraction",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/payload-extractor-engine.js"],
    knowledgeType: "استخراج المحمول",
    mustServe: ["split-segment", "merge-segment"],
    status: "active"
  },

  purifiedPayload: {
    id: "purified-payload",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/payload-purifier-engine.js"],
    knowledgeType: "تنظيف المحمول",
    mustServe: ["split-segment", "merge-segment", "match-phoneme"],
    status: "active"
  },

  payloadBoundary: {
    id: "payload-boundary",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/phoneme-boundary-engine.js"],
    knowledgeType: "حدود الحامل والمحمول",
    mustServe: ["split-segment", "merge-segment"],
    status: "active"
  },

  confusionMatrix: {
    id: "confusion-matrix",
    sourceDepartment: "memory-core",
    sourceFiles: ["memory-core/cognitive-confusion-matrix.js"],
    knowledgeType: "ذاكرة الالتباس",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment",
      "improve-memory",
      "approve-match-result"
    ],
    status: "forming"
  },

  cognitiveStatistics: {
    id: "cognitive-statistics",
    sourceDepartment: "memory-core",
    sourceFiles: ["memory-core/cognitive-statistics-engine.js"],
    knowledgeType: "إحصاء إدراكي تراكمي",
    mustServe: [
      "improve-memory",
      "identify-phoneme",
      "match-phoneme",
      "review-cumulative-memory"
    ],
    status: "forming"
  },

  mergeSplitLab: {
    id: "merge-split-lab",
    sourceDepartment: "operation-labs",
    sourceFiles: ["operation-labs/phoneme-merge-split-engine.js"],
    knowledgeType: "تجربة فصل ودمج",
    mustServe: ["split-segment", "merge-segment", "promote-experiment"],
    status: "experimental"
  },

  weightedJoinZone: {
    id: "weighted-join-zone",
    sourceDepartment: "operation-labs",
    sourceFiles: ["operation-labs/weighted-join-zone.js"],
    knowledgeType: "تجربة منطقة اشتباك موزون",
    mustServe: ["merge-segment", "split-segment", "promote-experiment"],
    status: "experimental"
  }
};


// ======================================
// 4) سجل أثر القرار
// ======================================

const DECISION_TRACE_LOG = [];


/*
شكل السجل المتوقع من أي محرك قرار:

recordDecisionTrace({
  decisionId: "split-segment",
  decisionName: "فصل مقطع بَصْ",
  target: "ba_sad",
  invokedKnowledge: ["burst-onset", "payload-boundary"],
  influentialKnowledge: ["burst-onset"],
  ignoredKnowledge: ["phoneme-family-map"],
  result: "split-produced",
  confidence: 0.62,
  notes: "الفصل اعتمد على بداية الحدث وحدود المحمول أكثر من الهوية."
});
*/


function normalizeTraceList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(function (item, index) {
    return typeof item === "string" && item && list.indexOf(item) === index;
  });
}


function getDecisionById(decisionId) {
  return Object.values(DECISION_TYPES).find(function (decision) {
    return decision.id === decisionId;
  }) || null;
}


function getKnowledgeItemById(knowledgeId) {
  return Object.values(KNOWLEDGE_DECISION_MAP).find(function (item) {
    return item.id === knowledgeId;
  }) || null;
}


function getKnowledgeForDecision(decisionId) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return item.mustServe && item.mustServe.includes(decisionId);
  });
}


function getExpectedKnowledgeIdsForDecision(decisionId) {
  return getKnowledgeForDecision(decisionId).map(function (item) {
    return item.id;
  });
}


function recordDecisionTrace(trace) {
  if (!trace || !trace.decisionId) {
    return {
      ok: false,
      message: "لا يمكن تسجيل أثر قرار بلا decisionId."
    };
  }

  const decision = getDecisionById(trace.decisionId);

  const normalized = {
    id: "trace-" + Date.now(),
    createdAt: new Date().toISOString(),
    decisionId: trace.decisionId,
    decisionName: trace.decisionName || (decision ? decision.name : ""),
    target: trace.target || "",
    result: trace.result || "",
    confidence: typeof trace.confidence === "number" ? trace.confidence : null,
    expectedKnowledge: getExpectedKnowledgeIdsForDecision(trace.decisionId),
    invokedKnowledge: normalizeTraceList(trace.invokedKnowledge),
    influentialKnowledge: normalizeTraceList(trace.influentialKnowledge),
    ignoredKnowledge: normalizeTraceList(trace.ignoredKnowledge),
    notes: trace.notes || "",
    raw: trace
  };

  normalized.report = buildDecisionInfluenceReport(
    normalized.decisionId,
    normalized
  );

  DECISION_TRACE_LOG.push(normalized);

  console.log("🧭 تم تسجيل أثر قرار:", normalized);
  return normalized;
}


function getDecisionTraceLog() {
  return DECISION_TRACE_LOG.slice();
}


function getLatestDecisionTrace(decisionId) {
  const list = DECISION_TRACE_LOG.filter(function (trace) {
    return !decisionId || trace.decisionId === decisionId;
  });

  return list.length ? list[list.length - 1] : null;
}


// ======================================
// 5) تقرير أثر المعرفة على القرار
// ======================================

function buildDecisionInfluenceReport(decisionId, trace) {
  const decision = getDecisionById(decisionId);
  const expectedKnowledge = getKnowledgeForDecision(decisionId);

  const expectedIds = expectedKnowledge.map(function (item) {
    return item.id;
  });

  const invokedIds = normalizeTraceList(trace && trace.invokedKnowledge);
  const influentialIds = normalizeTraceList(trace && trace.influentialKnowledge);

  const missingFromExecution = expectedIds.filter(function (id) {
    return !invokedIds.includes(id);
  });

  const invokedButNotInfluential = invokedIds.filter(function (id) {
    return !influentialIds.includes(id);
  });

  const influentialButUnregistered = influentialIds.filter(function (id) {
    return !getKnowledgeItemById(id);
  });

  const coverageRatio = expectedIds.length
    ? Number((invokedIds.length / expectedIds.length).toFixed(2))
    : 0;

  const influenceRatio = expectedIds.length
    ? Number((influentialIds.length / expectedIds.length).toFixed(2))
    : 0;

  const warnings = [];

  if (!decision) {
    warnings.push("القرار غير مسجل في DECISION_TYPES.");
  }

  if (!expectedIds.length) {
    warnings.push("لا توجد معرفة مسجلة لخدمة هذا القرار.");
  }

  if (!invokedIds.length) {
    warnings.push("لا توجد معرفة مستدعاة في سجل التنفيذ.");
  }

  if (missingFromExecution.length) {
    warnings.push(
      "معارف مسجلة لخدمة القرار لكنها لم تظهر في التنفيذ: " +
      missingFromExecution.join(", ")
    );
  }

  if (invokedButNotInfluential.length) {
    warnings.push(
      "معارف استُدعيت لكنها لم تظهر مؤثرة: " +
      invokedButNotInfluential.join(", ")
    );
  }

  if (influentialButUnregistered.length) {
    warnings.push(
      "معارف أثرت لكنها غير مسجلة في الخريطة: " +
      influentialButUnregistered.join(", ")
    );
  }

  return {
    method: "Decision Knowledge Influence Report V1",
    decisionId,
    decisionName: decision ? decision.name : "",
    createdAt: new Date().toISOString(),
    expectedKnowledgeCount: expectedIds.length,
    invokedKnowledgeCount: invokedIds.length,
    influentialKnowledgeCount: influentialIds.length,
    coverageRatio,
    influenceRatio,
    expectedKnowledge: expectedIds,
    invokedKnowledge: invokedIds,
    influentialKnowledge: influentialIds,
    missingFromExecution,
    invokedButNotInfluential,
    influentialButUnregistered,
    ok:
      warnings.length === 0 &&
      expectedIds.length > 0 &&
      invokedIds.length > 0 &&
      influentialIds.length > 0,
    warnings,
    verdict: buildDecisionInfluenceVerdict(
      decisionId,
      coverageRatio,
      influenceRatio,
      warnings
    )
  };
}


function buildDecisionInfluenceVerdict(decisionId, coverageRatio, influenceRatio, warnings) {
  if (warnings.length === 0 && influenceRatio >= 0.7) {
    return "القرار يراجع المعرفة المسجلة ويظهر أثرها بدرجة قوية.";
  }

  if (influenceRatio > 0 && influenceRatio < 0.7) {
    return "القرار يستدعي بعض المعرفة، لكن أثرها غير كافٍ بعد.";
  }

  if (coverageRatio > 0 && influenceRatio === 0) {
    return "القرار يستدعي معرفة مسجلة، لكن لم يثبت أثرها في الحسم.";
  }

  if (coverageRatio === 0) {
    return "القرار لا يثبت أنه استخدم المعرفة المسجلة؛ يحتاج ربطًا تنفيذيًا.";
  }

  return "القرار يحتاج مراجعة حوكمية.";
}


function auditDecisionInfluence(decisionId, trace) {
  if (trace) {
    return buildDecisionInfluenceReport(decisionId, trace);
  }

  const latest = getLatestDecisionTrace(decisionId);

  if (!latest) {
    return {
      method: "Decision Knowledge Influence Report V1",
      decisionId,
      ok: false,
      warnings: [
        "لا يوجد سجل أثر سابق لهذا القرار. يجب أن يستدعي محرك القرار recordDecisionTrace بعد التنفيذ."
      ],
      verdict:
        "الحوكمة تعرف ما المعرفة المطلوبة، لكنها لا تملك أثر تنفيذ فعلي لهذا القرار بعد."
    };
  }

  return buildDecisionInfluenceReport(decisionId, latest);
}


function auditAllDecisionInfluence() {
  const report = {
    method: "All Decisions Influence Audit V1",
    createdAt: new Date().toISOString(),
    decisions: [],
    summary: {
      total: 0,
      withTrace: 0,
      withoutTrace: 0,
      strongInfluence: 0,
      weakInfluence: 0,
      noInfluence: 0
    }
  };

  Object.values(DECISION_TYPES).forEach(function (decision) {
    if (decision.status === "deferred") return;

    const latest = getLatestDecisionTrace(decision.id);
    const item = latest
      ? buildDecisionInfluenceReport(decision.id, latest)
      : auditDecisionInfluence(decision.id);

    report.decisions.push(item);
    report.summary.total++;

    if (latest) report.summary.withTrace++;
    else report.summary.withoutTrace++;

    if (item.influenceRatio >= 0.7) report.summary.strongInfluence++;
    else if (item.influenceRatio > 0) report.summary.weakInfluence++;
    else report.summary.noInfluence++;
  });

  console.log("🧭 تقرير أثر المعرفة على كل القرارات:", report);
  return report;
}


// ======================================
// 6) أدوات الاستعلام القديمة
// ======================================

function getKnowledgeDecisionMap() {
  return KNOWLEDGE_DECISION_MAP;
}


function getDecisionTypes() {
  return DECISION_TYPES;
}


function getDecisionsForKnowledge(knowledgeId) {
  const item = getKnowledgeItemById(knowledgeId);
  if (!item) return [];
  return item.mustServe || [];
}


function getKnowledgeByDepartment(departmentId) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return item.sourceDepartment === departmentId;
  });
}


function getKnowledgeBySourceFile(filePath) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return (item.sourceFiles || []).includes(filePath);
  });
}


// ======================================
// 7) فحص قرار: هل لديه معرفة مساندة؟
// ======================================

function auditDecisionKnowledge(decisionId) {
  const decision = getDecisionById(decisionId);

  if (decision && decision.status === "deferred") {
    return {
      law: KNOWLEDGE_DECISION_CHARTER.rule,
      decisionId,
      supported: false,
      deferred: true,
      knowledgeCount: 0,
      requiredKnowledge: [],
      message:
        "هذا القرار مؤجل حوكميًا ولا يدّعي الإدراك حتى تسجل له معرفة مساندة."
    };
  }

  const knowledge = getKnowledgeForDecision(decisionId);

  return {
    law: KNOWLEDGE_DECISION_CHARTER.rule,
    decisionId,
    supported: knowledge.length > 0,
    knowledgeCount: knowledge.length,
    requiredKnowledge: knowledge.map(function (k) {
      return {
        id: k.id,
        type: k.knowledgeType,
        department: k.sourceDepartment,
        status: k.status
      };
    }),
    influenceAuditAvailable: true,
    message: knowledge.length
      ? "القرار لديه معرفة مساندة، ويجب فحص أثرها عبر auditDecisionInfluence."
      : "تحذير حوكمي: هذا القرار لا يراجع أي معرفة مسجلة."
  };
}


// ======================================
// 8) فحص معرفة: هل تخدم قرارًا؟
// ======================================

function auditKnowledgeUsage(knowledgeId) {
  const decisions = getDecisionsForKnowledge(knowledgeId);

  return {
    law: KNOWLEDGE_DECISION_CHARTER.rule,
    knowledgeId,
    used: decisions.length > 0,
    decisionCount: decisions.length,
    decisions,
    message: decisions.length
      ? "المعرفة مرتبطة بقرارات. يبقى السؤال: هل أثرت فعلاً؟"
      : "تحذير حوكمي: هذه المعرفة لا تخدم أي قرار بعد."
  };
}


// ======================================
// 9) كشف المعارف اليتيمة
// ======================================

function findOrphanKnowledge() {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return !item.mustServe || !item.mustServe.length;
  });
}


// ======================================
// 10) فحص سيادي شامل للخريطة
// ======================================

function auditKnowledgeDecisionMap() {
  const items = Object.values(KNOWLEDGE_DECISION_MAP);
  const orphan = findOrphanKnowledge();

  const report = {
    charter: KNOWLEDGE_DECISION_CHARTER,
    status: "audited",
    createdAt: new Date().toISOString(),
    totalKnowledgeItems: items.length,
    orphanKnowledgeCount: orphan.length,
    departments: {},
    decisions: {},
    influenceTracking: {
      available: true,
      traceCount: DECISION_TRACE_LOG.length,
      note:
        "الخريطة لا تكتفي الآن بتسجيل المعرفة، بل تملك دوال فحص أثر المعرفة على القرار."
    },
    warnings: []
  };

  items.forEach(function (item) {
    if (!report.departments[item.sourceDepartment]) {
      report.departments[item.sourceDepartment] = {
        knowledgeCount: 0,
        items: []
      };
    }

    report.departments[item.sourceDepartment].knowledgeCount++;
    report.departments[item.sourceDepartment].items.push(item.id);

    (item.mustServe || []).forEach(function (decisionId) {
      if (!report.decisions[decisionId]) {
        report.decisions[decisionId] = {
          knowledgeCount: 0,
          knowledge: []
        };
      }

      report.decisions[decisionId].knowledgeCount++;
      report.decisions[decisionId].knowledge.push(item.id);
    });
  });

  if (orphan.length) {
    report.warnings.push(
      "توجد معارف يتيمة لا تخدم قرارًا: " +
      orphan.map(function (k) { return k.id; }).join(", ")
    );
  }

  Object.keys(DECISION_TYPES).forEach(function (key) {
    const decision = DECISION_TYPES[key];

    if (decision.status === "deferred") {
      report.warnings.push(
        "قرار مؤجل حوكميًا وليس خللًا تشغيليًا: " + decision.id
      );
      return;
    }

    if (!report.decisions[decision.id]) {
      report.warnings.push("قرار بلا معرفة مساندة: " + decision.id);
    }
  });

  console.log("🧭 تقرير خريطة المعرفة والقرار:", report);
  return report;
}

// ======================================
// دوال استقبال أثر القرار من ملفات التنفيذ
// ======================================

const DECISION_TRACE_LOG = [];

function normalizeTraceList(list) {
  if (!Array.isArray(list)) return [];

  return list.filter(function (item, index) {
    return typeof item === "string" && item && list.indexOf(item) === index;
  });
}

function recordDecisionTrace(trace) {
  if (!trace || !trace.decisionId) {
    return {
      ok: false,
      message: "لا يمكن تسجيل أثر قرار بلا decisionId."
    };
  }

  const record = {
    id: "trace-" + Date.now(),
    createdAt: new Date().toISOString(),
    decisionId: trace.decisionId,
    decisionName: trace.decisionName || "",
    target: trace.target || "",
    invokedKnowledge: normalizeTraceList(trace.invokedKnowledge),
    influentialKnowledge: normalizeTraceList(trace.influentialKnowledge),
    result: trace.result || "",
    confidence: typeof trace.confidence === "number" ? trace.confidence : null,
    notes: trace.notes || ""
  };

  DECISION_TRACE_LOG.push(record);

  console.log("🧭 تم استقبال أثر قرار:", record);
  return record;
}

function getDecisionTraceLog() {
  return DECISION_TRACE_LOG.slice();
}

function getLatestDecisionTrace(decisionId) {
  const list = DECISION_TRACE_LOG.filter(function (item) {
    return !decisionId || item.decisionId === decisionId;
  });

  return list.length ? list[list.length - 1] : null;
}

function auditDecisionInfluence(decisionId) {
  const trace = getLatestDecisionTrace(decisionId);

  if (!trace) {
    return {
      ok: false,
      decisionId,
      message: "لا يوجد أثر مسجل لهذا القرار بعد."
    };
  }

  const requiredKnowledge =
    typeof getKnowledgeForDecision === "function"
      ? getKnowledgeForDecision(decisionId).map(function (k) { return k.id; })
      : [];

  const missingKnowledge = requiredKnowledge.filter(function (id) {
    return !trace.invokedKnowledge.includes(id);
  });

  const invokedButNotInfluential = trace.invokedKnowledge.filter(function (id) {
    return !trace.influentialKnowledge.includes(id);
  });

  return {
    ok: true,
    decisionId,
    decisionName: trace.decisionName,
    target: trace.target,
    result: trace.result,
    confidence: trace.confidence,
    requiredKnowledge,
    invokedKnowledge: trace.invokedKnowledge,
    influentialKnowledge: trace.influentialKnowledge,
    missingKnowledge,
    invokedButNotInfluential,
    notes: trace.notes,
    verdict:
      trace.influentialKnowledge.length
        ? "يوجد أثر معرفي مسجل داخل القرار."
        : "تم تسجيل القرار، لكن لم تظهر معرفة مؤثرة بعد."
  };
}

function auditAllDecisionInfluence() {
  const decisionIds = [];

  DECISION_TRACE_LOG.forEach(function (trace) {
    if (!decisionIds.includes(trace.decisionId)) {
      decisionIds.push(trace.decisionId);
    }
  });

  return {
    method: "Decision Influence Audit",
    createdAt: new Date().toISOString(),
    traceCount: DECISION_TRACE_LOG.length,
    reports: decisionIds.map(function (id) {
      return auditDecisionInfluence(id);
    })
  };
}
// ======================================
// استقبال إشارات المعرفة من ملفات الإدارات
// ======================================

const KNOWLEDGE_SIGNAL_LOG = [];

function recordKnowledgeSignal(signal) {
  if (!signal || !signal.knowledgeId) {
    return {
      ok: false,
      message: "لا يمكن تسجيل معرفة بلا knowledgeId."
    };
  }

  const record = {
    id: "knowledge-signal-" + Date.now(),
    createdAt: new Date().toISOString(),
    knowledgeId: signal.knowledgeId,
    sourceDepartment: signal.sourceDepartment || "",
    sourceFile: signal.sourceFile || "",
    target: signal.target || "",
    producedKnowledge: signal.producedKnowledge || null,
    confidence: typeof signal.confidence === "number" ? signal.confidence : null,
    servesDecision: signal.servesDecision || [],
    notes: signal.notes || ""
  };

  KNOWLEDGE_SIGNAL_LOG.push(record);
  console.log("📡 تم استقبال إشارة معرفة:", record);
  return record;
}

function getKnowledgeSignalLog() {
  return KNOWLEDGE_SIGNAL_LOG.slice();
}

function getLatestKnowledgeSignal(knowledgeId) {
  const list = KNOWLEDGE_SIGNAL_LOG.filter(function (item) {
    return item.knowledgeId === knowledgeId;
  });

  return list.length ? list[list.length - 1] : null;
}

window.KNOWLEDGE_SIGNAL_LOG = KNOWLEDGE_SIGNAL_LOG;
window.recordKnowledgeSignal = recordKnowledgeSignal;
window.getKnowledgeSignalLog = getKnowledgeSignalLog;
window.getLatestKnowledgeSignal = getLatestKnowledgeSignal;
// ======================================
// 11) تصدير عام
// ======================================

window.KNOWLEDGE_DECISION_CHARTER = KNOWLEDGE_DECISION_CHARTER;
window.KNOWLEDGE_DECISION_LAW = KNOWLEDGE_DECISION_CHARTER.rule;

window.DECISION_TYPES = DECISION_TYPES;
window.KNOWLEDGE_DECISION_MAP = KNOWLEDGE_DECISION_MAP;
window.DECISION_TRACE_LOG = DECISION_TRACE_LOG;

window.getDecisionTypes = getDecisionTypes;
window.getKnowledgeDecisionMap = getKnowledgeDecisionMap;
window.getKnowledgeForDecision = getKnowledgeForDecision;
window.getExpectedKnowledgeIdsForDecision = getExpectedKnowledgeIdsForDecision;
window.getDecisionsForKnowledge = getDecisionsForKnowledge;
window.getKnowledgeByDepartment = getKnowledgeByDepartment;
window.getKnowledgeBySourceFile = getKnowledgeBySourceFile;
window.getDecisionTraceLog = getDecisionTraceLog;
window.getLatestDecisionTrace = getLatestDecisionTrace;

window.recordDecisionTrace = recordDecisionTrace;
window.auditDecisionInfluence = auditDecisionInfluence;
window.auditAllDecisionInfluence = auditAllDecisionInfluence;

window.auditDecisionKnowledge = auditDecisionKnowledge;
window.auditKnowledgeUsage = auditKnowledgeUsage;
window.findOrphanKnowledge = findOrphanKnowledge;
window.auditKnowledgeDecisionMap = auditKnowledgeDecisionMap;
window.DECISION_TRACE_LOG = DECISION_TRACE_LOG;
window.recordDecisionTrace = recordDecisionTrace;
window.getDecisionTraceLog = getDecisionTraceLog;
window.getLatestDecisionTrace = getLatestDecisionTrace;
window.auditDecisionInfluence = auditDecisionInfluence;
window.auditAllDecisionInfluence = auditAllDecisionInfluence;
console.log("🧭 خريطة المعرفة والقرار جاهزة V5 — مع تتبع أثر المعرفة على القرار");
