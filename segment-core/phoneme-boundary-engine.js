// ================================
// phoneme-boundary-engine.js
// باني خريطة الحضور الإدراكي للحامل والمحمول — V3
// لا يبحث عن boundary ولا cutPoint
// يبني حضور الحامل + حضور المحمول + منطقة الاشتباك
// ================================

console.log("🧭 phoneme-boundary-engine.js جاهز V3 — Perceptual Presence Map");

function loadBoundaryIdentity(key) {
  try {
    const raw = localStorage.getItem(key + "_cognitive_identity");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("فشل تحميل هوية الحرف:", key, err);
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
  const summary = summarizeCognitiveTimeline(timeline, phases);

  summary.__timeline = timeline;
  summary.__phases = phases;

  return summary;
}

function getFamilyContextForBoundary(key, fallback) {
  if (fallback) return fallback;

  if (typeof buildFamilyDecisionContext !== "function") {
    throw new Error(
      "العائلة الإدراكية غير محمّلة. لا يجوز بناء خريطة حضور إدراكي بدون buildFamilyDecisionContext."
    );
  }

  const context = buildFamilyDecisionContext(key);

  if (!context) {
    throw new Error("لم يتم بناء سياق العائلة الإدراكية للحرف: " + key);
  }

  return context;
}

function getMemoryContextForBoundary(key, fallback) {
  if (fallback) return fallback;

  if (typeof loadPhonemeCumulativeMemory === "function") {
    const memory = loadPhonemeCumulativeMemory(key);
    if (memory) return memory;
  }

  const keys = [
    key + "_cumulative_memory",
    key + "_perceptual_identity",
    key + "_memory",
    "phoneme_memory_" + key,
    "cognitive_memory_" + key
  ];

  for (const storageKey of keys) {
    const raw = localStorage.getItem(storageKey);
    if (!raw) continue;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn("ذاكرة تالفة:", storageKey, err);
    }
  }

  throw new Error("الذاكرة الإدراكية/التراكمية غير متاحة للحرف: " + key);
}

function getFeatureValue(source, names) {
  for (const name of names) {
    const value = source && source[name];

    if (typeof value === "number") return value;

    if (value && typeof value.mean === "number") {
      return value.mean;
    }
  }

  return 0;
}

function compareSummaryWithCognitiveGenome(summary, genome) {
  if (!summary || !genome) return 999;

  const pairs = [
    {
      weight: 1.2,
      a: getFeatureValue(summary, ["meanEnergy", "avgEnergy", "energy"]),
      b: getFeatureValue(genome, ["energy", "meanEnergy", "avgEnergy"])
    },
    {
      weight: 1.5,
      a: getFeatureValue(summary, ["meanCentroid", "avgCentroid", "centroid"]),
      b: getFeatureValue(genome, ["centroid", "meanCentroid", "avgCentroid"])
    },
    {
      weight: 1.1,
      a: getFeatureValue(summary, ["meanSpread", "avgSpread", "spread"]),
      b: getFeatureValue(genome, ["spread", "meanSpread", "avgSpread"])
    },
    {
      weight: 0.8,
      a: getFeatureValue(summary, ["meanZcr", "avgZcr", "zcr"]),
      b: getFeatureValue(genome, ["zcr", "meanZcr", "avgZcr"])
    },
    {
      weight: 0.7,
      a: getFeatureValue(summary, ["duration"]),
      b: getFeatureValue(genome, ["duration"])
    },
    {
      weight: 1.0,
      a: getFeatureValue(summary, ["burstEnergy"]),
      b: getFeatureValue(genome, ["burstEnergy"])
    },
    {
      weight: 1.2,
      a: getFeatureValue(summary, ["burstCentroid"]),
      b: getFeatureValue(genome, ["burstCentroid"])
    }
  ];

  let total = 0;
  let weightSum = 0;

  pairs.forEach(function (p) {
    if (!p.a && !p.b) return;

    const diff =
      Math.abs(Number(p.a || 0) - Number(p.b || 0)) /
      Math.max(Math.abs(Number(p.a || 0)), Math.abs(Number(p.b || 0)), 1);

    total += diff * p.weight;
    weightSum += p.weight;
  });

  return weightSum ? total / weightSum : 999;
}

function compareSummaryWithSpectralSeal(summary, identity) {
  const seal =
    identity &&
    identity.genome &&
    identity.genome.spectralSeal
      ? identity.genome.spectralSeal
      : null;

  if (!seal) return 999;

  const summaryCentroid = getFeatureValue(summary, [
    "meanCentroid",
    "avgCentroid",
    "centroid"
  ]);

  const summarySpread = getFeatureValue(summary, [
    "meanSpread",
    "avgSpread",
    "spread"
  ]);

  const sealCentroid =
    seal.averageCentroid || seal.centroid || seal.avgCentroid || 0;

  const sealSpread =
    seal.averageSpread || seal.spread || seal.avgSpread || 0;

  const d1 =
    Math.abs(summaryCentroid - sealCentroid) /
    Math.max(Math.abs(summaryCentroid), Math.abs(sealCentroid), 1);

  const d2 =
    Math.abs(summarySpread - sealSpread) /
    Math.max(Math.abs(summarySpread), Math.abs(sealSpread), 1);

  return (d1 * 1.4 + d2) / 2.4;
}

function compareSummaryWithMemory(summary, memory) {
  if (!summary || !memory) return 999;

  const genome =
    memory.cumulativeGenome ||
    memory.latestIdentity?.genome ||
    memory.genome ||
    null;

  if (!genome) return 999;

  return compareSummaryWithCognitiveGenome(summary, genome);
}

function calculatePresenceFromDistance(distance) {
  if (!Number.isFinite(distance)) return 0;
  return 1 / (1 + Math.max(0, distance));
}

function hasFamilyAuthority(family) {
  if (!family) return false;

  if (Array.isArray(family.candidates) && family.candidates.length) {
    return true;
  }

  if (Array.isArray(family.competitors) && family.competitors.length) {
    return true;
  }

  if (Array.isArray(family.decisiveTraits) && family.decisiveTraits.length) {
    return true;
  }

  if (family.family || family.macroFamilies || family.traits) {
    return true;
  }

  return false;
}

function buildWindowPresenceRecord(ctx) {
  const carrierGenomeDistance = compareSummaryWithCognitiveGenome(
    ctx.summary,
    ctx.carrierIdentity.genome
  );

  const payloadGenomeDistance = compareSummaryWithCognitiveGenome(
    ctx.summary,
    ctx.payloadIdentity.genome
  );

  const carrierSealDistance = compareSummaryWithSpectralSeal(
    ctx.summary,
    ctx.carrierIdentity
  );

  const payloadSealDistance = compareSummaryWithSpectralSeal(
    ctx.summary,
    ctx.payloadIdentity
  );

  const carrierMemoryDistance = compareSummaryWithMemory(
    ctx.summary,
    ctx.carrierMemory
  );

  const payloadMemoryDistance = compareSummaryWithMemory(
    ctx.summary,
    ctx.payloadMemory
  );

  const carrierFamilyReady = hasFamilyAuthority(ctx.carrierFamily);
  const payloadFamilyReady = hasFamilyAuthority(ctx.payloadFamily);

  if (!carrierFamilyReady || !payloadFamilyReady) {
    throw new Error("العائلة الإدراكية لم تفرض حضورها على قرار الفصل.");
  }

  const carrierPresence =
    calculatePresenceFromDistance(carrierGenomeDistance) * 0.38 +
    calculatePresenceFromDistance(carrierSealDistance) * 0.22 +
    calculatePresenceFromDistance(carrierMemoryDistance) * 0.25 +
    0.15;

  const payloadPresence =
    calculatePresenceFromDistance(payloadGenomeDistance) * 0.38 +
    calculatePresenceFromDistance(payloadSealDistance) * 0.22 +
    calculatePresenceFromDistance(payloadMemoryDistance) * 0.25 +
    0.15;

  const difference = Math.abs(carrierPresence - payloadPresence);

  let perceptualRole = "unknown";

  if (carrierPresence >= 0.62 && payloadPresence < 0.48) {
    perceptualRole = "carrierCore";
  } else if (payloadPresence >= 0.62 && carrierPresence < 0.48) {
    perceptualRole = "payloadCore";
  } else if (
    carrierPresence >= 0.48 &&
    payloadPresence >= 0.48 &&
    difference <= 0.22
  ) {
    perceptualRole = "interactionZone";
  } else if (carrierPresence > payloadPresence) {
    perceptualRole = "carrierTail";
  } else if (payloadPresence > carrierPresence) {
    perceptualRole = "payloadHead";
  }

  return {
    t: Number(ctx.t.toFixed(4)),
    start: Number(ctx.t.toFixed(4)),
    end: Number((ctx.t + ctx.windowDuration).toFixed(4)),

    summary: ctx.summary,

    carrierPresence: Number(carrierPresence.toFixed(4)),
    payloadPresence: Number(payloadPresence.toFixed(4)),

    carrierGenomeDistance: Number(carrierGenomeDistance.toFixed(4)),
    payloadGenomeDistance: Number(payloadGenomeDistance.toFixed(4)),

    carrierSealDistance: Number(carrierSealDistance.toFixed(4)),
    payloadSealDistance: Number(payloadSealDistance.toFixed(4)),

    carrierMemoryDistance: Number(carrierMemoryDistance.toFixed(4)),
    payloadMemoryDistance: Number(payloadMemoryDistance.toFixed(4)),

    perceptualRole,

    usedKnowledge: {
      carrierIdentity: true,
      payloadIdentity: true,
      carrierFamily: carrierFamilyReady,
      payloadFamily: payloadFamilyReady,
      carrierMemory: !!ctx.carrierMemory,
      payloadMemory: !!ctx.payloadMemory,
      temporalPath: true,
      perceptualPath: true,
      spectralSeal: true
    }
  };
}

function buildZoneFromItems(items, role) {
  if (!items.length) return null;

  return {
    role,
    start: items[0].start,
    end: items[items.length - 1].end,
    count: items.length,
    items
  };
}

function buildPerceptualZonesFromPresenceMap(presenceMap) {
  const carrierCoreItems = presenceMap.filter(function (x) {
    return x.perceptualRole === "carrierCore";
  });

  const carrierTailItems = presenceMap.filter(function (x) {
    return x.perceptualRole === "carrierTail";
  });

  const interactionItems = presenceMap.filter(function (x) {
    return x.perceptualRole === "interactionZone";
  });

  const payloadHeadItems = presenceMap.filter(function (x) {
    return x.perceptualRole === "payloadHead";
  });

  const payloadCoreItems = presenceMap.filter(function (x) {
    return x.perceptualRole === "payloadCore";
  });

  return {
    method: "perceptual-presence-zones-v3",

    carrierCore: buildZoneFromItems(carrierCoreItems, "carrierCore"),
    carrierTail: buildZoneFromItems(carrierTailItems, "carrierTail"),
    interactionZone: buildZoneFromItems(interactionItems, "interactionZone"),
    payloadHead: buildZoneFromItems(payloadHeadItems, "payloadHead"),
    payloadCore: buildZoneFromItems(payloadCoreItems, "payloadCore")
  };
}

function validatePerceptualZones(zones) {
  const missing = [];

  if (!zones.carrierCore) missing.push("carrierCore");
  if (!zones.interactionZone) missing.push("interactionZone");
  if (!zones.payloadCore) missing.push("payloadCore");

  return {
    accepted: missing.length === 0,
    missing
  };
}

function buildPerceptualPresenceMapByIdentity(audioBuffer, options) {
  options = options || {};

  const carrierKey = options.carrierKey;
  const payloadKey = options.payloadKey;

  if (!carrierKey || !payloadKey) {
    throw new Error("يجب تمرير carrierKey و payloadKey لبناء خريطة الحضور.");
  }

  const carrierIdentity =
    options.carrierIdentity || loadBoundaryIdentity(carrierKey);

  const payloadIdentity =
    options.payloadIdentity || loadBoundaryIdentity(payloadKey);

  if (!carrierIdentity) {
    throw new Error("لا يوجد جينوم للحامل: " + carrierKey);
  }

  if (!payloadIdentity) {
    throw new Error("لا يوجد جينوم للمحمول: " + payloadKey);
  }

  const carrierFamily =
    getFamilyContextForBoundary(carrierKey, options.carrierFamily);

  const payloadFamily =
    getFamilyContextForBoundary(payloadKey, options.payloadFamily);

  const carrierMemory =
    getMemoryContextForBoundary(carrierKey, options.carrierMemory);

  const payloadMemory =
    getMemoryContextForBoundary(payloadKey, options.payloadMemory);

  const duration = audioBuffer.duration;
  const windowSize = options.windowSize || 0.14;
  const hopSize = options.hopSize || 0.025;

  const presenceMap = [];

  for (let t = 0; t + windowSize <= duration; t += hopSize) {
    const win = sliceBoundaryBuffer(audioBuffer, t, t + windowSize);
    const summary = summarizeBoundaryWindow(win);

    presenceMap.push(
      buildWindowPresenceRecord({
        t,
        windowDuration: windowSize,
        summary,
        carrierIdentity,
        payloadIdentity,
        carrierFamily,
        payloadFamily,
        carrierMemory,
        payloadMemory
      })
    );
  }

  const perceptualZones =
    buildPerceptualZonesFromPresenceMap(presenceMap);

  const validation = validatePerceptualZones(perceptualZones);

  return {
    method: "Noorani Perceptual Presence Map V3",
    accepted: validation.accepted,
    failureReason: validation.accepted
      ? null
      : "لم تكتمل خريطة الحضور الإدراكي: " + validation.missing.join(", "),

    carrierKey,
    payloadKey,

    presenceMap,
    carrierPresenceMap: presenceMap.map(function (x) {
      return {
        start: x.start,
        end: x.end,
        presence: x.carrierPresence,
        role: x.perceptualRole
      };
    }),

    payloadPresenceMap: presenceMap.map(function (x) {
      return {
        start: x.start,
        end: x.end,
        presence: x.payloadPresence,
        role: x.perceptualRole
      };
    }),

    perceptualZones,

    usedKnowledge: {
      carrierIdentity: true,
      payloadIdentity: true,
      carrierFamily: true,
      payloadFamily: true,
      carrierMemory: true,
      payloadMemory: true,
      temporalPath: true,
      perceptualPath: true,
      spectralSeal: true
    }
  };
}

// اسم توافقي قديم، لكن الناتج الجديد ليس boundary
function detectPayloadBoundaryByIdentity(audioBuffer, options) {
  return buildPerceptualPresenceMapByIdentity(audioBuffer, options);
}

window.loadBoundaryIdentity = loadBoundaryIdentity;
window.sliceBoundaryBuffer = sliceBoundaryBuffer;
window.monoFromBoundaryBuffer = monoFromBoundaryBuffer;
window.summarizeBoundaryWindow = summarizeBoundaryWindow;

window.compareSummaryWithCognitiveGenome =
  compareSummaryWithCognitiveGenome;

window.compareSummaryWithSpectralSeal =
  compareSummaryWithSpectralSeal;

window.compareSummaryWithMemory =
  compareSummaryWithMemory;

window.buildPerceptualPresenceMapByIdentity =
  buildPerceptualPresenceMapByIdentity;

window.detectPayloadBoundaryByIdentity =
  detectPayloadBoundaryByIdentity;

console.log("🧭 خريطة الحضور الإدراكي جاهزة V3 — بلا boundary ولا cutPoint");
