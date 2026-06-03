// ================================
// memory-core/memory-core-app.js
// منظم إدارة الذاكرة
// تسجيل + فحص + بناء لوحة الذاكرة
// لا يشغل تحليلًا تلقائيًا
// ================================

console.log("🧠 memory-core-app.js جاهز — Safe Department App");

const MEMORY_CORE_APP_CHARTER = {
  title: "دستور منظم الذاكرة",
  law:
    "الذاكرة التي لا تعود لتصحح القرار ليست ذاكرة إدراكية، بل أرشيف صامت.",
  rules: [
    "لا تشغيل تلقائي للتحليل الإحصائي.",
    "لا عرض تلقائي لمصفوفة الالتباس.",
    "الذاكرة تخدم القرار ولا تستبدله.",
    "كل زر في لوحة الذاكرة يعمل بطلب واضح."
  ]
};

const MEMORY_CORE_EXPECTED_FUNCTIONS = [
  "readConfusionLog",
  "buildCognitiveConfusionMatrix",
  "renderCognitiveConfusionMatrix",
  "renderTopConfusions",
  "collectKeysFromLog",
  "averageConfusion",
  "analyzeCognitiveSystem",
  "trainPhonemeMemory",
  "findMissingTrainingFiles",
  "buildPerceptualIdentity",
  "extractPerceptualFeatures",
  "detectMemoryActiveRange",
  "memorySpectrum",
  "memorySpectralCentroid",
  "memorySpectralSpread",
  "calcMemoryBurstiness",
  "calcPerceptualConfidence",
  "renderPhonemeMemoryReport",
  "getAudioPromiseForMemory",
  "getTrainingAudioFromLocalStorage",
  "dataUrlToBlobMemory",
  "decodeBlobToMonoForMemory",
  "showPhonemeTrainingLoading",
  "hidePhonemeTrainingLoading",
  "calcMemoryRms",
  "calcMemoryZcr",
  "averageMemory",
  "varianceMemory",
  "hannMemory",
  "nextPowerOfTwoMemory",
  "roundMemory"
];

window.runMemoryCoreApp = function () {
  const index =
    typeof window.getMemoryCoreIndex === "function"
      ? window.getMemoryCoreIndex()
      : null;

  const result = {
    department: "memory-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: MEMORY_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل وفحص إدارة الذاكرة فقط دون تشغيل تدريب أو تحليل تلقائي."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  MEMORY_CORE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
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

  console.log("✅ memory-core safe report:", result);
  return result;
};

window.renderMemoryCorePanel = function (containerId) {
  const container = document.getElementById(containerId || "memory-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية إدارة الذاكرة:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report = window.runMemoryCoreApp();

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة الذاكرة:</b> " +
    (report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " +
    report.summary.functionsAvailable +
    "<br><b>الدوال الناقصة:</b> " +
    report.summary.functionsMissing +
    "<br><span style='color:#94a3b8;'>الذاكرة لا تعمل تلقائيًا؛ كل إجراء بطلب واضح.</span>";

  container.appendChild(statusBox);

  addMemoryButton(container, "📊 تحليل النظام الإدراكي", function () {
    if (typeof window.analyzeCognitiveSystem === "function") {
      window.analyzeCognitiveSystem();
    } else {
      alert("دالة analyzeCognitiveSystem غير متاحة.");
    }
  });

  addMemoryButton(container, "🧩 عرض مصفوفة الالتباس", function () {
    if (typeof window.renderCognitiveConfusionMatrix === "function") {
      window.renderCognitiveConfusionMatrix();
    } else {
      alert("دالة renderCognitiveConfusionMatrix غير متاحة.");
    }
  });

  addMemoryButton(container, "🔥 عرض أعلى الالتباسات", function () {
    if (typeof window.renderTopConfusions === "function") {
      window.renderTopConfusions();
    } else {
      alert("دالة renderTopConfusions غير متاحة.");
    }
  });

  return report;
};

function addMemoryButton(container, label, handler) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر الذاكرة:", err);
      alert("حدث خطأ:\n" + err.message);
    }
  };
  container.appendChild(btn);
}
