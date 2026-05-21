// ================================
// phoneme-match-engine.js
// محرك المطابقة الإدراكية للحروف — V1.1
// ================================

console.log("🎯 phoneme-match-engine.js جاهز");

let phonemeMatchRecorder = null;
let phonemeMatchStream = null;
let phonemeMatchChunks = [];

// ======================================
// بدء اختبار المطابقة
// ======================================

async function startPhonemeMatchTest(phonemeKey) {
  try {
    const identityRaw =
      localStorage.getItem(phonemeKey + "_perceptual_identity");

    if (!identityRaw) {
      alert(
        "لا توجد ذاكرة إدراكية لهذا الحرف.\n" +
        "ابنِ الذاكرة أولًا."
      );
      return;
    }

    const identity = JSON.parse(identityRaw);

    phonemeMatchChunks = [];

    phonemeMatchStream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    phonemeMatchRecorder =
      new MediaRecorder(phonemeMatchStream);

    phonemeMatchRecorder.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) {
        phonemeMatchChunks.push(event.data);
        console.log("🎙 match chunk:", event.data.size, "bytes");
      }
    };

    phonemeMatchRecorder.onstart = function () {
      console.log("🔴 بدأ تسجيل اختبار المطابقة");
    };

    phonemeMatchRecorder.onstop = async function () {
      try {
        const blob = new Blob(
          phonemeMatchChunks,
          {
            type:
              phonemeMatchRecorder.mimeType ||
              "audio/webm"
          }
        );

        stopPhonemeMatchStream();

        console.log("📦 حجم تسجيل المطابقة:", blob.size, "bytes");

        if (!blob || blob.size < 1000) {
          alert(
            "❌ التسجيل غير صالح.\n" +
            "حجم البيانات صغير جدًا:\n" +
            blob.size + " bytes"
          );
          return;
        }

        const decoded =
          await decodeBlobToMonoForMemory(blob);

        const duration =
          decoded.samples.length / decoded.sampleRate;

        const rms =
          calcMemoryRms(decoded.samples);

        console.log("📊 فحص تسجيل المطابقة:", {
          duration,
          sampleRate: decoded.sampleRate,
          samples: decoded.samples.length,
          rms
        });

        if (duration < 0.20) {
          alert(
            "❌ التسجيل قصير جدًا.\n" +
            "المدة: " + duration.toFixed(3) + " ثانية"
          );
          return;
        }

        if (rms < 0.003) {
          alert(
            "❌ التسجيل يبدو صامتًا أو ضعيفًا جدًا.\n" +
            "RMS: " + rms.toFixed(6)
          );
          return;
        }

        const features =
          extractPerceptualFeatures(
            decoded.samples,
            decoded.sampleRate
          );

        console.log("🧬 سمات صوت الاختبار:", features);

        const score =
          calculatePhonemeSimilarity(
            identity,
            features
          );

        renderMatchResult(
          identity,
          features,
          score,
          {
            blobSize: blob.size,
            duration,
            rms
          }
        );

      } catch (err) {
        stopPhonemeMatchStream();

        console.error("❌ فشل اختبار المطابقة", err);

        alert(
          "فشل اختبار المطابقة:\n" +
          err.message
        );
      }
    };

    phonemeMatchRecorder.start();

    alert(
      "🎙 ابدأ الآن بنطق الحرف:\n\n" +
      identity.label +
      "\n\nسيتم الإيقاف تلقائيًا بعد ثانيتين."
    );

    setTimeout(function () {
      stopPhonemeMatchRecording();
    }, 2000);

  } catch (err) {
    stopPhonemeMatchStream();

    console.error("❌ فشل بدء اختبار المطابقة", err);

    alert(
      "فشل بدء الاختبار:\n" +
      err.message
    );
  }
}

// ======================================
// إيقاف التسجيل
// ======================================

function stopPhonemeMatchRecording() {
  if (
    phonemeMatchRecorder &&
    phonemeMatchRecorder.state !== "inactive"
  ) {
    phonemeMatchRecorder.stop();
  }
}

function stopPhonemeMatchStream() {
  if (phonemeMatchStream) {
    phonemeMatchStream
      .getTracks()
      .forEach(function (track) {
        track.stop();
      });

    phonemeMatchStream = null;
  }
}

// ======================================
// حساب التشابه الإدراكي
// ======================================

function calculatePhonemeSimilarity(identity, features) {
  const signature = identity.perceptualSignature;

  const centroidScore = compareFeature(
    features.centroid,
    signature.centroid.mean,
    400
  );

  const spreadScore = compareFeature(
    features.spread,
    signature.spread.mean,
    600
  );

  const energyScore = compareFeature(
    features.energy,
    signature.energy.mean,
    0.08
  );

  const zcrScore = compareFeature(
    features.zcr,
    signature.zcr.mean,
    0.08
  );

  const burstScore = compareFeature(
    features.burstiness,
    signature.burstiness.mean,
    1.5
  );

  const finalScore =
    centroidScore * 0.25 +
    spreadScore * 0.20 +
    energyScore * 0.15 +
    zcrScore * 0.15 +
    burstScore * 0.25;

  return {
    finalScore,
    details: {
      centroidScore,
      spreadScore,
      energyScore,
      zcrScore,
      burstScore
    }
  };
}

// ======================================
// مقارنة سمة واحدة
// ======================================

function compareFeature(value, target, tolerance) {
  const diff = Math.abs(value - target);

  return Math.max(
    0,
    1 - diff / tolerance
  );
}

// ======================================
// عرض النتيجة
// ======================================

function renderMatchResult(identity, features, score, meta) {
  const percent =
    Math.round(score.finalScore * 100);

  let verdict = "❌ المطابقة ضعيفة";

  if (percent >= 80) {
    verdict = "✅ تطابق قوي جدًا";
  } else if (percent >= 60) {
    verdict = "🟡 تطابق متوسط";
  }

  alert(
    "🎯 نتيجة المطابقة\n\n" +
    "الحرف المرجعي: " + identity.label + "\n" +
    "اللون: " + identity.color.name + "\n\n" +
    "نسبة المطابقة: " + percent + "%\n\n" +
    verdict + "\n\n" +
    "فحص التسجيل:\n" +
    "الحجم: " + meta.blobSize + " bytes\n" +
    "المدة: " + meta.duration.toFixed(3) + " ثانية\n" +
    "RMS: " + meta.rms.toFixed(6)
  );

  console.log("🎯 نتيجة المطابقة", {
    identity,
    features,
    score,
    percent,
    verdict,
    meta
  });
}

console.log("🎯 محرك المطابقة الإدراكية جاهز V1.1");
