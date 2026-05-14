alert("نداء من المحرك: أنا أعمل بالنسخة الجديدة V2.1 ⚡");

let db;
let wavesurfer;
let wsRegions;

// تنبيه التأكد من التحديث
console.log("🚀 نظام الإحداثيات المطور قيد التشغيل - V2");

// 1. تهيئة قاعدة البيانات
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

// 2. دوال التعامل مع الصوت
function saveAudio(key, blob) {
  if (!db) return;
  const tx = db.transaction("recordings", "readwrite");
  tx.objectStore("recordings").put(blob, key);
}

function getAudio(key, callback) {
  if (!db) { callback(null); return; }
  const tx = db.transaction("recordings", "readonly");
  const request = tx.objectStore("recordings").get(key);
  request.onsuccess = function () { callback(request.result); };
  request.onerror = function () { callback(null); };
}

// 3. محرك المشرط الرقمي (WaveSurfer) مع حماية ضد أخطاء التحميل
function initWaveform(blob) {
  // التأكد من تحميل المكتبة أولاً
  if (typeof WaveSurfer === 'undefined') {
    console.error("❌ مكتبة WaveSurfer لم تُحمل بعد");
    return;
  }

  if (wavesurfer) wavesurfer.destroy();

  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4B5563',
    progressColor: '#00f2ff',
    cursorColor: '#ff0000',
    height: 80,
    normalize: true
  });

  // إضافة نظام المناطق (Markers)
  wsRegions = wavesurfer.registerPlugin(WaveSurfer.Regions.create());

  wavesurfer.on('ready', () => {
    const duration = wavesurfer.getDuration();
    wsRegions.clearRegions();
    
    // إنشاء منطقة المحمول (Y) بنسبة 80%
    wsRegions.addRegion({
      start: duration * 0.1,
      end: duration * 0.9,
      color: 'rgba(0, 242, 255, 0.2)',
      drag: true,
      resize: true
    });
    updateCoordsDisplay();
  });

  wsRegions.on('region-updated', updateCoordsDisplay);

  if (blob) {
    const url = URL.createObjectURL(blob);
    wavesurfer.load(url);
  }
}

function updateCoordsDisplay() {
  const regions = wsRegions.getRegions();
  if (regions.length === 0) return;
  
  const region = regions[0];
  const fileDuration = wavesurfer.getDuration();

  document.getElementById('val-x').innerText = region.start.toFixed(3);
  document.getElementById('val-y').innerText = (region.end - region.start).toFixed(3);
  document.getElementById('val-z').innerText = (fileDuration - region.end).toFixed(3);
}

// 4. متغيرات الحالة والمعجم القديم
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
if (savedStatus) { try { unitStatus = JSON.parse(savedStatus); } catch (e) { unitStatus = {}; } }

function saveUnitStatus() { localStorage.setItem("unitStatus", JSON.stringify(unitStatus)); }
function getUnitKey(unit) { return unit.file; }

// 5. التحكم في التسجيل
function toggleRecording() { isRecording ? stopRecording() : startRecording(); }

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
  } catch (err) { alert("❌ الميكروفون لم يعمل"); }
}

function stopRecording() { if (mediaRecorder && isRecording) { mediaRecorder.stop(); isRecording = false; } }

// 6. الاعتماد وتصدير الـ Profile بموجب الوثيقة المحدثة
async function approveAndNext() {
  if (!currentUnits.length) return;
  const key = getUnitKey(currentUnits[index]);
  const regions = wsRegions ? wsRegions.getRegions() : [];

  if (!audioBlob && !wavesurfer) { alert("سجّل الوحدة أولاً"); return; }
  
  // حفظ الصوت
  if (audioBlob) saveAudio(key, audioBlob);

  // حفظ الإحداثيات إذا وُجدت الموجة
  if (regions.length > 0) {
    const region = regions[0];
    const profile = {
      reference: key.replace('.wav', ''),
      fileStart: 0.00,
      voiceStart: parseFloat(region.start.toFixed(4)),
      voiceEnd: parseFloat(region.end.toFixed(4)),
      fileEnd: parseFloat(wavesurfer.getDuration().toFixed(4))
    };
    localStorage.setItem(key + ".profile.json", JSON.stringify(profile));
  }

  unitStatus[key] = "approved";
  saveUnitStatus();
  audioBlob = null;
  
  index++;
  if (index >= currentUnits.length) index = 0;
  updateUI();
}

// 7. واجهة المستخدم
function updateUI() {
  const unit = currentUnits[index];
  if (!unit) return;
  
  document.getElementById("unit").innerText = unit.text;
  document.getElementById("filename").innerText = unit.file;
  document.getElementById("counter").innerText = (index + 1) + " / " + currentUnits.length;
  
  getAudio(unit.file, (blob) => {
    if (blob) initWaveform(blob);
    else if (wavesurfer) { wavesurfer.destroy(); wavesurfer = null; }
  });
  renderUnitList();
}

// 8. التصدير السيادي (ZIP)
async function exportApproved() {
  if (!currentUnits.length) return;
  const approvedUnits = currentUnits.filter(u => unitStatus[getUnitKey(u)] === "approved");
  if (!approvedUnits.length) { alert("لا توجد وحدات معتمدة"); return; }

  const zip = new JSZip();
  const manifest = [];

  for (let unit of approvedUnits) {
    const key = getUnitKey(unit);
    const audioBlob = await new Promise(res => getAudio(key, res));
    const profileData = localStorage.getItem(key + ".profile.json");

    if (audioBlob) {
      zip.file("audio/" + key, audioBlob);
      if (profileData) zip.file("profiles/" + key + ".profile.json", profileData);
      manifest.push({ category: currentCategory, text: unit.text, file: key });
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = `noorania_${currentCategory}_factory.zip`;
  a.click();
}

// الدوال المساعدة
function goHome() { 
  document.getElementById("recordView").style.display = "none"; 
  document.getElementById("homeView").style.display = "block"; 
}

function renderHome() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat.title;
    btn.style.display = "block"; btn.style.margin = "10px auto"; btn.style.width = "90%";
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

function play() { if (wavesurfer) wavesurfer.playPause(); }
function nextUnit() { index = (index + 1) % currentUnits.length; updateUI(); }
function prevUnit() { index = (index - 1 + currentUnits.length) % currentUnits.length; updateUI(); }

function renderUnitList() {
    const list = document.getElementById("unitList");
    if (!list) return;
    list.innerHTML = "";
    currentUnits.forEach((unit, i) => {
        const btn = document.createElement("button");
        const key = getUnitKey(unit);
        btn.innerText = (unitStatus[key] === "approved" ? "✅ " : "⏳ ") + unit.text;
        btn.style.display = "block"; btn.style.margin = "5px auto"; btn.style.width = "90%";
        if (i === index) btn.style.background = "#cfe8ff";
        btn.onclick = () => { index = i; updateUI(); };
        list.appendChild(btn);
    });
}

window.onload = renderHome;
