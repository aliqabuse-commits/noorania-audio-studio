// ================================
// phoneme-boundary-engine.js
// كاشف حدود الحامل والمحمول بالهوية الإدراكية — V1
// ================================

console.log("🧭 phoneme-boundary-engine.js جاهز V1");

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

  const timeline = buildCognitiveTimeline(
    samples,
    buffer.sampleRate
  );

  const phases = detectCognitivePhases(timeline);

  return summarizeCognitiveTimeline(timeline, phases);
}

function detectPayloadBoundaryByIdentity(audioBuffer, options) {
  options = options || {};

  const carrierKey = options.carrierKey || "ba";
  const payloadKey = options.payloadKey || "sad";
const carrierIdentity =
  options.carrierIdentity || loadBoundaryIdentity(carrierKey);

const payloadIdentity =
  options.payloadIdentity || loadBoundaryIdentity(payloadKey);

const carrierFamily = options.carrierFamily || null;
const payloadFamily = options.payloadFamily || null;
const carrierMemory = options.carrierMemory || null;
const payloadMemory = options.payloadMemory || null;
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

    const carrierDistance =
      compareSummaryWithCognitiveGenome(
        summary,
        carrierIdentity.genome
      );

    const payloadDistance =
      compareSummaryWithCognitiveGenome(
        summary,
        payloadIdentity.genome
      );

    const memoryBoost =
  carrierMemory || payloadMemory ? 0.03 : 0;

const familyBoost =
  carrierFamily || payloadFamily ? 0.03 : 0;

const adjustedPayloadDistance =
  payloadDistance - memoryBoost - familyBoost;

scores.push({
  t: Number(t.toFixed(4)),
  carrierDistance,
  payloadDistance,
  adjustedPayloadDistance,
  winner:
    adjustedPayloadDistance < carrierDistance
      ? payloadKey
      : carrierKey,
  margin:
    Math.abs(carrierDistance - adjustedPayloadDistance),
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

  return {
  carrierKey,
  payloadKey,
  boundary,
  scores,
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
window.detectPayloadBoundaryByIdentity =
  detectPayloadBoundaryByIdentity;

console.log("🧭 كاشف الحدود بالهوية الإدراكية جاهز");
