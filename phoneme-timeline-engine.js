// ================================
// phoneme-timeline-engine.js
// محرك المسار الزمني الإدراكي للحرف — V1
// المرحلة الأولى لبناء السلوك الزمني للحروف
// ================================

console.log("⏳ phoneme-timeline-engine.js جاهز V1");

function buildPhonemeTimeline(samples, sampleRate) {
  const frames = splitSamplesIntoFrames(samples, sampleRate, 1024, 512);
  const analyzedFrames = frames.map(function (frame, index) {
    const energy = calculateFrameEnergy(frame);
    const zcr = calculateFrameZCR(frame);
    const centroid = calculateFrameCentroid(frame, sampleRate);
    const spread = calculateFrameSpread(frame, sampleRate, centroid);
    return { index, energy, zcr, centroid, spread };
  });

  const onset = detectTimelineOnset(analyzedFrames);
  const burst = detectTimelineBurst(analyzedFrames);
  const transition = detectTimelineTransition(analyzedFrames);
  const sustain = detectTimelineSustain(analyzedFrames);
  const release = detectTimelineRelease(analyzedFrames);

  return { onset, burst, transition, sustain, release, frames: analyzedFrames };
}

function splitSamplesIntoFrames(samples, sampleRate, frameSize, hopSize) {
  const frames = [];
  for (let i = 0; i < samples.length - frameSize; i += hopSize) {
    frames.push(samples.slice(i, i + frameSize));
  }
  return frames;
}

function calculateFrameEnergy(frame) {
  let sum = 0;
  for (let i = 0; i < frame.length; i++) sum += frame[i] * frame[i];
  return Math.sqrt(sum / frame.length);
}

function calculateFrameZCR(frame) {
  let crossings = 0;
  for (let i = 1; i < frame.length; i++) {
    if ((frame[i - 1] >= 0 && frame[i] < 0) || (frame[i - 1] < 0 && frame[i] >= 0)) crossings++;
  }
  return crossings / frame.length;
}

function calculateFrameCentroid(frame, sampleRate) {
  let weighted = 0; let total = 0;
  for (let i = 0; i < frame.length; i++) {
    const magnitude = Math.abs(frame[i]);
    weighted += i * magnitude; total += magnitude;
  }
  if (!total) return 0;
  return (weighted / total) * (sampleRate / frame.length);
}

function calculateFrameSpread(frame, sampleRate, centroid) {
  let weighted = 0; let total = 0;
  for (let i = 0; i < frame.length; i++) {
    const magnitude = Math.abs(frame[i]);
    const frequency = i * sampleRate / frame.length;
    weighted += Math.pow(frequency - centroid, 2) * magnitude;
    total += magnitude;
  }
  if (!total) return 0;
  return Math.sqrt(weighted / total);
}

function detectTimelineOnset(frames) {
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].energy > 0.02) return { frameIndex: i, energy: frames[i].energy, centroid: frames[i].centroid };
  }
  return null;
}

function detectTimelineBurst(frames) {
  let maxEnergy = 0; let burstFrame = null;
  frames.forEach(function (frame) {
    if (frame.energy > maxEnergy) { maxEnergy = frame.energy; burstFrame = frame; }
  });
  return burstFrame;
}

function detectTimelineTransition(frames) {
  let maxMovement = 0; let transitionFrame = null;
  for (let i = 1; i < frames.length; i++) {
    const movement = Math.abs(frames[i].centroid - frames[i - 1].centroid);
    if (movement > maxMovement) { maxMovement = movement; transitionFrame = frames[i]; }
  }
  return transitionFrame;
}

function detectTimelineSustain(frames) {
  let bestFrame = null; let bestScore = Infinity;
  for (let i = 1; i < frames.length - 1; i++) {
    const delta1 = Math.abs(frames[i].energy - frames[i - 1].energy);
    const delta2 = Math.abs(frames[i].energy - frames[i + 1].energy);
    const score = delta1 + delta2;
    if (score < bestScore) { bestScore = score; bestFrame = frames[i]; }
  }
  return bestFrame;
}

function detectTimelineRelease(frames) {
  for (let i = frames.length - 1; i >= 0; i--) {
    if (frames[i].energy > 0.01) return { frameIndex: i, energy: frames[i].energy, centroid: frames[i].centroid };
  }
  return null;
}

function buildOrderedPhonemeTimeline(samples, sampleRate) {
  const frames = splitSamplesIntoFrames(samples, sampleRate, 1024, 512);
  const analyzedFrames = frames.map(function (frame, index) {
    return {
      index: index,
      energy: calculateFrameEnergy(frame),
      zcr: calculateFrameZCR(frame),
      centroid: calculateFrameCentroid(frame, sampleRate),
      spread: calculateFrameSpread(frame, sampleRate, calculateFrameCentroid(frame, sampleRate))
    };
  });

  let onset = null;
  for (let i = 0; i < analyzedFrames.length; i++) {
    if (analyzedFrames[i].energy > 0.02) { onset = analyzedFrames[i]; break; }
  }
  let onsetIdx = onset ? onset.index : 0;

  let burst = null; let maxEnergy = 0;
  for (let i = onsetIdx; i < analyzedFrames.length; i++) {
    if (analyzedFrames[i].energy > maxEnergy) { maxEnergy = analyzedFrames[i].energy; burst = analyzedFrames[i]; }
  }
  let burstIdx = burst ? burst.index : onsetIdx;

  let transition = null; let maxMovement = 0;
  for (let i = burstIdx + 1; i < analyzedFrames.length; i++) {
    let movement = Math.abs(analyzedFrames[i].centroid - analyzedFrames[i - 1].centroid);
    if (movement > maxMovement) { maxMovement = movement; transition = analyzedFrames[i]; }
  }
  let transIdx = transition ? transition.index : burstIdx;

  let sustain = null; let bestScore = Infinity;
  for (let i = transIdx + 1; i < analyzedFrames.length - 1; i++) {
    let delta1 = Math.abs(analyzedFrames[i].energy - analyzedFrames[i - 1].energy);
    let delta2 = Math.abs(analyzedFrames[i].energy - analyzedFrames[i + 1].energy);
    let score = delta1 + delta2;
    if (score < bestScore) { bestScore = score; sustain = analyzedFrames[i]; }
  }
  let sustainIdx = sustain ? sustain.index : transIdx;

  let release = null;
  for (let i = analyzedFrames.length - 1; i >= sustainIdx; i--) {
    if (analyzedFrames[i].energy > 0.01) { release = analyzedFrames[i]; break; }
  }

  if (!release) release = analyzedFrames[analyzedFrames.length - 1];

  return {
    onset: onset ? { index: onset.index, energy: onset.energy, centroid: onset.centroid } : null,
    burst: burst ? { index: burst.index, energy: burst.energy, centroid: burst.centroid } : null,
    transition: transition ? { index: transition.index, energy: transition.energy, centroid: transition.centroid } : null,
    sustain: sustain ? { index: sustain.index, energy: sustain.energy, centroid: sustain.centroid } : null,
    release: release ? { index: release.index, energy: release.energy, centroid: release.centroid } : null
  };
}

async function getAudioBlobSafely(fileName) {
  if (typeof getAudioPromiseForMemory === "function") {
    const blob = await getAudioPromiseForMemory(fileName, 3000);
    if (blob) return blob;
  }
  const dataUrl = localStorage.getItem("audio_" + fileName) || localStorage.getItem(fileName) || localStorage.getItem("record_" + fileName);
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

async function buildTimelineGenomeForPhoneme(key) {
  alert("⏳ بدأ بناء المسار الزمني للحقيبة: " + key);

  try {
    if (typeof getPhonemeTrainingPack !== "function") { alert("❌ دالة getPhonemeTrainingPack غير موجودة."); return; }
    const pack = getPhonemeTrainingPack(key);
    if (!pack) { alert("❌ لم يتم العثور على حقيبة الحرف: " + key); return; }

    const genomeRecords = [];

    for (const pos of pack.positions) {
      try {
        const blob = await getAudioBlobSafely(pos.file);
        if (!blob) continue;
        if (typeof decodeCognitiveBlob !== "function") { alert("❌ دالة decodeCognitiveBlob غير موجودة."); return; }
        
        const decoded = await decodeCognitiveBlob(blob);
        const timeline = buildOrderedPhonemeTimeline(decoded.samples, decoded.sampleRate);
        genomeRecords.push({ position: pos, timeline: timeline });
      } catch (err) {
        console.error("❌ فشل تحليل العينة:", pos.file, err);
      }
    }

    if (!genomeRecords.length) {
      alert("⚠️ لم يتم تحليل أي عينة للحقيبة: " + key);
      return;
    }

    const timelineGenome = { key: key, records: genomeRecords, timestamp: new Date().toISOString() };
    localStorage.setItem(key + "_timeline_genome", JSON.stringify(timelineGenome, null, 2));

    renderTimelineGenomeReport(key, timelineGenome);
  } catch (err) {
    alert("❌ توقف بناء المسار الزمني للحقيبة:\n" + key + "\n\n" + err.message);
  }
}

// ======================================
// عرض تقرير الجينوم الزمني (مُحدّث للمدير الموحد)
// ======================================
function renderTimelineGenomeReport(key, timelineGenome) {
  let html = `<h3 style="color: #38bdf8; margin-top:0;">⏳ الجينوم الزمني — ${key}</h3>`;

  let sumOnset = 0, sumBurst = 0, sumTrans = 0, sumSustain = 0, sumRelease = 0;
  let count = timelineGenome.records.length;

  if (count === 0) {
    if(typeof renderToUnifiedPanel === 'function') renderToUnifiedPanel(html + "<p>لا توجد بيانات زمنية لعرضها.</p>");
    return;
  }

  timelineGenome.records.forEach(record => {
    let tl = record.timeline;
    let oIdx = tl.onset ? tl.onset.index : 0;
    let bIdx = tl.burst ? tl.burst.index : 0;
    let tIdx = tl.transition ? tl.transition.index : 0;
    let sIdx = tl.sustain ? tl.sustain.index : 0;
    let rIdx = tl.release ? tl.release.index : 0;

    sumOnset += oIdx; sumBurst += bIdx; sumTrans += tIdx; sumSustain += sIdx; sumRelease += rIdx;

    html += `
      <div style="margin-bottom: 12px; padding: 12px; background: #111827; border-radius: 8px;">
        <b style="color: #facc15;">العينة: ${record.position.text}</b><br>
        <span style="font-size: 14px; color: #cbd5e1; font-family: monospace;">
          onset (${oIdx}) → burst (${bIdx}) → trans (${tIdx}) → sus (${sIdx}) → rel (${rIdx})
        </span>
      </div>
    `;
  });

  html += `
    <div style="margin-top: 18px; border-top: 1px solid #334155; padding-top: 14px;">
      <b style="color: #22c55e;">📊 متوسط المراحل الزمنية:</b><br>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 14px;">
        <div>متوسط onset: <b style="color:white;">${Math.round(sumOnset / count)}</b></div>
        <div>متوسط burst: <b style="color:white;">${Math.round(sumBurst / count)}</b></div>
        <div>متوسط trans: <b style="color:white;">${Math.round(sumTrans / count)}</b></div>
        <div>متوسط sus: <b style="color:white;">${Math.round(sumSustain / count)}</b></div>
        <div>متوسط rel: <b style="color:white;">${Math.round(sumRelease / count)}</b></div>
      </div>
    </div>
  `;

  if(typeof renderToUnifiedPanel === 'function') {
    renderToUnifiedPanel(html);
  } else {
    console.warn("⚠️ مدير التقارير غير متاح لعرض الجينوم الزمني.");
  }
}

window.buildPhonemeTimeline = buildPhonemeTimeline;
window.buildOrderedPhonemeTimeline = buildOrderedPhonemeTimeline;
window.buildTimelineGenomeForPhoneme = buildTimelineGenomeForPhoneme;
window.renderTimelineGenomeReport = renderTimelineGenomeReport;

console.log("⏳ محرك المسار الزمني الإدراكي للحرف جاهز V1.5");
