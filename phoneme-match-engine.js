// ================================
// phoneme-match-engine.js
// محرك المطابقة الإدراكية للحروف — V1
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
      }
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

        if (!blob || blob.size === 0) {
          throw new Error("لم يتم التقاط أي بيانات صوتية");
        }

        const decoded =
          await decodeBlobToMonoForMemory(blob);

        const features =
          extractPerceptualFeatures(
            decoded.samples,
            decoded.sampleRate
          );

        const score =
          calculatePhonemeSimilarity(
            identity,
            features
          );

        renderMatchResult(
          identity,
          features,
          score
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

function renderMatchResult(identity, features, score) {
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
    verdict
  );

  console.log("🎯 نتيجة المطابقة", {
    identity,
    features,
    score,
    percent,
    verdict
  });
}

console.log("🎯 محرك المطابقة الإدراكية جاهز");
