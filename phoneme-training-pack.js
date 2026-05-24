// ================================
// phoneme-training-pack.js
// مولّد حقائب التدريب الإدراكي للحروف — V2
// ================================

console.log("🎒 phoneme-training-pack.js جاهز V2");

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
  return {
    key: config.key,
    letter: config.letter,
    name: config.name,
    phoneme: config.letter,

    colorKey: config.colorKey || config.key,
    colorHex: config.colorHex,
    colorName: config.colorName,

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
      config.colorHex +
      "."
  };
}

const PHONEME_PACK_CONFIGS = [
  {
    key: "ba",
    letter: "ب",
    name: "باء",
    colorHex: "#00F2FF",
    colorName: "Noorani Turquoise",
    fileBase: "ba",
    traits: {
      place: "شفوي",
      tafkheem: false,
      burst: true,
      sibilant: false
    },
    notes: [
      "الباء حرف شفوي",
      "الباء حرف مجهور",
      "الباء له طبيعة انفجارية",
      "المطلوب إدراك صوت الباء لا صوت القارئ"
    ]
  },
  {
    key: "qa",
    letter: "ق",
    name: "قاف",
    colorHex: "#0D47A1",
    colorName: "Midnight Blue",
    fileBase: "qa",
    traits: {
      place: "لهوي عميق",
      tafkheem: true,
      burst: true,
      sibilant: false
    },
    notes: [
      "القاف حرف لهوي عميق",
      "القاف حرف شديد",
      "القاف له طبيعة انفجارية",
      "القاف يجب أن يتميز عن الباء والكاف"
    ]
  },
  {
    key: "ta",
    letter: "ت",
    name: "تاء",
    colorHex: "#38BDF8",
    colorName: "Clear Sky Blue",
    fileBase: "ta",
    traits: {
      place: "طرف اللسان",
      tafkheem: false,
      burst: true,
      sibilant: false
    },
    notes: [
      "التاء حرف مرقق",
      "التاء حرف شديد",
      "التاء مهم لاختبار الفرق بين الترقيق والتفخيم أمام الطاء"
    ]
  },
  {
    key: "tta",
    letter: "ط",
    name: "طاء",
    colorHex: "#F97316",
    colorName: "Emphatic Orange",
    fileBase: "tta",
    traits: {
      place: "طرف اللسان مع استعلاء",
      tafkheem: true,
      burst: true,
      sibilant: false
    },
    notes: [
      "الطاء حرف مفخم",
      "الطاء حرف شديد",
      "الطاء اختبار مهم لمفهوم الامتلاء والتفخيم مقابل التاء"
    ]
  },
  {
    key: "sa",
    letter: "س",
    name: "سين",
    colorHex: "#22C55E",
    colorName: "Sibilant Green",
    fileBase: "sa",
    traits: {
      place: "أسلي صفيري",
      tafkheem: false,
      burst: false,
      sibilant: true
    },
    notes: [
      "السين حرف صفيري مرقق",
      "السين يختبر الطاقة المستمرة والصفير",
      "السين تقارن لاحقًا بالصاد"
    ]
  },
  {
    key: "saa",
    letter: "ص",
    name: "صاد",
    colorHex: "#A16207",
    colorName: "Emphatic Amber",
    fileBase: "saa",
    traits: {
      place: "أسلي صفيري مفخم",
      tafkheem: true,
      burst: false,
      sibilant: true
    },
    notes: [
      "الصاد حرف صفيري مفخم",
      "الصاد يختبر الصفير مع التفخيم",
      "الصاد تقارن بالسين لاختبار الفرق بين الترقيق والتفخيم"
    ]
  }
];

const PHONEME_TRAINING_PACK = {};

PHONEME_PACK_CONFIGS.forEach(function (config) {
  PHONEME_TRAINING_PACK[config.key] =
    createPhonemeTrainingPack(config);
});

function getPhonemeTrainingPack(key) {
  return PHONEME_TRAINING_PACK[key] || null;
}

function getAllPhonemeTrainingPacks() {
  return PHONEME_TRAINING_PACK;
}

console.log("🎒 حقائب التدريب الإدراكي للحروف مسجلة V2");
