// ================================
// phoneme-colors.js
// المرجعية اللونية الإدراكية للحروف — V1
// ================================

console.log("🎨 phoneme-colors.js جاهز");

const PHONEME_COLORS = {
  alif: { letter: "ا", name: "ألف", colorName: "Pure White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  ba: { letter: "ب", name: "باء", colorName: "Noorani Turquoise", hex: "#00F2FF", rgb: [0, 242, 255] },
  ta: { letter: "ت", name: "تاء", colorName: "Bright Yellow", hex: "#FFD400", rgb: [255, 212, 0] },
  tha: { letter: "ث", name: "ثاء", colorName: "Lemon Gold", hex: "#FFF176", rgb: [255, 241, 118] },
  jeem: { letter: "ج", name: "جيم", colorName: "Deep Orange", hex: "#FF6F00", rgb: [255, 111, 0] },
  ha: { letter: "ح", name: "حاء", colorName: "Soft Green", hex: "#4CAF50", rgb: [76, 175, 80] },
  kha: { letter: "خ", name: "خاء", colorName: "Dark Olive", hex: "#556B2F", rgb: [85, 107, 47] },
  dal: { letter: "د", name: "دال", colorName: "Warm Red", hex: "#E53935", rgb: [229, 57, 53] },
  thal: { letter: "ذ", name: "ذال", colorName: "Rose Red", hex: "#FF5C8A", rgb: [255, 92, 138] },
  ra: { letter: "ر", name: "راء", colorName: "Crimson", hex: "#C62828", rgb: [198, 40, 40] },
  zay: { letter: "ز", name: "زاي", colorName: "Magenta", hex: "#D81B60", rgb: [216, 27, 96] },
  seen: { letter: "س", name: "سين", colorName: "Sky Blue", hex: "#42A5F5", rgb: [66, 165, 245] },
  sheen: { letter: "ش", name: "شين", colorName: "Electric Cyan", hex: "#00E5FF", rgb: [0, 229, 255] },
  sad: { letter: "ص", name: "صاد", colorName: "Royal Blue", hex: "#1E3A8A", rgb: [30, 58, 138] },
  dad: { letter: "ض", name: "ضاد", colorName: "Indigo", hex: "#3F51B5", rgb: [63, 81, 181] },
  taa: { letter: "ط", name: "طاء", colorName: "Dark Bronze", hex: "#8D6E63", rgb: [141, 110, 99] },
  zaa: { letter: "ظ", name: "ظاء", colorName: "Brown Gold", hex: "#A1887F", rgb: [161, 136, 127] },
  ain: { letter: "ع", name: "عين", colorName: "Forest Green", hex: "#1B5E20", rgb: [27, 94, 32] },
  ghain: { letter: "غ", name: "غين", colorName: "Dark Purple", hex: "#6A1B9A", rgb: [106, 27, 154] },
  fa: { letter: "ف", name: "فاء", colorName: "Violet", hex: "#8E24AA", rgb: [142, 36, 170] },
  qaf: { letter: "ق", name: "قاف", colorName: "Midnight Blue", hex: "#0D47A1", rgb: [13, 71, 161] },
  kaf: { letter: "ك", name: "كاف", colorName: "Steel Gray", hex: "#607D8B", rgb: [96, 125, 139] },
  lam: { letter: "ل", name: "لام", colorName: "Silver", hex: "#B0BEC5", rgb: [176, 190, 197] },
  meem: { letter: "م", name: "ميم", colorName: "Emerald", hex: "#00C853", rgb: [0, 200, 83] },
  noon: { letter: "ن", name: "نون", colorName: "Teal", hex: "#00897B", rgb: [0, 137, 123] },
  ha2: { letter: "هـ", name: "هاء", colorName: "Soft Gray", hex: "#9E9E9E", rgb: [158, 158, 158] },
  waw: { letter: "و", name: "واو", colorName: "Ocean Blue", hex: "#1565C0", rgb: [21, 101, 192] },
  ya: { letter: "ي", name: "ياء", colorName: "Light Cyan", hex: "#80DEEA", rgb: [128, 222, 234] }
};

function getPhonemeColor(key) {
  return PHONEME_COLORS[key] || null;
}

function getAllPhonemeColors() {
  return PHONEME_COLORS;
}
function bindPhonemeToColor(phonemeKey) {
  const data = PHONEME_COLORS[phonemeKey];

  if (!data) {
    console.warn("❌ لا يوجد لون مرتبط بهذا الحرف:", phonemeKey);
    return null;
  }

  return {
    key: phonemeKey,
    letter: data.letter,
    name: data.name,
    colorName: data.colorName,
    hex: data.hex,
    rgb: data.rgb,
    perceptualIdentity: data.letter + " ↔ " + data.colorName
  };
}
console.log("🎨 المرجعية اللونية الإدراكية للحروف مسجلة");
