// ================================
// analysis-core-index.js
// فهرس إدارة التحليل الصوتي — تعريف حوكمي فقط
// لا تحميل
// لا تشغيل
// ================================

console.log("📊 analysis-core-index.js جاهز — Sovereign Frozen Index");

window.NOORANIYA_ANALYSIS_CORE = {
  name: "analysis-core",
  mode: "frozen-index-only",

  charter: {
    title: "دستور إدارة التحليل",
    law:
      "التحليل الذي لا يغيّر قرارًا يبقى وصفًا لا معرفة.",
    rules: [
      "كل قياس صوتي يجب أن يخدم قرارًا أعلى.",
      "الطاقة و ZCR والطيف ليست غاية، بل أدلة.",
      "لا يجوز للتحليل أن يحكم وحده على الهوية.",
      "التحليل يخدم الحرف والمقطع والذاكرة ولا يستولي عليها.",
      "أي تقرير تحليلي لا ينتقل إلى قرار يبقى غير مكتمل."
    ]
  },

  role:
    "إدارة استخراج المؤشرات الصوتية التي تخدم قرارات الإدراك والفصل والمطابقة، دون أن تتحول إلى سلطة حكم مستقلة.",

  files: [
    "analysis-core-index.js",
    "burst-onset-engine.js",
    "burst-signature-engine.js",
    "analysis-core-app.js"
  ],

  knowledge: [
    "burst-onset",
    "burst-signature",
    "energy-features",
    "zcr-features",
    "spectral-indicators"
  ],

  decisions: [
    "هل توجد بداية انفجار واضحة؟",
    "هل الانفجار يدعم هوية الحرف؟",
    "هل المؤشر التحليلي يخدم المطابقة؟",
    "هل المؤشر التحليلي يخدم الفصل؟",
    "هل التقرير التحليلي له أثر في قرار؟"
  ],

  serves: [
    "phoneme-core",
    "segment-core",
    "memory-core",
    "training-core"
  ],

  principles: [
    "التحليل دليل لا حاكم نهائي.",
    "كل رقم يجب أن يخدم قرارًا.",
    "لا قيمة لتقرير لا يغيّر حكمًا.",
    "لا يجوز للتحليل أن يتجاوز الحرف أو المقطع أو الذاكرة.",
    "التحليل يخدم الإدراك ولا يستبدله."
  ]
};

window.getAnalysisCoreIndex = function () {
  return window.NOORANIYA_ANALYSIS_CORE;
};
