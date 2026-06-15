// ================================
// operation-labs/operation-labs-index.js
// فهرس إدارة المختبرات
// تعريف + تحميل ملفات الإدارة فقط
// لا يفتح صفحة
// لا يبني أزرار
// لا يشغل محركات
// لا يستدعي runOperationLabsApp تلقائيًا
// ================================

console.log("🧪 operation-labs-index.js جاهز — Safe Department Index");

window.NOORANIYA_OPERATION_LABS = {
  name: "operation-labs",
  mode: "safe-department-index",
  status: "experimental",

  charter: {
    title: "دستور المختبرات",
    law:
      "المختبر لا يعتمد المعرفة؛ التجربة لا تصبح رسمية إلا إذا أثبتت أثرًا وعادت إلى إدارة وقرار."
  },

  role:
    "غرفة تجارب لاختبار الفرضيات الصوتية والإدراكية قبل اعتمادها في الإدارات الرسمية عبر الحوكمة.",

  files: [
  
  "operation-labs/phoneme-merge-split-engine.js",
  "operation-labs/weighted-join-zone.js",
  "operation-labs/operation-labs-app.js"
],

  labs: [
    {
      id: "merge-split",
      title: "مختبر الفصل والدمج",
      file: "operation-labs/phoneme-merge-split-engine.js",
      openFunction: "openMergeSplitView",
      status: "experimental"
    },
    {
      id: "weighted-join-zone",
      title: "مختبر منطقة الاشتباك الموزون",
      file: "operation-labs/weighted-join-zone.js",
      openFunction: "openWeightedJoinZoneView",
      status: "experimental"
    }
  ],

  knowledge: [
    "merge-split-experiment",
    "weighted-join-zone",
    "carrier-payload-interaction",
    "experimental-join-units",
    "failure-evidence",
    "success-evidence"
  ],

  decisions: [
    "هل التجربة تصلح للترقية؟",
    "هل النتيجة تغيّر قرار الفصل؟",
    "هل النتيجة تغيّر قرار الدمج؟",
    "هل التجربة قابلة للتكرار؟",
    "هل الأثر حقيقي أم وصف؟",
    "هل المختبر يخدم سؤالًا معرفيًا واضحًا؟"
  ],

  serves: [
    "governance-core",
    "segment-core",
    "phoneme-core",
    "training-core",
    "analysis-core"
  ],

  principles: [
    "المختبر يختبر ولا يعتمد.",
    "لا ترقية بلا أثر.",
    "الفشل معرفة إذا كشف نقصًا.",
    "كل مختبر يخدم سؤالًا معرفيًا.",
    "الحوكمة وحدها تعتمد النقل إلى الإدارة الرسمية.",
    "index الفرعي يعرف ويحمّل فقط.",
    "الأزرار والبطاقات من اختصاص operation-labs-app.js.",
    "المحركات تعمل عند الطلب فقط."
  ]
};

function loadOperationLabsScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="' + src + '"]')) {
      resolve({
        src: src,
        status: "already-loaded"
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      resolve({
        src: src,
        status: "loaded"
      });
    };

    script.onerror = function () {
      reject(new Error("فشل تحميل ملف إدارة المختبرات: " + src));
    };

    document.body.appendChild(script);
  });
}

window.loadOperationLabs = async function () {
  const report = {
    department: "operation-labs",
    mode: "load-only",
    loaded: [],
    errors: [],
    note:
      "تم تحميل ملفات إدارة المختبرات فقط دون فتح واجهة أو بناء أزرار أو تشغيل app أو محركات."
  };

  for (const src of window.NOORANIYA_OPERATION_LABS.files) {
    try {
      const result = await loadOperationLabsScript(src);
      report.loaded.push(result);
    } catch (err) {
      report.errors.push(err.message);
    }
  }

  report.ok = report.errors.length === 0;

  console.log("🧪 تقرير تحميل إدارة المختبرات:", report);
  return report;
};

window.getOperationLabsIndex = function () {
  return window.NOORANIYA_OPERATION_LABS;
};
