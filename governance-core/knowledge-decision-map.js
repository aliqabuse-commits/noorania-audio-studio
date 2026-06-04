// ======================================
// governance-core/knowledge-decision-map.js
// خريطة ربط المعرفة بالقرار — نسخة حوكمية سيادية V4
// تثبيت معارف إدارة الحوكمة السبعة أولًا
// ======================================

console.log("🧭 knowledge-decision-map.js جاهز — V4 Sovereign Knowledge/Decision Map");


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

  integrationRule:
    "أي ملف يظهر في index فرعي ولا يظهر في خريطة المعرفة والقرار إذا كان ينتج معرفة فهو معرفة عابرة من خلف العداد.",

  warning:
    "أي معرفة لا تخدم قرارًا تبقى معلقة، وأي قرار لا يستدعي المعرفة يبقى غير إدراكي."
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
    mustServe: [
      "governance-review",
      "audit-department"
    ],
    status: "active",
    governanceImpact:
      "يثبت الإدارات المالكة وحدود السلطة والمسؤولية داخل المشروع."
  },

  knowledgeDecisionMap: {
    id: "knowledge-decision-map",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/knowledge-decision-map.js"],
    knowledgeType: "خريطة ربط المعرفة بالقرار",
    mustServe: [
      "governance-review",
      "audit-knowledge-decision",
      "audit-index-alignment"
    ],
    status: "active",
    governanceImpact:
      "تمنع وجود معرفة لا تخدم قرارًا أو قرار لا يراجع معرفة."
  },

  decisionGates: {
    id: "decision-gates",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/decision-gates.js"],
    knowledgeType: "بوابات القرار الحوكمي",
    mustServe: [
      "governance-review",
      "audit-decision-gates"
    ],
    status: "active",
    governanceImpact:
      "تمنع مرور الملفات أو القرارات أو التجارب دون سؤال الأثر والمالك والوجهة."
  },

  governanceAuditGuards: {
    id: "governance-audit-guards",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-audit-guards.js"],
    knowledgeType: "حراس التدقيق الحوكمي",
    mustServe: [
      "governance-review",
      "audit-governance-guards",
      "audit-index-alignment"
    ],
    status: "active",
    governanceImpact:
      "يكشف التداخلات والمعارف اليتيمة وانحراف الاندكسات عن الخريطة."
  },

  departmentIndexAlignment: {
    id: "department-index-alignment",
    sourceDepartment: "governance-core",
    sourceFiles: ["governance-core/governance-audit-guards.js"],
    knowledgeType: "مواءمة الاندكسات الفرعية مع خريطة الحوكمة",
    mustServe: [
      "governance-review",
      "audit-index-alignment"
    ],
    status: "active",
    governanceImpact:
      "يكشف أي معرفة موجودة في index فرعي ولا تظهر في خريطة المعرفة والقرار."
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
    status: "active",
    governanceImpact:
      "يتأكد أن خريطة العائلة والذاكرة التراكمية لا تمران من خلف العداد."
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
    status: "active",
    governanceImpact:
      "يحوّل تقارير الحوكمة الطويلة إلى تقارير مجلس قابلة للقراءة والنسخ واتخاذ القرار."
  },

  trainingRecorder: {
    id: "training-recorder",
    sourceDepartment: "training-core",
    sourceFiles: ["training-core/training-recorder.js"],
    knowledgeType: "تسجيل تدريبي خام",
    mustServe: [
      "prepare-training-sample",
      "validate-signal",
      "identify-phoneme"
    ],
    status: "active",
    governanceImpact:
      "يثبت أن العينة جاءت عبر تسجيل واضح لا عبر مصدر مجهول.",
    note:
      "التسجيل لا يصبح معرفة حتى يمر عبر فحص واضح، ولا يجوز أن يتحول إلى حكم على الهوية وحده."
  },

  audioLab: {
    id: "audio-lab",
    sourceDepartment: "training-core",
    sourceFiles: ["training-core/audio-lab.js"],
    knowledgeType: "غرفة عمليات صوتية ومناطق موجية",
    mustServe: [
      "prepare-training-sample",
      "split-segment",
      "validate-signal"
    ],
    status: "active",
    governanceImpact:
      "يعرض التسجيل والموجة دون أن ينتزع سلطة الحكم من الإدراك."
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
    status: "active",
    governanceImpact:
      "يمنع بناء قرار إدراكي على تسجيل ضعيف أو مشوش.",
    note:
      "أي جينوم أو ذاكرة مبنية على تسجيل ضعيف تحمل ضعفًا في أصل القرار."
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
    status: "active",
    governanceImpact:
      "يمنع بناء ذاكرة أو جينوم بلا حقيبة وحالات واضحة."
  },

  phonemeColors: {
    id: "phoneme-colors",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-colors.js"],
    knowledgeType: "ألوان إدراكية للحروف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "improve-memory"
    ],
    status: "active",
    governanceImpact:
      "يربط اللون بالذاكرة الإدراكية لا بالزينة البصرية فقط."
  },

  phonemeColorMemory: {
    id: "phoneme-color-memory",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-color-memory.js"],
    knowledgeType: "ذاكرة لون الحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "review-cumulative-memory"
    ],
    status: "active",
    governanceImpact:
      "يمنع أن يبقى اللون وصفًا بلا أثر."
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
    status: "active",
    governanceImpact:
      "تجعل الذاكرة شاهدة على القرار لا تقريرًا منفصلًا.",
    note:
      "ذاكرة لون الحرف ليست زينة؛ هي أثر إدراكي يجب أن يخدم الحسم."
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
    status: "active",
    governanceImpact:
      "تمنع اعتماد آخر تسجيل كحقيقة مطلقة، وتحفظ أثر المحاولات السابقة وتاريخها.",
    note:
      "هذه المعرفة أضيفت مؤخرًا ويجب ألا تمر من خلف العداد."
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
    status: "active",
    governanceImpact:
      "تمنع إعلان نجاح الحرف بلا منافس قريب ولا هامش فصل حقيقي.",
    note:
      "هذه المعرفة أضيفت مؤخرًا ويجب أن تظهر في قرار المطابقة لا في الاندكس فقط."
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
    status: "active",
    governanceImpact:
      "يحوّل تحليل الحرف إلى هوية قابلة للمراجعة."
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
    status: "active",
    governanceImpact:
      "يفحص أن الزمن يصف القرار ولا يحكم وحده."
  },

  phonemeIdentity: {
    id: "phoneme-identity",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/phoneme-identity-engine.js"],
    knowledgeType: "هوية الحرف",
    mustServe: [
      "identify-phoneme",
      "match-phoneme"
    ],
    status: "active",
    governanceImpact:
      "يثبت أن الحرف هوية لا عينة مفردة."
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
    status: "active",
    governanceImpact:
      "يعطي النتيجة التشغيلية، لكنه لا يُعتمد إدراكيًا إلا بمنافس وهامش وذاكرة."
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
    governanceImpact:
      "يجعل الهوية المرجعية مؤثرة في القرار لا ملفًا صامتًا."
  },

  baIdentityMatch: {
    id: "ba-identity-match",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/ba-identity-match-engine.js"],
    knowledgeType: "مطابقة هوية الباء",
    mustServe: [
      "match-phoneme",
      "approve-match-result"
    ],
    status: "active"
  },

  spectralSeal: {
    id: "spectral-seal",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/spectral-seal-engine.js"],
    knowledgeType: "ختم طيفي",
    mustServe: [
      "match-phoneme",
      "identify-phoneme",
      "approve-match-result"
    ],
    status: "active"
  },

  pureCore: {
    id: "pure-core",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/core-purifier-engine.js"],
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
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/burst-signature-engine.js"],
    knowledgeType: "بصمة انفجار",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment",
      "approve-match-result"
    ],
    status: "active",
    note:
      "ملف بصمة الانفجار موجود حاليًا في phoneme-core حسب واقع الاندكس الفرعي الأخير."
  },

  burstOnset: {
    id: "burst-onset",
    sourceDepartment: "analysis-core",
    sourceFiles: ["analysis-core/burst-onset-engine.js"],
    knowledgeType: "بداية حدث صوتي",
    mustServe: [
      "split-segment",
      "match-phoneme",
      "build-timeline-genome"
    ],
    status: "active"
  },

  commonPayload: {
    id: "common-payload",
    sourceDepartment: "phoneme-core",
    sourceFiles: ["phoneme-core/common-payload-finder.js"],
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
    sourceFiles: ["segment-core/payload-lock-engine.js"],
    knowledgeType: "تثبيت المحمول",
    mustServe: [
      "split-segment",
      "merge-segment"
    ],
    status: "active"
  },

  payloadExtraction: {
    id: "payload-extraction",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/payload-extractor-engine.js"],
    knowledgeType: "استخراج المحمول",
    mustServe: [
      "split-segment",
      "merge-segment"
    ],
    status: "active"
  },

  purifiedPayload: {
    id: "purified-payload",
    sourceDepartment: "segment-core",
    sourceFiles: ["segment-core/payload-purifier-engine.js"],
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
    sourceFiles: ["segment-core/phoneme-boundary-engine.js"],
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
    sourceFiles: ["memory-core/cognitive-confusion-matrix.js"],
    knowledgeType: "ذاكرة الالتباس",
    mustServe: [
      "identify-phoneme",
      "match-phoneme",
      "split-segment",
      "improve-memory",
      "approve-match-result"
    ],
    status: "forming",
    note:
      "أي التباس متكرر يجب أن يتحول إلى معرفة حسم لا إلى تقرير فقط."
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
    sourceFiles: ["operation-labs/weighted-join-zone.js"],
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

function getKnowledgeBySourceFile(filePath) {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return (item.sourceFiles || []).includes(filePath);
  });
}


// ======================================
// 5) فحص قرار: هل لديه معرفة مساندة؟
// ======================================

function auditDecisionKnowledge(decisionId) {
  const decision = Object.values(DECISION_TYPES).find(function (d) {
    return d.id === decisionId;
  });

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
        status: k.status,
        governanceImpact: k.governanceImpact || ""
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

  if (!getDecisionsForKnowledge("phoneme-family-map").length) {
    report.warnings.push("خريطة العائلة الإدراكية لا تخدم قرارًا مسجلًا.");
  }

  if (!getDecisionsForKnowledge("phoneme-cumulative-memory").length) {
    report.warnings.push("الذاكرة التراكمية لا تخدم قرارًا مسجلًا.");
  }

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
window.getKnowledgeBySourceFile = getKnowledgeBySourceFile;

window.auditDecisionKnowledge = auditDecisionKnowledge;
window.auditKnowledgeUsage = auditKnowledgeUsage;
window.findOrphanKnowledge = findOrphanKnowledge;
window.auditKnowledgeDecisionMap = auditKnowledgeDecisionMap;

console.log("🧭 خريطة المعرفة والقرار جاهزة V4");
