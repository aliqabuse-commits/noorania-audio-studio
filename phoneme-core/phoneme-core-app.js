// ================================
// phoneme-core/phoneme-core-app.js
// منظم إدارة الحرف
// تسجيل + فحص + بناء لوحة الإدارة
// لا يشغل أي محرك تلقائيًا
// ================================

console.log("🔤 phoneme-core-app.js جاهز — Safe Department App");


// ======================================
// 1) دستور منظم إدارة الحرف
// ======================================

const PHONEME_CORE_APP_CHARTER = {
  title: "دستور منظم إدارة الحرف",
  law:
    "إدارة الحرف لا تعرض جمال الملفات، بل تثبت أن معرفة الحرف تخدم قرار التمييز والمطابقة والفصل.",

  rules: [
    "لا يشغل أي محرك تلقائيًا.",
    "لا يبدأ تدريبًا تلقائيًا.",
    "لا يبني جينومًا تلقائيًا.",
    "لا يفتح صفحة بنفسه.",
    "لا ينازع المنظم العام في سلطة العرض.",
    "يبني أزرار الإدارة داخل الحاوية التي يحددها المنظم العام.",
    "كل زر يشغل محركًا يجب أن يكون بطلب واضح من المستخدم."
  ]
};


// ======================================
// 2) الدوال المتوقعة من إدارة الحرف
// ======================================

const PHONEME_CORE_EXPECTED_FUNCTIONS = [
  // phoneme-training-pack.js
  "getAllPhonemeTrainingPacks",
  "getPhonemeTrainingPack",

  // phoneme-colors.js
  "normalizePhonemeColorKey",
  "bindPhonemeToColor",
  "getPhonemeColor",
  "getAllPhonemeColors",

  // phoneme-color-memory.js
  "createPhonemeColorMemory",
  "buildPhonemeColorMemoryConfigs",
  "getAllPhonemeMemories",
  "getPhonemeMemory",

  // phoneme-memory-trainer.js
  "trainPhonemeMemory",
  "findMissingTrainingFiles",
  "buildPerceptualIdentity",
  "extractPerceptualFeatures",
  "renderPhonemeMemoryReport",
  "getAudioPromiseForMemory",

  // phoneme-signal-validator.js
  "validatePhonemeSignal",
  "buildSignalValidationReport",
  "testSignalQualityForPhoneme",

  // phoneme-cognitive-engine.js
  "buildPhonemeCognitiveIdentity",
  "loadCognitiveIdentity",
  "renderCognitiveReport",

  // phoneme-match-engine.js
  "getAvailablePhonemeKeysForMatch",
  "startPhonemeMatchTest",
  "recordMatchSample",
  "renderMatchResultsLog",
  "clearCognitiveMatchResultsLog",

  // phoneme-timeline-engine.js
  "buildTimelineGenomeForPhoneme",
  "renderTimelineGenomeReport",

  // phoneme-identity-engine.js
  "runPhonemeIdentityEngine",
  "buildPhonemeIdentity",
  "renderIdentityReport",

  // common-payload-finder.js
  "runBaCommonPayloadTest",
  "findCommonPayloadForKeys",
  "renderCommonPayloadReport",

  // burst-signature-engine.js
  "runBurstSignatureEngine",

  // spectral-seal-engine.js
  "runSpectralSealEngine",

  // core-purifier-engine.js
  "runCorePurifierEngine",
  "renderPureCoreReport",

  // ba-final-identity-engine.js
  "runBaFinalIdentityEngine",
  "renderBaFinalIdentityReport",

  // ba-identity-match-engine.js
  "runBaaIdentityMatchEngine",
  "renderBaaMatchReport"
];


// ======================================
// 3) أداة فحص دالة
// ======================================

function isPhonemeFunctionAvailable(fnName) {
  return typeof window[fnName] === "function";
}


// ======================================
// 4) تشغيل منظم إدارة الحرف الآمن
// ======================================

window.runPhonemeCoreApp = function () {
  const index =
    typeof window.getPhonemeCoreIndex === "function"
      ? window.getPhonemeCoreIndex()
      : null;

  const result = {
    department: "phoneme-core",
    mode: "safe-registry-and-panel",
    status: "registered",
    charter: PHONEME_CORE_APP_CHARTER,
    indexLoaded: !!index,
    files: {},
    functions: {},
    summary: {
      filesRegistered: 0,
      functionsAvailable: 0,
      functionsMissing: 0
    },
    note:
      "تم تسجيل وفحص إدارة الحرف فقط دون تشغيل أي محرك تلقائيًا."
  };

  if (index && Array.isArray(index.files)) {
    index.files.forEach(function (file) {
      result.files[file] = "registered";
      result.summary.filesRegistered++;
    });
  }

  PHONEME_CORE_EXPECTED_FUNCTIONS.forEach(function (fnName) {
    const state = isPhonemeFunctionAvailable(fnName)
      ? "available"
      : "missing";

    result.functions[fnName] = state;

    if (state === "available") {
      result.summary.functionsAvailable++;
    } else {
      result.summary.functionsMissing++;
    }
  });

  if (typeof window.registerDepartment === "function" && index) {
    window.registerDepartment(index);
    result.registration = "registered";
  } else {
    result.registration = "missing";
  }

  console.log("✅ phoneme-core safe report:", result);
  return result;
};


// ======================================
// 5) بناء لوحة إدارة الحرف داخل الصفحة
// يستدعيها المنظم العام أو زر الإدارة
// ======================================

window.renderPhonemeCorePanel = function (containerId) {
  const container = document.getElementById(containerId || "phoneme-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية إدارة الحرف:", containerId);
    return null;
  }

  container.innerHTML = "";

  const report =
    typeof window.runPhonemeCoreApp === "function"
      ? window.runPhonemeCoreApp()
      : null;

  const statusBox = document.createElement("div");
  statusBox.style.background = "#0f172a";
  statusBox.style.border = "1px solid #334155";
  statusBox.style.borderRadius = "12px";
  statusBox.style.padding = "12px";
  statusBox.style.marginBottom = "14px";
  statusBox.style.lineHeight = "1.8";

  statusBox.innerHTML =
    "<b>إدارة الحرف:</b> " +
    (report && report.indexLoaded ? "✅ index available" : "⚠️ index missing") +
    "<br><b>الدوال المتاحة:</b> " +
    (report ? report.summary.functionsAvailable : 0) +
    "<br><b>الدوال الناقصة:</b> " +
    (report ? report.summary.functionsMissing : 0) +
    "<br><span style='color:#94a3b8;'>لا يتم تشغيل أي محرك إلا بزر واضح.</span>";

  container.appendChild(statusBox);

  addPhonemeActionButton(
    container,
    "🧠 عرض الحقائب الإدراكية",
    function () {
      if (typeof window.renderPhonemeCards === "function") {
        window.renderPhonemeCards();
      } else {
        renderPhonemeCardsFromCore();
      }

      if (typeof window.showNooraniyaView === "function") {
        window.showNooraniyaView("perceptualTrainingView");
      }
    }
  );

  addPhonemeActionButton(
    container,
    "🎯 اختبار مطابقة حرف",
    function () {
      const key = prompt("اكتب مفتاح الحرف للاختبار مثل: ba أو qa");

      if (!key) return;

      if (typeof window.startPhonemeMatchTest === "function") {
        window.startPhonemeMatchTest(key);
      } else {
        alert("محرك المطابقة غير متاح الآن.");
      }
    }
  );

  addPhonemeActionButton(
    container,
    "📊 سجل اختبارات المطابقة",
    function () {
      const key = prompt("اكتب مفتاح الحرف لعرض السجل، أو اتركه فارغًا للعام:");

      if (typeof window.renderMatchResultsLog === "function") {
        window.renderMatchResultsLog(key || "");
      } else {
        alert("دالة عرض سجل المطابقة غير متاحة الآن.");
      }
    }
  );

  addPhonemeActionButton(
    container,
    "🗑 حذف سجل اختبارات المطابقة",
    function () {
      if (typeof window.clearCognitiveMatchResultsLog === "function") {
        window.clearCognitiveMatchResultsLog();
      } else {
        alert("دالة حذف سجل المطابقة غير متاحة الآن.");
      }
    }
  );

  return report;
};


// ======================================
// 6) زر آمن داخل لوحة إدارة الحرف
// ======================================

function addPhonemeActionButton(container, label, handler) {
  const btn = document.createElement("button");

  btn.innerText = label;
  btn.style.display = "block";
  btn.style.width = "90%";
  btn.style.margin = "10px auto";
  btn.style.padding = "12px";
  btn.style.borderRadius = "10px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "bold";
  btn.style.background = "#111827";
  btn.style.color = "#e5e7eb";
  btn.style.border = "1px solid #475569";

  btn.onclick = function () {
    try {
      handler();
    } catch (err) {
      console.error("❌ خطأ في زر إدارة الحرف:", label, err);
      alert("حدث خطأ أثناء تنفيذ الإجراء:\n" + err.message);
    }
  };

  container.appendChild(btn);
}


// ======================================
// 7) عرض الحقائب الإدراكية
// انتقلت من index.html إلى إدارة الحرف
// ======================================

window.renderPhonemeCards = function () {
  renderPhonemeCardsFromCore();
};


function renderPhonemeCardsFromCore() {
  const grid = document.getElementById("phonemeCardsGrid");

  if (!grid) return;

  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";
  grid.style.gap = "18px";
  grid.style.padding = "12px";

  if (typeof window.getAllPhonemeTrainingPacks !== "function") {
    grid.innerHTML =
      "<div style='background:#7f1d1d; color:white; padding:14px; border-radius:12px; line-height:1.8; grid-column:1 / -1;'>" +
      "⚠️ لم يتم العثور على دالة getAllPhonemeTrainingPacks" +
      "</div>";
    return;
  }

  const packs = window.getAllPhonemeTrainingPacks();

  if (!packs || !Object.keys(packs).length) {
    grid.innerHTML =
      "<div style='background:#7f1d1d; color:white; padding:14px; border-radius:12px; line-height:1.8; grid-column:1 / -1;'>" +
      "⚠️ لا توجد حقائب إدراكية جاهزة" +
      "</div>";
    return;
  }

  grid.innerHTML =
    "<h3 style='text-align:center; margin:10px 0 18px; grid-column:1 / -1;'>" +
    "اختر الحقيبة الإدراكية" +
    "</h3>";

  Object.keys(packs).forEach(function (key) {
    const pack = packs[key];

    const card = document.createElement("button");

    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "center";
    card.style.alignItems = "center";
    card.style.width = "100%";
    card.style.margin = "0";
    card.style.minHeight = "110px";
    card.style.padding = "14px";
    card.style.borderRadius = "22px";
    card.style.border = "2px solid " + (pack.colorHex || "#334155");
    card.style.background = "#08111f";
    card.style.color = pack.colorHex || "#ffffff";
    card.style.fontSize = "18px";
    card.style.fontWeight = "bold";

    card.innerHTML =
      "حقيبة " +
      (pack.letter || key) +
      "<br><br><span style='font-size:14px;color:#cbd5e1;'>" +
      key +
      " — " +
      (pack.name || "حقيبة إدراكية") +
      "</span>";

    card.onclick = function () {
      renderPhonemeBagDetailsFromCore(key, pack);
    };

    grid.appendChild(card);
  });
}


// ======================================
// 8) تفاصيل حقيبة حرف
// كل الأزرار تعمل بطلب المستخدم فقط
// ======================================

function renderPhonemeBagDetailsFromCore(key, pack) {
  const grid = document.getElementById("phonemeCardsGrid");

  if (!grid) return;

  grid.innerHTML = `
    <div style="background:#08111f; color:white; border:2px solid ${pack.colorHex || "#334155"}; border-radius:18px; padding:18px; margin:12px 0; text-align:center; grid-column:1 / -1;">
      <h2 style="color:${pack.colorHex || "#38bdf8"}; margin-top:0; margin-bottom:12px;">
        ${pack.letter || key} — حقيبة ${pack.name || key}
      </h2>

      <button onclick="renderPhonemeCards()" style="margin-bottom:20px; background:#1e293b; color:#f8fafc; border:1px solid #334155;">
        🔙 العودة إلى الحقائب
      </button>

      <p>اللون الإدراكي:
        <b style="color:${pack.colorHex || "#38bdf8"};">
          ${pack.colorName || "غير محدد"}
        </b>
      </p>

      <p style="font-size:14px; color:#cbd5e1;">
        المفتاح البرمجي: <b>${key}</b>
      </p>

      <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:18px;">
        <button onclick="startPerceptualTraining('${key}')">🎙 تدريب</button>
        <button onclick="openReportMenu('signal', '${key}')">🛡️ فحص جودة التسجيل</button>
        <button onclick="testPhonemeColorBinding('${key}')">🎨 اللون</button>
        <button onclick="openReportMenu('memory', '${key}')">🧠 الذاكرة</button>
        <button onclick="openReportMenu('cognitive', '${key}')">🧬 الجينوم</button>
        <button onclick="openReportMenu('timeline', '${key}')">⏳ بناء المسار الزمني</button>
        <button onclick="startPhonemeMatchTest('${key}')">🎯 اختبار</button>
        <button onclick="clearCognitiveMatchResultsLog()">🗑 حذف سجل الاختبارات</button>
      </div>

      <hr style="border-color:#1f2937; margin:18px 0;">

      <div id="unified-report-panel"
           style="display:none; background:#0f172a; border-radius:12px; padding:16px; margin-top:20px; border:1px solid #334155; text-align:right;">

        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #1e293b; padding-bottom:10px;">
          <h3 style="margin:0; color:#38bdf8; font-size:18px;">📊 لوحة التقارير الإدراكية</h3>

          <div style="display:flex; gap:8px;">
            <button onclick="copyCurrentReport()">📋 نسخ التقرير</button>
            <button onclick="copyAllPhonemeReports('${key}')">📚 نسخ الكل</button>
            <button onclick="document.getElementById('unified-report-panel').style.display='none'">❌ إغلاق</button>
          </div>
        </div>

        <div id="unified-report-content"></div>
      </div>

      <button onclick="toggleMatchResultsLog('${key}')"
              style="margin-top:14px; background:#111827; color:#38bdf8; border:1px solid #38bdf8;">
        📊 إظهار سجل الاختبارات
      </button>

      <div id="match-results-log-box" style="display:none; margin-top:15px;"></div>
    </div>
  `;
}


// ======================================
// 9) ربط اللون الإدراكي
// ======================================

window.testPhonemeColorBinding = function (phonemeKey) {
  if (typeof window.bindPhonemeToColor !== "function") {
    alert("دالة bindPhonemeToColor غير موجودة");
    return;
  }

  const result = window.bindPhonemeToColor(phonemeKey);

  if (!result) {
    alert("فشل ربط الحرف باللون: " + phonemeKey);
    return;
  }

  alert(
    "الحرف: " + result.letter +
    "\nاللون: " + result.colorName +
    "\nHEX: " + result.hex
  );
};


// ======================================
// 10) سجل المطابقة
// ======================================

window.toggleMatchResultsLog = function (key) {
  const box = document.getElementById("match-results-log-box");

  if (!box) return;

  if (box.style.display === "none") {
    box.style.display = "block";

    if (typeof window.renderMatchResultsLog === "function") {
      window.renderMatchResultsLog(key);
    } else {
      box.innerHTML =
        "<div style='background:#7f1d1d;color:white;padding:12px;border-radius:10px;'>" +
        "دالة renderMatchResultsLog غير متاحة." +
        "</div>";
    }
  } else {
    box.style.display = "none";
  }
};
