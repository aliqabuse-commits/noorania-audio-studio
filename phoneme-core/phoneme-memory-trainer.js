// ================================
// phoneme-core/phoneme-memory-trainer.js
// مدرب الذاكرة الإدراكية اللونية للحروف — V2
// يقرأ الذاكرة القديمة + الذاكرة التراكمية + يبني ذاكرة عند عدم وجودها
// ================================

console.log("🎨 phoneme-memory-trainer.js جاهز V2");


// ======================================
// 1) قراءة ذاكرة الحرف من كل المفاتيح المعروفة
// ======================================
function getMemoryForTraining(phonemeKey) {
  if (typeof getPhonemeMemory === "function") {
    const direct = getPhonemeMemory(phonemeKey);
    if (direct) return direct;
  }

  if (typeof getAnyStoredPhonemeMemory === "function") {
    const cumulative = getAnyStoredPhonemeMemory(phonemeKey);
    if (cumulative) return normalizeMemoryForTrainer(phonemeKey, cumulative);
  }

  const keys = [
    phonemeKey + "_perceptual_identity",
    phonemeKey + "_cumulative_memory",
    phonemeKey + "_memory",
    "phoneme_memory_" + phonemeKey,
    "cognitive_memory_" + phonemeKey,
    phonemeKey + "_cognitive_identity"
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed) return normalizeMemoryForTrainer(phonemeKey, parsed);
    } catch (err) {
      console.warn("⚠️ تعذر قراءة ذاكرة:", key, err);
    }
  }

  return buildFallbackMemoryFromPack(phonemeKey);
}


// ======================================
// 2) بناء ذاكرة أساسية من الحقيبة إن لم توجد ذاكرة
// ======================================
function buildFallbackMemoryFromPack(phonemeKey) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(phonemeKey)
      : null;

  if (!pack) return null;

  const colorBinding =
    typeof bindPhonemeToColor === "function"
      ? bindPhonemeToColor(pack.colorKey || phonemeKey)
      : null;

  return {
    method: "Fallback Memory From Training Pack",
    key: phonemeKey,
    phonemeKey: phonemeKey,
    phoneme: pack.letter || phonemeKey,
    label: pack.name || phonemeKey,
    color: {
      hex: colorBinding?.hex || pack.colorHex || "#38BDF8",
      name: colorBinding?.colorName || pack.colorName || "Noorani Color"
    },
    concept: {
      goal: "بناء ذاكرة إدراكية تراكمية للحرف من تسجيلاته.",
      rule: "لا تُمسح الذاكرة عند إعادة التسجيل، بل تضاف العينة الجديدة إلى الأثر السابق."
    },
    trainingUnits: pack.positions || []
  };
}


function normalizeMemoryForTrainer(phonemeKey, memory) {
  const pack =
    typeof getPhonemeTrainingPack === "function"
      ? getPhonemeTrainingPack(phonemeKey)
      : null;

  const colorBinding =
    typeof bindPhonemeToColor === "function"
      ? bindPhonemeToColor(pack?.colorKey || phonemeKey)
      : null;

  return {
    method: memory.method || "Normalized Memory For Trainer",
    key: memory.key || memory.phonemeKey || phonemeKey,
    phonemeKey: memory.phonemeKey || memory.key || phonemeKey,
    phoneme: memory.phoneme || pack?.letter || phonemeKey,
    label: memory.label || pack?.name || phonemeKey,
    color: memory.color || {
      hex: colorBinding?.hex || pack?.colorHex || "#38BDF8",
      name: colorBinding?.colorName || pack?.colorName || "Noorani Color"
    },
    concept: memory.concept || {
      goal: "تثبيت ذاكرة إدراكية للحرف.",
      rule: "التسجيل الجديد لا يمحو الذاكرة السابقة."
    },
    trainingUnits:
      memory.trainingUnits ||
      memory.units ||
      pack?.positions ||
      []
  };
}


// ======================================
// 3) تدريب ذاكرة الحرف
// ======================================
async function trainPhonemeMemory(phonemeKey) {
  try {
    const memory = getMemoryForTraining(phonemeKey);

    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!memory && !pack) {
      alert("لا توجد حقيبة ولا ذاكرة لهذا الحرف: " + phonemeKey);
      return;
    }

    const units =
      pack && pack.positions
        ? pack.positions.map(function (p) {
            return {
              text: p.text,
              file: p.file,
              role: p.role
            };
          })
        : (memory.trainingUnits || []);

    if (!units.length) {
      alert("لا توجد وحدات تدريبية لهذا الحرف: " + phonemeKey);
      return;
    }

    const missing = await findMissingTrainingFiles(units);

    if (missing.length) {
      alert(
        "لم تكتمل حقيبة التدريب الإدراكي بعد.\n\n" +
          "الملفات الناقصة:\n" +
          missing.join("\n") +
          "\n\nابدأ أولًا بزر: 🎙 تدريب هذا الحرف إدراكيًا"
      );
      return;
    }

    showPhonemeTrainingLoading("جاري بناء ذاكرة لون " + memory.label + "...");

    const samples = [];

    for (const unit of units) {
      const blob = await getAudioPromiseForMemory(unit.file, 3000);

      if (!blob) {
        throw new Error("الصوت غير موجود: " + unit.file);
      }

      const decoded = await decodeBlobToMonoForMemory(blob);

      const features = extractPerceptualFeatures(
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

    savePerceptualIdentityEverywhere(phonemeKey, identity);

    renderPhonemeMemoryReport(identity);

    hidePhonemeTrainingLoading();

    alert(
      "تم بناء ذاكرة لون " +
        memory.label +
        "\nاللون: " +
        memory.color.name +
        "\nالثقة الإدراكية: " +
        identity.confidence.toFixed(4)
    );

    return identity;
  } catch (err) {
    hidePhonemeTrainingLoading();
    console.error("❌ فشل تدريب الذاكرة الإدراكية", err);
    alert("فشل تدريب الذاكرة الإدراكية:\n" + err.message);
    return null;
  }
}


// ======================================
// 4) حفظ الذاكرة في كل المفاتيح التي قد يقرأها النظام
// ======================================
function savePerceptualIdentityEverywhere(phonemeKey, identity) {
  localStorage.setItem(
    phonemeKey + "_perceptual_identity",
    JSON.stringify(identity, null, 2)
  );

  localStorage.setItem(
    phonemeKey + "_memory",
    JSON.stringify(identity, null, 2)
  );

  localStorage.setItem(
    "phoneme_memory_" + phonemeKey,
    JSON.stringify(identity, null, 2)
  );

  const oldRaw = localStorage.getItem(phonemeKey + "_cumulative_memory");
  let cumulative = null;

  if (oldRaw) {
    try {
      cumulative = JSON.parse(oldRaw);
    } catch (err) {
      cumulative = null;
    }
  }

  if (!cumulative) {
    cumulative = {
      method: "Noorani Cumulative Phoneme Memory V1",
      phonemeKey: phonemeKey,
      key: phonemeKey,
      phoneme: identity.phoneme,
      label: identity.label,
      color: identity.color,
      samplesCount: 0,
      samples: [],
      attemptHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: null
    };
  }

  if (!Array.isArray(cumulative.samples)) cumulative.samples = [];
  if (!Array.isArray(cumulative.attemptHistory)) cumulative.attemptHistory = [];

  const sample = {
    id: phonemeKey + "_memory_" + Date.now(),
    createdAt: new Date().toISOString(),
    source: "phoneme-memory-trainer",
    phonemeKey: phonemeKey,
    identity: identity
  };

  cumulative.samples.push(sample);
  cumulative.attemptHistory.push({
    id: sample.id,
    createdAt: sample.createdAt,
    source: sample.source,
    accepted: true,
    confidence: identity.confidence
  });

  cumulative.samplesCount = cumulative.samples.length;
  cumulative.latestPerceptualIdentity = identity;
  cumulative.updatedAt = new Date().toISOString();

  localStorage.setItem(
    phonemeKey + "_cumulative_memory",
    JSON.stringify(cumulative, null, 2)
  );

  localStorage.setItem(
    "cognitive_memory_" + phonemeKey,
    JSON.stringify(cumulative, null, 2)
  );
}


// ======================================
// 5) فحص التسجيلات الناقصة
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
// 6) بناء الهوية الإدراكية
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
    method: "Phoneme Color Memory Trainer V2",
    phonemeKey:
      memory.key ||
      memory.phonemeKey ||
      memory.label ||
      memory.phoneme,

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
        variance: roundMemory(varianceMemory(centroidValues)),
        min: roundMemory(Math.min.apply(null, centroidValues)),
        max: roundMemory(Math.max.apply(null, centroidValues))
      },
      spread: {
        mean: roundMemory(averageMemory(spreadValues)),
        variance: roundMemory(varianceMemory(spreadValues)),
        min: roundMemory(Math.min.apply(null, spreadValues)),
        max: roundMemory(Math.max.apply(null, spreadValues))
      },
      energy: {
        mean: roundMemory(averageMemory(energyValues)),
        variance: roundMemory(varianceMemory(energyValues)),
        min: roundMemory(Math.min.apply(null, energyValues)),
        max: roundMemory(Math.max.apply(null, energyValues))
      },
      zcr: {
        mean: roundMemory(averageMemory(zcrValues)),
        variance: roundMemory(varianceMemory(zcrValues)),
        min: roundMemory(Math.min.apply(null, zcrValues)),
        max: roundMemory(Math.max.apply(null, zcrValues))
      },
      duration: {
        mean: roundMemory(averageMemory(durationValues)),
        variance: roundMemory(varianceMemory(durationValues)),
        min: roundMemory(Math.min.apply(null, durationValues)),
        max: roundMemory(Math.max.apply(null, durationValues))
      },
      burstiness: {
        mean: roundMemory(averageMemory(burstValues)),
        variance: roundMemory(varianceMemory(burstValues)),
        min: roundMemory(Math.min.apply(null, burstValues)),
        max: roundMemory(Math.max.apply(null, burstValues))
      }
    },

    samplesCount: samples.length,

    confidence: calcPerceptualConfidence({
      centroidValues,
      spreadValues,
      energyValues,
      zcrValues,
      burstValues
    }),

    concept: memory.concept || {
      goal: "تثبيت ذاكرة إدراكية للحرف.",
      rule: "العينة الجديدة تضيف أثرًا ولا تمحو الذاكرة السابقة."
    },

    createdAt: new Date().toISOString()
  };
}


// ======================================
// 7) استخراج الخصائص
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
    return {
      start: 0,
      end: samples.length
    };
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
// 8) الطيف والحسابات
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

    spectrum.push({
      freq,
      magnitude
    });
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
    spreadScore * 0.2 +
    energyScore * 0.15 +
    zcrScore * 0.15 +
    burstScore * 0.25
  );
}


// ======================================
// 9) عرض تقرير الذاكرة
// ======================================
function renderPhonemeMemoryReport(identity) {
  if (identity && identity.latestPerceptualIdentity) {
    identity = identity.latestPerceptualIdentity;
  }

  if (!identity || !identity.trainingUnits) {
    const html =
      "<div style='color:#facc15;font-weight:bold;'>🧠 الذاكرة موجودة لكن لا تحتوي تقريرًا تدريبيًا مفصلًا بعد.</div>" +
      "<pre style='white-space:pre-wrap; direction:ltr; text-align:left; background:#111827; padding:10px; border-radius:8px; color:#e5e7eb;'>" +
      JSON.stringify(identity || {}, null, 2) +
      "</pre>";

    if (typeof renderToUnifiedPanel === "function") {
      renderToUnifiedPanel(html);
    }

    return;
  }

  const html = `
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
      عدد العينات في هذا البناء:
      <b>${identity.samplesCount || identity.trainingUnits.length}</b>
    </div>

    <div>
      الثقة الإدراكية:
      <b>${Number(identity.confidence || 0).toFixed(4)}</b>
    </div>

    <hr style="border-color:#1f2937;">

    <div style="font-weight:bold;margin:8px 0;">
      الوحدات التدريبية
    </div>

    ${identity.trainingUnits
      .map(function (u) {
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
      })
      .join("")}

    <hr style="border-color:#1f2937;">

    <div>الهدف: ${identity.concept?.goal || ""}</div>
    <div>القاعدة: ${identity.concept?.rule || ""}</div>
  `;

  if (typeof renderToUnifiedPanel === "function") {
    renderToUnifiedPanel(html);
  } else {
    console.warn("⚠️ مدير التقارير الموحد غير متاح لعرض الذاكرة الإدراكية.");
  }
}


// ======================================
// 10) قراءة الصوت مع بقاء التسجيل بعد تحديث الصفحة
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
        if (blob) {
          persistTrainingAudioToLocalStorage(key, blob);
        }

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


function persistTrainingAudioToLocalStorage(key, blob) {
  try {
    const existing =
      localStorage.getItem("audio_" + key) ||
      localStorage.getItem(key);

    if (existing && existing.startsWith("data:")) return;

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const dataUrl = reader.result;

        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          localStorage.setItem("audio_" + key, dataUrl);
          localStorage.setItem(key, dataUrl);
          console.log("💾 تم تثبيت التسجيل بعد القراءة:", key);
        }
      } catch (err) {
        console.warn("⚠️ تعذر تثبيت التسجيل:", key, err);
      }
    };

    reader.readAsDataURL(blob);
  } catch (err) {
    console.warn("⚠️ فشل تثبيت التسجيل:", key, err);
  }
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

  return new Blob([bytes], {
    type: mime
  });
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
// 11) شاشة التحميل
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
// 12) أدوات رياضية
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

  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (length - 1)));
}


function nextPowerOfTwoMemory(n) {
  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


function roundMemory(num) {
  return Number(Number(num || 0).toFixed(4));
}


// ======================================
// 13) التصدير العام
// ======================================
window.trainPhonemeMemory = trainPhonemeMemory;
window.renderPhonemeMemoryReport = renderPhonemeMemoryReport;
window.getAudioPromiseForMemory = getAudioPromiseForMemory;
window.getMemoryForTraining = getMemoryForTraining;
window.savePerceptualIdentityEverywhere = savePerceptualIdentityEverywhere;

console.log("🎨 مدرب الذاكرة الإدراكية جاهز V2");
