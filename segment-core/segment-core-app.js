// ================================
// segment-core-app.js
// منظم إدارة المقاطع — آمن / رقابي فقط
// لا يشغل أي محرك تلقائيًا
// ================================

console.log("🧩 segment-core-app.js جاهز — Safe Registry Mode");

window.runSegmentCoreApp = function () {
  const index =
    typeof window.getSegmentCoreIndex === "function"
      ? window.getSegmentCoreIndex()
      : null;

  const expectedFunctions = [
    // phoneme-boundary-engine.js
    "loadBoundaryIdentity",
    "sliceBoundaryBuffer",
    "monoFromBoundaryBuffer",
    "summarizeBoundaryWindow",
    "detectPayloadBoundaryByIdentity",

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

  const result = {
    department: "segment-core",
    mode: "safe-registry-only",
    status: "registered",
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note: "تم تسجيل إدارة المقاطع وفحص الدوال الحقيقية فقط دون تشغيل أي فصل أو دمج أو استخراج تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
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

  console.log("✅ segment-core safe report:", result);
  return result;
};
