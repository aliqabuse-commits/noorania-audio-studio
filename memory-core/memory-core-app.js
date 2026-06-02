// ================================
// memory-core-app.js
// منظم إدارة الذاكرة — آمن / رقابي فقط
// لا يشغل أي محرك تلقائيًا
// ================================

console.log("🧠 memory-core-app.js جاهز — Safe Registry Mode");

window.runMemoryCoreApp = function () {
  const index =
    typeof window.getMemoryCoreIndex === "function"
      ? window.getMemoryCoreIndex()
      : null;

  const expectedFunctions = [
    // cognitive-confusion-matrix.js
    "readConfusionLog",
    "buildCognitiveConfusionMatrix",
    "renderCognitiveConfusionMatrix",
    "renderTopConfusions",
    "collectKeysFromLog",
    "averageConfusion",

    // phoneme-memory-trainer.js
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

  const result = {
    department: "memory-core",
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
    note: "تم تسجيل إدارة الذاكرة وفحص الدوال الحقيقية فقط دون تشغيل تدريب أو تحليل تلقائي."
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

  console.log("✅ memory-core safe report:", result);
  return result;
};
