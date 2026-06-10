// ================================
// phoneme-training-pack.js
// مولّد حقائب التدريب الإدراكي للحروف — V4
// ملتزم بمرجع المسميات السيادي
// ================================

console.log("🎒 phoneme-training-pack.js جاهز V4");

// ======================================
// قسم تعريف الحقائب الإدراكية
// تمت إضافة كافة الحروف الأبجدية هنا لتغطية الخريطة الصوتية كاملة
// الهدف: تدريب النظام على إدراك وتمييز كل حرف ضمن سياقه الصوتي والمخارج المحددة.
// 
// تحذير سيادي: 
// يُمنع منعاً باتاً تغيير المفاتيح (key / colorKey / fileBase)
// بعد الشروع في بناء الجينوم وذاكرة النظام الإدراكية؛ لأن ذلك سيؤدي 
// إلى فقدان السجلات المسجلة وانهيار مرجعية مصفوفة الالتباس.
// ======================================
const PHONEME_LETTER_DEFINITIONS = {
  
  alif: {
    key: "alif",
    letter: "أ",
    name: "همزة",
    colorKey: "alif",
    fileBase: "alif",
    traits: { place: "حلقي", tafkheem: false, burst: true, sibilant: false },
    notes: [
      "هذه الحقيبة مخصصة للهمزة لا للألف المدية",
      "الهمزة حرف حلقي شديد",
      "المطلوب إدراك صوت الهمزة في أوضاعها المختلفة"
    ],
    positions: [
      {
        id: "alif_fatha",
        text: "أَ",
        file: "alif_fatha.wav",
        role: "فتح",
        description: "همزة مع الفتحة"
      },
      {
        id: "alif_kasra",
        text: "إِ",
        file: "alif_kasra.wav",
        role: "كسر",
        description: "همزة مع الكسرة"
      },
      {
        id: "alif_damma",
        text: "أُ",
        file: "alif_damma.wav",
        role: "ضم",
        description: "همزة مع الضمة"
      },
      {
        id: "alif_sukoon_after_fatha",
        text: "ءَأْ",
        file: "alif_sukoon_fatha.wav",
        role: "سكون بعد فتح",
        description: "همزة ساكنة بعد فتحة"
      },
      {
        id: "alif_sukoon_after_kasra",
        text: "إِئْ",
        file: "alif_sukoon_kasra.wav",
        role: "سكون بعد كسر",
        description: "همزة ساكنة بعد كسرة"
      },
      {
        id: "alif_sukoon_after_damma",
        text: "أُؤْ",
        file: "alif_sukoon_damma.wav",
        role: "سكون بعد ضم",
        description: "همزة ساكنة بعد ضمة"
      }
    ]
  },

  ba: {
    key: "ba",
    letter: "ب",
    name: "باء",
    colorKey: "ba",
    fileBase: "ba",
    traits: { place: "شفوي", tafkheem: false, burst: true, sibilant: false },
    notes: ["الباء حرف شفوي", "الباء له طبيعة انفجارية", "المطلوب إدراك صوت الباء لا صوت القارئ"]
  },

  ta: {
    key: "ta",
    letter: "ت",
    name: "تاء",
    colorKey: "ta",
    fileBase: "ta",
    traits: { place: "طرف اللسان", tafkheem: false, burst: true, sibilant: false },
    notes: ["التاء حرف مرقق", "التاء مهم لاختبار الفرق بينها وبين الطاء"]
  },

  tha: {
    key: "tha",
    letter: "ث",
    name: "ثاء",
    colorKey: "tha",
    fileBase: "tha",
    traits: { place: "لثوي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الثاء حرف لثوي مرقق", "يقارن بالسين والذال لتحديد الالتباس"]
  },

  jeem: {
    key: "jeem",
    letter: "ج",
    name: "جيم",
    colorKey: "jeem",
    fileBase: "jeem",
    traits: { place: "وسط اللسان", tafkheem: false, burst: true, sibilant: false },
    notes: ["الجيم حرف شديد مجهور", "يجب أن يتميز عن الشين"]
  },

  ha: {
    key: "ha",
    letter: "ح",
    name: "حاء",
    colorKey: "ha",
    fileBase: "ha",
    traits: { place: "حلقي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الحاء حرف حلقي مهموس", "تختبر لتمييزها عن الخاء والهاء"]
  },

  kha: {
    key: "kha",
    letter: "خ",
    name: "خاء",
    colorKey: "kha",
    fileBase: "kha",
    traits: { place: "حلقي", tafkheem: true, burst: false, sibilant: false },
    notes: ["الخاء حرف حلقي مفخم", "تختبر مع الحاء والغين"]
  },

  dal: {
    key: "dal",
    letter: "د",
    name: "دال",
    colorKey: "dal",
    fileBase: "dal",
    traits: { place: "طرف اللسان", tafkheem: false, burst: true, sibilant: false },
    notes: ["الدال حرف شديد مجهور", "يقارن مع التاء والضاد"]
  },

  thal: {
    key: "thal",
    letter: "ذ",
    name: "ذال",
    colorKey: "thal",
    fileBase: "thal",
    traits: { place: "لثوي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الذال حرف لثوي مجهور", "يقارن مع الظاء والزاي"]
  },

  ra: {
    key: "ra",
    letter: "ر",
    name: "راء",
    colorKey: "ra",
    fileBase: "ra",
    traits: { place: "طرف اللسان", tafkheem: false, burst: false, sibilant: false },
    notes: ["الراء حرف تكراري", "إدراك الراء يعتمد على التفريق في حالات الترقيق والتفخيم"]
  },

  zay: {
    key: "zay",
    letter: "ز",
    name: "زاي",
    colorKey: "zay",
    fileBase: "zay",
    traits: { place: "أسلي صفيري", tafkheem: false, burst: false, sibilant: true },
    notes: ["الزاي حرف صفيري مجهور", "يقارن مع السين والذال"]
  },

  seen: {
    key: "seen",
    letter: "س",
    name: "سين",
    colorKey: "seen",
    fileBase: "seen",
    traits: { place: "أسلي صفيري", tafkheem: false, burst: false, sibilant: true },
    notes: ["السين حرف صفيري مرقق", "السين تقارن لاحقًا بالصاد"]
  },

  sheen: {
    key: "sheen",
    letter: "ش",
    name: "شين",
    colorKey: "sheen",
    fileBase: "sheen",
    traits: { place: "وسط اللسان", tafkheem: false, burst: false, sibilant: true },
    notes: ["الشين حرف يتميز بالتفشي", "يقارن مع الجيم والسين"]
  },

  sad: {
    key: "sad",
    letter: "ص",
    name: "صاد",
    colorKey: "sad",
    fileBase: "sad",
    traits: { place: "أسلي صفيري مفخم", tafkheem: true, burst: false, sibilant: true },
    notes: ["الصاد حرف صفيري مفخم", "الصاد تقارن بالسين لاختبار الفرق بين الترقيق والتفخيم"]
  },

  dad: {
    key: "dad",
    letter: "ض",
    name: "ضاد",
    colorKey: "dad",
    fileBase: "dad",
    traits: { place: "حافة اللسان", tafkheem: true, burst: false, sibilant: false },
    notes: ["الضاد حرف يتميز بالاستطالة والتفخيم", "يقارن مع الدال والظاء"]
  },

  taa: {
    key: "taa",
    letter: "ط",
    name: "طاء",
    colorKey: "taa",
    fileBase: "taa",
    traits: { place: "طرف اللسان مع استعلاء", tafkheem: true, burst: true, sibilant: false },
    notes: ["الطاء حرف مفخم", "الطاء اختبار مهم للتفخيم مقابل التاء"]
  },

  zaa: {
    key: "zaa",
    letter: "ظ",
    name: "ظاء",
    colorKey: "zaa",
    fileBase: "zaa",
    traits: { place: "لثوي مفخم", tafkheem: true, burst: false, sibilant: false },
    notes: ["الظاء حرف لثوي مفخم", "يقارن مع الذال والضاد"]
  },

  ain: {
    key: "ain",
    letter: "ع",
    name: "عين",
    colorKey: "ain",
    fileBase: "ain",
    traits: { place: "حلقي", tafkheem: false, burst: false, sibilant: false },
    notes: ["العين حرف حلقي مجهور متوسط", "يقارن مع الحاء والهمزة"]
  },

  ghain: {
    key: "ghain",
    letter: "غ",
    name: "غين",
    colorKey: "ghain",
    fileBase: "ghain",
    traits: { place: "حلقي", tafkheem: true, burst: false, sibilant: false },
    notes: ["الغين حرف حلقي مفخم", "يقارن مع الخاء"]
  },

  fa: {
    key: "fa",
    letter: "ف",
    name: "فاء",
    colorKey: "fa",
    fileBase: "fa",
    traits: { place: "شفوي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الفاء حرف شفوي مهموس", "يقارن مع الباء والميم"]
  },

  qaf: {
    key: "qaf",
    letter: "ق",
    name: "قاف",
    colorKey: "qaf",
    fileBase: "qaf",
    traits: { place: "لهوي عميق", tafkheem: true, burst: true, sibilant: false },
    notes: ["القاف حرف لهوي عميق", "القاف حرف شديد", "القاف يجب أن يتميز عن الباء والكاف"]
  },

  kaf: {
    key: "kaf",
    letter: "ك",
    name: "كاف",
    colorKey: "kaf",
    fileBase: "kaf",
    traits: { place: "لهوي", tafkheem: false, burst: true, sibilant: false },
    notes: ["الكاف حرف لهوي مرقق", "يقارن مع القاف للتمييز الإدراكي"]
  },

  lam: {
    key: "lam",
    letter: "ل",
    name: "لام",
    colorKey: "lam",
    fileBase: "lam",
    traits: { place: "طرف اللسان", tafkheem: false, burst: false, sibilant: false },
    notes: ["اللام حرف انحرافي", "يقارن مع النون والراء"]
  },

  meem: {
    key: "meem",
    letter: "م",
    name: "ميم",
    colorKey: "meem",
    fileBase: "meem",
    traits: { place: "شفوي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الميم حرف شفوي أغن", "يقارن مع الباء والنون"]
  },

  noon: {
    key: "noon",
    letter: "ن",
    name: "نون",
    colorKey: "noon",
    fileBase: "noon",
    traits: { place: "طرف اللسان", tafkheem: false, burst: false, sibilant: false },
    notes: ["النون حرف أغن", "يقارن مع الميم واللام"]
  },

  ha2: {
    key: "ha2",
    letter: "هـ",
    name: "هاء",
    colorKey: "ha2",
    fileBase: "ha2",
    traits: { place: "أقصى الحلق", tafkheem: false, burst: false, sibilant: false },
    notes: ["الهاء حرف حلقي مهموس خفي", "يقارن مع الحاء والهمزة"]
  },

  waw: {
    key: "waw",
    letter: "و",
    name: "واو",
    colorKey: "waw",
    fileBase: "waw",
    traits: { place: "شفوي", tafkheem: false, burst: false, sibilant: false },
    notes: ["الواو حرف شفوي", "يختبر كحرف لين أو مد"]
  },

  ya: {
    key: "ya",
    letter: "ي",
    name: "ياء",
    colorKey: "ya",
    fileBase: "ya",
    traits: { place: "وسط اللسان", tafkheem: false, burst: false, sibilant: false },
    notes: ["الياء حرف وسطي", "يختبر كحرف لين أو مد"]
  }
};


function generateStandardPositions(config) {
  const letter = config.letter;
  const name = config.name;
  const base = config.fileBase || config.key;

  return [
    {
      id: base + "_fatha",
      text: letter + "َ",
      file: base + "_fatha.wav",
      role: "فتح",
      description: name + " مع الفتحة"
    },
    {
      id: base + "_kasra",
      text: letter + "ِ",
      file: base + "_kasra.wav",
      role: "كسر",
      description: name + " مع الكسرة"
    },
    {
      id: base + "_damma",
      text: letter + "ُ",
      file: base + "_damma.wav",
      role: "ضم",
      description: name + " مع الضمة"
    },
    {
      id: base + "_sukoon_after_fatha",
      text: letter + "َ" + letter + "ْ",
      file: base + "_sukoon_fatha.wav",
      role: "سكون بعد فتح",
      description: name + " الساكنة بعد فتحة"
    },
    {
      id: base + "_sukoon_after_kasra",
      text: letter + "ِ" + letter + "ْ",
      file: base + "_sukoon_kasra.wav",
      role: "سكون بعد كسر",
      description: name + " الساكنة بعد كسرة"
    },
    {
      id: base + "_sukoon_after_damma",
      text: letter + "ُ" + letter + "ْ",
      file: base + "_sukoon_damma.wav",
      role: "سكون بعد ضم",
      description: name + " الساكنة بعد ضمة"
    }
  ];
}


function createPhonemeTrainingPack(config) {
  const colorData =
    typeof getPhonemeColor === "function"
      ? getPhonemeColor(config.colorKey || config.key)
      : null;

  const colorHex =
    colorData && colorData.hex
      ? colorData.hex
      : config.colorHex || "#38BDF8";

  const colorName =
    colorData && colorData.colorName
      ? colorData.colorName
      : config.colorName || "Noorani Color";
const normalizedPositions =
  (config.positions || generateStandardPositions(config)).map(function (p) {
    const label = p.hmal || p.haml || p.text;

    return {
      ...p,
      hmal: label,
      haml: label,
      text: label
    };
  });
  return {
    key: config.key,
    letter: config.letter,
    name: config.name,
    phoneme: config.letter,

    colorKey: config.colorKey || config.key,
    colorHex: colorHex,
    colorName: colorName,

    traits: config.traits || {},

    identityGoal:
      "تدريب النظام على إدراك صوت " +
      config.name +
      " في جميع أوضاعه، لا تمييز صوت المتكلم.",

    principle:
      "كل هذه التدريبات تنتمي إلى هوية واحدة هي " +
      config.name +
      "، وتُربط بلون إدراكي واحد.",

    positions: normalizedPositions,
    perceptualNotes: config.notes || [
      "المطلوب إدراك صوت الحرف لا صوت القارئ",
      "اللون يمثل هوية الحرف الإدراكية",
      "هذه الحقيبة مخصصة لبناء ذاكرة إدراكية للحرف"
    ],

    trainingRule:
      "كل تسجيل جديد مطابق لأحد أوضاع " +
      config.name +
      " يُضاف إلى ذاكرة " +
      config.name +
      " ويرتبط باللون " +
      colorHex +
      "."
  };
}


const PHONEME_TRAINING_PACK = {};

Object.keys(PHONEME_LETTER_DEFINITIONS).forEach(function (key) {
  PHONEME_TRAINING_PACK[key] =
    createPhonemeTrainingPack(PHONEME_LETTER_DEFINITIONS[key]);
});


function getPhonemeTrainingPack(key) {
  return PHONEME_TRAINING_PACK[key] || null;
}


function getAllPhonemeTrainingPacks() {
  return PHONEME_TRAINING_PACK;
}


console.log("🎒 حقائب التدريب الإدراكي للحروف مسجلة V4");
