// ================================
// phoneme-match-engine.js
// محرك الفصل بالجِينوم المركزي — 
// ملتزم بمرجع المسميات السيادي
// ================================

console.log("🎯 phoneme-match-engine.js جاهز V3.3");

function getAvailablePhonemeKeysForMatch() {
  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    return Object.keys(PHONEME_LETTER_DEFINITIONS);
  }

  return ["ba", "qaf"];
}

async function startPhonemeMatchTest(targetKey) {
  try {
    const identities = getAvailablePhonemeKeysForMatch();
    const availableIdentities = [];

    for (const key of identities) {
      const identity = loadCognitiveIdentity(key);

      if (identity) {
        availableIdentities.push(identity);
      }
    }

    if (!availableIdentities.length) {
      alert(
        "لا توجد جينومات مركزية محفوظة.\n\n" +
        "ابنِ أولًا الجينومات المركزية للحروف."
      );
      return;
    }

    alert(
      "سيبدأ اختبار الفصل بالجِينوم المركزي.\n\n" +
      "سجّل الآن صوت الحرف."
    );

    const blob = await recordMatchSample();

    if (!blob) {
      alert("فشل تسجيل عينة الاختبار");
      return;
    }

    const decoded = await decodeCognitiveBlob(blob);

    const timeline = buildCognitiveTimeline(
      decoded.samples,
      decoded.sampleRate
    );

    const phases = detectCognitivePhases(timeline);

    const summary = summarizeCognitiveTimeline(
      timeline,
      phases
    );

    const results = availableIdentities.map(function (identity) {
      return {
        key: identity.phonemeKey,
        phoneme: identity.phoneme,
        label: identity.label,
        color: identity.color,
        distance: compareSummaryWithCognitiveGenome(
          summary,
          identity.genome
        )
      };
    });

    results.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const winner = results[0];
    const second = results[1] || null;

    const margin = second
      ? second.distance - winner.distance
      : 0;

    const decision = classifySeparationDecision(
      winner,
      second,
      margin
    );

    const actualKey = askActualSpokenKey();

    if (!actualKey) {
      alert("لم يتم حفظ النتيجة لأن الحرف المنطوق لم يُحدد.");
      return;
    }

    saveCognitiveMatchResult(
      targetKey,
      actualKey,
      winner,
      results,
      decision,
      margin
    );

    let report =
      "🎯 نتيجة اختبار الفصل بالجِينوم المركزي\n\n";

    report +=
      "زر الاختبار: " +
      targetKey +
      "\n";

    report +=
      "المنطوق فعليًا: " +
      actualKey +
      "\n";

    report +=
      "العينة أقرب إلى: " +
      winner.label +
      " (" +
      winner.phoneme +
      ")\n\n";

    results.forEach(function (r, index) {
      report +=
        (index + 1) +
        ") " +
        r.label +
        " (" +
        r.phoneme +
        ")" +
        " → distance = " +
        r.distance.toFixed(4) +
        "\n";
    });

    report +=
      "\nهامش الفصل: " +
      margin.toFixed(4) +
      "\n";

    report +=
      "قرار الفصل: " +
      decision.label +
      "\n\n";

    report += decision.note;

    alert(report);

    console.log("🎯 COGNITIVE MATCH SAMPLE SUMMARY:", summary);
    console.log("🎯 COGNITIVE MATCH RESULTS:", results);

  } catch (err) {
    console.error("❌ فشل اختبار الفصل بالجِينوم المركزي", err);

    alert(
      "فشل اختبار الفصل بالجِينوم المركزي:\n" +
      err.message
    );
  }
}

function loadCognitiveIdentity(key) {
  try {
    const raw = localStorage.getItem(key + "_cognitive_identity");

    if (!raw) return null;

    return JSON.parse(raw);

  } catch (err) {
    console.error("❌ فشل تحميل الجينوم:", key, err);
    return null;
  }
}

async function recordMatchSample() {
  return new Promise(async function (resolve) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm"
        });

        resolve(blob);
      };

      recorder.start();

      alert(
        "🎙 بدأ التسجيل الآن.\n\n" +
        "سيتم الإيقاف تلقائيًا بعد ثانيتين."
      );

      setTimeout(function () {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 2000);

    } catch (err) {
      console.error("❌ فشل التسجيل", err);
      resolve(null);
    }
  });
}

function compareSummaryWithCognitiveGenome(summary, genome) {
  if (!summary || !genome) {
    return Infinity;
  }

  let total = 0;

  total += weightedNormalizedDistance(summary.meanEnergy, genome.energy.mean, genome.energy.variance, 1.0);
  total += weightedNormalizedDistance(summary.meanCentroid, genome.centroid.mean, genome.centroid.variance, 1.5);
  total += weightedNormalizedDistance(summary.meanSpread, genome.spread.mean, genome.spread.variance, 1.2);
  total += weightedNormalizedDistance(summary.meanZcr, genome.zcr.mean, genome.zcr.variance, 0.8);
  total += weightedNormalizedDistance(summary.burstEnergy, genome.burstEnergy.mean, genome.burstEnergy.variance, 1.3);
  total += weightedNormalizedDistance(summary.burstCentroid, genome.burstCentroid.mean, genome.burstCentroid.variance, 1.4);
  total += weightedNormalizedDistance(summary.burstSpread, genome.burstSpread.mean, genome.burstSpread.variance, 1.1);
  total += weightedNormalizedDistance(summary.energyMovement, genome.energyMovement.mean, genome.energyMovement.variance, 1.1);
  total += weightedNormalizedDistance(summary.spectralMovement, genome.spectralMovement.mean, genome.spectralMovement.variance, 1.5);

  return total;
}

function weightedNormalizedDistance(value, mean, variance, weight) {
  value = Number(value || 0);
  mean = Number(mean || 0);
  variance = Number(variance || 0);
  weight = Number(weight || 1);

  const tolerance =
    Math.sqrt(variance) ||
    Math.abs(mean) * 0.15 ||
    1;

  return (
    Math.abs(value - mean) / tolerance
  ) * weight;
}

function classifySeparationDecision(winner, second, margin) {
  if (!second) {
    return {
      label: "غير كافٍ للمقارنة",
      note: "يوجد جينوم واحد فقط، لذلك لا نستطيع قياس الفصل الحقيقي."
    };
  }

  const ratio =
    second.distance / Math.max(winner.distance, 0.0001);

  if (margin > 3 || ratio > 1.6) {
    return {
      label: "فصل قوي ✅",
      note: "العينة بعيدة بوضوح عن الحرف الثاني، وهذا مؤشر جيد على أن الجينوم يساعد في الفصل."
    };
  }

  if (margin > 1 || ratio > 1.25) {
    return {
      label: "فصل متوسط ⚠️",
      note: "العينة أقرب إلى الحرف الفائز، لكن المسافة ليست كبيرة بما يكفي للاطمئنان الكامل."
    };
  }

  return {
    label: "فصل ملتبس ❌",
    note: "الجينومات قريبة من العينة. نحتاج تحسين التسجيل أو تقوية الجينوم أو إضافة طبقات مقارنة زمنية أقوى."
  };
}

function askActualSpokenKey() {
  const keys = getAvailablePhonemeKeysForMatch();

  let message =
    "ما الحرف الذي نطقته فعليًا؟\n\n" +
    "اكتب أحد المفاتيح التالية:\n\n";

  keys.forEach(function (key) {
    const def =
      typeof PHONEME_LETTER_DEFINITIONS !== "undefined"
        ? PHONEME_LETTER_DEFINITIONS[key]
        : null;

    message +=
      key +
      " = " +
      (def ? def.name || def.letter : key) +
      "\n";
  });

  const answer = prompt(message);

  if (!answer) return null;

  const key = answer.trim().toLowerCase();

  if (keys.includes(key)) {
    return key;
  }

  alert(
    "قيمة غير صحيحة.\n\n" +
    "اكتب أحد المفاتيح الظاهرة فقط."
  );

  return null;
}

function saveCognitiveMatchResult(
  buttonKey,
  actualKey,
  winner,
  results,
  decision,
  margin
) {
  const logKey = "cognitive_match_results_log";

  const oldLog = JSON.parse(
    localStorage.getItem(logKey) || "[]"
  );

  oldLog.push({
    buttonKey: buttonKey,
    actualKey: actualKey,
    detectedKey: winner.key,
    detectedLabel: winner.label,
    detectedPhoneme: winner.phoneme,
    isCorrect: actualKey === winner.key,
    margin: Number(margin.toFixed(4)),
    decision: decision.label,
    results: results.map(function (r) {
      return {
        key: r.key,
        label: r.label,
        phoneme: r.phoneme,
        distance: Number(r.distance.toFixed(4))
      };
    }),
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    logKey,
    JSON.stringify(oldLog, null, 2)
  );

  console.log(
    "📊 تم حفظ نتيجة اختبار الفصل:",
    oldLog[oldLog.length - 1]
  );

  renderMatchResultsLog(buttonKey);
}

function renderMatchResultsLog() {
  const raw = localStorage.getItem("cognitive_match_results_log");

  const results = JSON.parse(raw || "[]");

  const correctResults = results.filter(function (r) {
    return r.actualKey === r.detectedKey;
  });

  const accuracy = results.length
    ? ((correctResults.length / results.length) * 100).toFixed(2)
    : "0.00";

  const avgCorrectMargin = correctResults.length
    ? (
        correctResults.reduce(function (sum, r) {
          return sum + Number(r.margin || 0);
        }, 0) / correctResults.length
      ).toFixed(4)
    : "0.0000";

  let box = document.getElementById("match-results-log-box");

  if (!box) {
    box = document.createElement("div");

    box.id = "match-results-log-box";
    box.style.background = "#08111f";
    box.style.color = "white";
    box.style.border = "1px solid #334155";
    box.style.borderRadius = "14px";
    box.style.padding = "14px";
    box.style.margin = "14px 0";

    const target =
      document.getElementById("perceptualTrainingView") ||
      document.body;

    target.appendChild(box);
  }

  let html = `
    <h3 style="margin-top:0;">
      📊 سجل اختبارات الفصل
    </h3>
  `;

  if (!results.length) {
    html += `
      <div>
        لا توجد نتائج محفوظة بعد.
      </div>
    `;

    box.innerHTML = html;
    return;
  }

  results.forEach(function (r, index) {
    const ok =
  r.actualKey &&
  r.detectedKey &&
function renderMatchResultsLog(filterKey) {
  const raw = localStorage.getItem("cognitive_match_results_log");
  const allResults = JSON.parse(raw || "[]");

  const results = filterKey
    ? allResults.filter(function (r) {
        return r.buttonKey === filterKey;
      })
    : allResults;

  const correctResults = results.filter(function (r) {
    return r.actualKey === r.detectedKey;
  });

  const accuracy = results.length
    ? ((correctResults.length / results.length) * 100).toFixed(2)
    : "0.00";

  const avgCorrectMargin = correctResults.length
    ? (
        correctResults.reduce(function (sum, r) {
          return sum + Number(r.margin || 0);
        }, 0) / correctResults.length
      ).toFixed(4)
    : "0.0000";

  let box = document.getElementById("match-results-log-box");

  if (!box) return;

  let html = `
    <h3 style="margin-top:0;">
      📊 سجل اختبارات الفصل
      ${filterKey ? " — " + filterKey : ""}
    </h3>
  `;

  if (!results.length) {
    box.innerHTML =
function renderMatchResultsLog(filterKey) {
  const raw = localStorage.getItem("cognitive_match_results_log");
  const allResults = JSON.parse(raw || "[]");

  const results = filterKey
    ? allResults.filter(function (r) {
        return r.buttonKey === filterKey;
      })
    : allResults;

  const correctResults = results.filter(function (r) {
    return r.actualKey === r.detectedKey;
  });

  const accuracy = results.length
    ? ((correctResults.length / results.length) * 100).toFixed(2)
    : "0.00";

  const avgCorrectMargin = correctResults.length
    ? (
        correctResults.reduce(function (sum, r) {
          return sum + Number(r.margin || 0);
        }, 0) / correctResults.length
      ).toFixed(4)
    : "0.0000";

  const box = document.getElementById("match-results-log-box");

  if (!box) return;

  let html = `
    <h3 style="margin-top:0;">
      📊 سجل اختبارات الفصل
      ${filterKey ? " — " + filterKey : ""}
    </h3>
  `;

  if (!results.length) {
    box.innerHTML =
      html +
      `<div>لا توجد نتائج محفوظة لهذه الحقيبة بعد.</div>`;
    return;
  }

  results.forEach(function (r, index) {
    const ok =
      r.actualKey &&
      r.detectedKey &&
      r.actualKey === r.detectedKey;

    html += `
      <div style="
        background:#111827;
        padding:10px;
        border-radius:10px;
        margin:8px 0;
        border-left:5px solid ${ok ? "#22c55e" : "#ef4444"};
      ">
        <div>#${index + 1}</div>
        <div>زر الاختبار: <b>${r.buttonKey || "غير محدد"}</b></div>
        <div>المنطوق فعليًا: <b>${r.actualKey || "غير محدد"}</b></div>
        <div>المكتشف: <b>${r.detectedLabel}</b></div>
        <div>النتيجة: <b>${ok ? "✅ صحيح" : "❌ خطأ"}</b></div>
        <div>هامش الفصل: <b>${r.margin}</b></div>
        <div>القرار: <b>${r.decision}</b></div>
      </div>
    `;
  });

  html += `
    <div style="margin-top:18px;">
      نسبة النجاح لهذه الحقيبة:
      <b style="color:#22c55e;">${accuracy}%</b>
    </div>

    <div style="margin-top:8px;">
      متوسط هامش الفصل الصحيح:
      <b style="color:#38bdf8;">${avgCorrectMargin}</b>
    </div>

    <div style="margin-top:8px;">
      عدد اختبارات هذه الحقيبة:
      <b>${results.length}</b>
    </div>
  `;

  box.innerHTML = html;
}
function clearCognitiveMatchResultsLog() {
  localStorage.removeItem("cognitive_match_results_log");

  const box = document.getElementById("match-results-log-box");

  if (box) {
    box.innerHTML = `
      <h3 style="margin-top:0;">
        📊 سجل اختبارات الفصل
      </h3>
      <div>لا توجد نتائج محفوظة بعد.</div>
    `;
  }

  alert("تم حذف سجل اختبارات الفصل بنجاح.");
}

window.clearCognitiveMatchResultsLog =
  clearCognitiveMatchResultsLog;

console.log("🎯 محرك الفصل بالجِينوم المركزي جاهز ");
