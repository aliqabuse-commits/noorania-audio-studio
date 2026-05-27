// ================================
// cognitive-statistics-engine.js
// محرك التحليل الإحصائي الذاتي للإدراك الصوتي
// ================================

console.log("📊 cognitive-statistics-engine.js جاهز");

// ======================================
// مفاتيح التخزين
// ======================================

const COGNITIVE_TEST_LOG_KEY =
  "cognitive_match_results_log";

const COGNITIVE_LEARNING_LOG_KEY =
  "cognitive_learning_memory_log";

const COGNITIVE_BUILD_HISTORY_KEY =
  "cognitive_build_history_log";


// ======================================
// قراءة آمنة من localStorage
// ======================================

function readCognitiveJsonLog(key) {
  try {
    return JSON.parse(
      localStorage.getItem(key) || "[]"
    );
  } catch (err) {
    console.error("❌ فشل قراءة السجل:", key, err);
    return [];
  }
}


// ======================================
// حفظ آمن في localStorage
// ======================================

function saveCognitiveJsonLog(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify(data, null, 2)
  );
}


// ======================================
// تسجيل حدث بناء ذاكرة أو جينوم
// يستدعى لاحقًا من ملفات الذاكرة والجينوم
// ======================================

function recordCognitiveBuildEvent(event) {
  const log =
    readCognitiveJsonLog(COGNITIVE_BUILD_HISTORY_KEY);

  log.push({
    type: event.type || "unknown_build",
    phonemeKey: event.phonemeKey || null,
    label: event.label || null,
    confidence:
      typeof event.confidence === "number"
        ? event.confidence
        : null,
    genome: event.genome || null,
    signature: event.signature || null,
    notes: event.notes || [],
    createdAt: new Date().toISOString()
  });

  saveCognitiveJsonLog(
    COGNITIVE_BUILD_HISTORY_KEY,
    log
  );
}


// ======================================
// تحليل شامل للنظام
// ======================================

function analyzeCognitiveSystem() {
  const testLog =
    readCognitiveJsonLog(COGNITIVE_TEST_LOG_KEY);

  const learningLog =
    readCognitiveJsonLog(COGNITIVE_LEARNING_LOG_KEY);

  const buildLog =
    readCognitiveJsonLog(COGNITIVE_BUILD_HISTORY_KEY);

  const sourceLog =
    learningLog.length ? learningLog : testLog;

  const report = {
    createdAt: new Date().toISOString(),

    totals: analyzeTotals(sourceLog),

    perActualPhoneme:
      analyzePerActualPhoneme(sourceLog),

    perButtonBag:
      analyzePerButtonBag(sourceLog),

    confusion:
      analyzeConfusionPatterns(sourceLog),

    dominantGenomes:
      analyzeDominantGenomes(sourceLog),

    margin:
      analyzeMargins(sourceLog),

    buildHistory:
      analyzeBuildHistory(buildLog),

    roadmap:
      generateCognitiveRoadmap(sourceLog, buildLog)
  };

  renderCognitiveStatisticsReport(report);

  console.log("📊 COGNITIVE SELF ANALYSIS:", report);

  return report;
}


// ======================================
// إجماليات عامة
// ======================================

function analyzeTotals(log) {
  const total = log.length;

  const correct = log.filter(function (r) {
    return r.actualKey === r.detectedKey;
  }).length;

  return {
    totalTests: total,
    correctTests: correct,
    wrongTests: total - correct,
    accuracy: total
      ? roundStat((correct / total) * 100)
      : 0
  };
}


// ======================================
// تحليل حسب الحرف المنطوق فعليًا
// ======================================

function analyzePerActualPhoneme(log) {
  const map = {};

  log.forEach(function (r) {
    const key = r.actualKey || "unknown";

    if (!map[key]) {
      map[key] = {
        actualKey: key,
        total: 0,
        correct: 0,
        wrong: 0,
        margins: [],
        detections: {}
      };
    }

    map[key].total++;

    if (r.actualKey === r.detectedKey) {
      map[key].correct++;
    } else {
      map[key].wrong++;
    }

    if (typeof r.margin === "number") {
      map[key].margins.push(r.margin);
    }

    const detected =
      r.detectedKey || "unknown";

    map[key].detections[detected] =
      (map[key].detections[detected] || 0) + 1;
  });

  Object.keys(map).forEach(function (key) {
    const item = map[key];

    item.accuracy = item.total
      ? roundStat((item.correct / item.total) * 100)
      : 0;

    item.avgMargin =
      averageStat(item.margins);

    item.mainConfusion =
      getMainConfusion(item.detections, key);
  });

  return map;
}


// ======================================
// تحليل حسب الحقيبة/زر الاختبار
// ======================================

function analyzePerButtonBag(log) {
  const map = {};

  log.forEach(function (r) {
    const key = r.buttonKey || "unknown";

    if (!map[key]) {
      map[key] = {
        buttonKey: key,
        total: 0,
        correct: 0,
        wrong: 0,
        margins: []
      };
    }

    map[key].total++;

    if (r.actualKey === r.detectedKey) {
      map[key].correct++;
    } else {
      map[key].wrong++;
    }

    if (typeof r.margin === "number") {
      map[key].margins.push(r.margin);
    }
  });

  Object.keys(map).forEach(function (key) {
    const item = map[key];

    item.accuracy = item.total
      ? roundStat((item.correct / item.total) * 100)
      : 0;

    item.avgMargin =
      averageStat(item.margins);
  });

  return map;
}


// ======================================
// أنماط الالتباس
// ======================================

function analyzeConfusionPatterns(log) {
  const map = {};

  log.forEach(function (r) {
    if (!r.actualKey || !r.detectedKey) return;

    if (r.actualKey === r.detectedKey) return;

    const pair =
      r.actualKey + " → " + r.detectedKey;

    if (!map[pair]) {
      map[pair] = {
        pair: pair,
        actualKey: r.actualKey,
        detectedKey: r.detectedKey,
        count: 0,
        margins: []
      };
    }

    map[pair].count++;

    if (typeof r.margin === "number") {
      map[pair].margins.push(r.margin);
    }
  });

  const list =
    Object.keys(map).map(function (pair) {
      const item = map[pair];

      return {
        pair: item.pair,
        actualKey: item.actualKey,
        detectedKey: item.detectedKey,
        count: item.count,
        avgMargin: averageStat(item.margins)
      };
    });

  list.sort(function (a, b) {
    return b.count - a.count;
  });

  return list;
}


// ======================================
// الجينومات المهيمنة
// الحرف الذي يكثر أن يسحب غيره
// ======================================

function analyzeDominantGenomes(log) {
  const map = {};

  log.forEach(function (r) {
    const detected =
      r.detectedKey || "unknown";

    if (!map[detected]) {
      map[detected] = {
        detectedKey: detected,
        totalDetected: 0,
        correct: 0,
        wrongAttractions: 0
      };
    }

    map[detected].totalDetected++;

    if (r.actualKey === r.detectedKey) {
      map[detected].correct++;
    } else {
      map[detected].wrongAttractions++;
    }
  });

  const list =
    Object.keys(map).map(function (key) {
      const item = map[key];

      return {
        detectedKey: key,
        totalDetected: item.totalDetected,
        correct: item.correct,
        wrongAttractions: item.wrongAttractions,
        attractionRate: item.totalDetected
          ? roundStat(
              (item.wrongAttractions / item.totalDetected) * 100
            )
          : 0
      };
    });

  list.sort(function (a, b) {
    return b.wrongAttractions - a.wrongAttractions;
  });

  return list;
}


// ======================================
// تحليل الهوامش
// ======================================

function analyzeMargins(log) {
  const margins =
    log
      .map(function (r) {
        return Number(r.margin);
      })
      .filter(function (v) {
        return !isNaN(v);
      });

  return {
    avgMargin: averageStat(margins),
    minMargin: margins.length
      ? roundStat(Math.min.apply(null, margins))
      : 0,
    maxMargin: margins.length
      ? roundStat(Math.max.apply(null, margins))
      : 0
  };
}


// ======================================
// تحليل تاريخ بناء الذاكرة والجينوم
// ======================================

function analyzeBuildHistory(buildLog) {
  const map = {};

  buildLog.forEach(function (event) {
    const key =
      event.phonemeKey || "unknown";

    if (!map[key]) {
      map[key] = {
        phonemeKey: key,
        totalBuilds: 0,
        memoryBuilds: 0,
        genomeBuilds: 0,
        confidences: []
      };
    }

    map[key].totalBuilds++;

    if (event.type === "memory_build") {
      map[key].memoryBuilds++;
    }

    if (event.type === "genome_build") {
      map[key].genomeBuilds++;
    }

    if (typeof event.confidence === "number") {
      map[key].confidences.push(event.confidence);
    }
  });

  Object.keys(map).forEach(function (key) {
    const item = map[key];

    item.avgConfidence =
      averageStat(item.confidences);

    item.lastConfidence =
      item.confidences.length
        ? item.confidences[item.confidences.length - 1]
        : null;
  });

  return map;
}


// ======================================
// توليد خارطة طريق صوتية
// ======================================

function generateCognitiveRoadmap(log, buildLog) {
  const recommendations = [];

  const totals = analyzeTotals(log);
  const perActual = analyzePerActualPhoneme(log);
  const confusions = analyzeConfusionPatterns(log);
  const dominant = analyzeDominantGenomes(log);

  if (!log.length) {
    recommendations.push(
      "ابدأ بجمع اختبارات إدراكية منظمة لكل حقيبة."
    );
  }

  if (totals.accuracy < 50 && log.length >= 10) {
    recommendations.push(
      "الدقة العامة منخفضة؛ لا تنتقل إلى الفصل والدمج قبل تقوية الجينومات."
    );
  }

  Object.keys(perActual).forEach(function (key) {
    const item = perActual[key];

    if (item.total >= 3 && item.accuracy < 50) {
      recommendations.push(
        "الحرف " +
        key +
        " ضعيف إدراكيًا؛ يحتاج إعادة تسجيل وبناء ذاكرة/جينوم."
      );
    }
  });

  if (confusions.length) {
    const top = confusions[0];

    recommendations.push(
      "أكثر التباس حاليًا: " +
      top.pair +
      " بعدد " +
      top.count +
      " مرة."
    );
  }

  if (dominant.length) {
    const d = dominant[0];

    if (d.wrongAttractions >= 2) {
      recommendations.push(
        "الجينوم " +
        d.detectedKey +
        " يملك جاذبية عالية ويسحب حروفًا أخرى؛ راجع أوزانه وحدوده."
      );
    }
  }

  recommendations.push(
    "المرحلة الحالية: بناء مصفوفة الالتباس قبل أي تعديل تلقائي للجينوم."
  );

  return recommendations;
}


// ======================================
// عرض التقرير في الصفحة
// ======================================

function renderCognitiveStatisticsReport(report) {
  let box =
    document.getElementById("cognitive-statistics-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "cognitive-statistics-report-box";

    box.style.background = "#08111f";
    box.style.color = "white";
    box.style.border = "1px solid #334155";
    box.style.borderRadius = "14px";
    box.style.padding = "14px";
    box.style.margin = "14px 0";
    box.style.lineHeight = "1.8";

    const target =
      document.getElementById("perceptualTrainingView") ||
      document.body;

    target.appendChild(box);
  }

  const totals = report.totals;

  let html = `
    <h3 style="margin-top:0;">
      📊 التحليل الإحصائي الذاتي للنظام
    </h3>

    <div>عدد الاختبارات: <b>${totals.totalTests}</b></div>
    <div>الصحيح: <b>${totals.correctTests}</b></div>
    <div>الخطأ: <b>${totals.wrongTests}</b></div>
    <div>الدقة العامة: <b>${totals.accuracy}%</b></div>

    <hr style="border-color:#1f2937;">

    <h4>أقوى الالتباسات</h4>
  `;

  if (!report.confusion.length) {
    html += `<div>لا توجد التباسات كافية بعد.</div>`;
  } else {
    report.confusion.slice(0, 8).forEach(function (c) {
      html += `
        <div style="background:#111827;padding:8px;margin:6px 0;border-radius:8px;">
          <b>${c.pair}</b>
          — التكرار: ${c.count}
          — متوسط الهامش: ${c.avgMargin}
        </div>
      `;
    });
  }

  html += `
    <hr style="border-color:#1f2937;">

    <h4>الجينومات المهيمنة</h4>
  `;

  if (!report.dominantGenomes.length) {
    html += `<div>لا توجد بيانات كافية.</div>`;
  } else {
    report.dominantGenomes.slice(0, 8).forEach(function (d) {
      html += `
        <div style="background:#111827;padding:8px;margin:6px 0;border-radius:8px;">
          <b>${d.detectedKey}</b>
          — ظهر: ${d.totalDetected}
          — جذب خاطئ: ${d.wrongAttractions}
          — نسبة الجذب: ${d.attractionRate}%
        </div>
      `;
    });
  }

  html += `
    <hr style="border-color:#1f2937;">

    <h4>خارطة الطريق المقترحة</h4>
  `;

  report.roadmap.forEach(function (r) {
    html += `
      <div style="margin:6px 0;">
        🧭 ${r}
      </div>
    `;
  });

  box.innerHTML = html;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ======================================
// أدوات مساعدة
// ======================================

function averageStat(values) {
  const clean =
    values.filter(function (v) {
      return typeof v === "number" && !isNaN(v);
    });

  if (!clean.length) return 0;

  return roundStat(
    clean.reduce(function (a, b) {
      return a + b;
    }, 0) / clean.length
  );
}


function roundStat(value) {
  return Number(Number(value || 0).toFixed(4));
}


function getMainConfusion(detections, correctKey) {
  let bestKey = null;
  let bestCount = 0;

  Object.keys(detections).forEach(function (key) {
    if (key === correctKey) return;

    if (detections[key] > bestCount) {
      bestKey = key;
      bestCount = detections[key];
    }
  });

  return bestKey
    ? {
        key: bestKey,
        count: bestCount
      }
    : null;
}


// ======================================
// واجهات عامة
// ======================================

window.analyzeCognitiveSystem =
  analyzeCognitiveSystem;

window.recordCognitiveBuildEvent =
  recordCognitiveBuildEvent;

console.log("📊 محرك التحليل الإحصائي الذاتي جاهز");
