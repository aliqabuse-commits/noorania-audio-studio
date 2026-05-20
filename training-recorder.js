// ================================
// training-recorder.js
// مسجل التدريب الإدراكي للحروف — V1
// ================================

console.log("🎙 training-recorder.js جاهز");

let perceptualTrainingRecorder = null;
let perceptualTrainingStream = null;
let perceptualTrainingChunks = [];

let currentTrainingKey = null;
let currentTrainingIndex = 0;
let currentTrainingPack = null;

// ======================================
// بدء تدريب حرف إدراكيًا
// ======================================

async function startPerceptualTraining(phonemeKey) {
  try {
    const pack = getPhonemeTrainingPack(phonemeKey);

    if (!pack) {
      alert("لا توجد حقيبة تدريب لهذا الحرف: " + phonemeKey);
      return;
    }

    currentTrainingKey = phonemeKey;
    currentTrainingPack = pack;
    currentTrainingIndex = 0;

    showTrainingStep();

  } catch (err) {
    console.error("❌ فشل بدء التدريب الإدراكي", err);
    alert("فشل بدء التدريب الإدراكي:\n" + err.message);
  }
}

// ======================================
// عرض خطوة التدريب الحالية
// ======================================

function showTrainingStep() {
  if (!currentTrainingPack) {
    alert("لا توجد حقيبة تدريب نشطة");
    return;
  }

  const step = currentTrainingPack.positions[currentTrainingIndex];

  if (!step) {
    alert("تم إكمال تسجيلات التدريب الإدراكي لحرف " + currentTrainingPack.name);
    return;
  }

  const message =
    "تدريب حرف: " + currentTrainingPack.name + "\n\n" +
    "الآن قل:\n" +
    step.text + "\n\n" +
    "سيتم حفظ التسجيل باسم:\n" +
    step.file;

  const ok = confirm(message);

  if (!ok) {
    return;
  }

  startTrainingStepRecording(step);
}

// ======================================
// تسجيل خطوة تدريب واحدة
// ======================================

async function startTrainingStepRecording(step) {
  try {
    perceptualTrainingChunks = [];

    perceptualTrainingStream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    perceptualTrainingRecorder =
      new MediaRecorder(perceptualTrainingStream);

    perceptualTrainingRecorder.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) {
        perceptualTrainingChunks.push(event.data);
      }
    };

    perceptualTrainingRecorder.onstop = async function () {
      const blob = new Blob(perceptualTrainingChunks, {
        type: "audio/wav"
      });

      await saveTrainingAudio(step.file, blob);

      stopTrainingStream();

      alert(
        "تم حفظ تدريب:\n" +
        step.text + "\n\n" +
        "الملف:\n" +
        step.file
      );

      currentTrainingIndex++;

      if (currentTrainingIndex < currentTrainingPack.positions.length) {
        showTrainingStep();
      } else {
        alert(
          "اكتملت حقيبة التدريب الإدراكي لحرف " +
          currentTrainingPack.name +
          "\n\nالآن اضغط:\n🧠 بناء ذاكرة لون الباء"
        );
      }
    };

    perceptualTrainingRecorder.start();

    alert(
      "بدأ التسجيل الآن.\n\n" +
      "قل: " + step.text + "\n\n" +
      "سيتم الإيقاف تلقائيًا بعد ثانيتين."
    );

    setTimeout(function () {
      stopTrainingStepRecording();
    }, 2000);

  } catch (err) {
    stopTrainingStream();
    console.error("❌ فشل تسجيل التدريب", err);
    alert("فشل تسجيل التدريب:\n" + err.message);
  }
}

// ======================================
// إيقاف تسجيل الخطوة
// ======================================

function stopTrainingStepRecording() {
  if (
    perceptualTrainingRecorder &&
    perceptualTrainingRecorder.state !== "inactive"
  ) {
    perceptualTrainingRecorder.stop();
  }
}

// ======================================
// حفظ صوت التدريب
// ======================================

async function saveTrainingAudio(fileName, blob) {
  if (typeof saveAudio === "function") {
    await saveAudio(fileName, blob);
    return;
  }

  if (typeof putAudio === "function") {
    await putAudio(fileName, blob);
    return;
  }

  if (typeof saveBlob === "function") {
    await saveBlob(fileName, blob);
    return;
  }

  const reader = new FileReader();

  return new Promise(function (resolve, reject) {
    reader.onloadend = function () {
      try {
        localStorage.setItem(
          "audio_" + fileName,
          reader.result
        );

        resolve();
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ======================================
// إيقاف الميكروفون
// ======================================

function stopTrainingStream() {
  if (perceptualTrainingStream) {
    perceptualTrainingStream.getTracks().forEach(function (track) {
      track.stop();
    });

    perceptualTrainingStream = null;
  }
}

console.log("🎙 مسجل التدريب الإدراكي جاهز");
