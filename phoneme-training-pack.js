// ================================
// phoneme-training-pack.js
// حقيبة التدريب الإدراكي للحروف — V1
// ================================

console.log("🎒 phoneme-training-pack.js جاهز");

/*
  هذا الملف ليس للتسجيل النهائي.
  هذا الملف لتدريب النظام على معرفة الحرف إدراكيًا.

  الفكرة:
  الحرف له:
  - اسم
  - رسم
  - لون إدراكي
  - أوضاع صوتية
  - صفات
  - تدريبات

  الهدف:
  أن يتعرف النظام على الحرف إذا ظهر منفصلًا أو متصلًا أو متداخلًا.
*/
function createPhonemeTrainingPack(config) {
  const key = config.key;
  const letter = config.letter;
  const name = config.name;
  const colorKey = config.colorKey;
  const colorHex = config.colorHex;
  const colorName = config.colorName;

  const base = config.fileBase || key;

  return {
    key,
    letter,
    name,
    phoneme: letter,

    colorKey,
    colorHex,
    colorName,

    identityGoal:
      "تدريب النظام على إدراك صوت " + name + " في جميع أوضاعه، لا تمييز صوت المتكلم.",

    principle:
      "كل هذه التدريبات تنتمي إلى هوية واحدة هي " + name + "، وتُربط بلون إدراكي واحد.",

    positions: [
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
    ],

    perceptualNotes: config.notes || [
      "المطلوب إدراك صوت الحرف لا صوت القارئ",
      "اللون يمثل هوية الحرف الإدراكية",
      "هذه الحقيبة مخصصة لبناء ذاكرة إدراكية للحرف"
    ],

    trainingRule:
      "كل تسجيل جديد مطابق لأحد أوضاع " +
      name +
      " يُضاف إلى ذاكرة " +
      name +
      " ويرتبط باللون " +
      colorHex +
      "."
  };
}
const PHONEME_TRAINING_PACK = {
  ba: createPhonemeTrainingPack({
    key: "ba",
    letter: "ب",
    name: "باء",
    colorKey: "ba",
    colorHex: "#00F2FF",
    colorName: "Noorani Turquoise",
    fileBase: "ba",
    notes: [
      "الباء حرف شفوي",
      "الباء حرف مجهور",
      "الباء له طبيعة انفجارية",
      "المطلوب إدراك صوت الباء لا صوت القارئ"
    ]
  }),

  qa: createPhonemeTrainingPack({
    key: "qa",
    letter: "ق",
    name: "قاف",
    colorKey: "qaf",
    colorHex: "#0D47A1",
    colorName: "Midnight Blue",
    fileBase: "qa",
    notes: [
      "القاف حرف لهوي عميق",
      "القاف حرف شديد",
      "القاف له طبيعة انفجارية",
      "القاف يجب أن يتميز عن الباء والكاف"
    ]
  })
};
function getPhonemeTrainingPack(key) {
  return PHONEME_TRAINING_PACK[key] || null;
}

function getAllPhonemeTrainingPacks() {
  return PHONEME_TRAINING_PACK;
}
console.log("🎒 حقائب التدريب الإدراكي للحروف مسجلة");
