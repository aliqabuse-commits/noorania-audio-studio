// ================================
// phoneme-core/phoneme-family-map.js
// خريطة العائلات الإدراكية للحروف — V1
// تربط معرفة الصفات والعائلات بقرار المطابقة والفصل
// لا تشغل اختبارًا تلقائيًا، بل تمد المحركات بسياق المنافسة والحسم
// ================================

console.log("🧭 phoneme-family-map.js جاهز V1 — Knowledge Serves Decision");

// ======================================
// 1) دستور خريطة العائلات الإدراكية
// ======================================
const PHONEME_FAMILY_MAP_CHARTER = {
  title: "دستور خريطة العائلات الإدراكية",
  law:
    "لا معنى لمعرفة الصفات إذا لم تحدد من ينافس الحرف، وما السمة التي تفصل بينهما.",
  principles: [
    "العائلة تحدد ساحة المنافسة ولا تصدر الحكم وحدها.",
    "المتشابهون يُقارنون أولًا قبل الغرباء.",
    "الصفة المشتركة لا تحسم، والصفة الفارقة تخدم القرار.",
    "كل مرشح التباس يجب أن يذكر سبب دخوله المنافسة.",
    "القرار الصحيح بلا منافس قريب ليس اعتمادًا إدراكيًا كاملًا."
  ]
};

// ======================================
// 2) خريطة أولية قابلة للتوسع
// المفاتيح يجب أن توافق مفاتيح الحقائب مثل: dal, ta, qa...
// ======================================
const PHONEME_FAMILY_MAP = {
  dal: {
    key: "dal",
    letter: "د",
    label: "دال",
    family: "tip-burst-plain",
    macroFamilies: ["طرف اللسان", "شديد", "مجهور", "مرقق", "انفجاري"],
    traits: {
      place: "طرف اللسان",
      burst: true,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      qalqala: true
    },
    closest: [
      { key: "ta", reason: "نفس المخرج والانفجار مع فرق الجهر/الهمس", decisiveTraits: ["voiced", "hams"] },
      { key: "dad", reason: "اشتباه كتابي/سمعي جزئي مع فرق الاستعلاء والإطباق", decisiveTraits: ["tafkheem", "itbaq"] },
      { key: "thal", reason: "تقارب رسم وتعاقب لساني مع فرق الرخاوة/الانفجار", decisiveTraits: ["burst", "frication"] }
    ]
  },

  ta: {
    key: "ta",
    letter: "ت",
    label: "تاء",
    family: "tip-burst-plain",
    macroFamilies: ["طرف اللسان", "شديد", "مهموس", "مرقق", "انفجاري"],
    traits: {
      place: "طرف اللسان",
      burst: true,
      voiced: false,
      hams: true,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "dal", reason: "نفس المخرج والانفجار مع فرق الجهر", decisiveTraits: ["voiced", "hams"] },
      { key: "ta_emphatic", reason: "فرق التفخيم/الترقيق", decisiveTraits: ["tafkheem", "itbaq"] }
    ]
  },

  qa: {
    key: "qa",
    letter: "ق",
    label: "قاف",
    family: "deep-burst-tafkheem",
    macroFamilies: ["أقصى اللسان", "مستعل", "شديد", "مجهور", "قلقلة"],
    traits: {
      place: "أقصى اللسان",
      burst: true,
      voiced: true,
      tafkheem: true,
      qalqala: true
    },
    closest: [
      { key: "ka", reason: "قرب مخرج وانفجار مع فرق الاستعلاء والعمق", decisiveTraits: ["tafkheem", "deepPlace"] },
      { key: "ghain", reason: "اشتراك في العمق مع فرق الرخاوة/الانفجار", decisiveTraits: ["burst", "frication"] },
      { key: "kha", reason: "اشتراك في العمق مع فرق الهمس والرخاوة", decisiveTraits: ["burst", "hams"] }
    ]
  },

  ka: {
    key: "ka",
    letter: "ك",
    label: "كاف",
    family: "deep-burst-plain",
    macroFamilies: ["أقصى اللسان", "شديد", "مهموس", "مرقق"],
    traits: {
      place: "أقصى اللسان",
      burst: true,
      voiced: false,
      tafkheem: false,
      hams: true
    },
    closest: [
      { key: "qa", reason: "قرب مخرج وانفجار مع فرق التفخيم والعمق", decisiveTraits: ["tafkheem", "deepPlace"] }
    ]
  },

  sad: {
    key: "sad",
    letter: "ص",
    label: "صاد",
    family: "sibilant-tafkheem",
    macroFamilies: ["صفير", "مستعل", "مطبق"],
    traits: {
      sibilant: true,
      tafkheem: true,
      itbaq: true,
      frication: true
    },
    closest: [
      { key: "seen", reason: "اشتراك الصفير مع فرق التفخيم والإطباق", decisiveTraits: ["tafkheem", "itbaq"] }
    ]
  },

  seen: {
    key: "seen",
    letter: "س",
    label: "سين",
    family: "sibilant-plain",
    macroFamilies: ["صفير", "مرقق"],
    traits: {
      sibilant: true,
      tafkheem: false,
      itbaq: false,
      frication: true
    },
    closest: [
      { key: "sad", reason: "اشتراك الصفير مع فرق التفخيم والإطباق", decisiveTraits: ["tafkheem", "itbaq"] }
    ]
  },

  ha_deep: {
    key: "ha_deep",
    letter: "ح",
    label: "حاء",
    family: "throat-fricative-plain",
    macroFamilies: ["حلق", "رخاوة", "مهموس"],
    traits: {
      place: "الحلق",
      frication: true,
      hams: true,
      breathy: false
    },
    closest: [
      { key: "ha_light", reason: "تشابه سمعي عند المتعلمين مع فرق العمق والاحتكاك", decisiveTraits: ["deepThroat", "fricationShape"] }
    ]
  },

  ha_light: {
    key: "ha_light",
    letter: "ه",
    label: "هاء",
    family: "throat-breathy-light",
    macroFamilies: ["حلق", "هواء", "مهموس"],
    traits: {
      place: "الحلق",
      frication: false,
      hams: true,
      breathy: true
    },
    closest: [
      { key: "ha_deep", reason: "تشابه سمعي مع فرق الاحتكاك والعمق", decisiveTraits: ["deepThroat", "breathy"] }
    ]
  }
};

// ======================================
// 3) أدوات قراءة الخريطة
// ======================================
function getPhonemeFamilyEntry(phonemeKey) {
  return PHONEME_FAMILY_MAP[phonemeKey] || null;
}

function getPhonemeFamily(phonemeKey) {
  const entry = getPhonemeFamilyEntry(phonemeKey);
  return entry ? entry.family : "unknown-family";
}

function getPhonemeTraits(phonemeKey) {
  const entry = getPhonemeFamilyEntry(phonemeKey);

  if (entry && entry.traits) return entry.traits;

  if (typeof getPhonemeTrainingPack === "function") {
    const pack = getPhonemeTrainingPack(phonemeKey);
    if (pack && pack.traits) return pack.traits;
  }

  return {};
}

function getConfusionCandidates(phonemeKey) {
  const entry = getPhonemeFamilyEntry(phonemeKey);
  if (!entry || !Array.isArray(entry.closest)) return [];
  return entry.closest.slice();
}

function getDistinctiveTraits(targetKey, candidateKey) {
  const target = getPhonemeTraits(targetKey);
  const candidate = getPhonemeTraits(candidateKey);
  const traits = [];

  const keys = Array.from(new Set(Object.keys(target).concat(Object.keys(candidate))));

  keys.forEach(function (key) {
    if (target[key] !== candidate[key]) {
      traits.push({ trait: key, target: target[key], candidate: candidate[key] });
    }
  });

  return traits;
}

// ======================================
// 4) تحويل العائلة إلى أثر في القرار
// ======================================
function buildFamilyDecisionContext(phonemeKey) {
  const entry = getPhonemeFamilyEntry(phonemeKey);
  const candidates = getConfusionCandidates(phonemeKey);

  const context = {
    phonemeKey: phonemeKey,
    known: !!entry,
    family: entry ? entry.family : "unknown-family",
    macroFamilies: entry ? entry.macroFamilies || [] : [],
    traits: getPhonemeTraits(phonemeKey),
    candidates: candidates.map(function (candidate) {
      return {
        key: candidate.key,
        reason: candidate.reason,
        decisiveTraits: candidate.decisiveTraits || [],
        observedDifferences: getDistinctiveTraits(phonemeKey, candidate.key)
      };
    }),
    governance: {
      decisionUse: "تحديد المنافسين قبل اعتماد نتيجة المطابقة.",
      riskIfMissing: "قد يعلن النظام نجاحًا بلا هامش فصل حقيقي.",
      rule: "لا تعتمد نتيجة حرف بلا منافس قريب إذا كانت العائلة معروفة."
    }
  };

  context.hasComparisonDuty = context.candidates.length > 0;

  return context;
}

function evaluateFamilyDecisionReadiness(phonemeKey, matchReport) {
  const context = buildFamilyDecisionContext(phonemeKey);
  const margin = Number(matchReport && matchReport.margin) || 0;
  const hasCandidates = context.candidates.length > 0;

  let status = "not-ready";
  let reason = "لا توجد مقارنة عائلية كافية.";

  if (!context.known) {
    status = "unknown-family";
    reason = "الحرف غير مسجل في خريطة العائلات الإدراكية.";
  } else if (!hasCandidates) {
    status = "weak-family-map";
    reason = "الحرف مسجل، لكن لا توجد قائمة منافسين.";
  } else if (margin <= 0) {
    status = "needs-comparison";
    reason = "يوجد منافسون، لكن هامش الفصل غير كافٍ أو غير محسوب.";
  } else {
    status = "comparison-ready";
    reason = "توجد عائلة ومنافسون وهامش فصل قابل للمراجعة.";
  }

  return {
    phonemeKey: phonemeKey,
    status: status,
    reason: reason,
    familyContext: context,
    decision: {
      operationalResult: matchReport && matchReport.correct ? "correct" : "unknown",
      cognitiveApproval: status === "comparison-ready" ? "reviewable" : "not-approved-yet",
      governanceNote:
        "النجاح التشغيلي لا يتحول إلى اعتماد إدراكي إلا بعد مراجعة العائلة والهامش والذاكرة."
    }
  };
}

// ======================================
// 5) التصدير العام
// ======================================
window.PHONEME_FAMILY_MAP_CHARTER = PHONEME_FAMILY_MAP_CHARTER;
window.PHONEME_FAMILY_MAP = PHONEME_FAMILY_MAP;
window.getPhonemeFamilyEntry = getPhonemeFamilyEntry;
window.getPhonemeFamily = getPhonemeFamily;
window.getPhonemeTraits = getPhonemeTraits;
window.getConfusionCandidates = getConfusionCandidates;
window.getDistinctiveTraits = getDistinctiveTraits;
window.buildFamilyDecisionContext = buildFamilyDecisionContext;
window.evaluateFamilyDecisionReadiness = evaluateFamilyDecisionReadiness;

console.log("🧭 خريطة العائلات الإدراكية جاهزة — المعرفة توجه المقارنة");

