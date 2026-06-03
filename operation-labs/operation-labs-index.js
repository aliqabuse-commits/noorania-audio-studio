// ================================
// operation-labs-index.js
// فهرس غرفة التجارب الإدراكية — تعريف حوكمي فقط
// لا تحميل
// لا تشغيل
// لا فتح تلقائي
// ================================

console.log("🧪 operation-labs-index.js جاهز — Sovereign Frozen Index");

window.NOORANIYA_OPERATION_LABS = {
  name: "operation-labs",
  mode: "frozen-index-only",

  charter: {
    title: "دستور المختبرات",
    law:
      "المختبر لا يملك سلطة الاعتماد؛ التجربة لا تصبح معرفة رسمية إلا إذا أثبتت أثرًا وعادت إلى إدارة وقرار.",
    rules: [
      "المختبر يختبر ولا يعتمد.",
      "كل تجربة يجب أن تخدم سؤالًا معرفيًا واضحًا.",
      "لا ينتقل المختبر إلى إدارة رسمية إلا عبر بوابة الحوكمة.",
      "النتيجة التي لا تغيّر قرارًا تبقى تجربة غير مكتملة.",
      "الفشل في المختبر معرفة إذا كشف نقصًا في القرار أو الإدراك."
    ]
  },

  role:
    "غرفة تجارب لاختبار الفرضيات الصوتية والإدراكية قبل ترقيتها إلى الإدارات الرسمية عبر الحوكمة.",

  files: [
    "operation-labs-index.js",
    "phoneme-merge-split-engine.js",
    "weighted-join-zone.js",
    "operation-labs-app.js"
  ],

  labs: [
    {
      id: "merge-split",
      title: "مختبر الفصل والدمج",
      file: "phoneme-merge-split-engine.js",
      status: "experimental"
    },
    {
      id: "weighted-join-zone",
      title: "مختبر منطقة الاشتباك الموزون",
      file: "weighted-join-zone.js",
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
    "هل التجربة تصلح للترقية إلى إدارة رسمية؟",
    "هل نتيجة المختبر تغيّر قرار الفصل؟",
    "هل نتيجة المختبر تغيّر قرار الدمج؟",
    "هل التجربة قابلة للتكرار؟",
    "هل الأثر حقيقي أم مجرد وصف؟"
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
    "كل تجربة يجب أن تخدم قرارًا.",
    "لا تشغيل تلقائي داخل index.",
    "لا ترقية بلا أثر.",
    "الحوكمة وحدها تعتمد النقل من المختبر إلى الإدارة الرسمية."
  ]
};

window.getOperationLabsIndex = function () {
  return window.NOORANIYA_OPERATION_LABS;
};
