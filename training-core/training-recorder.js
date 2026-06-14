// ================================
// training-recorder.js
// مسجل التدريب الإدراكي للحروف — 
// ================================

console.log("🎙 training-recorder.js جاهز ");

let perceptualTrainingRecorder = null;
let perceptualTrainingStream = null;
let perceptualTrainingChunks = [];

let currentTrainingKey = null;
let currentTrainingIndex = 0;
let currentTrainingPack = null;


// ======================================
// تحديث حالة التسجيل الحي
// ======================================

function updateTrainingStatus(text, color) {
  const box = document.getElementById("training-rec-status");
  if (!box) return;
  box.style.display = "block";
  box.style.color = color || "#00F2FF";
  box.innerHTML = text;
}


// ======================================
// رسالة اكتمال الحقيبة
// ======================================

function showTrainingSuccessMessage(pack) {
  const msg = document.getElementById("training-success-message");
  if (!msg || !pack) return;

  // ======================================
  // التوجيهات تظهر هنا في واجهة المستخدم
  // ======================================
  msg.innerHTML =
    "✅ تم حفظ التسجيل بنجاح.<br><br>" +
    "الخطوة التالية الموصى بها:<br>" +
    "🧠 أعد بناء الذاكرة الإدراكية للحقيبة أولًا.<br><br>" +
    "بعد اكتمال الذاكرة الإدراكية يمكن الانتقال إلى:<br>" +
    "🧬 بناء الجينوم المركزي<br>" +
    "ثم: ⏳ بناء المسار الزمني";

  msg.style.display = "block";
}


function hideTrainingSuccessMessage() {
  const msg = document.getElementById("training-success-message");
  if (msg) {
    msg.style.display = "none";
    msg.innerHTML = "";
  }
}


// ======================================
// بدء تدريب حرف
// ======================================

async function startPerceptualTraining(phonemeKey) {
  try {
    if (typeof getPhonemeTrainingPack !== "function") {
      alert("دالة getPhonemeTrainingPack غير موجودة");
      return;
    }
    const pack = getPhonemeTrainingPack(phonemeKey);
    if (!pack) {
      alert("لا توجد حقيبة تدريب لهذا الحرف: " + phonemeKey);
      return;
    }
    if (!pack.positions || !pack.positions.length) {
      alert("حقيبة هذا الحرف لا تحتوي وحدات تدريبية");
      return;
    }

    currentTrainingKey = phonemeKey;
    currentTrainingPack = pack;
    currentTrainingIndex = 0;

    hideTrainingSuccessMessage();
    updateTrainingStatus("🧠 تم فتح حقيبة تدريب: " + pack.name + "<br>عدد الوحدات: " + pack.positions.length, "#00F2FF");
    showTrainingStep();

  } catch (err) {
    console.error("❌ فشل بدء التدريب الإدراكي", err);
    updateTrainingStatus("❌ فشل بدء التدريب الإدراكي: " + err.message, "#ff4d4f");
    alert("فشل بدء التدريب الإدراكي:\n" + err.message);
  }
}


// ======================================
// عرض خطوة التدريب الحالية
// ======================================

function showTrainingStep() {
  if (!currentTrainingPack) { alert("لا توجد حقيبة تدريب نشطة"); return; }
  const step = currentTrainingPack.positions[currentTrainingIndex];

  if (!step) {
    showTrainingSuccessMessage(currentTrainingPack);
    updateTrainingStatus("✅ تم إكمال تسجيلات التدريب الإدراكي لحرف " + currentTrainingPack.name, "#22c55e");
    // تم إزالة الـ alert الزائد هنا
    return;
  }

  updateTrainingStatus("📌 الخطوة " + (currentTrainingIndex + 1) + " من " + currentTrainingPack.positions.length + "<br>قل الآن: <b>" + step.text + "</b>", "#00F2FF");

  const ok = confirm("تدريب حرف: " + currentTrainingPack.name + "\n\nالآن قل:\n" + step.text);
  if (!ok) { updateTrainingStatus("⏸ تم إيقاف التدريب عند: " + step.text, "#facc15"); return; }

  startTrainingStepRecording(step);
}


// ======================================
// تسجيل خطوة واحدة
// ======================================

async function startTrainingStepRecording(step) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("المتصفح لا يدعم التسجيل الصوتي");
    perceptualTrainingChunks = [];
    updateTrainingStatus("🎤 طلب إذن الميكروفون...", "#facc15");
    perceptualTrainingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    perceptualTrainingRecorder = new MediaRecorder(perceptualTrainingStream);

    perceptualTrainingRecorder.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) perceptualTrainingChunks.push(event.data);
    };

    perceptualTrainingRecorder.onstart = function () {
      updateTrainingStatus("🔴 REC جاري التسجيل...<br>قل: <b>" + step.text + "</b>", "#ff4d4f");
    };

    perceptualTrainingRecorder.onstop = async function () {
      try {
        const blob = new Blob(perceptualTrainingChunks, { type: perceptualTrainingRecorder.mimeType || "audio/webm" });
        if (!blob || blob.size === 0) throw new Error("لم يتم التقاط أي بيانات صوتية");

        // ======================================
        // فحص جودة التسجيل قبل الحفظ
        // ======================================
        if (typeof decodeCognitiveBlob === "function" && typeof validatePhonemeSignal === "function") {
          try {
            updateTrainingStatus("🔍 جاري فحص جودة التسجيل...", "#facc15");
            const decoded = await decodeCognitiveBlob(blob);
            const result = validatePhonemeSignal(decoded.samples, decoded.sampleRate);
            if (!result.accepted) {
              const report = typeof buildSignalValidationReport === "function" ? buildSignalValidationReport(result) : result.reason;
              stopTrainingStream();
              updateTrainingStatus("⚠️ التسجيل غير صالح. يرجى المحاولة مرة أخرى.", "#ff4d4f");
              alert("❌ التسجيل ضعيف أو غير واضح:\n\n" + report + "\n\nيرجى إعادة التسجيل بصوت أوضح.");
              setTimeout(showTrainingStep, 1000);
              return;
            }
          } catch (err) { console.warn("⚠️ تعذر فحص جودة التسجيل. سيتم المتابعة:", err); }
        }

        updateTrainingStatus("⏳ جاري حفظ التسجيل...<br>" + step.file, "#facc15");
        await saveTrainingAudio(step.file, blob);
        stopTrainingStream();

        currentTrainingIndex++;
        if (currentTrainingIndex < currentTrainingPack.positions.length) { showTrainingStep(); } 
        else {
          showTrainingSuccessMessage(currentTrainingPack);
          updateTrainingStatus("✅ اكتملت حقيبة التدريب الإدراكي لحرف " + currentTrainingPack.name, "#22c55e");
          // تم إزالة الـ alert الزائد هنا
        }
      } catch (err) {
        stopTrainingStream();
        updateTrainingStatus("❌ فشل حفظ التسجيل: " + err.message, "#ff4d4f");
        alert("فشل حفظ التسجيل:\n" + err.message);
      }
    };

    perceptualTrainingRecorder.start();
    alert("بدأ التسجيل الآن.\n\nقل: " + step.text + "\n\nسيتم الإيقاف تلقائيًا بعد ثانيتين.");
    setTimeout(function () { stopTrainingStepRecording(); }, 2000);

  } catch (err) {
    stopTrainingStream();
    updateTrainingStatus("❌ فشل تسجيل التدريب: " + err.message, "#ff4d4f");
    alert("فشل تسجيل التدريب:\n" + err.message);
  }
}


// ======================================
// إيقاف تسجيل الخطوة
// ======================================

function stopTrainingStepRecording() {
  if (perceptualTrainingRecorder && perceptualTrainingRecorder.state !== "inactive") {
    perceptualTrainingRecorder.stop();
  }
}
async function saveTrainingAudio(fileName, blob) {
if (!fileName || !blob) return;

try {
if (typeof saveAudio === "function") {
await saveAudio(fileName, blob);
} else if (typeof putAudio === "function") {
await putAudio(fileName, blob);
} else if (typeof saveBlob === "function") {
await saveBlob(fileName, blob);
}
} catch (err) {
console.warn("⚠️ فشل الحفظ الأساسي، سيتم الاعتماد على النسخة الاحتياطية:", fileName, err);
}

// النسخة الأخيرة تُحفظ دائمًا وتستبدل القديمة
await saveLastTrainingAudioBackup(fileName, blob);
}

// حفظ آخر تسجيل دائمًا في localStorage
function saveLastTrainingAudioBackup(fileName, blob) {
localStorage.setItem("last_training_audio_file", fileName);
localStorage.setItem("last_training_audio_time", new Date().toISOString());

console.log("ℹ️ لم يتم حفظ الصوت الخام في localStorage:", fileName);

return Promise.resolve();
}

// ======================================
// إيقاف الميكروفون
// ======================================

function stopTrainingStream() {
  if (perceptualTrainingStream) {
    perceptualTrainingStream.getTracks().forEach(function (track) { track.stop(); });
    perceptualTrainingStream = null;
  }
}
console.log("🎙 مسجل التدريب الإدراكي جاهز ");
function clearQafRawAudioOnly() {
  [
    "qaf_fatha.wav",
    "qaf_kasra.wav",
    "qaf_damma.wav",
    "qaf_sukoon_fatha.wav",
    "qaf_sukoon_kasra.wav",
    "qaf_sukoon_damma.wav"
  ].forEach(function (file) {
    localStorage.removeItem(file);
    localStorage.removeItem("audio_" + file);
  });

  alert("تم حذف تسجيلات القاف الخام فقط.");
}
// ======================================
// التصدير العام
// ======================================

window.startPerceptualTraining = startPerceptualTraining;
window.showTrainingStep = showTrainingStep;
window.startTrainingStepRecording = startTrainingStepRecording;
window.stopTrainingStepRecording = stopTrainingStepRecording;
window.saveTrainingAudio = saveTrainingAudio;
window.stopTrainingStream = stopTrainingStream;

console.log(
  "✅ TEST: startPerceptualTraining exported",
  typeof window.startPerceptualTraining
);

