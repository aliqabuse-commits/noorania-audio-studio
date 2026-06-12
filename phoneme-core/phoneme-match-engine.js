// ================================
// phoneme-match-engine.js
// محرك تحديد هوية الحرف عبر سجلات العائلة الإدراكية
// لا جمع رقمي — لا strong/weak — لا rank مصطنع
// ================================

console.log("🎯 phoneme-match-engine.js جاهز — Perceptual Family Records");


// ======================================
// مفاتيح الحروف المتاحة للاختبار
// ======================================
function getAvailablePhonemeKeysForMatch() {
  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    return Object.keys(PHONEME_LETTER_DEFINITIONS);
  }

  return ["ba", "qaf"];
}


// ======================================
// اختبار تحديد هوية الحرف
// الرواصد تنتج أرقامها كما هي
// سجلات العائلة الإدراكية تقارن التشكيلات الرقمية
// ======================================
async function startPhonemeMatchTest(targetKey) {
  try {
    const identities = getAvailablePhonemeKeysForMatch();
    const availableIdentities = [];

    for (const key of identities) {
      const identity = loadCognitiveIdentity(key);
      if (identity) availableIdentities.push(identity);
    }

    if (!availableIdentities.length) {
      alert("لا توجد جينومات مركزية محفوظة.\n\nابنِ أولًا الجينومات المركزية للحروف.");
      return;
    }

    alert("سيبدأ اختبار تحديد هوية الحرف.\n\nسجّل الآن صوت الحرف.");

    const blob = await recordMatchSample();

    if (!blob) {
      alert("فشل تسجيل عينة الاختبار");
      return;
    }

    const decoded = await decodeCognitiveBlob(blob);
    const timeline = buildCognitiveTimeline(decoded.samples, decoded.sampleRate);
    const phases = detectCognitivePhases(timeline);
    const summary = summarizeCognitiveTimeline(timeline, phases);

    // مراحل العينة جزء من سجل العائلة الإدراكية الوافد
    summary.__phases = phases;

    const actual = askActualSpokenKey();

    if (!actual) {
      alert("لم يتم حفظ النتيجة لأن الحرف المنطوق لم يُحدد.");
      return;
    }

    const actualKey = actual.key;
    const sampleTimeline =
  typeof buildOrderedPhonemeTimeline === "function"
    ? buildOrderedPhonemeTimeline(decoded.samples, decoded.sampleRate)
    : null;

const sampleFamilyRecord = buildSampleFamilyRecord(summary, sampleTimeline);

    const results = availableIdentities.map(function (identity) {
      const familyContext = loadFamilyContextForMatch(identity.phonemeKey);
      const perceptualMemory = loadPerceptualMemoryForMatch(identity.phonemeKey);
      const timelineKnowledge = loadTimelineKnowledgeForMatch(identity.phonemeKey);

      const stateDecision =
        scoreIdentityBestState(summary, identity, perceptualMemory);

      const identityScore =
        compareIdentityMap(
          sampleFamilyRecord,
          identity,
          familyContext,
          perceptualMemory,
          timelineKnowledge,
          stateDecision
        );

      return {
        key: identity.phonemeKey,
        phoneme: identity.phoneme,
        label: identity.label,
        color: identity.color,

        // مراجع الرواصد الأصلية
        __identity: identity,
        __memory: perceptualMemory,
        __timeline: timelineKnowledge,
        __familyRecord: identityScore.storedRecord,

        matchedStateKey: stateDecision.stateKey,
        matchedStateText: stateDecision.stateText,
        matchedStateRole: stateDecision.stateRole,
        stateConfidence: stateDecision.confidence,
        stateMargin: stateDecision.stateMargin,
        stateScores: stateDecision.allStateScores,
        stateDebug: stateDecision.debug,

        genomeDistance: identityScore.parts.genome || 0,
        sealDistance: identityScore.parts.seal || 0,
        stateDistance: identityScore.state || 0,
        memoryDistance: identityScore.parts.memory || 0,
        timelineDistance: identityScore.parts.timeline || 0,
        familyDistance: identityScore.shapeMismatch,
        absenceDistance: identityScore.missing.length,

        identityScore,

        // ليس مجموعًا؛ هو أعلى اختلاف في تشكيلة سجل العائلة
        distance: identityScore.shapeMismatch
      };
    });

    results.sort(compareIdentityCandidates);

    // العائلة الإدراكية تفحص أول مرشحين وتستعمل الصفات الفارقة إذا وجدت
    applyPerceptualFamilyDecision(results, summary);

    results.sort(compareIdentityCandidates);

    const winner = results[0];
    const second = results[1] || null;

    const margin = second ? compareFamilyShapeMargin(winner, second) : 0;
    const decision = classifySeparationDecision(winner, second, margin);

    if (typeof window.recordDecisionTrace === "function") {
      window.recordDecisionTrace({
        decisionId: "identify-phoneme",
        decisionName: "تحديد هوية حرف",
        target: winner.key,
        invokedKnowledge: [
          "perceptual-family-records",
          "cognitive-genome",
          "spectral-seal",
          "perceptual-memory",
          "timeline-genome",
          "state-genome",
          "phoneme-family-map"
        ],
        influentialKnowledge: [
          "perceptual-family-records",
          "cognitive-genome",
          "spectral-seal",
          "perceptual-memory",
          "timeline-genome",
          "phoneme-family-map"
        ],
        result: decision.label,
        confidence: margin,
        notes:
          "تم تحديد الهوية بمقارنة تشكيلة سجلات العائلة الإدراكية، لا بجمع الأرقام ولا بتصنيف strong/weak."
      });
    }

    saveCognitiveMatchResult(
      targetKey,
      actualKey,
      winner,
      results,
      decision,
      margin
    );

    let report = "🎯 نتيجة اختبار هوية الحرف عبر سجلات العائلة الإدراكية\n\n";

    report += "زر الاختبار: " + targetKey + "\n";
    report += "المنطوق فعليًا: " + actual.text + "\n";

    report +=
      "العينة أقرب إلى: " +
      winner.label +
      " (" +
      winner.phoneme +
      ")\n\n";

    report +=
      "أقرب حالة داخل الحرف الفائز: " +
      (winner.matchedStateText || winner.matchedStateKey || "غير محددة") +
      "\n";

    report +=
      "ثقة تحديد الحركة بعد الهوية: " +
      safeFixed(winner.stateConfidence, 4) +
      "\n";

    report +=
      "هامش الحركة: " +
      safeFixed(winner.stateMargin, 4) +
      "\n\n";

    results.forEach(function (r, index) {
      const shape = r.identityScore?.familyShape || null;

      report +=
        (index + 1) +
        ") " +
        r.label +
        " (" +
        r.phoneme +
        ")" +
        " → family-shape = " +
        safeFixed(r.distance, 4) +
        "\n";

      report +=
        "   genome = " + safeFixed(r.genomeDistance, 4) +
        " | seal = " + safeFixed(r.sealDistance, 4) +
        " | state = " + safeFixed(r.stateDistance, 4) +
        " | memory = " + safeFixed(r.memoryDistance, 4) +
        " | timeline = " + safeFixed(r.timelineDistance, 4) +
        " | family = " + safeFixed(r.familyDistance, 4) +
        " | missing = " + r.absenceDistance +
        "\n";

      if (shape) {
        report +=
          "   سجل العائلة: الإحداثيات المقارنة = " +
          shape.comparedCount +
          " | أعلى اختلاف = " +
          safeFixed(shape.maxMismatch, 4) +
          " | المفقود = " +
          JSON.stringify(shape.missing) +
          "\n";

        report +=
          "   أكبر الفروقات: " +
          JSON.stringify(shape.details.slice(0, 5)) +
          "\n";
      }

      if (r.familyDecision) {
        report +=
          "   قرار الصفات الفارقة = " +
          (r.familyDecision.applied ? "applied" : "not-applied") +
          " | السبب = " +
          (r.familyDecision.note || r.familyDecision.reason || "غير محدد") +
          "\n";

        if (r.familyDecision.winnerKey) {
          report +=
            "   family-winner = " +
            r.familyDecision.winnerKey +
            "\n";
        }
      }

      report += "\n";
    });

    report += "هامش تشابه العائلة: " + safeFixed(margin, 4) + "\n";
    report += "قرار الهوية: " + decision.label + "\n\n";
    report += decision.note;

    alert(report);

    console.log("🎯 MATCH SAMPLE FAMILY RECORD:", sampleFamilyRecord);
    console.log("🎯 MATCH RESULTS:", results);

  } catch (err) {
    console.error("❌ فشل اختبار تحديد هوية الحرف", err);
    alert("فشل اختبار تحديد هوية الحرف:\n" + err.message);
  }
}


// ======================================
// تحميل هوية الحرف
// ======================================
function loadCognitiveIdentity(key) {
  try {
    const raw = localStorage.getItem(key + "_cognitive_identity");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ فشل تحميل الجينوم:", key, err);
    return null;
  }
}


// ======================================
// تحميل سياق العائلة الإدراكية
// ======================================
function loadFamilyContextForMatch(key) {
  if (typeof buildFamilyDecisionContext === "function") {
    return buildFamilyDecisionContext(key);
  }
  return null;
}


// ======================================
// تحليل الحرف المنطوق
// ======================================
function resolveArabicSpokenInput(input) {
  const text = String(input || "").trim();
  const cleanLetter = text.replace(/[\u064B-\u065F\u0640]/g, "").trim();

  let key = null;

  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    Object.keys(PHONEME_LETTER_DEFINITIONS).forEach(function (itemKey) {
      const def = PHONEME_LETTER_DEFINITIONS[itemKey];
      if (!def) return;

      const letter =
        String(def.letter || "")
          .replace(/[\u064B-\u065F\u0640]/g, "")
          .trim();

      if (letter === cleanLetter) key = itemKey;
    });
  }

  let state = null;

  if (text.includes("َ")) state = "fatha";
  if (text.includes("ِ")) state = "kasra";
  if (text.includes("ُ")) state = "damma";

  return { key, state, text };
}


// ======================================
// تسجيل عينة الاختبار
// ======================================
async function recordMatchSample() {
  return new Promise(async function (resolve) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        resolve(
          new Blob(chunks, {
            type: recorder.mimeType || "audio/webm"
          })
        );
      };

      recorder.start();

      alert("🎙 بدأ التسجيل الآن.\n\nسيتم الإيقاف تلقائيًا بعد ثانيتين.");

      setTimeout(function () {
        if (recorder.state !== "inactive") recorder.stop();
      }, 2000);

    } catch (err) {
      console.error("❌ فشل التسجيل", err);
      resolve(null);
    }
  });
}


// ======================================
// بناء سجل العائلة الإدراكية للعينة الوافدة
// هذا السجل لا يحكم؛ بل يحمل التشكيلة الرقمية كما رصدتها الأدوات
// ======================================
function buildSampleFamilyRecord(summary, timeline) {
  const coordinates = {
    energy: summary.meanEnergy,
    centroid: summary.meanCentroid,
    spread: summary.meanSpread,
    zcr: summary.meanZcr,
    duration: summary.duration,

    burstEnergy: summary.burstEnergy,
    burstCentroid: summary.burstCentroid,
    burstSpread: summary.burstSpread,

    energyMovement: summary.energyMovement,
    spectralMovement: summary.spectralMovement,
    phaseQuality: summary.phaseQuality,

    sealCentroid: summary.meanCentroid,
    sealSpread: summary.meanSpread,
    sealBurstCentroid: summary.burstCentroid,
    sealBurstSpread: summary.burstSpread
  };

  if (timeline) {
    coordinates.timelineOnset = timeline.onset?.index;
    coordinates.timelineBurst = timeline.burst?.index;
    coordinates.timelineTransition = timeline.transition?.index;
    coordinates.timelineSustain = timeline.sustain?.index;
    coordinates.timelineRelease = timeline.release?.index;
  }

  return {
    source: "sample",
    coordinates,
    phases: summary.__phases || null,
    timeline: timeline || null
  };
}


// ======================================
// بناء سجل العائلة الإدراكية للحرف المخزن من الرواصد الموجودة
// يستعمل الجينوم والذاكرة والختم والزمن كما هي
// ======================================
function buildStoredFamilyRecordForMatch(identity, memory, timeline, familyContext) {
  const genome = identity?.genome || {};
  const seal = genome.spectralSeal || null;
  const mem = memory?.perceptualSignature || null;

  const coordinates = {
    energy: genome.energy?.mean,
    centroid: genome.centroid?.mean,
    spread: genome.spread?.mean,
    zcr: genome.zcr?.mean,
    duration: genome.duration?.mean,

    burstEnergy: genome.burstEnergy?.mean,
    burstCentroid: genome.burstCentroid?.mean,
    burstSpread: genome.burstSpread?.mean,

    energyMovement: genome.energyMovement?.mean,
    spectralMovement: genome.spectralMovement?.mean,
    phaseQuality: genome.phaseQuality?.mean
  };

  if (seal) {
    coordinates.sealCentroid = seal.averageCentroid;
    coordinates.sealSpread = seal.averageSpread;
    coordinates.sealBurstCentroid = seal.averageBurstCentroid;
    coordinates.sealBurstSpread = seal.averageBurstSpread;
  }

  if (mem) {
    coordinates.memoryCentroid = mem.centroid?.mean;
    coordinates.memorySpread = mem.spread?.mean;
    coordinates.memoryEnergy = mem.energy?.mean;
    coordinates.memoryZcr = mem.zcr?.mean;
    coordinates.memoryDuration = mem.duration?.mean;
  }

  addTimelineCoordinatesToFamilyRecord(coordinates, timeline);

  return {
    source: "stored-family-record",
    key: identity?.phonemeKey,
    phoneme: identity?.phoneme,
    label: identity?.label,
    familyContext,
    coordinates
  };
}


// ======================================
// إضافة المسار الزمني إلى سجل العائلة
// ======================================
function addTimelineCoordinatesToFamilyRecord(coordinates, timeline) {
  const timeSummary =
    timeline?.summary ||
    timeline?.average ||
    timeline?.averagePhases ||
    timeline?.phaseAverages ||
    timeline?.timelineAverage ||
    null;

  if (!timeSummary) return;

  coordinates.timelineOnset =
    timeSummary.onset?.index?.mean ??
    timeSummary.onset?.mean ??
    timeSummary.onset;

  coordinates.timelineBurst =
    timeSummary.burst?.index?.mean ??
    timeSummary.burst?.mean ??
    timeSummary.burst;

  coordinates.timelineTransition =
    timeSummary.transition?.index?.mean ??
    timeSummary.transition?.mean ??
    timeSummary.trans?.index?.mean ??
    timeSummary.trans?.mean ??
    timeSummary.transition ??
    timeSummary.trans;

  coordinates.timelineSustain =
    timeSummary.sustain?.index?.mean ??
    timeSummary.sustain?.mean ??
    timeSummary.sus?.index?.mean ??
    timeSummary.sus?.mean ??
    timeSummary.sustain ??
    timeSummary.sus;

  coordinates.timelineRelease =
    timeSummary.release?.index?.mean ??
    timeSummary.release?.mean ??
    timeSummary.rel?.index?.mean ??
    timeSummary.rel?.mean ??
    timeSummary.release ??
    timeSummary.rel;
}


// ======================================
// تحميل سجل العائلة الإدراكية إن كان محفوظًا
// ======================================
function loadPerceptualFamilyRecordForMatch(key) {
  const candidates = [
    key + "_perceptual_family_record",
    "family_record_" + key,
    key + "_family_identity"
  ];

  for (const storageKey of candidates) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ فشل تحميل سجل العائلة الإدراكية:", storageKey, err);
    }
  }

  return null;
}


// ======================================
// حفظ سجل العائلة الإدراكية
// لا يستدعى تلقائيًا هنا حتى لا نغير سلوك البناء الحالي
// ======================================
function savePerceptualFamilyRecord(key, record) {
  if (!key || !record) return;

  localStorage.setItem(
    key + "_perceptual_family_record",
    JSON.stringify(record, null, 2)
  );
}


// ======================================
// مطابقة سجلين
// لا جمع للأرقام
// المقارنة تحفظ شكل التشكيلة الرقمية وتفاصيل الفروقات
// ======================================
function compareFamilyRecordsShape(sampleRecord, storedRecord) {
  const sample = sampleRecord?.coordinates || {};
  const stored = storedRecord?.coordinates || {};

  const details = [];
  const missing = [];
  const parts = {};

  Object.keys(sample).forEach(function (key) {
    const a = sample[key];
    const b = stored[key];

    if (!isFiniteNumber(a) || !isFiniteNumber(b)) {
      missing.push(key);
      return;
    }

    const scale = Math.max(Math.abs(a), Math.abs(b), 1);
    const mismatch = Math.abs(a - b) / scale;

    details.push({
      key,
      sample: a,
      stored: b,
      mismatch
    });

    registerMismatchPart(parts, key, mismatch);
  });

  details.sort(function (a, b) {
    return b.mismatch - a.mismatch;
  });

  return {
    method: "family-record-shape-match",
    details,
    missing,
    parts,
    maxMismatch: details[0]?.mismatch ?? Infinity,
    comparedCount: details.length
  };
}


// ======================================
// توزيع الفروقات حسب مصدر المعرفة
// ======================================
function registerMismatchPart(parts, key, mismatch) {
  if (key.includes("seal")) {
    parts.seal = Math.max(parts.seal || 0, mismatch);
    return;
  }

  if (key.includes("memory")) {
    parts.memory = Math.max(parts.memory || 0, mismatch);
    return;
  }

  if (key.includes("timeline")) {
    parts.timeline = Math.max(parts.timeline || 0, mismatch);
    return;
  }

  parts.genome = Math.max(parts.genome || 0, mismatch);
}


// ======================================
// محرك تجهيز سجل العائلة الإدراكية للمطابقة
// ======================================
function compareIdentityMap(
  sampleFamilyRecord,
  identity,
  familyContext,
  perceptualMemory,
  timelineKnowledge,
  stateDecision
) {
  const storedRecord =
    loadPerceptualFamilyRecordForMatch(identity.phonemeKey) ||
    buildStoredFamilyRecordForMatch(
      identity,
      perceptualMemory,
      timelineKnowledge,
      familyContext
    );
console.log(
  "🔍 STORED FAMILY RECORD:",
  identity.phonemeKey,
  storedRecord
);
  const familyShape =
    compareFamilyRecordsShape(sampleFamilyRecord, storedRecord);
console.log("🧾 مفاتيح سجل العائلة:", identity.phonemeKey, Object.keys(storedRecord.coordinates || {}));
console.log("🧾 سجل العائلة كامل:", identity.phonemeKey, storedRecord.coordinates);
  return {
    total: familyShape.maxMismatch,
    familyShape,
    storedRecord,

    parts: familyShape.parts,

    state: Number(stateDecision?.distance || 0) * 0.35,
    shapeMismatch: familyShape.maxMismatch,
    missing: familyShape.missing
  };
}


// ======================================
// ترتيب مرشحي الهوية
// لا يعتمد على مجموع، بل على شكل التشكيلة: أعلى اختلاف ثم الذي يليه
// ======================================
function compareIdentityCandidates(a, b) {
  if (a.familyWinner && !b.familyWinner) return -1;
  if (b.familyWinner && !a.familyWinner) return 1;

  const av = a.identityScore?.familyShape?.details || [];
  const bv = b.identityScore?.familyShape?.details || [];

  const max = Math.max(av.length, bv.length);

  for (let i = 0; i < max; i++) {
    const am = av[i]?.mismatch ?? Infinity;
    const bm = bv[i]?.mismatch ?? Infinity;

    if (am !== bm) return am - bm;
  }

  const amiss = a.identityScore?.familyShape?.missing?.length || 0;
  const bmiss = b.identityScore?.familyShape?.missing?.length || 0;

  if (amiss !== bmiss) return amiss - bmiss;

  return 0;
}


// ======================================
// تحميل الذاكرة الإدراكية
// ======================================
function loadPerceptualMemoryForMatch(key) {
  const candidates = [
    key + "_perceptual_identity",
    key + "_memory",
    "phoneme_memory_" + key,
    key + "_cumulative_memory",
    "cognitive_memory_" + key
  ];

  for (const storageKey of candidates) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (parsed?.perceptualSignature && parsed?.perceptualSignatureByState) {
        return parsed;
      }

      if (
        parsed?.latestPerceptualIdentity?.perceptualSignature &&
        parsed?.latestPerceptualIdentity?.perceptualSignatureByState
      ) {
        return parsed.latestPerceptualIdentity;
      }

      if (
        parsed?.cumulativePerceptualSignature &&
        parsed?.cumulativePerceptualSignatureByState
      ) {
        return {
          perceptualSignature: parsed.cumulativePerceptualSignature,
          perceptualSignatureByState: parsed.cumulativePerceptualSignatureByState
        };
      }

    } catch (err) {
      console.warn("⚠️ فشل تحميل الذاكرة الإدراكية:", storageKey, err);
    }
  }

  return null;
}

// ======================================
// تحديد أقرب حالة داخل الحرف
// هذه مرحلة لاحقة بعد الهوية وليست حاكم الهوية
// ======================================
function scoreIdentityBestState(summary, identity, perceptualMemory) {
  const genomeByState = identity?.genomeByState || {};
  const memoryByState = perceptualMemory?.perceptualSignatureByState || {};

  const genomeKeys = Object.keys(genomeByState);
  const memoryKeys = Object.keys(memoryByState);

  const debug = {
    phonemeKey: identity?.phonemeKey || null,
    genomeByStateCount: genomeKeys.length,
    genomeByStateKeys: genomeKeys,
    memoryByStateCount: memoryKeys.length,
    memoryByStateKeys: memoryKeys
  };

  const scores = [];

  if (!genomeKeys.length) {
    return {
      distance: 0,
      stateKey: null,
      stateText: null,
      stateRole: null,
      confidence: 0,
      stateMargin: 0,
      allStateScores: [],
      debug
    };
  }

  genomeKeys.forEach(function (stateKey) {
    if (String(stateKey || "").includes("sukoon")) return;

    const genomeState = genomeByState[stateKey];
    const memoryState = memoryByState[stateKey];

    const text =
      genomeState?.hmal ||
      genomeState?.haml ||
      genomeState?.text ||
      memoryState?.hmal ||
      memoryState?.haml ||
      memoryState?.text ||
      stateKey;

    if (!text) return;

    let genomeDistance = 0;
    let memoryDistance = 0;

    genomeDistance += weightedNormalizedDistance(summary.meanCentroid, genomeState.centroid?.mean, genomeState.centroid?.variance, 1.8);
    genomeDistance += weightedNormalizedDistance(summary.meanSpread, genomeState.spread?.mean, genomeState.spread?.variance, 1.4);
    genomeDistance += weightedNormalizedDistance(summary.meanEnergy, genomeState.energy?.mean, genomeState.energy?.variance, 1.2);
    genomeDistance += weightedNormalizedDistance(summary.meanZcr, genomeState.zcr?.mean, genomeState.zcr?.variance, 1.1);
    genomeDistance += weightedNormalizedDistance(summary.duration, genomeState.duration?.mean, genomeState.duration?.variance, 1.2);

    if (memoryState) {
      memoryDistance += weightedNormalizedDistance(summary.meanCentroid, memoryState.centroid?.mean, memoryState.centroid?.variance, 1.8);
      memoryDistance += weightedNormalizedDistance(summary.meanSpread, memoryState.spread?.mean, memoryState.spread?.variance, 1.4);
      memoryDistance += weightedNormalizedDistance(summary.meanEnergy, memoryState.energy?.mean, memoryState.energy?.variance, 1.2);
      memoryDistance += weightedNormalizedDistance(summary.meanZcr, memoryState.zcr?.mean, memoryState.zcr?.variance, 1.1);
      memoryDistance += weightedNormalizedDistance(summary.duration, memoryState.duration?.mean, memoryState.duration?.variance, 1.2);
    }

    scores.push({
      stateKey,
      stateText: text,
      stateRole: genomeState?.role || memoryState?.role || null,
      genomeDistance,
      memoryDistance,
      distance: genomeDistance + memoryDistance
    });
  });

  scores.sort(function (a, b) {
    return a.distance - b.distance;
  });

  const best = scores[0] || null;
  const second = scores[1] || null;

  if (!best) {
    return {
      distance: 0,
      stateKey: null,
      stateText: null,
      stateRole: null,
      confidence: 0,
      stateMargin: 0,
      allStateScores: [],
      debug
    };
  }

  const margin = second ? second.distance - best.distance : 0;

  return {
    distance: best.distance,
    stateKey: best.stateKey,
    stateText: best.stateText,
    stateRole: best.stateRole,
    stateMargin: Number(margin.toFixed(4)),
    confidence: second
      ? Number((margin / Math.max(second.distance, 0.0001)).toFixed(4))
      : 1,
    allStateScores: scores,
    debug
  };
}


// ======================================
// مسافة معيارية داخل المعرفة الواحدة
// لا تتحول إلى حكم نهائي
// ======================================
function weightedNormalizedDistance(value, mean, variance, weight) {
  value = Number(value || 0);
  mean = Number(mean || 0);
  variance = Number(variance || 0);
  weight = Number(weight || 1);

  const tolerance =
    Math.sqrt(variance) ||
    Math.abs(mean) * 0.15 ||
    1;

  return (Math.abs(value - mean) / tolerance) * weight;
}


// ======================================
// تحميل معرفة المسار الزمني
// ======================================
function loadTimelineKnowledgeForMatch(key) {
  const candidates = [
    key + "_timeline_genome",
    "timeline_genome_" + key,
    key + "_timeline_identity",
    "phoneme_timeline_" + key,
    "cognitive_timeline_" + key
  ];

  for (const storageKey of candidates) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ فشل تحميل الجينوم الزمني:", storageKey, err);
    }
  }

  return null;
}


// ======================================
// العائلة الإدراكية: فحص الصفات الفارقة بين أول مرشحين
// لا تضيف أرقامًا، بل تعطي إشارة حسم إن وجدت
// ======================================
function applyPerceptualFamilyDecision(results, summary) {
  if (!Array.isArray(results) || results.length < 2) return;

  const first = results[0];
  const second = results[1];

  const decision =
    resolveFamilyConfusionByDecisiveTraits(
      summary,
      first,
      second
    );

  first.familyDecision = decision || {
    applied: false,
    reason: "لم تنتج العائلة قرارًا فارقًا."
  };

  second.familyDecision = first.familyDecision;

  if (!decision || !decision.applied) return;

  if (decision.winnerKey) {
    first.familyWinner = decision.winnerKey === first.key;
    second.familyWinner = decision.winnerKey === second.key;
  }
}


// ======================================
// حسم الاشتباه بالصفات الفارقة
// يفحص العلاقة في الاتجاهين
// ======================================
function resolveFamilyConfusionByDecisiveTraits(summary, first, second) {
  if (typeof buildFamilyDecisionContext !== "function") {
    return {
      applied: false,
      reason: "خريطة العائلة غير محملة."
    };
  }

  const relation = findFamilyRelationBetween(first.key, second.key);

  if (!relation) {
    return {
      applied: false,
      reason: "لا توجد علاقة عائلية فارقة محفوظة بين المرشحين."
    };
  }

  const decisiveTraits = relation.candidate?.decisiveTraits || [];

  if (!decisiveTraits.length) {
    return {
      applied: false,
      reason: "لا توجد صفات فارقة لهذا الاشتباه."
    };
  }

  const firstMap = buildNumericIdentityMapForDecision(first);
  const secondMap = buildNumericIdentityMapForDecision(second);
  const sampleMap = buildSampleNumericMap(summary);

  let firstPenalty = 0;
  let secondPenalty = 0;
  const used = [];

  decisiveTraits.forEach(function (trait) {
    const metricKeys = mapTraitToNumericMetrics(trait);

    metricKeys.forEach(function (metric) {
      const sample = sampleMap[metric];
      const a = firstMap[metric];
      const b = secondMap[metric];

      if (
        !isFiniteNumber(sample) ||
        !isFiniteNumber(a) ||
        !isFiniteNumber(b)
      ) {
        return;
      }

      const diff = Math.abs(a - b);
      const scale = Math.max(Math.abs(a), Math.abs(b), 1);

      if (diff / scale < 0.18) return;

      const firstD = Math.abs(sample - a) / scale;
      const secondD = Math.abs(sample - b) / scale;

      firstPenalty += firstD;
      secondPenalty += secondD;

      used.push({
        trait,
        metric,
        sample,
        firstValue: a,
        secondValue: b,
        firstDistance: firstD,
        secondDistance: secondD
      });
    });
  });

  if (!used.length) {
    return {
      applied: false,
      reason: "لم نجد أرقامًا فارقة كافية داخل المعارف المخزنة."
    };
  }

  const winnerKey =
    firstPenalty < secondPenalty
      ? first.key
      : secondPenalty < firstPenalty
        ? second.key
        : null;

  return {
    applied: true,
    method: "perceptual-family-decisive-traits",
    direction: relation.direction,
    pair: [first.key, second.key],
    decisiveTraits,
    usedKnowledge: used,
    firstPenalty,
    secondPenalty,
    winnerKey,
    note:
      "تم استدعاء العائلة الإدراكية، واستُعملت الصفات الفارقة دون جمع أرقام الهوية."
  };
}


// ======================================
// فحص علاقة العائلة في الاتجاهين
// ======================================
function findFamilyRelationBetween(firstKey, secondKey) {
  const firstContext = buildFamilyDecisionContext(firstKey);
  const firstCandidate =
    (firstContext?.candidates || []).find(function (c) {
      return c.key === secondKey;
    });

  if (firstCandidate) {
    return {
      direction: firstKey + "→" + secondKey,
      ownerKey: firstKey,
      candidate: firstCandidate
    };
  }

  const secondContext = buildFamilyDecisionContext(secondKey);
  const secondCandidate =
    (secondContext?.candidates || []).find(function (c) {
      return c.key === firstKey;
    });

  if (secondCandidate) {
    return {
      direction: secondKey + "→" + firstKey,
      ownerKey: secondKey,
      candidate: secondCandidate
    };
  }

  return null;
}


// ======================================
// خريطة أرقام العينة للصفات الفارقة
// ======================================
function buildSampleNumericMap(summary) {
  return {
    energy: summary.meanEnergy,
    centroid: summary.meanCentroid,
    spread: summary.meanSpread,
    zcr: summary.meanZcr,
    duration: summary.duration,
    burstEnergy: summary.burstEnergy,
    burstCentroid: summary.burstCentroid,
    burstSpread: summary.burstSpread,
    energyMovement: summary.energyMovement,
    spectralMovement: summary.spectralMovement,
    phaseQuality: summary.phaseQuality,

    sealCentroid: summary.meanCentroid,
    sealSpread: summary.meanSpread,
    sealBurstCentroid: summary.burstCentroid,
    sealBurstSpread: summary.burstSpread
  };
}


// ======================================
// خريطة أرقام الحرف المخزن للصفات الفارقة
// ======================================
function buildNumericIdentityMapForDecision(result) {
  const record = result.__familyRecord || result.identityScore?.storedRecord || null;
  return record?.coordinates || {};
}


// ======================================
// ربط الصفات الفارقة بالمقاييس الرقمية
// ======================================
function mapTraitToNumericMetrics(trait) {
  const map = {
    burst: [
      "burstEnergy",
      "burstCentroid",
      "energyMovement",
      "sealBurstCentroid",
      "sealBurstSpread"
    ],

    frication: [
      "zcr",
      "spread",
      "spectralMovement",
      "sealSpread"
    ],

    voiced: [
      "energy",
      "zcr",
      "memoryEnergy",
      "memoryZcr"
    ],

    hams: [
      "zcr",
      "energy",
      "memoryZcr",
      "memoryEnergy"
    ],

    tafkheem: [
      "centroid",
      "spread",
      "sealCentroid",
      "sealSpread",
      "memoryCentroid",
      "memorySpread"
    ],

    place: [
      "centroid",
      "burstCentroid",
      "sealCentroid",
      "sealBurstCentroid"
    ],

    nasal: [
      "spread",
      "energy",
      "memorySpread"
    ],

    sibilant: [
      "centroid",
      "spread",
      "zcr",
      "spectralMovement",
      "sealCentroid",
      "sealSpread"
    ],

    breathy: [
      "zcr",
      "energy",
      "spread"
    ],

    fricationShape: [
      "spread",
      "spectralMovement",
      "sealSpread"
    ],

    repeated: [
      "energyMovement"
    ],

    lateral: [
      "spread"
    ],

    glide: [
      "duration",
      "spectralMovement"
    ],

    elongation: [
      "duration"
    ],

    spreading: [
      "spread",
      "spectralMovement",
      "sealSpread"
    ]
  };

  return map[trait] || [];
}


// ======================================
// فحص الرقم الصالح
// ======================================
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}


// ======================================
// هامش التشابه بين سجلين
// ======================================
function compareFamilyShapeMargin(winner, second) {
  if (!winner || !second) return 0;

  const w = winner.identityScore?.familyShape?.maxMismatch ?? Infinity;
  const s = second.identityScore?.familyShape?.maxMismatch ?? Infinity;

  if (!Number.isFinite(w) || !Number.isFinite(s)) return 0;

  return s - w;
}


// ======================================
// تصنيف قرار الهوية
// لا يستعمل strong/weak ولا rank
// ======================================
function classifySeparationDecision(winner, second, margin) {
  if (!second) {
    return {
      label: "غير كافٍ للمقارنة",
      note: "يوجد سجل واحد فقط؛ لا نستطيع إثبات الفصل بين هويتين."
    };
  }

  if (winner.familyWinner) {
    return {
      label: "حسم عائلي إدراكي ✅",
      note:
        "تم حسم الهوية بواسطة سجلات العائلة الإدراكية والصفات الفارقة."
    };
  }

  if (margin > 0) {
    return {
      label: "هوية راجحة بسجل العائلة ✅",
      note:
        "سجل العائلة الإدراكية لهذا الحرف هو الأقرب في تشكيلة الأرقام، دون جمع ودون تصنيف مفروض."
    };
  }

  return {
    label: "اشتباه إدراكي ❌",
    note:
      "تشكيلات سجلات العائلة متقاربة. نحتاج سجلات إضافية أو صفات فارقة أو منافسين أكثر."
  };
}


// ======================================
// سؤال الحرف المنطوق
// ======================================
function askActualSpokenKey() {
  const answer = prompt(
    "ما الحرف الذي نطقته فعليًا؟\n\nاكتب الحرف بحركته مثل:\n\nبَ\nصِ\nطُ"
  );

  if (!answer) return null;

  const parsed = resolveArabicSpokenInput(answer);

  if (!parsed.key) {
    alert("لم أتعرف على الحرف. اكتب مثل: بَ أو صِ أو طُ");
    return null;
  }

  if (!parsed.state) {
    alert("اكتب الحرف مع الحركة: فتحة أو كسرة أو ضمة.");
    return null;
  }

  return parsed;
}


// ======================================
// حفظ نتيجة اختبار الهوية
// ======================================
function saveCognitiveMatchResult(buttonKey, actualKey, winner, results, decision, margin) {
  // الاختبار ليس ذاكرة معرفية.
  // لا نحفظه في localStorage حتى لا يملأ التخزين.
  // نحتفظ بآخر نتيجة مؤقتًا فقط أثناء الجلسة.

  window.lastCognitiveMatchResult = {
    buttonKey,
    actualKey,
    detectedKey: winner.key,
    detectedLabel: winner.label,
    detectedPhoneme: winner.phoneme,
    isCorrect: actualKey === winner.key,
    familyShape: safeNumber(winner.distance),
    margin: safeNumber(margin),
    decision: decision.label,
    createdAt: new Date().toISOString()
  };

  console.log("🧪 آخر نتيجة اختبار هوية مؤقتة:", window.lastCognitiveMatchResult);
}

// ======================================
// عرض سجل النتائج
// ======================================
function renderMatchResultsLog(filterKey) {
  const raw = localStorage.getItem("cognitive_match_results_log");
  const allResults = JSON.parse(raw || "[]");

  const results = filterKey
    ? allResults.filter(function (r) {
        return r.buttonKey === filterKey;
      })
    : allResults;

  const correctResults =
    results.filter(function (r) {
      return r.actualKey === r.detectedKey;
    });

  const accuracy = results.length
    ? ((correctResults.length / results.length) * 100).toFixed(2)
    : "0.00";

  const box = document.getElementById("match-results-log-box");
  if (!box) return;

  let html = `
    <h3 style="margin-top:0;">📊 سجل اختبارات الهوية ${filterKey ? " — " + filterKey : ""}</h3>
  `;

  if (!results.length) {
    box.innerHTML = html + `<div>لا توجد نتائج محفوظة لهذه الحقيبة بعد.</div>`;
    return;
  }

  results.forEach(function (r, index) {
    const ok = r.actualKey && r.detectedKey && r.actualKey === r.detectedKey;

    html += `
      <div style="background:#111827;padding:10px;border-radius:10px;margin:8px 0;border-left:5px solid ${ok ? "#22c55e" : "#ef4444"};">
        <div>#${index + 1}</div>
        <div>زر الاختبار: <b>${r.buttonKey || "غير محدد"}</b></div>
        <div>المنطوق فعليًا: <b>${r.actualKey || "غير محدد"}</b></div>
        <div>المكتشف: <b>${r.detectedLabel}</b></div>
        <div>النتيجة: <b>${ok ? "✅ صحيح" : "❌ خطأ"}</b></div>
        <div>شكل العائلة: <b>${r.familyShape}</b></div>
        <div>هامش الهوية: <b>${r.margin}</b></div>
        <div>القرار: <b>${r.decision}</b></div>
      </div>
    `;
  });

  html += `
    <div style="margin-top:18px;">نسبة النجاح لهذه الحقيبة: <b style="color:#22c55e;">${accuracy}%</b></div>
    <div style="margin-top:8px;">عدد اختبارات هذه الحقيبة: <b>${results.length}</b></div>
  `;

  box.innerHTML = html;
}


// ======================================
// حذف سجل النتائج
// ======================================
function clearCognitiveMatchResultsLog() {
  localStorage.removeItem("cognitive_match_results_log");

  const box = document.getElementById("match-results-log-box");

  if (box) {
    box.innerHTML = `
      <h3 style="margin-top:0;">📊 سجل اختبارات الهوية</h3>
      <div>لا توجد نتائج محفوظة بعد.</div>
    `;
  }

  alert("تم حذف سجل اختبارات الهوية بنجاح.");
}


// ======================================
// تنسيق رقم آمن
// ======================================
function safeFixed(value, digits) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(digits || 4) : "0.0000";
}


// ======================================
// رقم آمن للحفظ
// ======================================
function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(4)) : 0;
}


window.clearCognitiveMatchResultsLog = clearCognitiveMatchResultsLog;
window.startPhonemeMatchTest = startPhonemeMatchTest;
window.renderMatchResultsLog = renderMatchResultsLog;

console.log("🎯 محرك تحديد هوية الحرف عبر سجلات العائلة الإدراكية جاهز");
