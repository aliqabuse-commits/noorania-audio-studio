const letters = [
  { ar: "ا", key: "alif" },
  { ar: "ب", key: "ba" },
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
  })
};
