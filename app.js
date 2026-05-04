const categories = [
  { title: "أسماء الحروف الهجائية", type: "direct" },
  { title: "الحروف المتحركة", type: "direct" },
  { title: "الحروف الساكنة", type: "direct" },
  { title: "التنوين", type: "direct" },
  { title: "المد واللين", type: "direct" },
  { title: "القوائم المرجعية", type: "sub" }
];
let currentUnits = [];
let index = 0;
let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;
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
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

function play() {
  if (!audioBlob) return;
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
}

function download() {
  if (!audioBlob) return;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(audioBlob);
  a.download = currentUnits[index].file;
  a.click();
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

function approveAndNext() {
  if (!audioBlob) {
    alert("سجّل الوحدة أولاً قبل الاعتماد");
    return;
  }

  download();
  audioBlob = null;

  index++;
  if (index >= currentUnits.length) {
    alert("تم تسجيل كل الوحدات");
    index = 0;
  }

  updateUI();
}

function rejectUnit() {
  audioBlob = null;
  alert("تم عدم اعتماد التسجيل. أعد تسجيل هذه الوحدة.");
}

function renderUnitList() {
  const list = document.getElementById("unitList");
  if (!list) return;

  list.innerHTML = "";

  currentUnits.forEach(function (unit, i) {
    const btn = document.createElement("button");
    btn.innerText = unit.text + " | " + unit.file;

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
