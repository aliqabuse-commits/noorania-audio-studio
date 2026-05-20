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

const PHONEME_TRAINING_PACK = {
  ba: {
    key: "ba",

    letter: "ب",
    name: "باء",
    phoneme: "ب",

    colorKey: "ba",
    colorHex: "#00F2FF",
    colorName: "Noorani Turquoise",

    identityGoal:
      "تدريب النظام على إدراك صوت الباء في جميع أوضاعه، لا تمييز صوت المتكلم.",

    principle:
      "كل هذه التدريبات تنتمي إلى هوية واحدة هي الباء، وتُربط بلون إدراكي واحد.",

    positions: [
      {
        id: "ba_fatha",
        text: "بَ",
        file: "ba_fatha.wav",
        role: "فتح",
        description: "الباء مع الفتحة"
      },
      {
        id: "ba_kasra",
        text: "بِ",
        file: "ba_kasra.wav",
        role: "كسر",
        description: "الباء مع الكسرة"
      },
      {
        id: "ba_damma",
        text: "بُ",
        file: "ba_damma.wav",
        role: "ضم",
        description: "الباء مع الضمة"
      },
      {
        id: "bab_sukoon",
        text: "بَبْ",
        file: "bab_sukoon.wav",
        role: "سكون بعد فتح",
        description: "الباء الساكنة بعد فتحة"
      },
      {
        id: "bib_sukoon",
        text: "بِبْ",
        file: "bib_sukoon.wav",
        role: "سكون بعد كسر",
        description: "الباء الساكنة بعد كسرة"
      },
      {
        id: "bub_sukoon",
        text: "بُبْ",
        file: "bub_sukoon.wav",
        role: "سكون بعد ضم",
        description: "الباء الساكنة بعد ضمة"
      }
    ],

    perceptualNotes: [
      "الباء حرف شفوي",
      "الباء حرف مجهور",
      "الباء له طبيعة انفجارية",
      "المطلوب إدراك صوت الباء لا صوت القارئ",
      "اللون يمثل هوية الباء الإدراكية"
    ],

    trainingRule:
      "كل تسجيل جديد مطابق لأحد أوضاع الباء يُضاف إلى ذاكرة الباء ويرتبط باللون #00F2FF."
  }
};

function getPhonemeTrainingPack(key) {
  return PHONEME_TRAINING_PACK[key] || null;
}

function getAllPhonemeTrainingPacks() {
  return PHONEME_TRAINING_PACK;
}

console.log("🎒 حقيبة تدريب الباء الإدراكية مسجلة");
