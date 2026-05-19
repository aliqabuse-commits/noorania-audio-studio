// ================================
// spectral-seal-engine.js
// محرك الختم الطيفي — الباء الساكنة V1
// ================================

console.log("🌈 spectral-seal-engine.js جاهز");

// ======================================
// تشغيل محرك الختم الطيفي
// ======================================

async function runSpectralSealEngine() {

  try {

    const burstSaved =
      localStorage.getItem("ba_burst_signature");

    if (!burstSaved) {

      alert(
        "شغّل أولًا: 💥 استخراج انفجار الباء"
      );

      return;
    }

    const burstResult = JSON.parse(burstSaved);

    const result = await buildSpectralSeal(
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

    alert(
      "تم بناء الختم الطيفي للباء\n" +
      "مركز الطيف: " +
      result.averageCentroid.toFixed(2) +
      " Hz\n" +
      "الثقة: " +
      result.confidence.toFixed(4)
    );

  } catch (err) {

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

    const blob = await getAudioPromise(key);

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

    const segment = sliceAudioSegment(
      decoded.samples,
      decoded.sampleRate,
      burstInfo.burst.startTime,
      burstInfo.burst.endTime
    );

    const spectrum = extractSpectrum(
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

  const averageCentroid = average(

    samples.map(function (s) {

      return s.centroid;

    })

  );

  const averageSpread = average(

    samples.map(function (s) {

      return s.spread;

    })

  );

  const confidence =
    calcSpectralSealConfidence(samples);

  return {

    method:
      "Spectral Seal Engine V1",

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

    box = document.createElement("div");

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

    document.body.appendChild(box);
  }

  box.style.display = "block";

  box.innerHTML = `

    <div style="
      font-weight:bold;
      color:#38bdf8;
      margin-bottom:8px;
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
