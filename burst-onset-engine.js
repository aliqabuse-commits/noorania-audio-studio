// ================================
// burst-onset-engine.js
// محرك كشف بداية الانفجار — الباء V1
// ================================

console.log("🔥 burst-onset-engine.js جاهز");

async function runBurstOnsetEngine() {

  try {

    if (!wavesurfer || !wsRegions) {
      alert("لا يوجد صوت ظاهر للتحليل");
      return;
    }

    const filenameEl = document.getElementById("filename");
    const currentKey = filenameEl ? filenameEl.innerText.trim() : "current";

    const blob = await getVisibleAudioBlobForOnset(currentKey);

    if (!blob) {
      alert("لم يتم العثور على صوت الوحدة الحالية");
      return;
    }

    showOnsetLoading("جاري كشف بداية الانفجار...");

    const decoded = await decodeBlobToMono(blob);

    const result = detectBurstOnset(
      decoded.samples,
      decoded.sampleRate,
      currentKey
    );

    localStorage.setItem(
      "ba_burst_onset_result",
      JSON.stringify(result, null, 2)
    );

    renderBurstOnsetReport(result);
    showBurstOnsetRegion(result);

    hideOnsetLoading();

    alert(
      "تم كشف بداية الانفجار\n" +
      "البداية: " + result.onsetTime.toFixed(4) + "\n" +
      "الذروة: " + result.peakTime.toFixed(4) + "\n" +
      "الثقة: " + result.confidence.toFixed(4)
    );

  } catch (err) {

    hideOnsetLoading();

    console.error("❌ فشل كشف بداية الانفجار", err);

    alert(
      "فشل كشف بداية الانفجار:\n" +
      err.message
    );
  }
}


function getVisibleAudioBlobForOnset(key) {

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
// كشف بداية الانفجار
// ======================================

function detectBurstOnset(samples, sampleRate, currentKey) {

  const frameSize = Math.floor(sampleRate * 0.008);
  const hopSize = Math.floor(sampleRate * 0.002);

  const frames = [];

  for (
    let start = 0;
    start + frameSize < samples.length;
    start += hopSize
  ) {

    const frame = samples.slice(start, start + frameSize);

    const energy = calcRms(frame);
    const zcr = calcZeroCrossingRate(frame);

    frames.push({
      startSample: start,
      endSample: start + frameSize,
      time: start / sampleRate,
      energy,
      zcr
    });
  }

  if (frames.length < 5) {
    throw new Error("الصوت قصير جدًا للتحليل");
  }

  const fluxFrames = [];

  for (let i = 1; i < frames.length; i++) {

    const energyRise =
      Math.max(0, frames[i].energy - frames[i - 1].energy);

    const zcrRise =
      Math.max(0, frames[i].zcr - frames[i - 1].zcr);

    const score =
      energyRise * 0.75 +
      zcrRise * 0.25;

    fluxFrames.push({
      index: i,
      time: frames[i].time,
      score,
      energy: frames[i].energy,
      zcr: frames[i].zcr
    });
  }

  const maxScore = Math.max.apply(
    null,
    fluxFrames.map(function (f) {
      return f.score;
    })
  );

  let best = fluxFrames[0];

  fluxFrames.forEach(function (f) {
    if (f.score > best.score) {
      best = f;
    }
  });

  const peakIndex = best.index;

  let onsetIndex = peakIndex;

  const threshold = maxScore * 0.25;

  while (
    onsetIndex > 1 &&
    fluxFrames[onsetIndex - 1] &&
    fluxFrames[onsetIndex - 1].score > threshold
  ) {
    onsetIndex--;
  }

  const onsetFrame = frames[onsetIndex];
  const peakFrame = frames[peakIndex];

  const windowStart = onsetFrame.time;
  const windowEnd = Math.min(
    samples.length / sampleRate,
    peakFrame.time + 0.050
  );

  const confidence =
    maxScore / (maxScore + averageOnset(fluxFrames.map(f => f.score)));

  return {
    method: "Burst Onset Engine V1",
    phoneme: "بْ",
    file: currentKey,
    onsetTime: roundOnset(windowStart),
    peakTime: roundOnset(peakFrame.time),
    endTime: roundOnset(windowEnd),
    duration: roundOnset(windowEnd - windowStart),
    confidence: roundOnset(confidence),
    maxScore: roundOnset(maxScore),
    frameCount: frames.length
  };
}


// ======================================
// إظهار المنطقة على الموجة
// ======================================

function showBurstOnsetRegion(result) {

  if (!wsRegions) return;

  removeOldBurstOnsetRegion();

  wsRegions.addRegion({
    id: "burstOnsetWindow",
    start: result.onsetTime,
    end: result.endTime,
    color: "rgba(249, 115, 22, 0.40)",
    drag: true,
    resize: true
  });

  wsRegions.addRegion({
    id: "burstOnsetLine",
    start: result.onsetTime,
    end: result.onsetTime + 0.008,
    color: "rgba(239, 68, 68, 0.80)",
    drag: false,
    resize: false
  });

}


function removeOldBurstOnsetRegion() {

  if (!wsRegions) return;

  wsRegions.getRegions().forEach(function (region) {

    if (
      region.id === "burstOnsetWindow" ||
      region.id === "burstOnsetLine"
    ) {
      region.remove();
    }

  });
}


// ======================================
// تقرير
// ======================================

function renderBurstOnsetReport(result) {

  let box =
    document.getElementById("burst-onset-report-box");

  if (!box) {

    box = document.createElement("div");

    box.id = "burst-onset-report-box";

    box.style.background = "#431407";
    box.style.color = "white";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "12px";
    box.style.fontSize = "13px";

    const target =
      document.getElementById("true-payload-report-box") ||
      document.getElementById("pure-core-report-box") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.innerHTML = `
    <div style="font-size:18px;font-weight:bold;color:#fb923c;margin-bottom:10px;">
      🔥 تقرير بداية الانفجار
    </div>

    <div>الحرف: <b>${result.phoneme}</b></div>
    <div>الملف: <b>${result.file}</b></div>
    <div>بداية الانفجار: <b>${result.onsetTime}</b></div>
    <div>ذروة القفزة: <b>${result.peakTime}</b></div>
    <div>النهاية المقترحة: <b>${result.endTime}</b></div>
    <div>المدة: <b>${result.duration}</b></div>
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

function showOnsetLoading(text) {

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


function hideOnsetLoading() {

  const box = document.getElementById("global-loading");

  if (box) {
    box.style.display = "none";
  }
}


// ======================================
// أدوات
// ======================================

function averageOnset(arr) {

  if (!arr.length) return 0;

  return arr.reduce(function (a, b) {
    return a + b;
  }, 0) / arr.length;
}


function roundOnset(num) {

  return Number(num.toFixed(4));
}
