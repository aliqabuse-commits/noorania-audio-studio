// ================================
// operation-labs/operation-labs-index.js
// غرفة التجارب الإدراكية — الفهرس الفرعي لمجلد operation-labs
// مهمته الربط والإدارة فقط دون تغيير منطق المختبرات
// ================================

console.log("🧪 operation-labs-index.js جاهز — غرفة التجارب الإدراكية");

(function () {

  // ======================================
  // 1) ملفات المختبرات داخل هذا المجلد
  // لا تُربط هذه الملفات مباشرة من index.html الرئيسي
  // ======================================
  const OPERATION_LABS_SCRIPTS = [
    "operation-labs/phoneme-merge-split-engine.js",
    "operation-labs/weighted-join-zone.js"
  ];

  // ======================================
  // 2) تحميل ملفات المختبرات دون إعادة تحميل المكرر
  // ======================================
  function loadOperationLabScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;

      script.onload = function () {
        console.log("✅ تم تحميل:", src);
        resolve();
      };

      script.onerror = function () {
        reject(new Error("فشل تحميل الملف: " + src));
      };

      document.body.appendChild(script);
    });
  }

  async function loadOperationLabsScripts() {
    for (const src of OPERATION_LABS_SCRIPTS) {
      await loadOperationLabScript(src);
    }
  }

  // ======================================
  // 3) إخفاء الصفحات دون حذفها أو تعديلها
  // ======================================
  function hideOperationPages() {
    const ids = [
      "homeView",
      "perceptualTrainingView",
      "recordView",
      "cognitiveStatisticsView",
      "mergeSplitView",
      "cognitiveExperimentsRoomView",
      "weightedJoinZoneView"
    ];

    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "none";
      }
    });
  }

  // ======================================
  // 4) زر غرفة التجارب الإدراكية في الرئيسية
  // ======================================
  function injectCognitiveExperimentsRoomButton() {
    const home = document.getElementById("homeView");
    if (!home) return;

    if (document.getElementById("open-cognitive-experiments-room-btn")) {
      return;
    }

    const btn = document.createElement("button");

    btn.id = "open-cognitive-experiments-room-btn";
    btn.innerHTML = "🧪 غرفة التجارب الإدراكية";

    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.width = "90%";
    btn.style.background = "#0f172a";
    btn.style.color = "#a3e635";
    btn.style.border = "1px solid #a3e635";
    btn.style.padding = "12px";
    btn.style.borderRadius = "12px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";

    btn.onclick = openCognitiveExperimentsRoom;

    home.appendChild(btn);
  }

  // ======================================
  // 5) صفحة غرفة التجارب الإدراكية
  // ======================================
  function injectCognitiveExperimentsRoomView() {
    if (document.getElementById("cognitiveExperimentsRoomView")) {
      return;
    }

    const main = document.querySelector("main");
    if (!main) return;

    const section = document.createElement("section");

    section.id = "cognitiveExperimentsRoomView";
    section.className = "panel";
    section.style.display = "none";

    section.innerHTML = `
      <h2>🧪 غرفة التجارب الإدراكية</h2>

      <p style="line-height:1.8;">
        هذه الصفحة هي بوابة مستقلة لمختبرات مجلد
        <b>operation-labs</b>.
        لا تغيّر منطق المختبرات، ولا تستبدل الملفات القديمة.
      </p>

      <div style="
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
        gap:14px;
        margin:18px 0;
      ">

        <div style="
          background:#08111f;
          border:1px solid #38bdf8;
          border-radius:14px;
          padding:16px;
        ">
          <h3 style="color:#38bdf8;margin-top:0;">
            🧩 مختبر الفصل والدمج
          </h3>

          <p style="line-height:1.8;">
            المختبر الحالي كما هو.
            لا يتم تغيير واجهته ولا منطقه ولا دواله.
          </p>

          <button onclick="openLegacyMergeSplitLabFromRoom()" style="
            background:#0ea5e9;
            color:white;
            border:none;
            padding:12px;
            border-radius:10px;
            cursor:pointer;
            width:100%;
            font-weight:bold;
          ">
            فتح مختبر الفصل والدمج
          </button>
        </div>

        <div style="
          background:#111827;
          border:1px solid #a3e635;
          border-radius:14px;
          padding:16px;
        ">
          <h3 style="color:#a3e635;margin-top:0;">
            ⚖️ مختبر منطقة الاشتباك الموزونة
          </h3>

          <p style="line-height:1.8;">
            مختبر جديد لمعالجة الرنين أو الصدى الناتج عند الدمج
            دون المساس بالمختبر السابق.
          </p>

          <button onclick="openWeightedJoinZoneLabFromRoom()" style="
            background:#365314;
            color:white;
            border:1px solid #a3e635;
            padding:12px;
            border-radius:10px;
            cursor:pointer;
            width:100%;
            font-weight:bold;
          ">
            فتح المختبر الجديد
          </button>
        </div>

      </div>

      <button onclick="closeCognitiveExperimentsRoom()">
        🏠 العودة للرئيسية
      </button>
    `;

    main.appendChild(section);
  }

  // ======================================
  // 6) صفحة المختبر الجديد فقط
  // لا علاقة لها بالمختبر القديم
  // ======================================
  function injectWeightedJoinZoneView() {
    if (document.getElementById("weightedJoinZoneView")) {
      return;
    }

    const main = document.querySelector("main");
    if (!main) return;

    const section = document.createElement("section");

    section.id = "weightedJoinZoneView";
    section.className = "panel";
    section.style.display = "none";

    section.innerHTML = `
      <div id="weighted-join-zone-root">
        جاري تجهيز مختبر منطقة الاشتباك الموزونة...
      </div>
    `;

    main.appendChild(section);
  }

  // ======================================
  // 7) فتح وإغلاق الغرفة
  // ======================================
  window.openCognitiveExperimentsRoom = function () {
    hideOperationPages();

    const view = document.getElementById("cognitiveExperimentsRoomView");
    if (view) {
      view.style.display = "block";
    }
  };

  window.closeCognitiveExperimentsRoom = function () {
    hideOperationPages();

    const home = document.getElementById("homeView");
    if (home) {
      home.style.display = "block";
    }
  };

  // ======================================
  // 8) فتح المختبر القديم كما هو
  // لا نعيد بناءه ولا نغير منطقه
  // ======================================
  window.openLegacyMergeSplitLabFromRoom = function () {
    hideOperationPages();

    if (typeof openMergeSplitView === "function") {
      openMergeSplitView();
      return;
    }

    const view = document.getElementById("mergeSplitView");
    if (view) {
      view.style.display = "block";
    } else {
      alert("لم يتم العثور على واجهة مختبر الفصل والدمج.");
    }
  };

  // ======================================
  // 9) فتح المختبر الجديد
  // ======================================
  window.openWeightedJoinZoneLabFromRoom = function () {
    hideOperationPages();

    const view = document.getElementById("weightedJoinZoneView");
    if (view) {
      view.style.display = "block";
    }

    if (typeof renderWeightedJoinZoneLab === "function") {
      renderWeightedJoinZoneLab();
    } else {
      const root = document.getElementById("weighted-join-zone-root");
      if (root) {
        root.innerHTML =
          "⚠️ لم يتم تحميل ملف weighted-join-zone.js أو لم يتم تعريف renderWeightedJoinZoneLab.";
      }
    }
  };

  window.closeWeightedJoinZoneView = function () {
    openCognitiveExperimentsRoom();
  };

  // ======================================
  // 10) التشغيل الأول
  // ======================================
  document.addEventListener("DOMContentLoaded", async function () {
    injectCognitiveExperimentsRoomButton();
    injectCognitiveExperimentsRoomView();
    injectWeightedJoinZoneView();

    try {
      await loadOperationLabsScripts();
    } catch (err) {
      console.error("❌ فشل تحميل ملفات operation-labs", err);
      alert("فشل تحميل ملفات غرفة التجارب الإدراكية:\n" + err.message);
    }
  });

})();
