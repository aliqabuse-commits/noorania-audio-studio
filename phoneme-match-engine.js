// ================================
// phoneme-match-engine.js
// محرك المطابقة الإدراكية للحروف — V2
// ================================

console.log("🎯 phoneme-match-engine.js جاهز");


// ======================================
// بدء اختبار مطابقة حرف
// ======================================

async function startPhonemeMatchTest(targetKey) {

  try {

    const targetMemory =
      loadPerceptualIdentity(targetKey);

    if (!targetMemory) {
      alert(
        "لا توجد ذاكرة إدراكية للحرف: " +
        targetKey
      );
      return;
    }

    alert(
      "سيبدأ الآن اختبار مطابقة الحرف.\n\n" +
      "سجّل صوت الحرف المطلوب."
    );

    const blob =
      await recordMatchSample();

    if (!blob) {
      alert("فشل تسجيل العينة");
      return;
    }

    const decoded =
      await decodeBlobToMonoForMemory(blob);

    const features =
      extractPerceptualFeatures(
        decoded.samples,
        decoded.sampleRate
      );

    console.log(
      "🧠 FEATURES:",
      features
    );

    // ======================================
    // مقارنة مع جميع الهويات
    // ======================================

    const results = [];

    const identities = [
      "ba",
      "qa"
    ];

    for (const key of identities) {

      const identity =
        loadPerceptualIdentity(key);

      if (!identity) continue;

      const score =
        compareWithIdentity(
          features,
          identity
        );

      results.push({
        key,
        phoneme: identity.phoneme,
        score
      });
    }

    if (!results.length) {
      alert("لا توجد هويات للمقارنة");
      return;
    }

    // ======================================
    // ترتيب النتائج
    // ======================================

    results.sort(function (a, b) {
      return a.score - b.score;
    });

    const winner = results[0];

    // ======================================
    // بناء التقرير
    // ======================================

    let report =
      "🎯 نتيجة المطابقة الإدراكية\n\n";

    results.forEach(function (r, index) {

      report +=
        (index + 1) +
        ") " +
        r.phoneme +
        " → distance = " +
        r.score.toFixed(4) +
        "\n";
    });

    report +=
      "\n✅ الأقرب هو:\n" +
      winner.phoneme;

    alert(report);

    console.log(
      "🎯 MATCH RESULTS:",
      results
    );

  } catch (err) {

    console.error(
      "❌ فشل اختبار المطابقة",
      err
    );

    alert(
      "فشل اختبار المطابقة:\n" +
      err.message
    );
  }
}


// ======================================
// تحميل الهوية الإدراكية
// ======================================

function loadPerceptualIdentity(key) {

  try {

    const raw =
      localStorage.getItem(
        key + "_perceptual_identity"
      );

    if (!raw) return null;

    return JSON.parse(raw);

  } catch (err) {

    console.error(
      "❌ فشل تحميل الهوية:",
      key,
      err
    );

    return null;
  }
}


// ======================================
// تسجيل عينة اختبار
// ======================================

async function recordMatchSample() {

  return new Promise(async function (resolve) {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      const chunks = [];

      const recorder =
        new MediaRecorder(stream);

      recorder.ondataavailable =
        function (event) {

          if (
            event.data &&
            event.data.size > 0
          ) {
            chunks.push(event.data);
          }
        };

      recorder.onstop = function () {

        stream.getTracks().forEach(
          function (track) {
            track.stop();
          }
        );

        const blob =
          new Blob(chunks, {
            type:
              recorder.mimeType ||
              "audio/webm"
          });

        resolve(blob);
      };

      recorder.start();

      alert(
        "🎙 بدأ التسجيل الآن.\n\n" +
        "سيتم الإيقاف بعد ثانيتين."
      );

      setTimeout(function () {
        recorder.stop();
      }, 2000);

    } catch (err) {

      console.error(
        "❌ فشل التسجيل",
        err
      );

      resolve(null);
    }
  });
}


// ======================================
// مقارنة عينة بهوية
// ======================================

function compareWithIdentity(
  features,
  identity
) {

  const sig =
    identity.perceptualSignature;

  let total = 0;

  total += calcDistance(
    features.centroid,
    sig.centroid.mean
  );

  total += calcDistance(
    features.spread,
    sig.spread.mean
  );

  total += calcDistance(
    features.energy,
    sig.energy.mean
  );

  total += calcDistance(
    features.zcr,
    sig.zcr.mean
  );

  total += calcDistance(
    features.burstiness,
    sig.burstiness.mean
  );

  return total;
}


// ======================================
// حساب المسافة
// ======================================

function calcDistance(a, b) {

  return Math.abs(a - b);
}

console.log(
  "🎯 محرك المطابقة الإدراكية جاهز V2"
);
