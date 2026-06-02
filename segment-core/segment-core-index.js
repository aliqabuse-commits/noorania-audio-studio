// ================================
// segment-core-index.js
// فهرس إدارة المقاطع الإدراكية
// تعريف فقط
// لا تحميل
// لا تشغيل
// ================================

console.log("🧩 segment-core-index.js جاهز — Frozen Index Only");

window.NOORANIYA_SEGMENT_CORE = {
  name: "segment-core",

  role:
    "إدارة الفصل والدمج واستخراج الحامل والمحمول ومناطق الاشتباك بين المقاطع",

  mode: "frozen-index-only",

  files: [
    "segment-core-index.js",

    "phoneme-boundary-engine.js",

    "segment-split-engine.js",

    "segment-merge-engine.js",

    "payload-extractor-engine.js",

    "payload-lock-engine.js",

    "payload-purifier-engine.js",

    "segment-core-app.js"
  ],

  knowledge: [

    "phoneme-boundary",

    "segment-splitting",

    "segment-merging",

    "payload-extraction",

    "payload-locking",

    "payload-purification"
  ],

  decisions: [

    "أين تبدأ هوية الحرف؟",

    "أين تنتهي هوية الحرف؟",

    "ما نقطة الفصل الإدراكية؟",

    "ما الحامل؟",

    "ما المحمول؟",

    "هل المحمول نقي؟",

    "هل الحامل نقي؟",

    "هل الفصل حافظ على الهوية؟",

    "هل الدمج حافظ على الهوية؟",

    "هل منطقة الاشتباك صالحة؟"
  ],

  principles: [

    "الفصل يخدم الهوية",

    "الدمج يخدم الهوية",

    "الحامل ليس المحمول",

    "الزمن يصف القرار ولا يحكمه",

    "منطقة الاشتباك جزء من المعرفة وليست ضجيجاً"
  ]
};

window.getSegmentCoreIndex = function () {
  return window.NOORANIYA_SEGMENT_CORE;
};
