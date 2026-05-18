// ================================
// audio-lab.js
// غرفة العمليات الصوتية — مختبر الجينوم الصوتي الذكي
// ================================


// =====================================
// 1️⃣ متغيرات مختبر الصوت
// =====================================

let wavesurfer;
let wsRegions;

let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;

let activeRegionTimer = null;


// =====================================
// 2️⃣ تعريف مناطق الجينوم الأربع
// =====================================

const GENOME_REGIONS = [
  {
    id: "preCarrier",
    label: "ما قبل الحامل",
    color: "rgba(148, 163, 184, 0.30)"
  },
  {
    id: "carrier",
    label: "الحامل",
    color: "rgba(250, 204, 21, 0.35)"
  },
  {
    id: "payload",
    label: "المحمول",
    color: "rgba(0, 242, 255, 0.35)"
  },
  {
    id: "tail",
    label: "الذيل",
    color: "rgba(248, 113, 113, 0.30)"
  }
];


// =====================================
// 3️⃣ تشغيل WaveSurfer
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

  wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#4B5563",
    progressColor: "#00f2ff",
    cursorColor: "#ff0000",
    height: 90,
    normalize: true
  });

  wsRegions = wavesurfer.registerPlugin(
    WaveSurfer.Regions.create()
  );

  wavesurfer.on("ready", function () {
    createSmartGenomeRegions();
    updateGenomeDisplay();
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
      maxLength: 1200
    });
  } catch (err) {
    console.error("❌ تعذر تحليل الموجة", err);
    createFallbackGenomeRegions(duration);
    return;
  }

  const peaks = Array.isArray(peaksData[0]) ? peaksData[0] : peaksData;

  if (!peaks || !peaks.length) {
    createFallbackGenomeRegions(duration);
    return;
  }

  let max = 0;

  peaks.forEach(function (v) {
    const abs = Math.abs(v);
    if (abs > max) max = abs;
  });

  if (max === 0) {
    createFallbackGenomeRegions(duration);
    return;
  }

  const noiseThreshold = max * 0.10;
  const strongThreshold = max * 0.32;

  let firstSound = -1;
  let firstStrong = -1;
  let lastStrong = -1;
  let lastSound = -1;

  for (let i = 0; i < peaks.length; i++) {

    const amp = Math.abs(peaks[i]);

    if (amp > noiseThreshold && firstSound === -1) {
      firstSound = i;
    }

    if (amp > strongThreshold && firstStrong === -1) {
      firstStrong = i;
    }

    if (amp > strongThreshold) {
      lastStrong = i;
    }

    if (amp > noiseThreshold) {
      lastSound = i;
    }

  }

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
    return (i / peaks.length) * duration;
  }

  let preStart = 0;
  let preEnd = clamp(
    idxToTime(firstSound) - 0.015,
    0,
    duration
  );

  let carrierStart = preEnd;
  let carrierEnd = clamp(
    idxToTime(firstStrong),
    carrierStart + 0.015,
    duration
  );

  let payloadStart = carrierEnd;
  let payloadEnd = clamp(
    idxToTime(lastStrong) + 0.025,
    payloadStart + 0.015,
    duration
  );

  let tailStart = payloadEnd;
  let tailEnd = clamp(
    idxToTime(lastSound) + 0.060,
    tailStart + 0.015,
    duration
  );

  if (tailEnd < duration * 0.96) {
    tailEnd = Math.min(duration, tailEnd);
  }

  wsRegions.clearRegions();

  addGenomeRegion("preCarrier", preStart, preEnd);
  addGenomeRegion("carrier", carrierStart, carrierEnd);
  addGenomeRegion("payload", payloadStart, payloadEnd);
  addGenomeRegion("tail", tailStart, tailEnd);

}


// =====================================
// 5️⃣ مناطق احتياطية إذا فشل التحليل
// =====================================

function createFallbackGenomeRegions(duration) {

  if (!wsRegions) return;

  wsRegions.clearRegions();

  addGenomeRegion("preCarrier", 0, duration * 0.15);
  addGenomeRegion("carrier", duration * 0.15, duration * 0.32);
  addGenomeRegion("payload", duration * 0.32, duration * 0.82);
  addGenomeRegion("tail", duration * 0.82, duration);

}


// =====================================
// 6️⃣ إضافة منطقة جينومية
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
// 7️⃣ قراءة المناطق كخريطة
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
// 8️⃣ أدوات أرقام
// =====================================

function clamp(value, min, max) {

  return Math.max(min, Math.min(max, value));

}


function formatTime(num) {

  return Number(num).toFixed(3);

}


function formatRange(start, end) {

  return formatTime(start) + " ⟶ " + formatTime(end);

}


// =====================================
// 9️⃣ تحديث عرض الإحداثيات
// =====================================

function updateGenomeDisplay() {

  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();

  const preCarrier = regions.preCarrier;
  const carrier = regions.carrier;
  const payload = regions.payload;
  const tail = regions.tail;

  if (!preCarrier || !carrier || !payload || !tail) return;

  setText("val-preCarrier", formatRange(preCarrier.start, preCarrier.end));
  setText("val-carrier", formatRange(carrier.start, carrier.end));
  setText("val-payload", formatRange(payload.start, payload.end));
  setText("val-tail", formatRange(tail.start, tail.end));

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
// 🔟 التسجيل الصوتي
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

    const stream = await navigator.mediaDevices.getUserMedia({
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

      const btn = document.getElementById("recordBtn");

      if (btn) {
        btn.innerText = "🎙 تسجيل";
      }

    };

    mediaRecorder.start();

    isRecording = true;

    const btn = document.getElementById("recordBtn");

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
// 1️⃣1️⃣ معاينة الصوت والمناطق
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

    const currentTime = wavesurfer.getCurrentTime();

    if (currentTime >= end) {
      wavesurfer.pause();
      wavesurfer.setTime(start);
      stopRegionTimer();
    }

  }, 15);

}


function stopRegionTimer() {

  if (activeRegionTimer) {
    clearInterval(activeRegionTimer);
    activeRegionTimer = null;
  }

}


function playPreCarrierOnly() {
  playRegion("preCarrier");
}


function playCarrierOnly() {
  playRegion("carrier");
}


function playPayloadOnly() {
  playRegion("payload");
}


function playTailOnly() {
  playRegion("tail");
}


function playCarrierPayload() {

  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();

  if (!regions.carrier || !regions.payload) return;

  playStrictRange(
    regions.carrier.start,
    regions.payload.end
  );

}


// =====================================
// 1️⃣2️⃣ بناء ملف الجينوم
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
    version: "genome-v3-smart",

    fileStart: 0,

    regions: {
      preCarrier: cleanRegion(regions.preCarrier),
      carrier: cleanRegion(regions.carrier),
      payload: cleanRegion(regions.payload),
      tail: cleanRegion(regions.tail)
    },

    extraction: {
      recommendedStart: round(regions.carrier.start),
      recommendedEnd: round(regions.payload.end),

      purePayloadStart: round(regions.payload.start),
      purePayloadEnd: round(regions.payload.end)
    },

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
    num.toFixed(4)
  );

}


// =====================================
// 1️⃣3️⃣ أدوات مساعدة للتعامل مع app.js
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


console.log("🧠 audio-lab.js جاهز — التحليل الذكي للمناطق يعمل");
