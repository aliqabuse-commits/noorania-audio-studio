// ================================
// training-recorder.js
// مسجل التدريب الإدراكي للحروف — v3
// ================================

console.log("🎙 training-recorder.js جاهز V3");

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

  msg.innerHTML =
    "✅ اكتملت حقيبة التدريب الإدراكي لحرف " +
    pack.name +
    "<br><br>" +
    "الآن اضغط: 🧬 الجينوم لبناء الهوية الإدراكية المركزية.";

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

    updateTrainingStatus(
      "🧠 تم فتح حقيبة تدريب: " +
      pack.name +
      "<br>المفتاح: " +
      phonemeKey +
      "<br>عدد الوحدات: " +
      pack.positions.length,
      "#00F2FF"
    );

    console.log("🎒 OPEN TRAINING PACK:", phonemeKey, pack);

    showTrainingStep();

  } catch (err) {
    console.error("❌ فشل بدء التدريب الإدراكي", err);

    updateTrainingStatus(
      "❌ فشل بدء التدريب الإدراكي: " + err.message,
      "#ff4d4f"
    );

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
    showTrainingSuccessMessage(currentTrainingPack);

    updateTrainingStatus(
      "✅ تم إكمال تسجيلات التدريب الإدراكي لحرف " +
      currentTrainingPack.name,
      "#22c55e"
    );

    alert(
      "تم إكمال تسجيلات التدريب الإدراكي لحرف " +
      currentTrainingPack.name +
      "\n\nالآن اضغط زر:\n🧬 الجينوم"
    );

    return;
  }

  updateTrainingStatus(
    "📌 الخطوة " +
    (currentTrainingIndex + 1) +
    " من " +
    currentTrainingPack.positions.length +
    "<br>قل الآن: <b>" +
    step.text +
    "</b><br>سيُحفظ باسم: <b>" +
    step.file +
    "</b>",
    "#00F2FF"
  );

  const ok = confirm(
    "تدريب حرف: " + currentTrainingPack.name + "\n\n" +
    "الخطوة " + (currentTrainingIndex + 1) +
    " من " + currentTrainingPack.positions.length + "\n\n" +
    "الآن قل:\n" +
    step.text + "\n\n" +
    "سيتم حفظ التسجيل باسم:\n" +
    step.file
  );

  if (!ok) {
    updateTrainingStatus(
      "⏸ تم إيقاف التدريب عند: " + step.text,
      "#facc15"
    );

    return;
  }

  startTrainingStepRecording(step);
}


// ======================================
// تسجيل خطوة واحدة
// ======================================

async function startTrainingStepRecording(step) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("المتصفح لا يدعم التسجيل الصوتي");
    }

    perceptualTrainingChunks = [];

    updateTrainingStatus("🎤 طلب إذن الميكروفون...", "#facc15");

    perceptualTrainingStream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    perceptualTrainingRecorder =
      new MediaRecorder(perceptualTrainingStream);

    perceptualTrainingRecorder.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) {
        perceptualTrainingChunks.push(event.data);

        updateTrainingStatus(
          "🎙 تم التقاط بيانات صوتية: " +
          event.data.size +
          " bytes",
          "#00F2FF"
        );
      }
    };

    perceptualTrainingRecorder.onstart = function () {
      updateTrainingStatus(
        "🔴 REC جاري التسجيل...<br>قل: <b>" +
        step.text +
        "</b>",
        "#ff4d4f"
      );
    };

    perceptualTrainingRecorder.onstop = async function () {
      try {
        const blob = new Blob(perceptualTrainingChunks, {
          type: perceptualTrainingRecorder.mimeType || "audio/webm"
        });

        if (!blob || blob.size === 0) {
          throw new Error("لم يتم التقاط أي بيانات صوتية");
        }

        updateTrainingStatus(
          "⏳ جاري حفظ التسجيل...<br>" +
          step.file +
          "<br>الحجم: " +
          blob.size +
          " bytes",
          "#facc15"
        );

        await saveTrainingAudio(step.file, blob);

        stopTrainingStream();

        updateTrainingStatus(
          "✅ تم حفظ التدريب بنجاح:<br><b>" +
          step.text +
          "</b><br>" +
          step.file +
          "<br>الحجم: " +
          blob.size +
          " bytes",
          "#22c55e"
        );

        currentTrainingIndex++;

        if (currentTrainingIndex < currentTrainingPack.positions.length) {
          showTrainingStep();
        } else {
          showTrainingSuccessMessage(currentTrainingPack);

          updateTrainingStatus(
            "✅ اكتملت حقيبة التدريب الإدراكي لحرف " +
            currentTrainingPack.name,
            "#22c55e"
          );

          alert(
            "اكتملت حقيبة التدريب الإدراكي لحرف " +
            currentTrainingPack.name +
            "\n\nالآن اضغط زر:\n🧬 الجينوم"
          );
        }

      } catch (err) {
        stopTrainingStream();

        console.error("❌ فشل حفظ التسجيل", err);

        updateTrainingStatus(
          "❌ فشل حفظ التسجيل: " + err.message,
          "#ff4d4f"
        );

        alert("فشل حفظ التسجيل:\n" + err.message);
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

    updateTrainingStatus(
      "❌ فشل تسجيل التدريب: " + err.message,
      "#ff4d4f"
    );

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
        localStorage.setItem("audio_" + fileName, reader.result);
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


console.log("🎙 مسجل التدريب الإدراكي جاهز V3");
