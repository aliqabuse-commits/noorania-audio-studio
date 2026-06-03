// ================================
// training-core/training-core-index.js
// فهرس إدارة التدريب والتسجيل
// تعريف + تحميل ملفات الإدارة فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runTrainingCoreApp تلقائيًا
// ================================

console.log("🎙 training-core-index.js جاهز — Safe Department Index");

window.NOORANIYA_TRAINING_CORE = {
  name: "training-core",
  mode: "safe-department-index",

  charter: {
    title: "دستور إدارة التدريب والتسجيل",
    law:
      "التسجيل لا يصبح معرفة إدراكية حتى يكون واضح البداية والنهاية ومحفوظًا ومؤهلًا للفحص."
  },

  role:
    "إدارة التسجيل والتدريب وتجهيز العينات الصوتية قبل دخولها إلى الإدراك والتحليل.",

  files: [
    "training-core/audio-lab.js",
    "training-core/training-recorder.js",
    "training-core/training-core-app.js"
  ],

  knowledge: [
    "audio-recording",
    "training-session",
    "waveform-view",
    "recording-status",
    "saved-training-audio",
    "training-sample-preparation"
  ],

  decisions: [
    "هل التسجيل بدأ بوضوح؟",
    "هل التسجيل انتهى بوضوح؟",
    "هل تم الحفظ؟",
    "هل العينة صالحة للانتقال إلى الفحص؟",
    "هل توجد عينة ظاهرة؟",
    "هل التدريب جهز المادة الخام دون أن يحكم الهوية؟"
  ],

  serves: [
    "phoneme-core",
    "analysis-core",
    "memory-core",
    "segment-core",
    "governance-core"
  ],

  principles: [
    "التدريب يجهز ولا يحكم الهوية.",
    "لا تسجيل بلا إشارة بداية.",
    "لا تسجيل بلا إشارة نهاية.",
    "لا حفظ بلا تأكيد.",
    "الصوت الخام يخدم الإدراك ولا يستبدله.",
    "index الفرعي يعرف ويحمّل فقط.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadTrainingCoreScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="' + src + '"]')) {
      resolve({
        src: src,
        status: "already-loaded"
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      resolve({
        src: src,
        status: "loaded"
      });
    };

    script.onerror = function () {
      reject(new Error("فشل تحميل ملف إدارة التدريب: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadTrainingCore = async function () {
  const report = {
    department: "training-core",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة التدريب فقط دون فتح واجهة أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_TRAINING_CORE.files) {
    try {
      const result = await loadTrainingCoreScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🎙 تقرير تحميل إدارة التدريب:", report);
  return report;
};

window.getTrainingCoreIndex = function () {
  return window.NOORANIYA_TRAINING_CORE;
};
