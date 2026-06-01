// ================================
// payload-purifier-engine.js
// محرك تنظيف المحمول — الباء V1
// ================================

console.log("🧼 payload-purifier-engine.js جاهز");

async function runPayloadPurifierEngine() {

  try {

    const lockSaved = localStorage.getItem("ba_locked_payload_result");
    const coreSaved = localStorage.getItem("ba_pure_core");

    if (!lockSaved) {
      alert("شغّل أولًا: 🎯 تثبيت المحمول الحقيقي");
      return;
    }

    if (!coreSaved) {
      alert("شغّل أولًا: 🧬 تنقية النواة المشتركة");
      return;
    }

    const filenameEl = document.getElementById("filename");
    const currentKey = filenameEl ? filenameEl.innerText.trim() : "current";

    const blob = await getVisibleAudioBlobForPurifier(currentKey);

    if (!blob) {
      alert("لم يتم العثور على صوت الوحدة الحالية");
      return;
    }

    showPayloadPurifierLoading("جاري تنظيف المحمول...");

    const lock = JSON.parse(lockSaved);
    const core = JSON.parse(coreSaved);
    const decoded = await decodeBlobToMono(blob);

    const result = purifyLockedPayload(
      decoded.samples,
      decoded.sampleRate,
      lock,
      core,
      currentKey
    );

    localStorage.setItem(
      "ba_purified_payload_result",
      JSON.stringify(result, null, 2)
    );

    renderPayloadPurifierReport(result);
    showPayloadPurifierRegion(result);

    hidePayloadPurifierLoading();

    alert(
      "تم تنظيف المحمول\n" +
      "البداية: " + result.start.toFixed(4) + "\n" +
      "النهاية: " + result.end.toFixed(4) + "\n" +
      "النقاء: " + result.purity.toFixed(4)
    );

  } catch (err) {

    hidePayloadPurifierLoading();

    console.error("❌ فشل تنظيف المحمول", err);

    alert(
      "فشل تنظيف المحمول:\n" +
      err.message
    );
  }
}

function getVisibleAudioBlobForPurifier(key) {

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
// تنظيف المحمول المثبت
// ======================================

function purifyLockedPayload(samples, sampleRate, lock, core, currentKey) {

  const searchStart = lock.start;
  const searchEnd = lock.end;

  const frameSize = Math.floor(sampleRate * 0.008);
  const hopSize = Math.floor(sampleRate * 0.0015);

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

    const coreScore = scorePurifierCore(spectrum, core.bands || []);
    const outsiderScore = scoreOutsiderEnergy(spectrum, core.bands || []);
    const purity = coreScore * (1 - outsiderScore);

    frames.push({
      startSample: start,
      endSample: start + frameSize,
      time: start / sampleRate,
      coreScore,
      outsiderScore,
      purity
    });
  }

  if (!frames.length) {
    throw new Error("لم يتم استخراج إطارات كافية للتنظيف");
  }

  let bestIndex = 0;

  frames.forEach(function (f, i) {
    if (f.purity > frames[bestIndex].purity) {
      bestIndex = i;
    }
  });

  const maxPurity = frames[bestIndex].purity;
  const threshold = maxPurity * 0.78;

  let left = bestIndex;

  while (
    left > 0 &&
    frames[left].purity >= threshold
  ) {
    left--;
  }

  let right = bestIndex;

  while (
    right < frames.length - 1 &&
    frames[right].purity >= threshold
  ) {
    right++;
  }

  let cleanStart = frames[left].time;
  let cleanEnd = frames[right].endSample / sampleRate;

  const maxDuration = 0.030;
  const minDuration = 0.012;

  if (cleanEnd - cleanStart > maxDuration) {
    cleanStart = Math.max(
      searchStart,
      frames[bestIndex].time - 0.004
    );

    cleanEnd = cleanStart + maxDuration;
  }

  if (cleanEnd - cleanStart < minDuration) {
    cleanEnd = cleanStart + minDuration;
  }

  cleanEnd = Math.min(cleanEnd, searchEnd);

  return {
    method: "Payload Purifier Engine V1",
    phoneme: "بْ",
    file: currentKey,

    start: roundPayloadPurifier(cleanStart),
    end: roundPayloadPurifier(cleanEnd),
    duration: roundPayloadPurifier(cleanEnd - cleanStart),
    peak: roundPayloadPurifier(frames[bestIndex].time),

    purity: roundPayloadPurifier(maxPurity),
    threshold: roundPayloadPurifier(threshold),

    coreScore: roundPayloadPurifier(frames[bestIndex].coreScore),
    outsiderScore: roundPayloadPurifier(frames[bestIndex].outsiderScore),

    sourceLock: {
      start: lock.start,
      end: lock.end,
      duration: lock.duration
    },

    frameCount: frames.length
  };
}

// ======================================
// قياس حضور نواة الباء
// ======================================

function scorePurifierCore(spectrum, bands) {

  if (!bands.length) return 0;

  const scores = bands.map(function (band) {

    const power = purifierBandPower(
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

  return averagePayloadPurifier(scores);
}

// ======================================
// قياس الطاقة الدخيلة خارج النواة
// ======================================

function scoreOutsiderEnergy(spectrum, bands) {

  const minFreq = 80;
  const maxFreq = 3000;

  const coreRanges = bands.map(function (b) {
    return {
      from: b.from,
      to: b.to
    };
  });

  let inside = 0;
  let outside = 0;

  spectrum.forEach(function (bin) {

    if (bin.freq < minFreq || bin.freq > maxFreq) {
      return;
    }

    const isCore = coreRanges.some(function (r) {
      return bin.freq >= r.from && bin.freq < r.to;
    });

    if (isCore) {
      inside += bin.magnitude;
    } else {
      outside += bin.magnitude;
    }

  });

  const total = inside + outside;

  if (!total) return 1;

  return outside / total;
}

function purifierBandPower(spectrum, from, to) {

  const bins = spectrum.filter(function (bin) {
    return bin.freq >= from && bin.freq < to;
  });

  if (!bins.length) return 0;

  return averagePayloadPurifier(
    bins.map(function (bin) {
      return bin.magnitude;
    })
  );
}

// ======================================
// إظهار منطقة المحمول المنظف
// ======================================

function showPayloadPurifierRegion(result) {

  if (!wsRegions) return;

  removeOldPayloadPurifierRegion();

  wsRegions.addRegion({
    id: "purifiedPayload",
    start: result.start,
    end: result.end,
    color: "rgba(16, 185, 129, 0.75)",
    drag: true,
    resize: true
  });

  wsRegions.addRegion({
    id: "purifiedPayloadPeak",
    start: Math.max(0, result.peak - 0.003),
    end: result.peak + 0.003,
    color: "rgba(255, 255, 255, 0.85)",
    drag: false,
    resize: false
  });
}

function removeOldPayloadPurifierRegion() {

  if (!wsRegions) return;

  wsRegions.getRegions().forEach(function (region) {

    if (
      region.id === "purifiedPayload" ||
      region.id === "purifiedPayloadPeak"
    ) {
      region.remove();
    }

  });
}

// ======================================
// تقرير
// ======================================

function renderPayloadPurifierReport(result) {

  let box = document.getElementById("payload-purifier-report-box");

  if (!box) {

    box = document.createElement("div");

    box.id = "payload-purifier-report-box";

    box.style.background = "#022c22";
    box.style.color = "white";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "12px";
    box.style.fontSize = "13px";

    const target =
      document.getElementById("payload-lock-report-box") ||
      document.getElementById("burst-onset-report-box") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.innerHTML = `
    <div style="font-size:18px;font-weight:bold;color:#34d399;margin-bottom:10px;">
      🧼 تقرير تنظيف المحمول
    </div>

    <div>الحرف: <b>${result.phoneme}</b></div>
    <div>الملف: <b>${result.file}</b></div>

    <hr style="border-color:#064e3b;">

    <div>البداية المنظفة: <b>${result.start}</b></div>
    <div>النهاية المنظفة: <b>${result.end}</b></div>
    <div>المدة: <b>${result.duration}</b></div>
    <div>الذروة: <b>${result.peak}</b></div>

    <hr style="border-color:#064e3b;">

    <div>النقاء: <b>${result.purity}</b></div>
    <div>حضور النواة: <b>${result.coreScore}</b></div>
    <div>الطاقة الدخيلة: <b>${result.outsiderScore}</b></div>

    <hr style="border-color:#064e3b;">

    <div>
      من المحمول المثبت:
      <b>${result.sourceLock.start}</b>
      →
      <b>${result.sourceLock.end}</b>
    </div>
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// ======================================
// شاشة انتظار
// ======================================

function showPayloadPurifierLoading(text) {

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

function hidePayloadPurifierLoading() {

  const box = document.getElementById("global-loading");

  if (box) {
    box.style.display = "none";
  }
}

function averagePayloadPurifier(arr) {

  if (!arr.length) return 0;

  return arr.reduce(function (a, b) {
    return a + b;
  }, 0) / arr.length;
}

function roundPayloadPurifier(num) {
  return Number(num.toFixed(4));
}
