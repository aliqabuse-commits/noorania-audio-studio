// ================================
// phoneme-color-memory.js
// ذاكرة الألوان الإدراكية للحروف — V1
// ================================

console.log("🎨 phoneme-color-memory.js جاهز");

// مرجع الباء الإدراكي الأول
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
  }
};

function getPhonemeMemory(key) {
  return PHONEME_COLOR_MEMORY[key] || null;
}

console.log("🎨 ذاكرة الباء الإدراكية مسجلة");
