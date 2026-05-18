// ================================
// audio-lab.js
// غرفة العمليات الصوتية — مختبر الجينوم الصوتي
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
    createDefaultGenomeRegions();
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
// 4️⃣ إنشاء المناطق الافتراضية
// =====================================

function createDefaultGenomeRegions() {

  if (!wavesurfer || !wsRegions) return;

  const duration = wavesurfer.getDuration();

  if (!duration) return;

  wsRegions.clearRegions();

  const points = {
    preCarrier: [0, duration * 0.15],
    carrier: [duration * 0.15, duration * 0.32],
    payload: [duration * 0.32, duration * 0.82],
    tail: [duration * 0.82, duration]
  };

  GENOME_REGIONS.forEach(function (item) {

    wsRegions.addRegion({
      id: item.id,
      start: points[item.id][0],
      end: points[item.id][1],
      color: item.color,
      drag: true,
      resize: true
    });

  });

}


// =====================================
// 5️⃣ قراءة المناطق كخريطة
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
// 6️⃣ تنسيق الأرقام للعرض
// =====================================

function formatTime(num) {

  return Number(num).toFixed(3);

}


function formatRange(start, end) {

  return formatTime(start) + " ⟶ " + formatTime(end);

}


// =====================================
// 7️⃣ تحديث عرض الإحداثيات
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
// 8️⃣ التسجيل الصوتي
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
// 9️⃣ معاينة الصوت والمناطق
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

  playStrictRange(
    region.start,
    region.end
  );

}


// تشغيل مقطع زمني محدد بصرامة
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
// 🔟 بناء ملف الجينوم
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
    version: "genome-v3",

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
// 1️⃣1️⃣ أدوات مساعدة للتعامل مع app.js
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


console.log("🧬 audio-lab.js جاهز — مختبر الجينوم الصوتي يعمل");
