// ================================
// training-core-index.js
// فهرس إدارة التدريب الصوتي
// تعريف فقط
// لا تحميل
// لا تشغيل
// ================================

console.log("🎙 training-core-index.js جاهز — Frozen Index Only");

window.NOORANIYA_TRAINING_CORE = {
  name: "training-core",

  role:
    "إدارة التدريب الصوتي والتسجيل وغرفة العمليات الصوتية وتجهيز العينات قبل دخولها إلى الإدراك والتحليل",

  mode: "frozen-index-only",

  files: [
    "training-core-index.js",

    "audio-lab.js",

    "training-recorder.js",

    "training-core-app.js"
  ],

  knowledge: [
    "audio-recording",
    "training-session",
    "training-step",
    "waveform-lab",
    "audio-regions",
    "recording-quality-preparation",
    "saved-training-audio"
  ],

  decisions: [
    "هل توجد حقيبة تدريب مفتوحة؟",
    "هل التسجيل بدأ؟",
    "هل التسجيل توقف؟",
    "هل تم حفظ التسجيل؟",
    "هل توجد عينة صوتية ظاهرة؟",
    "هل مناطق الصوت جاهزة للعرض؟",
    "هل التسجيل صالح للانتقال إلى الإدراك؟"
  ],

  principles: [
    "التدريب يجهز المادة الخام ولا يحكم الهوية",
    "التسجيل لا يصبح معرفة حتى يمر عبر الفحص",
    "الصوت الخام يخدم الإدراك",
    "واجهة التسجيل يجب أن تعطي إشارة بداية ونهاية واضحة",
    "لا تشغيل تلقائي داخل الفهرس"
  ]
};

window.getTrainingCoreIndex = function () {
  return window.NOORANIYA_TRAINING_CORE;
};
