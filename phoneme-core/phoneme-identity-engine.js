// ================================
// phoneme-identity-engine.js
// محرك بناء الهوية الصوتية للحرف الساكن
// ================================

console.log("🧬 phoneme-identity-engine.js جاهز");


// =====================================
// 1️⃣ تشغيل بناء الهوية
// =====================================

async function runPhonemeIdentityEngine() {

  try {

    const result =
      await buildPhonemeIdentity(
        BA_COMMON_PAYLOAD_KEYS
      );

    console.log(
      "🧬 نتيجة الهوية الصوتية:",
      result
    );

    localStorage.setItem(
      "ba_identity_signature",
      JSON.stringify(result, null, 2)
    );

    renderIdentityReport(result);

    alert(
      "🧬 تم بناء الهوية الصوتية\n" +
      "الثقة العامة: " +
      result.globalConfidence.toFixed(4)
    );

  } catch (err) {

    console.error(
      "❌ فشل بناء الهوية الصوتية",
      err
    );

    alert(
      "فشل بناء الهوية الصوتية:\n" +
      err.message
    );

  }

}


// =====================================
// 2️⃣ بناء الهوية
// =====================================

async function buildPhonemeIdentity(keys) {

  const samples = [];

  for (const key of keys) {

    const blob = await getAudioPromise(key);

    if (!blob) {
      throw new Error(
        "الصوت غير موجود: " + key
      );
    }

    const decoded =
      await decodeBlobToMono(blob);

    const features =
      extractIdentityFeatures(
        decoded.samples,
        decoded.sampleRate
      );

    const active =
      detectIdentityActiveRange(features);

    const burst =
      detectBurstPeak(features);

    samples.push({
      key,
      sampleRate: decoded.sampleRate,
      duration:
        decoded.samples.length /
        decoded.sampleRate,
      features,
      active,
      burst
    });

  }

  const identity =
    buildIdentitySignature(samples);

  return identity;

}


// =====================================
// 3️⃣ استخراج خصائص الهوية
// =====================================

function extractIdentityFeatures(
  samples,
  sampleRate
) {

  const frameSize =
    Math.floor(sampleRate * 0.020);

  const hopSize =
    Math.floor(sampleRate * 0.008);

  const features = [];

  for (
    let start = 0;
    start + frameSize < samples.length;
    start += hopSize
  ) {

    const frame =
      samples.slice(
        start,
        start + frameSize
      );

    const rms =
      calcRms(frame);

    const zcr =
      calcZeroCrossingRate(frame);

    const low =
      goertzelPower(
        frame,
        sampleRate,
        500
      );

    const mid =
      goertzelPower(
        frame,
        sampleRate,
        1500
      );

    const high =
      goertzelPower(
        frame,
        sampleRate,
        3500
      );

    const vector =
      normalizeVector([
        rms,
        zcr,
        Math.log(1 + low),
        Math.log(1 + mid),
        Math.log(1 + high)
      ]);

    features.push({
      time: start / sampleRate,
      energy: rms,
      vector
    });

  }

  return features;

}


// =====================================
// 4️⃣ تحديد المنطقة النشطة
// =====================================

function detectIdentityActiveRange(
  features
) {

  const energies =
    features.map(function (f) {
      return f.energy || 0;
    });

  const max =
    Math.max.apply(null, energies);

  const threshold =
    max * 0.12;

  let start = 0;
  let end =
    features.length - 1;

  for (
    let i = 0;
    i < energies.length;
    i++
  ) {

    if (energies[i] > threshold) {
      start = i;
      break;
    }

  }

  for (
    let i = energies.length - 1;
    i >= 0;
    i--
  ) {

    if (energies[i] > threshold) {
      end = i;
      break;
    }

  }

  return {
    start,
    end
  };

}


// =====================================
// 5️⃣ كشف الانفجار الصوتي
// =====================================

function detectBurstPeak(features) {

  let bestIndex = 0;
  let bestEnergy = 0;

  for (
    let i = 0;
    i < features.length;
    i++
  ) {

    const e =
      features[i].energy;

    if (e > bestEnergy) {
      bestEnergy = e;
      bestIndex = i;
    }

  }

  return {
    frame: bestIndex,
    time:
      features[bestIndex]?.time || 0,
    energy: bestEnergy
  };

}


// =====================================
// 6️⃣ بناء الهوية النهائية
// =====================================

function buildIdentitySignature(
  samples
) {

  const burstTimes =
    samples.map(function (s) {
      return s.burst.time;
    });

  const burstEnergies =
    samples.map(function (s) {
      return s.burst.energy;
    });

  const avgBurstTime =
    average(burstTimes);

  const avgBurstEnergy =
    average(burstEnergies);

  const transitionScore =
    calcTransitionSimilarity(
      samples
    );

  const spectralScore =
    calcSpectralSimilarity(
      samples
    );

  const energyScore =
    calcEnergySimilarity(
      samples
    );

  const globalConfidence =
    (
      transitionScore +
      spectralScore +
      energyScore
    ) / 3;

  return {

    phoneme: "بْ",

    globalConfidence,

    burst: {
      averageTime:
        round(avgBurstTime),
      averageEnergy:
        round(avgBurstEnergy)
    },

    scores: {

      transition:
        round(transitionScore),

      spectral:
        round(spectralScore),

      energy:
        round(energyScore)

    },

    samples:
      samples.map(function (s) {

        return {

          key: s.key,

          burstTime:
            round(s.burst.time),

          burstEnergy:
            round(s.burst.energy)

        };

      })

  };

}


// =====================================
// 7️⃣ تشابه الانتقال
// =====================================

function calcTransitionSimilarity(
  samples
) {

  const values = [];

  samples.forEach(function (s) {

    const start =
      s.active.start;

    const end =
      Math.min(
        start + 8,
        s.features.length - 1
      );

    for (
      let i = start;
      i < end;
      i++
    ) {

      values.push(
        s.features[i].energy
      );

    }

  });

  return normalizeScore(
    variance(values)
  );

}


// =====================================
// 8️⃣ التشابه الطيفي
// =====================================

function calcSpectralSimilarity(
  samples
) {

  let total = 0;
  let count = 0;

  for (
    let i = 0;
    i < samples.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < samples.length;
      j++
    ) {

      const a =
        samples[i].features;

      const b =
        samples[j].features;

      const len =
        Math.min(
          a.length,
          b.length,
          12
        );

      let dist = 0;

      for (
        let k = 0;
        k < len;
        k++
      ) {

        dist += vectorDistance(
          a[k].vector,
          b[k].vector
        );

      }

      total += dist / len;
      count++;

    }

  }

  return normalizeScore(
    total / count
  );

}


// =====================================
// 9️⃣ تشابه الطاقة
// =====================================

function calcEnergySimilarity(
  samples
) {

  const energies = [];

  samples.forEach(function (s) {

    s.features.forEach(function (f) {
      energies.push(f.energy);
    });

  });

  return normalizeScore(
    variance(energies)
  );

}


// =====================================
// 🔟 التقرير البصري
// =====================================

function renderIdentityReport(
  result
) {

  let box =
    document.getElementById(
      "identity-report-box"
    );

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "identity-report-box";

    box.style.background =
      "#111827";

    box.style.color =
      "white";

    box.style.padding =
      "12px";

    box.style.margin =
      "12px 0";

    box.style.borderRadius =
      "10px";

    box.style.fontSize =
      "13px";

    const target =
      document.getElementById(
        "waveform-container"
      );

    if (
      target &&
      target.parentNode
    ) {

      target.parentNode.insertBefore(
        box,
        target
      );

    }

  }

  box.style.display = "block";

  box.innerHTML = `

    <div style="font-size:15px;
                font-weight:bold;
                margin-bottom:10px;
                color:#22c55e;">

      🧬 الهوية الصوتية للحرف

    </div>

    <div>
      الحرف:
      <b>${result.phoneme}</b>
    </div>

    <div>
      الثقة العامة:
      <b>
        ${result.globalConfidence.toFixed(4)}
      </b>
    </div>

    <hr style="margin:10px 0;
               border-color:#374151;">

    <div>
      انتقال:
      ${result.scores.transition}
    </div>

    <div>
      طيف:
      ${result.scores.spectral}
    </div>

    <div>
      طاقة:
      ${result.scores.energy}
    </div>

    <hr style="margin:10px 0;
               border-color:#374151;">

    ${result.samples.map(function (s) {

      return `
        <div style="
          background:#1f2937;
          margin:6px 0;
          padding:6px;
          border-radius:6px;
        ">

          <div>
            ${s.key}
          </div>

          <div>
            burst:
            ${s.burstTime}
          </div>

          <div>
            energy:
            ${s.burstEnergy}
          </div>

        </div>
      `;

    }).join("")}

  `;

}


// =====================================
// 1️⃣1️⃣ أدوات رياضية
// =====================================

function average(values) {

  if (!values.length) {
    return 0;
  }

  const sum =
    values.reduce(function (a, b) {
      return a + b;
    }, 0);

  return sum / values.length;

}


function variance(values) {

  if (!values.length) {
    return 0;
  }

  const avg =
    average(values);

  let sum = 0;

  values.forEach(function (v) {

    const d = v - avg;
    sum += d * d;

  });

  return sum / values.length;

}


function normalizeScore(v) {

  return 1 / (1 + v);

}


function round(num) {

  return Number(
    num.toFixed(4)
  );

}
