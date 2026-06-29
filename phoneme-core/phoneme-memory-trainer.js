// ================================
// phoneme-core/phoneme-memory-trainer.js
// مدرب الذاكرة الإدراكية اللونية للحروف — V3
// خدمة القرار + الحوكمة + خلية النحل
// يقرأ الذاكرة القديمة + الذاكرة التراكمية + يبني ذاكرة عند عدم وجودها
// يبني توقيعًا عامًا وتوقيعًا لكل حالة
// ================================

console.log("🎨 phoneme-memory-trainer.js جاهز V3 — Decision Governed Memory");

const MEMORY_TRAINER_VERSION = "V3-decision-governed";

const MEMORY_FEATURE_KEYS = [
  "centroid",
  "spread",
  "energy",
  "zcr",
  "duration",
  "burstiness"
];


// ======================================
// 1) قراءة ذاكرة الحرف من كل المفاتيح المعروفة
// ======================================
function getMemoryForTraining(phonemeKey) {
  if (typeof getPhonemeMemory === "function") {
    const direct = getPhonemeMemory(phonemeKey);
    if (direct) return direct;
  }

  if (typeof getAnyStoredPhonemeMemory === "function") {
    const cumulative = getAnyStoredPhonemeMemory(phonemeKey);
    if (cumulative) return normalizeMemoryForTrainer(phonemeKey, cumulative);
  }

  const keys = [
    phonemeKey + "_perceptual_identity",
    phonemeKey + "_cumulative_memory",
    phonemeKey + "_memory",
    "phoneme_memory_" + phonemeKey,
    "cognitive_memory_" + phonemeKey,
    phonemeKey + "_cognitive_identity"
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed) return normalizeMemoryForTrainer(phonemeKey, parsed);
    } catch (err) {
      console.warn("⚠️ تعذر قراءة ذاكرة:", key, err);
    }
  }

  return buildFallbackMemoryFromPack(phonemeKey);
}


// ======================================
// 2) بناء ذاكرة أساسية من الحقيبة إن لم توجد ذاكرة
// ======================================
function buildFallbackMemoryFromPack(phonemeKey) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(phonemeKey)
      : null;

  if (!pack) return null;

  const colorBinding =
    typeof bindPhonemeToColor === "function"
      ? bindPhonemeToColor(pack.colorKey || phonemeKey)
      : null;

  return {
    method: "Fallback Memory From Training Pack",
    key: phonemeKey,
    phonemeKey: phonemeKey,
    phoneme: pack.letter || phonemeKey,
    label: pack.name || phonemeKey,
    color: {
      hex: colorBinding?.hex || pack.colorHex || "#38BDF8",
      name: colorBinding?.colorName || pack.colorName || "Noorani Color"
    },
    pack: {
      key: pack.key || phonemeKey,
      letter: pack.letter,
      name: pack.name,
      traits: pack.traits || {}
    },
    concept: {
      goal: "بناء ذاكرة إدراكية تراكمية للحرف من تسجيلاته.",
      rule: "لا تُمسح الذاكرة عند إعادة التسجيل، بل تضاف العينة الجديدة إلى الأثر السابق."
    },
    trainingUnits: pack.positions || []
  };
}


function normalizeMemoryForTrainer(phonemeKey, memory) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(phonemeKey)
      : null;

  const colorBinding =
    typeof bindPhonemeToColor === "function"
      ? bindPhonemeToColor(pack?.colorKey || phonemeKey)
      : null;

  return {
    method: memory.method || "Normalized Memory For Trainer",
    key: memory.key || memory.phonemeKey || phonemeKey,
    phonemeKey: memory.phonemeKey || memory.key || phonemeKey,
    phoneme: memory.phoneme || pack?.letter || phonemeKey,
    label: memory.label || pack?.name || phonemeKey,
    color: memory.color || {
      hex: colorBinding?.hex || pack?.colorHex || "#38BDF8",
      name: colorBinding?.colorName || pack?.colorName || "Noorani Color"
    },
    pack:
      memory.pack ||
      (pack
        ? {
            key: pack.key || phonemeKey,
            letter: pack.letter,
            name: pack.name,
            traits: pack.traits || {}
          }
        : null),
    concept: memory.concept || {
      goal: "تثبيت ذاكرة إدراكية للحرف.",
      rule: "التسجيل الجديد لا يمحو الذاكرة السابقة."
    },
    trainingUnits:
      memory.trainingUnits ||
      memory.units ||
      pack?.positions ||
      []
  };
}


// ======================================
// 3) تدريب ذاكرة الحرف
// ======================================
async function trainPhonemeMemory(phonemeKey) {
  try {
    const memory = getMemoryForTraining(phonemeKey);

    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!memory && !pack) {
      alert("لا توجد حقيبة ولا ذاكرة لهذا الحرف: " + phonemeKey);
      return null;
    }

    const units =
      pack && pack.positions
        ? pack.positions.map(function (p) {
            return {
              id: p.id || p.file.replace(/\.[^.]+$/, ""),
              hmal: p.hmal || p.haml || p.text,
text: p.hmal || p.haml || p.text,
              file: p.file,
              role: p.role,
              description: p.description || ""
            };
          })
        : (memory.trainingUnits || []);

    if (!units.length) {
      alert("لا توجد وحدات تدريبية لهذا الحرف: " + phonemeKey);
      return null;
    }

    const missing = await findMissingTrainingFiles(units);

    if (missing.length) {
      alert(
        "لم تكتمل حقيبة التدريب الإدراكي بعد.\n\n" +
          "الملفات الناقصة:\n" +
          missing.join("\n") +
          "\n\nابدأ أولًا بزر: 🎙 تدريب هذا الحرف إدراكيًا"
      );
      return null;
    }

    showPhonemeTrainingLoading("جاري بناء ذاكرة لون " + memory.label + "...");

    const samples = [];

    for (const unit of units) {
      const blob = await getAudioPromiseForMemory(unit.file, 3000);

      if (!blob) {
        throw new Error("الصوت غير موجود: " + unit.file);
      }

      const decoded = await decodeBlobToMonoForMemory(blob);

      const features = extractPerceptualFeatures(
        decoded.samples,
        decoded.sampleRate
      );
let memoryTimeline = null;

if (typeof buildOrderedPhonemeTimeline === "function") {
  memoryTimeline = buildOrderedPhonemeTimeline(
    decoded.samples,
    decoded.sampleRate
  );
}
      samples.push({
        id: unit.id || unit.file.replace(/\.[^.]+$/, ""),
        hmal: unit.hmal || unit.haml || unit.text,
text: unit.hmal || unit.haml || unit.text,
        file: unit.file,
        role: unit.role,
        description: unit.description || "",
        duration: decoded.samples.length / decoded.sampleRate,
        features,
timelineBurst: memoryTimeline?.burst?.index ?? null,
timelineTransition: memoryTimeline?.transition?.index ?? null,
timelineSustain: memoryTimeline?.sustain?.index ?? null,
timelineRelease: memoryTimeline?.release?.index ?? null
      });
    }

    const filtered =
  typeof filterCleanSamplesForFamilyRecord === "function"
    ? filterCleanSamplesForFamilyRecord(samples)
    : { cleanSamples: samples, outlierSamples: [], report: null };

const identity = buildPerceptualIdentity(
  memory,
  samples,
  filtered
);

identity.allSamplesCount = samples.length;
identity.cleanSamplesCount = samples.length;

identity.outlierSamples = [];
identity.outlierFeatures =
  filtered?.outlierFeatures || [];

identity.outlierReport =
  filtered?.report || null;
    identity.governance = buildMemoryGovernanceDecision(
      phonemeKey,
      memory,
      identity
    );

    savePerceptualIdentityEverywhere(phonemeKey, identity);

    renderPhonemeMemoryReport(identity);

    hidePhonemeTrainingLoading();

    alert(
      "تم بناء ذاكرة لون " +
        memory.label +
        "\nاللون: " +
        memory.color.name +
        "\nالثقة الإدراكية: " +
        Number(identity.confidence || 0).toFixed(4) +
        "\nحكم الذاكرة: " +
        identity.governance.decision
    );

    return identity;
  } catch (err) {
    hidePhonemeTrainingLoading();
    console.error("❌ فشل تدريب الذاكرة الإدراكية", err);
    alert("فشل تدريب الذاكرة الإدراكية:\n" + err.message);
    return null;
  }
}


// ======================================
// 4) حفظ الذاكرة في كل المفاتيح التي قد يقرأها النظام
// ======================================
function savePerceptualIdentityEverywhere(phonemeKey, identity) {
  const lightIdentity = {
    method: identity.method,
    version: identity.version,
    phonemeKey: identity.phonemeKey,
    phoneme: identity.phoneme,
    label: identity.label,
    color: identity.color,
    pack: identity.pack,

    trainingUnits: (identity.trainingUnits || []).map(function (u) {
      return {
        id: u.id,
        text: u.text || u.hmal || u.haml,
        file: u.file,
        role: u.role,
        duration: u.duration,
        centroid: u.centroid,
        spread: u.spread,
        energy: u.energy,
        zcr: u.zcr,
        burstiness: u.burstiness,
        activeRatio: u.activeRatio
      };
    }),

    perceptualSignature: identity.perceptualSignature,
    perceptualSignatureByState: identity.perceptualSignatureByState,

    // لا نحفظ سجلات ثقيلة داخل localStorage
    memoryUnitRecords: [],

    samplesCount: identity.samplesCount,
    confidence: identity.confidence,
    governance: identity.governance,
    concept: identity.concept,
    createdAt: identity.createdAt,

    allSamplesCount: identity.allSamplesCount || identity.samplesCount,
    cleanSamplesCount: identity.cleanSamplesCount || identity.samplesCount,

    // تخفيف التخزين
    outlierSamples: [],
    outlierFeatures: [],
    outlierReport: identity.outlierReport
      ? {
          decision: identity.outlierReport.decision,
          reason: identity.outlierReport.reason
        }
      : null
  };

  const value = JSON.stringify(lightIdentity);

  localStorage.setItem(
    phonemeKey + "_perceptual_identity",
    value
  );

  localStorage.setItem(
    phonemeKey + "_memory",
    value
  );

  localStorage.removeItem("phoneme_memory_" + phonemeKey);

  if (typeof addPerceptualIdentityToCumulativeMemory === "function") {
    addPerceptualIdentityToCumulativeMemory(
      phonemeKey,
      lightIdentity
    );
  } else {
    addPerceptualIdentityFallback(
      phonemeKey,
      lightIdentity
    );
  }
}

function addPerceptualIdentityFallback(phonemeKey, identity) {
  const oldRaw = localStorage.getItem(phonemeKey + "_cumulative_memory");
  let cumulative = null;

  if (oldRaw) {
    try {
      cumulative = JSON.parse(oldRaw);
    } catch (err) {
      cumulative = null;
    }
  }

  if (!cumulative) {
    cumulative = {
      method: "Noorani Cumulative Phoneme Memory V2",
      phonemeKey: phonemeKey,
      key: phonemeKey,
      phoneme: identity.phoneme,
      label: identity.label,
      color: identity.color,
      samplesCount: 0,
      samples: [],
      attemptHistory: [],
      cumulativePerceptualSignature: {},
      cumulativePerceptualSignatureByState: {},
      createdAt: new Date().toISOString(),
      updatedAt: null
    };
  }

  if (!Array.isArray(cumulative.samples)) cumulative.samples = [];
  if (!Array.isArray(cumulative.attemptHistory)) cumulative.attemptHistory = [];

  const sample = {
  id: phonemeKey + "_memory_" + Date.now(),
  createdAt: new Date().toISOString(),
  source: "phoneme-memory-trainer",
  phonemeKey: phonemeKey,
  perceptualSignature: identity.perceptualSignature,
  perceptualSignatureByState: identity.perceptualSignatureByState,
  governance: identity.governance
};

  cumulative.samples.push(sample);
if (cumulative.samples.length > 20) {
  cumulative.samples = cumulative.samples.slice(-20);
}
  cumulative.attemptHistory.push({
    id: sample.id,
    createdAt: sample.createdAt,
    source: sample.source,
    accepted: identity.governance?.decision !== "rejected",
    confidence: identity.confidence,
    decision: identity.governance?.decision || "unknown",
    decisionReason: identity.governance?.reason || ""
  });
if (cumulative.attemptHistory.length > 50) {
  cumulative.attemptHistory =
    cumulative.attemptHistory.slice(-50);
}
  cumulative.samplesCount = cumulative.samples.length;
  cumulative.latestPerceptualIdentity = {
  method: identity.method,
  version: identity.version,
  phonemeKey: identity.phonemeKey,
  phoneme: identity.phoneme,
  label: identity.label,
  color: identity.color,
  pack: identity.pack,
  perceptualSignature: identity.perceptualSignature,
  perceptualSignatureByState: identity.perceptualSignatureByState,
  samplesCount: identity.samplesCount,
  confidence: identity.confidence,
  governance: identity.governance,
  createdAt: identity.createdAt
};
  cumulative.latestMemoryGovernance = identity.governance || null;
  cumulative.updatedAt = new Date().toISOString();
  cumulative.cumulativePerceptualSignature =
    buildCumulativePerceptualSignature(cumulative.samples);
  cumulative.cumulativePerceptualSignatureByState =
    buildCumulativePerceptualSignatureByState(cumulative.samples);

  return cumulative;
}


// ======================================
// 5) فحص التسجيلات الناقصة
// ======================================
async function findMissingTrainingFiles(units) {
  const missing = [];

  for (const unit of units) {
    const blob = await getAudioPromiseForMemory(unit.file, 1200);

    if (!blob) {
      missing.push(unit.file);
    }
  }

  return missing;
}


// ======================================
// 6) بناء الهوية الإدراكية
// ======================================
function buildPerceptualIdentity(memory, samples, filtered) {
  const values = buildFeatureValueBuckets(samples, filtered);
  const identity = {
    method: "Phoneme Color Memory Trainer V3",
    version: MEMORY_TRAINER_VERSION,

    phonemeKey:
      memory.key ||
      memory.phonemeKey ||
      memory.label ||
      memory.phoneme,

    phoneme: memory.phoneme,
    label: memory.label,
    color: memory.color,
    pack: memory.pack || null,

    trainingUnits: samples.map(function (s) {
      return {
        id: s.id,
        hmal: s.hmal || s.haml || s.text,
text: s.hmal || s.haml || s.text,
        file: s.file,
        role: s.role,
        description: s.description,
        duration: roundMemory(s.duration),
        centroid: roundMemory(s.features.centroid),
        spread: roundMemory(s.features.spread),
        energy: roundMemory(s.features.energy),
        zcr: roundMemory(s.features.zcr),
        burstiness: roundMemory(s.features.burstiness),
        activeRatio: roundMemory(s.features.activeRatio || 0)
      };
    }),

    perceptualSignature: buildPerceptualSignature(values),
    perceptualSignatureByState: buildPerceptualSignatureByState(samples),
memoryUnitRecords: buildMemoryUnitRecords(samples),
    samplesCount: samples.length,

    confidence: calcPerceptualConfidence(values),

    concept: memory.concept || {
      goal: "تثبيت ذاكرة إدراكية للحرف.",
      rule: "العينة الجديدة تضيف أثرًا ولا تمحو الذاكرة السابقة."
    },

    createdAt: new Date().toISOString()
  };

  return identity;
}


function buildFeatureValueBuckets(samples, filtered) {
  const buckets = {
    centroidValues: [],
    spreadValues: [],
    energyValues: [],
    zcrValues: [],
    durationValues: [],
    burstValues: [],
    activeRatioValues: []
  };

  const excluded = {};

  (filtered?.outlierFeatures || []).forEach(function (x) {
    excluded[
      (x.sampleId || x.file || "") +
      "::" +
      x.feature
    ] = true;
  });

  function allowed(sample, feature) {
    return !excluded[
      (sample.id || sample.file || "") +
      "::" +
      feature
    ];
  }

  samples.forEach(function (sample) {

    if (allowed(sample, "features.centroid")) {
      buckets.centroidValues.push(sample.features.centroid);
    }

    if (allowed(sample, "features.spread")) {
      buckets.spreadValues.push(sample.features.spread);
    }

    if (allowed(sample, "features.energy")) {
      buckets.energyValues.push(sample.features.energy);
    }

    if (allowed(sample, "features.zcr")) {
      buckets.zcrValues.push(sample.features.zcr);
    }

    if (allowed(sample, "duration")) {
      buckets.durationValues.push(sample.duration);
    }

    if (allowed(sample, "features.burstiness")) {
      buckets.burstValues.push(sample.features.burstiness);
    }

    if (allowed(sample, "features.activeRatio")) {
      buckets.activeRatioValues.push(
        sample.features.activeRatio || 0
      );
    }

  });

  return buckets;
}
function buildPerceptualSignature(values) {
  return {
    centroid: memoryStat(values.centroidValues),
    spread: memoryStat(values.spreadValues),
    energy: memoryStat(values.energyValues),
    zcr: memoryStat(values.zcrValues),
    duration: memoryStat(values.durationValues),
    burstiness: memoryStat(values.burstValues),
    activeRatio: memoryStat(values.activeRatioValues)
  };
}


function buildPerceptualSignatureByState(samples) {
  const byState = {};

  samples.forEach(function (s) {
    const stateKey = s.id || s.file.replace(/\.[^.]+$/, "");

    byState[stateKey] = {
      text: s.text,
      file: s.file,
      role: s.role,
      duration: memoryStat([s.duration]),
      centroid: memoryStat([s.features.centroid]),
      spread: memoryStat([s.features.spread]),
      energy: memoryStat([s.features.energy]),
      zcr: memoryStat([s.features.zcr]),
      burstiness: memoryStat([s.features.burstiness]),
      activeRatio: memoryStat([s.features.activeRatio || 0])
    };
  });

  return byState;
}

function buildMemoryUnitRecords(samples) {
  return (samples || []).map(function (s) {
    return {
      id: s.id || "",
      text: s.text || s.hmal || s.haml || "",
      file: s.file || "",
      role: s.role || "",
      coordinates: {
        memoryCentroid: roundMemory(s.features.centroid),
        memorySpread: roundMemory(s.features.spread),
        memoryEnergy: roundMemory(s.features.energy),
        memoryZcr: roundMemory(s.features.zcr),
        memoryDuration: roundMemory(s.duration),
        memoryBurstiness: roundMemory(s.features.burstiness),
        memoryActiveRatio: roundMemory(s.features.activeRatio || 0)
      }
    };
  });
}

// ======================================
// 7) حوكمة الذاكرة وخدمة القرار
// ======================================
function buildMemoryGovernanceDecision(phonemeKey, memory, identity) {
  const weakStates = [];
  const stateKeys = Object.keys(identity.perceptualSignatureByState || {});

  stateKeys.forEach(function (stateKey) {
    const state = identity.perceptualSignatureByState[stateKey];

    const warnings = [];

    if ((state.energy?.mean || 0) <= 0) warnings.push("zero-energy");
    if ((state.duration?.mean || 0) > 5) warnings.push("duration-too-long");
    if ((state.centroid?.mean || 0) <= 0) warnings.push("invalid-centroid");

    if (warnings.length) {
      weakStates.push({
        stateKey,
        warnings
      });
    }
  });

  const confidence = Number(identity.confidence || 0);
  const hasAllStates =
    Array.isArray(memory.trainingUnits) &&
    memory.trainingUnits.length === stateKeys.length;

  let decision = "usable-for-memory";
  let reason = "الذاكرة صالحة لخدمة القرار، لكنها لا تعتمد وحدها.";

  if (!stateKeys.length) {
    decision = "rejected";
    reason = "لا توجد حالات تدريبية محفوظة.";
  } else if (weakStates.length) {
    decision = "needs-review";
    reason = "بعض حالات الذاكرة ضعيفة وتحتاج مراجعة التسجيل أو التحليل.";
  } else if (confidence < 0.55) {
    decision = "not-certified";
    reason = "الثقة الإحصائية ضعيفة ولا تكفي للحكم.";
  } else if (!hasAllStates) {
    decision = "incomplete";
    reason = "لم تكتمل كل حالات الحقيبة.";
  }

  return {
    authority: "governance-core",
    department: "phoneme-core",
    decision,
    reason,
    confidence: roundMemory(confidence),
    statesCount: stateKeys.length,
    weakStates,
    memorySamplesCount:
      (typeof getAnyStoredPhonemeMemory === "function"
        ? getAnyStoredPhonemeMemory(phonemeKey)?.samplesCount
        : 0) || 0,
    principle:
      "الذاكرة تؤيد أو تعارض القرار، ولا تستبدل الجينوم ولا العائلة."
  };
}


// ======================================
// 8) استخراج الخصائص
// ======================================
function extractPerceptualFeatures(samples, sampleRate) {
  const active = detectMemoryActiveRange(samples);
  let activeSamples = samples.slice(active.start, active.end);

  const maxSamplesForSpectrum = Math.floor(sampleRate * 0.25);

  if (activeSamples.length > maxSamplesForSpectrum) {
    activeSamples = activeSamples.slice(0, maxSamplesForSpectrum);
  }

  const energy = calcMemoryRms(activeSamples);
  const zcr = calcMemoryZcr(activeSamples);
  const spectrum = memorySpectrum(activeSamples, sampleRate);
  const centroid = memorySpectralCentroid(spectrum);
  const spread = memorySpectralSpread(spectrum, centroid);
  const burstiness = calcMemoryBurstiness(activeSamples, sampleRate);

  return {
    energy,
    zcr,
    centroid,
    spread,
    burstiness,
    activeRatio: active.activeRatio
  };
}


function detectMemoryActiveRange(samples) {
  const frameSize = 512;
  const hopSize = 128;
  const energies = [];

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const frame = samples.slice(start, start + frameSize);

    energies.push({
      start,
      energy: calcMemoryRms(frame)
    });
  }

  if (!energies.length) {
    return {
      start: 0,
      end: samples.length,
      activeRatio: 1
    };
  }

  const energyValues = energies.map(function (e) {
    return e.energy;
  });

  const maxEnergy = Math.max.apply(null, energyValues);
  const noiseFloor = percentileMemory(energyValues, 0.15);
  const threshold = noiseFloor + Math.max(0, maxEnergy - noiseFloor) * 0.16;

  let startSample = 0;
  let endSample = samples.length;

  for (let i = 0; i < energies.length; i++) {
    if (energies[i].energy >= threshold) {
      startSample = energies[i].start;
      break;
    }
  }

  for (let i = energies.length - 1; i >= 0; i--) {
    if (energies[i].energy >= threshold) {
      endSample = Math.min(samples.length, energies[i].start + frameSize);
      break;
    }
  }

  return {
    start: startSample,
    end: endSample,
    activeRatio: (endSample - startSample) / Math.max(1, samples.length)
  };
}


// ======================================
// 9) الطيف والحسابات
// ======================================
function memorySpectrum(segment, sampleRate) {
  const size = nextPowerOfTwoMemory(segment.length);
  const spectrum = [];

  for (let k = 0; k < size / 2; k++) {
    let real = 0;
    let imag = 0;

    for (let n = 0; n < segment.length; n++) {
      const angle = (2 * Math.PI * k * n) / size;
      const windowed = segment[n] * hannMemory(n, segment.length);

      real += windowed * Math.cos(angle);
      imag -= windowed * Math.sin(angle);
    }

    const magnitude = Math.sqrt(real * real + imag * imag);
    const freq = (k * sampleRate) / size;

    spectrum.push({
      freq,
      magnitude
    });
  }

  return spectrum;
}


function memorySpectralCentroid(spectrum) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    weighted += bin.freq * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? weighted / total : 0;
}


function memorySpectralSpread(spectrum, centroid) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    const diff = bin.freq - centroid;
    weighted += diff * diff * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? Math.sqrt(weighted / total) : 0;
}


function calcMemoryBurstiness(samples, sampleRate) {
  const frameSize = Math.floor(sampleRate * 0.010);
  const hopSize = Math.floor(sampleRate * 0.003);
  const energies = [];

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const frame = samples.slice(start, start + frameSize);
    energies.push(calcMemoryRms(frame));
  }

  if (energies.length < 2) {
    return 0;
  }

  let maxRise = 0;

  for (let i = 1; i < energies.length; i++) {
    const rise = Math.max(0, energies[i] - energies[i - 1]);

    if (rise > maxRise) {
      maxRise = rise;
    }
  }

  const avgEnergy = averageMemory(energies);

  return avgEnergy ? maxRise / avgEnergy : 0;
}


function calcPerceptualConfidence(values) {
  const centroidScore =
    1 / (1 + varianceMemory(values.centroidValues) / 100000);

  const spreadScore =
    1 / (1 + varianceMemory(values.spreadValues) / 100000);

  const energyScore =
    1 / (1 + varianceMemory(values.energyValues) * 100);

  const zcrScore =
    1 / (1 + varianceMemory(values.zcrValues) * 100);

  const burstScore =
    1 / (1 + varianceMemory(values.burstValues));

  const activeScore =
    1 / (1 + varianceMemory(values.activeRatioValues || []) * 10);

  return (
    centroidScore * 0.22 +
    spreadScore * 0.18 +
    energyScore * 0.15 +
    zcrScore * 0.12 +
    burstScore * 0.23 +
    activeScore * 0.10
  );
}


// ======================================
// 10) بناء التراكمات الاحتياطية
// ======================================
function buildCumulativePerceptualSignature(samples) {
  const result = {};

  MEMORY_FEATURE_KEYS.forEach(function (featureKey) {
    const values = [];

    samples.forEach(function (sample) {
      const sig =
        sample.perceptualSignature ||
        sample.identity?.perceptualSignature;

      if (
        sig &&
        sig[featureKey] &&
        typeof sig[featureKey].mean === "number"
      ) {
        values.push(sig[featureKey].mean);
      }
    });

    result[featureKey] = memoryStat(values);
  });

  return result;
}


function buildCumulativePerceptualSignatureByState(samples) {
  const byState = {};

  samples.forEach(function (sample) {
    const stateMap =
      sample.perceptualSignatureByState ||
      sample.identity?.perceptualSignatureByState ||
      {};

    Object.keys(stateMap).forEach(function (stateKey) {
      if (!byState[stateKey]) byState[stateKey] = {};

      MEMORY_FEATURE_KEYS.forEach(function (featureKey) {
        const stat = stateMap[stateKey][featureKey];

        if (!stat || typeof stat.mean !== "number") return;

        if (!byState[stateKey][featureKey]) {
          byState[stateKey][featureKey] = [];
        }

        byState[stateKey][featureKey].push(stat.mean);
      });
    });
  });

  const result = {};

  Object.keys(byState).forEach(function (stateKey) {
    result[stateKey] = {};

    Object.keys(byState[stateKey]).forEach(function (featureKey) {
      result[stateKey][featureKey] = memoryStat(
        byState[stateKey][featureKey]
      );
    });
  });

  return result;
}


// ======================================
// 11) عرض تقرير الذاكرة
// ======================================
function renderPhonemeMemoryReport(identity) {
  if (identity && identity.latestPerceptualIdentity) {
    identity = identity.latestPerceptualIdentity;
  }

  if (!identity || !identity.trainingUnits) {
    const html =
      "<div style='color:#facc15;font-weight:bold;'>🧠 الذاكرة موجودة لكن لا تحتوي تقريرًا تدريبيًا مفصلًا بعد.</div>" +
      "<pre style='white-space:pre-wrap; direction:ltr; text-align:left; background:#111827; padding:10px; border-radius:8px; color:#e5e7eb;'>" +
      JSON.stringify(identity || {}, null, 2) +
      "</pre>";

    if (typeof renderToUnifiedPanel === "function") {
      renderToUnifiedPanel(html);
    }

    return;
  }

  const html = `
    <div style="
      font-size:18px;
      font-weight:bold;
      color:${identity.color.hex};
      margin-bottom:10px;
    ">
      🎨 ذاكرة لون ${identity.label}
    </div>

    <div>الحرف: <b>${identity.phoneme}</b></div>

    <div>
      اللون:
      <b style="color:${identity.color.hex}">
        ${identity.color.name}
      </b>
    </div>

    <div>
      عدد العينات في هذا البناء:
      <div>
  العينات النظيفة للقرار:
  <b>${identity.cleanSamplesCount || identity.samplesCount || identity.trainingUnits.length}</b>
</div>

<div>
  العينات الشاذة:
  <b>${(identity.outlierSamples || []).length}</b>
</div>
      <b>${identity.samplesCount || identity.trainingUnits.length}</b>
    </div>

    <div>
      الثقة الإدراكية:
      <b>${Number(identity.confidence || 0).toFixed(4)}</b>
    </div>

    <div>
      حكم الذاكرة:
      <b style="color:#facc15;">${identity.governance?.decision || "غير محدد"}</b>
    </div>

    <div style="font-size:13px;color:#cbd5e1;">
      ${identity.governance?.reason || ""}
    </div>

    <hr style="border-color:#1f2937;">

    <div style="font-weight:bold;margin:8px 0;">
      الوحدات التدريبية
    </div>

    ${identity.trainingUnits
      .map(function (u) {
        return `
        <div style="
          background:#111827;
          padding:8px;
          margin:6px 0;
          border-radius:8px;
        ">
          <div><b>${u.text}</b> — ${u.file}</div>
          <div>centroid: ${u.centroid}Hz</div>
          <div>spread: ${u.spread}</div>
          <div>energy: ${u.energy}</div>
          <div>zcr: ${u.zcr}</div>
          <div>burstiness: ${u.burstiness}</div>
          <div>activeRatio: ${u.activeRatio}</div>
        </div>
      `;
      })
      .join("")}

    <hr style="border-color:#1f2937;">

    <div>الهدف: ${identity.concept?.goal || ""}</div>
    <div>القاعدة: ${identity.concept?.rule || ""}</div>
  `;

  if (typeof renderToUnifiedPanel === "function") {
    saveCurrentSessionReport(
  "memory",
  "🧠 تقرير الذاكرة الإدراكية",
  html
);
    renderToUnifiedPanel(html);
  } else {
    console.warn("⚠️ مدير التقارير الموحد غير متاح لعَرض الذاكرة الإدراكية.");
  }
}


// ======================================
// 12) قراءة الصوت مع بقاء التسجيل بعد تحديث الصفحة
// ======================================
function getAudioPromiseForMemory(key, timeoutMs) {
  timeoutMs = timeoutMs || 3000;

  return new Promise(function (resolve) {
    let done = false;

    function finish(blob) {
      if (done) return;
      done = true;
      resolve(blob || null);
    }

    if (typeof getAudio === "function") {
      try {
        getAudio(key, function (blob) {
          if (blob) {
            persistTrainingAudioToLocalStorage(key, blob);
            finish(blob);
            return;
          }

          const localBlob = getTrainingAudioFromLocalStorage(key);
          finish(localBlob);
        });
      } catch (err) {
        console.warn("تعذر getAudio:", key, err);
        const localBlob = getTrainingAudioFromLocalStorage(key);
        finish(localBlob);
      }
    } else {
      const localBlob = getTrainingAudioFromLocalStorage(key);
      finish(localBlob);
    }

    setTimeout(function () {
      finish(null);
    }, timeoutMs);
  });
}

function persistTrainingAudioToLocalStorage(key, blob) {
  try {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const dataUrl = reader.result;

        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          localStorage.removeItem(key);
          localStorage.removeItem("record_" + key);

          localStorage.setItem("audio_" + key, dataUrl);

          console.log("💾 تم حفظ التسجيل الخام مرة واحدة:", key);
        }
      } catch (err) {
        console.warn("⚠️ تعذر حفظ التسجيل الخام:", key, err);
      }
    };

    reader.readAsDataURL(blob);
  } catch (err) {
    console.warn("⚠️ فشل تجهيز حفظ التسجيل الخام:", key, err);
  }
}

function getTrainingAudioFromLocalStorage(fileName) {
  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName);

  if (!dataUrl || typeof dataUrl !== "string") {
    return null;
  }

  if (!dataUrl.startsWith("data:")) {
    return null;
  }

  return dataUrlToBlobMemory(dataUrl);
}


function dataUrlToBlobMemory(dataUrl) {
  const parts = dataUrl.split(",");
  const meta = parts[0];
  const base64 = parts[1];

  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "audio/webm";

  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: mime
  });
}


async function decodeBlobToMonoForMemory(blob) {
  const arrayBuffer = await blob.arrayBuffer();

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  const ctx = new AudioContextClass();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

  return {
    samples: audioBuffer.getChannelData(0),
    sampleRate: audioBuffer.sampleRate
  };
}


// ======================================
// 13) شاشة التحميل
// ======================================
function showPhonemeTrainingLoading(text) {
  let box = document.getElementById("global-loading");

  if (!box) {
    box = document.createElement("div");
    box.id = "global-loading";
    box.style.position = "fixed";
    box.style.top = "0";
    box.style.left = "0";
    box.style.right = "0";
    box.style.bottom = "0";
    box.style.background = "rgba(0,0,0,0.75)";
    box.style.zIndex = "99999";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.color = "white";
    box.style.fontSize = "20px";
    box.style.textAlign = "center";
    box.style.padding = "20px";

    document.body.appendChild(box);
  }

  box.innerHTML = "⏳ " + text;
  box.style.display = "flex";
}


function hidePhonemeTrainingLoading() {
  const box = document.getElementById("global-loading");

  if (box) {
    box.style.display = "none";
  }
}


// ======================================
// 14) أدوات رياضية
// ======================================
function calcMemoryRms(frame) {
  if (!frame.length) return 0;

  let sum = 0;

  for (let i = 0; i < frame.length; i++) {
    sum += frame[i] * frame[i];
  }

  return Math.sqrt(sum / frame.length);
}


function calcMemoryZcr(frame) {
  if (!frame.length) return 0;

  let count = 0;

  for (let i = 1; i < frame.length; i++) {
    if (
      (frame[i - 1] >= 0 && frame[i] < 0) ||
      (frame[i - 1] < 0 && frame[i] >= 0)
    ) {
      count++;
    }
  }

  return count / frame.length;
}


function memoryStat(values) {
  const clean = values.filter(function (v) {
    return typeof v === "number" && Number.isFinite(v);
  });

  if (!clean.length) {
    return {
      mean: 0,
      variance: 0,
      min: 0,
      max: 0
    };
  }

  return {
    mean: roundMemory(averageMemory(clean)),
    variance: roundMemory(varianceMemory(clean)),
    min: roundMemory(Math.min.apply(null, clean)),
    max: roundMemory(Math.max.apply(null, clean))
  };
}


function averageMemory(arr) {
  if (!arr.length) return 0;

  return arr.reduce(function (a, b) {
    return a + b;
  }, 0) / arr.length;
}


function varianceMemory(arr) {
  if (!arr.length) return 0;

  const avg = averageMemory(arr);

  return averageMemory(
    arr.map(function (v) {
      const d = v - avg;
      return d * d;
    })
  );
}


function percentileMemory(values, ratio) {
  if (!values.length) return 0;

  const sorted = values.slice().sort(function (a, b) {
    return a - b;
  });

  const index = Math.max(
    0,
    Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))
  );

  return sorted[index];
}


function hannMemory(n, length) {
  if (length <= 1) return 1;

  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (length - 1)));
}


function nextPowerOfTwoMemory(n) {
  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


function roundMemory(num) {
  return Number(Number(num || 0).toFixed(4));
}


// ======================================
// 15) التصدير العام
// ======================================
window.trainPhonemeMemory = trainPhonemeMemory;
window.renderPhonemeMemoryReport = renderPhonemeMemoryReport;
window.getAudioPromiseForMemory = getAudioPromiseForMemory;
window.getMemoryForTraining = getMemoryForTraining;
window.savePerceptualIdentityEverywhere = savePerceptualIdentityEverywhere;
window.buildPerceptualIdentity = buildPerceptualIdentity;
window.buildMemoryGovernanceDecision = buildMemoryGovernanceDecision;
window.buildCumulativePerceptualSignature = buildCumulativePerceptualSignature;
window.buildCumulativePerceptualSignatureByState =
  buildCumulativePerceptualSignatureByState;
window.buildMemoryUnitRecords = buildMemoryUnitRecords;
console.log("🎨 مدرب الذاكرة الإدراكية جاهز V3 كامل");
