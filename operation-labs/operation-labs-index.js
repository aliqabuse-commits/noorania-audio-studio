// ================================
// operation-labs/operation-labs-index.js
// الفهرس الفرعي لمختبرات التجارب الإدراكية
// ================================

console.log("🗂️ operation-labs-index.js جاهز");

(function () {
  const LAB_SCRIPTS = [
    "operation-labs/weighted-join-zone.js"
  ];

  function loadOperationLabScripts() {
    LAB_SCRIPTS.forEach(function (src) {
      if (document.querySelector('script[src="' + src + '"]')) return;

      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      document.body.appendChild(s);
    });
  }

  function injectOperationLabsButton() {
    const home = document.getElementById("homeView");
    if (!home) return;
    if (document.getElementById("open-operation-labs-btn")) return;

    const btn = document.createElement("button");
    btn.id = "open-operation-labs-btn";
    btn.innerHTML = "🧪 مختبرات التجارب الإدراكية الجديدة";
    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.width = "90%";
    btn.style.background = "#111827";
    btn.style.color = "#a3e635";
    btn.style.border = "1px solid #a3e635";
    btn.style.padding = "12px";
    btn.style.borderRadius = "12px";
    btn.style.cursor = "pointer";
    btn.onclick = openOperationLabsView;

    home.appendChild(btn);
  }

  function injectOperationLabsView() {
    if (document.getElementById("operationLabsView")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const section = document.createElement("section");
    section.id = "operationLabsView";
    section.className = "panel";
    section.style.display = "none";

    section.innerHTML = `
      <h2>🧪 مختبرات التجارب الإدراكية</h2>
      <p>
        واجهة مستقلة للتجارب الجديدة داخل operation-labs دون تعديل المختبر القديم.
      </p>

      <div style="background:#08111f; border:1px solid #a3e635; border-radius:14px; padding:16px; margin:12px 0;">
        <h3 style="color:#a3e635; margin-top:0;">weighted-join-zone.js</h3>
        <p>مختبر منطقة الاشتباك الموزونة لعلاج الرنين أو الصدى الناتج عند دمج الحامل بالمحمول.</p>
        <button onclick="openWeightedJoinZoneLab()" style="background:#365314; color:white; border:1px solid #a3e635; padding:12px; border-radius:10px; cursor:pointer;">
          فتح مختبر منطقة الاشتباك الموزونة
        </button>
      </div>

      <div id="operation-labs-content"></div>

      <button onclick="closeOperationLabsView()">🏠 العودة للرئيسية</button>
    `;

    main.appendChild(section);
  }

  window.openOperationLabsView = function () {
    if (typeof hideAllViews === "function") {
      hideAllViews();
    }

    const view = document.getElementById("operationLabsView");
    if (view) view.style.display = "block";
  };

  window.closeOperationLabsView = function () {
    if (typeof hideAllViews === "function") {
      hideAllViews();
    }

    const home = document.getElementById("homeView");
    if (home) home.style.display = "block";
  };

  document.addEventListener("DOMContentLoaded", function () {
    injectOperationLabsButton();
    injectOperationLabsView();
    loadOperationLabScripts();
  });
})();
