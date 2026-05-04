const letters = [
  { ar: "ا", key: "alif" },
  { ar: "ب", key: "ba" },
  "حرف الباء الكامل": [
  { text: "بَ", file: "ba_fatha.wav" },
  { text: "بِ", file: "ba_kasra.wav" },
  { text: "بُ", file: "ba_damma.wav" },

  { text: "أَبْ", file: "ba_sukoon_after_fatha.wav" },
  { text: "إِبْ", file: "ba_sukoon_after_kasra.wav" },
  { text: "أُبْ", file: "ba_sukoon_after_damma.wav" },

  { text: "بً", file: "ba_tanween_fatha.wav" },
  { text: "بٍ", file: "ba_tanween_kasra.wav" },
  { text: "بٌ", file: "ba_tanween_damma.wav" },

  { text: "بَا", file: "ba_madd_alif.wav" },
  { text: "بِي", file: "ba_madd_yaa.wav" },
  { text: "بُو", file: "ba_madd_waw.wav" },

  { text: "بَوْ", file: "ba_leen_waw.wav" },
  { text: "بَيْ", file: "ba_leen_yaa.wav" }
]
  { ar: "ت", key: "ta" },
  { ar: "ث", key: "tha" },
  { ar: "ج", key: "jeem" },
  { ar: "ح", key: "ha" },
  { ar: "خ", key: "kha" },
  { ar: "د", key: "dal" },
  { ar: "ذ", key: "thal" },
  { ar: "ر", key: "ra" },
  { ar: "ز", key: "zay" },
  { ar: "س", key: "seen" },
  { ar: "ش", key: "sheen" },
  { ar: "ص", key: "sad" },
  { ar: "ض", key: "dad" },
  { ar: "ط", key: "taa" },
  { ar: "ظ", key: "zaa" },
  { ar: "ع", key: "ain" },
  { ar: "غ", key: "ghain" },
  { ar: "ف", key: "fa" },
  { ar: "ق", key: "qaf" },
  { ar: "ك", key: "kaf" },
  { ar: "ل", key: "lam" },
  { ar: "م", key: "meem" },
  { ar: "ن", key: "noon" },
  { ar: "ه", key: "ha2" },
  { ar: "و", key: "waw" },
  { ar: "ي", key: "ya" }
];

window.allUnits = {
  "أسماء الحروف الهجائية": letters.map(function (l) {
  return {
    text: l.ar,
    file: l.key + "_name.wav"
  };
}),
  "الحروف المتحركة": letters.flatMap(function (l) {
    return [
      { text: l.ar + "َ", file: l.key + "_fatha.wav" },
      { text: l.ar + "ِ", file: l.key + "_kasra.wav" },
      { text: l.ar + "ُ", file: l.key + "_damma.wav" }
    ];
  }),

  "الحروف الساكنة": letters.flatMap(function (l) {
    return [
      { text: "أَ" + l.ar + "ْ", file: l.key + "_sukoon_after_fatha.wav" },
      { text: "إِ" + l.ar + "ْ", file: l.key + "_sukoon_after_kasra.wav" },
      { text: "أُ" + l.ar + "ْ", file: l.key + "_sukoon_after_damma.wav" }
    ];
  }),
};
