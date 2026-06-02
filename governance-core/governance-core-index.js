// ======================================
// governance-core/governance-core-index.js
// فهرس إدارة الحوكمة
// تحميل ملفات السلطة العليا للمشروع بالترتيب الصحيح
// ======================================

console.log("🏛️ governance-core-index.js جاهز — فهرس إدارة الحوكمة");


// ======================================
// 1) قائمة ملفات الحوكمة
// الترتيب مهم جدًا
// ======================================

const GOVERNANCE_CORE_FILES = [
  "governance-core/department-registry.js",
  "governance-core/knowledge-decision-map.js",
  "governance-core/decision-gates.js",
  "governance-core/governance-core-app.js"
];


// ======================================
// 2) تحميل ملف JS مرة واحدة فقط
// ======================================

function loadGovernanceScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="' + src + '"]')) {
      console.log("ℹ️ ملف الحوكمة محمّل مسبقًا:", src);
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      console.log("✅ تم تحميل ملف الحوكمة:", src);
      resolve();
    };

    script.onerror = function () {
      reject(new Error("فشل تحميل ملف الحوكمة: " + src));
    };

    document.body.appendChild(script);
  });
}


// ======================================
// 3) تحميل إدارة الحوكمة كاملة
// ======================================

async function loadGovernanceCore() {
  for (const src of GOVERNANCE_CORE_FILES) {
    await loadGovernanceScript(src);
  }

  console.log("🏛️ تم تحميل إدارة الحوكمة كاملة.");

  if (typeof runGovernanceAudit === "function") {
    const report = runGovernanceAudit();
    console.log("🧭 تقرير الحوكمة الأولي:", report);
  }
}


// ======================================
// 4) تشغيل تلقائي عند جاهزية الصفحة
// ======================================

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await loadGovernanceCore();
  } catch (err) {
    console.error("❌ فشل تحميل إدارة الحوكمة", err);
    alert("فشل تحميل إدارة الحوكمة:\n" + err.message);
  }
});


// ======================================
// 5) تصدير عام
// ======================================

window.GOVERNANCE_CORE_FILES = GOVERNANCE_CORE_FILES;
window.loadGovernanceScript = loadGovernanceScript;
window.loadGovernanceCore = loadGovernanceCore;
