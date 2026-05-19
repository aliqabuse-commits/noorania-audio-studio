// ================================
// burst-signature-engine.js
// محرك بصمة الانفجار — باء ساكنة V1
// ================================

console.log("💥 burst-signature-engine.js جاهز");

async function runBurstSignatureEngine() {
  try {
    const result = await buildBurstSignature(BA_COMMON_PAYLOAD_KEYS);

    console.log("💥 نتيجة بصمة الانفجار:", result);

    localStorage.setItem(
      "ba_burst_signature",
      JSON.stringify(result, null, 2)
    );

    renderBurstReport(result);

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
    method: "Burst Signature Engine V1",
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

  const thresholdLow = peakEnergy * 0.20;
  const thresholdEnd = peakEnergy * 0.25;

  let startIndex = peakIndex;
  while (startIndex > 0 && frames[startIndex].energy > thresholdLow) {
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

function average(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values) {
  if (!values.length) return 0;
  const avg = average(values);
  return average(values.map(v => (v - avg) * (v - avg)));
}
