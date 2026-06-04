// ======================================
// governance-core/decision-gates.js
// بوابات القرار — Decision Gates V3
// مستوعبة لخريطة العائلة والذاكرة التراكمية واعتماد نتائج المطابقة
// ======================================

console.log("🚦 decision-gates.js جاهز — V3 Sovereign Decision Gates");


// ======================================
// 1) دستور بوابات القرار
// ======================================

const DECISION_GATE_CHARTER = {
  motto: [
    "#الحوكمة",
    "#لا_تعطني_وصفا_اعطني_أثرا",
    "#المعرفة_تخدم_القرار",
    "#القرار_يراجع_المعرفة",
    "#كل_شيء_يخدم_الوجهة"
  ],

  supremeLaw:
    "لا يمر قرار ولا إضافة ولا إدارة جديدة قبل مراجعة المعرفة والوجهة والأثر.",

  trainingLaw:
    "لا تتحول العينة الصوتية إلى معرفة إدراكية قبل أن تُسجَّل بوضوح، وتُحفظ بسلام، وتُفحص جودتها، وتُربط بقرار.",

  matchLaw:
    "لا تعتمد نتيجة مطابقة حرف إذا لم تراجع العائلة الإدراكية والذاكرة التراكمية وهامش الفصل.",

  warning:
    "أي بوابة لا تسأل عن الأثر ليست بوابة حوكمة، وأي قرار يتجاوز المعرفة المتاحة ليس قرارًا إدراكيًا."
};


const DECISION_GATE_LAW = DECISION_GATE_CHARTER.supremeLaw;


// ======================================
// 2) أنواع البوابات
// ======================================

const DECISION_GATES = {
  newFileGate: {
    id: "new-file-gate",
    name: "بوابة إنشاء ملف جديد",
    purpose: "منع إنشاء ملفات لا تخدم معرفة أو قرارًا واضحًا.",
    requiredQuestions: [
      "ما المعرفة التي سينتجها هذا الملف؟",
      "أي قرار سيستفيد من هذه المعرفة؟",
      "ما الإدارات والاندكسات التي يجب تحديثها؟",
      "هل يجب تحديث خريطة المعرفة والقرار؟",
      "هل يجب تحديث بوابات القرار أو حراس التدقيق؟",
      "هل يوجد ملف سابق يؤدي الوظيفة نفسها؟",
      "إلى أي إدارة ينتمي الملف؟",
      "هل هذا الملف يلتزم بدستور الحوكمة؟"
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
      "هل يمكن تطوير إدارة قائمة بدل إنشاء إدارة جديدة؟",
      "هل تم تسجيلها في department-registry.js؟"
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

  trainingSampleGate: {
    id: "training-sample-gate",
    name: "بوابة عينة التدريب الصوتي",
    purpose: "منع انتقال التسجيل الخام إلى الإدراك قبل وضوح التسجيل والحفظ والفحص والأثر.",
    requiredQuestions: [
      "ما الحرف أو الحقيبة التي تنتمي إليها العينة؟",
      "هل بدأ التسجيل بإشارة واضحة للمستخدم؟",
      "هل انتهى التسجيل بإشارة واضحة؟",
      "هل تم حفظ التسجيل بنجاح؟",
      "هل فُحصت جودة الإشارة؟",
      "هل العينة تخدم قرارًا لاحقًا مثل validate-signal أو identify-phoneme؟",
      "هل تنتمي العملية إلى training-core دون تجاوز phoneme-core أو analysis-core؟"
    ]
  },

  phonemeFamilyComparisonGate: {
    id: "phoneme-family-comparison-gate",
    name: "بوابة مقارنة العائلة الإدراكية",
    purpose: "منع إعلان تطابق حرف بلا منافسين إدراكيين واضحين.",
    requiredQuestions: [
      "ما الحرف المستهدف؟",
      "ما العائلة الإدراكية لهذا الحرف؟",
      "من المنافسون الأقرب؟",
      "هل تمت المقارنة مع المنافس الأقرب؟",
      "ما هامش الفصل؟",
      "هل الهامش يكفي للحكم أم أن القرار تشغيلي فقط؟"
    ]
  },

  cumulativeMemoryGate: {
    id: "cumulative-memory-gate",
    name: "بوابة الذاكرة التراكمية",
    purpose: "منع اعتماد آخر تسجيل كحقيقة مطلقة دون مراجعة تاريخ الحرف.",
    requiredQuestions: [
      "هل توجد ذاكرة تراكمية للحرف؟",
      "كم عدد المحاولات السابقة؟",
      "هل العينة الجديدة داخل المدى الطبيعي؟",
      "هل الذاكرة تؤيد القرار أم تعارضه؟",
      "هل يلزم إعادة تدريب أو جمع عينات إضافية؟"
    ]
  },

  matchResultAdoptionGate: {
    id: "match-result-adoption-gate",
    name: "بوابة اعتماد نتيجة المطابقة",
    purpose: "تمييز النجاح التشغيلي عن الحكم الإدراكي المعتمد.",
    requiredQuestions: [
      "هل نتيجة الاختبار صحيحة تشغيلًا؟",
      "هل يوجد هامش فصل أكبر من الصفر؟",
      "هل تمت مراجعة العائلة الإدراكية؟",
      "هل تمت مراجعة الذاكرة التراكمية؟",
      "ما الحكم النهائي: معتمد، غير معتمد، أو يحتاج عينات؟"
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
      "هل تحل مشكلة حقيقية أم تضيف وصفًا فقط؟",
      "هل مرّت النتيجة عبر دستور الحوكمة؟"
    ]
  }
};


// ======================================
// 3) نتيجة بوابة قياسية
// ======================================

function makeGateResult(ok, gateId, message, details) {
  return {
    ok,
    gateId,
    law: DECISION_GATE_LAW,
    charterWarning: DECISION_GATE_CHARTER.warning,
    message,
    details: details || {},
    checkedAt: new Date().toISOString()
  };
}


// ======================================
// 4) أدوات مساعدة
// ======================================

function isRegisteredDepartment(departmentId) {
  if (typeof getDepartmentById !== "function") {
    return null;
  }

  return !!getDepartmentById(departmentId);
}


function getKnowledgeSupportForDecision(decisionId) {
  if (typeof getKnowledgeForDecision !== "function") {
    return null;
  }

  return getKnowledgeForDecision(decisionId);
}


function hasKnowledgeId(knowledgeId) {
  if (typeof getKnowledgeDecisionMap !== "function") return false;

  const map = getKnowledgeDecisionMap();
  return Object.values(map).some(function (item) {
    return item.id === knowledgeId;
  });
}


// ======================================
// 5) فحص إنشاء ملف جديد
// ======================================

function gateNewFile(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "new-file-gate", "لا يوجد طلب لفحصه.");
  }

  if (!request.filePath) warnings.push("لم يتم تحديد مسار الملف.");
  if (!request.departmentId) warnings.push("لم يتم تحديد الإدارة التي ينتمي إليها الملف.");

  if (request.departmentId && isRegisteredDepartment(request.departmentId) === false) {
    warnings.push("الإدارة غير مسجلة رسميًا في department-registry.js: " + request.departmentId);
  }

  if (!request.producesKnowledge) warnings.push("لم يتم تحديد المعرفة التي سينتجها الملف.");
  if (!request.servesDecision) warnings.push("لم يتم تحديد القرار الذي سيستفيد من الملف.");
  if (!request.impact) warnings.push("لم يتم تحديد الأثر العملي المتوقع.");

  if (!request.affectedIndexes || !request.affectedIndexes.length) {
    warnings.push("لم يتم تحديد الاندكسات الفرعية المتأثرة بالملف.");
  }

  if (request.producesKnowledge && request.requiresKnowledgeMap !== false && !request.knowledgeMapUpdated) {
    warnings.push("الملف ينتج معرفة، لكن لم يثبت تحديث knowledge-decision-map.js.");
  }

  if (request.affectsDecision && !request.decisionGateReviewed) {
    warnings.push("الملف يؤثر في قرار، لكن لم يثبت تحديث بوابات القرار أو مراجعتها.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "new-file-gate",
    ok
      ? "تم السماح بإنشاء الملف لأن أثره ومعرفته وقراره ومسار ربطه واضحة."
      : "لا يُنصح بإنشاء الملف قبل استكمال أسئلة الحوكمة.",
    { warnings, request }
  );
}


// ======================================
// 6) فحص إنشاء إدارة جديدة
// ======================================

function gateNewDepartment(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "new-department-gate", "لا يوجد طلب لفحصه.");
  }

  if (!request.departmentId) warnings.push("لم يتم تحديد معرف الإدارة.");
  if (!request.mission) warnings.push("لم يتم تحديد مهمة الإدارة.");
  if (!request.producesKnowledge) warnings.push("لم يتم تحديد المعرفة التي ستنتجها الإدارة.");

  if (!request.servesDecisions || !request.servesDecisions.length) {
    warnings.push("لم يتم تحديد القرارات التي ستخدمها الإدارة.");
  }

  if (!request.whyExistingDepartmentsCannotServe) {
    warnings.push("لم يتم توضيح لماذا لا تكفي الإدارات الحالية.");
  }

  if (request.departmentId && isRegisteredDepartment(request.departmentId) === true) {
    warnings.push("هذه الإدارة مسجلة بالفعل ولا تحتاج إنشاء جديد: " + request.departmentId);
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "new-department-gate",
    ok ? "يمكن دراسة إنشاء الإدارة الجديدة بعد عرضها على الحوكمة." : "لا تنشأ إدارة جديدة قبل إثبات الحاجة وعدم التداخل.",
    { warnings, request }
  );
}


// ======================================
// 7) فحص تنفيذ قرار
// ======================================

function gateDecisionExecution(decisionId) {
  if (!decisionId) {
    return makeGateResult(false, "decision-execution-gate", "لم يتم تحديد نوع القرار.");
  }

  const requiredKnowledge = getKnowledgeSupportForDecision(decisionId);

  if (requiredKnowledge === null) {
    return makeGateResult(false, "decision-execution-gate", "خريطة المعرفة والقرار غير محمّلة.");
  }

  if (!requiredKnowledge || !requiredKnowledge.length) {
    return makeGateResult(false, "decision-execution-gate", "هذا القرار لا يملك معرفة مسجلة يراجعها.", { decisionId });
  }

  return makeGateResult(
    true,
    "decision-execution-gate",
    "القرار لديه معرفة مسجلة يجب مراجعتها قبل التنفيذ.",
    {
      decisionId,
      requiredKnowledge: requiredKnowledge.map(function (k) {
        return { id: k.id, type: k.knowledgeType, department: k.sourceDepartment, status: k.status };
      })
    }
  );
}


// ======================================
// 8) فحص عينة تدريب صوتي
// ======================================

function gateTrainingSample(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "training-sample-gate", "لا يوجد طلب لفحص عينة التدريب.");
  }

  if (!request.phonemeKey && !request.trainingPackKey) warnings.push("لم يتم تحديد الحرف أو حقيبة التدريب.");
  if (!request.fileName) warnings.push("لم يتم تحديد اسم ملف التسجيل.");

  if (request.departmentId && request.departmentId !== "training-core") {
    warnings.push("عينة التدريب يجب أن تمر عبر training-core لا عبر: " + request.departmentId);
  }

  if (!request.recordingStartedClearly) warnings.push("لم يتم إثبات أن التسجيل بدأ بإشارة واضحة.");
  if (!request.recordingEndedClearly) warnings.push("لم يتم إثبات أن التسجيل انتهى بإشارة واضحة.");
  if (!request.saved) warnings.push("لم يتم إثبات حفظ التسجيل.");
  if (!request.signalChecked) warnings.push("لم يتم فحص جودة الإشارة.");
  if (!request.servesDecision) warnings.push("لم يتم تحديد القرار الذي ستخدمه العينة.");

  if (request.servesDecision && ![
    "prepare-training-sample",
    "validate-signal",
    "identify-phoneme"
  ].includes(request.servesDecision)) {
    warnings.push("قرار العينة غير معروف ضمن قرارات التدريب المصرح بها: " + request.servesDecision);
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "training-sample-gate",
    ok ? "عينة التدريب مستوفية لشروط المرور إلى الإدراك أو الفحص." : "لا تمر عينة التدريب قبل استكمال شروط التسجيل والحفظ والفحص والأثر.",
    { law: DECISION_GATE_CHARTER.trainingLaw, warnings, request }
  );
}


// ======================================
// 9) فحص مقارنة العائلة الإدراكية
// ======================================

function gatePhonemeFamilyComparison(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "phoneme-family-comparison-gate", "لا يوجد طلب لفحص العائلة الإدراكية.");
  }

  if (!hasKnowledgeId("phoneme-family-map")) {
    warnings.push("خريطة العائلة الإدراكية غير مسجلة في knowledge-decision-map.js.");
  }

  if (!request.phonemeKey) warnings.push("لم يتم تحديد الحرف المستهدف.");
  if (!request.familyId && !request.familyName) warnings.push("لم يتم تحديد العائلة الإدراكية.");

  if (!request.competitors || !request.competitors.length) {
    warnings.push("لا يوجد منافسون إدراكيون للمقارنة؛ لا يعتمد الاختبار كحسم.");
  }

  if (request.compared !== true) {
    warnings.push("لم يثبت أن الاختبار قارن الحرف بالمنافسين الأقرب.");
  }

  if (typeof request.margin === "number" && request.margin <= 0) {
    warnings.push("هامش الفصل صفر أو سلبي؛ النتيجة تشغيلية لا إدراكية معتمدة.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "phoneme-family-comparison-gate",
    ok ? "مقارنة العائلة الإدراكية مستوفية مبدئيًا." : "لا يعتمد قرار الحرف قبل مراجعة العائلة والمنافسين والهامش.",
    { law: DECISION_GATE_CHARTER.matchLaw, warnings, request }
  );
}


// ======================================
// 10) فحص الذاكرة التراكمية
// ======================================

function gateCumulativeMemoryReview(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "cumulative-memory-gate", "لا يوجد طلب لفحص الذاكرة التراكمية.");
  }

  if (!hasKnowledgeId("phoneme-cumulative-memory")) {
    warnings.push("الذاكرة التراكمية غير مسجلة في knowledge-decision-map.js.");
  }

  if (!request.phonemeKey) warnings.push("لم يتم تحديد الحرف.");
  if (!request.memoryChecked) warnings.push("لم يثبت أن الذاكرة التراكمية روجعت.");

  if (typeof request.samplesCount === "number" && request.samplesCount < 2) {
    warnings.push("عدد العينات التراكمية قليل؛ لا يكفي لاعتماد ثقة مستقرة.");
  }

  if (request.memoryVerdict === "opposes") {
    warnings.push("الذاكرة التراكمية تعارض القرار الحالي.");
  }

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "cumulative-memory-gate",
    ok ? "الذاكرة التراكمية لا تعارض القرار مبدئيًا." : "لا يعتمد القرار قبل مراجعة أثر الذاكرة التراكمية.",
    { law: DECISION_GATE_CHARTER.matchLaw, warnings, request }
  );
}


// ======================================
// 11) فحص اعتماد نتيجة المطابقة
// ======================================

function gateMatchResultAdoption(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "match-result-adoption-gate", "لا يوجد طلب لاعتماد نتيجة المطابقة.");
  }

  if (!request.phonemeKey) warnings.push("لم يتم تحديد الحرف.");
  if (request.operationallyCorrect !== true) warnings.push("النتيجة ليست صحيحة تشغيليًا.");

  if (typeof request.margin !== "number") {
    warnings.push("لم يتم تحديد هامش الفصل.");
  } else if (request.margin <= 0) {
    warnings.push("هامش الفصل صفر؛ لا يتحول النجاح التشغيلي إلى اعتماد إدراكي.");
  }

  if (!request.familyReviewed) warnings.push("لم تتم مراجعة خريطة العائلة الإدراكية.");
  if (!request.cumulativeMemoryReviewed) warnings.push("لم تتم مراجعة الذاكرة التراكمية.");

  if (!request.verdict) {
    warnings.push("لم يتم تحديد الحكم النهائي: معتمد / غير معتمد / يحتاج عينات.");
  }

  const ok = warnings.length === 0 && request.verdict === "approved";

  return makeGateResult(
    ok,
    "match-result-adoption-gate",
    ok ? "نتيجة المطابقة قابلة للاعتماد الإدراكي." : "نتيجة المطابقة لا تزال تشغيلية أو تحتاج أدلة إضافية.",
    { law: DECISION_GATE_CHARTER.matchLaw, warnings, request }
  );
}


// ======================================
// 12) فحص اعتماد نتيجة مختبر
// ======================================

function gateLabAdoption(request) {
  const warnings = [];

  if (!request) {
    return makeGateResult(false, "lab-adoption-gate", "لا يوجد طلب اعتماد مختبر.");
  }

  if (!request.labId) warnings.push("لم يتم تحديد المختبر.");
  if (!request.producedKnowledge) warnings.push("لم يتم تحديد المعرفة التي أنتجها المختبر.");
  if (!request.targetDepartment) warnings.push("لم يتم تحديد الإدارة التي ستتبنى نتيجة المختبر.");

  if (request.targetDepartment && isRegisteredDepartment(request.targetDepartment) === false) {
    warnings.push("الإدارة المستهدفة غير مسجلة رسميًا: " + request.targetDepartment);
  }

  if (!request.changedDecision) warnings.push("لم يتم تحديد القرار الذي سيتغير بسبب النتيجة.");
  if (!request.evidence) warnings.push("لم يتم تقديم أثر أو دليل عملي على نجاح النتيجة.");

  const ok = warnings.length === 0;

  return makeGateResult(
    ok,
    "lab-adoption-gate",
    ok ? "يمكن اعتماد نتيجة المختبر وتحويلها إلى معرفة تشغيلية بعد توثيقها." : "لا تعتمد نتيجة المختبر قبل إثبات أثرها وربطها بإدارة وقرار.",
    { warnings, request }
  );
}


// ======================================
// 13) فحص شامل للبوابات
// ======================================

function auditDecisionGates() {
  const report = {
    charter: DECISION_GATE_CHARTER,
    status: "audited",
    createdAt: new Date().toISOString(),
    gates: Object.keys(DECISION_GATES),
    gateCount: Object.keys(DECISION_GATES).length,
    warnings: []
  };

  if (!DECISION_GATES.trainingSampleGate) report.warnings.push("بوابة عينة التدريب غير موجودة.");
  if (!DECISION_GATES.phonemeFamilyComparisonGate) report.warnings.push("بوابة العائلة الإدراكية غير موجودة.");
  if (!DECISION_GATES.cumulativeMemoryGate) report.warnings.push("بوابة الذاكرة التراكمية غير موجودة.");
  if (!DECISION_GATES.matchResultAdoptionGate) report.warnings.push("بوابة اعتماد نتيجة المطابقة غير موجودة.");

  if (typeof getKnowledgeForDecision !== "function") report.warnings.push("خريطة المعرفة والقرار غير محمّلة.");
  if (typeof getDepartmentById !== "function") report.warnings.push("سجل الإدارات غير محمّل.");

  if (!hasKnowledgeId("phoneme-family-map")) report.warnings.push("phoneme-family-map غير مسجلة في خريطة المعرفة.");
  if (!hasKnowledgeId("phoneme-cumulative-memory")) report.warnings.push("phoneme-cumulative-memory غير مسجلة في خريطة المعرفة.");

  report.ok = report.warnings.length === 0;

  console.log("🚦 تقرير بوابات القرار:", report);
  return report;
}


// ======================================
// 14) تصدير عام
// ======================================

window.DECISION_GATE_CHARTER = DECISION_GATE_CHARTER;
window.DECISION_GATE_LAW = DECISION_GATE_LAW;
window.DECISION_GATES = DECISION_GATES;

window.gateNewFile = gateNewFile;
window.gateNewDepartment = gateNewDepartment;
window.gateDecisionExecution = gateDecisionExecution;
window.gateTrainingSample = gateTrainingSample;
window.gatePhonemeFamilyComparison = gatePhonemeFamilyComparison;
window.gateCumulativeMemoryReview = gateCumulativeMemoryReview;
window.gateMatchResultAdoption = gateMatchResultAdoption;
window.gateLabAdoption = gateLabAdoption;
window.auditDecisionGates = auditDecisionGates;
