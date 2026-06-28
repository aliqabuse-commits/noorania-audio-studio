// ================================
// phoneme-core/phoneme-cognitive-engine.js
// المحرك الإدراكي المركزي للحرف — V5
// خدمة القرار + الحوكمة + خلية النحل
// يبني:
// 1) جينوم مركزي عام
// 2) جينوم مستقل لكل حالة
// 3) تقرير قرار إدراكي
// 4) أثرًا في الذاكرة التراكمية دون مسح القديم
// ================================

console.log("🧠 phoneme-cognitive-engine.js جاهز V5 — Decision Governed Cognitive Engine");

const COGNITIVE_ENGINE_VERSION = "V5-decision-governed";

const COGNITIVE_FEATURE_KEYS = [
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


// ======================================
// 1) تحميل الصوت المخزن
// ======================================
async function getStoredAudio(fileName) {
  console.log("🔎 COGNITIVE LOAD:", fileName);

  if (typeof getAudioPromiseForMemory === "function") {
    const blob = await getAudioPromiseForMemory(fileName, 3000);

    if (blob) {
      console.log("✅ from getAudioPromiseForMemory:", fileName, blob);
      persistAudioBlobBackup(fileName, blob);
      return blob;
    }
  }

  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName) ||
    localStorage.getItem("record_" + fileName);

  console.log(
    "📦 from localStorage:",
    fileName,
    dataUrl ? String(dataUrl).substring(0, 40) : null
  );

  if (dataUrl && String(dataUrl).startsWith("data:")) {
    return cognitiveDataUrlToBlob(dataUrl);
  }

  throw new Error("الصوت غير موجود: " + fileName);
}


// ======================================
// 2) حفظ نسخة احتياطية من التسجيل
// ======================================
function persistAudioBlobBackup(fileName, blob) {
  console.log("ℹ️ تم منع حفظ نسخة الصوت الخام في localStorage:", fileName);
  return;
}


// ======================================
// 3) بناء الهوية الإدراكية المركزية لحرف
// ======================================
async function buildPhonemeCognitiveIdentity(phonemeKey) {
  try {
    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!pack) {
      alert("لا توجد حقيبة تدريب لهذا الحرف: " + phonemeKey);
      return null;
    }

    const oldMemory = getAnyStoredPhonemeMemory(phonemeKey);

    const colorBinding =
      typeof bindPhonemeToColor === "function"
        ? bindPhonemeToColor(pack.colorKey || phonemeKey)
        : null;

    const color = {
      hex:
        colorBinding?.hex ||
        oldMemory?.color?.hex ||
        pack.colorHex ||
        "#38BDF8",

      name:
        colorBinding?.colorName ||
        oldMemory?.color?.name ||
        oldMemory?.colorName ||
        pack.colorName ||
        "Noorani Color"
    };

    const label = oldMemory?.label || pack.name || phonemeKey;
    const phoneme = oldMemory?.phoneme || pack.letter || phonemeKey;
    const units = pack.positions || [];

    if (!units.length) {
      alert("حقيبة التدريب لا تحتوي وحدات");
      return null;
    }

    const cognitiveUnits = [];

    for (const unit of units) {
      const blob = await getStoredAudio(unit.file);

      if (!blob) {
        throw new Error("الصوت غير موجود: " + unit.file);
      }

      const decoded = await decodeCognitiveBlob(blob);

      if (typeof validatePhonemeSignal === "function") {
        const result = validatePhonemeSignal(
          decoded.samples,
          decoded.sampleRate
        );

        if (!result.accepted) {
          console.warn(
            "⚠️ تم تجاهل العينة لأنها غير صالحة:",
            unit.file,
            result
          );
          continue;
        }
      }

      const timeline = buildCognitiveTimeline(
        decoded.samples,
        decoded.sampleRate
      );

      const phases = detectCognitivePhases(timeline);
      const summary = summarizeCognitiveTimeline(timeline, phases);
      const decisionTrace = buildUnitDecisionTrace(unit, summary, phases);

      cognitiveUnits.push({
        id: unit.id || unit.file.replace(/\.[^.]+$/, ""),
        text: unit.hmal || unit.haml || unit.text,
        file: unit.file,
        role: unit.role,
        description: unit.description || "",
        timeline,
        phases,
        summary,
        decisionTrace
      });
    }

    if (!cognitiveUnits.length) {
      alert("❌ لا توجد عينات صالحة لبناء الجينوم الإدراكي للحرف " + label);
      return null;
    }

    const filtered =
  typeof filterCleanSamplesForFamilyRecord === "function"
    ? filterCleanSamplesForFamilyRecord(cognitiveUnits)
    : { cleanSamples: cognitiveUnits, outlierSamples: [], report: null };

const decisionUnits = filtered.cleanSamples.length
  ? filtered.cleanSamples
  : cognitiveUnits;

const genome = buildCognitiveGenome(decisionUnits);
const genomeByState = buildCognitiveGenomeByState(cognitiveUnits);
const spectralSeal =
  buildSpectralSealFromCognitiveUnits(decisionUnits);
    genome.spectralSeal = spectralSeal;
    let familyDecision = null;

if (typeof buildFamilyDecisionForPhoneme === "function") {
  familyDecision = buildFamilyDecisionForPhoneme(phonemeKey, pack);
} else if (typeof buildFamilyDecisionContext === "function") {
  familyDecision = normalizeFamilyDecisionForCognitiveEngine(
    buildFamilyDecisionContext(phonemeKey)
  );
} else {
  familyDecision = buildFallbackFamilyDecision(phonemeKey, pack);
}
    const governance = buildCognitiveGovernanceDecision({
      phonemeKey,
      pack,
      cognitiveUnits,
      genome,
genomeByState,
unitRecords: buildCognitiveUnitRecords(cognitiveUnits),
familyDecision,
      oldMemory
    });

    const identity = {
      method: "Noorani Central Cognitive Engine V5",
      version: COGNITIVE_ENGINE_VERSION,
      familyRecordVersion: 2,
      phonemeKey,
      key: phonemeKey,
      phoneme,
      label,
      color,

      pack: {
        key: pack.key || phonemeKey,
        letter: pack.letter || phoneme,
        name: pack.name || label,
        traits: pack.traits || {}
      },

      units: cognitiveUnits.map(function (u) {
        return {
          id: u.id,
          text: u.hmal || u.haml || u.text,
          file: u.file,
          role: u.role,
          description: u.description,
          phases: u.phases,
          summary: u.summary,
          decisionTrace: u.decisionTrace
        };
      }),

      genome,
genomeByState,
unitRecords: buildCognitiveUnitRecords(cognitiveUnits),
familyDecision,
governance,
      outlierSamples: filtered.outlierSamples,
outlierReport: filtered.report,
cleanSamplesCount: decisionUnits.length,
      createdAt: new Date().toISOString()
    };

    saveCognitiveIdentityAndCumulativeMemory(phonemeKey, identity);
sendCognitiveGenomeKnowledgeSignal(
  phonemeKey,
  {
    genome: identity.genome,
    genomeByState: identity.genomeByState,
    governance: identity.governance,
    familyDecision: identity.familyDecision
  },
  identity.governance?.evidence?.phaseQualityMean || null
);
    
    renderCognitiveReport(identity);

    return identity;
  } catch (err) {
    console.error("❌ فشل بناء الهوية الإدراكية المركزية", err);
    alert("فشل بناء الهوية الإدراكية المركزية:\n" + err.message);
    return null;
  }
}


// ======================================
// 4) حفظ الجينوم + الذاكرة التراكمية
// ======================================
function saveCognitiveIdentityAndCumulativeMemory(phonemeKey, identity) {
  const lightIdentity = {
    method: identity.method,
    version: identity.version,
    familyRecordVersion: identity.familyRecordVersion,
phonemeKey: identity.phonemeKey,
    key: identity.key,
    phoneme: identity.phoneme,
    label: identity.label,
    color: identity.color,
    pack: identity.pack,
    units: (identity.units || []).map(function (u) {
    return {
      id: u.id,
      text: u.hmal || u.haml || u.text,
      file: u.file,
      role: u.role,
      description: u.description,
      phases: u.phases,
      summary: u.summary,
      decisionTrace: u.decisionTrace
    };
  }),
  genome: identity.genome,
  genomeByState: identity.genomeByState,
   unitRecords: (identity.unitRecords || []).map(function (r) {
  return {
    id: r.id,
    text: r.text,
    file: r.file,
    role: r.role,
    coordinates: r.coordinates
  };
}),
  familyDecision: identity.familyDecision,
  governance: identity.governance,
  createdAt: identity.createdAt,

outlierSamples: identity.outlierSamples || [],
outlierReport: identity.outlierReport || null,
cleanSamplesCount: identity.cleanSamplesCount || null
};

localStorage.setItem(
  phonemeKey + "_cognitive_identity",
  JSON.stringify(lightIdentity)
);

  let cumulativeMemory = null;

  if (typeof addCognitiveIdentityToCumulativeMemory === "function") {
    cumulativeMemory = addCognitiveIdentityToCumulativeMemory(
      phonemeKey,
      identity
    );
  } else {
    cumulativeMemory = updatePhonemeCumulativeMemory(phonemeKey, identity);
  }

  saveMemoryUnderKnownKeys(phonemeKey, cumulativeMemory);

  console.log("💾 تم حفظ الجينوم والذاكرة التراكمية:", {
    phonemeKey,
    samplesCount: cumulativeMemory.samplesCount,
    decision: identity.governance?.decision
  });

  return cumulativeMemory;
}


function saveMemoryUnderKnownKeys(phonemeKey, memory) {
  if (!memory) return;

  const lightMemory = {
    method: memory.method,
    phonemeKey: memory.phonemeKey || phonemeKey,
    key: memory.key || phonemeKey,
    phoneme: memory.phoneme,
    label: memory.label,
    color: memory.color,
    pack: memory.pack,
    samplesCount: memory.samplesCount || 0,
    cumulativeGenome: memory.cumulativeGenome || {},
    cumulativeGenomeByState: memory.cumulativeGenomeByState || {},
    latestGovernance: memory.latestGovernance || null,
    updatedAt: memory.updatedAt || new Date().toISOString()
  };

  localStorage.setItem(
    phonemeKey + "_cumulative_memory",
    JSON.stringify(lightMemory)
  );

  localStorage.removeItem(
  "cognitive_memory_" + phonemeKey
);
}

// ======================================
// 5) قراءة أي ذاكرة محفوظة باسم معروف
// ======================================
function getAnyStoredPhonemeMemory(phonemeKey) {
  const keys = [
    phonemeKey + "_cumulative_memory",
    phonemeKey + "_perceptual_identity",
    phonemeKey + "_memory",
    "phoneme_memory_" + phonemeKey,
    "cognitive_memory_" + phonemeKey
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);

    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.warn("⚠️ ذاكرة تالفة:", key, err);
      }
    }
  }

  return null;
}


// ======================================
// 6) تحديث الذاكرة التراكمية للحرف
// احتياطيًا إلى حين وجود phoneme-cumulative-memory.js
// ======================================
function updatePhonemeCumulativeMemory(phonemeKey, identity) {
  const oldMemory = getAnyStoredPhonemeMemory(phonemeKey);

  const sample = {
    id: phonemeKey + "_cognitive_" + Date.now(),
    createdAt: new Date().toISOString(),
    source: "cognitive-identity",
    phonemeKey,
    key: phonemeKey,
    phoneme: identity.phoneme,
    label: identity.label,
    units: identity.units || [],
    genome: identity.genome || {},
    genomeByState: identity.genomeByState || {},
    governance: identity.governance || {}
  };

  const memory = oldMemory || {
    method: "Noorani Cumulative Phoneme Memory V2",
    phonemeKey,
    key: phonemeKey,
    phoneme: identity.phoneme,
    label: identity.label,
    color: identity.color,
    pack: identity.pack,
    samplesCount: 0,
    samples: [],
    attemptHistory: [],
    cumulativeGenome: {},
    cumulativeGenomeByState: {},
    latestIdentity: null,
    latestGovernance: null,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  if (!Array.isArray(memory.samples)) memory.samples = [];
  if (!Array.isArray(memory.attemptHistory)) memory.attemptHistory = [];

  memory.samples.push(sample);
if (memory.samples.length > 20) {
  memory.samples = memory.samples.slice(-20);
}
  memory.attemptHistory.push({
    id: sample.id,
    createdAt: sample.createdAt,
    source: sample.source,
    unitsCount: sample.units.length,
    accepted: identity.governance?.decision !== "rejected",
    decision: identity.governance?.decision || "unknown",
    decisionReason: identity.governance?.reason || "",
    genomeKeys: Object.keys(sample.genome || {})
  });
if (memory.attemptHistory.length > 50) {
  memory.attemptHistory =
    memory.attemptHistory.slice(-50);
}
  memory.samplesCount = memory.samples.length;
  memory.latestIdentity = identity;
  memory.latestGovernance = identity.governance || null;
  memory.latestIdentity = {
  method: identity.method,
  version: identity.version,
  phonemeKey: identity.phonemeKey,
  key: identity.key,
  phoneme: identity.phoneme,
  label: identity.label,
  color: identity.color,
  pack: identity.pack,
  genome: identity.genome,
  genomeByState: identity.genomeByState,
  familyDecision: identity.familyDecision,
  governance: identity.governance,
  createdAt: identity.createdAt
};
  memory.pack = identity.pack;
  memory.updatedAt = new Date().toISOString();
  memory.cumulativeGenome = buildCumulativeGenomeFromSamples(memory.samples);
  memory.cumulativeGenomeByState =
    buildCumulativeGenomeByStateFromSamples(memory.samples);

  return memory;
}


// ======================================
// 7) بناء الجينوم التراكمي من العينات السابقة
// ======================================
function buildCumulativeGenomeFromSamples(samples) {
  const result = {};

  COGNITIVE_FEATURE_KEYS.forEach(function (key) {
    const values = [];

    samples.forEach(function (sample) {
      if (
        sample.genome &&
        sample.genome[key] &&
        typeof sample.genome[key].mean === "number"
      ) {
        values.push(sample.genome[key].mean);
      }

      if (
        sample.identity &&
        sample.identity.perceptualSignature &&
        sample.identity.perceptualSignature[key] &&
        typeof sample.identity.perceptualSignature[key].mean === "number"
      ) {
        values.push(sample.identity.perceptualSignature[key].mean);
      }
    });

    result[key] = cumulativeStat(values);
  });

  return result;
}


function buildCumulativeGenomeByStateFromSamples(samples) {
  const byState = {};

  samples.forEach(function (sample) {
    const src = sample.genomeByState || {};

    Object.keys(src).forEach(function (stateKey) {
      if (!byState[stateKey]) byState[stateKey] = {};

      COGNITIVE_FEATURE_KEYS.forEach(function (featureKey) {
        const stat = src[stateKey][featureKey];

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
      result[stateKey][featureKey] = cumulativeStat(
        byState[stateKey][featureKey]
      );
    });
  });

  return result;
}


function cumulativeStat(values) {
  if (!values.length) {
    return {
      samplesCount: 0,
      mean: 0,
      variance: 0,
      min: 0,
      max: 0
    };
  }

  return {
    samplesCount: values.length,
    mean: roundCognitive(avgCognitive(values)),
    variance: roundCognitive(varCognitive(values)),
    min: roundCognitive(Math.min.apply(null, values)),
    max: roundCognitive(Math.max.apply(null, values))
  };
}


// ======================================
// 8) أدوات الصوت
// ======================================
async function getCognitiveAudioBlob(fileName) {
  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName);

  if (!dataUrl || !dataUrl.startsWith("data:")) return null;

  return cognitiveDataUrlToBlob(dataUrl);
}


function cognitiveDataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const meta = parts[0];
  const base64 = parts[1];
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "audio/webm";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}


async function decodeCognitiveBlob(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContextClass();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

  return {
    samples: audioBuffer.getChannelData(0),
    sampleRate: audioBuffer.sampleRate
  };
}


// ======================================
// 9) بناء المسار والتحليل
// ======================================
function buildCognitiveTimeline(samples, sampleRate) {
  const frameSize = Math.max(128, Math.floor(sampleRate * 0.010));
  const hopSize = Math.max(64, Math.floor(sampleRate * 0.005));
  const timeline = [];

  for (
    let start = 0;
    start + frameSize <= samples.length;
    start += hopSize
  ) {
    const frame = samples.slice(start, start + frameSize);
    const energy = cognitiveRms(frame);
    const zcr = cognitiveZcr(frame);
    const spectrum = cognitiveSpectrum(frame, sampleRate);
    const centroid = cognitiveSpectralCentroid(spectrum);
    const spread = cognitiveSpectralSpread(spectrum, centroid);

    timeline.push({
      t: start / sampleRate,
      energy,
      zcr,
      centroid,
      spread
    });
  }

  return timeline;
}


function detectCognitivePhases(timeline) {
  if (!timeline.length) {
    return emptyCognitivePhases();
  }

  const energies = timeline.map(function (f) {
    return f.energy;
  });

  const maxEnergy = Math.max.apply(null, energies);
  const noiseFloor = percentileCognitive(energies, 0.15);
  const dynamic = Math.max(0, maxEnergy - noiseFloor);
  const threshold = noiseFloor + dynamic * 0.22;

  let onsetIndex = 0;

  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].energy >= threshold) {
      onsetIndex = i;
      break;
    }
  }

  let burstIndex = onsetIndex;
  let maxRise = -Infinity;

  for (let i = onsetIndex + 1; i < timeline.length; i++) {
    const rise = timeline[i].energy - timeline[i - 1].energy;

    if (rise > maxRise) {
      maxRise = rise;
      burstIndex = i;
    }
  }

  let endIndex = timeline.length - 1;
  const releaseThreshold = noiseFloor + dynamic * 0.14;

  for (let i = timeline.length - 1; i >= onsetIndex; i--) {
    if (timeline[i].energy >= releaseThreshold) {
      endIndex = i;
      break;
    }
  }

  const activeLength = Math.max(1, endIndex - onsetIndex + 1);
  const maxActiveFrames = Math.max(8, Math.round(timeline.length * 0.65));

  if (activeLength > maxActiveFrames) {
    endIndex = Math.min(timeline.length - 1, onsetIndex + maxActiveFrames);
  }

  const coreStart = Math.min(burstIndex + 1, endIndex);
  const coreEnd = Math.max(coreStart, endIndex - 1);

  return {
    onset: timeline[onsetIndex]?.t || 0,
    burst: timeline[burstIndex]?.t || 0,
    coreStart: timeline[coreStart]?.t || 0,
    coreEnd: timeline[coreEnd]?.t || 0,
    tail: timeline[endIndex]?.t || 0,
    onsetIndex,
    burstIndex,
    coreStartIndex: coreStart,
    coreEndIndex: coreEnd,
    tailIndex: endIndex,
    threshold: roundCognitive(threshold),
    noiseFloor: roundCognitive(noiseFloor)
  };
}


function emptyCognitivePhases() {
  return {
    onset: null,
    burst: null,
    coreStart: null,
    coreEnd: null,
    tail: null,
    onsetIndex: 0,
    burstIndex: 0,
    coreStartIndex: 0,
    coreEndIndex: 0,
    tailIndex: 0
  };
}


function summarizeCognitiveTimeline(timeline, phases) {
  const active = timeline.slice(
    phases.onsetIndex || 0,
    (phases.tailIndex || timeline.length - 1) + 1
  );

  const burstFrame = timeline[phases.burstIndex || 0] || {};

  return {
    duration: active.length
      ? roundCognitive(active[active.length - 1].t - active[0].t)
      : 0,

    meanEnergy: roundCognitive(avgCognitive(active.map(f => f.energy))),
    meanZcr: roundCognitive(avgCognitive(active.map(f => f.zcr))),
    meanCentroid: roundCognitive(avgCognitive(active.map(f => f.centroid))),
    meanSpread: roundCognitive(avgCognitive(active.map(f => f.spread))),
    burstEnergy: roundCognitive(burstFrame.energy || 0),
    burstCentroid: roundCognitive(burstFrame.centroid || 0),
    burstSpread: roundCognitive(burstFrame.spread || 0),
    energyMovement: roundCognitive(movementCognitive(active.map(f => f.energy))),
    spectralMovement: roundCognitive(movementCognitive(active.map(f => f.centroid))),
    activeFrames: active.length,
activeRatio: roundCognitive(
  active.length / Math.max(1, timeline.length)
),
phaseQuality: scorePhaseQuality(active, phases)
  };
}


function scorePhaseQuality(active, phases) {
  if (!active.length) return 0;

  const durationFrames = active.length;
  const hasOrder =
    phases.onsetIndex <= phases.burstIndex &&
    phases.burstIndex <= phases.coreStartIndex &&
    phases.coreStartIndex <= phases.coreEndIndex &&
    phases.coreEndIndex <= phases.tailIndex;

  let score = hasOrder ? 0.55 : 0.2;

  if (durationFrames >= 4) score += 0.2;
  if (durationFrames <= 160) score += 0.15;
  if ((phases.tailIndex - phases.onsetIndex) > 0) score += 0.1;

  return roundCognitive(Math.min(1, score));
}


function buildCognitiveGenome(units) {
  const summaries = units.map(function (u) {
    return u.summary;
  });

  const genome = {};

  COGNITIVE_FEATURE_KEYS.forEach(function (key) {
    const fieldName =
      key === "energy" ? "meanEnergy" :
      key === "zcr" ? "meanZcr" :
      key === "centroid" ? "meanCentroid" :
      key === "spread" ? "meanSpread" :
      key;

    genome[key] = statCognitive(
      summaries.map(function (s) {
        return s[fieldName];
      })
    );
  });

  genome.phaseQuality = statCognitive(
    summaries.map(function (s) {
      return s.phaseQuality || 0;
    })
  );

  return genome;
}


function buildCognitiveGenomeByState(units) {
  const byState = {};

  units.forEach(function (unit) {
    const key = unit.id || unit.file.replace(/\.[^.]+$/, "");
    const summary = unit.summary;

    byState[key] = {
     text: unit.hmal || unit.haml || unit.text,
      role: unit.role,
      file: unit.file,
      duration: statCognitive([summary.duration]),
      energy: statCognitive([summary.meanEnergy]),
      zcr: statCognitive([summary.meanZcr]),
      centroid: statCognitive([summary.meanCentroid]),
      spread: statCognitive([summary.meanSpread]),
      burstEnergy: statCognitive([summary.burstEnergy]),
      burstCentroid: statCognitive([summary.burstCentroid]),
      burstSpread: statCognitive([summary.burstSpread]),
      energyMovement: statCognitive([summary.energyMovement]),
      spectralMovement: statCognitive([summary.spectralMovement]),
      phaseQuality: statCognitive([summary.phaseQuality || 0])
    };
  });

  return byState;
}

function buildCognitiveUnitRecords(units) {
  return (units || []).map(function (unit) {
    const s = unit.summary || {};
    const p = unit.phases || {};

    return {
      id: unit.id,
      text: unit.text || "",
      file: unit.file || "",
      role: unit.role || "",
      coordinates: {
        energy: s.meanEnergy,
        centroid: s.meanCentroid,
        spread: s.meanSpread,
        zcr: s.meanZcr,
        duration: s.duration,

        burstEnergy: s.burstEnergy,
        burstCentroid: s.burstCentroid,
        burstSpread: s.burstSpread,
sealCentroid: s.meanCentroid,
sealSpread: s.meanSpread,
sealBurstCentroid: s.burstCentroid,
sealBurstSpread: s.burstSpread,
        energyMovement: s.energyMovement,
        spectralMovement: s.spectralMovement,
        phaseQuality: s.phaseQuality,
        activeRatio: s.activeRatio,

        timelineOnset: p.onsetIndex,
        timelineBurst: p.burstIndex,
        timelineTransition: p.coreStartIndex,
        timelineSustain: p.coreEndIndex,
        timelineRelease: p.tailIndex,

        externalCognitiveOnset: p.onsetIndex,
        externalCognitiveBurst: p.burstIndex,
        externalCognitiveCoreStart: p.coreStartIndex,
        externalCognitiveCoreEnd: p.coreEndIndex,
        externalCognitiveTail: p.tailIndex
      }
    };
  });
}
function buildSpectralSealFromCognitiveUnits(units) {
  const centroids = [];
  const spreads = [];
  const burstCentroids = [];
  const burstSpreads = [];

  units.forEach(function (u) {
    if (!u.summary) return;

    centroids.push(u.summary.meanCentroid || 0);
    spreads.push(u.summary.meanSpread || 0);
    burstCentroids.push(u.summary.burstCentroid || 0);
    burstSpreads.push(u.summary.burstSpread || 0);
  });

  return {
    method: "Noorani Spectral Seal From Six-State Genome V1",
    samplesCount: units.length,

    averageCentroid: roundCognitive(avgCognitive(centroids)),
    averageSpread: roundCognitive(avgCognitive(spreads)),
    averageBurstCentroid: roundCognitive(avgCognitive(burstCentroids)),
    averageBurstSpread: roundCognitive(avgCognitive(burstSpreads)),

    centroidStability: roundCognitive(1 / (1 + varCognitive(centroids))),
    spreadStability: roundCognitive(1 / (1 + varCognitive(spreads))),

    confidence: roundCognitive(
      Math.min(
        1,
        units.length / 6
      )
    )
  };
}


// ======================================
// 10) خدمة القرار والحوكمة
// ======================================
function buildUnitDecisionTrace(unit, summary, phases) {
  const warnings = [];

  if (summary.duration > 1.2) warnings.push("active-duration-too-long");
  if (summary.phaseQuality < 0.65) warnings.push("weak-phase-quality");
  if (summary.burstEnergy <= 0) warnings.push("missing-burst-energy");
  if (!Number.isFinite(summary.meanCentroid)) warnings.push("invalid-centroid");

  return {
    unit: unit.id || unit.file,
    role: unit.role,
    text: unit.hmal || unit.haml || unit.text,
    phaseQuality: summary.phaseQuality,
    warnings,
    usableForDecision: warnings.length === 0
  };
}


function buildFallbackFamilyDecision(phonemeKey, pack) {
  return {
    source: "fallback",
    phonemeKey,
    family: pack?.traits || {},
    competitors: [],
    decisiveTraits: [],
    note:
      "لم يتم تحميل phoneme-family-map.js بعد؛ القرار العائلي غير مكتمل."
  };
}

function normalizeFamilyDecisionForCognitiveEngine(context) {
  const competitors = [];
  const decisiveTraits = [];

  if (!context) {
    return {
      source: "phoneme-family-map",
      phonemeKey: "",
      family: "unknown-family",
      competitors: [],
      decisiveTraits: [],
      note: "خريطة العائلة لم ترجع سياقًا صالحًا."
    };
  }

  (context.candidates || []).forEach(function (c) {
    competitors.push({
      key: c.key,
      reason: c.reason,
      decisiveTraits: c.decisiveTraits || [],
      observedDifferences: c.observedDifferences || []
    });

    (c.decisiveTraits || []).forEach(function (t) {
      decisiveTraits.push(t);
    });
  });

  return {
    source: "phoneme-family-map",
    phonemeKey: context.phonemeKey,
    family: context.family,
    macroFamilies: context.macroFamilies || [],
    traits: context.traits || {},
    competitors,
    decisiveTraits,
    governance: context.governance || null,
    note: "تم تحميل خريطة العائلة من phoneme-family-map.js."
  };
}
function buildCognitiveGovernanceDecision(ctx) {
  const unitsCount = ctx.cognitiveUnits.length;
  const weakUnits = ctx.cognitiveUnits.filter(function (u) {
    return !u.decisionTrace.usableForDecision;
  });

  const hasStateGenome =
    ctx.genomeByState && Object.keys(ctx.genomeByState).length === unitsCount;

  const familyHasCompetitors =
    ctx.familyDecision &&
    Array.isArray(ctx.familyDecision.competitors) &&
    ctx.familyDecision.competitors.length > 0;

  const phaseMean = ctx.genome.phaseQuality?.mean || 0;

  let decision = "provisional";
  let reason = "الجينوم صالح للتشغيل، لكنه ينتظر اكتمال المقارنة العائلية والذاكرة.";

  if (!unitsCount) {
    decision = "rejected";
    reason = "لا توجد وحدات صالحة.";
  } else if (weakUnits.length > 0) {
    decision = "needs-review";
    reason = "بعض الوحدات ذات مراحل زمنية ضعيفة وتحتاج مراجعة.";
  } else if (!familyHasCompetitors) {
    decision = "not-certified";
    reason = "لا توجد عائلة مقارنة؛ لا يجوز اعتماد الفصل النهائي.";
  } else if (phaseMean >= 0.75 && hasStateGenome) {
    decision = "usable-for-comparison";
    reason = "الجينوم صالح للدخول في مقارنة عائلية، لا للاعتماد النهائي وحده.";
  }

  return {
    authority: "governance-core",
    department: "phoneme-core",
    decision,
    reason,
    unitsCount,
    weakUnits: weakUnits.map(function (u) {
      return {
        file: u.file,
        warnings: u.decisionTrace.warnings
      };
    }),
    evidence: {
      hasStateGenome,
      familyHasCompetitors,
      phaseQualityMean: phaseMean,
      memorySamplesCount: ctx.oldMemory?.samplesCount || 0
    },
    principle:
      "الجينوم لا يعتمد الحرف وحده؛ القرار يراجع العائلة والذاكرة والزمن."
  };
}


// ======================================
// 11) عرض تقرير الجينوم
// ======================================
function renderCognitiveReport(identity) {
  const g = identity.genome;
const seal = g.spectralSeal || null;

const spectralSealHtml = seal ? `
  <hr style="border-color:#1f2937; margin:12px 0;">

  <div style="font-weight:bold;color:#a78bfa;margin-bottom:8px;">
    🌈 الختم الطيفي داخل الجينوم
  </div>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:14px;">
    <div>مركز الختم: <b style="color:white;">${seal.averageCentroid} Hz</b></div>
    <div>انتشار الختم: <b style="color:white;">${seal.averageSpread}</b></div>
    <div>مركز انفجار الختم: <b style="color:white;">${seal.averageBurstCentroid} Hz</b></div>
    <div>انتشار انفجار الختم: <b style="color:white;">${seal.averageBurstSpread}</b></div>
    <div>ثبات المركز: <b style="color:white;">${seal.centroidStability}</b></div>
    <div>ثبات الانتشار: <b style="color:white;">${seal.spreadStability}</b></div>
    <div>ثقة الختم: <b style="color:white;">${seal.confidence}</b></div>
    <div>عدد عينات الختم: <b style="color:white;">${seal.samplesCount}</b></div>
  </div>
` : "";
  const unitRecordsHtml = (identity.unitRecords || []).map(function (r) {
  const c = r.coordinates || {};

  return `
    <div style="background:#020617;border:1px solid #1e293b;border-radius:10px;padding:10px;margin:8px 0;">
      <div style="color:#38bdf8;font-weight:bold;">${r.text || r.id}</div>
      <div>energy: ${c.energy}</div>
      <div>centroid: ${c.centroid}</div>
      <div>spread: ${c.spread}</div>
      <div>zcr: ${c.zcr}</div>
      <div>duration: ${c.duration}</div>
      <div>burstEnergy: ${c.burstEnergy}</div>
      <div>burstCentroid: ${c.burstCentroid}</div>
      <div>burstSpread: ${c.burstSpread}</div>
      <div>energyMovement: ${c.energyMovement}</div>
      <div>spectralMovement: ${c.spectralMovement}</div>
      <div>phaseQuality: ${c.phaseQuality}</div>
      <div>activeRatio: ${c.activeRatio}</div>
      <div>timeline: ${c.timelineOnset} → ${c.timelineBurst} → ${c.timelineTransition} → ${c.timelineSustain} → ${c.timelineRelease}</div>
    </div>
  `;
}).join("");
  const html = `
    <h3 style="color:${identity.color.hex};margin-top:0;">
      🧠 الجينوم الإدراكي المركزي لحرف ${identity.label}
    </h3>

    <div style="font-size:14px;line-height:1.8;">
      <div>الحرف: <b>${identity.phoneme}</b></div>
      <div>المفتاح: <b>${identity.phonemeKey}</b></div>
      <div>اللون: <b style="color:${identity.color.hex};">${identity.color.name}</b></div>
      <div>حكم الحوكمة: <b style="color:#facc15;">${identity.governance.decision}</b></div>
      <div>سبب الحكم: ${identity.governance.reason}</div>
      <div>مصدر العائلة: <b>${identity.familyDecision?.source || "غير معروف"}</b></div>
      <div>العائلة: <b>${identity.familyDecision?.family || "غير محددة"}</b></div>
      <div>عدد المنافسين: <b>${(identity.familyDecision?.competitors || []).length}</b></div>
    </div>
${spectralSealHtml}
    <hr style="border-color:#1f2937; margin:12px 0;">

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:14px;">
      <div>متوسط الطاقة: <b style="color:white;">${g.energy.mean}</b></div>
      <div>متوسط الطيف: <b style="color:white;">${g.centroid.mean} Hz</b></div>
      <div>اتساع الطيف: <b style="color:white;">${g.spread.mean}</b></div>
      <div>الحركة الطيفية: <b style="color:white;">${g.spectralMovement.mean}</b></div>
      <div>حركة الطاقة: <b style="color:white;">${g.energyMovement.mean}</b></div>
      <div>طاقة الانفجار: <b style="color:white;">${g.burstEnergy.mean}</b></div>
      <div>جودة المراحل: <b style="color:white;">${g.phaseQuality.mean}</b></div>
      <div>عدد جينومات الحالات: <b style="color:white;">${Object.keys(identity.genomeByState || {}).length}</b></div>
    </div>
<hr style="border-color:#1f2937; margin:12px 0;">

<div style="font-weight:bold;color:#38bdf8;margin-bottom:8px;">
🧩 سجلات العينات المستقلة — مرجع القرار
</div>

${unitRecordsHtml}
  `;

  if (typeof renderToUnifiedPanel === "function") {
    saveCurrentSessionReport("genome", "🧬 تقرير الجينوم", html);
    renderToUnifiedPanel(html, []);
  } else {
    console.warn("⚠️ مدير التقارير غير متاح لعرض الجينوم.");
  }
}

// ======================================
// 12) أدوات رياضية
// ======================================
function cognitiveRms(frame) {
  if (!frame.length) return 0;

  let sum = 0;

  for (let i = 0; i < frame.length; i++) {
    sum += frame[i] * frame[i];
  }

  return Math.sqrt(sum / frame.length);
}


function cognitiveZcr(frame) {
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


function cognitiveSpectrum(frame, sampleRate) {
  const size = nextPowerOfTwoCognitive(frame.length);
  const spectrum = [];

  for (let k = 0; k < size / 2; k++) {
    let real = 0;
    let imag = 0;

    for (let n = 0; n < frame.length; n++) {
      const angle = (2 * Math.PI * k * n) / size;
      const windowed = frame[n] * hannCognitive(n, frame.length);

      real += windowed * Math.cos(angle);
      imag -= windowed * Math.sin(angle);
    }

    spectrum.push({
      freq: (k * sampleRate) / size,
      magnitude: Math.sqrt(real * real + imag * imag)
    });
  }

  return spectrum;
}


function cognitiveSpectralCentroid(spectrum) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    weighted += bin.freq * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? weighted / total : 0;
}


function cognitiveSpectralSpread(spectrum, centroid) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    const d = bin.freq - centroid;
    weighted += d * d * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? Math.sqrt(weighted / total) : 0;
}


function movementCognitive(values) {
  if (values.length < 2) return 0;

  let sum = 0;

  for (let i = 1; i < values.length; i++) {
    sum += Math.abs(values[i] - values[i - 1]);
  }

  return sum / (values.length - 1);
}


function statCognitive(values) {
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
    mean: roundCognitive(avgCognitive(clean)),
    variance: roundCognitive(varCognitive(clean)),
    min: roundCognitive(Math.min.apply(null, clean)),
    max: roundCognitive(Math.max.apply(null, clean))
  };
}


function avgCognitive(values) {
  if (!values.length) return 0;

  return values.reduce(function (a, b) {
    return a + b;
  }, 0) / values.length;
}


function varCognitive(values) {
  if (!values.length) return 0;

  const avg = avgCognitive(values);

  return avgCognitive(
    values.map(function (v) {
      const d = v - avg;
      return d * d;
    })
  );
}


function percentileCognitive(values, ratio) {
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


function hannCognitive(n, length) {
  if (length <= 1) return 1;

  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (length - 1)));
}


function nextPowerOfTwoCognitive(n) {
  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


function roundCognitive(num) {
  return Number(Number(num || 0).toFixed(4));
}

function sendCognitiveGenomeKnowledgeSignal(targetKey, genome, confidence) {
  if (typeof window.recordKnowledgeSignal !== "function") return null;

  return window.recordKnowledgeSignal({
    knowledgeId: "cognitive-genome",
    sourceDepartment: "phoneme-core",
    sourceFile: "phoneme-core/phoneme-cognitive-engine.js",
    target: targetKey || "",
    producedKnowledge: genome || null,
    confidence: typeof confidence === "number" ? confidence : null,
    servesDecision: [
      "build-cognitive-genome",
      "identify-phoneme",
      "match-phoneme",
      "split-segment"
    ],
    notes: "إرسال الجينوم الإدراكي المركزي ليكون متاحًا لقرارات التعرف والمطابقة والفصل."
  });
}

window.sendCognitiveGenomeKnowledgeSignal = sendCognitiveGenomeKnowledgeSignal;

// ======================================
// 13) التصدير العام
// ======================================
window.buildPhonemeCognitiveIdentity = buildPhonemeCognitiveIdentity;
window.getStoredAudio = getStoredAudio;
window.getCognitiveAudioBlob = getCognitiveAudioBlob;
window.renderCognitiveReport = renderCognitiveReport;
window.updatePhonemeCumulativeMemory = updatePhonemeCumulativeMemory;
window.buildCumulativeGenomeFromSamples = buildCumulativeGenomeFromSamples;
window.getAnyStoredPhonemeMemory = getAnyStoredPhonemeMemory;
window.saveCognitiveIdentityAndCumulativeMemory =
  saveCognitiveIdentityAndCumulativeMemory;
window.buildCognitiveGenomeByState = buildCognitiveGenomeByState;
window.buildSpectralSealFromCognitiveUnits =
  buildSpectralSealFromCognitiveUnits;
window.buildCognitiveGovernanceDecision = buildCognitiveGovernanceDecision;
window.decodeCognitiveBlob = decodeCognitiveBlob;
window.buildCognitiveTimeline = buildCognitiveTimeline;
window.detectCognitivePhases = detectCognitivePhases;
window.summarizeCognitiveTimeline = summarizeCognitiveTimeline;
window.buildCognitiveUnitRecords = buildCognitiveUnitRecords;

console.log("🧠 المحرك الإدراكي المركزي جاهز V5 كامل");
