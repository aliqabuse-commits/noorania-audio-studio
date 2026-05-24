// ================================
// phoneme-cognitive-engine.js
// المحرك الإدراكي المركزي للحرف — V3
// النسخة السيادية المستقرة
// ================================

console.log("🧠 phoneme-cognitive-engine.js جاهز V3");


// ======================================
// تحميل الصوت المخزن
// ======================================

async function getStoredAudio(fileName) {

  console.log("🔎 COGNITIVE LOAD:", fileName);

  if (typeof getAudioPromiseForMemory === "function") {

    const blob =
      await getAudioPromiseForMemory(
        fileName,
        3000
      );

    console.log(
      "✅ from getAudioPromiseForMemory:",
      fileName,
      blob
    );

    if (blob) return blob;
  }

  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName);

  console.log(
    "📦 from localStorage:",
    fileName,
    dataUrl
      ? dataUrl.substring(0, 40)
      : null
  );

  if (
    dataUrl &&
    dataUrl.startsWith("data:")
  ) {
    return cognitiveDataUrlToBlob(dataUrl);
  }

  throw new Error(
    "الصوت غير موجود: " + fileName
  );
}


// ======================================
// بناء الهوية الإدراكية المركزية
// ======================================

async function buildPhonemeCognitiveIdentity(
  phonemeKey
) {

  try {

    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!pack) {

      alert(
        "لا توجد حقيبة تدريب لهذا الحرف: " +
        phonemeKey
      );

      return null;
    }

    const memory =
      typeof getPhonemeMemory === "function"
        ? getPhonemeMemory(phonemeKey)
        : null;

    const colorBinding =
      typeof bindPhonemeToColor === "function"
        ? bindPhonemeToColor(
            pack.colorKey || phonemeKey
          )
        : null;

    const color = {

      hex:
        colorBinding?.hex ||
        memory?.color?.hex ||
        pack.colorHex ||
        "#38BDF8",

      name:
        colorBinding?.colorName ||
        memory?.color?.name ||
        memory?.colorName ||
        pack.colorName ||
        "Noorani Color"
    };

    const label =
      memory?.label ||
      pack.name ||
      phonemeKey;

    const phoneme =
      memory?.phoneme ||
      pack.letter ||
      phonemeKey;

    const units =
      pack.positions || [];

    if (!units.length) {

      alert(
        "حقيبة التدريب لا تحتوي وحدات"
      );

      return null;
    }

    const cognitiveUnits = [];

    for (const unit of units) {

      const blob =
        await getStoredAudio(unit.file);

      if (!blob) {

        throw new Error(
          "الصوت غير موجود: " + unit.file
        );
      }

      const decoded =
        await decodeCognitiveBlob(blob);

      const timeline =
        buildCognitiveTimeline(
          decoded.samples,
          decoded.sampleRate
        );

      const phases =
        detectCognitivePhases(timeline);

      const summary =
        summarizeCognitiveTimeline(
          timeline,
          phases
        );

      cognitiveUnits.push({

        text: unit.text,
        file: unit.file,
        role: unit.role,

        timeline,
        phases,
        summary
      });
    }

    const identity = {

      method:
        "Noorani Central Cognitive Engine V3",

      phonemeKey:
        phonemeKey,

      phoneme:
        phoneme,

      label:
        label,

      color:
        color,

      pack: {

        key:
          pack.key,

        letter:
          pack.letter,

        name:
          pack.name,

        traits:
          pack.traits
      },

      units:
        cognitiveUnits,

      genome:
        buildCognitiveGenome(
          cognitiveUnits
        ),

      createdAt:
        new Date().toISOString()
    };

    localStorage.setItem(
      phonemeKey +
      "_cognitive_identity",

      JSON.stringify(identity)
    );

    renderCognitiveReport(identity);

    alert(
      "تم بناء الهوية الإدراكية المركزية لحرف " +
      label +
      "\n\nتم حفظ الجينوم الإدراكي المركزي."
    );

    return identity;

  } catch (err) {

    console.error(
      "❌ فشل بناء الهوية الإدراكية المركزية",
      err
    );

    alert(
      "فشل بناء الهوية الإدراكية المركزية:\n" +
      err.message
    );

    return null;
  }
}


// ======================================
// قراءة الصوت
// ======================================

async function getCognitiveAudioBlob(
  fileName
) {

  const dataUrl =
    localStorage.getItem(
      "audio_" + fileName
    ) ||
    localStorage.getItem(fileName);

  if (
    !dataUrl ||
    !dataUrl.startsWith("data:")
  ) {
    return null;
  }

  return cognitiveDataUrlToBlob(dataUrl);
}


function cognitiveDataUrlToBlob(
  dataUrl
) {

  const parts =
    dataUrl.split(",");

  const meta =
    parts[0];

  const base64 =
    parts[1];

  const mimeMatch =
    meta.match(/data:(.*?);base64/);

  const mime =
    mimeMatch
      ? mimeMatch[1]
      : "audio/webm";

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(binary.length);

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return new Blob(
    [bytes],
    { type: mime }
  );
}


async function decodeCognitiveBlob(
  blob
) {

  const arrayBuffer =
    await blob.arrayBuffer();

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  const ctx =
    new AudioContextClass();

  const audioBuffer =
    await ctx.decodeAudioData(
      arrayBuffer
    );

  return {

    samples:
      audioBuffer.getChannelData(0),

    sampleRate:
      audioBuffer.sampleRate
  };
}


// ======================================
// بناء الخط الزمني
// ======================================

function buildCognitiveTimeline(
  samples,
  sampleRate
) {

  const frameSize =
    Math.floor(sampleRate * 0.010);

  const hopSize =
    Math.floor(sampleRate * 0.010);

  const timeline = [];

  for (
    let start = 0;
    start + frameSize <= samples.length;
    start += hopSize
  ) {

    const frame =
      samples.slice(
        start,
        start + frameSize
      );

    const energy =
      cognitiveRms(frame);

    const zcr =
      cognitiveZcr(frame);

    const spectrum =
      cognitiveSpectrum(
        frame,
        sampleRate
      );

    const centroid =
      cognitiveSpectralCentroid(
        spectrum
      );

    const spread =
      cognitiveSpectralSpread(
        spectrum,
        centroid
      );

    timeline.push({

      t:
        start / sampleRate,

      energy,
      zcr,
      centroid,
      spread
    });
  }

  return timeline;
}


// ======================================
// كشف المراحل الزمنية
// ======================================

function detectCognitivePhases(
  timeline
) {

  if (!timeline.length) {

    return {

      onset: null,
      burst: null,
      coreStart: null,
      coreEnd: null,
      tail: null
    };
  }

  const energies =
    timeline.map(function (f) {
      return f.energy;
    });

  const maxEnergy =
    Math.max.apply(
      null,
      energies
    );

  const threshold =
    maxEnergy * 0.18;

  let onsetIndex = 0;

  for (
    let i = 0;
    i < timeline.length;
    i++
  ) {

    if (
      timeline[i].energy >= threshold
    ) {
      onsetIndex = i;
      break;
    }
  }

  let burstIndex =
    onsetIndex;

  let maxRise = 0;

  for (
    let i = onsetIndex + 1;
    i < timeline.length;
    i++
  ) {

    const rise =
      timeline[i].energy -
      timeline[i - 1].energy;

    if (rise > maxRise) {

      maxRise = rise;
      burstIndex = i;
    }
  }

  let endIndex =
    timeline.length - 1;

  for (
    let i = timeline.length - 1;
    i >= 0;
    i--
  ) {

    if (
      timeline[i].energy >= threshold
    ) {
      endIndex = i;
      break;
    }
  }

  const coreStart =
    Math.min(
      burstIndex + 1,
      endIndex
    );

  const coreEnd =
    Math.max(
      coreStart,
      endIndex - 1
    );

  return {

    onset:
      timeline[onsetIndex]?.t || 0,

    burst:
      timeline[burstIndex]?.t || 0,

    coreStart:
      timeline[coreStart]?.t || 0,

    coreEnd:
      timeline[coreEnd]?.t || 0,

    tail:
      timeline[endIndex]?.t || 0,

    onsetIndex,
    burstIndex,

    coreStartIndex:
      coreStart,

    coreEndIndex:
      coreEnd,

    tailIndex:
      endIndex
  };
}


// ======================================
// تلخيص السلوك
// ======================================

function summarizeCognitiveTimeline(
  timeline,
  phases
) {

  const active =
    timeline.slice(
      phases.onsetIndex || 0,
      (
        phases.tailIndex ||
        timeline.length - 1
      ) + 1
    );

  const burstFrame =
    timeline[
      phases.burstIndex || 0
    ] || {};

  return {

    duration:
      active.length
        ? roundCognitive(
            active[
              active.length - 1
            ].t -
            active[0].t
          )
        : 0,

    meanEnergy:
      roundCognitive(
        avgCognitive(
          active.map(
            f => f.energy
          )
        )
      ),

    meanZcr:
      roundCognitive(
        avgCognitive(
          active.map(
            f => f.zcr
          )
        )
      ),

    meanCentroid:
      roundCognitive(
        avgCognitive(
          active.map(
            f => f.centroid
          )
        )
      ),

    meanSpread:
      roundCognitive(
        avgCognitive(
          active.map(
            f => f.spread
          )
        )
      ),

    burstEnergy:
      roundCognitive(
        burstFrame.energy || 0
      ),

    burstCentroid:
      roundCognitive(
        burstFrame.centroid || 0
      ),

    burstSpread:
      roundCognitive(
        burstFrame.spread || 0
      ),

    energyMovement:
      roundCognitive(
        movementCognitive(
          active.map(
            f => f.energy
          )
        )
      ),

    spectralMovement:
      roundCognitive(
        movementCognitive(
          active.map(
            f => f.centroid
          )
        )
      )
  };
}


// ======================================
// بناء الجينوم الإدراكي
// ======================================

function buildCognitiveGenome(
  units
) {

  const summaries =
    units.map(function (u) {
      return u.summary;
    });

  return {

    duration:
      statCognitive(
        summaries.map(
          s => s.duration
        )
      ),

    energy:
      statCognitive(
        summaries.map(
          s => s.meanEnergy
        )
      ),

    zcr:
      statCognitive(
        summaries.map(
          s => s.meanZcr
        )
      ),

    centroid:
      statCognitive(
        summaries.map(
          s => s.meanCentroid
        )
      ),

    spread:
      statCognitive(
        summaries.map(
          s => s.meanSpread
        )
      ),

    burstEnergy:
      statCognitive(
        summaries.map(
          s => s.burstEnergy
        )
      ),

    burstCentroid:
      statCognitive(
        summaries.map(
          s => s.burstCentroid
        )
      ),

    burstSpread:
      statCognitive(
        summaries.map(
          s => s.burstSpread
        )
      ),

    energyMovement:
      statCognitive(
        summaries.map(
          s => s.energyMovement
        )
      ),

    spectralMovement:
      statCognitive(
        summaries.map(
          s => s.spectralMovement
        )
      )
  };
}


// ======================================
// تحميل الجينوم المحفوظ
// ======================================

function loadCognitiveIdentity(
  key
) {

  try {

    const raw =
      localStorage.getItem(
        key +
        "_cognitive_identity"
      );

    if (!raw) return null;

    return JSON.parse(raw);

  } catch (err) {

    console.error(
      "❌ فشل تحميل الجينوم:",
      key,
      err
    );

    return null;
  }
}


// ======================================
// أدوات رياضية
// ======================================

function cognitiveRms(frame) {

  if (!frame.length) return 0;

  let sum = 0;

  for (
    let i = 0;
    i < frame.length;
    i++
  ) {
    sum +=
      frame[i] * frame[i];
  }

  return Math.sqrt(
    sum / frame.length
  );
}


function cognitiveZcr(frame) {

  if (!frame.length) return 0;

  let count = 0;

  for (
    let i = 1;
    i < frame.length;
    i++
  ) {

    if (
      (
        frame[i - 1] >= 0 &&
        frame[i] < 0
      ) ||
      (
        frame[i - 1] < 0 &&
        frame[i] >= 0
      )
    ) {
      count++;
    }
  }

  return count / frame.length;
}


function cognitiveSpectrum(
  frame,
  sampleRate
) {

  const size =
    nextPowerOfTwoCognitive(
      frame.length
    );

  const spectrum = [];

  for (
    let k = 0;
    k < size / 2;
    k++
  ) {

    let real = 0;
    let imag = 0;

    for (
      let n = 0;
      n < frame.length;
      n++
    ) {

      const angle =
        (
          2 *
          Math.PI *
          k *
          n
        ) / size;

      const windowed =
        frame[n] *
        hannCognitive(
          n,
          frame.length
        );

      real +=
        windowed *
        Math.cos(angle);

      imag -=
        windowed *
        Math.sin(angle);
    }

    spectrum.push({

      freq:
        (k * sampleRate) / size,

      magnitude:
        Math.sqrt(
          real * real +
          imag * imag
        )
    });
  }

  return spectrum;
}


function cognitiveSpectralCentroid(
  spectrum
) {

  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {

    weighted +=
      bin.freq *
      bin.magnitude;

    total +=
      bin.magnitude;
  });

  return total
    ? weighted / total
    : 0;
}


function cognitiveSpectralSpread(
  spectrum,
  centroid
) {

  let weighted = 0;
  let total = 0;

  spectrum.forEach(function (bin) {

    const d =
      bin.freq - centroid;

    weighted +=
      d *
      d *
      bin.magnitude;

    total +=
      bin.magnitude;
  });

  return total
    ? Math.sqrt(
        weighted / total
      )
    : 0;
}


function movementCognitive(
  values
) {

  if (values.length < 2) {
    return 0;
  }

  let sum = 0;

  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    sum += Math.abs(
      values[i] -
      values[i - 1]
    );
  }

  return (
    sum /
    (values.length - 1)
  );
}


function statCognitive(
  values
) {

  return {

    mean:
      roundCognitive(
        avgCognitive(values)
      ),

    variance:
      roundCognitive(
        varCognitive(values)
      ),

    min:
      roundCognitive(
        Math.min.apply(
          null,
          values
        )
      ),

    max:
      roundCognitive(
        Math.max.apply(
          null,
          values
        )
      )
  };
}


function avgCognitive(
  values
) {

  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      function (a, b) {
        return a + b;
      },
      0
    ) / values.length
  );
}


function varCognitive(
  values
) {

  if (!values.length) {
    return 0;
  }

  const avg =
    avgCognitive(values);

  return avgCognitive(

    values.map(function (v) {

      const d =
        v - avg;

      return d * d;
    })
  );
}


function hannCognitive(
  n,
  length
) {

  if (length <= 1) {
    return 1;
  }

  return 0.5 * (

    1 -

    Math.cos(
      (
        2 *
        Math.PI *
        n
      ) /
      (length - 1)
    )
  );
}


function nextPowerOfTwoCognitive(
  n
) {

  let p = 1;

  while (p < n) {
    p *= 2;
  }

  return p;
}


function roundCognitive(
  num
) {

  return Number(
    Number(num || 0)
      .toFixed(4)
  );
}


// ======================================
// تقرير مرئي
// ======================================

function renderCognitiveReport(
  identity
) {

  console.log(
    "🧠 الهوية الإدراكية:",
    identity
  );
}


// ======================================
// واجهات عامة
// ======================================

window.buildPhonemeCognitiveIdentity =
  buildPhonemeCognitiveIdentity;

window.loadCognitiveIdentity =
  loadCognitiveIdentity;

window.getStoredAudio =
  getStoredAudio;

console.log(
  "✅ phoneme-cognitive-engine.js اكتمل تحميله بالكامل V3"
);
