// ================================
// phoneme-boundary-engine.js
// كاشف حدود الحامل والمحمول بالهوية الإدراكية — V2
// يستدعي الجينوم + العائلة + الذاكرة داخل قرار الفصل
// ================================

console.log("🧭 phoneme-boundary-engine.js جاهز V2");

function loadBoundaryIdentity(key) {
  try {
    const raw = localStorage.getItem(key + "_cognitive_identity");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("فشل تحميل جينوم الحدود:", key, err);
    return null;
  }
}

function sliceBoundaryBuffer(buffer, startSecond, endSecond) {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(startSecond * sampleRate);
  const endSample = Math.floor(endSecond * sampleRate);
  const frameCount = Math.max(1, endSample - startSample);

  const newBuffer = new AudioBuffer({
    length: frameCount,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate
  });

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const source = buffer.getChannelData(ch);
    const target = newBuffer.getChannelData(ch);

    for (let i = 0; i < frameCount; i++) {
      target[i] = source[startSample + i] || 0;
    }
  }

  return newBuffer;
}

function monoFromBoundaryBuffer(buffer) {
  return buffer.getChannelData(0);
}

function summarizeBoundaryWindow(buffer) {
  if (
    typeof buildCognitiveTimeline !== "function" ||
    typeof detectCognitivePhases !== "function" ||
    typeof summarizeCognitiveTimeline !== "function"
  ) {
    throw new Error("دوال الجينوم الإدراكي غير محملة");
  }

  const samples = monoFromBoundaryBuffer(buffer);
  const timeline = buildCognitiveTimeline(samples, buffer.sampleRate);
  const phases = detectCognitivePhases(timeline);

  return summarizeCognitiveTimeline(timeline, phases);
}

function getFamilyContextForBoundary(key, fallback) {
  if (fallback) return fallback;

  if (typeof buildFamilyDecisionContext !== "function") {
    throw new Error(
      "العائلة الإدراكية غير محمّلة. لا يجوز الفصل الإدراكي بدون buildFamilyDecisionContext."
    );
  }

  const context = buildFamilyDecisionContext(key);

  if (!context) {
    throw new Error(
      "لم يتم بناء سياق العائلة الإدراكية للحرف: " + key
    );
  }

  return context;
}

function getMemoryContextForBoundary(key, fallback) {
  if (fallback) return fallback;

  if (typeof loadPhonemeCumulativeMemory === "function") {
    return loadPhonemeCumulativeMemory(key);
  }

  return null;
}

function scoreFamilySupportForPayload(payloadFamily) {
  if (!payloadFamily || !Array.isArray(payloadFamily.candidates)) return 0;

  // دعم بسيط أولي: وجود منافسين وسمات حاسمة يعني أن العائلة دخلت القرار
  return Math.min(0.05, payloadFamily.candidates.length * 0.01);
}

function scoreMemorySupportForPayload(payloadMemory) {
  if (!payloadMemory || !payloadMemory.samplesCount) return 0;

  // دعم بسيط أولي: كلما وجدت ذاكرة تراكمية أصبح القرار أكثر ثقة
  return Math.min(0.05, payloadMemory.samplesCount * 0.005);
}
function compareSummaryWithCognitiveGenome(summary, genome) {
  if (!summary || !genome) return 999;

  const summaryFeatures = {
    energy: summary.avgEnergy ?? summary.energy ?? 0,
    centroid: summary.avgCentroid ?? summary.centroid ?? 0,
    spread: summary.avgSpread ?? summary.spread ?? 0,
    zcr: summary.avgZcr ?? summary.zcr ?? 0,
    duration: summary.duration ?? 0
  };

  const genomeFeatures = {
    energy:
      genome.energy?.mean ??
      genome.avgEnergy ??
      genome.energy ??
      0,

    centroid:
      genome.centroid?.mean ??
      genome.avgCentroid ??
      genome.centroid ??
      0,

    spread:
      genome.spread?.mean ??
      genome.avgSpread ??
      genome.spread ??
      0,

    zcr:
      genome.zcr?.mean ??
      genome.avgZcr ??
      genome.zcr ??
      0,

    duration:
      genome.duration?.mean ??
      genome.avgDuration ??
      genome.duration ??
      0
  };

  const weights = {
    energy: 1.0,
    centroid: 1.3,
    spread: 1.0,
    zcr: 0.8,
    duration: 0.5
  };

  let total = 0;
  let count = 0;

  Object.keys(weights).forEach(function (key) {
    const a = Number(summaryFeatures[key] || 0);
    const b = Number(genomeFeatures[key] || 0);

    if (!a && !b) return;

    const diff = Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1);

    total += diff * weights[key];
    count += weights[key];
  });

  return count ? total / count : 999;
}
function buildPerceptualZonesFromScores(scores, payloadKey, carrierKey) {
  if (!scores || !scores.length) {
    return {
      carrierCore: null,
      carrierTailThreads: null,
      interactionZone: null,
      payloadHeadThreads: null,
      payloadCore: null,
      method: "no-scores"
    };
  }

  const zones = {
    carrierCore: null,
    carrierTailThreads: null,
    interactionZone: null,
    payloadHeadThreads: null,
    payloadCore: null,
    method: "perceptual-presence-zones-v1"
  };

  const labeled = scores.map(function (s) {
    const carrierWins = s.winner === carrierKey;
    const payloadWins = s.winner === payloadKey;

    const interaction =
      Math.abs(s.carrierDistance - s.adjustedPayloadDistance) <= 0.12;

    return {
      ...s,
      perceptualRole: interaction
        ? "interactionZone"
        : carrierWins
          ? "carrierPresence"
          : payloadWins
            ? "payloadPresence"
            : "unknown"
    };
  });

  const carrierItems = labeled.filter(function (s) {
    return s.perceptualRole === "carrierPresence";
  });

  const payloadItems = labeled.filter(function (s) {
    return s.perceptualRole === "payloadPresence";
  });

  const interactionItems = labeled.filter(function (s) {
    return s.perceptualRole === "interactionZone";
  });

  if (carrierItems.length) {
    zones.carrierCore = {
      start: carrierItems[0].t,
      end: carrierItems[carrierItems.length - 1].t,
      count: carrierItems.length
    };
  }

  if (interactionItems.length) {
    zones.interactionZone = {
      start: interactionItems[0].t,
      end: interactionItems[interactionItems.length - 1].t,
      count: interactionItems.length
    };
  }

  if (payloadItems.length) {
    zones.payloadCore = {
      start: payloadItems[0].t,
      end: payloadItems[payloadItems.length - 1].t,
      count: payloadItems.length
    };
  }

  if (zones.carrierCore && zones.interactionZone) {
    zones.carrierTailThreads = {
      start: zones.carrierCore.end,
      end: zones.interactionZone.end
    };
  }

  if (zones.interactionZone && zones.payloadCore) {
    zones.payloadHeadThreads = {
      start: zones.interactionZone.start,
      end: zones.payloadCore.start
    };
  }

  zones.labeledScores = labeled;

  return zones;
}
function detectPayloadBoundaryByIdentity(audioBuffer, options) {
  options = options || {};

  const carrierKey = options.carrierKey;
  const payloadKey = options.payloadKey;

  if (!carrierKey || !payloadKey) {
    throw new Error("يجب تمرير carrierKey و payloadKey إلى كاشف الحدود.");
  }

  const carrierIdentity =
    options.carrierIdentity || loadBoundaryIdentity(carrierKey);

  const payloadIdentity =
    options.payloadIdentity || loadBoundaryIdentity(payloadKey);

  const carrierFamily =
    getFamilyContextForBoundary(carrierKey, options.carrierFamily);

  const payloadFamily =
    getFamilyContextForBoundary(payloadKey, options.payloadFamily);

  const carrierMemory =
    getMemoryContextForBoundary(carrierKey, options.carrierMemory);

  const payloadMemory =
    getMemoryContextForBoundary(payloadKey, options.payloadMemory);

  const cognitiveContext = options.cognitiveContext || null;

  if (!carrierIdentity) {
    throw new Error("لا يوجد جينوم للحامل: " + carrierKey);
  }

  if (!payloadIdentity) {
    throw new Error("لا يوجد جينوم للمحمول: " + payloadKey);
  }

  if (typeof compareSummaryWithCognitiveGenome !== "function") {
    throw new Error("دالة compareSummaryWithCognitiveGenome غير موجودة");
  }

  const duration = audioBuffer.duration;
  const windowSize = options.windowSize || 0.18;
  const hopSize = options.hopSize || 0.035;
  const minStart = options.minStart || 0.08;
  const maxStart = Math.max(minStart, duration - windowSize);

  const scores = [];

  for (let t = minStart; t <= maxStart; t += hopSize) {
    const win = sliceBoundaryBuffer(
      audioBuffer,
      t,
      Math.min(duration, t + windowSize)
    );

    const summary = summarizeBoundaryWindow(win);

    const carrierDistance = compareSummaryWithCognitiveGenome(
      summary,
      carrierIdentity.genome
    );

    const payloadDistance = compareSummaryWithCognitiveGenome(
      summary,
      payloadIdentity.genome
    );

    const familySupport = scoreFamilySupportForPayload(payloadFamily);
    const memorySupport = scoreMemorySupportForPayload(payloadMemory);

    const adjustedPayloadDistance =
      payloadDistance - familySupport - memorySupport;

    scores.push({
      t: Number(t.toFixed(4)),
      carrierDistance,
      payloadDistance,
      adjustedPayloadDistance,
      familySupport,
      memorySupport,
      winner:
        adjustedPayloadDistance < carrierDistance
          ? payloadKey
          : carrierKey,
      margin: Math.abs(carrierDistance - adjustedPayloadDistance),
      usedKnowledge: {
        cognitiveContext: !!cognitiveContext,
        carrierIdentity: !!carrierIdentity,
        payloadIdentity: !!payloadIdentity,
        carrierFamily: !!carrierFamily,
        payloadFamily: !!payloadFamily,
        carrierMemory: !!carrierMemory,
        payloadMemory: !!payloadMemory
      }
    });
  }

  let boundary = null;

  for (let i = 0; i < scores.length - 2; i++) {
    const a = scores[i];
    const b = scores[i + 1];
    const c = scores[i + 2];

    if (
      a.winner === payloadKey &&
      b.winner === payloadKey &&
      c.winner === payloadKey
    ) {
      boundary = a.t;
      break;
    }
  }

  if (boundary === null && scores.length) {
    const best = scores.reduce(function (bestItem, item) {
      return item.adjustedPayloadDistance < bestItem.adjustedPayloadDistance
        ? item
        : bestItem;
    }, scores[0]);

    boundary = best.t;
  }
  const perceptualZones =
  buildPerceptualZonesFromScores(scores, payloadKey, carrierKey);

  return {
    carrierKey,
    payloadKey,
    boundary,
    scores,
    perceptualZones,
    usedKnowledge: {
      cognitiveContext: !!cognitiveContext,
      carrierIdentity: !!carrierIdentity,
      payloadIdentity: !!payloadIdentity,
      carrierFamily: !!carrierFamily,
      payloadFamily: !!payloadFamily,
      carrierMemory: !!carrierMemory,
      payloadMemory: !!payloadMemory
    },
    confidence: scores.length
      ? Math.max.apply(null, scores.map(function (s) { return s.margin || 0; }))
      : null
  };
}

window.detectPayloadBoundaryByIdentity = detectPayloadBoundaryByIdentity;
window.compareSummaryWithCognitiveGenome = compareSummaryWithCognitiveGenome;
console.log("🧭 كاشف الحدود بالهوية الإدراكية جاهز V2");
