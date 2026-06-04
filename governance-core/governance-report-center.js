// ======================================
// governance-core/governance-report-center.js
// مركز تقارير المجلس الحوكمي — V1
// الوظيفة:
// 1) تحويل تقارير الحوكمة الطويلة إلى تقارير مجلس قابلة للقراءة.
// 2) عرض تقرير عام للحكومة الحوكمية.
// 3) عرض تقارير أقسام إدارة الحوكمة: السجل، المعرفة والقرار، البوابات، الحراس.
// 4) عرض تقرير إدارة فرعية محددة: phoneme-core / segment-core / analysis-core...
// 5) توفير نسخ التقرير التنفيذي أو الكامل.
// لا يشغل محركات صوتية، ولا يتخذ القرار بدل الحوكمة.
// ======================================

console.log("📋 governance-report-center.js جاهز — Council Reports Center V1");


// ======================================
// 1) دستور مركز التقارير
// ======================================

const GOVERNANCE_REPORT_CENTER_CHARTER = {
  title: "دستور مركز تقارير المجلس الحوكمي",
  law:
    "التقرير الحوكمي لا يكتفي بعرض البيانات، بل يحوّلها إلى معنى تنفيذي يخدم القرار.",
  rules: [
    "لا يشغل محركات صوتية أو تحليلية.",
    "لا يغيّر السجلات ولا القرارات.",
    "يعرض أثر المعرفة على القرار بصورة مقروءة.",
    "يفصل بين التقرير التنفيذي والتقرير الكامل.",
    "يوفر نسخ التقارير حتى لا يضيع أثر المجلس.",
    "يعرض تقارير الإدارات الفرعية من منظور الحوكمة لا من منظور الواجهة."
  ]
};

let GOVERNANCE_REPORT_CENTER_LAST_FULL = null;
let GOVERNANCE_REPORT_CENTER_LAST_EXECUTIVE = "";


// ======================================
// 2) نقطة دخول رئيسية: بناء مركز التقارير داخل حاوية
// ======================================

function renderGovernanceReportCenter(containerId) {
  const container = document.getElementById(containerId || "governance-actions");

  if (!container) {
    console.warn("⚠️ لم يتم العثور على حاوية مركز التقارير:", containerId);
    return null;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "governance-report-center";
  wrapper.style.background = "#020617";
  wrapper.style.color = "#e5e7eb";
  wrapper.style.border = "1px solid #334155";
  wrapper.style.borderRadius = "14px";
  wrapper.style.padding = "14px";
  wrapper.style.margin = "16px auto";
  wrapper.style.lineHeight = "1.8";
  wrapper.style.direction = "rtl";
  wrapper.style.textAlign = "right";

  wrapper.innerHTML = `
    <h3 style="margin-top:0;color:#38bdf8;">📋 مركز تقارير المجلس الحوكمي</h3>
    <p style="color:#cbd5e1;font-size:14px;">
      يعرض التقارير التنفيذية والفرعية بصورة قابلة للقراءة والنسخ، دون تشغيل محركات المشروع.
    </p>

    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px 0;">
      <button type="button" onclick="showGovernanceCouncilExecutiveReport()">🏛️ التقرير التنفيذي العام</button>
      <button type="button" onclick="showGovernanceSectionReport('departments')">🧭 تقرير سجل الإدارات</button>
      <button type="button" onclick="showGovernanceSectionReport('knowledge')">🗺️ تقرير المعرفة والقرار</button>
      <button type="button" onclick="showGovernanceSectionReport('gates')">🚦 تقرير بوابات القرار</button>
      <button type="button" onclick="showGovernanceSectionReport('guards')">🛡️ تقرير حراس الحوكمة</button>
      <button type="button" onclick="showGovernanceSectionReport('indexAlignment')">🔎 تقرير مواءمة الاندكسات</button>
      <button type="button" onclick="showGovernanceSectionReport('familyMemory')">🧬 تقرير العائلة والذاكرة</button>
    </div>

    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:12px;margin-top:12px;">
      <label style="display:block;margin-bottom:8px;color:#cbd5e1;">تقرير إدارة فرعية:</label>
      <select id="governance-department-report-select"
              style="width:100%;padding:10px;border-radius:8px;background:#111827;color:white;border:1px solid #334155;">
        ${buildGovernanceDepartmentOptions()}
      </select>
      <button type="button" onclick="showSelectedDepartmentGovernanceReport()" style="margin-top:10px;width:100%;">
        📋 عرض تقرير الإدارة المختارة
      </button>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px 0;">
      <button type="button" onclick="copyGovernanceExecutiveReport()">📋 نسخ التقرير التنفيذي</button>
      <button type="button" onclick="copyGovernanceFullReport()">📚 نسخ التقرير الكامل</button>
      <button type="button" onclick="clearGovernanceReportCenterOutput()">🧹 مسح العرض</button>
    </div>

    <div id="governance-report-center-output"
         style="background:#08111f;border:1px solid #38bdf8;border-radius:12px;padding:12px;margin-top:12px;max-height:520px;overflow:auto;">
      <div style="color:#94a3b8;text-align:center;">اختر تقريرًا من الأعلى.</div>
    </div>
  `;

  container.appendChild(wrapper);
  return wrapper;
}


// ======================================
// 3) بناء التقرير الكامل من الدوال المتاحة
// ======================================

function buildGovernanceCouncilFullReport() {
  const report = {
    method: "Governance Council Report Center V1",
    charter: GOVERNANCE_REPORT_CENTER_CHARTER,
    createdAt: new Date().toISOString(),
    departments:
      typeof window.auditDepartmentRegistry === "function"
        ? window.auditDepartmentRegistry()
        : { ok: false, message: "auditDepartmentRegistry غير متاحة." },
    knowledge:
      typeof window.auditKnowledgeDecisionMap === "function"
        ? window.auditKnowledgeDecisionMap()
        : { ok: false, message: "auditKnowledgeDecisionMap غير متاحة." },
    gates:
      typeof window.auditDecisionGates === "function"
        ? window.auditDecisionGates()
        : { ok: false, message: "auditDecisionGates غير متاحة." },
    guards:
      typeof window.runGovernanceAuditGuards === "function"
        ? window.runGovernanceAuditGuards()
        : { ok: false, message: "runGovernanceAuditGuards غير متاحة." }
  };

  report.indexAlignment = extractIndexAlignmentAudit(report.guards);
  report.familyMemory = extractFamilyMemoryAudit(report.guards);
  report.executive = buildGovernanceExecutiveSummary(report);

  GOVERNANCE_REPORT_CENTER_LAST_FULL = report;
  GOVERNANCE_REPORT_CENTER_LAST_EXECUTIVE = renderGovernanceExecutiveText(report.executive);

  return report;
}


// ======================================
// 4) ملخص تنفيذي قابل للقرار
// ======================================

function buildGovernanceExecutiveSummary(report) {
  const departmentsOk = !!(report.departments && report.departments.ok);
  const orphanCount = Number(report.knowledge?.orphanKnowledgeCount || 0);
  const knowledgeItems = Number(report.knowledge?.totalKnowledgeItems || 0);
  const gateWarnings = Array.isArray(report.gates?.warnings) ? report.gates.warnings.length : 0;
  const guardsProblems = Number(report.guards?.totalProblems || 0);
  const unsupportedCount = Number(report.guards?.decisionAudit?.unsupportedCount || 0);
  const duplicateCount = Number(report.guards?.duplicateAudit?.count || 0);
  const indexAlignmentOk = report.indexAlignment ? !!report.indexAlignment.ok : null;
  const familyMemoryOk = report.familyMemory ? !!report.familyMemory.ok : null;

  const problems = [];
  const strengths = [];

  if (departmentsOk) strengths.push("الإدارات السبع مسجلة ومنسجمة ظاهريًا.");
  else problems.push("سجل الإدارات يحتاج مراجعة.");

  if (orphanCount === 0) strengths.push("لا توجد معرفة يتيمة في خريطة المعرفة والقرار.");
  else problems.push("توجد معرفة يتيمة لا تخدم قرارًا: " + orphanCount);

  if (gateWarnings === 0 && report.gates?.ok) strengths.push("بوابات القرار محملة ولا تظهر تحذيرات مباشرة.");
  else problems.push("بوابات القرار تحتوي تحذيرات: " + gateWarnings);

  if (familyMemoryOk === true) strengths.push("خريطة العائلة والذاكرة التراكمية ظاهرتان في القرار والبوابات.");
  if (familyMemoryOk === false) problems.push("خريطة العائلة أو الذاكرة التراكمية غير مكتملة حوكميًا.");

  if (unsupportedCount > 0) problems.push("توجد قرارات بلا معرفة مساندة: " + unsupportedCount);
  if (duplicateCount > 0) problems.push("توجد تداخلات مسؤولية تحتاج تصنيفًا: " + duplicateCount);
  if (indexAlignmentOk === false) problems.push("مواءمة الاندكسات مع خريطة الحوكمة غير مكتملة.");

  const status = problems.length === 0
    ? "healthy"
    : problems.length <= 3
      ? "watch"
      : "needs-attention";

  return {
    status,
    statusLabel: getGovernanceStatusLabel(status),
    knowledgeItems,
    departmentsOk,
    orphanCount,
    gateWarnings,
    guardsProblems,
    unsupportedCount,
    duplicateCount,
    indexAlignmentOk,
    familyMemoryOk,
    strengths,
    problems,
    decision: buildCouncilDecision(status, problems),
    nextActions: buildCouncilNextActions(report, problems)
  };
}

function getGovernanceStatusLabel(status) {
  if (status === "healthy") return "🟢 سليم ظاهريًا";
  if (status === "watch") return "🟡 جيد مع ملاحظات";
  return "🔴 يحتاج عناية حوكمية";
}

function buildCouncilDecision(status, problems) {
  if (status === "healthy") {
    return "استمرار العمل مسموح، مع مراقبة التقارير بعد كل إضافة أو نقل ملف.";
  }

  if (status === "watch") {
    return "استمرار العمل مسموح، لكن لا تُعتمد قرارات كبرى قبل معالجة الملاحظات المحددة.";
  }

  return "استمرار الاختبارات مسموح، لكن إعلان خلية النحل أو اعتماد قرار شامل مؤجل حتى معالجة الديون الحوكمية.";
}

function buildCouncilNextActions(report, problems) {
  const actions = [];

  if (report.guards?.decisionAudit?.unsupportedCount > 0) {
    actions.push("ربط القرارات غير المدعومة بمعرفة أو تأجيلها رسميًا، وأولها evaluate-reading إن ظهر في التقرير.");
  }

  if (report.guards?.duplicateAudit?.count > 0) {
    actions.push("تصنيف التداخلات: تكامل مشروع أم تضارب مسؤوليات؟ دون نقل ملفات الآن إلا بقرار مجلس.");
  }

  if (report.indexAlignment && report.indexAlignment.ok === false) {
    actions.push("مواءمة الاندكسات الفرعية مع خريطة المعرفة والقرار حتى لا تعمل ملفات من خلف العداد.");
  }

  if (report.familyMemory && report.familyMemory.ok === false) {
    actions.push("إكمال ربط خريطة العائلة والذاكرة التراكمية بالقرارات والبوابات.");
  }

  if (!actions.length) {
    actions.push("انتقل إلى اختبار إدارة الحرف وسجل أثر القرار في تقرير المطابقة.");
  }

  return actions;
}


// ======================================
// 5) عرض التقارير في الصفحة
// ======================================

function showGovernanceCouncilExecutiveReport() {
  const report = buildGovernanceCouncilFullReport();
  renderGovernanceReportOutput(
    "🏛️ التقرير التنفيذي العام",
    renderGovernanceExecutiveHtml(report.executive),
    report
  );
}

function showGovernanceSectionReport(section) {
  const report = buildGovernanceCouncilFullReport();
  let title = "📋 تقرير";
  let data = null;

  if (section === "departments") {
    title = "🧭 تقرير سجل الإدارات";
    data = summarizeDepartmentsSection(report.departments);
  } else if (section === "knowledge") {
    title = "🗺️ تقرير المعرفة والقرار";
    data = summarizeKnowledgeSection(report.knowledge);
  } else if (section === "gates") {
    title = "🚦 تقرير بوابات القرار";
    data = summarizeGatesSection(report.gates);
  } else if (section === "guards") {
    title = "🛡️ تقرير حراس الحوكمة";
    data = summarizeGuardsSection(report.guards);
  } else if (section === "indexAlignment") {
    title = "🔎 تقرير مواءمة الاندكسات";
    data = summarizeIndexAlignmentSection(report.indexAlignment);
  } else if (section === "familyMemory") {
    title = "🧬 تقرير العائلة والذاكرة التراكمية";
    data = summarizeFamilyMemorySection(report.familyMemory);
  }

  renderGovernanceReportOutput(
    title,
    renderObjectAsCouncilHtml(data),
    data
  );
}

function showSelectedDepartmentGovernanceReport() {
  const select = document.getElementById("governance-department-report-select");
  const departmentId = select ? select.value : "";

  if (!departmentId) {
    alert("اختر إدارة أولًا.");
    return;
  }

  const report = buildDepartmentGovernanceReport(departmentId);
  renderGovernanceReportOutput(
    "📋 تقرير الإدارة — " + departmentId,
    renderDepartmentGovernanceHtml(report),
    report
  );
}

function renderGovernanceReportOutput(title, html, fullData) {
  const box = document.getElementById("governance-report-center-output");

  if (!box) {
    console.warn("⚠️ صندوق عرض مركز التقارير غير موجود.");
    return;
  }

  GOVERNANCE_REPORT_CENTER_LAST_FULL = fullData || GOVERNANCE_REPORT_CENTER_LAST_FULL;

  box.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:10px;">
      <h3 style="margin:0;color:#38bdf8;">${escapeGovernanceHtml(title)}</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button type="button" onclick="copyGovernanceExecutiveReport()">📋 نسخ التنفيذي</button>
        <button type="button" onclick="copyGovernanceFullReport()">📚 نسخ الكامل</button>
      </div>
    </div>
    ${html}
  `;

  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// ======================================
// 6) تقارير الأقسام الفرعية داخل الحوكمة
// ======================================

function summarizeDepartmentsSection(data) {
  return {
    title: "تقرير سجل الإدارات",
    ok: !!data?.ok,
    departmentsCount: data?.departmentsCount || 0,
    runtimeRegisteredCount: data?.runtimeRegisteredCount || 0,
    summary: data?.summary || {},
    message: data?.message || "لا توجد رسالة.",
    failed: (data?.audits || []).filter(function (item) { return !item.ok; })
  };
}

function summarizeKnowledgeSection(data) {
  return {
    title: "تقرير المعرفة والقرار",
    totalKnowledgeItems: data?.totalKnowledgeItems || 0,
    orphanKnowledgeCount: data?.orphanKnowledgeCount || 0,
    departments: data?.departments || {},
    decisions: Object.keys(data?.decisions || {}).map(function (id) {
      return {
        decisionId: id,
        knowledgeCount: data.decisions[id].knowledgeCount,
        knowledge: data.decisions[id].knowledge
      };
    }),
    warnings: data?.warnings || []
  };
}

function summarizeGatesSection(data) {
  return {
    title: "تقرير بوابات القرار",
    ok: !!data?.ok,
    gateCount: data?.gateCount || 0,
    gates: data?.gates || [],
    warnings: data?.warnings || []
  };
}

function summarizeGuardsSection(data) {
  return {
    title: "تقرير حراس الحوكمة",
    ok: !!data?.ok,
    totalProblems: data?.totalProblems || 0,
    duplicateCount: data?.duplicateAudit?.count || 0,
    orphanCount: data?.orphanAudit?.count || 0,
    unsupportedDecisionCount: data?.decisionAudit?.unsupportedCount || 0,
    indexAlignmentOk: data?.indexAlignmentAudit?.ok,
    familyMemoryOk: data?.familyMemoryAudit?.ok,
    message: data?.message || "لا توجد رسالة."
  };
}

function summarizeIndexAlignmentSection(data) {
  if (!data) return { ok: false, message: "تقرير مواءمة الاندكسات غير متاح." };

  return {
    title: "تقرير مواءمة الاندكسات",
    ok: !!data.ok,
    count: data.count || 0,
    message: data.message,
    indexReports: (data.indexReports || []).map(function (r) {
      return {
        department: r.department,
        ok: r.ok,
        knowledgeCount: r.knowledgeCount,
        fileCount: r.fileCount,
        missingKnowledge: r.missingKnowledge || [],
        filesLikelyKnowledgeButUnmapped: r.filesLikelyKnowledgeButUnmapped || []
      };
    })
  };
}

function summarizeFamilyMemorySection(data) {
  if (!data) return { ok: false, message: "تقرير العائلة والذاكرة غير متاح." };

  return {
    title: "تقرير العائلة والذاكرة التراكمية",
    ok: !!data.ok,
    warnings: data.warnings || [],
    message: data.message || "لا توجد رسالة."
  };
}


// ======================================
// 7) تقرير إدارة فرعية محددة
// ======================================

function buildDepartmentGovernanceReport(departmentId) {
  const dept =
    typeof window.getDepartmentById === "function"
      ? window.getDepartmentById(departmentId)
      : null;

  const index = getDepartmentIndexById(departmentId);

  const mapKnowledge =
    typeof window.getKnowledgeByDepartment === "function"
      ? window.getKnowledgeByDepartment(departmentId) || []
      : [];

  const indexKnowledge =
    index && Array.isArray(index.knowledge)
      ? index.knowledge.map(function (id) {
          return {
            id: id,
            knowledgeType: "معرفة معلنة في الاندكس الفرعي",
            status: "index-declared",
            sourceFiles: [],
            mustServe: []
          };
        })
      : [];

  const merged = {};
  mapKnowledge.forEach(function (item) {
    merged[item.id] = item;
  });

  indexKnowledge.forEach(function (item) {
    if (!merged[item.id]) {
      merged[item.id] = item;
    }
  });

  const knowledge = Object.values(merged);

  const decisionsMap = {};

  knowledge.forEach(function (item) {
    (item.mustServe || []).forEach(function (decisionId) {
      if (!decisionsMap[decisionId]) decisionsMap[decisionId] = [];
      decisionsMap[decisionId].push(item.id);
    });
  });

  const report = {
    method: "Department Governance Report V1.1",
    departmentId,
    department: dept || null,
    indexLoaded: !!index,
    index: index
      ? {
          name: index.name,
          mode: index.mode,
          filesCount: Array.isArray(index.files) ? index.files.length : 0,
          knowledgeCount: Array.isArray(index.knowledge) ? index.knowledge.length : 0,
          decisionsCount: Array.isArray(index.decisions) ? index.decisions.length : 0,
          serves: index.serves || []
        }
      : null,
    knowledgeCount: knowledge.length,
    knowledge: knowledge.map(function (item) {
      return {
        id: item.id,
        type: item.knowledgeType || item.type || "معرفة غير مصنفة",
        status: item.status || "unknown",
        sourceFiles: item.sourceFiles || [],
        mustServe: item.mustServe || []
      };
    }),
    decisions: Object.keys(decisionsMap).map(function (decisionId) {
      return {
        decisionId,
        knowledge: decisionsMap[decisionId]
      };
    }),
    warnings: [],
    createdAt: new Date().toISOString()
  };

  if (!dept) {
    report.warnings.push("الإدارة غير موجودة في department-registry.js.");
  }

  if (!index) {
    report.warnings.push("اندكس الإدارة غير محمل أو غير قابل للقراءة الآن.");
  }

  if (!knowledge.length) {
    report.warnings.push("لا توجد معرفة مسجلة أو معلنة لهذه الإدارة.");
  }

  if (mapKnowledge.length === 0 && indexKnowledge.length > 0) {
    report.warnings.push(
      "هذه الإدارة تملك معرفة في الاندكس، لكنها غير مكتملة الربط في خريطة المعرفة والقرار."
    );
  }

  report.ok = report.warnings.length === 0;

  return report;
}

function getDepartmentIndexById(departmentId) {
  const fnMap = {
    "governance-core": "getGovernanceCoreIndex",
    "phoneme-core": "getPhonemeCoreIndex",
    "segment-core": "getSegmentCoreIndex",
    "analysis-core": "getAnalysisCoreIndex",
    "memory-core": "getMemoryCoreIndex",
    "training-core": "getTrainingCoreIndex",
    "operation-labs": "getOperationLabsIndex"
  };

  const fnName = fnMap[departmentId];
  if (!fnName || typeof window[fnName] !== "function") return null;

  try {
    return window[fnName]();
  } catch (err) {
    console.warn("تعذر قراءة اندكس الإدارة:", departmentId, err);
    return null;
  }
}

function buildGovernanceDepartmentOptions() {
  const departments = typeof window.listDepartments === "function"
    ? window.listDepartments()
    : [
        { id: "governance-core", name: "إدارة الحوكمة" },
        { id: "phoneme-core", name: "إدارة الحرف" },
        { id: "segment-core", name: "إدارة المقاطع" },
        { id: "analysis-core", name: "إدارة التحليل" },
        { id: "memory-core", name: "إدارة الذاكرة" },
        { id: "training-core", name: "إدارة التدريب والتسجيل" },
        { id: "operation-labs", name: "إدارة المختبرات" }
      ];

  return departments.map(function (dept) {
    return `<option value="${escapeGovernanceHtml(dept.id)}">${escapeGovernanceHtml(dept.name || dept.id)}</option>`;
  }).join("");
}


// ======================================
// 8) تحويل التقرير إلى HTML مقروء
// ======================================

function renderGovernanceExecutiveHtml(summary) {
  return `
    <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;">
      <h3 style="margin-top:0;color:#facc15;">${escapeGovernanceHtml(summary.statusLabel)}</h3>
      <div><b>عدد المعارف:</b> ${summary.knowledgeItems}</div>
      <div><b>المعرفة اليتيمة:</b> ${summary.orphanCount}</div>
      <div><b>تداخلات المسؤولية:</b> ${summary.duplicateCount}</div>
      <div><b>قرارات بلا معرفة:</b> ${summary.unsupportedCount}</div>
      <div><b>مواءمة الاندكسات:</b> ${summary.indexAlignmentOk === true ? "✅" : summary.indexAlignmentOk === false ? "⚠️" : "غير متاح"}</div>
      <div><b>العائلة والذاكرة:</b> ${summary.familyMemoryOk === true ? "✅" : summary.familyMemoryOk === false ? "⚠️" : "غير متاح"}</div>
    </div>

    <h4 style="color:#22c55e;">✅ نقاط القوة</h4>
    ${renderList(summary.strengths)}

    <h4 style="color:#f97316;">⚠️ الملاحظات</h4>
    ${renderList(summary.problems)}

    <h4 style="color:#38bdf8;">📌 قرار المجلس المقترح</h4>
    <div style="background:#111827;border-radius:10px;padding:10px;">${escapeGovernanceHtml(summary.decision)}</div>

    <h4 style="color:#a3e635;">🧭 الخطوات التالية</h4>
    ${renderList(summary.nextActions)}
  `;
}

function renderDepartmentGovernanceHtml(report) {
  return `
    <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;">
      <h3 style="margin-top:0;color:#38bdf8;">${escapeGovernanceHtml(report.department?.name || report.departmentId)}</h3>
      <div><b>الحالة:</b> ${report.ok ? "✅ جيدة ظاهريًا" : "⚠️ تحتاج مراجعة"}</div>
      <div><b>الاندكس:</b> ${report.indexLoaded ? "✅ متاح" : "⚠️ غير متاح"}</div>
      <div><b>عدد المعارف:</b> ${report.knowledgeCount}</div>
      <div><b>عدد القرارات المخدومة:</b> ${report.decisions.length}</div>
      ${report.index ? `<div><b>عدد الملفات في الاندكس:</b> ${report.index.filesCount}</div>` : ""}
    </div>

    <h4 style="color:#facc15;">⚠️ ملاحظات</h4>
    ${renderList(report.warnings.length ? report.warnings : ["لا توجد ملاحظات مباشرة."])}

    <h4 style="color:#22c55e;">🧠 المعارف المسجلة</h4>
    ${renderList(report.knowledge.map(function (k) { return k.id + " — " + k.type + " — " + k.status; }))}

    <h4 style="color:#38bdf8;">⚖️ القرارات التي تخدمها</h4>
    ${renderList(report.decisions.map(function (d) { return d.decisionId + " ← " + d.knowledge.join(", "); }))}
  `;
}

function renderObjectAsCouncilHtml(obj) {
  return `
    <pre style="direction:ltr;text-align:left;white-space:pre-wrap;background:#020617;color:#e5e7eb;border-radius:10px;padding:10px;font-size:12px;">${escapeGovernanceHtml(JSON.stringify(obj, null, 2))}</pre>
  `;
}

function renderList(items) {
  if (!items || !items.length) {
    return "<div style='color:#94a3b8;'>لا توجد عناصر.</div>";
  }

  return "<ul style='padding-right:20px;'>" +
    items.map(function (item) {
      return "<li>" + escapeGovernanceHtml(item) + "</li>";
    }).join("") +
    "</ul>";
}

function renderGovernanceExecutiveText(summary) {
  return [
    "🏛️ تقرير المجلس التنفيذي",
    "الحالة العامة: " + summary.statusLabel,
    "",
    "المؤشرات:",
    "- عدد المعارف: " + summary.knowledgeItems,
    "- المعرفة اليتيمة: " + summary.orphanCount,
    "- تداخلات المسؤولية: " + summary.duplicateCount,
    "- قرارات بلا معرفة: " + summary.unsupportedCount,
    "- مواءمة الاندكسات: " + String(summary.indexAlignmentOk),
    "- العائلة والذاكرة: " + String(summary.familyMemoryOk),
    "",
    "نقاط القوة:",
    summary.strengths.map(function (x) { return "- " + x; }).join("\n"),
    "",
    "الملاحظات:",
    summary.problems.map(function (x) { return "- " + x; }).join("\n"),
    "",
    "قرار المجلس المقترح:",
    summary.decision,
    "",
    "الخطوات التالية:",
    summary.nextActions.map(function (x) { return "- " + x; }).join("\n")
  ].join("\n");
}


// ======================================
// 9) النسخ والمسح
// ======================================

function copyGovernanceExecutiveReport() {
  if (!GOVERNANCE_REPORT_CENTER_LAST_EXECUTIVE) {
    const report = buildGovernanceCouncilFullReport();
    GOVERNANCE_REPORT_CENTER_LAST_EXECUTIVE = renderGovernanceExecutiveText(report.executive);
  }

  copyGovernanceText(GOVERNANCE_REPORT_CENTER_LAST_EXECUTIVE, "تم نسخ التقرير التنفيذي.");
}

function copyGovernanceFullReport() {
  if (!GOVERNANCE_REPORT_CENTER_LAST_FULL) {
    GOVERNANCE_REPORT_CENTER_LAST_FULL = buildGovernanceCouncilFullReport();
  }

  copyGovernanceText(
    JSON.stringify(GOVERNANCE_REPORT_CENTER_LAST_FULL, null, 2),
    "تم نسخ التقرير الكامل."
  );
}

function copyGovernanceText(text, successMessage) {
  if (!text) {
    alert("لا يوجد تقرير لنسخه.");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      alert(successMessage || "تم النسخ.");
    }).catch(function (err) {
      fallbackCopyGovernanceText(text, err);
    });
  } else {
    fallbackCopyGovernanceText(text);
  }
}

function fallbackCopyGovernanceText(text, err) {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.top = "-1000px";
  document.body.appendChild(area);
  area.focus();
  area.select();

  try {
    document.execCommand("copy");
    alert("تم النسخ.");
  } catch (copyErr) {
    alert("تعذر النسخ. الخطأ: " + (err?.message || copyErr.message));
  }

  document.body.removeChild(area);
}

function clearGovernanceReportCenterOutput() {
  const box = document.getElementById("governance-report-center-output");
  if (box) {
    box.innerHTML = "<div style='color:#94a3b8;text-align:center;'>تم مسح العرض.</div>";
  }
}


// ======================================
// 10) أدوات مساعدة
// ======================================

function extractIndexAlignmentAudit(guards) {
  return guards?.indexAlignmentAudit || null;
}

function extractFamilyMemoryAudit(guards) {
  return guards?.familyMemoryAudit || null;
}

function escapeGovernanceHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ======================================
// 11) تصدير عام
// ======================================

window.GOVERNANCE_REPORT_CENTER_CHARTER = GOVERNANCE_REPORT_CENTER_CHARTER;

window.renderGovernanceReportCenter = renderGovernanceReportCenter;
window.buildGovernanceCouncilFullReport = buildGovernanceCouncilFullReport;
window.buildGovernanceExecutiveSummary = buildGovernanceExecutiveSummary;

window.showGovernanceCouncilExecutiveReport = showGovernanceCouncilExecutiveReport;
window.showGovernanceSectionReport = showGovernanceSectionReport;
window.showSelectedDepartmentGovernanceReport = showSelectedDepartmentGovernanceReport;

window.copyGovernanceExecutiveReport = copyGovernanceExecutiveReport;
window.copyGovernanceFullReport = copyGovernanceFullReport;
window.clearGovernanceReportCenterOutput = clearGovernanceReportCenterOutput;

console.log("📋 مركز تقارير المجلس الحوكمي جاهز V1");

