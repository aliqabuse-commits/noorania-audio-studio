// ================================
// operation-labs/operation-labs-index.js
// غرفة التجارب الإدراكية — الفهرس الفرعي لمجلد operation-labs
// يدير قائمة المختبرات وتحميلها وفتحها فقط
// ولا يحتوي منطق أي مختبر
// ================================

console.log("🧪 operation-labs-index.js جاهز — الفهرس الفرعي");

(function () {

  const OPERATION_LABS = [
    {
      id: "merge-split",
      title: "🧩 مختبر الفصل والدمج",
      description: "المختبر المرجعي الحالي كما هو دون تغيير منطقه.",
      script: "operation-labs/phoneme-merge-split-engine.js",
      openFunction: "openMergeSplitView"
    },
    {
      id: "weighted-join-zone",
      title: "⚖️ مختبر منطقة الاشتباك الموزون",
      description: "امتداد للمختبر السابق يضيف اختبار منطقة الاشتباك الموزون.",
      script: "operation-labs/weighted-join-zone.js",
      openFunction: "openWeightedJoinZoneView"
    }
  ];

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
    for (const lab of OPERATION_LABS) {
      await loadOperationLabScript(lab.script);
    }
  }

  function renderOperationLabsRoom() {
    const grid = document.getElementById("operation-labs-grid");
    if (!grid) return;

    grid.innerHTML = "";

    OPERATION_LABS.forEach(function (lab) {
      const card = document.createElement("div");

      card.style.background = "#08111f";
      card.style.border = "1px solid #334155";
      card.style.borderRadius = "14px";
      card.style.padding = "16px";

      card.innerHTML = `
        <h3 style="margin-top:0;color:#a3e635;">
          ${lab.title}
        </h3>

        <p style="line-height:1.8;color:#cbd5e1;">
          ${lab.description}
        </p>

        <button style="
          background:#0f172a;
          color:white;
          border:1px solid #a3e635;
          padding:12px;
          border-radius:10px;
          cursor:pointer;
          width:100%;
          font-weight:bold;
        ">
          فتح ${lab.title}
        </button>
      `;

      const btn = card.querySelector("button");

      btn.onclick = function () {
        const fn = window[lab.openFunction];

        if (typeof fn === "function") {
          fn();
        } else {
          alert("لم يتم العثور على دالة فتح المختبر:\n" + lab.openFunction);
        }
      };

      grid.appendChild(card);
    });
  }

  window.renderOperationLabsRoom = renderOperationLabsRoom;

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      await loadOperationLabsScripts();
      renderOperationLabsRoom();
    } catch (err) {
      console.error("❌ فشل تحميل مختبرات operation-labs", err);
      alert("فشل تحميل مختبرات operation-labs:\n" + err.message);
    }
  });

})();
