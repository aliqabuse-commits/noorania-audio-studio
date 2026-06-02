// ================================
// baa-identity-match-engine.js
// محرك مطابقة هوية الباء — V1
// ================================

console.log("🎯 baa-identity-match-engine.js جاهز");

// ======================================
// تشغيل مطابقة هوية الباء
// ======================================

async function runBaaIdentityMatchEngine() {

  try {

    const sealSaved =
      localStorage.getItem("ba_spectral_seal");

    if (!sealSaved) {
      alert("شغّل أولًا: 🌈 بناء الختم الطيفي للباء");
      return;
    }

    if (!wavesurfer || !wsRegions) {
      alert("لا يوجد تسجيل ظاهر للمطابقة");
      return;
    }

    const filenameEl =
      document.getElementById("filename");

    const currentKey =
      filenameEl ? filenameEl.innerText.trim() : "current";

    const currentBlob =
      await getVisibleAudioBlob(currentKey);

    if (!currentBlob) {
      alert("لم يتم العثور على صوت الوحدة الحالية");
      return;
    }

    showMatchLoading("جاري مطابقة هوية الباء...");

    const seal =
      JSON.parse(sealSaved);

    const decoded =
      await decodeBlobToMono(currentBlob);

    const result =
      await matchBaaIdentity(
        decoded.samples,
        decoded.sampleRate,
        seal,
        currentKey
      );

    localStorage.setItem(
      "ba_identity_match_result",
      JSON.stringify(result, null, 2)
    );

    renderBaaMatchReport(result);

    hideMatchLoading();

    alert(
      "تمت مطابقة هوية الباء\n" +
      "نسبة المطابقة: " +
      Math.round(result.finalScore * 100) +
      "%"
    );

  } catch (err) {

    hideMatchLoading();

    console.error(
      "❌ فشل محرك مطابقة هوية الباء",
      err
    );

    alert(
      "فشل مطابقة هوية الباء:\n" +
      err.message
    );
  }
}


// ======================================
// الحصول على الصوت الحالي
// ======================================

function getVisibleAudioBlob(key) {

  return new Promise(function (resolve) {

    const current =
      getCurrentAudioBlob &&
      getCurrentAudioBlob();

    if (current) {
      resolve(current);
      return;
    }

    getAudio(key, function (blob) {
      resolve(blob);
    });

  });
}


// ======================================
// مطابقة هوية الباء
// ======================================

async function matchBaaIdentity(
  samples,
  sampleRate,
  seal,
  currentKey
) {

  await waitMatchUI();

  const segment =
    extractLikelyBurstSegment(
      samples,
      sampleRate
    );

  const spectrum =
    extractSpectrum(
      segment.samples,
      sampleRate
    );

  const coreMatches =
    compareWithCommonCore(
      spectrum,
      seal.commonCore || []
    );

  const centroid =
    spectralCentroid(spectrum);

  const centroidScore =
    compareCentroid(
      centroid,
      seal.averageCentroid
    );

  const coreScore =
    average(
      coreMatches.map(function (m) {
        return m.score;
      })
    );

  const finalScore =
    (
      coreScore * 0.7 +
      centroidScore * 0.3
    );

  return {
    method: "Baa Identity Match Engine V1",
    target: "بْ",
    file: currentKey,

    finalScore,
    coreScore,
    centroidScore,

    detectedBurst: {
      start: round(segment.startTime),
      end: round(segment.endTime),
      peak: round(segment.peakTime)
    },

    centroid: round(centroid),
    referenceCentroid: round(seal.averageCentroid),

    coreMatches
  };
}


// ======================================
// استخراج انفجار مرشح من التسجيل الحالي
// ======================================

function extractLikelyBurstSegment(
  samples,
  sampleRate
) {

  const frameSize =
    Math.floor(sampleRate * 0.010);

  const hopSize =
    Math.floor(sampleRate * 0.003);

  const frames = [];

  for (
    let start = 0;
    start + frameSize < samples.length;
    start += hopSize
  ) {

    const frame =
      samples.slice(start, start + frameSize);

    const energy =
      calcRms(frame);

    frames.push({
      start,
      time: start / sampleRate,
      energy
    });
  }

  let peakIndex = 0;
  let peakEnergy = 0;

  frames.forEach(function (f, i) {
    if (f.energy > peakEnergy) {
      peakEnergy = f.energy;
      peakIndex = i;
    }
  });

  const startIndex =
    Math.max(0, peakIndex - 8);

  const endIndex =
    Math.min(
      frames.length - 1,
      peakIndex + 8
    );

  const startSample =
    frames[startIndex].start;

  const endSample =
    Math.min(
      samples.length,
      frames[endIndex].start + frameSize
    );

  return {
    samples:
      samples.slice(startSample, endSample),

    startTime:
      startSample / sampleRate,

    endTime:
      endSample / sampleRate,

    peakTime:
      frames[peakIndex].time
  };
}


// ======================================
// مقارنة مع النواة الطيفية المشتركة
// ======================================

function compareWithCommonCore(
  spectrum,
  commonCore
) {

  return commonCore.map(function (band) {

    const power =
      bandPower(
        spectrum,
        band.from,
        band.to
      );

    const refPower =
      band.avgPower || 0.0001;

    const ratio =
      power / refPower;

    const score =
      Math.max(
        0,
        Math.min(
          1,
          ratio > 1
            ? 1 / ratio
            : ratio
        )
      );

    return {
      from: band.from,
      to: band.to,
      power: round(power),
      reference: round(refPower),
      score: round(score)
    };

  });
}


function bandPower(
  spectrum,
  from,
  to
) {

  const bins =
    spectrum.filter(function (bin) {
      return (
        bin.freq >= from &&
        bin.freq < to
      );
    });

  if (!bins.length) {
    return 0;
  }

  return average(
    bins.map(function (bin) {
      return bin.magnitude;
    })
  );
}


// ======================================
// مقارنة مركز الطيف
// ======================================

function compareCentroid(
  centroid,
  reference
) {

  const diff =
    Math.abs(centroid - reference);

  return 1 / (
    1 + diff / 1000
  );
}


// ======================================
// تقرير المطابقة
// ======================================

function renderBaaMatchReport(result) {

  let box =
    document.getElementById(
      "baa-match-report-box"
    );

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "baa-match-report-box";

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
      document.getElementById("spectral-seal-report-box") ||
      document.getElementById("common-payload-report") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.style.display = "block";

  const percent =
    Math.round(result.finalScore * 100);

  const status =
    percent >= 75
      ? "مطابقة قوية"
      : percent >= 55
        ? "مطابقة متوسطة"
        : "مطابقة ضعيفة";

  box.innerHTML = `
    <div style="font-weight:bold;color:#facc15;margin-bottom:8px;font-size:15px;">
      🎯 تقرير مطابقة هوية الباء
    </div>

    <div>الملف: <b>${result.file}</b></div>
    <div>الهدف: <b>${result.target}</b></div>
    <div>النتيجة: <b>${percent}%</b> — ${status}</div>

    <hr style="border-color:#374151;">

    <div>تطابق النواة: <b>${Math.round(result.coreScore * 100)}%</b></div>
    <div>تطابق مركز الطيف: <b>${Math.round(result.centroidScore * 100)}%</b></div>

    <div>مركز التسجيل: <b>${result.centroid} Hz</b></div>
    <div>مركز المرجع: <b>${result.referenceCentroid} Hz</b></div>

    <hr style="border-color:#374151;">

    <div style="font-weight:bold;color:#22c55e;margin:8px 0;">
      مناطق النواة
    </div>

    ${result.coreMatches.map(function (m) {
      return `
        <div style="background:#1f2937;padding:7px;margin:5px 0;border-radius:7px;">
          ${m.from}Hz → ${m.to}Hz
          | تطابق: ${Math.round(m.score * 100)}%
          | قوة: ${m.power}
          | مرجع: ${m.reference}
        </div>
      `;
    }).join("")}
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ======================================
// شاشة انتظار
// ======================================

function showMatchLoading(text) {

  let box =
    document.getElementById(
      "global-loading"
    );

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


function hideMatchLoading() {

  const box =
    document.getElementById(
      "global-loading"
    );

  if (box) {
    box.style.display =
      "none";
  }
}


function waitMatchUI() {

  return new Promise(function (resolve) {
    setTimeout(resolve, 40);
  });
}
