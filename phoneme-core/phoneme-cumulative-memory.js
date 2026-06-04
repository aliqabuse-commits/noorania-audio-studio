// ================================
// memory-core/phoneme-cumulative-memory.js
// الذاكرة التراكمية الإدراكية للحروف — V1
// تحفظ الأثر، تفصل طبقات المعرفة، وتعيدها إلى القرار
// ================================

console.log("🧠 phoneme-cumulative-memory.js جاهز V1 — Memory Serves Decision");

// ======================================
// 1) دستور الذاكرة التراكمية
// ======================================
const PHONEME_CUMULATIVE_MEMORY_CHARTER = {
  title: "دستور الذاكرة التراكمية الإدراكية",
  law:
    "الذاكرة التي لا تعود لتصحح القرار ليست ذاكرة إدراكية، بل أرشيف صامت.",
  principles: [
    "آخر تسجيل لا يلغي تاريخ الحرف.",
    "كل محاولة صالحة تضيف أثرًا.",
    "المتوسط وحده لا يكفي؛ لا بد من مدى وذاكرة شذوذ.",
    "الذاكرة تفصل بين الإدراكي والزمني واللوني والمطابقة.",
    "القرار يراجع الذاكرة قبل الاعتماد."
  ]
};

const CUMULATIVE_MEMORY_VERSION = "Noorani Cumulative Phoneme Memory V1";

const COGNITIVE_KEYS = [
  "duration",
  "energy",
  "zcr",
  "centroid",
  "spread",
  "burstEnergy",
  "burstCentroid",
  "burstSpread",
  "energyMovement",
  "spectralMovement"
];

const PERCEPTUAL_KEYS = [
  "centroid",
  "spread",
  "energy",
  "zcr",
  "duration",
  "burstiness"
];

const TIMELINE_PHASES = ["onset", "burst", "transition", "sustain", "release"];

// ======================================
// 2) مفاتيح التخزين
// ======================================
function getCumulativeMemoryKeys(phonemeKey) {
  return [
    phonemeKey + "_cumulative_memory",
    phonemeKey + "_perceptual_identity",
    phonemeKey + "_memory",
    "phoneme_memory_" + phonemeKey,
    "cognitive_memory_" + phonemeKey
  ];
}

function loadPhonemeCumulativeMemory(phonemeKey) {
  const keys = getCumulativeMemoryKeys(phonemeKey);

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed) return normalizeCumulativeMemory(phonemeKey, parsed);
    } catch (err) {
      console.warn("⚠️ تعذر قراءة ذاكرة تراكمية:", key, err);
    }
  }

  return createEmptyCumulativeMemory(phonemeKey);
}

function createEmptyCumulativeMemory(phonemeKey) {
  const pack = typeof getPhonemeTrainingPack === "function" ? getPhonemeTrainingPack(phonemeKey) : null;

  return {
    method: CUMULATIVE_MEMORY_VERSION,
    phonemeKey: phonemeKey,
    key: phonemeKey,
    phoneme: pack?.letter || phonemeKey,
    label: pack?.name || phonemeKey,
    color: {
      hex: pack?.colorHex || "#38BDF8",
      name: pack?.colorName || "Noorani Color"
    },
    pack: pack
      ? { key: pack.key || phonemeKey, letter: pack.letter, name: pack.name, traits: pack.traits || {} }
      : null,
    samplesCount: 0,
    samples: [],
    layers: {
      perceptual: { samplesCount: 0, signature: {}, latest: null },
      cognitive: { samplesCount: 0, genome: {}, byState: {}, latest: null },
      timeline: { samplesCount: 0, phases: {}, latest: null },
      match: { samplesCount: 0, stats: {}, latest: null }
    },
    attemptHistory: [],
    governance: {
      decisionStatus: "empty-memory",
      note: "لا توجد عينات بعد.",
      nextAction: "بناء الذاكرة أو الجينوم من تسجيلات صالحة."
    },
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
}

function normalizeCumulativeMemory(phonemeKey, memory) {
  const normalized = memory || createEmptyCumulativeMemory(phonemeKey);

  normalized.method = normalized.method || CUMULATIVE_MEMORY_VERSION;
  normalized.phonemeKey = normalized.phonemeKey || normalized.key || phonemeKey;
  normalized.key = normalized.key || normalized.phonemeKey || phonemeKey;
  normalized.samples = Array.isArray(normalized.samples) ? normalized.samples : [];
  normalized.attemptHistory = Array.isArray(normalized.attemptHistory) ? normalized.attemptHistory : [];
  normalized.layers = normalized.layers || {};
  normalized.layers.perceptual = normalized.layers.perceptual || { samplesCount: 0, signature: {}, latest: null };
  normalized.layers.cognitive = normalized.layers.cognitive || { samplesCount: 0, genome: {}, byState: {}, latest: null };
  normalized.layers.timeline = normalized.layers.timeline || { samplesCount: 0, phases: {}, latest: null };
  normalized.layers.match = normalized.layers.match || { samplesCount: 0, stats: {}, latest: null };
  normalized.samplesCount = normalized.samples.length;

  return normalized;
}

function savePhonemeCumulativeMemory(phonemeKey, memory) {
  const normalized = normalizeCumulativeMemory(phonemeKey, memory);
  normalized.updatedAt = new Date().toISOString();

  const serialized = JSON.stringify(normalized, null, 2);

  getCumulativeMemoryKeys(phonemeKey).forEach(function (key) {
    localStorage.setItem(key, serialized);
  });

  return normalized;
}

// ======================================
// 3) إضافة عينة جديدة حسب طبقتها
// ======================================
function appendCumulativeMemorySample(phonemeKey, layer, payload, meta) {
  const memory = loadPhonemeCumulativeMemory(phonemeKey);

  const sample = {
    id: phonemeKey + "_" + layer + "_" + Date.now(),
    createdAt: new Date().toISOString(),
    phonemeKey: phonemeKey,
    layer: layer,
    payload: payload || {},
    meta: meta || {}
  };

  memory.samples.push(sample);
  memory.attemptHistory.push({
    id: sample.id,
    createdAt: sample.createdAt,
    layer: layer,
    accepted: true,
    decisionUse: describeLayerDecisionUse(layer)
  });

  rebuildCumulativeMemoryLayers(memory);
  updateCumulativeGovernance(memory);

  return savePhonemeCumulativeMemory(phonemeKey, memory);
}

function describeLayerDecisionUse(layer) {
  const uses = {
    perceptual: "يثبت أثر اللون والخصائص الإدراكية العامة.",
    cognitive: "يبني هوية الحرف والحالات ويخدم المطابقة والفصل.",
    timeline: "يراجع معقولية المسار الزمني والمراحل.",
    match: "يقيس الهامش والمنافسين ويمنع اعتماد النجاح الظاهري."
  };

  return uses[layer] || "أثر معرفي يحتاج ربطًا بقرار.";
}

// ======================================
// 4) إعادة بناء الطبقات
// ======================================
function rebuildCumulativeMemoryLayers(memory) {
  const perceptualSamples = memory.samples.filter(s => s.layer === "perceptual");
  const cognitiveSamples = memory.samples.filter(s => s.layer === "cognitive");
  const timelineSamples = memory.samples.filter(s => s.layer === "timeline");
  const matchSamples = memory.samples.filter(s => s.layer === "match");

  memory.layers.perceptual = buildPerceptualLayer(perceptualSamples);
  memory.layers.cognitive = buildCognitiveLayer(cognitiveSamples);
  memory.layers.timeline = buildTimelineLayer(timelineSamples);
  memory.layers.match = buildMatchLayer(matchSamples);
  memory.samplesCount = memory.samples.length;
}

function buildPerceptualLayer(samples) {
  const signatures = samples
    .map(s => s.payload && (s.payload.perceptualSignature || s.payload.identity?.perceptualSignature))
    .filter(Boolean);

  const result = { samplesCount: samples.length, signature: {}, latest: samples.length ? samples[samples.length - 1].payload : null };

  PERCEPTUAL_KEYS.forEach(function (key) {
    const values = [];

    signatures.forEach(function (sig) {
      if (sig[key] && typeof sig[key].mean === "number") values.push(sig[key].mean);
    });

    result.signature[key] = cumulativeStat(values);
  });

  return result;
}

function buildCognitiveLayer(samples) {
  const genomes = samples
    .map(s => s.payload && (s.payload.genome || s.payload.identity?.genome))
    .filter(Boolean);

  const byStateSources = samples
    .map(s => s.payload && (s.payload.genomeByState || s.payload.identity?.genomeByState))
    .filter(Boolean);

  const result = { samplesCount: samples.length, genome: {}, byState: {}, latest: samples.length ? samples[samples.length - 1].payload : null };

  COGNITIVE_KEYS.forEach(function (key) {
    const values = [];
    genomes.forEach(function (genome) {
      if (genome[key] && typeof genome[key].mean === "number") values.push(genome[key].mean);
    });
    result.genome[key] = cumulativeStat(values);
  });

  byStateSources.forEach(function (stateMap) {
    Object.keys(stateMap || {}).forEach(function (stateKey) {
      result.byState[stateKey] = result.byState[stateKey] || {};

      COGNITIVE_KEYS.forEach(function (metric) {
        const value = stateMap[stateKey]?.summary?.[metric] || stateMap[stateKey]?.[metric]?.mean;
        if (typeof value === "number") {
          result.byState[stateKey][metric] = result.byState[stateKey][metric] || [];
          result.byState[stateKey][metric].push(value);
        }
      });
    });
  });

  Object.keys(result.byState).forEach(function (stateKey) {
    Object.keys(result.byState[stateKey]).forEach(function (metric) {
      result.byState[stateKey][metric] = cumulativeStat(result.byState[stateKey][metric]);
    });
  });

  return result;
}

function buildTimelineLayer(samples) {
  const result = { samplesCount: samples.length, phases: {}, latest: samples.length ? samples[samples.length - 1].payload : null };

  TIMELINE_PHASES.forEach(function (phase) {
    const indexValues = [];
    const energyValues = [];
    const centroidValues = [];

    samples.forEach(function (sample) {
      const records = sample.payload?.records || sample.payload?.timelineGenome?.records || [];

      records.forEach(function (record) {
        const point = record.timeline && record.timeline[phase];
        if (!point) return;

        if (typeof point.index === "number") indexValues.push(point.index);
        if (typeof point.energy === "number") energyValues.push(point.energy);
        if (typeof point.centroid === "number") centroidValues.push(point.centroid);
      });
    });

    result.phases[phase] = {
      index: cumulativeStat(indexValues),
      energy: cumulativeStat(energyValues),
      centroid: cumulativeStat(centroidValues)
    };
  });

  return result;
}

function buildMatchLayer(samples) {
  const margins = [];
  let correct = 0;
  let notApproved = 0;

  samples.forEach(function (sample) {
    const report = sample.payload || {};
    const margin = Number(report.margin || report.separationMargin || 0);
    if (!Number.isNaN(margin)) margins.push(margin);
    if (report.correct || report.result === "correct") correct++;
    if (report.decision === "غير كافٍ للمقارنة" || report.cognitiveApproval === "not-approved-yet") notApproved++;
  });

  return {
    samplesCount: samples.length,
    stats: {
      margin: cumulativeStat(margins),
      correctCount: correct,
      notApprovedCount: notApproved,
      successRate: samples.length ? Number(((correct / samples.length) * 100).toFixed(2)) : 0
    },
    latest: samples.length ? samples[samples.length - 1].payload : null
  };
}

// ======================================
// 5) حكم الذاكرة للقرار
// ======================================
function updateCumulativeGovernance(memory) {
  const hasCognitive = memory.layers.cognitive.samplesCount > 0;
  const hasTimeline = memory.layers.timeline.samplesCount > 0;
  const hasPerceptual = memory.layers.perceptual.samplesCount > 0;
  const hasMatch = memory.layers.match.samplesCount > 0;

  let status = "partial";
  let note = "الذاكرة بدأت تتكوّن لكنها لم تكتمل بعد كمرجع قرار.";
  let nextAction = "استكمال الطبقات الناقصة وربطها بتقرير المطابقة.";

  if (hasPerceptual && hasCognitive && hasTimeline && hasMatch) {
    status = "decision-ready";
    note = "الذاكرة تحتوي طبقات كافية لمراجعة القرار.";
    nextAction = "استخدم الذاكرة في هامش الفصل وحكم الاعتماد.";
  } else if (!hasCognitive && !hasPerceptual) {
    status = "weak-memory";
    note = "لا توجد ذاكرة إدراكية أو جينومية كافية.";
    nextAction = "ابدأ ببناء الذاكرة والجينوم المركزي.";
  }

  memory.governance = {
    decisionStatus: status,
    note: note,
    nextAction: nextAction,
    layers: {
      perceptual: hasPerceptual,
      cognitive: hasCognitive,
      timeline: hasTimeline,
      match: hasMatch
    },
    rule:
      "لا يتحول النجاح التشغيلي إلى اعتماد إدراكي حتى تراجعه الذاكرة والعائلة والهامش الزمني."
  };
}

function evaluateMemoryDecisionSupport(phonemeKey, matchReport) {
  const memory = loadPhonemeCumulativeMemory(phonemeKey);
  updateCumulativeGovernance(memory);

  const margin = Number(matchReport && (matchReport.margin || matchReport.separationMargin || 0)) || 0;
  const marginReady = margin > 0;
  const decisionReady = memory.governance.decisionStatus === "decision-ready";

  return {
    phonemeKey: phonemeKey,
    memoryStatus: memory.governance.decisionStatus,
    marginReady: marginReady,
    approval:
      decisionReady && marginReady ? "reviewable" : "not-approved-yet",
    reason:
      decisionReady && marginReady
        ? "الذاكرة والهامش يقدمان دعمًا قابلًا للمراجعة."
        : "الذاكرة أو الهامش لا يكفيان لاعتماد إدراكي.",
    memorySummary: memory.governance
  };
}

// ======================================
// 6) أدوات إحصائية
// ======================================
function cumulativeStat(values) {
  const clean = values.filter(function (v) {
    return typeof v === "number" && !Number.isNaN(v) && Number.isFinite(v);
  });

  if (!clean.length) {
    return { samplesCount: 0, mean: 0, variance: 0, min: 0, max: 0 };
  }

  const mean = clean.reduce((a, b) => a + b, 0) / clean.length;
  const variance = clean.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / clean.length;

  return {
    samplesCount: clean.length,
    mean: roundCumulative(mean),
    variance: roundCumulative(variance),
    min: roundCumulative(Math.min.apply(null, clean)),
    max: roundCumulative(Math.max.apply(null, clean))
  };
}

function roundCumulative(num) {
  return Number(Number(num || 0).toFixed(4));
}

// ======================================
// 7) التصدير العام
// ======================================
window.PHONEME_CUMULATIVE_MEMORY_CHARTER = PHONEME_CUMULATIVE_MEMORY_CHARTER;
window.loadPhonemeCumulativeMemory = loadPhonemeCumulativeMemory;
window.savePhonemeCumulativeMemory = savePhonemeCumulativeMemory;
window.appendCumulativeMemorySample = appendCumulativeMemorySample;
window.rebuildCumulativeMemoryLayers = rebuildCumulativeMemoryLayers;
window.evaluateMemoryDecisionSupport = evaluateMemoryDecisionSupport;
window.createEmptyCumulativeMemory = createEmptyCumulativeMemory;

console.log("🧠 الذاكرة التراكمية جاهزة — الأثر يعود إلى القرار");
window.getPhonemeCumulativeMemory = getPhonemeCumulativeMemory;
window.updatePhonemeCumulativeMemory = updatePhonemeCumulativeMemory;

console.log("🧠 phoneme-cumulative-memory.js جاهز");
