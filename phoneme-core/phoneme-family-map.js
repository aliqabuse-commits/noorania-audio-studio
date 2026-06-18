// ================================
// phoneme-core/phoneme-family-map.js
// خريطة العائلات الإدراكية للحروف — V2
// ملتزمة بمفاتيح phoneme-training-pack.js
// ================================

console.log("🧭 phoneme-family-map.js جاهز V2 — Keys Aligned With Training Pack");

const PHONEME_FAMILY_MAP_CHARTER = {
  title: "دستور خريطة العائلات الإدراكية",
  law:
    "لا معنى لمعرفة الصفات إذا لم تحدد من ينافس الحرف، وما السمة التي تفصل بينهما.",
  principles: [
    "العائلة تحدد ساحة المنافسة ولا تصدر الحكم وحدها.",
    "المتشابهون يُقارنون أولًا قبل الغرباء.",
    "الصفة المشتركة لا تحسم، والصفة الفارقة تخدم القرار.",
    "كل مرشح التباس يجب أن يذكر سبب دخوله المنافسة.",
    "مفاتيح هذا الملف يجب أن تطابق phoneme-training-pack.js."
  ]
};

const PHONEME_FAMILY_MAP = {
  ba: {
  key: "ba",
  letter: "ب",
  label: "باء",
  family: "lip-burst-plain",
  macroFamilies: ["شفوي", "شديد", "مجهور", "مرقق", "انفجاري"],
  traits: {
    place: "شفوي",
    burst: true,
    voiced: true,
    tafkheem: false,
    sibilant: false,
    qalqala: true
  },
  closest: [
    { key: "fa", reason: "اشتراك شفوي مع فرق الانفجار والرخاوة", decisiveTraits: ["burst", "frication"] },
    { key: "meem", reason: "اشتراك شفوي مع فرق الغنة والانفجار", decisiveTraits: ["nasal", "burst"] }
  ]
},

  ta: {
    key: "ta",
    letter: "ت",
    label: "تاء",
    family: "tip-burst-plain",
    macroFamilies: ["طرف اللسان", "شديد", "مهموس", "مرقق"],
    traits: {
      place: "طرف اللسان",
      burst: true,
      voiced: false,
      hams: true,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "dal", reason: "نفس المخرج والانفجار مع فرق الجهر/الهمس", decisiveTraits: ["voiced", "hams"] },
      { key: "taa", reason: "اشتراك الانفجار مع فرق التفخيم", decisiveTraits: ["tafkheem"] }
    ]
  },

  tha: {
    key: "tha",
    letter: "ث",
    label: "ثاء",
    family: "dental-fricative-plain",
    macroFamilies: ["لثوي", "رخو", "مرقق"],
    traits: {
      place: "لثوي",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "seen", reason: "اشتباه عند المتعلمين مع فرق المخرج", decisiveTraits: ["place"] },
      { key: "thal", reason: "نفس المخرج تقريبًا مع فرق الجهر", decisiveTraits: ["voiced"] }
    ]
  },

  jeem: {
    key: "jeem",
    letter: "ج",
    label: "جيم",
    family: "middle-tongue-burst",
    macroFamilies: ["وسط اللسان", "شديد", "مجهور"],
    traits: {
      place: "وسط اللسان",
      burst: true,
      voiced: true,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "sheen", reason: "قرب وسط اللسان مع فرق الشدة/الرخاوة", decisiveTraits: ["burst", "frication"] }
    ]
  },

  ha: {
    key: "ha",
    letter: "ح",
    label: "حاء",
    family: "throat-fricative-deep",
    macroFamilies: ["حلقي", "رخو", "مهموس"],
    traits: {
      place: "حلقي",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: false,
      frication: true,
      breathy: false
    },
    closest: [
      { key: "ha2", reason: "تشابه حلقي مع فرق العمق والاحتكاك", decisiveTraits: ["frication", "breathy", "deepThroat"] },
      { key: "kha", reason: "اشتراك الحلق مع فرق التفخيم والخشونة", decisiveTraits: ["tafkheem", "fricationShape"] },
      { key: "ain", reason: "اشتراك الحلق مع فرق الجهر", decisiveTraits: ["voiced"] }
    ]
  },

  kha: {
    key: "kha",
    letter: "خ",
    label: "خاء",
    family: "throat-fricative-tafkheem",
    macroFamilies: ["حلقي", "رخو", "مفخم"],
    traits: {
      place: "حلقي",
      burst: false,
      voiced: false,
      tafkheem: true,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "ha", reason: "اشتراك الحلق مع فرق التفخيم والخشونة", decisiveTraits: ["tafkheem", "fricationShape"] },
      { key: "ghain", reason: "اشتراك التفخيم والرخاوة مع فرق الجهر", decisiveTraits: ["voiced"] }
    ]
  },

  dal: {
    key: "dal",
    letter: "د",
    label: "دال",
    family: "tip-burst-plain",
    macroFamilies: ["طرف اللسان", "شديد", "مجهور", "مرقق"],
    traits: {
      place: "طرف اللسان",
      burst: true,
      voiced: true,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "ta", reason: "نفس المخرج والانفجار مع فرق الجهر/الهمس", decisiveTraits: ["voiced", "hams"] },
      { key: "dad", reason: "اشتباه سمعي جزئي مع فرق الاستطالة والتفخيم", decisiveTraits: ["tafkheem", "place"] },
      { key: "thal", reason: "تقارب لساني مع فرق الرخاوة/الانفجار", decisiveTraits: ["burst", "frication"] }
    ]
  },

  thal: {
    key: "thal",
    letter: "ذ",
    label: "ذال",
    family: "dental-fricative-voiced",
    macroFamilies: ["لثوي", "رخو", "مجهور"],
    traits: {
      place: "لثوي",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "tha", reason: "نفس المخرج مع فرق الجهر", decisiveTraits: ["voiced"] },
      { key: "zaa", reason: "اشتراك لثوي مع فرق التفخيم", decisiveTraits: ["tafkheem"] },
      { key: "zay", reason: "اشتباه سمعي مع فرق الصفير", decisiveTraits: ["sibilant"] }
    ]
  },

  ra: {
    key: "ra",
    letter: "ر",
    label: "راء",
    family: "tip-repeated",
    macroFamilies: ["طرف اللسان", "تكراري"],
    traits: {
      place: "طرف اللسان",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      repeated: true
    },
    closest: [
      { key: "lam", reason: "قرب طرف اللسان مع فرق الانحراف والتكرار", decisiveTraits: ["repeated", "lateral"] },
      { key: "noon", reason: "قرب طرف اللسان مع فرق الغنة", decisiveTraits: ["nasal"] }
    ]
  },

  zay: {
    key: "zay",
    letter: "ز",
    label: "زاي",
    family: "sibilant-plain-voiced",
    macroFamilies: ["صفير", "مرقق", "مجهور"],
    traits: {
      place: "أسلي صفيري",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: true,
      frication: true
    },
    closest: [
      { key: "seen", reason: "اشتراك الصفير مع فرق الجهر", decisiveTraits: ["voiced"] },
      { key: "thal", reason: "اشتباه مع فرق الصفير والمخرج", decisiveTraits: ["sibilant", "place"] }
    ]
  },

  seen: {
    key: "seen",
    letter: "س",
    label: "سين",
    family: "sibilant-plain",
    macroFamilies: ["صفير", "مرقق", "مهموس"],
    traits: {
      place: "أسلي صفيري",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: true,
      frication: true
    },
    closest: [
      { key: "sad", reason: "اشتراك الصفير مع فرق التفخيم", decisiveTraits: ["tafkheem"] },
      { key: "zay", reason: "اشتراك الصفير مع فرق الجهر", decisiveTraits: ["voiced"] },
      { key: "tha", reason: "اشتباه عند المتعلمين مع فرق المخرج", decisiveTraits: ["place"] }
    ]
  },

  sheen: {
    key: "sheen",
    letter: "ش",
    label: "شين",
    family: "middle-tongue-spread-fricative",
    macroFamilies: ["وسط اللسان", "تفشي", "رخو"],
    traits: {
      place: "وسط اللسان",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: true,
      frication: true,
      spreading: true
    },
    closest: [
      { key: "jeem", reason: "قرب وسط اللسان مع فرق التفشي والشدة", decisiveTraits: ["burst", "spreading"] },
      { key: "seen", reason: "اشتراك الصفير/الرخاوة مع فرق المخرج والتفشي", decisiveTraits: ["place", "spreading"] }
    ]
  },

  sad: {
    key: "sad",
    letter: "ص",
    label: "صاد",
    family: "sibilant-tafkheem",
    macroFamilies: ["صفير", "مفخم", "مستعل"],
    traits: {
      place: "أسلي صفيري مفخم",
      burst: false,
      voiced: false,
      tafkheem: true,
      sibilant: true,
      frication: true
    },
    closest: [
      { key: "seen", reason: "اشتراك الصفير مع فرق التفخيم", decisiveTraits: ["tafkheem"] },
      { key: "zay", reason: "اشتباه صفيري مع فرق الجهر والتفخيم", decisiveTraits: ["voiced", "tafkheem"] }
    ]
  },

  dad: {
    key: "dad",
    letter: "ض",
    label: "ضاد",
    family: "side-tongue-tafkheem",
    macroFamilies: ["حافة اللسان", "مفخم", "استطالة"],
    traits: {
      place: "حافة اللسان",
      burst: false,
      voiced: true,
      tafkheem: true,
      sibilant: false,
      elongation: true
    },
    closest: [
      { key: "dal", reason: "اشتباه جزئي مع فرق الحافة والتفخيم", decisiveTraits: ["place", "tafkheem"] },
      { key: "zaa", reason: "اشتراك التفخيم مع فرق المخرج والاستطالة", decisiveTraits: ["place", "elongation"] }
    ]
  },

  taa: {
    key: "taa",
    letter: "ط",
    label: "طاء",
    family: "tip-burst-tafkheem",
    macroFamilies: ["طرف اللسان", "شديد", "مفخم"],
    traits: {
      place: "طرف اللسان مع استعلاء",
      burst: true,
      voiced: false,
      tafkheem: true,
      sibilant: false
    },
    closest: [
      { key: "ta", reason: "اشتراك الانفجار مع فرق التفخيم", decisiveTraits: ["tafkheem"] },
      { key: "dal", reason: "تقارب لساني مع فرق التفخيم والجهر", decisiveTraits: ["tafkheem", "voiced"] }
    ]
  },

  zaa: {
    key: "zaa",
    letter: "ظ",
    label: "ظاء",
    family: "dental-fricative-tafkheem",
    macroFamilies: ["لثوي", "مفخم", "رخو"],
    traits: {
      place: "لثوي مفخم",
      burst: false,
      voiced: true,
      tafkheem: true,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "thal", reason: "نفس المخرج تقريبًا مع فرق التفخيم", decisiveTraits: ["tafkheem"] },
      { key: "dad", reason: "اشتراك التفخيم مع فرق الحافة/اللثة", decisiveTraits: ["place", "elongation"] }
    ]
  },

  ain: {
    key: "ain",
    letter: "ع",
    label: "عين",
    family: "throat-voiced",
    macroFamilies: ["حلقي", "مجهور", "متوسط"],
    traits: {
      place: "حلقي",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "ha", reason: "اشتراك الحلق مع فرق الجهر", decisiveTraits: ["voiced"] },
      { key: "alif", reason: "اشتباه عند المتعلمين مع فرق طبيعة المخرج", decisiveTraits: ["place", "burst"] }
    ]
  },

  ghain: {
    key: "ghain",
    letter: "غ",
    label: "غين",
    family: "throat-fricative-voiced-tafkheem",
    macroFamilies: ["حلقي", "رخو", "مفخم", "مجهور"],
    traits: {
      place: "حلقي",
      burst: false,
      voiced: true,
      tafkheem: true,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "kha", reason: "اشتراك التفخيم والرخاوة مع فرق الجهر", decisiveTraits: ["voiced"] },
      { key: "qaf", reason: "اشتراك العمق مع فرق الرخاوة/الانفجار", decisiveTraits: ["burst", "frication"] }
    ]
  },

  fa: {
    key: "fa",
    letter: "ف",
    label: "فاء",
    family: "lip-fricative-plain",
    macroFamilies: ["شفوي", "رخو", "مهموس"],
    traits: {
      place: "شفوي",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: false,
      frication: true
    },
    closest: [
      { key: "ba", reason: "اشتراك الشفتين مع فرق الانفجار والجهر", decisiveTraits: ["burst", "voiced"] },
      { key: "meem", reason: "اشتراك الشفتين مع فرق الغنة والرخاوة", decisiveTraits: ["nasal", "frication"] }
    ]
  },

  qaf: {
    key: "qaf",
    letter: "ق",
    label: "قاف",
    family: "deep-burst-tafkheem",
    macroFamilies: ["لهوي عميق", "شديد", "مفخم"],
    traits: {
      place: "لهوي عميق",
      burst: true,
      voiced: true,
      tafkheem: true,
      sibilant: false
    },
    closest: [
      { key: "kaf", reason: "قرب مخرج وانفجار مع فرق التفخيم والعمق", decisiveTraits: ["tafkheem", "place"] },
      { key: "ghain", reason: "اشتراك العمق مع فرق الرخاوة/الانفجار", decisiveTraits: ["burst", "frication"] },
      { key: "kha", reason: "اشتراك العمق والتفخيم مع فرق الانفجار/الرخاوة", decisiveTraits: ["burst", "frication"] }
    ]
  },

  kaf: {
    key: "kaf",
    letter: "ك",
    label: "كاف",
    family: "deep-burst-plain",
    macroFamilies: ["لهوي", "شديد", "مرقق"],
    traits: {
      place: "لهوي",
      burst: true,
      voiced: false,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "qaf", reason: "قرب مخرج وانفجار مع فرق التفخيم والعمق", decisiveTraits: ["tafkheem", "place"] }
    ]
  },

  lam: {
    key: "lam",
    letter: "ل",
    label: "لام",
    family: "tip-lateral",
    macroFamilies: ["طرف اللسان", "انحرافي"],
    traits: {
      place: "طرف اللسان",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      lateral: true
    },
    closest: [
      { key: "ra", reason: "قرب طرف اللسان مع فرق التكرار والانحراف", decisiveTraits: ["repeated", "lateral"] },
      { key: "noon", reason: "قرب طرف اللسان مع فرق الغنة", decisiveTraits: ["nasal"] }
    ]
  },

  meem: {
    key: "meem",
    letter: "م",
    label: "ميم",
    family: "lip-nasal",
    macroFamilies: ["شفوي", "أغن"],
    traits: {
      place: "شفوي",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      nasal: true
    },
    closest: [
      { key: "ba", reason: "اشتراك الشفتين مع فرق الغنة والانفجار", decisiveTraits: ["nasal", "burst"] },
      { key: "noon", reason: "اشتراك الغنة مع فرق المخرج", decisiveTraits: ["place"] },
      { key: "fa", reason: "اشتراك الشفتين مع فرق الرخاوة والغنة", decisiveTraits: ["frication", "nasal"] }
    ]
  },

  noon: {
    key: "noon",
    letter: "ن",
    label: "نون",
    family: "tip-nasal",
    macroFamilies: ["طرف اللسان", "أغن"],
    traits: {
      place: "طرف اللسان",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      nasal: true
    },
    closest: [
      { key: "meem", reason: "اشتراك الغنة مع فرق المخرج", decisiveTraits: ["place"] },
      { key: "lam", reason: "قرب طرف اللسان مع فرق الغنة والانحراف", decisiveTraits: ["nasal", "lateral"] }
    ]
  },

  ha2: {
    key: "ha2",
    letter: "هـ",
    label: "هاء",
    family: "throat-breathy-light",
    macroFamilies: ["أقصى الحلق", "هوائي", "مهموس"],
    traits: {
      place: "أقصى الحلق",
      burst: false,
      voiced: false,
      tafkheem: false,
      sibilant: false,
      frication: false,
      breathy: true
    },
    closest: [
      { key: "ha", reason: "تشابه حلقي مع فرق العمق والاحتكاك", decisiveTraits: ["frication", "breathy"] },
      { key: "alif", reason: "اشتباه مع الهمزة عند ضعف النطق", decisiveTraits: ["burst", "breathy"] }
    ]
  },

  waw: {
    key: "waw",
    letter: "و",
    label: "واو",
    family: "lip-glide",
    macroFamilies: ["شفوي", "لين/مد"],
    traits: {
      place: "شفوي",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      glide: true
    },
    closest: [
      { key: "fa", reason: "اشتراك الشفة مع فرق الرخاوة/اللين", decisiveTraits: ["frication", "glide"] },
      { key: "meem", reason: "اشتراك الشفة مع فرق الغنة/اللين", decisiveTraits: ["nasal", "glide"] }
    ]
  },

  ya: {
    key: "ya",
    letter: "ي",
    label: "ياء",
    family: "middle-tongue-glide",
    macroFamilies: ["وسط اللسان", "لين/مد"],
    traits: {
      place: "وسط اللسان",
      burst: false,
      voiced: true,
      tafkheem: false,
      sibilant: false,
      glide: true
    },
    closest: [
      { key: "sheen", reason: "قرب وسط اللسان مع فرق التفشي/اللين", decisiveTraits: ["spreading", "glide"] },
      { key: "jeem", reason: "قرب وسط اللسان مع فرق الشدة/اللين", decisiveTraits: ["burst", "glide"] }
    ]
  },

  alif: {
    key: "alif",
    letter: "أ",
    label: "همزة",
    family: "throat-burst",
    macroFamilies: ["حلقي", "شديد"],
    traits: {
      place: "حلقي",
      burst: true,
      voiced: false,
      tafkheem: false,
      sibilant: false
    },
    closest: [
      { key: "ain", reason: "اشتباه عند المتعلمين مع فرق الجهر وطبيعة المخرج", decisiveTraits: ["voiced", "burst"] },
      { key: "ha2", reason: "اشتباه عند ضعف النطق مع فرق الهمس/الانفجار", decisiveTraits: ["breathy", "burst"] }
    ]
  }
};

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

  const keys = Array.from(
    new Set(Object.keys(target).concat(Object.keys(candidate)))
  );

  keys.forEach(function (key) {
    if (target[key] !== candidate[key]) {
      traits.push({
        trait: key,
        target: target[key],
        candidate: candidate[key]
      });
    }
  });

  return traits;
}

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
      decisionUse: "تحديد المنافسين قبل اعتماد نتيجة المطابقة والفصل.",
      riskIfMissing: "قد يعلن النظام نجاحًا بلا هامش فصل حقيقي.",
      rule: "لا تعتمد نتيجة حرف بلا منافس قريب إذا كانت العائلة معروفة."
    }
  };

  context.hasComparisonDuty = context.candidates.length > 0;

  sendPhonemeFamilyKnowledgeSignal(
    phonemeKey,
    context,
    context.candidates.length ? 1 : 0.3
  );

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
      operationalResult:
        matchReport && matchReport.correct ? "correct" : "unknown",
      cognitiveApproval:
        status === "comparison-ready" ? "reviewable" : "not-approved-yet",
      governanceNote:
        "النجاح التشغيلي لا يتحول إلى اعتماد إدراكي إلا بعد مراجعة العائلة والهامش والذاكرة."
    }
  };
}
function detectOutlierSamples(samples, featureKeys, options) {
  options = options || {};

  const threshold = options.threshold || 2.2;
  const minSamples = options.minSamples || 4;

  if (!Array.isArray(samples) || samples.length < minSamples) {
    return {
      cleanSamples: samples || [],
      outlierSamples: [],
      report: {
        reason: "not-enough-samples",
        threshold: threshold
      }
    };
  }

  const scored = samples.map(function (sample) {
    let score = 0;
    let hits = [];

    featureKeys.forEach(function (key) {
      const values = samples
        .map(function (s) {
          return getNestedNumber(s, key);
        })
        .filter(function (v) {
          return typeof v === "number" && Number.isFinite(v);
        });

      const value = getNestedNumber(sample, key);

      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        values.length < minSamples
      ) {
        return;
      }

      const median = medianNumber(values);
      const mad = medianNumber(
        values.map(function (v) {
          return Math.abs(v - median);
        })
      );

      const safeMad = mad || 0.0001;
      const z = Math.abs(value - median) / safeMad;

      if (z > threshold) {
        score++;
        hits.push({
          feature: key,
          value: roundOutlier(value),
          median: roundOutlier(median),
          deviation: roundOutlier(z)
        });
      }
    });

    return {
      sample: sample,
      outlierScore: score,
      outlierHits: hits
    };
  });

  const outlierSamples = scored
    .filter(function (x) {
      return x.outlierScore >= 2;
    })
    .map(function (x) {
      return {
        id: x.sample.id || x.sample.file || "",
        text: x.sample.text || x.sample.hmal || x.sample.haml || "",
        file: x.sample.file || "",
        reason: "perceptual-outlier",
        score: x.outlierScore,
        hits: x.outlierHits
      };
    });

  const cleanSamples = scored
    .filter(function (x) {
      return x.outlierScore < 2;
    })
    .map(function (x) {
      return x.sample;
    });

  return {
    cleanSamples: cleanSamples.length ? cleanSamples : samples,
    outlierSamples: outlierSamples,
    report: {
      threshold: threshold,
      total: samples.length,
      clean: cleanSamples.length,
      outliers: outlierSamples.length
    }
  };
}


function filterCleanSamplesForFamilyRecord(samples) {
  return detectOutlierSamples(samples, [
    "summary.meanCentroid",
    "summary.meanSpread",
    "summary.burstCentroid",
    "summary.burstSpread",
    "summary.spectralMovement",
    "summary.energyMovement",
    "summary.phaseQuality",

    "features.centroid",
    "features.spread",
    "features.burstiness",
    "features.activeRatio",
    "features.energy",

    "timeline.onset",
    "timeline.burst",
    "timeline.transition",
    "timeline.sustain",
    "timeline.release"
  ]);
}

function getNestedNumber(obj, path) {
  const parts = path.split(".");
  let cur = obj;

  for (let i = 0; i < parts.length; i++) {
    if (!cur) return null;
    cur = cur[parts[i]];
  }

  return typeof cur === "number" && Number.isFinite(cur) ? cur : null;
}


function medianNumber(values) {
  if (!values.length) return 0;

  const sorted = values.slice().sort(function (a, b) {
    return a - b;
  });

  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2) return sorted[mid];

  return (sorted[mid - 1] + sorted[mid]) / 2;
}


function roundOutlier(num) {
  return Number(Number(num || 0).toFixed(4));
}
function sendPhonemeFamilyKnowledgeSignal(phonemeKey, familyData, confidence) {
  if (typeof window.recordKnowledgeSignal !== "function") return null;

  return window.recordKnowledgeSignal({
    knowledgeId: "phoneme-family-map",
    sourceDepartment: "phoneme-core",
    sourceFile: "phoneme-core/phoneme-family-map.js",
    target: phonemeKey || "",
    producedKnowledge: familyData || null,
    confidence: typeof confidence === "number" ? confidence : null,
    servesDecision: [
      "compare-phoneme-family",
      "identify-phoneme",
      "match-phoneme",
      "approve-match-result",
      "split-segment"
    ],
    notes:
      "إرسال خريطة العائلة والمنافسين حتى تخدم قرارات المقارنة والمطابقة والفصل."
  });
}

window.PHONEME_FAMILY_MAP_CHARTER = PHONEME_FAMILY_MAP_CHARTER;
window.PHONEME_FAMILY_MAP = PHONEME_FAMILY_MAP;
window.getPhonemeFamilyEntry = getPhonemeFamilyEntry;
window.getPhonemeFamily = getPhonemeFamily;
window.getPhonemeTraits = getPhonemeTraits;
window.getConfusionCandidates = getConfusionCandidates;
window.getDistinctiveTraits = getDistinctiveTraits;
window.buildFamilyDecisionContext = buildFamilyDecisionContext;
window.evaluateFamilyDecisionReadiness = evaluateFamilyDecisionReadiness;
window.sendPhonemeFamilyKnowledgeSignal = sendPhonemeFamilyKnowledgeSignal;

console.log("🧭 خريطة العائلات الإدراكية جاهزة V2 — مفاتيحها مطابقة لحقائب التدريب");
