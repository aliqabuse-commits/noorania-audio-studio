// ================================
// phoneme-match-engine.js
// محرك الفصل بالجِينوم المركزي — V3.1
// ================================

console.log("🎯 phoneme-match-engine.js جاهز V3.1");


// ======================================
// بدء اختبار مطابقة حرف عبر الجينوم المركزي
// ======================================

async function startPhonemeMatchTest(targetKey) {
  try {
    const identities = ["ba", "qa"];
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
        "ابنِ أولًا الجينوم المركزي للباء والقاف."
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

    report +=
      decision.note;

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


// ======================================
// تحميل الجينوم المركزي
// ======================================

function loadCognitiveIdentity(key) {
  try {
    const raw =
      localStorage.getItem(key + "_cognitive_identity");

    if (!raw) return null;

    return JSON.parse(raw);

  } catch (err) {
    console.error("❌ فشل تحميل الجينوم:", key, err);
    return null;
  }
}


// ======================================
// تسجيل عينة اختبار
// ======================================

async function recordMatchSample() {
  return new Promise(async function (resolve) {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      const chunks = [];

      const recorder =
        new MediaRecorder(stream);

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        const blob =
          new Blob(chunks, {
            type:
              recorder.mimeType ||
              "audio/webm"
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


// ======================================
// مقارنة ملخص العينة مع جينوم حرف
// ======================================

function compareSummaryWithCognitiveGenome(summary, genome) {
  let total = 0;

  total += weightedNormalizedDistance(
    summary.meanEnergy,
    genome.energy.mean,
    genome.energy.variance,
    1.0
  );

  total += weightedNormalizedDistance(
    summary.meanCentroid,
    genome.centroid.mean,
    genome.centroid.variance,
    1.5
  );

  total += weightedNormalizedDistance(
    summary.meanSpread,
    genome.spread.mean,
    genome.spread.variance,
    1.2
  );

  total += weightedNormalizedDistance(
    summary.meanZcr,
    genome.zcr.mean,
    genome.zcr.variance,
    0.8
  );

  total += weightedNormalizedDistance(
    summary.burstEnergy,
    genome.burstEnergy.mean,
    genome.burstEnergy.variance,
    1.3
  );

  total += weightedNormalizedDistance(
    summary.burstCentroid,
    genome.burstCentroid.mean,
    genome.burstCentroid.variance,
    1.4
  );

  total += weightedNormalizedDistance(
    summary.burstSpread,
    genome.burstSpread.mean,
    genome.burstSpread.variance,
    1.1
  );

  total += weightedNormalizedDistance(
    summary.energyMovement,
    genome.energyMovement.mean,
    genome.energyMovement.variance,
    1.1
  );

  total += weightedNormalizedDistance(
    summary.spectralMovement,
    genome.spectralMovement.mean,
    genome.spectralMovement.variance,
    1.5
  );

  return total;
}


// ======================================
// مسافة موزونة ومطبّعة
// ======================================

function weightedNormalizedDistance(value, mean, variance, weight) {
  value = Number(value || 0);
  mean = Number(mean || 0);
  variance = Number(variance || 0);
  weight = Number(weight || 1);

  const tolerance =
    Math.sqrt(variance) || Math.abs(mean) * 0.15 || 1;

  return (
    Math.abs(value - mean) /
    tolerance
  ) * weight;
}


// ======================================
// قرار الفصل
// ======================================

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
    note: "الجينومان قريبان من العينة. نحتاج تحسين التسجيل أو تقوية الجينوم أو إضافة طبقات مقارنة زمنية أقوى."
  };
}


// ======================================
// سؤال المختبر عن الحرف المنطوق فعليًا
// ======================================

function askActualSpokenKey() {
  const answer = prompt(
    "ما الحرف الذي نطقته فعليًا؟\n\n" +
    "اكتب:\n" +
    "ba = باء\n" +
    "qa = قاف"
  );

  if (!answer) return null;

  const key =
    answer.trim().toLowerCase();

  if (key === "ba" || key === "qa") {
    return key;
  }

  alert("قيمة غير صحيحة. اكتب فقط: ba أو qa");
  return null;
}


// ======================================
// حفظ نتيجة اختبار الفصل
// ======================================

function saveCognitiveMatchResult(
  buttonKey,
  actualKey,
  winner,
  results,
  decision,
  margin
) {
  const logKey =
    "cognitive_match_results_log";

  const oldLog =
    JSON.parse(localStorage.getItem(logKey) || "[]");

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

  renderMatchResultsLog();
}


// ======================================
// عرض سجل نتائج الفصل
// ======================================

function renderMatchResultsLog() {
  const raw =
    localStorage.getItem("cognitive_match_results_log");

  const results =
    JSON.parse(raw || "[]");

  const correctResults =
    results.filter(function (r) {
      return r.actualKey === r.detectedKey;
    });

  const accuracy =
    results.length
      ? ((correctResults.length / results.length) * 100).toFixed(2)
      : "0.00";

  const avgCorrectMargin =
    correctResults.length
      ? (
          correctResults.reduce(function (sum, r) {
            return sum + Number(r.margin || 0);
          }, 0) / correctResults.length
        ).toFixed(4)
      : "0.0000";

  let box =
    document.getElementById("match-results-log-box");

  if (!box) {
    box =
      document.createElement("div");

    box.id =
      "match-results-log-box";

    box.style.background =
      "#08111f";

    box.style.color =
      "white";

    box.style.border =
      "1px solid #334155";

    box.style.borderRadius =
      "14px";

    box.style.padding =
      "14px";

    box.style.margin =
      "14px 0";

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
      r.actualKey === r.detectedKey;

    const finalResult =
      ok ? "✅ صحيح" : "❌ خطأ";

    html += `
      <div style="
        background:#111827;
        padding:10px;
        border-radius:10px;
        margin:8px 0;
        border-left:5px solid ${ok ? "#22c55e" : "#ef4444"};
      ">
        <div>
          #${index + 1}
        </div>

        <div>
          زر الاختبار:
          <b>${r.buttonKey}</b>
        </div>

        <div>
          المنطوق فعليًا:
          <b>${r.actualKey}</b>
        </div>

        <div>
          المكتشف:
          <b>${r.detectedLabel}</b>
        </div>

        <div>
          النتيجة:
          <b>${finalResult}</b>
        </div>

        <div>
          هامش الفصل:
          <b>${r.margin}</b>
        </div>

        <div>
          القرار:
          <b>${r.decision}</b>
        </div>
      </div>
    `;
  });

  html += `
    <hr style="border-color:#334155;">

    <div style="margin-top:18px;">
      نسبة النجاح الحالية:
      <b style="color:#22c55e;">${accuracy}%</b>
    </div>

    <div style="margin-top:8px;">
      متوسط هامش الفصل الصحيح:
      <b style="color:#38bdf8;">${avgCorrectMargin}</b>
    </div>

    <div style="margin-top:8px;">
      عدد الاختبارات:
      <b>${results.length}</b>
    </div>
  `;

  box.innerHTML = html;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


console.log("🎯 محرك الفصل بالجِينوم المركزي جاهز V3.1");
