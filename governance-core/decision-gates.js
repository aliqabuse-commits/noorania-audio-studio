// ======================================
// governance-core/decision-gates.js
// بوابات القرار — Decision Gates
// إدارة الحوكمة / السلطة العليا للمشروع
// ======================================

console.log("🚦 decision-gates.js جاهز");

// ======================================
// مبدأ بوابات القرار
// ======================================

const DECISION_GATE_LAW =
  "لا يمر قرار ولا إضافة ولا إدارة جديدة قبل مراجعة المعرفة والوجهة والأثر.";


// ======================================
// أنواع البوابات
// ======================================

const DECISION_GATES = {

  newFileGate: {
    id: "new-file-gate",
    name: "بوابة إنشاء ملف جديد",
    purpose: "منع إنشاء ملفات لا تخدم معرفة أو قرارًا واضحًا.",
    requiredQuestions: [
      "ما المعرفة التي سينتجها هذا الملف؟",
      "أي قرار سيستفيد من هذه المعرفة؟",
      "هل يوجد ملف سابق يؤدي الوظيفة نفسها؟",
      "هل الأفضل تطوير ملف موجود بدل إنشاء ملف جديد؟",
      "إلى أي إدارة ينتمي الملف؟"
    ]
  },

  newDepartmentGate: {
    id: "new-department-gate",
    name: "بوابة إنشاء إدارة جديدة",
    purpose: "منع تضخم الإدارات وتكرار الوظائف.",
    requiredQuestions: [
      "ما الوظيفة التي لا تستطيع الإدارات الحالية أداءها؟",
      "هل هذه الإدارة تنتج معرفة مستقلة؟",
      "أي قرارات ستخدمها هذه الإدارة؟",
      "هل تتداخل مع إدارة قائمة؟",
      "هل يمكن تطوير إدارة قائمة بدل إنشاء إدارة جديدة؟"
    ]
  },

  decisionExecutionGate: {
    id: "decision-execution-gate",
    name: "بوابة تنفيذ القرار",
    purpose: "منع أي قرار من العمل دون مراجعة المعرفة المتاحة.",
    requiredQuestions: [
      "ما نوع القرار؟",
      "ما المعرفة المسجلة التي يجب مراجعتها؟",
      "هل القرار استخدم المعرفة فعليًا؟",
      "هل يوجد تحذير من الذاكرة أو الالتباس؟",
      "هل القرار يخدم الوجهة؟"
    ]
  },

  labAdoptionGate: {
    id: "lab-adoption-gate",
    name: "بوابة اعتماد نتائج المختبر",
    purpose: "منع بقاء نتائج المختبرات معزولة أو اعتمادها بلا أثر.",
    requiredQuestions: [
      "ما المعرفة التي أنتجها المختبر؟",
      "أي إدارة ستتبنى هذه المعرفة؟",
      "أي قرار سيتغير بسببها؟",
      "هل النتيجة قابلة للتكرار؟",
      "هل تحل مشكلة حقيقية أم تضيف وصفًا فقط؟"
    ]
  }

};


// ======================================
// نتيجة بوابة قياسية
// ======================================

function makeGateResult(ok, gateId, message, details) {
  return {
    ok,
    gateId,
    message,
    details: details || {},
    checkedAt: new Date().toISOString()
  };
}


// ======================================
// فحص إنشاء ملف جديد
// ======================================

function gateNewFile(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(
      false,
      "new-file-gate",
      "لا يوجد طلب لفحصه."
    );
  }

  if (!request.filePath) {
    warnings.push("لم يتم تحديد مسار الملف.");
  }

  if (!request.departmentId) {
    warnings.push("لم يتم تحديد الإدارة التي ينتمي إليها الملف.");
  }

  if (!request.producesKnowledge) {
    warnings.push("لم يتم تحديد المعرفة التي سينتجها الملف.");
  }

  if (!request.servesDecision) {
    warnings.push("لم يتم تحديد القرار الذي سيستفيد من الملف.");
  }

  if (!request.impact) {
    warnings.push("لم يتم تحديد الأثر العملي المتوقع.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "new-file-gate",
    ok
      ? "تم السماح بإنشاء الملف لأن أثره ومعرفته وقراره واضحة."
      : "لا يُنصح بإنشاء الملف قبل استكمال أسئلة الحوكمة.",
    {
      warnings,
      request
    }
  );
}


// ======================================
// فحص إنشاء إدارة جديدة
// ======================================

function gateNewDepartment(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(
      false,
      "new-department-gate",
      "لا يوجد طلب لفحصه."
    );
  }

  if (!request.departmentId) {
    warnings.push("لم يتم تحديد معرف الإدارة.");
  }

  if (!request.mission) {
    warnings.push("لم يتم تحديد مهمة الإدارة.");
  }

  if (!request.producesKnowledge) {
    warnings.push("لم يتم تحديد المعرفة التي ستنتجها الإدارة.");
  }

  if (!request.servesDecisions || !request.servesDecisions.length) {
    warnings.push("لم يتم تحديد القرارات التي ستخدمها الإدارة.");
  }

  if (!request.whyExistingDepartmentsCannotServe) {
    warnings.push("لم يتم توضيح لماذا لا تكفي الإدارات الحالية.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "new-department-gate",
    ok
      ? "يمكن دراسة إنشاء الإدارة الجديدة."
      : "لا تنشأ إدارة جديدة قبل إثبات الحاجة وعدم التداخل.",
    {
      warnings,
      request
    }
  );
}


// ======================================
// فحص تنفيذ قرار
// ======================================

function gateDecisionExecution(decisionId) {
  if (!decisionId) {
    return makeGateResult(
      false,
      "decision-execution-gate",
      "لم يتم تحديد نوع القرار."
    );
  }

  if (typeof getKnowledgeForDecision !== "function") {
    return makeGateResult(
      false,
      "decision-execution-gate",
      "خريطة المعرفة والقرار غير محمّلة."
    );
  }

  const requiredKnowledge =
    getKnowledgeForDecision(decisionId);

  if (!requiredKnowledge || !requiredKnowledge.length) {
    return makeGateResult(
      false,
      "decision-execution-gate",
      "هذا القرار لا يملك معرفة مسجلة يراجعها.",
      {
        decisionId
      }
    );
  }

  return makeGateResult(
    true,
    "decision-execution-gate",
    "القرار لديه معرفة مسجلة يجب مراجعتها قبل التنفيذ.",
    {
      decisionId,
      requiredKnowledge: requiredKnowledge.map(function (k) {
        return {
          id: k.id,
          type: k.knowledgeType,
          department: k.sourceDepartment,
          status: k.status
        };
      })
    }
  );
}


// ======================================
// فحص اعتماد نتيجة مختبر
// ======================================

function gateLabAdoption(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(
      false,
      "lab-adoption-gate",
      "لا يوجد طلب اعتماد مختبر."
    );
  }

  if (!request.labId) {
    warnings.push("لم يتم تحديد المختبر.");
  }

  if (!request.producedKnowledge) {
    warnings.push("لم يتم تحديد المعرفة التي أنتجها المختبر.");
  }

  if (!request.targetDepartment) {
    warnings.push("لم يتم تحديد الإدارة التي ستتبنى نتيجة المختبر.");
  }

  if (!request.changedDecision) {
    warnings.push("لم يتم تحديد القرار الذي سيتغير بسبب النتيجة.");
  }

  if (!request.evidence) {
    warnings.push("لم يتم تقديم أثر أو دليل عملي على نجاح النتيجة.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "lab-adoption-gate",
    ok
      ? "يمكن اعتماد نتيجة المختبر وتحويلها إلى معرفة تشغيلية."
      : "لا تعتمد نتيجة المختبر قبل إثبات أثرها وربطها بإدارة وقرار.",
    {
      warnings,
      request
    }
  );
}


// ======================================
// تصدير عام
// ======================================

window.DECISION_GATE_LAW = DECISION_GATE_LAW;
window.DECISION_GATES = DECISION_GATES;

window.gateNewFile = gateNewFile;
window.gateNewDepartment = gateNewDepartment;
window.gateDecisionExecution = gateDecisionExecution;
window.gateLabAdoption = gateLabAdoption;
