// ================================
// phoneme-core/phoneme-cognitive-engine.js
// المحرك الإدراكي المركزي للحرف — V4
// يبني الجينوم + يحفظ ذاكرة تراكمية للحرف
// لا يمسح الذاكرة القديمة عند إعادة التسجيل
// ================================

console.log("🧠 phoneme-cognitive-engine.js جاهز V4 — Cumulative Memory Safe");


// ======================================
// 1) تحميل الصوت المخزن
// ======================================
async function getStoredAudio(fileName) {
  console.log("🔎 COGNITIVE LOAD:", fileName);

  if (typeof getAudioPromiseForMemory === "function") {
    const blob = await getAudioPromiseForMemory(fileName, 3000);

    if (blob) {
      console.log("✅ from getAudioPromiseForMemory:", fileName, blob);

      // حفظ نسخة احتياطية في localStorage إن أمكن
      persistAudioBlobBackup(fileName, blob);

      return blob;
    }
  }

  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName);

  console.log(
    "📦 from localStorage:",
    fileName,
    dataUrl ? dataUrl.substring(0, 40) : null
  );

  if (dataUrl && dataUrl.startsWith("data:")) {
    return cognitiveDataUrlToBlob(dataUrl);
  }

  throw new Error("الصوت غير موجود: " + fileName);
}


// ======================================
// 2) حفظ نسخة احتياطية من التسجيل
// حتى يبقى بعد تحديث الصفحة
// ======================================
function persistAudioBlobBackup(fileName, blob) {
  try {
    const existing =
      localStorage.getItem("audio_" + fileName) ||
      localStorage.getItem(fileName);

    if (existing && existing.startsWith("data:")) return;

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const dataUrl = reader.result;

        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          localStorage.setItem("audio_" + fileName, dataUrl);
          localStorage.setItem(fileName, dataUrl);
          console.log("💾 تم حفظ نسخة احتياطية للتسجيل:", fileName);
        }
      } catch (err) {
        console.warn("⚠️ تعذر حفظ التسجيل احتياطيًا:", fileName, err);
      }
    };

    reader.readAsDataURL(blob);
  } catch (err) {
    console.warn("⚠️ فشل تجهيز نسخة التسجيل الاحتياطية:", fileName, err);
  }
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

      cognitiveUnits.push({
        text: unit.text,
        file: unit.file,
        role: unit.role,
        timeline,
        phases,
        summary
      });
    }

    if (!cognitiveUnits.length) {
      alert("❌ لا توجد عينات صالحة لبناء الجينوم الإدراكي للحرف " + label);
      return null;
    }

    const identity = {
      method: "Noorani Central Cognitive Engine V4",
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
          text: u.text,
          file: u.file,
          role: u.role,
          phases: u.phases,
          summary: u.summary
        };
      }),

      genome: buildCognitiveGenome(cognitiveUnits),
      createdAt: new Date().toISOString()
    };

    saveCognitiveIdentityAndCumulativeMemory(phonemeKey, identity);

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
  localStorage.setItem(
    phonemeKey + "_cognitive_identity",
    JSON.stringify(identity)
  );

  const cumulativeMemory = updatePhonemeCumulativeMemory(
    phonemeKey,
    identity
  );

  // مفاتيح متعددة لمنع ضياع الذاكرة بسبب اختلاف أسماء الملفات
  localStorage.setItem(
    phonemeKey + "_cumulative_memory",
    JSON.stringify(cumulativeMemory)
  );

  localStorage.setItem(
    phonemeKey + "_perceptual_identity",
    JSON.stringify(cumulativeMemory)
  );

  localStorage.setItem(
    phonemeKey + "_memory",
    JSON.stringify(cumulativeMemory)
  );

  localStorage.setItem(
    "phoneme_memory_" + phonemeKey,
    JSON.stringify(cumulativeMemory)
  );

  localStorage.setItem(
    "cognitive_memory_" + phonemeKey,
    JSON.stringify(cumulativeMemory)
  );

  console.log("💾 تم حفظ الجينوم والذاكرة التراكمية:", {
    phonemeKey,
    samplesCount: cumulativeMemory.samplesCount
  });

  return cumulativeMemory;
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
// لا يمسح القديم عند إعادة التسجيل
// ======================================
function updatePhonemeCumulativeMemory(phonemeKey, identity) {
  const oldMemory = getAnyStoredPhonemeMemory(phonemeKey);

  const sample = {
    id: phonemeKey + "_" + Date.now(),
    createdAt: new Date().toISOString(),
    source: "cognitive-identity",
    phonemeKey,
    key: phonemeKey,
    phoneme: identity.phoneme,
    label: identity.label,
    units: identity.units || [],
    genome: identity.genome || {}
  };

  const memory = oldMemory || {
    method: "Noorani Cumulative Phoneme Memory V1",
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
    latestIdentity: null,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  if (!Array.isArray(memory.samples)) memory.samples = [];
  if (!Array.isArray(memory.attemptHistory)) memory.attemptHistory = [];

  memory.samples.push(sample);

  memory.attemptHistory.push({
    id: sample.id,
    createdAt: sample.createdAt,
    unitsCount: sample.units.length,
    accepted: true,
    genomeKeys: Object.keys(sample.genome || {})
  });

  memory.samplesCount = memory.samples.length;
  memory.latestIdentity = identity;
  memory.color = identity.color;
  memory.pack = identity.pack;
  memory.updatedAt = new Date().toISOString();
  memory.cumulativeGenome = buildCumulativeGenomeFromSamples(memory.samples);

  return memory;
}


// ======================================
// 7) بناء الجينوم التراكمي من العينات السابقة
// ======================================
function buildCumulativeGenomeFromSamples(samples) {
  const keys = [
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

  const result = {};

  keys.forEach(function (key) {
    const values = [];

    samples.forEach(function (sample) {
      if (
        sample.genome &&
        sample.genome[key] &&
        typeof sample.genome[key].mean === "number"
      ) {
        values.push(sample.genome[key].mean);
      }
    });

    result[key] = cumulativeStat(values);
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
  const frameSize = Math.floor(sampleRate * 0.010);
  const hopSize = Math.floor(sampleRate * 0.010);
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

  const energies = timeline.map(function (f) {
    return f.energy;
  });

  const maxEnergy = Math.max.apply(null, energies);
  const threshold = maxEnergy * 0.18;

  let onsetIndex = 0;

  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].energy >= threshold) {
      onsetIndex = i;
      break;
    }
  }

  let burstIndex = onsetIndex;
  let maxRise = 0;

  for (let i = onsetIndex + 1; i < timeline.length; i++) {
    const rise = timeline[i].energy - timeline[i - 1].energy;

    if (rise > maxRise) {
      maxRise = rise;
      burstIndex = i;
    }
  }

  let endIndex = timeline.length - 1;

  for (let i = timeline.length - 1; i >= 0; i--) {
    if (timeline[i].energy >= threshold) {
      endIndex = i;
      break;
    }
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
    tailIndex: endIndex
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
    spectralMovement: roundCognitive(movementCognitive(active.map(f => f.centroid)))
  };
}


function buildCognitiveGenome(units) {
  const summaries = units.map(function (u) {
    return u.summary;
  });

  return {
    duration: statCognitive(summaries.map(s => s.duration)),
    energy: statCognitive(summaries.map(s => s.meanEnergy)),
    zcr: statCognitive(summaries.map(s => s.meanZcr)),
    centroid: statCognitive(summaries.map(s => s.meanCentroid)),
    spread: statCognitive(summaries.map(s => s.meanSpread)),
    burstEnergy: statCognitive(summaries.map(s => s.burstEnergy)),
    burstCentroid: statCognitive(summaries.map(s => s.burstCentroid)),
    burstSpread: statCognitive(summaries.map(s => s.burstSpread)),
    energyMovement: statCognitive(summaries.map(s => s.energyMovement)),
    spectralMovement: statCognitive(summaries.map(s => s.spectralMovement))
  };
}


// ======================================
// 10) عرض تقرير الجينوم
// ======================================
function renderCognitiveReport(identity) {
  const g = identity.genome;

  const html = `
    <h3 style="color:${identity.color.hex};margin-top:0;">
      🧠 الجينوم الإدراكي المركزي لحرف ${identity.label}
    </h3>

    <div style="font-size:14px;">
      <div>الحرف: <b>${identity.phoneme}</b></div>
      <div>المفتاح: <b>${identity.phonemeKey}</b></div>
      <div>اللون: <b style="color:${identity.color.hex};">${identity.color.name}</b></div>
    </div>

    <hr style="border-color:#1f2937; margin:12px 0;">

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:14px;">
      <div>متوسط الطاقة: <b style="color:white;">${g.energy.mean}</b></div>
      <div>متوسط الطيف: <b style="color:white;">${g.centroid.mean} Hz</b></div>
      <div>اتساع الطيف: <b style="color:white;">${g.spread.mean}</b></div>
      <div>الحركة الطيفية: <b style="color:white;">${g.spectralMovement.mean}</b></div>
      <div>حركة الطاقة: <b style="color:white;">${g.energyMovement.mean}</b></div>
      <div>طاقة الانفجار: <b style="color:white;">${g.burstEnergy.mean}</b></div>
    </div>

    <hr style="border-color:#1f2937; margin:12px 0;">

    <div style="font-size:12px; color:#94a3b8;">
      هذا التقرير يبني آخر جينوم مركزي، ثم يضيفه إلى ذاكرة تراكمية لا تُمسح عند إعادة التسجيل.
    </div>
  `;

  if (typeof renderToUnifiedPanel === "function") {
    renderToUnifiedPanel(html, []);
  } else {
    console.warn("⚠️ مدير التقارير غير متاح لعرض الجينوم.");
  }
}


// ======================================
// 11) أدوات رياضية
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
  return {
    mean: roundCognitive(avgCognitive(values)),
    variance: roundCognitive(varCognitive(values)),
    min: roundCognitive(Math.min.apply(null, values)),
    max: roundCognitive(Math.max.apply(null, values))
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


// ======================================
// 12) التصدير العام
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

console.log("🧠 المحرك الإدراكي المركزي جاهز V4 كامل");
