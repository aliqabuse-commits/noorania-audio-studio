// ================================
// payload-extractor-engine.js
// محرك استخراج المحمول الحقيقي — الباء V1
// ================================

console.log("🚀 payload-extractor-engine.js جاهز");

async function runPayloadExtractorEngine() {
  try {
    const coreSaved = localStorage.getItem("ba_pure_core");

    if (!coreSaved) {
      alert("شغّل أولًا: 🧬 تنقية النواة المشتركة");
      return;
    }

    if (!wavesurfer || !wsRegions) {
      alert("لا يوجد صوت ظاهر لاستخراج المحمول");
      return;
    }

    const filenameEl = document.getElementById("filename");
    const currentKey = filenameEl ? filenameEl.innerText.trim() : "current";

    const blob = await getVisibleAudioBlobForPayload(currentKey);

    if (!blob) {
      alert("لم يتم العثور على صوت الوحدة الحالية");
      return;
    }

    showPayloadLoading("جاري استخراج المحمول الحقيقي...");

    const core = JSON.parse(coreSaved);
    const decoded = await decodeBlobToMono(blob);

    const result = extractTruePayload(
      decoded.samples,
      decoded.sampleRate,
      core,
      currentKey
    );

    localStorage.setItem(
      "ba_true_payload_result",
      JSON.stringify(result, null, 2)
    );

    renderTruePayloadReport(result);
    showTruePayloadRegion(result);

    hidePayloadLoading();

    alert(
      "تم استخراج المحمول الحقيقي\n" +
      "البداية: " + result.start.toFixed(4) + "\n" +
      "النهاية: " + result.end.toFixed(4) + "\n" +
      "الثقة: " + result.confidence.toFixed(4)
    );

  } catch (err) {
    hidePayloadLoading();
    console.error("❌ فشل استخراج المحمول الحقيقي", err);
    alert("فشل استخراج المحمول الحقيقي:\n" + err.message);
  }
}

function getVisibleAudioBlobForPayload(key) {
  return new Promise(function (resolve) {
    const current = getCurrentAudioBlob && getCurrentAudioBlob();

    if (current) {
      resolve(current);
      return;
    }

    getAudio(key, function (blob) {
      resolve(blob);
    });
  });
}

function extractTruePayload(samples, sampleRate, core, currentKey) {
  const frameSize = Math.floor(sampleRate * 0.020);
  const hopSize = Math.floor(sampleRate * 0.005);

  const frames = [];

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const frame = samples.slice(start, start + frameSize);
    const spectrum = extractSpectrum(frame, sampleRate);

    const score = scoreFrameAgainstPureCore(
      spectrum,
      core.bands || []
    );

    frames.push({
      startSample: start,
      endSample: start + frameSize,
      time: start / sampleRate,
      score
    });
  }

  if (!frames.length) {
    throw new Error("لم يتم استخراج إطارات كافية");
  }

  const maxScore = Math.max.apply(
    null,
    frames.map(function (f) {
      return f.score;
    })
  );

  const threshold = maxScore * 0.55;

  let bestIndex = 0;

  frames.forEach(function (f, i) {
    if (f.score > frames[bestIndex].score) {
      bestIndex = i;
    }
  });

  let startIndex = bestIndex;
  while (
    startIndex > 0 &&
    frames[startIndex].score >= threshold
  ) {
    startIndex--;
  }

  let endIndex = bestIndex;
  while (
    endIndex < frames.length - 1 &&
    frames[endIndex].score >= threshold
  ) {
    endIndex++;
  }

  const startTime = frames[startIndex].startSample / sampleRate;
  const endTime = frames[endIndex].endSample / sampleRate;

  const confidence = Math.min(1, maxScore);

  return {
    method: "True Payload Extractor V1",
    phoneme: "بْ",
    file: currentKey,
    start: roundPayload(startTime),
    end: roundPayload(endTime),
    duration: roundPayload(endTime - startTime),
    peakTime: roundPayload(frames[bestIndex].time),
    confidence: roundPayload(confidence),
    maxScore: roundPayload(maxScore),
    threshold: roundPayload(threshold),
    frameCount: frames.length
  };
}

function scoreFrameAgainstPureCore(spectrum, bands) {
  if (!bands.length) return 0;

  const scores = bands.map(function (band) {
    const power = payloadBandPower(
      spectrum,
      band.from,
      band.to
    );

    const ref = band.power || 1;

    const ratio = power / ref;

    return Math.max(
      0,
      Math.min(
        1,
        ratio > 1 ? 1 / ratio : ratio
      )
    );
  });

  return averagePayload(scores);
}

function payloadBandPower(spectrum, from, to) {
  const bins = spectrum.filter(function (bin) {
    return bin.freq >= from && bin.freq < to;
  });

  if (!bins.length) return 0;

  return averagePayload(
    bins.map(function (bin) {
      return bin.magnitude;
    })
  );
}

function showTruePayloadRegion(result) {
  if (!wsRegions) return;

  removeOldTruePayloadRegion();

  wsRegions.addRegion({
    id: "truePayload",
    start: result.start,
    end: result.end,
    color: "rgba(34, 197, 94, 0.45)",
    drag: true,
    resize: true
  });

  wsRegions.addRegion({
    id: "truePayloadPeak",
    start: Math.max(0, result.peakTime - 0.008),
    end: result.peakTime + 0.008,
    color: "rgba(14, 165, 233, 0.70)",
    drag: false,
    resize: false
  });
}

function removeOldTruePayloadRegion() {
  if (!wsRegions) return;

  wsRegions.getRegions().forEach(function (region) {
    if (
      region.id === "truePayload" ||
      region.id === "truePayloadPeak"
    ) {
      region.remove();
    }
  });
}

function renderTruePayloadReport(result) {
  let box = document.getElementById("true-payload-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "true-payload-report-box";

    box.style.background = "#052e16";
    box.style.color = "white";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "12px";
    box.style.fontSize = "13px";

    const target =
      document.getElementById("pure-core-report-box") ||
      document.getElementById("spectral-seal-report-box") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.innerHTML = `
    <div style="font-size:18px;font-weight:bold;color:#22c55e;margin-bottom:10px;">
      🚀 تقرير استخراج المحمول الحقيقي
    </div>

    <div>الحرف: <b>${result.phoneme}</b></div>
    <div>الملف: <b>${result.file}</b></div>
    <div>البداية: <b>${result.start}</b></div>
    <div>النهاية: <b>${result.end}</b></div>
    <div>المدة: <b>${result.duration}</b></div>
    <div>الذروة: <b>${result.peakTime}</b></div>
    <div>الثقة: <b>${result.confidence}</b></div>
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function showPayloadLoading(text) {
  let box = document.getElementById("global-loading");

  if (!box) {
    box = document.createElement("div");
    box.id = "global-loading";

    box.style.position = "fixed";
    box.style.top = "0";
    box.style.left = "0";
    box.style.right = "0";
    box.style.bottom = "0";
    box.style.background = "rgba(0,0,0,0.75)";
    box.style.zIndex = "99999";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.color = "white";
    box.style.fontSize = "20px";
    box.style.textAlign = "center";
    box.style.padding = "20px";

    document.body.appendChild(box);
  }

  box.innerHTML = "⏳ " + text;
  box.style.display = "flex";
}

function hidePayloadLoading() {
  const box = document.getElementById("global-loading");

  if (box) {
    box.style.display = "none";
  }
}

function averagePayload(arr) {
  if (!arr.length) return 0;

  return arr.reduce(function (a, b) {
    return a + b;
  }, 0) / arr.length;
}

function roundPayload(num) {
  return Number(num.toFixed(4));
}
