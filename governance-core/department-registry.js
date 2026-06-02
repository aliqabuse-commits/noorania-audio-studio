// ======================================
// governance-core/department-registry.js
// السجل الحي للإدارات — Living Department Registry
// إدارة الحوكمة / السلطة العليا للمشروع
// ======================================

console.log("🏛️ department-registry.js جاهز — السجل الحي للإدارات");

// ======================================
// ميثاق الحوكمة
// ======================================

const GOVERNANCE_CHARTER = {
  motto: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ],

  law:
    "المعرفة التي لا تؤثر في القرار ليست جزءًا من المنظومة بعد. " +
    "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد."
};


// ======================================
// السجل الحي للإدارات
// ======================================

const DEPARTMENT_REGISTRY = {

  governanceCore: {
    id: "governance-core",
    name: "إدارة الحوكمة",
    authority: "السلطة العليا للمشروع",
    mission: "ربط المعرفة بالقرار وحماية الوجهة العامة للمشروع.",

    status: "active",
    maturityLevel: 1,
    lastReview: "2026-06-02",

    produces: [
      "قواعد الحوكمة",
      "سجل الإدارات",
      "خريطة المعرفة والقرار",
      "بوابات القرار",
      "كشف التكرار والانحراف"
    ],

    serves: [
      "جميع الإدارات",
      "جميع القرارات الكبرى",
      "أي أداة ذكاء أو مطور يدخل المشروع"
    ],

    mustPrevent: [
      "معرفة لا يعرف من يستخدمها",
      "قرار لا يراجع المعرفة",
      "إدارة مكررة",
      "ملف بلا أثر",
      "مختبر يتحول إلى معرفة معزولة"
    ],

    nextTargets: [
      "بناء knowledge-decision-map.js",
      "بناء decision-gates.js",
      "ربط كل إدارة بسجلها الحي",
      "إلزام أي إضافة جديدة بسؤال الأثر"
    ]
  },

  phonemeCore: {
    id: "phoneme-core",
    name: "إدارة الحرف",
    mission: "بناء هوية الحرف وصفاته وبصماته ومعرفته الإدراكية.",

    status: "active",
    maturityLevel: 4,
    lastReview: "2026-06-02",

    produces: [
      "هوية الحرف",
      "بصمة الانفجار",
      "الختم الطيفي",
      "النواة النقية",
      "مطابقة الهوية",
      "العائلات والصفات الإدراكية لاحقًا"
    ],

    serves: [
      "تمييز الحروف",
      "الفصل",
      "الدمج",
      "المطابقة",
      "التقييم"
    ],

    currentWeaknesses: [
      "بعض المعرفة مبنية لكنها لم تُلزم قرارات الفصل والدمج بعد.",
      "نحتاج محرك حسم بين الحروف المتشابهة داخل العائلة الواحدة."
    ],

    nextTargets: [
      "تثبيت ba_master_identity",
      "تطوير خريطة العائلات الإدراكية",
      "ربط الهوية بقرارات الفصل والدمج"
    ]
  },

  segmentCore: {
    id: "segment-core",
    name: "إدارة المقاطع",
    mission: "فهم المقطع كتركيب حي: حامل، محمول، رأس، ذيل، ومنطقة اشتباك.",

    status: "active",
    maturityLevel: 2,
    lastReview: "2026-06-02",

    produces: [
      "قرارات الفصل",
      "قرارات الدمج",
      "نماذج الاشتباك",
      "حدود الحامل والمحمول"
    ],

    serves: [
      "إعادة بناء المقاطع",
      "القراءة النورانية",
      "اختبارات الدمج والفصل"
    ],

    currentWeaknesses: [
      "الفصل لا يزال يتأثر أحيانًا بالزمن والقص.",
      "منطقة الاشتباك تحتاج معرفة أعمق من crossfade."
    ],

    nextTargets: [
      "تعريف carrierCore / carrierTailThreads / payloadHeadThreads / payloadCore",
      "ربط الفصل بهوية الحرف",
      "ربط الدمج بمعرفة الاشتباك"
    ]
  },

  analysisCore: {
    id: "analysis-core",
    name: "إدارة التحليل",
    mission: "استخراج القياسات والمؤشرات من الصوت الخام لخدمة الإدارات الأخرى.",

    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-02",

    produces: [
      "قياسات الطاقة",
      "ZCR",
      "الطيف",
      "بداية الانفجار",
      "مناطق مرشحة"
    ],

    serves: [
      "إدارة الحرف",
      "إدارة المقاطع",
      "إدارة الذاكرة"
    ],

    currentWeaknesses: [
      "يجب ألا تبقى تقارير التحليل معزولة.",
      "كل قياس يجب أن يُربط بقرار أو معرفة أعلى."
    ],

    nextTargets: [
      "تحديد أي نتائج التحليل تدخل في الهوية",
      "تحديد أي نتائج التحليل تدخل في الفصل",
      "منع التحليل الوصفي بلا أثر"
    ]
  },

  memoryCore: {
    id: "memory-core",
    name: "إدارة الذاكرة",
    mission: "حفظ المعرفة المتراكمة والإحصاءات وسجلات الالتباس والتجارب.",

    status: "forming",
    maturityLevel: 1,
    lastReview: "2026-06-02",

    produces: [
      "ذاكرة إحصائية",
      "مصفوفة الالتباس",
      "سجلات التجارب",
      "حدود القيم الطبيعية"
    ],

    serves: [
      "الحسم الإدراكي",
      "المطابقة",
      "الفصل",
      "التقييم"
    ],

    currentWeaknesses: [
      "الذاكرة موجودة جزئيًا لكنها ليست سلطة ملزمة على القرار بعد."
    ],

    nextTargets: [
      "تثبيت cognitive-confusion-matrix.js داخل memory-core",
      "بناء ذاكرة إحصائية لكل حرف وحالة",
      "ربط الذاكرة بمحرك الحسم"
    ]
  },

  operationLabs: {
    id: "operation-labs",
    name: "إدارة المختبرات",
    mission: "تجريب الأفكار قبل اعتمادها في الإدارات المركزية.",

    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-02",

    produces: [
      "نماذج اختبارية",
      "نتائج تجارب",
      "أدلة فشل أو نجاح"
    ],

    serves: [
      "إدارة الحوكمة",
      "إدارة المقاطع",
      "إدارة الحرف"
    ],

    currentWeaknesses: [
      "يجب ألا تتحول المختبرات إلى مصدر معرفة معزولة.",
      "كل نتيجة مختبر يجب أن تعود إلى إدارة حقيقية أو قرار حقيقي."
    ],

    nextTargets: [
      "ربط كل مختبر بسؤال معرفي واضح",
      "منع إنشاء مختبر جديد قبل معرفة أثره",
      "تحويل نتائج المختبرات الناجحة إلى محركات مركزية"
    ]
  }

};


// ======================================
// أدوات قراءة السجل
// ======================================

function getDepartmentRegistry() {
  return DEPARTMENT_REGISTRY;
}

function getDepartmentById(id) {
  return Object.values(DEPARTMENT_REGISTRY).find(function (dept) {
    return dept.id === id;
  }) || null;
}

function listDepartments() {
  return Object.values(DEPARTMENT_REGISTRY).map(function (dept) {
    return {
      id: dept.id,
      name: dept.name,
      status: dept.status,
      maturityLevel: dept.maturityLevel,
      lastReview: dept.lastReview
    };
  });
}


// ======================================
// فحص حوكمي أولي للإدارة
// ======================================

function auditDepartment(id) {
  const dept = getDepartmentById(id);

  if (!dept) {
    return {
      ok: false,
      message: "الإدارة غير موجودة في السجل الحي: " + id
    };
  }

  const warnings = [];

  if (!dept.produces || !dept.produces.length) {
    warnings.push("الإدارة لا تعلن المعرفة التي تنتجها.");
  }

  if (!dept.serves || !dept.serves.length) {
    warnings.push("الإدارة لا تعلن القرارات أو الإدارات التي تخدمها.");
  }

  if (!dept.nextTargets || !dept.nextTargets.length) {
    warnings.push("الإدارة لا تملك أهداف نمو قادمة.");
  }

  return {
    ok: warnings.length === 0,
    department: dept.name,
    warnings
  };
}


// ======================================
// تصدير عام
// ======================================

window.GOVERNANCE_CHARTER = GOVERNANCE_CHARTER;
window.DEPARTMENT_REGISTRY = DEPARTMENT_REGISTRY;

window.getDepartmentRegistry = getDepartmentRegistry;
window.getDepartmentById = getDepartmentById;
window.listDepartments = listDepartments;
window.auditDepartment = auditDepartment;
