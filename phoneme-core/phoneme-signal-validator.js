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

  const energy = calculateSignalEnergy(samples);
  const peak = calculateSignalPeak(samples);
  const silenceRatio = calculateSilenceRatio(samples, 0.015);
  const clarity = calculateSignalClarity(samples);
  const noiseLevel = estimateNoiseLevel(samples);

  const energyScore = clamp01(energy / 0.08) * 25;
  const peakScore = clamp01(peak / 0.35) * 20;
  const silenceScore = (1 - clamp01(silenceRatio / 0.9)) * 20;
  const clarityScore = clamp01(clarity / 0.45) * 20;
  const noiseScore = (1 - clamp01(noiseLevel / 0.25)) * 15;

  let score = energyScore + peakScore + silenceScore + clarityScore + noiseScore;
  score = Math.max(0, Math.min(100, score));

  const accepted = score >= 55 && energy >= 0.015 && peak >= 0.06;

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


function clamp01(value) {
  value = Number(value || 0);
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function calculateSignalEnergy(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function calculateSignalPeak(samples) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  return peak;
}

function getActiveSignalRegion(samples, threshold) {
  let start = 0;
  let end = samples.length - 1;

  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) >= threshold) { start = i; break; }
  }

  for (let i = samples.length - 1; i >= 0; i--) {
    if (Math.abs(samples[i]) >= threshold) { end = i; break; }
  }

  if (end <= start) return samples;
  return samples.slice(start, end + 1);
}

function calculateSilenceRatio(samples, threshold) {
  const activeSamples = getActiveSignalRegion(samples, threshold);
  let silent = 0;

  for (let i = 0; i < activeSamples.length; i++) {
    if (Math.abs(activeSamples[i]) < threshold) silent++;
  }

  return silent / activeSamples.length;
}

function calculateSignalClarity(samples) {
  const energy = calculateSignalEnergy(samples);
  const peak = calculateSignalPeak(samples);
  if (!peak) return 0;
  return energy / peak;
}

function estimateNoiseLevel(samples) {
  let tinyMovement = 0;
  for (let i = 1; i < samples.length; i++) {
    const diff = Math.abs(samples[i] - samples[i - 1]);
    if (diff > 0.002 && diff < 0.02) tinyMovement++;
  }
  return tinyMovement / samples.length;
}

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
// فحص جودة تسجيلات حقيبة كاملة (مُحدّثة للمدير الموحد)
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

  let report = "🛡️ تقرير جودة تسجيلات الحقيبة: " + key + "\n\n";
  let validCount = 0;
  let totalCount = 0;

  for (const pos of pack.positions) {
    let blob = null;

    if (typeof getAudioPromiseForMemory === "function") {
      blob = await getAudioPromiseForMemory(pos.file, 3000);
    }

    if (!blob) {
      report += "⚠️ " + pos.text + " — لا يوجد تسجيل محفوظ\n";
      continue;
    }

    try {
      const decoded = await decodeCognitiveBlob(blob);
      const result = validatePhonemeSignal(decoded.samples, decoded.sampleRate);
      
      totalCount++;
      if (result.accepted) validCount++;

      report +=
        pos.text +
        " — " +
        (result.accepted ? "✅ صالح" : "⚠️ يحتاج إعادة") +
        " | الجودة: " + result.score +
        "% | الطاقة: " + result.energy +
        " | القمة: " + result.peak +
        " | الوضوح: " + result.clarity +
        " | الصمت: " + result.silenceRatio +
        " | الضوضاء: " + result.noiseLevel + "\n";

    } catch (err) {
      report += "❌ " + pos.text + " — فشل تحليل الجودة\n";
    }
  }

  report += "\nالنتيجة العامة: " + validCount + " / " + totalCount + " تسجيلات صالحة.";

  // التعديل: حفظ التقرير وإرساله للوحة الموحدة بدلاً من Alert
  localStorage.setItem(key + "_signal_quality_report", report);
  saveCurrentSessionReport(
  "signal",
  "🛡️ تقرير جودة التسجيل",
  report
);
  if(typeof renderToUnifiedPanel === 'function') {
    renderToUnifiedPanel(`<pre style="color:#e5e7eb; font-family:monospace; white-space:pre-wrap; font-size:14px;">${report}</pre>`);
  } else {
    alert(report);
  }
}

window.testSignalQualityForPhoneme = testSignalQualityForPhoneme;
window.validatePhonemeSignal = validatePhonemeSignal;
window.buildSignalValidationReport = buildSignalValidationReport;

console.log("🛡️ محرك فحص جودة الإشارة الصوتية جاهز V1");
