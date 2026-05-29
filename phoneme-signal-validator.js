// ================================
// phoneme-signal-validator.js
// محرك فحص جودة الإشارة الصوتية — V1
// هدفه: التأكد من وضوح التسجيل قبل بناء الذاكرة أو الجينوم أو المسار الزمني
// ================================

console.log("🛡️ phoneme-signal-validator.js جاهز V1");


// ======================================
// فحص جودة العينة الصوتية
// ======================================

function validatePhonemeSignal(samples, sampleRate) {
  if (!samples || !samples.length) {
    return {
      accepted: false,
      score: 0,
      reason: "لا توجد عينات صوتية."
    };
  }

  const energy =
    calculateSignalEnergy(samples);

  const peak =
    calculateSignalPeak(samples);

  const silenceRatio =
    calculateSilenceRatio(samples, 0.015);

  const clarity =
    calculateSignalClarity(samples);

  const noiseLevel =
    estimateNoiseLevel(samples);

  let score = 100;

  if (energy < 0.02) score -= 35;
  if (peak < 0.08) score -= 25;
  // تم تخفيف شرط خصم النقاط بسبب الصمت بناءً على التحديث
  if (silenceRatio > 0.85) score -= 15;
  if (clarity < 0.25) score -= 25;
  if (noiseLevel > 0.45) score -= 20;

  score = Math.max(0, Math.min(100, score));

  const accepted =
    score >= 55 &&
    energy >= 0.015 &&
    peak >= 0.06;

  return {
    accepted: accepted,
    score: Number(score.toFixed(2)),
    energy: Number(energy.toFixed(4)),
    peak: Number(peak.toFixed(4)),
    silenceRatio: Number(silenceRatio.toFixed(4)),
    clarity: Number(clarity.toFixed(4)),
    noiseLevel: Number(noiseLevel.toFixed(4)),
    reason: accepted
      ? "العينة صالحة للتحليل."
      : "العينة ضعيفة أو مليئة بصمت/ضوضاء. يفضل إعادة التسجيل."
  };
}


// ======================================
// حساب متوسط طاقة الصوت
// ======================================

function calculateSignalEnergy(samples) {
  let sum = 0;

  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }

  return Math.sqrt(sum / samples.length);
}


// ======================================
// حساب أعلى قمة صوتية
// ======================================

function calculateSignalPeak(samples) {
  let peak = 0;

  for (let i = 0; i < samples.length; i++) {
    peak = Math.max(peak, Math.abs(samples[i]));
  }

  return peak;
}


// ======================================
// استخراج منطقة الصوت الفعّالة
// الهدف:
// تجاهل الفراغ قبل النطق وبعده حتى لا نحكم
// على التسجيل بالفشل بسبب الصمت الخارجي.
// ======================================

function getActiveSignalRegion(samples, threshold) {
  let start = 0;
  let end = samples.length - 1;

  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) >= threshold) {
      start = i;
      break;
    }
  }

  for (let i = samples.length - 1; i >= 0; i--) {
    if (Math.abs(samples[i]) >= threshold) {
      end = i;
      break;
    }
  }

  if (end <= start) {
    return samples;
  }

  return samples.slice(start, end + 1);
}


// ======================================
// حساب نسبة الصمت داخل منطقة الصوت الفعّالة فقط
// وليس داخل الملف الكامل.
// ======================================

function calculateSilenceRatio(samples, threshold) {
  const activeSamples =
    getActiveSignalRegion(samples, threshold);

  let silent = 0;

  for (let i = 0; i < activeSamples.length; i++) {
    if (Math.abs(activeSamples[i]) < threshold) {
      silent++;
    }
  }

  return silent / activeSamples.length;
}


// ======================================
// تقدير وضوح الإشارة
// الفكرة: الصوت الواضح يمتلك قممًا بارزة مقارنة بمتوسطه
// ======================================

function calculateSignalClarity(samples) {
  const energy =
    calculateSignalEnergy(samples);

  const peak =
    calculateSignalPeak(samples);

  if (!peak) return 0;

  return energy / peak;
}


// ======================================
// تقدير الضوضاء
// الفكرة: إذا كان الصوت ممتلئًا بحركة صغيرة مستمرة فقد تكون ضوضاء
// ======================================

function estimateNoiseLevel(samples) {
  let tinyMovement = 0;

  for (let i = 1; i < samples.length; i++) {
    const diff =
      Math.abs(samples[i] - samples[i - 1]);

    if (diff > 0.002 && diff < 0.02) {
      tinyMovement++;
    }
  }

  return tinyMovement / samples.length;
}


// ======================================
// تقرير مقروء للمستخدم
// ======================================

function buildSignalValidationReport(result) {
  return (
    "🛡️ تقرير جودة التسجيل\n\n" +
    "القرار: " + (result.accepted ? "✅ صالح" : "⚠️ يحتاج إعادة") + "\n" +
    "درجة الجودة: " + result.score + "%\n" +
    "الطاقة: " + result.energy + "\n" +
    "القمة الصوتية: " + result.peak + "\n" +
    "نسبة الصمت: " + result.silenceRatio + "\n" +
    "الوضوح: " + result.clarity + "\n" +
    "الضوضاء التقديرية: " + result.noiseLevel + "\n\n" +
    result.reason
  );
}

// ======================================
// فحص جودة تسجيلات حقيبة كاملة يدويًا
// الهدف:
// هذا الزر لا يبني ذاكرة ولا جينوم.
// فقط يعرض تقرير جودة التسجيلات الموجودة.
// ======================================

async function testSignalQualityForPhoneme(key) {
  if (typeof getPhonemeTrainingPack !== "function") {
    alert("دالة getPhonemeTrainingPack غير موجودة.");
    return;
  }

  if (typeof decodeCognitiveBlob !== "function") {
    alert("دالة decodeCognitiveBlob غير موجودة.");
    return;
  }

  const pack = getPhonemeTrainingPack(key);

  if (!pack) {
    alert("لم يتم العثور على حقيبة: " + key);
    return;
  }

  let report =
    "🛡️ تقرير جودة تسجيلات الحقيبة: " +
    key +
    "\n\n";

  let validCount = 0;
  let totalCount = 0;

  for (const pos of pack.positions) {
    let blob = null;

    if (typeof getAudioPromiseForMemory === "function") {
      blob =
        await getAudioPromiseForMemory(
          pos.file,
          3000
        );
    }

    if (!blob) {
      report +=
        "⚠️ " +
        pos.text +
        " — لا يوجد تسجيل محفوظ\n";

      continue;
    }

    try {
      const decoded =
        await decodeCognitiveBlob(blob);

      const result =
        validatePhonemeSignal(
          decoded.samples,
          decoded.sampleRate
        );

      totalCount++;

      if (result.accepted) {
        validCount++;
      }

      report +=
        pos.text +
        " — " +
        (result.accepted ? "✅ صالح" : "⚠️ يحتاج إعادة") +
        " | الجودة: " +
        result.score +
        "% | الصمت: " +
        result.silenceRatio +
        " | الضوضاء: " +
        result.noiseLevel +
        "\n";

    } catch (err) {
      report +=
        "❌ " +
        pos.text +
        " — فشل تحليل الجودة\n";
    }
  }

  report +=
    "\nالنتيجة العامة: " +
    validCount +
    " / " +
    totalCount +
    " تسجيلات صالحة.";

  alert(report);
}


// ======================================
// إتاحة زر فحص الجودة للواجهة
// ======================================

window.testSignalQualityForPhoneme =
  testSignalQualityForPhoneme;
// ======================================
// إتاحة الدوال لبقية المحركات
// ======================================

window.validatePhonemeSignal =
  validatePhonemeSignal;

window.buildSignalValidationReport =
  buildSignalValidationReport;

console.log("🛡️ محرك فحص جودة الإشارة الصوتية جاهز V1");
