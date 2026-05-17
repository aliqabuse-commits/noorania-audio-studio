let db;
let wavesurfer;
let wsRegions;

console.log("🧬 Genome Lab V3 — غرفة العمليات الجينية قيد التشغيل");

// =========================
// 1. قاعدة البيانات
// =========================
function initDB() {
  const request = indexedDB.open("noorDB", 1);

  request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("recordings")) {
      db.createObjectStore("recordings");
    }
  };

  request.onsuccess = function (e) {
    db = e.target.result;
  };

  request.onerror = function () {
    alert("تعذر فتح قاعدة حفظ الأصوات");
  };
}
initDB();

function saveAudio(key, blob) {
  if (!db) return;
  const tx = db.transaction("recordings", "readwrite");
  tx.objectStore("recordings").put(blob, key);
}

function getAudio(key, callback) {
  if (!db) {
    callback(null);
    return;
  }

  const tx = db.transaction("recordings", "readonly");
  const request = tx.objectStore("recordings").get(key);

  request.onsuccess = function () {
    callback(request.result);
  };

  request.onerror = function () {
    callback(null);
  };
}

function deleteAudio(key) {
  if (!db) return;
  const tx = db.transaction("recordings", "readwrite");
  tx.objectStore("recordings").delete(key);
}

// =========================
// 2. مناطق الجينوم الأربع
// =========================
const GENOME_REGIONS = [
  {
    id: "preCarrier",
    label: "ما قبل الحامل",
    color: "rgba(148, 163, 184, 0.28)"
  },
  {
    id: "carrier",
    label: "الحامل",
    color: "rgba(250, 204, 21, 0.32)"
  },
  {
    id: "payload",
    label: "المحمول",
    color: "rgba(0, 242, 255, 0.32)"
  },
  {
    id: "tail",
    label: "الذيل",
    color: "rgba(248, 113, 113, 0.28)"
  }
];

function initWaveform(blob) {
  if (typeof WaveSurfer === "undefined") {
    console.error("❌ مكتبة WaveSurfer لم تُحمل بعد");
    return;
  }

  if (wavesurfer) wavesurfer.destroy();

  wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#4B5563",
    progressColor: "#00f2ff",
    cursorColor: "#ff0000",
    height: 90,
    normalize: true
  });

  wsRegions = wavesurfer.registerPlugin(WaveSurfer.Regions.create());

  wavesurfer.on("ready", () => {
    createDefaultGenomeRegions();
    updateCoordsDisplay();
  });

  wsRegions.on("region-updated", updateCoordsDisplay);

  if (blob) {
    const url = URL.createObjectURL(blob);
    wavesurfer.load(url);
  }
}

function createDefaultGenomeRegions() {
  const duration = wavesurfer.getDuration();
  if (!duration) return;

  wsRegions.clearRegions();

  const points = {
    preCarrier: [0, duration * 0.15],
    carrier: [duration * 0.15, duration * 0.32],
    payload: [duration * 0.32, duration * 0.82],
    tail: [duration * 0.82, duration]
  };

  GENOME_REGIONS.forEach((item) => {
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

function getGenomeRegionsMap() {
  const map = {};
  if (!wsRegions) return map;

  wsRegions.getRegions().forEach((region) => {
    map[region.id] = region;
  });

  return map;
}

function updateCoordsDisplay() {
  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();

  const preCarrier = regions.preCarrier;
  const carrier = regions.carrier;
  const payload = regions.payload;
  const tail = regions.tail;

  if (!preCarrier || !carrier || !payload || !tail) return;

  const oldX = document.getElementById("val-x");
  const oldY = document.getElementById("val-y");
  const oldZ = document.getElementById("val-z");

  if (oldX) oldX.innerText = carrier.start.toFixed(3);
  if (oldY) oldY.innerText = (payload.end - payload.start).toFixed(3);
  if (oldZ) oldZ.innerText = (tail.end - tail.start).toFixed(3);

  setText("val-preCarrier", `${preCarrier.start.toFixed(3)} → ${preCarrier.end.toFixed(3)}`);
  setText("val-carrier", `${carrier.start.toFixed(3)} → ${carrier.end.toFixed(3)}`);
  setText("val-payload", `${payload.start.toFixed(3)} → ${payload.end.toFixed(3)}`);
  setText("val-tail", `${tail.start.toFixed(3)} → ${tail.end.toFixed(3)}`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// =========================
// 3. المعجم والحالة
// =========================
const categories = [
  { title: "أسماء الحروف الهجائية" },
  { title: "الحروف المتحركة" },
  { title: "أسماء الحروف النورانية" },
  { title: "الحروف الساكنة" },
  { title: "التنوين" },
  { title: "المد واللين" },
  { title: "الأصوات النورانية" }
];

let currentCategory = "";
let currentUnits = [];
let index = 0;

let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;

let unitStatus = {};
const savedStatus = localStorage.getItem("unitStatus");

if (savedStatus) {
  try {
    unitStatus = JSON.parse(savedStatus);
  } catch (e) {
    unitStatus = {};
  }
}

function saveUnitStatus() {
  localStorage.setItem("unitStatus", JSON.stringify(unitStatus));
}

function getUnitKey(unit) {
  return unit.file;
}

// =========================
// 4. التسجيل
// =========================
function toggleRecording() {
  isRecording ? stopRecording() : startRecording();
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      initWaveform(audioBlob);
      document.getElementById("recordBtn").innerText = "🎙 تسجيل";
    };

    mediaRecorder.start();
    isRecording = true;
    document.getElementById("recordBtn").innerText = "⏹ إيقاف";
  } catch (err) {
    alert("❌ الميكروفون لم يعمل");
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}

// =========================
// 5. بناء ملف الجينوم
// =========================
function buildGenome(key) {
  const regions = getGenomeRegionsMap();
  const duration = wavesurfer.getDuration();

  return {
    reference: key.replace(".wav", ""),
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
  return parseFloat(num.toFixed(4));
}

// =========================
// 6. الاعتماد
// =========================
async function approveAndNext() {
  if (!currentUnits.length) return;

  const key = getUnitKey(currentUnits[index]);

  if (!audioBlob && !wavesurfer) {
    alert("سجّل الوحدة أولاً");
    return;
  }

  if (!wsRegions || wsRegions.getRegions().length < 4) {
    alert("لم يتم تعريف مناطق الجينوم الأربع");
    return;
  }

  if (audioBlob) saveAudio(key, audioBlob);

  const genome = buildGenome(key);

  localStorage.setItem(key + ".genome.json", JSON.stringify(genome, null, 2));

  unitStatus[key] = "approved";
  saveUnitStatus();

  audioBlob = null;

  index++;
  if (index >= currentUnits.length) index = 0;

  updateUI();
}

function rejectUnit() {
  if (!currentUnits.length) return;

  const key = getUnitKey(currentUnits[index]);

  delete unitStatus[key];
  saveUnitStatus();

  localStorage.removeItem(key + ".genome.json");
  localStorage.removeItem(key + ".profile.json");
  deleteAudio(key);

  audioBlob = null;

  if (wavesurfer) {
    wavesurfer.destroy();
    wavesurfer = null;
  }

  updateUI();
}

// =========================
// 7. تشغيل ومعاينة المناطق
// =========================
function play() {
  if (wavesurfer) wavesurfer.playPause();
}

function playRegion(regionId) {
  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();
  const region = regions[regionId];

  if (!region) {
    alert("هذه المنطقة غير موجودة");
    return;
  }

  wavesurfer.play(region.start, region.end);
}

function playRaw() {
  if (wavesurfer) {
    wavesurfer.play(0, wavesurfer.getDuration());
  }
}

function playCarrierPayload() {
  if (!wavesurfer || !wsRegions) return;

  const regions = getGenomeRegionsMap();
  if (!regions.carrier || !regions.payload) return;

  wavesurfer.play(regions.carrier.start, regions.payload.end);
}

function playPayloadOnly() {
  playRegion("payload");
}

function playCarrierOnly() {
  playRegion("carrier");
}

function playTailOnly() {
  playRegion("tail");
}

function playPreCarrierOnly() {
  playRegion("preCarrier");
}

// =========================
// 8. واجهة المستخدم
// =========================
function updateUI() {
  const unit = currentUnits[index];
  if (!unit) return;

  document.getElementById("unit").innerText = unit.text;
  document.getElementById("filename").innerText = unit.file;
  document.getElementById("counter").innerText = (index + 1) + " / " + currentUnits.length;

  getAudio(unit.file, (blob) => {
    if (blob) {
      initWaveform(blob);
    } else if (wavesurfer) {
      wavesurfer.destroy();
      wavesurfer = null;
    }
  });

  renderUnitList();
}

function goHome() {
  document.getElementById("recordView").style.display = "none";
  document.getElementById("homeView").style.display = "block";
}

function renderHome() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.innerText = cat.title;
    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.width = "90%";

    btn.onclick = () => {
      currentCategory = cat.title;
      currentUnits = allUnits[cat.title] || [];
      index = 0;

      document.getElementById("homeView").style.display = "none";
      document.getElementById("recordView").style.display = "block";

      updateUI();
    };

    list.appendChild(btn);
  });
}

function nextUnit() {
  if (!currentUnits.length) return;
  index = (index + 1) % currentUnits.length;
  updateUI();
}

function prevUnit() {
  if (!currentUnits.length) return;
  index = (index - 1 + currentUnits.length) % currentUnits.length;
  updateUI();
}

function renderUnitList() {
  const list = document.getElementById("unitList");
  if (!list) return;

  list.innerHTML = "";

  currentUnits.forEach((unit, i) => {
    const btn = document.createElement("button");
    const key = getUnitKey(unit);

    btn.innerText = (unitStatus[key] === "approved" ? "✅ " : "⏳ ") + unit.text;

    btn.style.display = "block";
    btn.style.margin = "5px auto";
    btn.style.width = "90%";

    if (i === index) btn.style.background = "#cfe8ff";

    btn.onclick = () => {
      index = i;
      updateUI();
    };

    list.appendChild(btn);
  });
}

// =========================
// 9. التصدير السيادي
// =========================
async function exportApproved() {
  if (!currentUnits.length) return;

  const approvedUnits = currentUnits.filter(
    (u) => unitStatus[getUnitKey(u)] === "approved"
  );

  if (!approvedUnits.length) {
    alert("لا توجد وحدات معتمدة");
    return;
  }

  const zip = new JSZip();
  const manifest = [];

  for (let unit of approvedUnits) {
    const key = getUnitKey(unit);
    const storedAudio = await new Promise((res) => getAudio(key, res));
    const genomeData = localStorage.getItem(key + ".genome.json");

    if (storedAudio) {
      zip.file("audio/" + key, storedAudio);

      if (genomeData) {
        zip.file("genomes/" + key + ".genome.json", genomeData);
      }

      manifest.push({
        category: currentCategory,
        text: unit.text,
        file: key,
        genome: "genomes/" + key + ".genome.json",
        status: "approved"
      });
    }
  }

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  const content = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = `noorania_${currentCategory}_genome_lab.zip`;
  a.click();
}

window.onload = renderHome;
