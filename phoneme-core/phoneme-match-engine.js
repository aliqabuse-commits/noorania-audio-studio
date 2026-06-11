// ================================
// phoneme-match-engine.js
// محرك تحديد هوية الحرف بخريطة المعارف — Clean Identity Map
// ================================

console.log("🎯 phoneme-match-engine.js جاهز — Identity Map Clean");

function getAvailablePhonemeKeysForMatch() {
  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    return Object.keys(PHONEME_LETTER_DEFINITIONS);
  }

  return ["ba", "qaf"];
}

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

    const actual = askActualSpokenKey();

    if (!actual) {
      alert("لم يتم حفظ النتيجة لأن الحرف المنطوق لم يُحدد.");
      return;
    }

    const actualKey = actual.key;

    const results = availableIdentities.map(function (identity) {
      const familyContext = loadFamilyContextForMatch(identity.phonemeKey);
      const perceptualMemory = loadPerceptualMemoryForMatch(identity.phonemeKey);
const timelineKnowledge =
  loadTimelineKnowledgeForMatch(identity.phonemeKey);
      const stateDecision =
        scoreIdentityBestState(summary, identity, perceptualMemory);

      const identityScore =
  compareIdentityMap(
    summary,
    identity,
    familyContext,
    perceptualMemory,
    timelineKnowledge,
    stateDecision
  );

      return {
  key:return {
  key: identity.phonemeKey,
  phoneme: identity.phoneme,
  label: identity.label,
  color: identity.color,

  // ======================================
  // مراجع المعرفة الأصلية للحرف
  // تحتاجها العائلة الإدراكية لاحقاً
  // للوصول إلى الجينوم والختم والذاكرة
  // والجينوم الزمني عند حسم الاشتباه.
  // ======================================
  __identity: identity,
  __memory: perceptualMemory,
  __timeline: timelineKnowledge,

  matchedStateKey: stateDecision.stateKey,
  matchedStateText: stateDecision.stateText,
  matchedStateRole: stateDecision.stateRole,
  stateConfidence: stateDecision.confidence,
  stateMargin: stateDecision.stateMargin,
  stateScores: stateDecision.allStateScores,
  stateDebug: stateDecision.debug,

  genomeDistance: identityScore.genome,
  sealDistance: identityScore.seal,
  stateDistance: identityScore.state,
  memoryDistance: identityScore.memory,
  familyDistance: identityScore.family,
  absenceDistance: identityScore.absence,

  identityScore,
  distance: identityScore.total
};
    });

    results.sort(function (a, b) {
  return a.distance - b.distance;
});

// ======================================
// العائلة الإدراكية:
// إزالة الاشتباه بين المرشحين المتقاربين
// باستعمال الصفات الفارقة والمعارف المخزنة.
// ======================================
applyPerceptualFamilyDecision(results, summary);

results.sort(function (a, b) {
  return a.distance - b.distance;
});

const winner = results[0];
const second = results[1] || null;
    const margin = second ? second.distance - winner.distance : 0;

    const decision = classifySeparationDecision(winner, second, margin);

    if (typeof window.recordDecisionTrace === "function") {
      window.recordDecisionTrace({
        decisionId: "identify-phoneme",
        decisionName: "تحديد هوية حرف",
        target: winner.key,
        invokedKnowledge: [
          "cognitive-genome",
          "spectral-seal",
          "phoneme-family-map",
          "perceptual-memory",
          "state-genome",
          "knowledge-presence-map"
        ],
        influentialKnowledge: [
          "cognitive-genome",
          "spectral-seal",
          "phoneme-family-map",
          "perceptual-memory",
          "state-genome",
          "knowledge-presence-map"
        ],
        result: decision.label,
        confidence: margin,
        notes:
          "تمت مقارنة خريطة هوية العينة بخريطة هوية الحروف المخزنة."
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

    let report = "🎯 نتيجة اختبار هوية الحرف بخريطة المعارف\n\n";

    report += "زر الاختبار: " + targetKey + "\n";
    report += "المنطوق فعليًا: " + actual.text + "\n";

    report +=
      "العينة أقرب إلى: " +
      winner.label +
      " (" +
      winner.phoneme +
      ")\n\n";

    report +=
      "أقرب حالة داخل الحرف: " +
      (winner.matchedStateText || winner.matchedStateKey || "غير محددة") +
      "\n";

    report +=
      "ثقة تحديد الحركة: " +
      safeFixed(winner.stateConfidence, 4) +
      "\n";

    report +=
      "هامش الحركة: " +
      safeFixed(winner.stateMargin, 4) +
      "\n\n";

    results.forEach(function (r, index) {
      report +=
        (index + 1) +
        ") " +
        r.label +
        " (" +
        r.phoneme +
        ")" +
        " → identity distance = " +
        safeFixed(r.distance, 4) +
        "\n";

      report +=
        "   genome = " + safeFixed(r.genomeDistance, 4) +
        " | seal = " + safeFixed(r.sealDistance, 4) +
        " | state = " + safeFixed(r.stateDistance, 4) +
        " | memory = " + safeFixed(r.memoryDistance, 4) +
        " | family = " + safeFixed(r.familyDistance, 4) +
        " | absence = " + safeFixed(r.absenceDistance, 4) +
        "\n\n";
    });

    report += "هامش الفصل: " + safeFixed(margin, 4) + "\n";
    report += "قرار الفصل: " + decision.label + "\n\n";
    report += decision.note;

    alert(report);

    console.log("🎯 COGNITIVE MATCH SAMPLE SUMMARY:", summary);
    console.log("🎯 COGNITIVE MATCH RESULTS:", results);

  } catch (err) {
    console.error("❌ فشل اختبار تحديد هوية الحرف", err);
    alert("فشل اختبار تحديد هوية الحرف:\n" + err.message);
  }
}

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

function loadFamilyContextForMatch(key) {
  if (typeof buildFamilyDecisionContext === "function") {
    return buildFamilyDecisionContext(key);
  }
  return null;
}

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

function compareIdentityMap(
  summary,
  identity,
  familyContext,
  perceptualMemory,
  stateDecision
) {
  const genome = identity?.genome || {};
  const hasGenome = !!identity?.genome;
  const hasSeal = !!genome?.spectralSeal;
  const hasState = !!identity?.genomeByState;
  const hasMemory = !!perceptualMemory?.perceptualSignature;
  const hasFamily = !!familyContext || !!identity?.familyDecision;

  const genomeDistance =
    hasGenome
      ? compareSummaryWithFamilyAwareGenome(summary, genome, familyContext)
      : 20;

  const sealDistance =
    hasSeal
      ? scoreSpectralSealDistance(summary, genome)
      : 3;

  const stateDistance =
    hasState
      ? Number(stateDecision?.distance || 0) * 0.35
      : 3;

  const memoryDistance =
    hasMemory
      ? scorePerceptualMemoryDistance(summary, perceptualMemory) * 0.25
      : 2;

  const familyDistance =
    hasFamily ? 0 : 2;

  const absenceDistance =
    scoreKnowledgePresenceMap({
      hasGenome,
      hasSeal,
      hasState,
      hasMemory,
      hasFamily
    });

  const total =
    genomeDistance +
    sealDistance +
    stateDistance +
    memoryDistance +
    familyDistance +
    absenceDistance;

  return {
    total,
    genome: genomeDistance,
    seal: sealDistance,
    state: stateDistance,
    memory: memoryDistance,
    family: familyDistance,
    absence: absenceDistance
  };
}

function scoreKnowledgePresenceMap(flags) {
  let total = 0;

  if (!flags.hasGenome) total += 20;
  if (!flags.hasSeal) total += 3;
  if (!flags.hasState) total += 3;
  if (!flags.hasMemory) total += 2;
  if (!flags.hasFamily) total += 2;

  return total;
}

function compareSummaryWithFamilyAwareGenome(summary, genome, familyContext) {
  if (!summary || !genome) return Infinity;

  let weights = {
    energy: 1.0,
    centroid: 1.5,
    spread: 1.2,
    zcr: 0.8,
    burstEnergy: 1.3,
    burstCentroid: 1.4,
    burstSpread: 1.1,
    energyMovement: 1.1,
    spectralMovement: 1.5
  };

  const familyName =
    familyContext?.family ||
    familyContext?.familyKey ||
    "";

  if (familyName.includes("lip")) {
    weights.burstEnergy = 2.5;
    weights.energyMovement = 2.0;
    weights.centroid = 1.0;
  }

  if (
    familyName.includes("isti") ||
    familyName.includes("elevated") ||
    familyName.includes("deep")
  ) {
    weights.centroid = 3.0;
    weights.burstCentroid = 3.0;
    weights.spectralMovement = 2.5;
  }

  if (familyName.includes("ghunna")) {
    weights.energy = 2.0;
    weights.spread = 2.0;
    weights.zcr = 0.5;
  }

  let total = 0;

  total += weightedNormalizedDistance(summary.meanEnergy, genome.energy?.mean, genome.energy?.variance, weights.energy);
  total += weightedNormalizedDistance(summary.meanCentroid, genome.centroid?.mean, genome.centroid?.variance, weights.centroid);
  total += weightedNormalizedDistance(summary.meanSpread, genome.spread?.mean, genome.spread?.variance, weights.spread);
  total += weightedNormalizedDistance(summary.meanZcr, genome.zcr?.mean, genome.zcr?.variance, weights.zcr);
  total += weightedNormalizedDistance(summary.burstEnergy, genome.burstEnergy?.mean, genome.burstEnergy?.variance, weights.burstEnergy);
  total += weightedNormalizedDistance(summary.burstCentroid, genome.burstCentroid?.mean, genome.burstCentroid?.variance, weights.burstCentroid);
  total += weightedNormalizedDistance(summary.burstSpread, genome.burstSpread?.mean, genome.burstSpread?.variance, weights.burstSpread);
  total += weightedNormalizedDistance(summary.energyMovement, genome.energyMovement?.mean, genome.energyMovement?.variance, weights.energyMovement);
  total += weightedNormalizedDistance(summary.spectralMovement, genome.spectralMovement?.mean, genome.spectralMovement?.variance, weights.spectralMovement);

  return total;
}

function scoreSpectralSealDistance(summary, genome) {
  const seal = genome?.spectralSeal;
  if (!summary || !seal) return 0;

  let total = 0;

  total += weightedNormalizedDistance(summary.meanCentroid, seal.averageCentroid, 0, 1.2);
  total += weightedNormalizedDistance(summary.meanSpread, seal.averageSpread, 0, 1.0);
  total += weightedNormalizedDistance(summary.burstCentroid, seal.averageBurstCentroid, 0, 1.2);
  total += weightedNormalizedDistance(summary.burstSpread, seal.averageBurstSpread, 0, 1.0);

  return total * (seal.confidence || 1);
}

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

function scorePerceptualMemoryDistance(summary, perceptualMemory) {
  if (!summary || !perceptualMemory?.perceptualSignature) return 0;

  const sig = perceptualMemory.perceptualSignature;
  let total = 0;

  total += weightedNormalizedDistance(summary.meanCentroid, sig.centroid?.mean, sig.centroid?.variance, 1.6);
  total += weightedNormalizedDistance(summary.meanSpread, sig.spread?.mean, sig.spread?.variance, 1.3);
  total += weightedNormalizedDistance(summary.meanEnergy, sig.energy?.mean, sig.energy?.variance, 1.0);
  total += weightedNormalizedDistance(summary.meanZcr, sig.zcr?.mean, sig.zcr?.variance, 1.0);
  total += weightedNormalizedDistance(summary.duration, sig.duration?.mean, sig.duration?.variance, 1.2);
  total += weightedNormalizedDistance(summary.burstEnergy, sig.burstiness?.mean, sig.burstiness?.variance, 1.5);

  return total;
}

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
      distance: scorePerceptualMemoryDistance(summary, perceptualMemory),
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
      distance: scorePerceptualMemoryDistance(summary, perceptualMemory),
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
// العائلة الإدراكية:
// لا تضيف رقماً عاماً.
// بل تتدخل عند الاشتباه، وتستعمل الصفات الفارقة
// الموجودة في phoneme-family-map.js لخدمة قرار الهوية.
// ======================================
function applyPerceptualFamilyDecision(results, summary) {
  if (!Array.isArray(results) || results.length < 2) return;

  const first = results[0];
  const second = results[1];

  const gap = Math.abs(second.distance - first.distance);

  // لا نستدعي العائلة إلا عند الاشتباه الحقيقي
  if (gap > 12) return;

  const decision =
    resolveFamilyConfusionByDecisiveTraits(
      summary,
      first,
      second
    );

  if (!decision || !decision.applied) return;

  first.distance += decision.firstPenalty;
  second.distance += decision.secondPenalty;

  first.familyDecision = decision;
  second.familyDecision = decision;
}


function resolveFamilyConfusionByDecisiveTraits(summary, first, second) {
  if (typeof buildFamilyDecisionContext !== "function") {
    return {
      applied: false,
      reason: "خريطة العائلة غير محملة."
    };
  }

  const context = buildFamilyDecisionContext(first.key);

  const candidate =
    (context.candidates || []).find(function (c) {
      return c.key === second.key;
    });

  if (!candidate) {
    return {
      applied: false,
      reason: "المرشح الثاني ليس ضمن منافسي العائلة."
    };
  }

  const decisiveTraits = candidate.decisiveTraits || [];

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

      // إذا الرقم متقارب بين الحرفين فلا يحسم
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
      reason: "لم نجد أرقاماً فارقة كافية داخل المعارف المخزنة."
    };
  }

  return {
    applied: true,
    method: "perceptual-family-decisive-traits",
    pair: [first.key, second.key],
    decisiveTraits,
    usedKnowledge: used,
    firstPenalty,
    secondPenalty,
    note:
      "تم استدعاء العائلة الإدراكية عند الاشتباه، واستُعملت الصفات الفارقة فقط."
  };
}


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
    phaseQuality: summary.phaseQuality
  };
}


function buildNumericIdentityMapForDecision(result) {
  const identity = result.__identity || {};
  const memory = result.__memory || {};
  const timeline = result.__timeline || {};
  const genome = identity.genome || {};
  const seal = genome.spectralSeal || null;

  const map = {
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
    map.sealCentroid = seal.averageCentroid;
    map.sealSpread = seal.averageSpread;
    map.sealBurstCentroid = seal.averageBurstCentroid;
    map.sealBurstSpread = seal.averageBurstSpread;
  }

  const mem = memory.perceptualSignature || null;

  if (mem) {
    map.memoryCentroid = mem.centroid?.mean;
    map.memorySpread = mem.spread?.mean;
    map.memoryEnergy = mem.energy?.mean;
    map.memoryZcr = mem.zcr?.mean;
    map.memoryDuration = mem.duration?.mean;
  }

  const timeSummary = timeline.summary || null;

  if (timeSummary) {
    map.timelineOnset = timeSummary.onset?.index?.mean;
    map.timelineBurst = timeSummary.burst?.index?.mean;
    map.timelineTransition = timeSummary.transition?.index?.mean;
    map.timelineSustain = timeSummary.sustain?.index?.mean;
    map.timelineRelease = timeSummary.release?.index?.mean;
  }

  return map;
}


function mapTraitToNumericMetrics(trait) {
  const map = {
    burst: [
      "burstEnergy",
      "burstCentroid",
      "energyMovement",
      "timelineBurst"
    ],

    frication: [
      "zcr",
      "spread",
      "spectralMovement"
    ],

    voiced: [
      "energy",
      "zcr"
    ],

    hams: [
      "zcr",
      "energy"
    ],

    tafkheem: [
      "centroid",
      "spread",
      "sealCentroid",
      "sealSpread"
    ],

    place: [
      "centroid",
      "burstCentroid",
      "sealBurstCentroid",
      "timelineOnset",
      "timelineBurst"
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
      "spectralMovement"
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
      "energyMovement",
      "timelineSustain"
    ],

    lateral: [
      "spread",
      "timelineSustain"
    ],

    glide: [
      "duration",
      "spectralMovement",
      "timelineTransition"
    ],

    elongation: [
      "duration",
      "timelineSustain",
      "timelineRelease"
    ],

    spreading: [
      "spread",
      "spectralMovement"
    ]
  };

  return map[trait] || [];
}


function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function classifySeparationDecision(winner, second, margin) {
  if (!second) {
    return {
      label: "غير كافٍ للمقارنة",
      note: "يوجد جينوم واحد فقط، لذلك لا نستطيع قياس الفصل الحقيقي."
    };
  }

  const ratio = second.distance / Math.max(winner.distance, 0.0001);

  if (margin > 3 || ratio > 1.6) {
    return {
      label: "فصل قوي ✅",
      note: "العينة بعيدة بوضوح عن الحرف الثاني."
    };
  }

  if (margin > 1 || ratio > 1.25) {
    return {
      label: "فصل متوسط ⚠️",
      note: "العينة أقرب إلى الحرف الفائز، لكن المسافة ليست كبيرة بما يكفي."
    };
  }

  return {
    label: "فصل ملتبس ❌",
    note: "خرائط الهوية قريبة من العينة. نحتاج تقوية الهوية المخزنة أو تحسين التسجيل."
  };
}

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

function saveCognitiveMatchResult(buttonKey, actualKey, winner, results, decision, margin) {
  const logKey = "cognitive_match_results_log";
  const oldLog = JSON.parse(localStorage.getItem(logKey) || "[]");

  oldLog.push({
    buttonKey,
    actualKey,
    detectedKey: winner.key,
    detectedLabel: winner.label,
    detectedPhoneme: winner.phoneme,
    isCorrect: actualKey === winner.key,
    margin: Number(margin.toFixed(4)),
    decision: decision.label,
    results: results.map(function (r) {
      return {
        key: r.key,
        label: r.label,
        phoneme: r.phoneme,
        distance: Number(r.distance.toFixed(4)),
        genomeDistance: Number(r.genomeDistance.toFixed(4)),
        sealDistance: Number(r.sealDistance.toFixed(4)),
        stateDistance: Number(r.stateDistance.toFixed(4)),
        memoryDistance: Number(r.memoryDistance.toFixed(4)),
        familyDistance: Number(r.familyDistance.toFixed(4)),
        absenceDistance: Number(r.absenceDistance.toFixed(4))
      };
    }),
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(logKey, JSON.stringify(oldLog, null, 2));
  renderMatchResultsLog(buttonKey);
}

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
    <h3 style="margin-top:0;">📊 سجل اختبارات الفصل ${filterKey ? " — " + filterKey : ""}</h3>
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
        <div>هامش الفصل: <b>${r.margin}</b></div>
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

function clearCognitiveMatchResultsLog() {
  localStorage.removeItem("cognitive_match_results_log");

  const box = document.getElementById("match-results-log-box");

  if (box) {
    box.innerHTML = `
      <h3 style="margin-top:0;">📊 سجل اختبارات الفصل</h3>
      <div>لا توجد نتائج محفوظة بعد.</div>
    `;
  }

  alert("تم حذف سجل اختبارات الفصل بنجاح.");
}

function safeFixed(value, digits) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(digits || 4) : "0.0000";
}

window.clearCognitiveMatchResultsLog = clearCognitiveMatchResultsLog;
window.startPhonemeMatchTest = startPhonemeMatchTest;
window.renderMatchResultsLog = renderMatchResultsLog;

console.log("🎯 محرك تحديد هوية الحرف بخريطة المعارف جاهز — Clean");
