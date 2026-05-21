// ================================
// phoneme-color-memory.js
// ذاكرة الألوان الإدراكية للحروف — V1
// ================================

console.log("🎨 phoneme-color-memory.js جاهز");

// مرجع الحروف الإدراكي الأول
const PHONEME_COLOR_MEMORY = {

  ba: {
    phoneme: "ب",
    label: "باء",

    color: {
      name: "Noorani Turquoise",
      hex: "#00f2ff",
      meaning: "هوية الباء الإدراكية"
    },

    trainingUnits: [
      { text: "بَ", file: "ba_fatha.wav", role: "fatha" },
      { text: "بِ", file: "ba_kasra.wav", role: "kasra" },
      { text: "بُ", file: "ba_damma.wav", role: "damma" },
      { text: "بَبْ", file: "bab_sukoon.wav", role: "sukoon" }
    ],

    concept: {
      goal: "تعليم النظام أن هذه الأصوات المختلفة كلها تنتمي إلى شخصية الباء",
      rule: "إذا ظهرت السمات المشتركة لهذه الوحدات فالنظام يعبّر عنها بلون الباء",
      colorMeaning: "اللون هنا ليس زينة، بل رمز إدراكي لهوية الحرف"
    }
  },

  qa: {
    phoneme: "ق",
    label: "قاف",

    color: {
      name: "Midnight Blue",
      hex: "#0D47A1",
      meaning: "هوية القاف الإدراكية"
    },

    trainingUnits: [
      { text: "قَ", file: "qa_fatha.wav", role: "fatha" },
      { text: "قِ", file: "qa_kasra.wav", role: "kasra" },
      { text: "قُ", file: "qa_damma.wav", role: "damma" },
      { text: "قَقْ", file: "qa_sukoon_fatha.wav", role: "sukoon_fatha" },
      { text: "قِقْ", file: "qa_sukoon_kasra.wav", role: "sukoon_kasra" },
      { text: "قُقْ", file: "qa_sukoon_damma.wav", role: "sukoon_damma" }
    ],

    concept: {
      goal: "تعليم النظام أن هذه الأصوات المختلفة كلها تنتمي إلى شخصية القاف",
      rule: "إذا ظهرت السمات المشتركة لهذه الوحدات فالنظام يعبّر عنها بلون القاف",
      colorMeaning: "اللون هنا رمز إدراكي لهوية القاف"
    }
  }

};

function getPhonemeMemory(key) {
  return PHONEME_COLOR_MEMORY[key] || null;
}

console.log("🎨 ذاكرة الألوان الإدراكية للحروف جاهزة");
