// ======================================
// core-purifier-engine.js
// محرك تنقية النواة المشتركة
// ======================================

console.log("🧬 core-purifier-engine.js جاهز");

// ======================================
// تشغيل محرك التنقية
// ======================================

async function runCorePurifierEngine() {

  try {

    const sealSaved =
      localStorage.getItem(
        "ba_spectral_seal"
      );

    if (!sealSaved) {

      alert(
        "شغّل أولًا: 🌈 بناء الختم الطيفي للباء"
      );

      return;
    }

    const seal =
      JSON.parse(sealSaved);

    const purified =
      purifyCoreBands(seal);

    console.log(
      "🧬 النواة النقية:",
      purified
    );

    localStorage.setItem(
      "ba_pure_core",
      JSON.stringify(
        purified,
        null,
        2
      )
    );

    renderPureCoreReport(
      purified
    );

    alert(
      "تم تنقية النواة المشتركة\n" +
      "عدد النطاقات النقية: " +
      purified.bands.length
    );

  } catch (err) {

    console.error(
      "❌ فشل تنقية النواة",
      err
    );

    alert(
      "فشل تنقية النواة:\n" +
      err.message
    );
  }
}

// ======================================
// تنقية النطاقات
// ======================================

function purifyCoreBands(seal) {

  const buckets = {};

  seal.samples.forEach(function (sample) {

    sample.peaks.forEach(function (peak) {

      const bucket =
        Math.round(
          peak.freq / 100
        ) * 100;

      if (!buckets[bucket]) {

        buckets[bucket] = {

          count: 0,

          magnitudes: [],

          freqs: []
        };
      }

      buckets[bucket].count++;

      buckets[bucket]
        .magnitudes
        .push(peak.magnitude);

      buckets[bucket]
        .freqs
        .push(peak.freq);
    });
  });

  const purifiedBands = [];

  Object.keys(buckets).forEach(function (key) {

    const item =
      buckets[key];

    const stability =
      item.count /
      seal.samples.length;

    const avgMagnitude =
      average(
        item.magnitudes
      );

    const avgFreq =
      average(
        item.freqs
      );

    // ======================================
    // شروط النواة الحقيقية
    // ======================================

    if (
      stability >= 0.4 &&
      avgMagnitude >= 1
    ) {

      purifiedBands.push({

        from:
          Number(key) - 50,

        to:
          Number(key) + 50,

        center:
          round(avgFreq),

        stability:
          round(stability),

        power:
          round(avgMagnitude)
      });
    }
  });

  purifiedBands.sort(function (a, b) {

    return (
      b.stability -
      a.stability
    );
  });

  return {

    phoneme: "بْ",

    method:
      "Core Purifier Engine V1",

    bandCount:
      purifiedBands.length,

    bands:
      purifiedBands
  };
}

// ======================================
// رسم التقرير
// ======================================

function renderPureCoreReport(
  result
) {

  let box =
    document.getElementById(
      "pure-core-report-box"
    );

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "pure-core-report-box";

    box.style.background =
      "#071827";

    box.style.color =
      "white";

    box.style.padding =
      "12px";

    box.style.margin =
      "12px 0";

    box.style.borderRadius =
      "12px";

    box.style.fontSize =
      "13px";

    document.body.appendChild(
      box
    );
  }

  box.innerHTML = `

    <div style="
      font-size:20px;
      font-weight:bold;
      color:#22c55e;
      margin-bottom:12px;
    ">
      🧬 تقرير النواة النقية للباء
    </div>

    <div>
      الحرف:
      <b>${result.phoneme}</b>
    </div>

    <div>
      عدد النطاقات:
      <b>${result.bandCount}</b>
    </div>

    <hr style="
      border-color:#1f2937;
      margin:14px 0;
    ">

    ${result.bands.map(function (band) {

      return `

        <div style="
          background:#0f766e;
          padding:10px;
          border-radius:10px;
          margin-bottom:10px;
        ">

          <div>
            النطاق:
            <b>
              ${band.from}Hz
              →
              ${band.to}Hz
            </b>
          </div>

          <div>
            المركز:
            <b>
              ${band.center}Hz
            </b>
          </div>

          <div>
            الثبات:
            <b>
              ${Math.round(
                band.stability * 100
              )}%
            </b>
          </div>

          <div>
            القوة:
            <b>
              ${band.power}
            </b>
          </div>

        </div>
      `;

    }).join("")}
  `;
}

// ======================================
// متوسط
// ======================================

function average(arr) {

  if (!arr.length) {
    return 0;
  }

  return (
    arr.reduce(function (a, b) {

      return a + b;

    }, 0) / arr.length
  );
}

// ======================================
// تقريب
// ======================================

function round(num) {

  return Number(
    num.toFixed(4)
  );
}
