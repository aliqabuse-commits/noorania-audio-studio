// ================================
// phoneme-core/phoneme-timeline-engine.js
// محرك المسار الزمني الإدراكي للحرف — V2
// خدمة القرار + الحوكمة + خلية النحل
// يصلح حساب centroid ويضيف حكمًا زمنيًا
// ================================

console.log("⏳ phoneme-timeline-engine.js جاهز V2 — Decision Governed Timeline");

const TIMELINE_ENGINE_VERSION = "V2-decision-governed";


// ======================================
// 1) بناء المسار الزمني لعينة واحدة
// ======================================
function buildPhonemeTimeline(samples, sampleRate) {
  const frames = splitSamplesIntoFrames(samples, sampleRate, 1024, 512);

  const analyzedFrames = frames.map(function (frame, index) {
    const energy = calculateFrameEnergy(frame);
    const zcr = calculateFrameZCR(frame);
    const spectrum = calculateFrameSpectrum(frame, sampleRate);
    const centroid = calculateSpectrumCentroid(spectrum);
    const spread = calculateSpectrumSpread(spectrum, centroid);

    return {
      index,
      t: frames[index]?.time || index * 512 / sampleRate,
      energy,
      zcr,
      centroid,
      spread
    };
  });

  const ordered = detectOrderedTimelinePhases(analyzedFrames);

  return {
    ...ordered,
    frames: analyzedFrames,
    governance: buildTimelineGovernanceForRecord(ordered, analyzedFrames)
  };
}


// ======================================
// 2) تقسيم العينات إلى إطارات
// ======================================
function splitSamplesIntoFrames(samples, sampleRate, frameSize, hopSize) {
  const frames = [];

  for (let i = 0; i + frameSize <= samples.length; i += hopSize) {
    const frame = samples.slice(i, i + frameSize);
    frame.time = i / sampleRate;
    frames.push(frame);
  }

  return frames;
}


// ======================================
// 3) تحليل الإطار
// ======================================
function calculateFrameEnergy(frame) {
  let sum = 0;

  for (let i = 0; i < frame.length; i++) {
    sum += frame[i] * frame[i];
  }

  return Math.sqrt(sum / Math.max(1, frame.length));
}


function calculateFrameZCR(frame) {
  let crossings = 0;

  for (let i = 1; i < frame.length; i++) {
    if (
      (frame[i - 1] >= 0 && frame[i] < 0) ||
      (frame[i - 1] < 0 && frame[i] >= 0)
    ) {
      crossings++;
    }
  }

  return crossings / Math.max(1, frame.length);
}


// الإصلاح الجوهري: centroid يحسب من spectrum لا من index العينة الخام.
function calculateFrameCentroid(frame, sampleRate) {
  const spectrum = calculateFrameSpectrum(frame, sampleRate);
  return calculateSpectrumCentroid(spectrum);
}


function calculateFrameSpread(frame, sampleRate, centroid) {
  const spectrum = calculateFrameSpectrum(frame, sampleRate);
  return calculateSpectrumSpread(spectrum, centroid);
}


function calculateFrameSpectrum(frame, sampleRate) {
  const size = nextPowerOfTwoTimeline(frame.length);
  const spectrum = [];

  for (let k = 0; k < size / 2; k++) {
    let real = 0;
    let imag = 0;

    for (let n = 0; n < frame.length; n++) {
      const angle = (2 * Math.PI * k * n) / size;
      const windowed = frame[n] * hannTimeline(n, frame.length);

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


function calculateSpectrumCentroid(spectrum) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    weighted += bin.freq * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? roundTimeline(weighted / total) : 0;
}


function calculateSpectrumSpread(spectrum, centroid) {
  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {
    const d = bin.freq - centroid;
    weighted += d * d * bin.magnitude;
    total += bin.magnitude;
  });

  return total ? roundTimeline(Math.sqrt(weighted / total)) : 0;
}


// ======================================
// 4) كشف المراحل الزمنية بترتيب حاكم
// ======================================
function detectOrderedTimelinePhases(frames) {
  if (!frames.length) {
    return {
      onset: null,
      burst: null,
      transition: null,
      sustain: null,
      release: null
    };
  }

  const energies = frames.map(function (f) {
    return f.energy;
  });

  const maxEnergy = Math.max.apply(null, energies);
  const noiseFloor = percentileTimeline(energies, 0.15);
  const dynamic = Math.max(0, maxEnergy - noiseFloor);
  const onsetThreshold = noiseFloor + dynamic * 0.22;
  const releaseThreshold = noiseFloor + dynamic * 0.14;

  let onset = frames[0];

  for (let i = 0; i < frames.length; i++) {
    if (frames[i].energy >= onsetThreshold) {
      onset = frames[i];
      break;
    }
  }

  const onsetIdx = onset.index;

  let burst = onset;
  let maxRise = -Infinity;

  for (let i = onsetIdx + 1; i < frames.length; i++) {
    const rise = frames[i].energy - frames[i - 1].energy;

    if (rise > maxRise) {
      maxRise = rise;
      burst = frames[i];
    }
  }

  const burstIdx = burst.index;

  let release = frames[frames.length - 1];

  for (let i = frames.length - 1; i >= onsetIdx; i--) {
    if (frames[i].energy >= releaseThreshold) {
      release = frames[i];
      break;
    }
  }

  let releaseIdx = release.index;

  // منع الذيل الطويل من ابتلاع الضوضاء
  const maxActiveSpan = Math.max(6, Math.round(frames.length * 0.65));

  if (releaseIdx - onsetIdx > maxActiveSpan) {
    releaseIdx = Math.min(frames.length - 1, onsetIdx + maxActiveSpan);
    release = frames[releaseIdx];
  }

  let transition = frames[Math.min(burstIdx + 1, releaseIdx)];
  let maxMovement = -Infinity;

  for (let i = burstIdx + 1; i <= releaseIdx; i++) {
    const movement =
      Math.abs(frames[i].centroid - frames[i - 1].centroid) +
      Math.abs(frames[i].energy - frames[i - 1].energy) * 1000;

    if (movement > maxMovement) {
      maxMovement = movement;
      transition = frames[i];
    }
  }

  const transitionIdx = transition.index;

  let sustain = frames[Math.min(transitionIdx + 1, releaseIdx)];
  let bestScore = Infinity;

  for (let i = transitionIdx + 1; i < releaseIdx; i++) {
    const energyDelta =
      Math.abs(frames[i].energy - frames[i - 1].energy) +
      Math.abs(frames[i].energy - frames[i + 1].energy);

    const centroidDelta =
      Math.abs(frames[i].centroid - frames[i - 1].centroid) +
      Math.abs(frames[i].centroid - frames[i + 1].centroid);

    const score = energyDelta * 1000 + centroidDelta * 0.01;

    if (score < bestScore) {
      bestScore = score;
      sustain = frames[i];
    }
  }

  return {
    onset: packTimelineFrame(onset),
    burst: packTimelineFrame(burst),
    transition: packTimelineFrame(transition),
    sustain: packTimelineFrame(sustain),
    release: packTimelineFrame(release),
    thresholds: {
      noiseFloor: roundTimeline(noiseFloor),
      onsetThreshold: roundTimeline(onsetThreshold),
      releaseThreshold: roundTimeline(releaseThreshold)
    }
  };
}


function packTimelineFrame(frame) {
  if (!frame) return null;

  return {
    index: frame.index,
    t: roundTimeline(frame.t || 0),
    energy: roundTimeline(frame.energy),
    zcr: roundTimeline(frame.zcr),
    centroid: roundTimeline(frame.centroid),
    spread: roundTimeline(frame.spread)
  };
}


// ======================================
// 5) دوال قديمة للتوافق
// ======================================
function detectTimelineOnset(frames) {
  return detectOrderedTimelinePhases(frames).onset;
}


function detectTimelineBurst(frames) {
  return detectOrderedTimelinePhases(frames).burst;
}


function detectTimelineTransition(frames) {
  return detectOrderedTimelinePhases(frames).transition;
}


function detectTimelineSustain(frames) {
  return detectOrderedTimelinePhases(frames).sustain;
}


function detectTimelineRelease(frames) {
  return detectOrderedTimelinePhases(frames).release;
}


function buildOrderedPhonemeTimeline(samples, sampleRate) {
  const timeline = buildPhonemeTimeline(samples, sampleRate);

  return {
    onset: timeline.onset,
    burst: timeline.burst,
    transition: timeline.transition,
    sustain: timeline.sustain,
    release: timeline.release,
    thresholds: timeline.thresholds,
    governance: timeline.governance
  };
}


// ======================================
// 6) حكم زمني لعينة واحدة
// ======================================
function buildTimelineGovernanceForRecord(timeline, frames) {
  const warnings = [];

  const phases = [
    timeline.onset,
    timeline.burst,
    timeline.transition,
    timeline.sustain,
    timeline.release
  ];

  if (phases.some(function (p) { return !p; })) {
    warnings.push("missing-phase");
  }

  if (
    timeline.onset &&
    timeline.burst &&
    timeline.transition &&
    timeline.sustain &&
    timeline.release
  ) {
    const ordered =
      timeline.onset.index <= timeline.burst.index &&
      timeline.burst.index <= timeline.transition.index &&
      timeline.transition.index <= timeline.sustain.index &&
      timeline.sustain.index <= timeline.release.index;

    if (!ordered) warnings.push("phase-order-broken");

    const span = timeline.release.index - timeline.onset.index;

    if (span <= 0) warnings.push("invalid-active-span");
    if (span > frames.length * 0.65) warnings.push("active-span-too-long");
  }

  const centroidValues = frames.map(function (f) {
    return f.centroid;
  });

  const maxCentroid = Math.max.apply(null, centroidValues);

  if (maxCentroid > 12000) warnings.push("centroid-too-high");

  const decision =
    warnings.length === 0
      ? "usable-for-decision"
      : "needs-review";

  return {
    authority: "governance-core",
    department: "analysis-core",
    decision,
    warnings,
    maxCentroid: roundTimeline(maxCentroid || 0),
    principle:
      "الزمن دليل قرار؛ إذا فسدت المراحل أو خرج الطيف عن المعقول فلا يعتمد التقرير."
  };
}


// ======================================
// 7) تحميل الصوت بأمان
// ======================================
async function getAudioBlobSafely(fileName) {
  if (typeof getAudioPromiseForMemory === "function") {
    const blob = await getAudioPromiseForMemory(fileName, 3000);
    if (blob) return blob;
  }

  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName) ||
    localStorage.getItem("record_" + fileName);

  if (dataUrl) {
    try {
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (err) {
      console.warn("تعذر تحويل التسجيل إلى Blob:", fileName, err);
    }
  }

  return null;
}


// ======================================
// 8) بناء الجينوم الزمني لحقيبة حرف
// ======================================
async function buildTimelineGenomeForPhoneme(key) {
  alert("⏳ بدأ بناء المسار الزمني للحقيبة: " + key);

  try {
    if (typeof getPhonemeTrainingPack !== "function") {
      alert("❌ دالة getPhonemeTrainingPack غير موجودة.");
      return null;
    }

    const pack = getPhonemeTrainingPack(key);

    if (!pack) {
      alert("❌ لم يتم العثور على حقيبة الحرف: " + key);
      return null;
    }

    const genomeRecords = [];

    for (const pos of pack.positions) {
      try {
        const blob = await getAudioBlobSafely(pos.file);
        if (!blob) continue;

        if (typeof decodeCognitiveBlob !== "function") {
          alert("❌ دالة decodeCognitiveBlob غير موجودة.");
          return null;
        }

        const decoded = await decodeCognitiveBlob(blob);
        const timeline = buildOrderedPhonemeTimeline(
          decoded.samples,
          decoded.sampleRate
        );

        genomeRecords.push({
          position: pos,
          timeline: timeline
        });
      } catch (err) {
        console.error("❌ فشل تحليل العينة:", pos.file, err);
      }
    }

    if (!genomeRecords.length) {
      alert("⚠️ لم يتم تحليل أي عينة للحقيبة: " + key);
      return null;
    }

    const timelineGenome = {
      method: "Noorani Timeline Genome V2",
      version: TIMELINE_ENGINE_VERSION,
      key: key,
      records: genomeRecords,
      summary: buildTimelineGenomeSummary(genomeRecords),
      governance: buildTimelineGenomeGovernance(key, genomeRecords),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(
      key + "_timeline_genome",
      JSON.stringify(timelineGenome, null, 2)
    );

    saveTimelineGenomeToCumulativeMemory(key, timelineGenome);

    renderTimelineGenomeReport(key, timelineGenome);

    return timelineGenome;
  } catch (err) {
    alert("❌ توقف بناء المسار الزمني للحقيبة:\n" + key + "\n\n" + err.message);
    return null;
  }
}


// ======================================
// 9) ملخص وحوكمة الجينوم الزمني
// ======================================
function buildTimelineGenomeSummary(records) {
  const fields = ["onset", "burst", "transition", "sustain", "release"];
  const result = {};

  fields.forEach(function (field) {
    const indexes = [];
    const energies = [];
    const centroids = [];

    records.forEach(function (record) {
      const phase = record.timeline[field];

      if (!phase) return;

      indexes.push(phase.index);
      energies.push(phase.energy);
      centroids.push(phase.centroid);
    });

    result[field] = {
      index: timelineStat(indexes),
      energy: timelineStat(energies),
      centroid: timelineStat(centroids)
    };
  });

  return result;
}


function buildTimelineGenomeGovernance(key, records) {
  const warnings = [];
  const weakRecords = [];

  records.forEach(function (record) {
    const gov = record.timeline.governance;

    if (gov && gov.decision !== "usable-for-decision") {
      weakRecords.push({
        file: record.position.file,
        text: record.position.text,
        warnings: gov.warnings || []
      });
    }
  });

  if (weakRecords.length) warnings.push("some-records-need-review");

  const hasAllOrder = records.every(function (record) {
    const t = record.timeline;

    return (
      t.onset &&
      t.burst &&
      t.transition &&
      t.sustain &&
      t.release &&
      t.onset.index <= t.burst.index &&
      t.burst.index <= t.transition.index &&
      t.transition.index <= t.sustain.index &&
      t.sustain.index <= t.release.index
    );
  });

  if (!hasAllOrder) warnings.push("phase-order-not-stable");

  const decision =
    warnings.length === 0
      ? "usable-for-comparison"
      : "needs-review";

  return {
    authority: "governance-core",
    department: "analysis-core",
    decision,
    warnings,
    weakRecords,
    recordsCount: records.length,
    principle:
      "الجينوم الزمني لا يعتمد وحده؛ يخدم قرار المقارنة والفصل إذا صحت المراحل والطيف."
  };
}


function saveTimelineGenomeToCumulativeMemory(key, timelineGenome) {
  try {
    if (typeof addTimelineGenomeToCumulativeMemory === "function") {
      addTimelineGenomeToCumulativeMemory(key, timelineGenome);
      return;
    }

    const raw =
      localStorage.getItem(key + "_cumulative_memory") ||
      localStorage.getItem("cognitive_memory_" + key);

    if (!raw) return;

    const memory = JSON.parse(raw);

    if (!Array.isArray(memory.samples)) memory.samples = [];
    if (!Array.isArray(memory.attemptHistory)) memory.attemptHistory = [];

    const sample = {
      id: key + "_timeline_" + Date.now(),
      createdAt: new Date().toISOString(),
      source: "phoneme-timeline-engine",
      phonemeKey: key,
      timelineGenome: timelineGenome,
      governance: timelineGenome.governance
    };

    memory.samples.push(sample);
    memory.attemptHistory.push({
      id: sample.id,
      createdAt: sample.createdAt,
      source: sample.source,
      accepted: timelineGenome.governance?.decision !== "rejected",
      decision: timelineGenome.governance?.decision || "unknown",
      decisionReason:
        (timelineGenome.governance?.warnings || []).join(", ") || "لا توجد تحذيرات"
    });

    memory.samplesCount = memory.samples.length;
    memory.latestTimelineGenome = timelineGenome;
    memory.latestTimelineGovernance = timelineGenome.governance;
    memory.updatedAt = new Date().toISOString();

    const value = JSON.stringify(memory, null, 2);

    localStorage.setItem(key + "_cumulative_memory", value);
    localStorage.setItem("cognitive_memory_" + key, value);
    localStorage.setItem(key + "_perceptual_identity", value);
  } catch (err) {
    console.warn("⚠️ تعذر حفظ الجينوم الزمني داخل الذاكرة التراكمية:", err);
  }
}


// ======================================
// 10) عرض تقرير الجينوم الزمني
// ======================================
function renderTimelineGenomeReport(key, timelineGenome) {
  let html = `<h3 style="color: #38bdf8; margin-top:0;">⏳ الجينوم الزمني — ${key}</h3>`;

  let count = timelineGenome.records.length;

  if (count === 0) {
    if (typeof renderToUnifiedPanel === "function") {
      renderToUnifiedPanel(html + "<p>لا توجد بيانات زمنية لعرضها.</p>");
    }
    return;
  }

  html += `
    <div style="background:#111827;padding:10px;border-radius:8px;margin-bottom:12px;line-height:1.8;">
      <div>حكم الزمن: <b style="color:#facc15;">${timelineGenome.governance?.decision || "غير محدد"}</b></div>
      <div>التحذيرات: ${(timelineGenome.governance?.warnings || []).join(", ") || "لا توجد"}</div>
      <div style="color:#94a3b8;font-size:13px;">${timelineGenome.governance?.principle || ""}</div>
    </div>
  `;

  timelineGenome.records.forEach(record => {
    let tl = record.timeline;
    let oIdx = tl.onset ? tl.onset.index : 0;
    let bIdx = tl.burst ? tl.burst.index : 0;
    let tIdx = tl.transition ? tl.transition.index : 0;
    let sIdx = tl.sustain ? tl.sustain.index : 0;
    let rIdx = tl.release ? tl.release.index : 0;

    html += `
      <div style="margin-bottom: 12px; padding: 12px; background: #111827; border-radius: 8px;">
        <b style="color: #facc15;">العينة: ${record.position.text}</b><br>
        <span style="font-size: 14px; color: #cbd5e1; font-family: monospace;">
          onset (${oIdx}) → burst (${bIdx}) → trans (${tIdx}) → sus (${sIdx}) → rel (${rIdx})
        </span>
        <div style="font-size:12px;color:#94a3b8;margin-top:6px;">
          max centroid warning: ${record.timeline.governance?.warnings?.join(", ") || "none"}
        </div>
      </div>
    `;
  });

  const summary = timelineGenome.summary || {};

  html += `
    <div style="margin-top: 18px; border-top: 1px solid #334155; padding-top: 14px;">
      <b style="color: #22c55e;">📊 متوسط المراحل الزمنية:</b><br>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 14px;">
        <div>متوسط onset: <b style="color:white;">${Math.round(summary.onset?.index?.mean || 0)}</b></div>
        <div>متوسط burst: <b style="color:white;">${Math.round(summary.burst?.index?.mean || 0)}</b></div>
        <div>متوسط trans: <b style="color:white;">${Math.round(summary.transition?.index?.mean || 0)}</b></div>
        <div>متوسط sus: <b style="color:white;">${Math.round(summary.sustain?.index?.mean || 0)}</b></div>
        <div>متوسط rel: <b style="color:white;">${Math.round(summary.release?.index?.mean || 0)}</b></div>
      </div>
    </div>
  `;

  if (typeof renderToUnifiedPanel === "function") {
    saveCurrentSessionReport("timeline", "⏳ تقرير المسار الزمني", html);
    renderToUnifiedPanel(html);
  
  } else {
    console.warn("⚠️ مدير التقارير غير متاح لعرض الجينوم الزمني.");
  }
}


// ======================================
// 11) أدوات رياضية
// ======================================
function timelineStat(values) {
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
    mean: roundTimeline(averageTimeline(clean)),
    variance: roundTimeline(varianceTimeline(clean)),
    min: roundTimeline(Math.min.apply(null, clean)),
    max: roundTimeline(Math.max.apply(null, clean))
  };
}


function averageTimeline(values) {
  if (!values.length) return 0;

  return values.reduce(function (a, b) {
    return a + b;
  }, 0) / values.length;
}


function varianceTimeline(values) {
  if (!values.length) return 0;

  const avg = averageTimeline(values);

  return averageTimeline(
    values.map(function (v) {
      const d = v - avg;
      return d * d;
    })
  );
}


function percentileTimeline(values, ratio) {
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


function hannTimeline(n, length) {
  if (length <= 1) return 1;

  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (length - 1)));
}


function nextPowerOfTwoTimeline(n) {
  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


function roundTimeline(num) {
  return Number(Number(num || 0).toFixed(4));
}


// ======================================
// 12) التصدير العام
// ======================================
window.buildPhonemeTimeline = buildPhonemeTimeline;
window.buildOrderedPhonemeTimeline = buildOrderedPhonemeTimeline;
window.buildTimelineGenomeForPhoneme = buildTimelineGenomeForPhoneme;
window.renderTimelineGenomeReport = renderTimelineGenomeReport;
window.calculateFrameCentroid = calculateFrameCentroid;
window.calculateFrameSpread = calculateFrameSpread;
window.calculateFrameSpectrum = calculateFrameSpectrum;
window.calculateSpectrumCentroid = calculateSpectrumCentroid;
window.calculateSpectrumSpread = calculateSpectrumSpread;
window.buildTimelineGenomeSummary = buildTimelineGenomeSummary;
window.buildTimelineGenomeGovernance = buildTimelineGenomeGovernance;

console.log("⏳ محرك المسار الزمني الإدراكي للحرف جاهز V2 كامل");
