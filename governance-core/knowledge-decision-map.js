// ======================================
// governance-core/knowledge-decision-map.js
// خريطة ربط المعرفة بالقرار — نسخة حوكمية سيادية
// ======================================

console.log("🧭 knowledge-decision-map.js جاهز — Sovereign Governance Mode");


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

  warning:
    "أي معرفة لا تخدم قرارًا تبقى معلقة، وأي قرار لا يستدعي المعرفة يبقى غير إدراكي."
};


// ======================================
// 2) أنواع القرارات الكبرى
// ======================================

const DECISION_TYPES = {
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
    description: "الحكم على جودة الأداء القرائي."
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
  trainingRecorder: {
    id: "training-recorder",
    sourceDepartment: "training-core",
    sourceFiles: [
      "training-core/training-recorder.js"
    ],
    knowledgeType: "تسجيل تدريبي خام",
    mustServe: [
      "prepare-training-sample",
      "validate-signal",
      "identify-phoneme"
    ],
    status: "active",
    note:
      "التسجيل لا يصبح معرفة حتى يمر عبر فحص واضح، ولا يجوز أن يتحول إلى حكم على الهوية وحده."
  },

  audioLab: {
    id: "audio-lab",
    sourceDepartment: "training-core",
    sourceFiles: [
      "training-core/audio-lab.js"
    ],
    knowledgeType: "غرفة عمليات صوتية ومناطق موجية",
    mustServe: [
      "prepare-training-sample",
      "split-segment",
      "validate-signal"
    ],
    status: "active",
    note:
      "غرفة الصوت تساعد في العرض والتجهيز، لكنها لا تتجاوز حكم الإدراك والحوكمة."
  },

  signalValidation: {
    id: "signal-validation",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/phoneme-signal-validator.js"
    ],
    knowledgeType: "فحص جودة الإشارة",
    mustServe: [
      "validate-signal",
      "prepare-training-sample",
      "identify-phoneme",
      "match-phoneme"
    ],
    status: "active",
    note:
      "أي جينوم أو ذاكرة مبنية على تسجيل ضعيف تحمل ضعفًا في أصل القرار."
  },

  phonemeMemory: {
    id: "phoneme-memory",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/phoneme-memory-trainer.js"
    ],
    knowledgeType: "ذاكرة إدراكية لونية للحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "improve-memory"
    ],
    status: "active",
    note:
      "ذاكرة لون الحرف ليست زينة؛ هي أثر إدراكي يجب أن يخدم الحسم."
  },

  baMasterIdentity: {
    id: "ba-master-identity",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/ba-final-identity-engine.js",
      "phoneme-core/ba_master_identity.js"
    ],
    knowledgeType: "هوية مرجعية للحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment"
    ],
    status: "active",
    note:
      "هوية الباء لا يجوز أن تبقى تقريرًا؛ يجب أن تؤثر في المطابقة والفصل."
  },

  spectralSeal: {
    id: "spectral-seal",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/spectral-seal-engine.js"
    ],
    knowledgeType: "ختم طيفي",
    mustServe: [
      "match-phoneme",
      "identify-phoneme"
    ],
    status: "active"
  },

  pureCore: {
    id: "pure-core",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/core-purifier-engine.js"
    ],
    knowledgeType: "نواة طيفية نقية",
    mustServe: [
      "match-phoneme",
      "identify-phoneme",
      "split-segment"
    ],
    status: "active"
  },

  burstSignature: {
    id: "burst-signature",
    sourceDepartment: "analysis-core",
    sourceFiles: [
      "analysis-core/burst-signature-engine.js"
    ],
    knowledgeType: "بصمة انفجار",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment"
    ],
    status: "active"
  },

  burstOnset: {
    id: "burst-onset",
    sourceDepartment: "analysis-core",
    sourceFiles: [
      "analysis-core/burst-onset-engine.js"
    ],
    knowledgeType: "بداية حدث صوتي",
    mustServe: [
      "split-segment",
      "match-phoneme"
    ],
    status: "active"
  },

  commonPayload: {
    id: "common-payload",
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/common-payload-finder.js"
    ],
    knowledgeType: "المحمول المشترك للحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment"
    ],
    status: "active"
  },

  lockedPayload: {
    id: "locked-payload",
    sourceDepartment: "segment-core",
    sourceFiles: [
      "segment-core/payload-lock-engine.js"
    ],
    knowledgeType: "تثبيت المحمول",
    mustServe: [
      "split-segment",
      "merge-segment"
    ],
    status: "active"
  },

  purifiedPayload: {
    id: "purified-payload",
    sourceDepartment: "segment-core",
    sourceFiles: [
      "segment-core/payload-purifier-engine.js"
    ],
    knowledgeType: "تنظيف المحمول",
    mustServe: [
      "split-segment",
      "merge-segment",
      "match-phoneme"
    ],
    status: "active"
  },

  payloadBoundary: {
    id: "payload-boundary",
    sourceDepartment: "segment-core",
    sourceFiles: [
      "segment-core/phoneme-boundary-engine.js"
    ],
    knowledgeType: "حدود الحامل والمحمول",
    mustServe: [
      "split-segment",
      "merge-segment"
    ],
    status: "active"
  },

  confusionMatrix: {
    id: "confusion-matrix",
    sourceDepartment: "memory-core",
    sourceFiles: [
      "memory-core/cognitive-confusion-matrix.js"
    ],
    knowledgeType: "ذاكرة الالتباس",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment",
      "improve-memory"
    ],
    status: "forming",
    note:
      "أي التباس متكرر يجب أن يتحول إلى معرفة حسم لا إلى تقرير فقط."
  },

  cognitiveStatistics: {
    id: "cognitive-statistics",
    sourceDepartment: "memory-core",
    sourceFiles: [
      "memory-core/cognitive-statistics-engine.js"
    ],
    knowledgeType: "إحصاء إدراكي تراكمي",
    mustServe: [
      "improve-memory",
      "identify-phoneme",
      "match-phoneme"
    ],
    status: "forming"
  },

  mergeSplitLab: {
    id: "merge-split-lab",
    sourceDepartment: "operation-labs",
    sourceFiles: [
      "operation-labs/phoneme-merge-split-engine.js"
    ],
    knowledgeType: "تجربة فصل ودمج",
    mustServe: [
      "split-segment",
      "merge-segment",
      "promote-experiment"
    ],
    status: "experimental",
    note:
      "المختبر لا يصبح معرفة رسمية حتى تثبت التجربة أثرها وتعود إلى إدارة رسمية."
  },

  weightedJoinZone: {
    id: "weighted-join-zone",
    sourceDepartment: "operation-labs",
    sourceFiles: [
      "operation-labs/weighted-join-zone.js"
    ],
    knowledgeType: "تجربة منطقة اشتباك موزون",
    mustServe: [
      "merge-segment",
      "split-segment",
      "promote-experiment"
    ],
    status: "experimental",
    note:
      "منطقة الاشتباك الموزون تبقى مختبرية حتى تقرر الحوكمة ترقيتها."
  }
};


// ======================================
// 4) أدوات الاستعلام
// ======================================

function getKnowledgeDecisionMap() {
  return KNOWLEDGE_DECISION_MAP;
}


function getDecisionTypes() {
  return DECISION_TYPES;
}


function getKnowledgeForDecision(decisionId) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return item.mustServe && item.mustServe.includes(decisionId);
  });
}


function getDecisionsForKnowledge(knowledgeId) {
  const item = Object.values(KNOWLEDGE_DECISION_MAP).find(function (k) {
    return k.id === knowledgeId;
  });

  if (!item) return [];

  return item.mustServe || [];
}


function getKnowledgeByDepartment(departmentId) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return item.sourceDepartment === departmentId;
  });
}


// ======================================
// 5) فحص قرار: هل لديه معرفة مساندة؟
// ======================================

function auditDecisionKnowledge(decisionId) {
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
    message: knowledge.length
      ? "القرار لديه معرفة مساندة."
      : "تحذير حوكمي: هذا القرار لا يراجع أي معرفة مسجلة، ولذلك لا يحق له ادعاء الإدراك."
  };
}


// ======================================
// 6) فحص معرفة: هل تخدم قرارًا؟
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
      ? "المعرفة مرتبطة بقرارات."
      : "تحذير حوكمي: هذه المعرفة لا تخدم أي قرار بعد، فهي غير مكتملة معماريًا."
  };
}


// ======================================
// 7) كشف المعارف اليتيمة
// ======================================

function findOrphanKnowledge() {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return !item.mustServe || !item.mustServe.length;
  });
}


// ======================================
// 8) فحص سيادي شامل للخريطة
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

    if (!report.decisions[decision.id]) {
      report.warnings.push(
        "قرار بلا معرفة مساندة: " + decision.id
      );
    }
  });

  console.log("🧭 تقرير خريطة المعرفة والقرار:", report);
  return report;
}


// ======================================
// 9) تصدير عام
// ======================================

window.KNOWLEDGE_DECISION_CHARTER = KNOWLEDGE_DECISION_CHARTER;
window.KNOWLEDGE_DECISION_LAW = KNOWLEDGE_DECISION_CHARTER.rule;

window.DECISION_TYPES = DECISION_TYPES;
window.KNOWLEDGE_DECISION_MAP = KNOWLEDGE_DECISION_MAP;

window.getDecisionTypes = getDecisionTypes;
window.getKnowledgeDecisionMap = getKnowledgeDecisionMap;
window.getKnowledgeForDecision = getKnowledgeForDecision;
window.getDecisionsForKnowledge = getDecisionsForKnowledge;
window.getKnowledgeByDepartment = getKnowledgeByDepartment;

window.auditDecisionKnowledge = auditDecisionKnowledge;
window.auditKnowledgeUsage = auditKnowledgeUsage;
window.findOrphanKnowledge = findOrphanKnowledge;
window.auditKnowledgeDecisionMap = auditKnowledgeDecisionMap;
