// ================================
// payload-lock-engine.js
// محرك تثبيت المحمول الحقيقي — الباء V1
// ================================

console.log("🎯 payload-lock-engine.js جاهز");

async function runPayloadLockEngine() {

  try {

    const onsetSaved = localStorage.getItem("ba_burst_onset_result");
    const coreSaved = localStorage.getItem("ba_pure_core");

    if (!onsetSaved) {
      alert("شغّل أولًا: 🔥 كشف بداية الانفجار");
      return;
    }

    if (!coreSaved) {
      alert("شغّل أولًا: 🧬 تنقية النواة المشتركة");
      return;
    }

    if (!wavesurfer || !wsRegions) {
      alert("لا يوجد صوت ظاهر للتثبيت");
      return;
    }

    const filenameEl = document.getElementById("filename");
    const currentKey = filenameEl ? filenameEl.innerText.trim() : "current";

    const blob = await getVisibleAudioBlobForPayloadLock(currentKey);

    if (!blob) {
      alert("لم يتم العثور على صوت الوحدة الحالية");
      return;
    }

    showPayloadLockLoading("جاري تثبيت المحمول الحقيقي...");

    const onset = JSON.parse(onsetSaved);
    const core = JSON.parse(coreSaved);
    const decoded = await decodeBlobToMono(blob);

    const result = lockTruePayload(
      decoded.samples,
      decoded.sampleRate,
      onset,
      core,
      currentKey
    );

    localStorage.setItem(
      "ba_locked_payload_result",
      JSON.stringify(result, null, 2)
    );

    renderPayloadLockReport(result);
    showPayloadLockRegion(result);

    hidePayloadLockLoading();

    alert(
      "تم تثبيت المحمول الحقيقي\n" +
      "البداية: " + result.start.toFixed(4) + "\n" +
      "النهاية: " + result.end.toFixed(4) + "\n" +
      "الثقة: " + result.confidence.toFixed(4)
    );

  } catch (err) {

    hidePayloadLockLoading();

    console.error("❌ فشل تثبيت المحمول الحقيقي", err);

    alert(
      "فشل تثبيت المحمول الحقيقي:\n" +
      err.message
    );
  }
}

function getVisibleAudioBlobForPayloadLock(key) {

  return new Promise(function (resolve) {

    const current =
      getCurrentAudioBlob &&
      getCurrentAudioBlob();

    if (current) {
      resolve(current);
      return;
    }

    getAudio(key, function (blob) {
      resolve(blob);
    });

  });
}

// ======================================
// تثبيت المحمول الحقيقي
// ======================================

function lockTruePayload(samples, sampleRate, onset, core, currentKey) {

  const searchStart = Math.max(0, onset.onsetTime - 0.015);
  const searchEnd = Math.min(
    samples.length / sampleRate,
    onset.onsetTime + 0.090
  );

  const frameSize = Math.floor(sampleRate * 0.012);
  const hopSize = Math.floor(sampleRate * 0.002);

  const startSample = Math.floor(searchStart * sampleRate);
  const endSample = Math.floor(searchEnd * sampleRate);

  const frames = [];

  for (
    let start = startSample;
    start + frameSize < endSample;
    start += hopSize
  ) {

    const frame = samples.slice(start, start + frameSize);

    const spectrum = extractSpectrum(frame, sampleRate);

    const coreScore = scorePayloadLockAgainstCore(
      spectrum,
      core.bands || []
    );

    const energy = calcRms(frame);

    frames.push({
      startSample: start,
      endSample: start + frameSize,
      time: start / sampleRate,
      coreScore,
      energy
    });
  }

  if (!frames.length) {
    throw new Error("لم يتم استخراج إطارات كافية للتثبيت");
  }

  const maxCore = Math.max.apply(
    null,
    frames.map(function (f) {
      return f.coreScore;
    })
  );

  let peakIndex = 0;

  frames.forEach(function (f, i) {
    if (f.coreScore > frames[peakIndex].coreScore) {
      peakIndex = i;
    }
  });

  const threshold = maxCore * 0.72;

  let left = peakIndex;

  while (
    left > 0 &&
    frames[left].coreScore >= threshold
  ) {
    left--;
  }

  let right = peakIndex;

  while (
    right < frames.length - 1 &&
    frames[right].coreScore >= threshold
  ) {
    right++;
  }

  // تضييق ذكي: لا نسمح للمحمول أن يتمدد كثيرًا في V1
  let lockedStart = frames[left].time;
  let lockedEnd = frames[right].endSample / sampleRate;

  const maxDuration = 0.045;
  const minDuration = 0.018;

  if (lockedEnd - lockedStart > maxDuration) {
    lockedStart = Math.max(
      onset.onsetTime,
      frames[peakIndex].time - 0.006
    );

    lockedEnd = lockedStart + maxDuration;
  }

  if (lockedEnd - lockedStart < minDuration) {
    lockedEnd = lockedStart + minDuration;
  }

  lockedEnd = Math.min(lockedEnd, searchEnd);

  const confidence = Math.min(1, maxCore);

  return {
    method: "Payload Lock Engine V1",
    phoneme: "بْ",
    file: currentKey,
    start: roundPayloadLock(lockedStart),
    end: roundPayloadLock(lockedEnd),
    duration: roundPayloadLock(lockedEnd - lockedStart),
    peak: roundPayloadLock(frames[peakIndex].time),
    confidence: roundPayloadLock(confidence),
    threshold: roundPayloadLock(threshold),
    onset: onset.onsetTime,
    frameCount: frames.length
  };
}

function scorePayloadLockAgainstCore(spectrum, bands) {

  if (!bands.length) return 0;

  const scores = bands.map(function (band) {

    const power = payloadLockBandPower(
      spectrum,
      band.from,
      band.to
    );

    const ref = band.power || 1;

    const ratio = power / ref;

    return Math.max(
      0,
      Math.min(
        1,
        ratio > 1 ? 1 / ratio : ratio
      )
    );
  });

  return averagePayloadLock(scores);
}

function payloadLockBandPower(spectrum, from, to) {

  const bins = spectrum.filter(function (bin) {
    return bin.freq >= from && bin.freq < to;
  });

  if (!bins.length) return 0;

  return averagePayloadLock(
    bins.map(function (bin) {
      return bin.magnitude;
    })
  );
}

// ======================================
// إظهار المنطقة
// ======================================

function showPayloadLockRegion(result) {

  if (!wsRegions) return;

  removeOldPayloadLockRegion();

  wsRegions.addRegion({
    id: "lockedPayload",
    start: result.start,
    end: result.end,
    color: "rgba(34, 197, 94, 0.55)",
    drag: true,
    resize: true
  });

  wsRegions.addRegion({
    id: "lockedPayloadPeak",
    start: Math.max(0, result.peak - 0.004),
    end: result.peak + 0.004,
    color: "rgba(14, 165, 233, 0.85)",
    drag: false,
    resize: false
  });
}

function removeOldPayloadLockRegion() {

  if (!wsRegions) return;

  wsRegions.getRegions().forEach(function (region) {

    if (
      region.id === "lockedPayload" ||
      region.id === "lockedPayloadPeak"
    ) {
      region.remove();
    }

  });
}

// ======================================
// تقرير
// ======================================

function renderPayloadLockReport(result) {

  let box = document.getElementById("payload-lock-report-box");

  if (!box) {

    box = document.createElement("div");

    box.id = "payload-lock-report-box";

    box.style.background = "#052e16";
    box.style.color = "white";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "12px";
    box.style.fontSize = "13px";

    const target =
      document.getElementById("burst-onset-report-box") ||
      document.getElementById("true-payload-report-box") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.innerHTML = `
    <div style="font-size:18px;font-weight:bold;color:#22c55e;margin-bottom:10px;">
      🎯 تقرير تثبيت المحمول الحقيقي
    </div>

    <div>الحرف: <b>${result.phoneme}</b></div>
    <div>الملف: <b>${result.file}</b></div>
    <div>البداية المثبتة: <b>${result.start}</b></div>
    <div>النهاية المثبتة: <b>${result.end}</b></div>
    <div>المدة: <b>${result.duration}</b></div>
    <div>الذروة: <b>${result.peak}</b></div>
    <div>الثقة: <b>${result.confidence}</b></div>
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// ======================================
// شاشة انتظار
// ======================================

function showPayloadLockLoading(text) {

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

function hidePayloadLockLoading() {

  const box = document.getElementById("global-loading");

  if (box) {
    box.style.display = "none";
  }
}

function averagePayloadLock(arr) {

  if (!arr.length) return 0;

  return arr.reduce(function (a, b) {
    return a + b;
  }, 0) / arr.length;
}

function roundPayloadLock(num) {
  return Number(num.toFixed(4));
}
