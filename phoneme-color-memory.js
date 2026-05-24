// ================================
// phoneme-color-memory.js
// ذاكرة الألوان الإدراكية للحروف — V3
// ================================

console.log("🎨 phoneme-color-memory.js جاهز V3");


// ======================================
// إنشاء ذاكرة لون حرف من حقيبة التدريب
// ======================================

function createPhonemeColorMemory(config) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(config.key)
      : null;

  const colorBinding =
    typeof bindPhonemeToColor === "function"
      ? bindPhonemeToColor(config.colorKey || config.key)
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
      name:
        colorBinding?.colorName ||
        config.colorName ||
        "Noorani Color",

      hex:
        colorBinding?.hex ||
        config.colorHex ||
        "#38BDF8",

      meaning:
        "هوية " + config.name + " الإدراكية"
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
// توليد الذاكرة من تعريفات الحقائب
// ======================================

function buildPhonemeColorMemoryConfigs() {
  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    return Object.keys(PHONEME_LETTER_DEFINITIONS).map(function (key) {
      const def = PHONEME_LETTER_DEFINITIONS[key];

      const colorBinding =
        typeof bindPhonemeToColor === "function"
          ? bindPhonemeToColor(def.colorKey || key)
          : null;

      return {
        key: key,
        letter: def.letter,
        name: def.name,
        colorKey: def.colorKey || key,
        colorHex:
          colorBinding?.hex ||
          def.colorHex ||
          "#38BDF8",
        colorName:
          colorBinding?.colorName ||
          def.colorName ||
          "Noorani Color",
        traits: def.traits || {}
      };
    });
  }

  return [
    {
      key: "ba",
      letter: "ب",
      name: "باء",
      colorKey: "ba",
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
      colorKey: "qa",
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
      colorKey: "ta",
      colorHex: "#FFD400",
      colorName: "Bright Yellow",
      traits: {
        place: "طرف اللسان",
        tafkheem: false,
        burst: true,
        sibilant: false
      }
    },
    {
      key: "taa",
      letter: "ط",
      name: "طاء",
      colorKey: "taa",
      colorHex: "#8D6E63",
      colorName: "Dark Bronze",
      traits: {
        place: "طرف اللسان مع استعلاء",
        tafkheem: true,
        burst: true,
        sibilant: false
      }
    },
    {
      key: "sin",
      letter: "س",
      name: "سين",
      colorKey: "sin",
      colorHex: "#42A5F5",
      colorName: "Sky Blue",
      traits: {
        place: "أسلي صفيري",
        tafkheem: false,
        burst: false,
        sibilant: true
      }
    },
    {
      key: "sad",
      letter: "ص",
      name: "صاد",
      colorKey: "sad",
      colorHex: "#1E3A8A",
      colorName: "Royal Blue",
      traits: {
        place: "أسلي صفيري مفخم",
        tafkheem: true,
        burst: false,
        sibilant: true
      }
    }
  ];
}


// ======================================
// بناء ذاكرة الألوان تلقائيًا
// ======================================

const PHONEME_COLOR_CONFIGS =
  buildPhonemeColorMemoryConfigs();

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


console.log("🎨 ذاكرة الألوان الإدراكية للحروف جاهزة V3");
