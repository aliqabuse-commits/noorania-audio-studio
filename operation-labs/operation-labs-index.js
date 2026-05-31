// ================================
// operation-labs/operation-labs-index.js
// غرفة التجارب الإدراكية — الفهرس الفرعي لمجلد operation-labs
// مهمته تحميل ملفات هذا المجلد فقط دون تغيير منطق المختبرات
// ================================

console.log("🧪 operation-labs-index.js جاهز — مدير ملفات غرفة التجارب الإدراكية");

(function () {

  // ======================================
  // 1) ملفات المختبرات داخل operation-labs
  // لا تُربط هذه الملفات مباشرة من index.html الرئيسي
  // ======================================
  const OPERATION_LABS_SCRIPTS = [
    "operation-labs/phoneme-merge-split-engine.js",
    "operation-labs/weighted-join-zone.js"
  ];

  // ======================================
  // 2) تحميل ملف واحد دون تكرار
  // ======================================
  function loadOperationLabScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        console.log("ℹ️ الملف محمّل مسبقًا:", src);
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

  // ======================================
  // 3) تحميل ملفات المختبرات بالترتيب
  // مهم: المختبر القديم أولًا لأن المختبرات الجديدة قد تستفيد من أدواته
  // ======================================
  async function loadOperationLabsScripts() {
    for (const src of OPERATION_LABS_SCRIPTS) {
      await loadOperationLabScript(src);
    }
  }

  // ======================================
  // 4) فحص وجود الغرفة والواجهات
  // هذه الواجهات أصبحت في index.html
  // لذلك لا ننشئها هنا إلا كاحتياط فقط
  // ======================================
  function ensureOperationLabsFallbacks() {
    const main = document.querySelector("main");
    if (!main) return;

    // احتياط: لو لم تكن غرفة التجارب موجودة في index.html
    if (!document.getElementById("cognitiveExperimentsRoomView")) {
      const section = document.createElement("section");
      section.id = "cognitiveExperimentsRoomView";
      section.className = "panel";
      section.style.display = "none";

      section.innerHTML = `
        <h2>🧪 غرفة التجارب الإدراكية</h2>
        <p style="line-height:1.8;">
          هذه غرفة احتياطية أنشأها الفهرس الفرعي لأن الصفحة الأصلية غير موجودة.
        </p>

        <button onclick="openMergeSplitView()" style="display:block; margin:10px auto; width:90%;">
          🧩 مختبر الفصل والدمج
        </button>

        <button onclick="openWeightedJoinZoneLabFromRoom()" style="display:block; margin:10px auto; width:90%;">
          ⚖️ مختبر منطقة الاشتباك الموزونة
        </button>

        <button onclick="closeCognitiveExperimentsRoom()">🏠 العودة للرئيسية</button>
      `;

      main.appendChild(section);
    }

    // احتياط: لو لم تكن صفحة المختبر الجديد موجودة في index.html
    if (!document.getElementById("weightedJoinZoneView")) {
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
  }

  // ======================================
  // 5) دوال مساعدة لا تلمس منطق المختبر القديم
  // ======================================
  window.openWeightedJoinZoneLabFromRoom = function () {
    if (typeof hideAllViews === "function") {
      hideAllViews();
    }

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
    if (typeof hideAllViews === "function") {
      hideAllViews();
    }

    const room = document.getElementById("cognitiveExperimentsRoomView");
    if (room) {
      room.style.display = "block";
      return;
    }

    const home = document.getElementById("homeView");
    if (home) {
      home.style.display = "block";
    }
  };

  // ======================================
  // 6) التشغيل الأول
  // ======================================
  document.addEventListener("DOMContentLoaded", async function () {
    ensureOperationLabsFallbacks();

    try {
      await loadOperationLabsScripts();
    } catch (err) {
      console.error("❌ فشل تحميل ملفات operation-labs", err);
      alert("فشل تحميل ملفات غرفة التجارب الإدراكية:\n" + err.message);
    }
  });

})();
