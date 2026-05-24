// ================================
// phoneme-color-memory.js
// ذاكرة الألوان الإدراكية للحروف — V2
// ================================

console.log("🎨 phoneme-color-memory.js جاهز V2");


// ======================================
// إنشاء ذاكرة لون حرف من حقيبة التدريب
// ======================================

function createPhonemeColorMemory(config) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(config.key)
      : null;

  const trainingUnits =
    pack && pack.positions
      ? pack.positions.map(function (p) {
          return {
            text: p.text,
            file: p.file,
            role: p.role
          };
        })
      : [];

  return {
    key: config.key,
    phoneme: config.letter,
    label: config.name,

    color: {
      name: config.colorName,
      hex: config.colorHex,
      meaning: "هوية " + config.name + " الإدراكية"
    },

    traits: config.traits || {},

    trainingUnits: trainingUnits,

    concept: {
      goal:
        "تعليم النظام أن هذه الأصوات المختلفة كلها تنتمي إلى شخصية " +
        config.name,

      rule:
        "إذا ظهرت السمات المشتركة لهذه الوحدات فالنظام يعبّر عنها بلون " +
        config.name,

      colorMeaning:
        "اللون هنا ليس زينة، بل رمز إدراكي لهوية الحرف"
    }
  };
}


// ======================================
// تعريفات ذاكرة الألوان للحروف
// ======================================

const PHONEME_COLOR_CONFIGS = [
  {
    key: "ba",
    letter: "ب",
    name: "باء",
    colorHex: "#00F2FF",
    colorName: "Noorani Turquoise",
    traits: {
      place: "شفوي",
      tafkheem: false,
      burst: true,
      sibilant: false
    }
  },
  {
    key: "qa",
    letter: "ق",
    name: "قاف",
    colorHex: "#0D47A1",
    colorName: "Midnight Blue",
    traits: {
      place: "لهوي عميق",
      tafkheem: true,
      burst: true,
      sibilant: false
    }
  },
  {
    key: "ta",
    letter: "ت",
    name: "تاء",
    colorHex: "#38BDF8",
    colorName: "Clear Sky Blue",
    traits: {
      place: "طرف اللسان",
      tafkheem: false,
      burst: true,
      sibilant: false
    }
  },
  {
    key: "tta",
    letter: "ط",
    name: "طاء",
    colorHex: "#F97316",
    colorName: "Emphatic Orange",
    traits: {
      place: "طرف اللسان مع استعلاء",
      tafkheem: true,
      burst: true,
      sibilant: false
    }
  },
  {
    key: "sa",
    letter: "س",
    name: "سين",
    colorHex: "#22C55E",
    colorName: "Sibilant Green",
    traits: {
      place: "أسلي صفيري",
      tafkheem: false,
      burst: false,
      sibilant: true
    }
  },
  {
    key: "saa",
    letter: "ص",
    name: "صاد",
    colorHex: "#A16207",
    colorName: "Emphatic Amber",
    traits: {
      place: "أسلي صفيري مفخم",
      tafkheem: true,
      burst: false,
      sibilant: true
    }
  }
];


// ======================================
// بناء ذاكرة الألوان تلقائيًا
// ======================================

const PHONEME_COLOR_MEMORY = {};

PHONEME_COLOR_CONFIGS.forEach(function (config) {
  PHONEME_COLOR_MEMORY[config.key] =
    createPhonemeColorMemory(config);
});


// ======================================
// دوال الوصول
// ======================================

function getPhonemeMemory(key) {
  return PHONEME_COLOR_MEMORY[key] || null;
}

function getAllPhonemeMemories() {
  return PHONEME_COLOR_MEMORY;
}

console.log("🎨 ذاكرة الألوان الإدراكية للحروف جاهزة V2");
