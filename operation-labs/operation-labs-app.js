// ================================
// operation-labs/operation-labs-app.js
// منظم غرفة التجارب الإدراكية
// تسجيل + فحص + بناء لوحة المختبرات
// لا يشغل أي مختبر تلقائيًا
// لا يفتح أي مختبر تلقائيًا
// ================================

console.log("🧪 operation-labs-app.js جاهز — Safe Department App");

const OPERATION_LABS_APP_CHARTER = {
  title: "دستور منظم المختبرات",
  law:
    "المختبر يختبر ولا يعتمد؛ ولا تنتقل نتيجة مختبر إلى معرفة رسمية إلا إذا أثبتت أثرًا وخدمت قرارًا.",
  rules: [
    "لا تشغيل تلقائي لأي مختبر.",
    "لا فتح تلقائي لأي واجهة.",
    "لا اعتماد لنتيجة مختبر من داخل المختبر نفسه.",
    "المنظم الفرعي يبني أزرار المختبرات داخل الحاوية فقط.",
    "المنظم العام هو المسؤول عن فتح صفحة المختبرات."
  ]
};

const OPERATION_LABS_EXPECTED_FUNCTIONS = [
  "fetchExperimentSegment",
  "recordExperimentSegment",
  "splitExperimentSegment",
  "experimentMerge",
  "playExperimentAudio",
  "normalizeArabic",
  "resolveDynamicKeys",
  "findAuthorizedFileInPacks",
  "searchAudioBlobSafely",
  "resolveAudioBlobForText",
  "saveTempAudioToStorage",
  "recordMergeSample",
  "playBlob",
  "blobToAudioBuffer",
  "audioBufferToWavBlob",
  "sliceAudioBuffer",
  "concatAudioBuffers",
  "overlapAddAudioBuffers",
  "extractCognitiveJoinUnits",
  "fetchSegmentSafely",
  "fetchDynamicBaseSegment",
  "fetchDynamicCarrierReplacement",
  "recordBaseSegment",
  "recordCarrierReplacement",
  "splitBaseSegment",
  "mergeReplacementWithPayload",
  "playMergedSegment",
  "playBaseSegment",
  "playReplacementSegment",
  "playPayloadSegment",
  "openWeightedJoinZoneView",
  "closeWeightedJoinZoneView",
  "renderWeightedJoinZoneLab",
  "wjzFetchSegment",
  "wjzRecordSegment",
  "wjzSplitSegment",
  "wjzMerge",
  "wjzPlay"
];

window.runOperationLabsApp = function () {
  const index =
    typeof window.getOperationLabsIndex === "function"
      ? window.getOperationLabsIndex()
      : null;

  const result = {
    department: "operation-labs",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: OPERATION_LABS_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    labs: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      labsRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل غرفة التجارب وفحصها فقط دون فتح أو تشغيل أي مختبر تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  if (index && Array.isArray(index.labs)) {
    index.labs.forEach(function (lab) {
      result.labs[lab.id] = {
        title: lab.title,
        file: lab.file,
        status: lab.status || "registered",
        openFunction: lab.openFunction || null
      };
      result.summary.labsRegistered++;
    });
  }

  OPERATION_LABS_EXPECTED_FUNCTIONS.forEach(function (fnName) {
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

  console.log("✅ operation-labs safe report:", result);
  return result;
};

window.renderOperationLabsPanel = function (containerId) {
  const container = document.getElementById(containerId || "operation-labs-grid");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية المختبرات:", containerId);
    return null;
  }

  container.innerHTML = "";

  const index =
    typeof window.getOperationLabsIndex === "function"
      ? window.getOperationLabsIndex()
      : null;

  const report =
    typeof window.runOperationLabsApp === "function"
      ? window.runOperationLabsApp()
      : null;

  const labs =
    index && Array.isArray(index.labs)
      ? index.labs
      : [];

  const statusCard = document.createElement("div");
  statusCard.style.background = "#08111f";
  statusCard.style.border = "1px solid #334155";
  statusCard.style.borderRadius = "14px";
  statusCard.style.padding = "16px";
  statusCard.style.color = "#e5e7eb";
  statusCard.style.gridColumn = "1 / -1";
  statusCard.style.lineHeight = "1.8";

  statusCard.innerHTML =
    "<b>إدارة المختبرات:</b> " +
    (report && report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>المختبرات المسجلة:</b> " +
    (report ? report.summary.labsRegistered : 0) +
    "<br><b>الدوال المتاحة:</b> " +
    (report ? report.summary.functionsAvailable : 0) +
    "<br><b>الدوال الناقصة:</b> " +
    (report ? report.summary.functionsMissing : 0) +
    "<br><span style='color:#94a3b8;'>لا يتم فتح أو تشغيل أي مختبر إلا بزر واضح.</span>";

  container.appendChild(statusCard);

  labs.forEach(function (lab) {
    const card = document.createElement("div");

    card.style.background = "#08111f";
    card.style.border = "1px solid #334155";
    card.style.borderRadius = "14px";
    card.style.padding = "16px";
    card.style.color = "#e5e7eb";

    card.innerHTML =
      "<h3 style='margin-top:0;color:#a3e635;'>" +
      (lab.title || lab.id) +
      "</h3>" +
      "<p style='color:#cbd5e1;line-height:1.8;'>" +
      (lab.status || "experimental") +
      "</p>" +
      "<p style='font-size:13px;color:#94a3b8;'>" +
      (lab.file || "") +
      "</p>";

    const btn = document.createElement("button");
    btn.innerText = "فتح المختبر";
    btn.style.width = "100%";

    btn.onclick = function () {
      const fnName =
        lab.openFunction ||
        (
          lab.id === "merge-split"
            ? "openMergeSplitView"
            : "openWeightedJoinZoneView"
        );

      if (typeof window[fnName] === "function") {
        window[fnName]();
      } else {
        alert("دالة فتح المختبر غير متاحة: " + fnName);
      }
    };

    card.appendChild(btn);
    container.appendChild(card);
  });

  return report;
};
