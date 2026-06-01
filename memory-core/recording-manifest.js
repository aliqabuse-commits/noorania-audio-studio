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

function getNooraniName(key) {
  const map = {
    alif: "ألف",
    ba: "باء",
    ta: "تاء",
    tha: "ثاء",
    jeem: "جيم",
    ha: "حاء",
    kha: "خاء",
    dal: "دال",
    thal: "ذال",
    ra: "راء",
    zay: "زاي",
    seen: "سين",
    sheen: "شين",
    sad: "صاد",
    dad: "ضاد",
    taa: "طاء",
    zaa: "ظاء",
    ain: "عين",
    ghain: "غين",
    fa: "فاء",
    qaf: "قاف",
    kaf: "كاف",
    lam: "لام",
    meem: "ميم",
    noon: "نون",
    ha2: "هاء",
    waw: "واو",
    ya: "ياء"
  };

  return map[key] || key;
}

const nooraniLetterNames = letters.map(function (l) {
  return {
    text: getNooraniName(l.key),
    file: l.key + "_noorani_name.wav"
  };
});

function generateHarakat(l) {
  return [
    { text: l.ar + "َ", file: l.key + "_fatha.wav" },
    { text: l.ar + "ِ", file: l.key + "_kasra.wav" },
    { text: l.ar + "ُ", file: l.key + "_damma.wav" }
  ];
}

// حقيبة الباء الساكنة — كاشف المحمول المشترك
const baCommonPayloadBag = [
  { text: "أَبْ", file: "ab_sukoon.wav" },
  { text: "قَبْ", file: "qab_sukoon.wav" },
  { text: "فَبْ", file: "fab_sukoon.wav" },
  { text: "صَبْ", file: "sab_sukoon.wav" },
  { text: "حابْ", file: "haab_sukoon.wav" }
];

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

  "حقيبة الباء الساكنة": baCommonPayloadBag,

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
  }),

  "الأصوات النورانية": [
    { text: "فتحٌ", file: "fatha_name.wav" },
    { text: "كسرٌ", file: "kasra_name.wav" },
    { text: "ضمٌ", file: "damma_name.wav" },
    { text: "سكونٌ", file: "sukoon_name.wav" },

    { text: "ألف صغير", file: "small_alif_name.wav" },
    { text: "واو صغير", file: "small_waw_name.wav" },
    { text: "ياء صغير", file: "small_ya_name.wav" },

    { text: "شد", file: "shadda_name.wav" },

    { text: "فتحتان", file: "tanween_fatha_name.wav" },
    { text: "كسرتان", file: "tanween_kasra_name.wav" },
    { text: "ضمتان", file: "tanween_damma_name.wav" },

    { text: "مد", file: "madd_name.wav" },
    { text: "لين", file: "leen_name.wav" }
  ]
};
