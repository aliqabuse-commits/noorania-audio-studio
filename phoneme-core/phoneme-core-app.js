// ================================
// phoneme-core-app.js
// منظم إدارة الحرف — آمن / رقابي فقط
// لا يشغل أي محرك تلقائيًا
// ================================

console.log("🔤 phoneme-core-app.js جاهز — Safe Registry Mode");

window.runPhonemeCoreApp = function () {
  const index =
    typeof window.getPhonemeCoreIndex === "function"
      ? window.getPhonemeCoreIndex()
      : null;

  const expectedFunctions = [
    // common-payload-finder.js
    "runBaCommonPayloadTest",
    "findCommonPayloadForKeys",
    "getAudioPromise",
    "decodeBlobToMono",
    "extractFeatures",
    "calcRms",
    "calcZeroCrossingRate",
    "goertzelPower",
    "normalizeVector",
    "detectActiveRange",
    "findBestSharedEnding",
    "averagePairwiseDtw",
    "dtwDistance",
    "vectorDistance",
    "renderCommonPayloadReport",
    "showCommonPayloadForCurrentFile",
    "removeOldCommonPayloadRegion",
    "showCommonPayloadText",

    // ba-identity-match-engine.js
    "runBaaIdentityMatchEngine",
    "getVisibleAudioBlob",
    "matchBaaIdentity",
    "extractLikelyBurstSegment",
    "compareWithCommonCore",
    "bandPower",
    "compareCentroid",
    "renderBaaMatchReport",
    "showMatchLoading",
    "hideMatchLoading",
    "waitMatchUI",

    // ba-final-identity-engine.js
    "runBaFinalIdentityEngine",
    "renderBaFinalIdentityReport",

    // core-purifier-engine.js
    "runCorePurifierEngine",
    "purifyCoreBands",
    "renderPureCoreReport",
    "average",
    "round",

    // phoneme-cognitive-engine.js
    "getStoredAudio",
    "buildPhonemeCognitiveIdentity",
    "getCognitiveAudioBlob",
    "cognitiveDataUrlToBlob",
    "decodeCognitiveBlob",
    "buildCognitiveTimeline",
    "detectCognitivePhases",
    "summarizeCognitiveTimeline",
    "buildCognitiveGenome",
    "renderCognitiveReport",
    "renderTimelineChart",
    "renderMultiLayerTimelineChart",
    "drawLayer",
    "drawPhasesOverlay",
    "drawPhaseZone",
    "xOf",
    "cognitiveRms",
    "cognitiveZcr",
    "cognitiveSpectrum",
    "hannCognitive",
    "nextPowerOfTwoCognitive",
    "cognitiveSpectralCentroid",
    "cognitiveSpectralSpread",
    "avgCognitive",
    "varCognitive",
    "statCognitive",
    "movementCognitive",
    "roundCognitive",

    // phoneme-color-memory.js
    "createPhonemeColorMemory",
    "buildPhonemeColorMemoryConfigs",
    "getAllPhonemeMemories",
    "getPhonemeMemory",

    // phoneme-colors.js
    "normalizePhonemeColorKey",
    "bindPhonemeToColor",
    "getPhonemeColor",
    "getAllPhonemeColors",

    // phoneme-identity-engine.js
    "runPhonemeIdentityEngine",
    "buildPhonemeIdentity",
    "extractIdentityFeatures",
    "detectIdentityActiveRange",
    "detectBurstPeak",
    "buildIdentitySignature",
    "calcTransitionSimilarity",
    "calcSpectralSimilarity",
    "calcEnergySimilarity",
    "normalizeScore",
    "variance",
    "renderIdentityReport",

    // phoneme-match-engine.js
    "getAvailablePhonemeKeysForMatch",
    "startPhonemeMatchTest",
    "loadCognitiveIdentity",
    "recordMatchSample",
    "compareSummaryWithCognitiveGenome",
    "weightedNormalizedDistance",
    "classifySeparationDecision",
    "askActualSpokenKey",
    "saveCognitiveMatchResult",
    "renderMatchResultsLog",
    "clearCognitiveMatchResultsLog",

    // phoneme-timeline-engine.js
    "buildPhonemeTimeline",
    "splitSamplesIntoFrames",
    "calculateFrameEnergy",
    "calculateFrameZCR",
    "calculateFrameCentroid",
    "calculateFrameSpread",
    "detectTimelineOnset",
    "detectTimelineBurst",
    "detectTimelineTransition",
    "detectTimelineSustain",
    "detectTimelineRelease",
    "buildOrderedPhonemeTimeline",
    "getAudioBlobSafely",
    "buildTimelineGenomeForPhoneme",
    "renderTimelineGenomeReport",

    // phoneme-signal-validator.js
    "validatePhonemeSignal",
    "clamp01",
    "calculateSignalEnergy",
    "calculateSignalPeak",
    "getActiveSignalRegion",
    "calculateSilenceRatio",
    "calculateSignalClarity",
    "estimateNoiseLevel",
    "buildSignalValidationReport",
    "testSignalQualityForPhoneme"
  ];

  const result = {
    department: "phoneme-core",
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
    note: "تم تسجيل إدارة الحرف وفحص الدوال الحقيقية فقط دون تشغيل أي محرك تلقائيًا."
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

  console.log("✅ phoneme-core safe report:", result);
  return result;
};
