// ================================
// training-core/training-core-app.js
// منظم إدارة التدريب والتسجيل
// تسجيل + فحص + بناء لوحة التدريب
// لا يبدأ تسجيلًا تلقائيًا
// ================================

console.log("🎙 training-core-app.js جاهز — Safe Department App");

const TRAINING_CORE_APP_CHARTER = {
  title: "دستور منظم التدريب",
  law:
    "التسجيل لا يصبح معرفة إدراكية حتى يكون واضح البداية والنهاية ومحفوظًا ومؤهلًا للفحص.",
  rules: [
    "لا يبدأ تسجيلًا تلقائيًا.",
    "لا يفتح موجة تلقائيًا.",
    "لا يشغل مختبرًا تلقائيًا.",
    "التدريب يجهز العينة ولا يحكم الهوية.",
    "كل تسجيل يبدأ بزر واضح من المستخدم."
  ]
};

const TRAINING_CORE_EXPECTED_FUNCTIONS = [
  "updateTrainingStatus",
  "showTrainingSuccessMessage",
  "hideTrainingSuccessMessage",
  "startPerceptualTraining",
  "showTrainingStep",
  "startTrainingStepRecording",
  "stopTrainingStepRecording",
  "saveTrainingAudio",
  "stopTrainingStream",
  "initWaveform",
  "rerunSmartAnalysis",
  "createSmartGenomeRegions",
  "toggleRecording",
  "startRecording",
  "stopRecording",
  "play",
  "playRaw",
  "buildGenome",
  "getCurrentAudioBlob",
  "clearCurrentAudioBlob",
  "hasWaveform",
  "hasGenomeRegions",
  "destroyWaveform"
];

window.runTrainingCoreApp = function () {
  const index =
    typeof window.getTrainingCoreIndex === "function"
      ? window.getTrainingCoreIndex()
      : null;

  const result = {
    department: "training-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: TRAINING_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل وفحص إدارة التدريب فقط دون تشغيل تسجيل أو موجة أو مختبر تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  TRAINING_CORE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
    const state =
      typeof window[fnName] === "function" ? "available" : "missing";

    result.functions[fnName] = state;

    if (state === "available") {
      result.summary.functionsAvailable++;
    } else {
      result.summary.functionsMissing++;
    }
  });

  if (typeof window.registerDepartment === "function" && index) {
    window.registerDepartment(index);
    result.registration = "registered";
  } else {
    result.registration = "missing";
  }

  console.log("✅ training-core safe report:", result);
  return result;
};

window.renderTrainingCorePanel = function (containerId) {
  const container = document.getElementById(containerId || "training-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية إدارة التدريب:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report = window.runTrainingCoreApp();

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة التدريب:</b> " +
    (report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " +
    report.summary.functionsAvailable +
    "<br><b>الدوال الناقصة:</b> " +
    report.summary.functionsMissing +
    "<br><span style='color:#94a3b8;'>لا يبدأ أي تسجيل إلا بزر واضح.</span>";

  container.appendChild(statusBox);

  addTrainingButton(container, "🎙 فتح صفحة تسجيل القوائم الصوتية", function () {
    if (typeof window.showNooraniyaView === "function") {
      window.showNooraniyaView("recordView");
    } else if (typeof window.showOnlyView === "function") {
      window.showOnlyView("recordView");
    }
  });

  addTrainingButton(container, "🧠 تدريب حقيبة إدراكية", function () {
    const key = prompt("اكتب مفتاح الحرف مثل ba أو qa:");
    if (!key) return;

    if (typeof window.startPerceptualTraining === "function") {
      window.startPerceptualTraining(key);
    } else {
      alert("دالة startPerceptualTraining غير متاحة.");
    }
  });

  return report;
};

function addTrainingButton(container, label, handler) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر التدريب:", err);
      alert("حدث خطأ:\n" + err.message);
    }
  };
  container.appendChild(btn);
}
