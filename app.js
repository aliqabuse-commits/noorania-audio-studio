const units = [
  { text: "بَ", file: "ba_fatha.wav" },
  { text: "بِ", file: "ba_kasra.wav" },
  { text: "بُ", file: "ba_damma.wav" },

  { text: "أَبْ", file: "ba_sukoon_after_fatha.wav" },
  { text: "إِبْ", file: "ba_sukoon_after_kasra.wav" },
  { text: "أُبْ", file: "ba_sukoon_after_damma.wav" }
];

let index = 0;
let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;
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
// ✅ تحديث العرض
function updateUI() {
  document.getElementById("unit").innerText = units[index].text;
  document.getElementById("filename").innerText = units[index].file;
  document.getElementById("counter").innerText = (index + 1) + " / " + units.length;
}

// ✅ تشغيل أول وحدة
window.onload = function () {
  updateUI();
};

// 🎙 تسجيل
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks);
    };

    mediaRecorder.start();
  } catch (err) {
    alert("❌ الميكروفون لم يعمل");
  }
}

// ⏹ إيقاف
function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

// ▶️ تشغيل
function play() {
  if (!audioBlob) return;
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
}

// ⬇️ تنزيل
function download() {
  if (!audioBlob) return;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(audioBlob);
  a.download = units[index].file;
  a.click();
}

// ➡️ التالي
function nextUnit() {
  index++;
  if (index >= units.length) index = 0;
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
  if (index >= units.length) {
    alert("تم تسجيل كل الوحدات");
    index = 0;
  }

  updateUI();
}
function rejectUnit() {
  audioBlob = null;
  alert("تم عدم اعتماد التسجيل. أعد تسجيل هذه الوحدة.");
}
function prevUnit() {
  index--;

  if (index < 0) {
    index = units.length - 1;
  }

  audioBlob = null; // تفريغ التسجيل الحالي
  updateUI();
}
