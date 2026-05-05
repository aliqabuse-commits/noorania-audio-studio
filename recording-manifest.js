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

]
const nooraniLetterNames = [
  { text: "ألف", file: "alif_noorani_name.wav" },
  { text: "باء", file: "ba_noorani_name.wav" },
  { text: "تاء", file: "ta_noorani_name.wav" }
];
function generateHarakat(l) {
  return [
    { text: l.ar + "َ", file: l.key + "_fatha.wav" },
    { text: l.ar + "ِ", file: l.key + "_kasra.wav" },
    { text: l.ar + "ُ", file: l.key + "_damma.wav" }
  ];
}
window.allUnits = {
  "أسماء الحروف الهجائية": letters.map(function (l) {
    return {
      text: l.ar,
      file: l.key + "_name.wav"
    };
  }),
"أسماء الحروف النورانية": nooraniLetterNames,
  "الحروف المتحركة": letters.flatMap(generateHarakat),

  "الحروف الساكنة": letters.flatMap(function (l) {
    return [
      { text: "أَ" + l.ar + "ْ", file: l.key + "_sukoon_after_fatha.wav" },
      { text: "إِ" + l.ar + "ْ", file: l.key + "_sukoon_after_kasra.wav" },
      { text: "أُ" + l.ar + "ْ", file: l.key + "_sukoon_after_damma.wav" }
    ];
  }),

  "التنوين": letters.flatMap(function (l) {
    return [
      { text: l.ar + "ً", file: l.key + "_tanween_fatha.wav" },
      { text: l.ar + "ٍ", file: l.key + "_tanween_kasra.wav" },
      { text: l.ar + "ٌ", file: l.key + "_tanween_damma.wav" }
    ];
  }),

  "المد واللين": letters.flatMap(function (l) {
    return [
      { text: l.ar + "َا", file: l.key + "_madd_alif.wav" },
      { text: l.ar + "ِي", file: l.key + "_madd_ya.wav" },
      { text: l.ar + "ُو", file: l.key + "_madd_waw.wav" },
      { text: l.ar + "َيْ", file: l.key + "_leen_ya.wav" },
      { text: l.ar + "َوْ", file: l.key + "_leen_waw.wav" }
    ];
  })
};
