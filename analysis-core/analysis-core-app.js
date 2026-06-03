// ================================
// analysis-core/analysis-core-app.js
// منظم إدارة التحليل
// تسجيل + فحص + بناء لوحة التحليل
// لا يشغل تحليلًا تلقائيًا
// ================================

console.log("📊 analysis-core-app.js جاهز — Safe Department App");


// ======================================
// 1) دستور منظم إدارة التحليل
// ======================================

const ANALYSIS_CORE_APP_CHARTER = {
  title: "دستور منظم التحليل",
  law:
    "التحليل الذي لا يغيّر قرارًا يبقى وصفًا لا معرفة.",
  rules: [
    "لا يشغل تحليلًا تلقائيًا.",
    "لا يحكم على الهوية وحده.",
    "لا يتجاوز إدارة الحرف أو المقاطع أو الذاكرة.",
    "يبني لوحة التحليل داخل الحاوية فقط.",
    "كل تحليل يعمل بطلب واضح من المستخدم.",
    "كل رقم تحليلي يجب أن يخدم قرارًا."
  ]
};


// ======================================
// 2) الدوال المتوقعة من إدارة التحليل
// ======================================

const ANALYSIS_CORE_EXPECTED_FUNCTIONS = [
  // burst-onset-engine.js
  "detectBurstOnset",
  "findBurstOnset",
  "analyzeBurstOnset",
  "renderBurstOnsetReport",
  "getBurstOnsetFeatures",

  // burst-signature-engine.js إن كان ضمن التحليل
  "runBurstSignatureEngine",
  "extractBurstSignature",
  "renderBurstSignatureReport"
];


// ======================================
// 3) تشغيل منظم التحليل الآمن
// ======================================

window.runAnalysisCoreApp = function () {
  const index =
    typeof window.getAnalysisCoreIndex === "function"
      ? window.getAnalysisCoreIndex()
      : null;

  const result = {
    department: "analysis-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: ANALYSIS_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل وفحص إدارة التحليل فقط دون تشغيل أي تحليل تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  ANALYSIS_CORE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
    const state =
      typeof window[fnName] === "function"
        ? "available"
        : "missing";

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

  console.log("✅ analysis-core safe report:", result);
  return result;
};


// ======================================
// 4) بناء لوحة إدارة التحليل
// ======================================

window.renderAnalysisCorePanel = function (containerId) {
  const container =
    document.getElementById(containerId || "analysis-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية إدارة التحليل:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report = window.runAnalysisCoreApp();

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة التحليل:</b> " +
    (report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " +
    report.summary.functionsAvailable +
    "<br><b>الدوال الناقصة:</b> " +
    report.summary.functionsMissing +
    "<br><span style='color:#94a3b8;'>التحليل دليل لا حاكم نهائي، ولا يعمل إلا بطلب واضح.</span>";

  container.appendChild(statusBox);

  addAnalysisButton(container, "📍 فحص بداية الانفجار", function () {
    if (typeof window.analyzeBurstOnset === "function") {
      window.analyzeBurstOnset();
      return;
    }

    if (typeof window.detectBurstOnset === "function") {
      window.detectBurstOnset();
      return;
    }

    alert("دوال فحص بداية الانفجار غير متاحة الآن.");
  });

  addAnalysisButton(container, "📊 عرض تقرير بداية الانفجار", function () {
    if (typeof window.renderBurstOnsetReport === "function") {
      window.renderBurstOnsetReport();
    } else {
      alert("دالة renderBurstOnsetReport غير متاحة الآن.");
    }
  });

  addAnalysisButton(container, "💥 فحص بصمة الانفجار", function () {
    if (typeof window.runBurstSignatureEngine === "function") {
      window.runBurstSignatureEngine();
    } else {
      alert("محرك بصمة الانفجار غير متاح الآن.");
    }
  });

  return report;
};


// ======================================
// 5) زر آمن للوحة التحليل
// ======================================

function addAnalysisButton(container, label, handler) {
  const btn = document.createElement("button");

  btn.innerText = label;

  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر التحليل:", err);
      alert("حدث خطأ أثناء تنفيذ الإجراء:\n" + err.message);
    }
  };

  container.appendChild(btn);
}
