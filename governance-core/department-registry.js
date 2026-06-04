// ======================================
// governance-core/department-registry.js
// السجل الحي للإدارات — Living Department Registry
// إدارة الحوكمة / السلطة العليا للمشروع
// نسخة محدثة بعد إدخال خريطة العائلة والذاكرة التراكمية
// ======================================

console.log("🏛️ department-registry.js جاهز — V3 Living Governance Registry");


// ======================================
// 1) ميثاق الحوكمة
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
    "والقرار الذي لا يراجع المعرفة المتاحة ليس قرارًا إدراكيًا بعد.",

  integrationLaw:
    "كل ملف جديد أو منقول يجب أن يظهر أثره في: الإدارة المالكة، الاندكس الفرعي، خريطة المعرفة والقرار، وبوابات الحوكمة عند الحاجة."
};


// ======================================
// 2) السجل الحي للإدارات
// ======================================

const DEPARTMENT_REGISTRY = {
  governanceCore: {
    order: 1,
    id: "governance-core",
    name: "إدارة الحوكمة",
    authority: "السلطة العليا للمشروع",
    mission: "ربط المعرفة بالقرار وحماية الوجهة العامة ومنع مرور المهام من خلف العداد.",
    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-04",

    indexFile: "governance-core/governance-core-index.js",
    appFile: "governance-core/governance-core-app.js",

    produces: [
      "قواعد الحوكمة",
      "سجل الإدارات",
      "خريطة المعرفة والقرار",
      "بوابات القرار",
      "حراس التدقيق",
      "كشف المعرفة اليتيمة",
      "كشف انحراف الاندكس عن الحوكمة"
    ],

    serves: [
      "جميع الإدارات",
      "جميع القرارات الكبرى",
      "project-index",
      "main-orchestrator",
      "أي أداة ذكاء أو مطور يدخل المشروع"
    ],

    mustPrevent: [
      "معرفة لا يعرف من يستخدمها",
      "قرار لا يراجع المعرفة",
      "ملف موجود في الاندكس ولا يظهر في الحوكمة",
      "معرفة في الحوكمة لا يحمّلها أي اندكس",
      "إدارة مكررة",
      "ملف بلا أثر",
      "مختبر يتحول إلى معرفة معزولة"
    ],

    nextTargets: [
      "جعل كل إضافة تمر ببطاقة أثر حوكمي",
      "مطابقة الاندكسات الفرعية مع خريطة المعرفة والقرار",
      "إلزام اختبار المطابقة بذكر العائلة والمنافس والهامش والذاكرة"
    ]
  },

  phonemeCore: {
    order: 2,
    id: "phoneme-core",
    name: "إدارة الحرف",
    mission: "بناء هوية الحرف وصفاته وبصماته وذاكرته وجينومه وعائلته الإدراكية بما يخدم المطابقة والفصل والتمييز.",
    status: "active",
    maturityLevel: 5,
    lastReview: "2026-06-04",

    indexFile: "phoneme-core/phoneme-core-index.js",
    appFile: "phoneme-core/phoneme-core-app.js",

    produces: [
      "حقيبة الحرف",
      "ألوان الحروف",
      "ذاكرة لون الحرف",
      "فحص جودة الإشارة للحرف",
      "ذاكرة إدراكية للحرف",
      "ذاكرة تراكمية للحرف",
      "خريطة العائلة الإدراكية",
      "الجينوم المركزي",
      "الجينوم الزمني",
      "هوية الحالة الصوتية",
      "بصمة الانفجار",
      "الختم الطيفي",
      "النواة النقية",
      "المحمول المشترك",
      "مطابقة الهوية",
      "سجل اختبارات المطابقة"
    ],

    serves: [
      "تمييز الحروف",
      "مطابقة الحروف",
      "اختبار العائلة الإدراكية",
      "الفصل",
      "الدمج",
      "تقييم القراءة",
      "الذاكرة التراكمية",
      "الحوكمة"
    ],

    currentWeaknesses: [
      "بعض مؤشرات المطابقة ما زالت تعطي نجاحًا تشغيليًا بلا هامش فصل كافٍ.",
      "يلزم منع اعتماد نتيجة صحيحة ظاهريًا إذا لم تراجع العائلة والذاكرة التراكمية.",
      "بعض ملفات التحليل مؤقتًا داخل phoneme-core حتى انعقاد المجلس."
    ],

    nextTargets: [
      "إلزام phoneme-match-engine بخريطة العائلة الإدراكية",
      "إلزام قرار المطابقة بمراجعة الذاكرة التراكمية",
      "تمييز الحكم التشغيلي عن الحكم الإدراكي المعتمد",
      "تثبيت genomeByState بدل الاكتفاء بجينوم عام"
    ]
  },

  segmentCore: {
    order: 3,
    id: "segment-core",
    name: "إدارة المقاطع",
    mission: "فهم المقطع كتركيب حي: حامل، محمول، رأس، ذيل، ومنطقة اشتباك.",
    status: "active",
    maturityLevel: 2,
    lastReview: "2026-06-04",

    indexFile: "segment-core/segment-core-index.js",
    appFile: "segment-core/segment-core-app.js",

    produces: [
      "قرارات الفصل",
      "قرارات الدمج",
      "نماذج الاشتباك",
      "حدود الحامل والمحمول",
      "استخراج المحمول",
      "قفل المحمول",
      "تنقية المحمول"
    ],

    serves: [
      "إعادة بناء المقاطع",
      "القراءة النورانية",
      "اختبارات الدمج والفصل",
      "إدارة الحرف",
      "إدارة الذاكرة"
    ],

    currentWeaknesses: [
      "الفصل لا يزال يحتاج ربطًا أقوى بهوية الحرف وعائلته.",
      "منطقة الاشتباك تحتاج معرفة أعمق من القص والزمن."
    ],

    nextTargets: [
      "ربط الفصل بهوية الحرف والجينوم الزمني",
      "ربط الدمج بمعرفة الاشتباك",
      "إرسال نتائج الفصل إلى الذاكرة التراكمية عند الحاجة"
    ]
  },

  analysisCore: {
    order: 4,
    id: "analysis-core",
    name: "إدارة التحليل",
    mission: "استخراج القياسات والمؤشرات من الصوت الخام لخدمة الإدراك والفصل دون أن تنفرد بالحكم.",
    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-04",

    indexFile: "analysis-core/analysis-core-index.js",
    appFile: "analysis-core/analysis-core-app.js",

    produces: [
      "بداية الحدث الصوتي",
      "قياسات الطاقة",
      "ZCR",
      "مؤشرات طيفية",
      "أدلة صوتية مساندة"
    ],

    serves: [
      "إدارة الحرف",
      "إدارة المقاطع",
      "إدارة الذاكرة",
      "إدارة التدريب",
      "إدارة الحوكمة"
    ],

    currentWeaknesses: [
      "بعض ملفات التحليل لا تزال مؤقتًا ضمن phoneme-core حتى قرار المجلس.",
      "كل قياس يجب أن يرتبط بقرار لا بوصف منفصل."
    ],

    nextTargets: [
      "تحديد أي نتائج التحليل تدخل في الهوية",
      "تحديد أي نتائج التحليل تدخل في الفصل",
      "منع التحليل الوصفي بلا أثر"
    ]
  },

  memoryCore: {
    order: 5,
    id: "memory-core",
    name: "إدارة الذاكرة",
    mission: "حفظ المعرفة المتراكمة والإحصاءات وسجلات الالتباس والتجارب وتحويلها إلى سلطة مراجعة للقرار.",
    status: "forming",
    maturityLevel: 2,
    lastReview: "2026-06-04",

    indexFile: "memory-core/memory-core-index.js",
    appFile: "memory-core/memory-core-app.js",

    produces: [
      "ذاكرة إحصائية",
      "مصفوفة الالتباس",
      "سجلات التجارب",
      "حدود القيم الطبيعية",
      "أنماط الخطأ المتكرر",
      "تغذية راجعة للقرار"
    ],

    serves: [
      "الحسم الإدراكي",
      "المطابقة",
      "الفصل",
      "التقييم",
      "تحسين الذاكرة",
      "الحوكمة"
    ],

    currentWeaknesses: [
      "الذاكرة التراكمية للحرف موجودة حاليًا داخل phoneme-core حتى قرار المجلس.",
      "الذاكرة يجب أن تصبح سلطة ملزمة على القرار لا أرشيفًا فقط."
    ],

    nextTargets: [
      "ربط الالتباس المتكرر بقرارات إعادة التدريب",
      "تثبيت حدود طبيعية لكل حرف وحالة",
      "التحضير لاحقًا لنقل الذاكرة التراكمية من phoneme-core إلى memory-core إذا قرر المجلس"
    ]
  },

  trainingCore: {
    order: 6,
    id: "training-core",
    name: "إدارة التدريب والتسجيل",
    mission: "إدارة التسجيل والتدريب وتجهيز العينات الصوتية قبل دخولها إلى الإدراك والتحليل.",
    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-04",

    indexFile: "training-core/training-core-index.js",
    appFile: "training-core/training-core-app.js",

    produces: [
      "تسجيل تدريبي خام",
      "حالة التسجيل",
      "موجة صوتية مرئية",
      "حفظ العينة",
      "تجهيز عينة التدريب"
    ],

    serves: [
      "إدارة الحرف",
      "إدارة التحليل",
      "إدارة الذاكرة",
      "إدارة المقاطع",
      "إدارة الحوكمة"
    ],

    currentWeaknesses: [
      "لا يجوز أن يتحول التدريب إلى حكم على الهوية.",
      "أي تسجيل بلا بداية ونهاية واضحتين يضعف القرار اللاحق."
    ],

    nextTargets: [
      "تثبيت تجربة التسجيل بعد تحديث الصفحة",
      "إظهار نجاح أو فشل الحفظ بوضوح",
      "إرسال حالة التسجيل إلى بوابات القرار"
    ]
  },

  operationLabs: {
    order: 7,
    id: "operation-labs",
    name: "إدارة المختبرات",
    mission: "تجريب الأفكار قبل اعتمادها في الإدارات المركزية، مع منع تحول التجربة إلى معرفة رسمية بلا بوابة.",
    status: "active",
    maturityLevel: 3,
    lastReview: "2026-06-04",

    indexFile: "operation-labs/operation-labs-index.js",
    appFile: "operation-labs/operation-labs-app.js",

    produces: [
      "نماذج اختبارية",
      "نتائج تجارب",
      "أدلة فشل أو نجاح",
      "تجارب فصل ودمج",
      "تجارب منطقة اشتباك"
    ],

    serves: [
      "إدارة الحوكمة",
      "إدارة المقاطع",
      "إدارة الحرف",
      "إدارة الذاكرة"
    ],

    currentWeaknesses: [
      "كل نتيجة مختبر يجب أن تعود إلى إدارة حقيقية أو قرار حقيقي.",
      "لا يجوز للمختبر أن يصبح مسارًا موازيًا خارج الحوكمة."
    ],

    nextTargets: [
      "ربط كل مختبر بسؤال معرفي واضح",
      "منع اعتماد نتيجة مختبر قبل أثرها",
      "تحويل نتائج المختبرات الناجحة إلى محركات مركزية بقرار حوكمي"
    ]
  }
};


// ======================================
// 3) سجل الإدارات الديناميكي الذي يرسله كل index فرعي
// ======================================

const RUNTIME_DEPARTMENT_REGISTRY = {};


// ======================================
// 4) أدوات قراءة السجل
// ======================================

function getDepartmentRegistry() {
  return DEPARTMENT_REGISTRY;
}


function getDepartmentById(id) {
  return Object.values(DEPARTMENT_REGISTRY).find(function (dept) {
    return dept.id === id;
  }) || null;
}


function getDepartmentRecord(id) {
  return getDepartmentById(id);
}


function getOrderedDepartments() {
  return Object.values(DEPARTMENT_REGISTRY).sort(function (a, b) {
    return Number(a.order || 999) - Number(b.order || 999);
  });
}


function listDepartments() {
  return getOrderedDepartments().map(function (dept) {
    return {
      id: dept.id,
      name: dept.name,
      status: dept.status,
      maturityLevel: dept.maturityLevel,
      lastReview: dept.lastReview,
      indexFile: dept.indexFile,
      appFile: dept.appFile
    };
  });
}


function registerDepartment(indexObject) {
  if (!indexObject || !indexObject.name) {
    return {
      ok: false,
      message: "لا يمكن تسجيل إدارة بلا name داخل الاندكس."
    };
  }

  RUNTIME_DEPARTMENT_REGISTRY[indexObject.name] = {
    id: indexObject.name,
    mode: indexObject.mode || "unknown",
    files: indexObject.files || [],
    knowledge: indexObject.knowledge || [],
    decisions: indexObject.decisions || [],
    serves: indexObject.serves || [],
    registeredAt: new Date().toISOString()
  };

  return {
    ok: true,
    message: "تم تسجيل الاندكس الفرعي في السجل الديناميكي.",
    department: indexObject.name
  };
}


function getRuntimeDepartmentRegistry() {
  return RUNTIME_DEPARTMENT_REGISTRY;
}


// ======================================
// 5) فحص حوكمي للإدارة
// ======================================

function auditDepartment(id) {
  const dept = getDepartmentById(id);

  if (!dept) {
    return {
      ok: false,
      departmentId: id,
      message: "الإدارة غير موجودة في السجل الحي: " + id,
      warnings: ["إدارة غير مسجلة"]
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

  if (!dept.indexFile) {
    warnings.push("الإدارة لا تعلن ملف الاندكس الفرعي.");
  }

  if (!dept.appFile) {
    warnings.push("الإدارة لا تعلن ملف التطبيق الفرعي.");
  }

  return {
    ok: warnings.length === 0,
    departmentId: dept.id,
    department: dept.name,
    warnings,
    reviewedAt: new Date().toISOString()
  };
}


function auditDepartmentRegistry() {
  const departments = getOrderedDepartments();
  const audits = departments.map(function (dept) {
    return auditDepartment(dept.id);
  });

  const failed = audits.filter(function (a) {
    return !a.ok;
  });

  const registeredRuntimeIds = Object.keys(RUNTIME_DEPARTMENT_REGISTRY);
  const staticIds = departments.map(function (d) { return d.id; });

  const runtimeNotStatic = registeredRuntimeIds.filter(function (id) {
    return !staticIds.includes(id);
  });

  return {
    method: "Department Registry Audit V3",
    charter: GOVERNANCE_CHARTER,
    createdAt: new Date().toISOString(),
    ok: failed.length === 0 && runtimeNotStatic.length === 0,
    departmentsCount: departments.length,
    runtimeRegisteredCount: registeredRuntimeIds.length,
    runtimeNotStatic,
    audits,
    summary: {
      failedDepartments: failed.length,
      unregisteredNew: runtimeNotStatic.length,
      missingIndexFunction: 0,
      missingAppFunction: 0
    },
    message:
      failed.length || runtimeNotStatic.length
        ? "سجل الإدارات يحتاج مراجعة؛ توجد إدارات أو اندكسات غير منسجمة."
        : "سجل الإدارات منسجم ظاهريًا."
  };
}


// ======================================
// 6) تصدير عام
// ======================================

window.GOVERNANCE_CHARTER = GOVERNANCE_CHARTER;
window.DEPARTMENT_REGISTRY = DEPARTMENT_REGISTRY;
window.RUNTIME_DEPARTMENT_REGISTRY = RUNTIME_DEPARTMENT_REGISTRY;

window.getDepartmentRegistry = getDepartmentRegistry;
window.getDepartmentById = getDepartmentById;
window.getDepartmentRecord = getDepartmentRecord;
window.getOrderedDepartments = getOrderedDepartments;
window.listDepartments = listDepartments;
window.registerDepartment = registerDepartment;
window.getRuntimeDepartmentRegistry = getRuntimeDepartmentRegistry;
window.auditDepartment = auditDepartment;
window.auditDepartmentRegistry = auditDepartmentRegistry;
