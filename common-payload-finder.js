// ================================
// common-payload-finder.js
// كاشف المحمول المشترك — نسخة الباء الساكنة
// ================================

const BA_COMMON_PAYLOAD_KEYS = [
  "ab_sukoon.wav",
  "qab_sukoon.wav",
  "fab_sukoon.wav",
  "bab_sukoon.wav",
  "baab_sukoon.wav"
];


// =====================================
// 1️⃣ تشغيل اختبار الباء الساكنة
// =====================================

async function runBaCommonPayloadTest() {

  try {

    const result = await findCommonPayloadForKeys(
      BA_COMMON_PAYLOAD_KEYS
    );

    console.log("🧠 نتيجة كاشف المحمول المشترك:", result);

    localStorage.setItem(
      "ba_common_payload_result",
      JSON.stringify(result, null, 2)
    );

    alert(
      "تم اكتشاف المحمول المشترك تقريبياً\n" +
      "المدة: " + result.bestDurationSeconds.toFixed(3) + " ثانية\n" +
      "درجة التشابه: " + result.score.toFixed(4)
    );

  } catch (err) {

    console.error("❌ فشل كاشف المحمول المشترك", err);

    alert(
      "فشل اكتشاف المحمول المشترك:\n" +
      err.message
    );

  }

}


// =====================================
// 2️⃣ البحث عن المحمول المشترك
// =====================================

async function findCommonPayloadForKeys(keys) {

  const samples = [];

  for (const key of keys) {

    const blob = await getAudioPromise(key);

    if (!blob) {
      throw new Error("الصوت غير موجود: " + key);
    }

    const decoded = await decodeBlobToMono(blob);

    const features = extractFeatures(
      decoded.samples,
      decoded.sampleRate
    );

    const active = detectActiveRange(features);

    samples.push({
      key: key,
      sampleRate: decoded.sampleRate,
      duration: decoded.samples.length / decoded.sampleRate,
      features: features,
      active: active
    });

  }

  const best = findBestSharedEnding(samples);

  return {
    method: "Common Payload Finder v1",
    target: "ba_sukoon",
    keys: keys,
    score: best.score,
    bestDurationFrames: best.durationFrames,
    bestDurationSeconds: best.durationSeconds,
    payloads: best.payloads
  };

}


// =====================================
// 3️⃣ قراءة الصوت من التخزين
// =====================================

function getAudioPromise(key) {

  return new Promise(function (resolve) {
    getAudio(key, resolve);
  });

}


async function decodeBlobToMono(blob) {

  const arrayBuffer = await blob.arrayBuffer();

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  const ctx = new AudioContextClass();

  const audioBuffer =
    await ctx.decodeAudioData(arrayBuffer);

  return {
    samples: audioBuffer.getChannelData(0),
    sampleRate: audioBuffer.sampleRate
  };

}


// =====================================
// 4️⃣ استخراج بصمة بسيطة للصوت
// =====================================

function extractFeatures(samples, sampleRate) {

  const frameSize = Math.floor(sampleRate * 0.025);
  const hopSize = Math.floor(sampleRate * 0.010);

  const features = [];

  for (
    let start = 0;
    start + frameSize < samples.length;
    start += hopSize
  ) {

    const frame = samples.slice(
      start,
      start + frameSize
    );

    const rms = calcRms(frame);
    const zcr = calcZeroCrossingRate(frame);

    const vector = normalizeVector([
      rms,
      zcr,
      Math.log(1 + goertzelPower(frame, sampleRate, 500)),
      Math.log(1 + goertzelPower(frame, sampleRate, 1000)),
      Math.log(1 + goertzelPower(frame, sampleRate, 2000)),
      Math.log(1 + goertzelPower(frame, sampleRate, 4000))
    ]);

    features.push({
      time: start / sampleRate,
      energy: rms,
      vector: vector
    });

  }

  return features;

}


function calcRms(frame) {

  let sum = 0;

  for (let i = 0; i < frame.length; i++) {
    sum += frame[i] * frame[i];
  }

  return Math.sqrt(sum / frame.length);

}


function calcZeroCrossingRate(frame) {

  let count = 0;

  for (let i = 1; i < frame.length; i++) {

    if (
      (frame[i - 1] >= 0 && frame[i] < 0) ||
      (frame[i - 1] < 0 && frame[i] >= 0)
    ) {
      count++;
    }

  }

  return count / frame.length;

}


function goertzelPower(frame, sampleRate, freq) {

  const w = 2 * Math.PI * freq / sampleRate;
  const coeff = 2 * Math.cos(w);

  let s0 = 0;
  let s1 = 0;
  let s2 = 0;

  for (let i = 0; i < frame.length; i++) {
    s0 = frame[i] + coeff * s1 - s2;
    s2 = s1;
    s1 = s0;
  }

  return s1 * s1 + s2 * s2 - coeff * s1 * s2;

}


function normalizeVector(v) {

  const norm = Math.sqrt(
    v.reduce(function (sum, x) {
      return sum + x * x;
    }, 0)
  );

  if (!norm) return v;

  return v.map(function (x) {
    return x / norm;
  });

}


// =====================================
// 5️⃣ تحديد الجزء النشط
// =====================================

function detectActiveRange(features) {

  const energies = features.map(function (f) {
    return f.energy || 0;
  });

  const max = Math.max.apply(null, energies);
  const threshold = max * 0.10;

  let start = 0;
  let end = features.length - 1;

  for (let i = 0; i < energies.length; i++) {
    if (energies[i] > threshold) {
      start = i;
      break;
    }
  }

  for (let i = energies.length - 1; i >= 0; i--) {
    if (energies[i] > threshold) {
      end = i;
      break;
    }
  }

  return {
    start: start,
    end: end
  };

}


// =====================================
// 6️⃣ اختيار أفضل نهاية مشتركة
// =====================================

function findBestSharedEnding(samples) {

  const minActiveLength = Math.min.apply(
    null,
    samples.map(function (s) {
      return s.active.end - s.active.start;
    })
  );

  let best = {
    score: Infinity,
    durationFrames: 0,
    durationSeconds: 0,
    payloads: []
  };

  const minFrames = 4;
  const maxFrames = Math.min(55, minActiveLength);

  for (let d = minFrames; d <= maxFrames; d++) {

    const segments = samples.map(function (s) {

      const end = s.active.end;
      const start = Math.max(
        s.active.start,
        end - d
      );

      const frames = s.features.slice(start, end);

      return {
        key: s.key,
        frames: frames,
        startTime: s.features[start]?.time || 0,
        endTime: s.features[end]?.time || s.duration
      };

    });

    if (segments.some(function (seg) {
      return !seg.frames.length;
    })) {
      continue;
    }

    const score = averagePairwiseDtw(segments);

    if (score < best.score) {

      best.score = score;
      best.durationFrames = d;
      best.durationSeconds = d * 0.010;

      best.payloads = segments.map(function (seg) {
        return {
          key: seg.key,
          start: Number(seg.startTime.toFixed(4)),
          end: Number(seg.endTime.toFixed(4))
        };
      });

    }

  }

  return best;

}


// =====================================
// 7️⃣ المقارنة بين المقاطع
// =====================================

function averagePairwiseDtw(segments) {

  let sum = 0;
  let count = 0;

  for (let i = 0; i < segments.length; i++) {

    for (let j = i + 1; j < segments.length; j++) {

      sum += dtwDistance(
        segments[i].frames,
        segments[j].frames
      );

      count++;

    }

  }

  return count ? sum / count : Infinity;

}


function dtwDistance(a, b) {

  const n = a.length;
  const m = b.length;

  const dp = Array.from(
    { length: n + 1 },
    function () {
      return Array(m + 1).fill(Infinity);
    }
  );

  dp[0][0] = 0;

  for (let i = 1; i <= n; i++) {

    for (let j = 1; j <= m; j++) {

      const cost = vectorDistance(
        a[i - 1].vector,
        b[j - 1].vector
      );

      dp[i][j] =
        cost +
        Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );

    }

  }

  return dp[n][m] / (n + m);

}


function vectorDistance(a, b) {

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }

  return Math.sqrt(sum);

}


console.log("🧠 common-payload-finder.js جاهز — كاشف المحمول المشترك يعمل");
