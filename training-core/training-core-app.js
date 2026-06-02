// ================================
// training-core-app.js
// منظم إدارة التدريب الصوتي — آمن / رقابي فقط
// لا يبدأ تسجيلًا
// لا يشغل موجة
// لا يفتح مختبرًا
// ================================

console.log("🎙 training-core-app.js جاهز — Safe Registry Mode");

window.runTrainingCoreApp = function () {
  const index =
    typeof window.getTrainingCoreIndex === "function"
      ? window.getTrainingCoreIndex()
      : null;

  const expectedFunctions = [
    // training-recorder.js
    "updateTrainingStatus",
    "showTrainingSuccessMessage",
    "hideTrainingSuccessMessage",
    "startPerceptualTraining",
    "showTrainingStep",
    "startTrainingStepRecording",
    "stopTrainingStepRecording",
    "saveTrainingAudio",
    "stopTrainingStream",

    // audio-lab.js
    "initWaveform",
    "rerunSmartAnalysis",
    "createSmartGenomeRegions",
    "smoothEnergy",
    "average",
    "findFirstAbove",
    "findLastAbove",
    "createFallbackGenomeRegions",
    "addGenomeRegion",
    "getGenomeRegionsMap",
    "clamp",
    "formatTime",
    "formatRange",
    "updateGenomeDisplay",
    "setText",
    "toggleRecording",
    "startRecording",
    "stopRecording",
    "play",
    "playRaw",
    "playRegion",
    "playStrictRange",
    "stopRegionTimer",
    "playPayloadOnly",
    "playPurifiedPayload",
    "decodeBlobToMonoForPlayback",
    "zoomInWave",
    "zoomOutWave",
    "zoomResetWave",
    "buildGenome",
    "cleanRegion",
    "round",
    "getCurrentAudioBlob",
    "clearCurrentAudioBlob",
    "hasWaveform",
    "hasGenomeRegions",
    "destroyWaveform"
  ];

  const result = {
    department: "training-core",
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
    note:
      "تم تسجيل إدارة التدريب وفحص الدوال الحقيقية فقط دون تشغيل تسجيل أو موجة أو مختبر تلقائيًا."
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

  console.log("✅ training-core safe report:", result);
  return result;
};
