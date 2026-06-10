// ================================
// phoneme-match-engine.js
// محرك الفصل بالجِينوم المركزي — نسخة نظيفة
// ================================

console.log("🎯 phoneme-match-engine.js جاهز — Clean");

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
      if (identity) availableIdentities.push(identity);
    }

    if (!availableIdentities.length) {
      alert("لا توجد جينومات مركزية محفوظة.\n\nابنِ أولًا الجينومات المركزية للحروف.");
      return;
    }

    alert("سيبدأ اختبار الفصل بالجِينوم المركزي.\n\nسجّل الآن صوت الحرف.");

    const blob = await recordMatchSample();

    if (!blob) {
      alert("فشل تسجيل عينة الاختبار");
      return;
    }

    const decoded = await decodeCognitiveBlob(blob);
    const timeline = buildCognitiveTimeline(decoded.samples, decoded.sampleRate);
    const phases = detectCognitivePhases(timeline);
    const summary = summarizeCognitiveTimeline(timeline, phases);

    const actual = askActualSpokenKey();

    if (!actual) {
      alert("لم يتم حفظ النتيجة لأن الحرف المنطوق لم يُحدد.");
      return;
    }

    const actualKey = actual.key;

    const results = availableIdentities.map(function (identity) {
      const familyContext = loadFamilyContextForMatch(identity.phonemeKey);
      const perceptualMemory = loadPerceptualMemoryForMatch(identity.phonemeKey);

      const stateDecision =
        scoreIdentityBestState(summary, identity, perceptualMemory);

      const genomeDistance =
        compareSummaryWithFamilyAwareGenome(
          summary,
          identity.genome,
          familyContext
        );

      const sealDistance =
        scoreSpectralSealDistance(summary, identity.genome);

      const stateDistance = stateDecision.distance;

      return {
        key: identity.phonemeKey,
        phoneme: identity.phoneme,
        label: identity.label,
        color: identity.color,

        matchedStateKey: stateDecision.stateKey,
        matchedStateText: stateDecision.stateText,
        matchedStateRole: stateDecision.stateRole,
        stateConfidence: stateDecision.confidence,
        stateMargin: stateDecision.stateMargin,
        stateScores: stateDecision.allStateScores,
        stateDebug: stateDecision.debug,

        genomeDistance,
        sealDistance,
        stateDistance,

        distance:
          genomeDistance +
          sealDistance +
          stateDistance
      };
    });

    results.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const winner = results[0];
    const second = results[1] || null;

    const margin = second ? second.distance - winner.distance : 0;

    const decision = classifySeparationDecision(winner, second, margin);

    if (typeof window.recordDecisionTrace === "function") {
      window.recordDecisionTrace({
        decisionId: "identify-phoneme",
        decisionName: "تمييز حرف",
        target: winner.key,
        invokedKnowledge: [
          "cognitive-genome",
          "phoneme-family-map",
          "spectral-seal",
          "perceptual-memory"
        ],
        influentialKnowledge: [
          "cognitive-genome",
          "phoneme-family-map",
          "spectral-seal",
          "perceptual-memory"
        ],
        result: decision.label,
        confidence: margin,
        notes:
          "تم إشراك الجينوم المركزي والعائلة الإدراكية والختم الطيفي والذاكرة الإدراكية حسب حالة الحركة."
      });
    }

    saveCognitiveMatchResult(
      targetKey,
      actualKey,
      winner,
      results,
      decision,
      margin
    );

    let report = "🎯 نتيجة اختبار الفصل بالجِينوم المركزي\n\n";

    report += "زر الاختبار: " + targetKey + "\n";
    report += "المنطوق فعليًا: " + actual.text + "\n";
    report +=
      "العينة أقرب إلى: " +
      winner.label +
      " (" +
      winner.phoneme +
      ")\n\n";

    report +=
      "أقرب حالة داخل الحرف: " +
      (winner.matchedStateText || winner.matchedStateKey || "غير محددة") +
      "\n";

    report +=
      "ثقة تحديد الحركة: " +
      safeFixed(winner.stateConfidence, 4) +
      "\n";

    report +=
      "هامش الحركة: " +
      safeFixed(winner.stateMargin, 4) +
      "\n\n";

    results.forEach(function (r, index) {
      report +=
        (index + 1) +
        ") " +
        r.label +
        " (" +
        r.phoneme +
        ")" +
        " → distance = " +
        safeFixed(r.distance, 4) +
        "\n";

      report +=
        "   genome = " + safeFixed(r.genomeDistance, 4) +
        " | seal = " + safeFixed(r.sealDistance, 4) +
        " | state = " + safeFixed(r.stateDistance, 4) +
        "\n\n";
    });

    report += "هامش الفصل: " + safeFixed(margin, 4) + "\n";
    report += "قرار الفصل: " + decision.label + "\n\n";
    report += decision.note;

    alert(report);

    console.log("🎯 COGNITIVE MATCH SAMPLE SUMMARY:", summary);
    console.log("🎯 COGNITIVE MATCH RESULTS:", results);

  } catch (err) {
    console.error("❌ فشل اختبار الفصل بالجِينوم المركزي", err);
    alert("فشل اختبار الفصل بالجِينوم المركزي:\n" + err.message);
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

function loadFamilyContextForMatch(key) {
  if (typeof buildFamilyDecisionContext === "function") {
    return buildFamilyDecisionContext(key);
  }
  return null;
}

function resolveArabicSpokenInput(input) {
  const text = String(input || "").trim();
  const cleanLetter = text.replace(/[\u064B-\u065F\u0640]/g, "").trim();

  let key = null;

  if (
    typeof PHONEME_LETTER_DEFINITIONS !== "undefined" &&
    PHONEME_LETTER_DEFINITIONS
  ) {
    Object.keys(PHONEME_LETTER_DEFINITIONS).forEach(function (itemKey) {
      const def = PHONEME_LETTER_DEFINITIONS[itemKey];
      if (!def) return;

      const letter =
        String(def.letter || "")
          .replace(/[\u064B-\u065F\u0640]/g, "")
          .trim();

      if (letter === cleanLetter) key = itemKey;
    });
  }

  let state = null;

  if (text.includes("َ")) state = "fatha";
  if (text.includes("ِ")) state = "kasra";
  if (text.includes("ُ")) state = "damma";

  return { key, state, text };
}

async function recordMatchSample() {
  return new Promise(async function (resolve) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(track => track.stop());

        resolve(
          new Blob(chunks, {
            type: recorder.mimeType || "audio/webm"
          })
        );
      };

      recorder.start();

      alert("🎙 بدأ التسجيل الآن.\n\nسيتم الإيقاف تلقائيًا بعد ثانيتين.");

      setTimeout(function () {
        if (recorder.state !== "inactive") recorder.stop();
      }, 2000);

    } catch (err) {
      console.error("❌ فشل التسجيل", err);
      resolve(null);
    }
  });
}

function compareSummaryWithFamilyAwareGenome(summary, genome, familyContext) {
  if (!summary || !genome) return Infinity;

  let weights = {
    energy: 1.0,
    centroid: 1.5,
    spread: 1.2,
    zcr: 0.8,
    burstEnergy: 1.3,
    burstCentroid: 1.4,
    burstSpread: 1.1,
    energyMovement: 1.1,
    spectralMovement: 1.5
  };

  const familyName =
    familyContext?.family ||
    familyContext?.familyKey ||
    "";

  if (familyName.includes("lip")) {
    weights.burstEnergy = 2.5;
    weights.energyMovement = 2.0;
    weights.centroid = 1.0;
  }

  if (
    familyName.includes("isti") ||
    familyName.includes("elevated") ||
    familyName.includes("deep")
  ) {
    weights.centroid = 3.0;
    weights.burstCentroid = 3.0;
    weights.spectralMovement = 2.5;
  }

  if (familyName.includes("ghunna")) {
    weights.energy = 2.0;
    weights.spread = 2.0;
    weights.zcr = 0.5;
  }

  let total = 0;

  total += weightedNormalizedDistance(summary.meanEnergy, genome.energy?.mean, genome.energy?.variance, weights.energy);
  total += weightedNormalizedDistance(summary.meanCentroid, genome.centroid?.mean, genome.centroid?.variance, weights.centroid);
  total += weightedNormalizedDistance(summary.meanSpread, genome.spread?.mean, genome.spread?.variance, weights.spread);
  total += weightedNormalizedDistance(summary.meanZcr, genome.zcr?.mean, genome.zcr?.variance, weights.zcr);
  total += weightedNormalizedDistance(summary.burstEnergy, genome.burstEnergy?.mean, genome.burstEnergy?.variance, weights.burstEnergy);
  total += weightedNormalizedDistance(summary.burstCentroid, genome.burstCentroid?.mean, genome.burstCentroid?.variance, weights.burstCentroid);
  total += weightedNormalizedDistance(summary.burstSpread, genome.burstSpread?.mean, genome.burstSpread?.variance, weights.burstSpread);
  total += weightedNormalizedDistance(summary.energyMovement, genome.energyMovement?.mean, genome.energyMovement?.variance, weights.energyMovement);
  total += weightedNormalizedDistance(summary.spectralMovement, genome.spectralMovement?.mean, genome.spectralMovement?.variance, weights.spectralMovement);

  return total;
}

function scoreSpectralSealDistance(summary, genome) {
  const seal = genome?.spectralSeal;
  if (!summary || !seal) return 0;

  let total = 0;

  total += weightedNormalizedDistance(summary.meanCentroid, seal.averageCentroid, 0, 1.2);
  total += weightedNormalizedDistance(summary.meanSpread, seal.averageSpread, 0, 1.0);
  total += weightedNormalizedDistance(summary.burstCentroid, seal.averageBurstCentroid, 0, 1.2);
  total += weightedNormalizedDistance(summary.burstSpread, seal.averageBurstSpread, 0, 1.0);

  return total * (seal.confidence || 1);
}

function loadPerceptualMemoryForMatch(key) {
  const candidates = [
    key + "_perceptual_identity",
    key + "_memory",
    "phoneme_memory_" + key,
    key + "_cumulative_memory",
    "cognitive_memory_" + key
  ];

  for (const storageKey of candidates) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (parsed?.perceptualSignature && parsed?.perceptualSignatureByState) {
        return parsed;
      }

      if (
        parsed?.latestPerceptualIdentity?.perceptualSignature &&
        parsed?.latestPerceptualIdentity?.perceptualSignatureByState
      ) {
        return parsed.latestPerceptualIdentity;
      }

      if (
        parsed?.cumulativePerceptualSignature &&
        parsed?.cumulativePerceptualSignatureByState
      ) {
        return {
          perceptualSignature: parsed.cumulativePerceptualSignature,
          perceptualSignatureByState: parsed.cumulativePerceptualSignatureByState
        };
      }
    } catch (err) {
      console.warn("⚠️ فشل تحميل الذاكرة الإدراكية:", storageKey, err);
    }
  }

  return null;
}

function scorePerceptualMemoryDistance(summary, perceptualMemory) {
  if (!summary || !perceptualMemory?.perceptualSignature) return 0;

  const sig = perceptualMemory.perceptualSignature;
  let total = 0;

  total += weightedNormalizedDistance(summary.meanCentroid, sig.centroid?.mean, sig.centroid?.variance, 1.6);
  total += weightedNormalizedDistance(summary.meanSpread, sig.spread?.mean, sig.spread?.variance, 1.3);
  total += weightedNormalizedDistance(summary.meanEnergy, sig.energy?.mean, sig.energy?.variance, 1.0);
  total += weightedNormalizedDistance(summary.meanZcr, sig.zcr?.mean, sig.zcr?.variance, 1.0);
  total += weightedNormalizedDistance(summary.duration, sig.duration?.mean, sig.duration?.variance, 1.2);
  total += weightedNormalizedDistance(summary.burstEnergy, sig.burstiness?.mean, sig.burstiness?.variance, 1.5);

  return total;
}

function scoreIdentityBestState(summary, identity, perceptualMemory) {
  const genomeByState = identity?.genomeByState || {};
  const memoryByState = perceptualMemory?.perceptualSignatureByState || {};

  const genomeKeys = Object.keys(genomeByState);
  const memoryKeys = Object.keys(memoryByState);

  const debug = {
    phonemeKey: identity?.phonemeKey || null,
    genomeByStateCount: genomeKeys.length,
    genomeByStateKeys: genomeKeys,
    memoryByStateCount: memoryKeys.length,
    memoryByStateKeys: memoryKeys
  };

  const scores = [];

  if (!genomeKeys.length) {
    return {
      distance: scorePerceptualMemoryDistance(summary, perceptualMemory),
      stateKey: null,
      stateText: null,
      stateRole: null,
      confidence: 0,
      stateMargin: 0,
      allStateScores: [],
      debug
    };
  }

  genomeKeys.forEach(function (stateKey) {
    if (String(stateKey || "").includes("sukoon")) return;

    const genomeState = genomeByState[stateKey];
    const memoryState = memoryByState[stateKey];

    const text =
      genomeState?.hmal ||
      genomeState?.haml ||
      genomeState?.text ||
      memoryState?.hmal ||
      memoryState?.haml ||
      memoryState?.text ||
      stateKey;

    let genomeDistance = 0;
    let memoryDistance = 0;

    genomeDistance += weightedNormalizedDistance(summary.meanCentroid, genomeState.centroid?.mean, genomeState.centroid?.variance, 1.8);
    genomeDistance += weightedNormalizedDistance(summary.meanSpread, genomeState.spread?.mean, genomeState.spread?.variance, 1.4);
    genomeDistance += weightedNormalizedDistance(summary.meanEnergy, genomeState.energy?.mean, genomeState.energy?.variance, 1.2);
    genomeDistance += weightedNormalizedDistance(summary.meanZcr, genomeState.zcr?.mean, genomeState.zcr?.variance, 1.1);
    genomeDistance += weightedNormalizedDistance(summary.duration, genomeState.duration?.mean, genomeState.duration?.variance, 1.2);

    if (memoryState) {
      memoryDistance += weightedNormalizedDistance(summary.meanCentroid, memoryState.centroid?.mean, memoryState.centroid?.variance, 1.8);
      memoryDistance += weightedNormalizedDistance(summary.meanSpread, memoryState.spread?.mean, memoryState.spread?.variance, 1.4);
      memoryDistance += weightedNormalizedDistance(summary.meanEnergy, memoryState.energy?.mean, memoryState.energy?.variance, 1.2);
      memoryDistance += weightedNormalizedDistance(summary.meanZcr, memoryState.zcr?.mean, memoryState.zcr?.variance, 1.1);
      memoryDistance += weightedNormalizedDistance(summary.duration, memoryState.duration?.mean, memoryState.duration?.variance, 1.2);
    }
if (!text) return;
    scores.push({
      stateKey,
      stateText: text,
      stateRole: genomeState?.role || memoryState?.role || null,
      genomeDistance,
      memoryDistance,
      distance: genomeDistance + memoryDistance
    });
  });

  scores.sort(function (a, b) {
    return a.distance - b.distance;
  });

  const best = scores[0] || null;
  const second = scores[1] || null;

  if (!best) {
    return {
      distance: scorePerceptualMemoryDistance(summary, perceptualMemory),
      stateKey: null,
      stateText: null,
      stateRole: null,
      confidence: 0,
      stateMargin: 0,
      allStateScores: [],
      debug
    };
  }

  const margin = second ? second.distance - best.distance : 0;

  return {
    distance: best.distance,
    stateKey: best.stateKey,
    stateText: best.stateText,
    stateRole: best.stateRole,
    stateMargin: Number(margin.toFixed(4)),
    confidence: second
  ? Number(
      (
        margin /
        Math.max(second.distance, 0.0001)
      ).toFixed(4)
    )
  : 1,
    allStateScores: scores,
    debug
  };
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

  return (Math.abs(value - mean) / tolerance) * weight;
}

function classifySeparationDecision(winner, second, margin) {
  if (!second) {
    return {
      label: "غير كافٍ للمقارنة",
      note: "يوجد جينوم واحد فقط، لذلك لا نستطيع قياس الفصل الحقيقي."
    };
  }

  const ratio = second.distance / Math.max(winner.distance, 0.0001);

  if (margin > 3 || ratio > 1.6) {
    return {
      label: "فصل قوي ✅",
      note: "العينة بعيدة بوضوح عن الحرف الثاني."
    };
  }

  if (margin > 1 || ratio > 1.25) {
    return {
      label: "فصل متوسط ⚠️",
      note: "العينة أقرب إلى الحرف الفائز، لكن المسافة ليست كبيرة بما يكفي."
    };
  }

  return {
    label: "فصل ملتبس ❌",
    note: "الجينومات قريبة من العينة. نحتاج تحسين الجينوم أو أوزان القرار."
  };
}

function askActualSpokenKey() {
  const answer = prompt(
    "ما الحرف الذي نطقته فعليًا؟\n\nاكتب الحرف بحركته مثل:\n\nبَ\nصِ\nطُ"
  );

  if (!answer) return null;

  const parsed = resolveArabicSpokenInput(answer);

  if (!parsed.key) {
    alert("لم أتعرف على الحرف. اكتب مثل: بَ أو صِ أو طُ");
    return null;
  }

  if (!parsed.state) {
    alert("اكتب الحرف مع الحركة: فتحة أو كسرة أو ضمة.");
    return null;
  }

  return parsed;
}

function saveCognitiveMatchResult(buttonKey, actualKey, winner, results, decision, margin) {
  const logKey = "cognitive_match_results_log";
  const oldLog = JSON.parse(localStorage.getItem(logKey) || "[]");

  oldLog.push({
    buttonKey,
    actualKey,
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
        distance: Number(r.distance.toFixed(4)),
        genomeDistance: Number(r.genomeDistance.toFixed(4)),
        sealDistance: Number(r.sealDistance.toFixed(4)),
        stateDistance: Number(r.stateDistance.toFixed(4))
      };
    }),
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(logKey, JSON.stringify(oldLog, null, 2));
  renderMatchResultsLog(buttonKey);
}

function renderMatchResultsLog(filterKey) {
  const raw = localStorage.getItem("cognitive_match_results_log");
  const allResults = JSON.parse(raw || "[]");

  const results = filterKey
    ? allResults.filter(r => r.buttonKey === filterKey)
    : allResults;

  const correctResults = results.filter(r => r.actualKey === r.detectedKey);

  const accuracy = results.length
    ? ((correctResults.length / results.length) * 100).toFixed(2)
    : "0.00";

  const box = document.getElementById("match-results-log-box");
  if (!box) return;

  let html = `
    <h3 style="margin-top:0;">📊 سجل اختبارات الفصل ${filterKey ? " — " + filterKey : ""}</h3>
  `;

  if (!results.length) {
    box.innerHTML = html + `<div>لا توجد نتائج محفوظة لهذه الحقيبة بعد.</div>`;
    return;
  }

  results.forEach(function (r, index) {
    const ok = r.actualKey && r.detectedKey && r.actualKey === r.detectedKey;

    html += `
      <div style="background:#111827;padding:10px;border-radius:10px;margin:8px 0;border-left:5px solid ${ok ? "#22c55e" : "#ef4444"};">
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
    <div style="margin-top:18px;">نسبة النجاح لهذه الحقيبة: <b style="color:#22c55e;">${accuracy}%</b></div>
    <div style="margin-top:8px;">عدد اختبارات هذه الحقيبة: <b>${results.length}</b></div>
  `;

  box.innerHTML = html;
}

function clearCognitiveMatchResultsLog() {
  localStorage.removeItem("cognitive_match_results_log");

  const box = document.getElementById("match-results-log-box");

  if (box) {
    box.innerHTML = `
      <h3 style="margin-top:0;">📊 سجل اختبارات الفصل</h3>
      <div>لا توجد نتائج محفوظة بعد.</div>
    `;
  }

  alert("تم حذف سجل اختبارات الفصل بنجاح.");
}

function safeFixed(value, digits) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(digits || 4) : "0.0000";
}

window.clearCognitiveMatchResultsLog = clearCognitiveMatchResultsLog;
window.startPhonemeMatchTest = startPhonemeMatchTest;
window.renderMatchResultsLog = renderMatchResultsLog;

console.log("🎯 محرك الفصل بالجِينوم المركزي جاهز — Clean");
