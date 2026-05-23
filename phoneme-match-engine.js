// ================================
// phoneme-match-engine.js
// محرك الفصل بالجِينوم المركزي — V3
// ================================

console.log("🎯 phoneme-match-engine.js جاهز V3");


// ======================================
// بدء اختبار مطابقة حرف عبر الجينوم المركزي
// ======================================

async function startPhonemeMatchTest(targetKey) {
  try {
    const identities = [
      "ba",
      "qa"
    ];

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
saveCognitiveMatchResult(
  targetKey,
  winner,
  results,
  decision,
  margin
);
    let report =
      "🎯 نتيجة اختبار الفصل بالجِينوم المركزي\n\n";

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
    const raw = localStorage.getItem(
      key + "_cognitive_identity"
    );

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

function saveCognitiveMatchResult(targetKey, winner, results, decision, margin) {
  const logKey = "cognitive_match_results_log";

  const oldLog =
    JSON.parse(localStorage.getItem(logKey) || "[]");

  oldLog.push({
    expectedKey: targetKey,
    detectedKey: winner.key,
    detectedLabel: winner.label,
    detectedPhoneme: winner.phoneme,
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

  console.log("📊 تم حفظ نتيجة اختبار الفصل:", oldLog[oldLog.length - 1]);
    }
console.log("🎯 محرك الفصل بالجِينوم المركزي جاهز V3");
