// ======================================
// governance-core/knowledge-decision-map.js
// خريطة ربط المعرفة بالقرار
// ======================================

console.log("🧭 knowledge-decision-map.js جاهز");

// ======================================
// القاعدة العليا
// ======================================

const KNOWLEDGE_DECISION_LAW =
  "كل معرفة يجب أن تجد طريقها إلى قرار، وكل قرار يجب أن يراجع المعرفة المتاحة.";


// ======================================
// أنواع القرارات الكبرى في المشروع
// ======================================

const DECISION_TYPES = {
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
  }
};


// ======================================
// خريطة المعرفة ← القرار
// ======================================

const KNOWLEDGE_DECISION_MAP = {

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
    sourceDepartment: "phoneme-core",
    sourceFiles: [
      "phoneme-core/burst-signature-engine.js"
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
      "split-segment"
    ],
    status: "forming",
    note:
      "أي التباس متكرر يجب أن يتحول إلى معرفة حسم لا إلى تقرير فقط."
  }
};


// ======================================
// أدوات الاستعلام
// ======================================

function getKnowledgeDecisionMap() {
  return KNOWLEDGE_DECISION_MAP;
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


// ======================================
// فحص قرار: هل لديه معرفة مساندة؟
// ======================================

function auditDecisionKnowledge(decisionId) {
  const knowledge = getKnowledgeForDecision(decisionId);

  return {
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
      : "تحذير: هذا القرار لا يراجع أي معرفة مسجلة."
  };
}


// ======================================
// فحص معرفة: هل تخدم قرارًا؟
// ======================================

function auditKnowledgeUsage(knowledgeId) {
  const decisions = getDecisionsForKnowledge(knowledgeId);

  return {
    knowledgeId,
    used: decisions.length > 0,
    decisionCount: decisions.length,
    decisions,
    message: decisions.length
      ? "المعرفة مرتبطة بقرارات."
      : "تحذير: هذه المعرفة لا تخدم أي قرار بعد."
  };
}


// ======================================
// كشف المعارف اليتيمة
// ======================================

function findOrphanKnowledge() {
  return Object.values(KNOWLEDGE_DECISION_MAP).filter(function (item) {
    return !item.mustServe || !item.mustServe.length;
  });
}


// ======================================
// تصدير عام
// ======================================

window.KNOWLEDGE_DECISION_LAW = KNOWLEDGE_DECISION_LAW;
window.DECISION_TYPES = DECISION_TYPES;
window.KNOWLEDGE_DECISION_MAP = KNOWLEDGE_DECISION_MAP;

window.getKnowledgeDecisionMap = getKnowledgeDecisionMap;
window.getKnowledgeForDecision = getKnowledgeForDecision;
window.getDecisionsForKnowledge = getDecisionsForKnowledge;
window.auditDecisionKnowledge = auditDecisionKnowledge;
window.auditKnowledgeUsage = auditKnowledgeUsage;
window.findOrphanKnowledge = findOrphanKnowledge;
