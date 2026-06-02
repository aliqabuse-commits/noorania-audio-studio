// ================================
// operation-labs-app.js
// منظم غرفة التجارب الإدراكية — آمن / رقابي فقط
// لا يشغل أي مختبر تلقائيًا
// لا يفتح أي واجهة تلقائيًا
// لا يحمّل ملفات تلقائيًا
// ================================

console.log("🧪 operation-labs-app.js جاهز — Safe Registry Mode");

window.runOperationLabsApp = function () {
  const index =
    typeof window.getOperationLabsIndex === "function"
      ? window.getOperationLabsIndex()
      : null;

  const expectedFunctions = [
    // phoneme-merge-split-engine.js
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

    // weighted-join-zone.js
    "openWeightedJoinZoneView",
    "closeWeightedJoinZoneView",
    "renderWeightedJoinZoneLab",
    "wjzFetchSegment",
    "wjzRecordSegment",
    "wjzSplitSegment",
    "wjzMerge",
    "wjzPlay"
  ];

  const result = {
    department: "operation-labs",
    mode: "safe-registry-only",
    status: "registered",
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
    note: "تم تسجيل غرفة التجارب وفحص الدوال الحقيقية فقط دون فتح أو تشغيل أو تحميل أي مختبر تلقائيًا."
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
        status: lab.status || "registered"
      };
      result.summary.labsRegistered++;
    });
  }

  expectedFunctions.forEach(function (fnName) {
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

  console.log("✅ operation-labs safe report:", result);
  return result;
};
