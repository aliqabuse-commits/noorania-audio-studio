// ================================
// segment-core/segment-core-app.js
// منظم إدارة المقاطع
// تسجيل + فحص + بناء لوحة المقاطع
// لا يشغل فصلًا أو دمجًا تلقائيًا
// ================================

console.log("🧩 segment-core-app.js جاهز — Safe Department App");


// ======================================
// 1) دستور منظم إدارة المقاطع
// ======================================

const SEGMENT_CORE_APP_CHARTER = {
  title: "دستور منظم المقاطع",
  law:
    "الفصل والدمج لا يكونان إدراكيين حتى يراجعا هوية الحرف والتحليل والذاكرة وحدود الحامل والمحمول.",
  rules: [
    "لا يشغل فصلًا تلقائيًا.",
    "لا يشغل دمجًا تلقائيًا.",
    "لا يستخرج محمولًا تلقائيًا.",
    "لا يفتح صفحة بنفسه.",
    "يبني لوحة المقاطع داخل الحاوية فقط.",
    "كل فصل أو دمج يجب أن يكون بطلب واضح.",
    "لا قص بلا قرار إدراكي."
  ]
};


// ======================================
// 2) الدوال المتوقعة من إدارة المقاطع
// ======================================

const SEGMENT_CORE_EXPECTED_FUNCTIONS = [
  // phoneme-boundary-engine.js
  "loadBoundaryIdentity",
  "sliceBoundaryBuffer",
  "monoFromBoundaryBuffer",
  "summarizeBoundaryWindow",
  "detectPayloadBoundaryByIdentity",

  // segment-split-engine.js
  "runSegmentSplitEngine",
  "splitSegment",
  "renderSegmentSplitReport",

  // segment-merge-engine.js
  "runSegmentMergeEngine",
  "mergeSegment",
  "renderSegmentMergeReport",

  // payload-extractor-engine.js
  "runPayloadExtractorEngine",
  "getVisibleAudioBlobForPayload",
  "extractTruePayload",
  "scoreFrameAgainstPureCore",
  "payloadBandPower",
  "showTruePayloadRegion",
  "removeOldTruePayloadRegion",
  "renderTruePayloadReport",
  "showPayloadLoading",
  "hidePayloadLoading",
  "averagePayload",
  "roundPayload",

  // payload-lock-engine.js
  "runPayloadLockEngine",
  "getVisibleAudioBlobForPayloadLock",
  "lockTruePayload",
  "scorePayloadLockAgainstCore",
  "payloadLockBandPower",
  "showPayloadLockRegion",
  "removeOldPayloadLockRegion",
  "renderPayloadLockReport",
  "showPayloadLockLoading",
  "hidePayloadLockLoading",
  "averagePayloadLock",
  "roundPayloadLock",

  // payload-purifier-engine.js
  "runPayloadPurifierEngine",
  "getVisibleAudioBlobForPurifier",
  "purifyLockedPayload",
  "scorePurifierCore",
  "scoreOutsiderEnergy",
  "purifierBandPower",
  "showPayloadPurifierRegion",
  "removeOldPayloadPurifierRegion",
  "renderPayloadPurifierReport",
  "showPayloadPurifierLoading",
  "hidePayloadPurifierLoading",
  "averagePayloadPurifier",
  "roundPayloadPurifier"
];


// ======================================
// 3) تشغيل منظم المقاطع الآمن
// ======================================

window.runSegmentCoreApp = function () {
  const index =
    typeof window.getSegmentCoreIndex === "function"
      ? window.getSegmentCoreIndex()
      : null;

  const result = {
    department: "segment-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: SEGMENT_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل وفحص إدارة المقاطع فقط دون تشغيل أي فصل أو دمج أو استخراج تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  SEGMENT_CORE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
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

  console.log("✅ segment-core safe report:", result);
  return result;
};


// ======================================
// 4) بناء لوحة إدارة المقاطع
// ======================================

window.renderSegmentCorePanel = function (containerId) {
  const container =
    document.getElementById(containerId || "segment-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية إدارة المقاطع:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report = window.runSegmentCoreApp();

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة المقاطع:</b> " +
    (report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " +
    report.summary.functionsAvailable +
    "<br><b>الدوال الناقصة:</b> " +
    report.summary.functionsMissing +
    "<br><span style='color:#94a3b8;'>لا فصل ولا دمج ولا استخراج إلا بزر واضح.</span>";

  container.appendChild(statusBox);

  addSegmentButton(container, "✂️ فحص حدود المحمول بالهوية", function () {
    if (typeof window.detectPayloadBoundaryByIdentity === "function") {
      window.detectPayloadBoundaryByIdentity();
    } else {
      alert("دالة detectPayloadBoundaryByIdentity غير متاحة الآن.");
    }
  });

  addSegmentButton(container, "🧪 استخراج المحمول الحقيقي", function () {
    if (typeof window.runPayloadExtractorEngine === "function") {
      window.runPayloadExtractorEngine();
    } else {
      alert("محرك استخراج المحمول غير متاح الآن.");
    }
  });

  addSegmentButton(container, "🔒 قفل المحمول", function () {
    if (typeof window.runPayloadLockEngine === "function") {
      window.runPayloadLockEngine();
    } else {
      alert("محرك قفل المحمول غير متاح الآن.");
    }
  });

  addSegmentButton(container, "🧼 تنقية المحمول", function () {
    if (typeof window.runPayloadPurifierEngine === "function") {
      window.runPayloadPurifierEngine();
    } else {
      alert("محرك تنقية المحمول غير متاح الآن.");
    }
  });

  addSegmentButton(container, "🧩 مختبر الفصل والدمج", function () {
    if (typeof window.showNooraniyaView === "function") {
      window.showNooraniyaView("mergeSplitView");
    } else if (typeof window.openView === "function") {
      window.openView("mergeSplitView");
    }
  });

  return report;
};


// ======================================
// 5) زر آمن للوحة المقاطع
// ======================================

function addSegmentButton(container, label, handler) {
  const btn = document.createElement("button");

  btn.innerText = label;

  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر المقاطع:", err);
      alert("حدث خطأ أثناء تنفيذ الإجراء:\n" + err.message);
    }
  };

  container.appendChild(btn);
}
