let db;

function initDB() {
  const request = indexedDB.open("noorDB", 1);

  request.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("recordings");
  };

  request.onsuccess = function (e) {
    db = e.target.result;
  };
}

initDB();

function saveAudio(key, blob) {
  const tx = db.transaction("recordings", "readwrite");
  tx.objectStore("recordings").put(blob, key);
}

function getAudio(key, callback) {
  const tx = db.transaction("recordings", "readonly");
  const request = tx.objectStore("recordings").get(key);

  request.onsuccess = function () {
    callback(request.result);
  };
}

const categories = [
  { title: "أسماء الحروف الهجائية" },
  { title: "الحروف المتحركة" },
  { title: "أسماء الحروف النورانية" },
  { title: "الحروف الساكنة" },
  { title: "التنوين" },
  { title: "المد واللين" },
  { title: "الأصوات النورانية" }
];

let currentUnits = [];
let index = 0;
let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;

let unitStatus = {};
const savedStatus = localStorage.getItem("unitStatus");
if (savedStatus) unitStatus = JSON.parse(savedStatus);

function saveUnitStatus() {
  localStorage.setItem("unitStatus", JSON.stringify(unitStatus));
}

function getUnitKey(unit) {
  return unit.file;
}

window.onload = function () {
  renderHome();
};

function updateUI() {
  if (!currentUnits || currentUnits.length === 0) {
    document.getElementById("unit").innerText = "لا توجد وحدات";
    document.getElementById("filename").innerText = "";
    document.getElementById("counter").innerText = "0 / 0";
    renderUnitList();
    return;
  }

  document.getElementById("unit").innerText = currentUnits[index].text;
  document.getElementById("filename").innerText = currentUnits[index].file;
  document.getElementById("counter").innerText = (index + 1) + " / " + currentUnits.length;

  renderUnitList();
}

function toggleRecording() {
  if (!isRecording) {
    startRecording();
    isRecording = true;
    document.getElementById("recordBtn").innerText = "⏹ إيقاف";
  } else {
    stopRecording();
    isRecording = false;
    document.getElementById("recordBtn").innerText = "🎙 تسجيل";
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = function (e) {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = function () {
      audioBlob = new Blob(audioChunks);
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    };

    mediaRecorder.start();
  } catch (err) {
    alert("❌ الميكروفون لم يعمل");
  }
}

function stopRecording() {
  if (mediaRecorder) mediaRecorder.stop();
}

function play() {
  if (!currentUnits.length) return;

  const key = getUnitKey(currentUnits[index]);

  if (audioBlob) {
    new Audio(URL.createObjectURL(audioBlob)).play();
    return;
  }

  getAudio(key, function (blob) {
    if (!blob) {
      alert("لا يوجد تسجيل لهذه الوحدة");
      return;
    }

    new Audio(URL.createObjectURL(blob)).play();
  });
}

async function download() {
  if (!currentUnits.length) return;

  const key = getUnitKey(currentUnits[index]);

  let blobToDownload = audioBlob;

  if (!blobToDownload) {
    blobToDownload = await new Promise((resolve) => {
      getAudio(key, resolve);
    });
  }

  if (!blobToDownload) {
    alert("لا يوجد تسجيل لتنزيله");
    return;
  }

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blobToDownload);
  a.download = key;
  a.click();
}

async function approveAndNext() {
  const key = getUnitKey(currentUnits[index]);

  // 🔥 تحقق من وجود صوت (جديد أو محفوظ)
  let blobToSave = audioBlob;

  if (!blobToSave) {
    blobToSave = await new Promise((resolve) => {
      getAudio(key, resolve);
    });
  }

  if (!blobToSave) {
    alert("سجّل الوحدة أولاً قبل الاعتماد");
    return;
  }

  // حفظ الصوت (إذا كان جديد)
  if (audioBlob) {
    saveAudio(key, audioBlob);
  }

  unitStatus[key] = "approved";
  saveUnitStatus();

  audioBlob = null;

  index++;
  if (index >= currentUnits.length) {
    alert("تم تسجيل كل الوحدات");
    index = 0;
  }

  updateUI();
}

function nextUnit() {
  index++;
  if (index >= currentUnits.length) index = 0;
  audioBlob = null;
  updateUI();
}

function prevUnit() {
  index--;
  if (index < 0) index = currentUnits.length - 1;
  audioBlob = null;
  updateUI();
}

function renderUnitList() {
  const list = document.getElementById("unitList");
  if (!list) return;

  list.innerHTML = "";

  currentUnits.forEach(function (unit, i) {
    const btn = document.createElement("button");
    const key = getUnitKey(unit);
    const status = unitStatus[key];

    let mark = "⏳";
    if (status === "approved") mark = "✅";
    if (status === "rejected") mark = "❌";

    btn.innerText = mark + " " + unit.text + " | " + unit.file;

    hasAudio(key, function (exists) {
      const audioMark = exists ? " 🎧" : "";
      btn.innerText = mark + audioMark + " " + unit.text + " | " + unit.file;
    });

    btn.style.display = "block";
    btn.style.margin = "8px auto";
    btn.style.padding = "8px";
    btn.style.width = "90%";

    if (i === index) {
      btn.style.background = "#cfe8ff";
      btn.style.fontWeight = "bold";
    }

    btn.onclick = function () {
      index = i;
      audioBlob = null;
      updateUI();
    };

    list.appendChild(btn);
  });
}

function renderHome() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";

  categories.forEach(function (cat) {
    const btn = document.createElement("button");
    btn.innerText = cat.title;
    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.padding = "12px";
    btn.style.width = "90%";

    btn.onclick = function () {
      currentUnits = allUnits[cat.title] || [];
      index = 0;
      audioBlob = null;

      document.getElementById("homeView").style.display = "none";
      document.getElementById("recordView").style.display = "block";

      updateUI();
    };

    list.appendChild(btn);
  });
}

function goHome() {
  document.getElementById("recordView").style.display = "none";
  document.getElementById("homeView").style.display = "block";
}
async function exportApproved() {
  const approvedKeys = Object.keys(unitStatus).filter(
    (k) => unitStatus[k] === "approved"
  );

  if (approvedKeys.length === 0) {
    alert("لا يوجد أصوات معتمدة");
    return;
  }

  const files = [];
  const manifest = [];

  for (let key of approvedKeys) {
    const blob = await new Promise((resolve) => {
      getAudio(key, resolve);
    });

    if (!blob) continue;

    files.push({ name: key, blob: blob });

    manifest.push({
      file: key,
      status: "approved"
    });
  }

  // تنزيل manifest.json
  const manifestBlob = new Blob(
    [JSON.stringify(manifest, null, 2)],
    { type: "application/json" }
  );

  const manifestLink = document.createElement("a");
  manifestLink.href = URL.createObjectURL(manifestBlob);
  manifestLink.download = "manifest.json";
  manifestLink.click();

  // تنزيل كل ملف صوت
  files.forEach((f) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(f.blob);
    a.download = f.name;
    a.click();
  });

  alert("تم تصدير " + files.length + " ملف");
}
