// ================================
// phoneme-memory-trainer.js
// مدرب الذاكرة الإدراكية اللونية للحروف — V1.1
// ================================

console.log("🎨 phoneme-memory-trainer.js جاهز");

// ======================================
// تشغيل تدريب ذاكرة حرف
// ======================================

async function trainPhonemeMemory(phonemeKey) {
  try {
    const memory = getPhonemeMemory(phonemeKey);
    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!memory) {
      alert("لا توجد ذاكرة مسجلة لهذا الحرف: " + phonemeKey);
      return;
    }

    const units = pack && pack.positions
      ? pack.positions.map(function (p) {
          return {
            text: p.text,
            file: p.file,
            role: p.role
          };
        })
      : memory.trainingUnits;

    const missing = await findMissingTrainingFiles(units);

    if (missing.length) {
      alert(
        "لم تكتمل حقيبة التدريب الإدراكي بعد.\n\n" +
        "الملفات الناقصة:\n" +
        missing.join("\n") +
        "\n\nابدأ أولًا بزر: 🎙 تدريب الباء إدراكيًا"
      );
      return;
    }

    showPhonemeTrainingLoading(
      "جاري بناء ذاكرة لون " + memory.label + "..."
    );

    const samples = [];

    for (const unit of units) {

  console.log("🔍 قراءة ملف التدريب:", unit.file);

  const blob =
    await getAudioPromiseForMemory(unit.file);

  console.log("📦 نتيجة الملف:", unit.file, blob);

  if (!blob) {
    throw new Error("الصوت غير موجود: " + unit.file);
  }

  const decoded =
    await decodeBlobToMonoForMemory(blob);

  console.log(
    "✅ تم فك الصوت:",
    unit.file,
    decoded.sampleRate,
    decoded.samples.length
  );

  const features =
    extractPerceptualFeatures(
      decoded.samples,
      decoded.sampleRate
    );

  samples.push({
    text: unit.text,
    file: unit.file,
    role: unit.role,
    duration: decoded.samples.length / decoded.sampleRate,
    features
  });
}

    const identity = buildPerceptualIdentity(memory, samples);

    localStorage.setItem(
      phonemeKey + "_perceptual_identity",
      JSON.stringify(identity, null, 2)
    );

    renderPhonemeMemoryReport(identity);

    hidePhonemeTrainingLoading();

    alert(
      "تم بناء ذاكرة لون " + memory.label + "\n" +
      "اللون: " + memory.color.name + "\n" +
      "الثقة الإدراكية: " + identity.confidence.toFixed(4)
    );

  } catch (err) {
    hidePhonemeTrainingLoading();

    console.error("❌ فشل تدريب الذاكرة الإدراكية", err);

    alert(
      "فشل تدريب الذاكرة الإدراكية:\n" +
      err.message
    );
  }
}

// ======================================
// فحص ملفات التدريب قبل البناء
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
// بناء الهوية الإدراكية
// ======================================

function buildPerceptualIdentity(memory, samples) {
  const centroidValues = [];
  const spreadValues = [];
  const energyValues = [];
  const zcrValues = [];
  const durationValues = [];
  const burstValues = [];

  samples.forEach(function (sample) {
    centroidValues.push(sample.features.centroid);
    spreadValues.push(sample.features.spread);
    energyValues.push(sample.features.energy);
    zcrValues.push(sample.features.zcr);
    durationValues.push(sample.duration);
    burstValues.push(sample.features.burstiness);
  });

  return {
    method: "Phoneme Color Memory Trainer V1.1",

    phonemeKey: memory.key || memory.phonemeKey || memory.label || memory.phoneme,
    phoneme: memory.phoneme,
    label: memory.label,

    color: memory.color,

    trainingUnits: samples.map(function (s) {
      return {
        text: s.text,
        file: s.file,
        role: s.role,
        duration: roundMemory(s.duration),
        centroid: roundMemory(s.features.centroid),
        spread: roundMemory(s.features.spread),
        energy: roundMemory(s.features.energy),
        zcr: roundMemory(s.features.zcr),
        burstiness: roundMemory(s.features.burstiness)
      };
    }),

    perceptualSignature: {
      centroid: {
        mean: roundMemory(averageMemory(centroidValues)),
        variance: roundMemory(varianceMemory(centroidValues))
      },
      spread: {
        mean: roundMemory(averageMemory(spreadValues)),
        variance: roundMemory(varianceMemory(spreadValues))
      },
      energy: {
        mean: roundMemory(averageMemory(energyValues)),
        variance: roundMemory(varianceMemory(energyValues))
      },
      zcr: {
        mean: roundMemory(averageMemory(zcrValues)),
        variance: roundMemory(varianceMemory(zcrValues))
      },
      duration: {
        mean: roundMemory(averageMemory(durationValues)),
        variance: roundMemory(varianceMemory(durationValues))
      },
      burstiness: {
        mean: roundMemory(averageMemory(burstValues)),
        variance: roundMemory(varianceMemory(burstValues))
      }
    },

    confidence: calcPerceptualConfidence({
      centroidValues,
      spreadValues,
      energyValues,
      zcrValues,
      burstValues
    }),

    concept: memory.concept,

    createdAt: new Date().toISOString()
  };
}

// ======================================
// استخراج السمات الإدراكية
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
    burstiness
  };
}

// ======================================
// تحديد الجزء النشط
// ======================================

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
    return { start: 0, end: samples.length };
  }

  const maxEnergy = Math.max.apply(
    null,
    energies.map(function (e) {
      return e.energy;
    })
  );

  const threshold = maxEnergy * 0.12;

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
    end: endSample
  };
}

// ======================================
// طيف مبسط
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

    spectrum.push({ freq, magnitude });
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

// ======================================
// قياس الانفجارية
// ======================================

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

// ======================================
// ثقة الإدراك
// ======================================

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

  return (
    centroidScore * 0.25 +
    spreadScore * 0.20 +
    energyScore * 0.15 +
    zcrScore * 0.15 +
    burstScore * 0.25
  );
}

// ======================================
// تقرير الذاكرة الإدراكية
// ======================================

function renderPhonemeMemoryReport(identity) {
  let box = document.getElementById("phoneme-memory-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "phoneme-memory-report-box";
    box.style.background = "#08111f";
    box.style.color = "white";
    box.style.padding = "14px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "14px";
    box.style.fontSize = "13px";
    box.style.border = "1px solid " + identity.color.hex;

    const target =
      document.getElementById("perceptualTrainingView") ||
      document.getElementById("unitList") ||
      document.body;

    target.appendChild(box);
  }

  box.innerHTML = `
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
      الثقة الإدراكية:
      <b>${identity.confidence.toFixed(4)}</b>
    </div>

    <hr style="border-color:#1f2937;">

    <div style="font-weight:bold;margin:8px 0;">
      الوحدات التدريبية
    </div>

    ${identity.trainingUnits.map(function (u) {
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
        </div>
      `;
    }).join("")}

    <hr style="border-color:#1f2937;">

    <div>الهدف: ${identity.concept.goal}</div>
    <div>القاعدة: ${identity.concept.rule}</div>
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// ======================================
// قراءة الصوت مع منع التعليق
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

    const localBlob = getTrainingAudioFromLocalStorage(key);

    if (localBlob) {
      finish(localBlob);
      return;
    }

    if (typeof getAudio !== "function") {
      finish(null);
      return;
    }

    try {
      getAudio(key, function (blob) {
        finish(blob);
      });
    } catch (err) {
      console.warn("تعذر getAudio:", key, err);
      finish(null);
    }

    setTimeout(function () {
      finish(null);
    }, timeoutMs);
  });
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

  return new Blob([bytes], { type: mime });
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
// شاشة انتظار
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
// أدوات رياضية
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

function hannMemory(n, length) {
  if (length <= 1) return 1;

  return 0.5 * (
    1 -
    Math.cos(
      (2 * Math.PI * n) /
      (length - 1)
    )
  );
}

function nextPowerOfTwoMemory(n) {
  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}

function roundMemory(num) {
  return Number(num.toFixed(4));
}

console.log("🎨 مدرب الذاكرة الإدراكية جاهز V1.1");
