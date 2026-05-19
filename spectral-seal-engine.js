// ================================
// spectral-seal-engine.js
// محرك الختم الطيفي — الباء الساكنة V2
// ================================

console.log("🌈 spectral-seal-engine.js جاهز — V2");

// ======================================
// تشغيل محرك الختم الطيفي
// ======================================

async function runSpectralSealEngine() {

  try {

    showLoading("جاري بناء الختم الطيفي للباء...");

    await waitForUI();

    const burstSaved =
      localStorage.getItem("ba_burst_signature");

    if (!burstSaved) {

      hideLoading();

      alert(
        "شغّل أولًا: 💥 استخراج انفجار الباء"
      );

      return;
    }

    const burstResult =
      JSON.parse(burstSaved);

    const result =
      await buildSpectralSeal(
        BA_COMMON_PAYLOAD_KEYS,
        burstResult
      );

    console.log(
      "🌈 نتيجة الختم الطيفي:",
      result
    );

    localStorage.setItem(
      "ba_spectral_seal",
      JSON.stringify(result, null, 2)
    );

    renderSpectralSealReport(result);

    hideLoading();

    alert(
      "تم بناء الختم الطيفي للباء\n" +
      "مركز الطيف: " +
      result.averageCentroid.toFixed(2) +
      " Hz\n" +
      "الثقة: " +
      result.confidence.toFixed(4)
    );

  } catch (err) {

    hideLoading();

    console.error(
      "❌ فشل بناء الختم الطيفي",
      err
    );

    alert(
      "فشل بناء الختم الطيفي:\n" +
      err.message
    );
  }
}


// ======================================
// بناء الختم الطيفي
// ======================================

async function buildSpectralSeal(
  keys,
  burstResult
) {

  const samples = [];

  for (const key of keys) {

    await waitForUI();

    const blob =
      await getAudioPromise(key);

    if (!blob) {

      throw new Error(
        "الصوت غير موجود: " + key
      );
    }

    const decoded =
      await decodeBlobToMono(blob);

    const burstInfo =
      burstResult.samples.find(function (s) {

        return s.key === key;

      });

    if (!burstInfo) {
      continue;
    }

    const segment =
      sliceAudioSegment(
        decoded.samples,
        decoded.sampleRate,
        burstInfo.burst.startTime,
        burstInfo.burst.endTime
      );

    const spectrum =
      extractSpectrum(
        segment,
        decoded.sampleRate
      );

    const centroid =
      spectralCentroid(spectrum);

    const spread =
      spectralSpread(
        spectrum,
        centroid
      );

    const peaks =
      findSpectralPeaks(
        spectrum,
        5
      );

    samples.push({

      key,

      centroid,

      spread,

      peaks,

      spectrum
    });
  }

  if (!samples.length) {

    throw new Error(
      "لم يتم استخراج أي عينة طيفية"
    );
  }

  const averageCentroid =
    average(
      samples.map(function (s) {

        return s.centroid;

      })
    );

  const averageSpread =
    average(
      samples.map(function (s) {

        return s.spread;

      })
    );

  const confidence =
    calcSpectralSealConfidence(samples);

  return {

    method:
      "Spectral Seal Engine V2",

    phoneme: "بْ",

    averageCentroid,

    averageSpread,

    confidence,

    colorLabel:
      describeSpectralColor(
        averageCentroid,
        averageSpread
      ),

    samples: samples.map(function (s) {

      return {

        key: s.key,

        centroid:
          round(s.centroid),

        spread:
          round(s.spread),

        peaks: s.peaks
      };

    })
  };
}


// ======================================
// اقتطاع مقطع الانفجار
// ======================================

function sliceAudioSegment(
  samples,
  sampleRate,
  startTime,
  endTime
) {

  const start =
    Math.max(
      0,
      Math.floor(startTime * sampleRate)
    );

  const end =
    Math.min(
      samples.length,
      Math.floor(endTime * sampleRate)
    );

  return samples.slice(start, end);
}


// ======================================
// استخراج الطيف
// ======================================

function extractSpectrum(
  segment,
  sampleRate
) {

  const size =
    nextPowerOfTwo(segment.length);

  const spectrum = [];

  for (let k = 0; k < size / 2; k++) {

    let real = 0;
    let imag = 0;

    for (let n = 0; n < segment.length; n++) {

      const angle =
        (2 * Math.PI * k * n) / size;

      const windowed =
        segment[n] *
        hann(n, segment.length);

      real +=
        windowed * Math.cos(angle);

      imag -=
        windowed * Math.sin(angle);
    }

    const magnitude =
      Math.sqrt(
        real * real +
        imag * imag
      );

    const freq =
      (k * sampleRate) / size;

    spectrum.push({

      freq,

      magnitude
    });
  }

  return spectrum;
}


// ======================================
// مركز الطيف
// ======================================

function spectralCentroid(
  spectrum
) {

  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {

    weighted +=
      bin.freq * bin.magnitude;

    total +=
      bin.magnitude;
  });

  return total
    ? weighted / total
    : 0;
}


// ======================================
// انتشار الطيف
// ======================================

function spectralSpread(
  spectrum,
  centroid
) {

  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {

    const diff =
      bin.freq - centroid;

    weighted +=
      diff * diff * bin.magnitude;

    total +=
      bin.magnitude;
  });

  return total
    ? Math.sqrt(weighted / total)
    : 0;
}


// ======================================
// القمم الطيفية
// ======================================

function findSpectralPeaks(
  spectrum,
  count
) {

  return spectrum

    .filter(function (bin) {

      return (
        bin.freq > 80 &&
        bin.freq < 6000
      );

    })

    .sort(function (a, b) {

      return (
        b.magnitude - a.magnitude
      );

    })

    .slice(0, count)

    .map(function (bin) {

      return {

        freq:
          round(bin.freq),

        magnitude:
          round(bin.magnitude)
      };

    });
}


// ======================================
// الثقة الطيفية
// ======================================

function calcSpectralSealConfidence(
  samples
) {

  if (samples.length < 2) {
    return 0;
  }

  const centroids =
    samples.map(function (s) {

      return s.centroid;

    });

  const spreads =
    samples.map(function (s) {

      return s.spread;

    });

  const centroidScore =
    1 / (
      1 +
      variance(centroids) / 100000
    );

  const spreadScore =
    1 / (
      1 +
      variance(spreads) / 100000
    );

  return (
    centroidScore +
    spreadScore
  ) / 2;
}


// ======================================
// اللون الطيفي
// ======================================

function describeSpectralColor(
  centroid,
  spread
) {

  if (centroid < 900) {

    return "دافئ منخفض";
  }

  if (centroid < 1800) {

    return "متوسط مستقر";
  }

  if (centroid < 3000) {

    return "حاد متوسط";
  }

  return "حاد عالٍ";
}


// ======================================
// رسم التقرير
// ======================================

function renderSpectralSealReport(
  result
) {

  let box =
    document.getElementById(
      "spectral-seal-report-box"
    );

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "spectral-seal-report-box";

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
      document.getElementById("common-payload-report") ||
      document.getElementById("unitList") ||
      document.getElementById("recordView") ||
      document.body;

    if (target === document.body) {

      document.body.appendChild(box);

    } else if (target.id === "unitList") {

      target.parentNode.insertBefore(
        box,
        target
      );

    } else {

      target.parentNode.insertBefore(
        box,
        target
      );

    }
  }

  box.style.display = "block";

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  box.innerHTML = `

    <div style="
      font-weight:bold;
      color:#38bdf8;
      margin-bottom:8px;
      font-size:15px;
    ">
      🌈 تقرير الختم الطيفي للباء
    </div>

    <div>
      الحرف:
      <b>${result.phoneme}</b>
    </div>

    <div>
      مركز الطيف:
      <b>
        ${result.averageCentroid.toFixed(2)}
        Hz
      </b>
    </div>

    <div>
      انتشار الطيف:
      <b>
        ${result.averageSpread.toFixed(2)}
      </b>
    </div>

    <div>
      اللون الطيفي:
      <b>
        ${result.colorLabel}
      </b>
    </div>

    <div>
      الثقة:
      <b>
        ${result.confidence.toFixed(4)}
      </b>
    </div>

    <hr style="
      border-color:#374151;
    ">

    ${result.samples.map(function (s) {

      return `

        <div style="
          background:#1f2937;
          padding:8px;
          margin:6px 0;
          border-radius:8px;
        ">

          <div>
            <b>${s.key}</b>
          </div>

          <div>
            centroid:
            ${s.centroid} Hz
          </div>

          <div>
            spread:
            ${s.spread}
          </div>

          <div>
            peaks:
            ${s.peaks.map(function (p) {

              return p.freq + "Hz";

            }).join(" / ")}
          </div>

        </div>
      `;

    }).join("")}
  `;
}


// ======================================
// شاشة انتظار
// ======================================

function showLoading(text) {

  let box =
    document.getElementById("global-loading");

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "global-loading";

    box.style.position =
      "fixed";

    box.style.top =
      "0";

    box.style.left =
      "0";

    box.style.right =
      "0";

    box.style.bottom =
      "0";

    box.style.background =
      "rgba(0,0,0,0.75)";

    box.style.zIndex =
      "99999";

    box.style.display =
      "flex";

    box.style.alignItems =
      "center";

    box.style.justifyContent =
      "center";

    box.style.color =
      "white";

    box.style.fontSize =
      "20px";

    box.style.textAlign =
      "center";

    box.style.padding =
      "20px";

    document.body.appendChild(box);
  }

  box.innerHTML =
    "⏳ " + text;

  box.style.display =
    "flex";
}


function hideLoading() {

  const box =
    document.getElementById("global-loading");

  if (box) {

    box.style.display =
      "none";
  }
}


function waitForUI() {

  return new Promise(function (resolve) {

    setTimeout(resolve, 40);

  });
}


// ======================================
// نافذة هان
// ======================================

function hann(
  n,
  length
) {

  return (
    0.5 *
    (
      1 -
      Math.cos(
        (2 * Math.PI * n) /
        (length - 1)
      )
    )
  );
}


// ======================================
// أقرب قوة 2
// ======================================

function nextPowerOfTwo(n) {

  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


// ======================================
// تقريب
// ======================================

function round(num) {

  return Number(
    num.toFixed(4)
  );
}
