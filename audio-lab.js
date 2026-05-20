// ================================
// audio-lab.js
// غرفة العمليات الصوتية — مختبر الجينوم الصوتي الذكي
// ================================

let wavesurfer;
let wsRegions;
let wsSpectrogram;

let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;

let activeRegionTimer = null;
let currentZoom = 300;
let lastAnalysisMeta = null;


// =====================================
// 1️⃣ تعريف مناطق الجينوم الأربع
// =====================================

const GENOME_REGIONS = [
  {
    id: "preCarrier",
    label: "ما قبل الحامل",
    color: "rgba(148,163,184,0.30)"
  },
  {
    id: "carrier",
    label: "الحامل",
    color: "rgba(250,204,21,0.35)"
  },
  {
    id: "payload",
    label: "المحمول",
    color: "rgba(0,242,255,0.35)"
  },
  {
    id: "tail",
    label: "الذيل",
    color: "rgba(248,113,113,0.30)"
  }
];


// =====================================
// 2️⃣ تشغيل WaveSurfer
// =====================================

function initWaveform(blob) {

  if (typeof WaveSurfer === "undefined") {
    console.error("❌ مكتبة WaveSurfer لم تُحمّل");
    return;
  }

  stopRegionTimer();

  if (wavesurfer) {
    wavesurfer.destroy();
  }

  currentZoom = 300;
  lastAnalysisMeta = null;

  wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#4B5563",
    progressColor: "#00f2ff",
    cursorColor: "#ff0000",
    height: 120,
    normalize: true,
    minPxPerSec: currentZoom,
    autoScroll: true,
    autoCenter: true,
    barWidth: 2,
    barGap: 1,
    barRadius: 2
  });

  wsRegions = wavesurfer.registerPlugin(
    WaveSurfer.Regions.create()
  );

  if (
    WaveSurfer.Spectrogram &&
    document.getElementById("spectrogram")
  ) {
    wsSpectrogram = wavesurfer.registerPlugin(
      WaveSurfer.Spectrogram.create({
        container: "#spectrogram",
        labels: true,
        height: 180,
        splitChannels: false,
        scale: "mel",
        frequencyMax: 8000,
        frequencyMin: 0,
        fftSamples: 2048,
        labelsColor: "#94a3b8"
      })
    );
  }

  wavesurfer.on("ready", function () {
    createSmartGenomeRegions();
    updateGenomeDisplay();
    wavesurfer.zoom(currentZoom);
  });

  wsRegions.on("region-updated", function () {
    updateGenomeDisplay();
  });

  if (blob) {
    const url = URL.createObjectURL(blob);
    wavesurfer.load(url);
  }

}


// =====================================
// 3️⃣ إعادة التحليل الذكي
// =====================================

function rerunSmartAnalysis() {

  if (!wavesurfer || !wsRegions) {
    alert("لا يوجد تسجيل لتحليله");
    return;
  }

  createSmartGenomeRegions();
  updateGenomeDisplay();

  console.log("🔬 تمت إعادة التحليل الذكي للمناطق");

}


// =====================================
// 4️⃣ إنشاء مناطق ذكية حسب طاقة الصوت
// =====================================

function createSmartGenomeRegions() {

  if (!wavesurfer || !wsRegions) return;

  const duration = wavesurfer.getDuration();

  if (!duration) return;

  let peaksData;

  try {
    peaksData = wavesurfer.exportPeaks({
      channels: 1,
      maxLength: 2400
    });
  } catch (err) {
    console.error("❌ تعذر تحليل الموجة", err);
    createFallbackGenomeRegions(duration);
    return;
  }

  const peaks = Array.isArray(peaksData[0])
    ? peaksData[0]
    : peaksData;

  if (!peaks || !peaks.length) {
    createFallbackGenomeRegions(duration);
    return;
  }

  const energy = peaks.map(function (v) {
    return Math.abs(v);
  });

  const smoothed = smoothEnergy(energy, 5);

  const noiseSampleCount = Math.max(
    20,
    Math.floor(smoothed.length * 0.08)
  );

  const noiseSlice = smoothed.slice(0, noiseSampleCount);

  const noiseFloor = average(noiseSlice);
  const maxEnergy = Math.max.apply(null, smoothed);

  if (!maxEnergy || maxEnergy <= noiseFloor) {
    createFallbackGenomeRegions(duration);
    return;
  }

  const soundThreshold =
    noiseFloor + (maxEnergy - noiseFloor) * 0.10;

  const strongThreshold =
    noiseFloor + (maxEnergy - noiseFloor) * 0.30;

  lastAnalysisMeta = {
    method: "energy-smoothed-noise-aware",
    noiseFloor: round(noiseFloor),
    maxEnergy: round(maxEnergy),
    soundThreshold: round(soundThreshold),
    strongThreshold: round(strongThreshold)
  };

  const firstSound = findFirstAbove(
    smoothed,
    soundThreshold,
    2
  );

  const firstStrong = findFirstAbove(
    smoothed,
    strongThreshold,
    2
  );

  const lastStrong = findLastAbove(
    smoothed,
    strongThreshold,
    2
  );

  const lastSound = findLastAbove(
    smoothed,
    soundThreshold,
    2
  );

  if (
    firstSound === -1 ||
    firstStrong === -1 ||
    lastStrong === -1 ||
    lastSound === -1
  ) {
    createFallbackGenomeRegions(duration);
    return;
  }

  function idxToTime(i) {
    return (i / smoothed.length) * duration;
  }

  const firstSoundTime = idxToTime(firstSound);
  const firstStrongTime = idxToTime(firstStrong);
  const lastStrongTime = idxToTime(lastStrong);
  const lastSoundTime = idxToTime(lastSound);

  let preStart = 0;

  let preEnd = clamp(
    firstSoundTime - 0.006,
    0,
    duration
  );

  let carrierStart = preEnd;

  let carrierEnd = clamp(
    firstStrongTime,
    carrierStart + 0.008,
    duration
  );

  let payloadStart = carrierEnd;

  let payloadEnd = clamp(
    lastStrongTime + 0.012,
    payloadStart + 0.010,
    duration
  );

  let tailStart = payloadEnd;

  let tailEnd = clamp(
    lastSoundTime + 0.030,
    tailStart + 0.010,
    duration
  );

  wsRegions.clearRegions();

  addGenomeRegion("preCarrier", preStart, preEnd);
  addGenomeRegion("carrier", carrierStart, carrierEnd);
  addGenomeRegion("payload", payloadStart, payloadEnd);
  addGenomeRegion("tail", tailStart, tailEnd);

  updateGenomeDisplay();

}


// =====================================
// 5️⃣ أدوات التحليل
// =====================================

function smoothEnergy(values, windowSize) {

  const result = [];

  for (let i = 0; i < values.length; i++) {

    let sum = 0;
    let count = 0;

    for (let j = i - windowSize; j <= i + windowSize; j++) {
      if (j >= 0 && j < values.length) {
        sum += values[j];
        count++;
      }
    }

    result.push(sum / count);

  }

  return result;

}


function average(values) {

  if (!values.length) return 0;

  const sum = values.reduce(function (a, b) {
    return a + b;
  }, 0);

  return sum / values.length;

}


function findFirstAbove(values, threshold, consecutive) {

  let streak = 0;

  for (let i = 0; i < values.length; i++) {

    if (values[i] >= threshold) {

      streak++;

      if (streak >= consecutive) {
        return i - consecutive + 1;
      }

    } else {
      streak = 0;
    }

  }

  return -1;

}


function findLastAbove(values, threshold, consecutive) {

  let streak = 0;

  for (let i = values.length - 1; i >= 0; i--) {

    if (values[i] >= threshold) {

      streak++;

      if (streak >= consecutive) {
        return i + consecutive - 1;
      }

    } else {
      streak = 0;
    }

  }

  return -1;

}


// =====================================
// 6️⃣ مناطق احتياطية
// =====================================

function createFallbackGenomeRegions(duration) {

  if (!wsRegions) return;

  lastAnalysisMeta = {
    method: "fallback-percentage",
    reason: "smart-analysis-failed"
  };

  wsRegions.clearRegions();

  addGenomeRegion("preCarrier", 0, duration * 0.12);
  addGenomeRegion("carrier", duration * 0.12, duration * 0.28);
  addGenomeRegion("payload", duration * 0.28, duration * 0.86);
  addGenomeRegion("tail", duration * 0.86, duration);

}


// =====================================
// 7️⃣ إضافة منطقة
// =====================================

function addGenomeRegion(id, start, end) {

  const config = GENOME_REGIONS.find(function (item) {
    return item.id === id;
  });

  if (!config || !wsRegions) return;

  wsRegions.addRegion({
    id: id,
    start: start,
    end: end,
    color: config.color,
    drag: true,
    resize: true
  });

}


// =====================================
// 8️⃣ خريطة المناطق
// =====================================

function getGenomeRegionsMap() {

  const map = {};

  if (!wsRegions) return map;

  wsRegions.getRegions().forEach(function (region) {
    map[region.id] = region;
  });

  return map;

}


// =====================================
// 9️⃣ أدوات الوقت
// =====================================

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function formatTime(num) {

  return Number(num).toFixed(3);

}


function formatRange(start, end) {

  return formatTime(start) + " ⟶ " + formatTime(end);

}


// =====================================
// 🔟 تحديث الواجهة
// =====================================

function updateGenomeDisplay() {

  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();

  const preCarrier = regions.preCarrier;
  const carrier = regions.carrier;
  const payload = regions.payload;
  const tail = regions.tail;

  if (!preCarrier || !carrier || !payload || !tail) return;

  setText(
    "val-preCarrier",
    formatRange(preCarrier.start, preCarrier.end)
  );

  setText(
    "val-carrier",
    formatRange(carrier.start, carrier.end)
  );

  setText(
    "val-payload",
    formatRange(payload.start, payload.end)
  );

  setText(
    "val-tail",
    formatRange(tail.start, tail.end)
  );

  setText("val-x", formatTime(carrier.start));
  setText("val-y", formatTime(payload.end - payload.start));
  setText("val-z", formatTime(tail.end - tail.start));

}


function setText(id, value) {

  const el = document.getElementById(id);

  if (el) {
    el.innerText = value;
  }

}


// =====================================
// 1️⃣1️⃣ التسجيل
// =====================================

function toggleRecording() {

  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }

}


async function startRecording() {

  try {

    stopRegionTimer();

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = function (e) {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = function () {

      audioBlob = new Blob(audioChunks, {
        type: "audio/wav"
      });

      initWaveform(audioBlob);

      const btn =
        document.getElementById("recordBtn");

      if (btn) {
        btn.innerText = "🎙 تسجيل";
      }

    };

    mediaRecorder.start();

    isRecording = true;

    const btn =
      document.getElementById("recordBtn");

    if (btn) {
      btn.innerText = "⏹ إيقاف";
    }

  } catch (err) {

    console.error("❌ فشل تشغيل الميكروفون", err);

    alert("❌ الميكروفون لم يعمل");

  }

}


function stopRecording() {

  if (mediaRecorder && isRecording) {

    mediaRecorder.stop();

    isRecording = false;

  }

}


// =====================================
// 1️⃣2️⃣ التشغيل
// =====================================

function play() {

  if (wavesurfer) {

    stopRegionTimer();
    wavesurfer.playPause();

  }

}


function playRaw() {

  if (!wavesurfer) return;

  stopRegionTimer();

  wavesurfer.pause();
  wavesurfer.setTime(0);
  wavesurfer.play();

}


function playRegion(regionId) {

  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();

  const region = regions[regionId];

  if (!region) {

    alert("هذه المنطقة غير موجودة");
    return;

  }

  playStrictRange(region.start, region.end);

}


function playStrictRange(start, end) {

  if (!wavesurfer) return;

  stopRegionTimer();

  wavesurfer.pause();
  wavesurfer.setTime(start);
  wavesurfer.play();

  activeRegionTimer = setInterval(function () {

    if (!wavesurfer) {
      stopRegionTimer();
      return;
    }

    const currentTime =
      wavesurfer.getCurrentTime();

    if (currentTime >= end) {

      wavesurfer.pause();
      wavesurfer.setTime(start);
      stopRegionTimer();

    }

  }, 10);

}


function stopRegionTimer() {

  if (activeRegionTimer) {
    clearInterval(activeRegionTimer);
    activeRegionTimer = null;
  }

}


function playPayloadOnly() {
  playRegion("payload");
}


// =====================================
// 1️⃣3️⃣ التكبير
// =====================================

function zoomInWave() {

  if (!wavesurfer) return;

  currentZoom += 200;

  if (currentZoom > 3000) {
    currentZoom = 3000;
  }

  wavesurfer.zoom(currentZoom);

}


function zoomOutWave() {

  if (!wavesurfer) return;

  currentZoom -= 200;

  if (currentZoom < 20) {
    currentZoom = 20;
  }

  wavesurfer.zoom(currentZoom);

}


function zoomResetWave() {

  if (!wavesurfer) return;

  currentZoom = 300;

  wavesurfer.zoom(currentZoom);

}


// =====================================
// 1️⃣4️⃣ بناء الجينوم
// =====================================

function buildGenome(referenceKey) {

  if (!wavesurfer || !wsRegions) {
    return null;
  }

  const regions = getGenomeRegionsMap();

  if (
    !regions.preCarrier ||
    !regions.carrier ||
    !regions.payload ||
    !regions.tail
  ) {
    return null;
  }

  const duration = wavesurfer.getDuration();

  return {
    reference: referenceKey.replace(".wav", ""),
    version:
      "genome-v3-smart-noise-aware-experiment",

    fileStart: 0,

    regions: {
      preCarrier: cleanRegion(regions.preCarrier),
      carrier: cleanRegion(regions.carrier),
      payload: cleanRegion(regions.payload),
      tail: cleanRegion(regions.tail)
    },

    extraction: {
      recommendedStart:
        round(regions.carrier.start),

      recommendedEnd:
        round(regions.payload.end),

      purePayloadStart:
        round(regions.payload.start),

      purePayloadEnd:
        round(regions.payload.end)
    },

    analysis: lastAnalysisMeta,

    fileEnd: round(duration)
  };

}


function cleanRegion(region) {

  return {
    start: round(region.start),
    end: round(region.end),
    duration: round(region.end - region.start)
  };

}


function round(num) {

  return parseFloat(
    Number(num).toFixed(4)
  );

}


// =====================================
// 1️⃣5️⃣ أدوات مساعدة
// =====================================

function getCurrentAudioBlob() {
  return audioBlob;
}


function clearCurrentAudioBlob() {
  audioBlob = null;
}


function hasWaveform() {
  return !!wavesurfer;
}


function hasGenomeRegions() {

  if (!wsRegions) return false;

  return wsRegions.getRegions().length >= 4;

}


function destroyWaveform() {

  stopRegionTimer();

  if (wavesurfer) {
    wavesurfer.destroy();
    wavesurfer = null;
  }

}


console.log(
  "🧠 audio-lab.js جاهز — إعادة التحليل + حفظ بيانات التحليل تعمل"
);
// ======================================
// تشغيل المحمول المنظف
// ======================================

async function playPurifiedPayload() {

  try {

    const saved =
      localStorage.getItem(
        "ba_purified_payload_result"
      );

    if (!saved) {

      alert(
        "شغّل أولًا: 🧼 تنظيف المحمول"
      );

      return;
    }

    const result =
      JSON.parse(saved);

    const filenameEl =
      document.getElementById("filename");

    const currentKey =
      filenameEl
        ? filenameEl.innerText.trim()
        : null;

    if (!currentKey) {

      alert("لا يوجد ملف ظاهر");

      return;
    }

    const blob =
      await new Promise(function (resolve) {

        getAudio(currentKey, resolve);

      });

    if (!blob) {

      alert("الصوت غير موجود");

      return;
    }

    const decoded =
      await decodeBlobToMono(blob);

    const sampleRate =
      decoded.sampleRate;

    const samples =
      decoded.samples;

    const start =
      Math.floor(
        result.start * sampleRate
      );

    const end =
      Math.floor(
        result.end * sampleRate
      );

    const sliced =
      samples.slice(start, end);

    const ctx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

    const buffer =
      ctx.createBuffer(
        1,
        sliced.length,
        sampleRate
      );

    buffer.copyToChannel(
      sliced,
      0
    );

    const source =
      ctx.createBufferSource();

    source.buffer =
      buffer;

    source.connect(
      ctx.destination
    );

    source.start();

    console.log(
      "▶️ تشغيل المحمول المنظف"
    );

  } catch (err) {

    console.error(
      "❌ فشل تشغيل المحمول المنظف",
      err
    );

    alert(
      "فشل تشغيل المحمول المنظف:\n" +
      err.message
    );
  }
      }
