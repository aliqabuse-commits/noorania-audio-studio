// ================================
// burst-signature-engine.js
// محرك بصمة الانفجار — باء ساكنة V2
// ================================

console.log("💥 burst-signature-engine.js جاهز — Burst Marker Active");

async function runBurstSignatureEngine() {
  try {
    const result = await buildBurstSignature(BA_COMMON_PAYLOAD_KEYS);

    console.log("💥 نتيجة بصمة الانفجار:", result);

    localStorage.setItem(
      "ba_burst_signature",
      JSON.stringify(result, null, 2)
    );

    renderBurstReport(result);
    showBurstMarkerForCurrentFile();

    alert(
      "تم استخراج نافذة انفجار الباء\n" +
      "متوسط زمن الانفجار: " + result.averageBurstTime.toFixed(4) + "\n" +
      "الثقة: " + result.confidence.toFixed(4)
    );

  } catch (err) {
    console.error("❌ فشل محرك بصمة الانفجار", err);
    alert("فشل استخراج نافذة الانفجار:\n" + err.message);
  }
}

async function buildBurstSignature(keys) {
  const samples = [];

  for (const key of keys) {
    const blob = await getAudioPromise(key);

    if (!blob) {
      throw new Error("الصوت غير موجود: " + key);
    }

    const decoded = await decodeBlobToMono(blob);

    const frames = extractBurstFrames(
      decoded.samples,
      decoded.sampleRate
    );

    const burst = detectBurstWindow(frames);

    samples.push({
      key,
      duration: decoded.samples.length / decoded.sampleRate,
      burst
    });
  }

  const averageBurstTime = average(
    samples.map(s => s.burst.peakTime)
  );

  const confidence = calcBurstStability(samples);

  return {
    method: "Burst Signature Engine V2",
    phoneme: "بْ",
    averageBurstTime,
    confidence,
    samples
  };
}

function extractBurstFrames(samples, sampleRate) {
  const frameSize = Math.floor(sampleRate * 0.010);
  const hopSize = Math.floor(sampleRate * 0.003);

  const frames = [];

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const frame = samples.slice(start, start + frameSize);
    const energy = calcRms(frame);

    frames.push({
      time: start / sampleRate,
      energy
    });
  }

  return frames;
}

function detectBurstWindow(frames) {
  if (!frames.length) {
    return {
      startTime: 0,
      peakTime: 0,
      endTime: 0,
      peakEnergy: 0,
      attackSpeed: 0,
      width: 0
    };
  }

  let peakIndex = 0;
  let peakEnergy = 0;

  for (let i = 0; i < frames.length; i++) {
    if (frames[i].energy > peakEnergy) {
      peakEnergy = frames[i].energy;
      peakIndex = i;
    }
  }

  const thresholdStart = peakEnergy * 0.20;
  const thresholdEnd = peakEnergy * 0.25;

  let startIndex = peakIndex;
  while (startIndex > 0 && frames[startIndex].energy > thresholdStart) {
    startIndex--;
  }

  let endIndex = peakIndex;
  while (endIndex < frames.length - 1 && frames[endIndex].energy > thresholdEnd) {
    endIndex++;
  }

  const startTime = frames[startIndex].time;
  const peakTime = frames[peakIndex].time;
  const endTime = frames[endIndex].time;

  return {
    startTime,
    peakTime,
    endTime,
    peakEnergy,
    attackSpeed: peakEnergy / Math.max(0.001, peakTime - startTime),
    width: endTime - startTime
  };
}

function calcBurstStability(samples) {
  const times = samples.map(s => s.burst.peakTime);
  const widths = samples.map(s => s.burst.width);

  const timeScore = 1 / (1 + variance(times));
  const widthScore = 1 / (1 + variance(widths));

  return (timeScore + widthScore) / 2;
}

function renderBurstReport(result) {
  let box = document.getElementById("burst-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "burst-report-box";
    box.style.background = "#1f2937";
    box.style.color = "white";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "10px";
    box.style.fontSize = "13px";

    const target = document.getElementById("common-payload-report");
    if (target && target.parentNode) {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.style.display = "block";

  box.innerHTML = `
    <div style="font-weight:bold;color:#facc15;margin-bottom:8px;">
      💥 تقرير نافذة انفجار الباء
    </div>

    <div>الحرف: <b>${result.phoneme}</b></div>
    <div>متوسط زمن الانفجار: <b>${result.averageBurstTime.toFixed(4)}</b></div>
    <div>ثقة الثبات: <b>${result.confidence.toFixed(4)}</b></div>

    <hr style="border-color:#374151;">

    ${result.samples.map(s => `
      <div style="background:#111827;padding:8px;margin:6px 0;border-radius:8px;">
        <div><b>${s.key}</b></div>
        <div>start: ${s.burst.startTime.toFixed(4)}</div>
        <div>peak: ${s.burst.peakTime.toFixed(4)}</div>
        <div>end: ${s.burst.endTime.toFixed(4)}</div>
        <div>width: ${s.burst.width.toFixed(4)}</div>
        <div>attack: ${s.burst.attackSpeed.toFixed(4)}</div>
      </div>
    `).join("")}
  `;
}

// =====================================
// إظهار نافذة الانفجار على الموجة الحالية
// =====================================

function showBurstMarkerForCurrentFile() {
  if (!wavesurfer || !wsRegions) return;

  const filenameEl = document.getElementById("filename");
  if (!filenameEl) return;

  const currentKey = filenameEl.innerText.trim();

  const saved = localStorage.getItem("ba_burst_signature");
  if (!saved) return;

  const result = JSON.parse(saved);

  const found = result.samples.find(function (s) {
    return s.key === currentKey;
  });

  if (!found) return;

  removeOldBurstRegions();

  wsRegions.addRegion({
    id: "burstWindow",
    start: found.burst.startTime,
    end: found.burst.endTime,
    color: "rgba(250, 204, 21, 0.45)",
    drag: false,
    resize: false
  });

  wsRegions.addRegion({
    id: "burstPeak",
    start: Math.max(0, found.burst.peakTime - 0.006),
    end: found.burst.peakTime + 0.006,
    color: "rgba(239, 68, 68, 0.65)",
    drag: false,
    resize: false
  });

  showBurstText(found, result);
}

function removeOldBurstRegions() {
  if (!wsRegions) return;

  wsRegions.getRegions().forEach(function (region) {
    if (region.id === "burstWindow" || region.id === "burstPeak") {
      region.remove();
    }
  });
}

function showBurstText(found, result) {
  let box = document.getElementById("burst-marker-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "burst-marker-box";

    box.style.background = "#713f12";
    box.style.color = "white";
    box.style.padding = "8px";
    box.style.margin = "8px 0";
    box.style.borderRadius = "8px";
    box.style.fontSize = "13px";
    box.style.textAlign = "center";
    box.style.border = "1px solid #facc15";

    const waveformContainer = document.getElementById("waveform-container");

    if (waveformContainer && waveformContainer.parentNode) {
      waveformContainer.parentNode.insertBefore(
        box,
        waveformContainer
      );
    }
  }

  box.style.display = "block";

  box.innerText =
    "💥 نافذة الانفجار: " +
    found.burst.startTime.toFixed(3) +
    " → " +
    found.burst.endTime.toFixed(3) +
    " | الذروة: " +
    found.burst.peakTime.toFixed(3) +
    " | الثقة: " +
    result.confidence.toFixed(4);
}

// =====================================
// أدوات رياضية
// =====================================

function average(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values) {
  if (!values.length) return 0;
  const avg = average(values);
  return average(values.map(v => (v - avg) * (v - avg)));
}
