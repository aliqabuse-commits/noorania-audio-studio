// ================================
// phoneme-training-pack.js
// مولّد حقائب التدريب الإدراكي للحروف — V4
// ملتزم بمرجع المسميات السيادي
// ================================

console.log("🎒 phoneme-training-pack.js جاهز V4");

const PHONEME_LETTER_DEFINITIONS = {
  ba: {
    key: "ba",
    letter: "ب",
    name: "باء",
    colorKey: "ba",
    fileBase: "ba",
    traits: {
      place: "شفوي",
      tafkheem: false,
      burst: true,
      sibilant: false
    },
    notes: [
      "الباء حرف شفوي",
      "الباء له طبيعة انفجارية",
      "المطلوب إدراك صوت الباء لا صوت القارئ"
    ]
  },

  qaf: {
    key: "qaf",
    letter: "ق",
    name: "قاف",
    colorKey: "qaf",
    fileBase: "qaf",
    traits: {
      place: "لهوي عميق",
      tafkheem: true,
      burst: true,
      sibilant: false
    },
    notes: [
      "القاف حرف لهوي عميق",
      "القاف حرف شديد",
      "القاف يجب أن يتميز عن الباء والكاف"
    ]
  },

  ta: {
    key: "ta",
    letter: "ت",
    name: "تاء",
    colorKey: "ta",
    fileBase: "ta",
    traits: {
      place: "طرف اللسان",
      tafkheem: false,
      burst: true,
      sibilant: false
    },
    notes: [
      "التاء حرف مرقق",
      "التاء مهم لاختبار الفرق بينها وبين الطاء"
    ]
  },

  taa: {
    key: "taa",
    letter: "ط",
    name: "طاء",
    colorKey: "taa",
    fileBase: "taa",
    traits: {
      place: "طرف اللسان مع استعلاء",
      tafkheem: true,
      burst: true,
      sibilant: false
    },
    notes: [
      "الطاء حرف مفخم",
      "الطاء اختبار مهم للتفخيم مقابل التاء"
    ]
  },

  seen: {
    key: "seen",
    letter: "س",
    name: "سين",
    colorKey: "seen",
    fileBase: "seen",
    traits: {
      place: "أسلي صفيري",
      tafkheem: false,
      burst: false,
      sibilant: true
    },
    notes: [
      "السين حرف صفيري مرقق",
      "السين تقارن لاحقًا بالصاد"
    ]
  },

  sad: {
    key: "sad",
    letter: "ص",
    name: "صاد",
    colorKey: "sad",
    fileBase: "sad",
    traits: {
      place: "أسلي صفيري مفخم",
      tafkheem: true,
      burst: false,
      sibilant: true
    },
    notes: [
      "الصاد حرف صفيري مفخم",
      "الصاد تقارن بالسين لاختبار الفرق بين الترقيق والتفخيم"
    ]
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

    positions:
      config.positions ||
      generateStandardPositions(config),

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
