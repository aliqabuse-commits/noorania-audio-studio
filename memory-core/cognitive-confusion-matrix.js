// ================================
// cognitive-confusion-matrix.js
// مصفوفة الالتباس الإدراكي للحروف
// ================================

console.log("🧩 cognitive-confusion-matrix.js جاهز");

const COGNITIVE_CONFUSION_SOURCE_KEY =
  "cognitive_match_results_log";

function readConfusionLog() {
  try {
    return JSON.parse(
      localStorage.getItem(COGNITIVE_CONFUSION_SOURCE_KEY) || "[]"
    );
  } catch (err) {
    console.error("❌ فشل قراءة سجل الالتباس", err);
    return [];
  }
}

function buildCognitiveConfusionMatrix() {
  const log = readConfusionLog();

  const keys =
    typeof getAvailablePhonemeKeysForMatch === "function"
      ? getAvailablePhonemeKeysForMatch()
      : collectKeysFromLog(log);

  const matrix = {};

  keys.forEach(function (actual) {
    matrix[actual] = {};

    keys.forEach(function (detected) {
      matrix[actual][detected] = {
        count: 0,
        margins: []
      };
    });
  });

  log.forEach(function (r) {
    const actual = r.actualKey || "unknown";
    const detected = r.detectedKey || "unknown";

    if (!matrix[actual]) {
      matrix[actual] = {};
    }

    if (!matrix[actual][detected]) {
      matrix[actual][detected] = {
        count: 0,
        margins: []
      };
    }

    matrix[actual][detected].count++;

    if (typeof r.margin === "number") {
      matrix[actual][detected].margins.push(r.margin);
    }
  });

  return {
    keys,
    matrix,
    total: log.length,
    createdAt: new Date().toISOString()
  };
}

function renderCognitiveConfusionMatrix() {
  const data = buildCognitiveConfusionMatrix();

  let box =
    document.getElementById("cognitive-confusion-matrix-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "cognitive-confusion-matrix-box";

    box.style.background = "#08111f";
    box.style.color = "white";
    box.style.border = "1px solid #334155";
    box.style.borderRadius = "14px";
    box.style.padding = "14px";
    box.style.margin = "14px 0";
    box.style.overflowX = "auto";

    const target =
      document.getElementById("cognitive-statistics-page-content") ||
      document.getElementById("perceptualTrainingView") ||
      document.body;

    target.appendChild(box);
  }

  if (!data.total) {
    box.innerHTML = `
      <h3>🧩 مصفوفة الالتباس</h3>
      <div>لا توجد اختبارات كافية لبناء المصفوفة.</div>
    `;
    return;
  }

  let html = `
    <h3 style="margin-top:0;">
      🧩 مصفوفة الالتباس الإدراكي
    </h3>

    <div style="font-size:13px;color:#cbd5e1;margin-bottom:10px;">
      الصف = الحرف المنطوق فعليًا، العمود = الحرف الذي اكتشفه النظام.
    </div>

    <table style="
      width:100%;
      border-collapse:collapse;
      text-align:center;
      font-size:13px;
    ">
      <thead>
        <tr>
          <th style="border:1px solid #334155;padding:6px;">
            المنطوق \\ المكتشف
          </th>
  `;

  data.keys.forEach(function (key) {
    html += `
      <th style="border:1px solid #334155;padding:6px;">
        ${key}
      </th>
    `;
  });

  html += `
        </tr>
      </thead>
      <tbody>
  `;

  data.keys.forEach(function (actual) {
    html += `
      <tr>
        <td style="
          border:1px solid #334155;
          padding:6px;
          font-weight:bold;
          color:#38bdf8;
        ">
          ${actual}
        </td>
    `;

    data.keys.forEach(function (detected) {
      const cell =
        data.matrix[actual] &&
        data.matrix[actual][detected]
          ? data.matrix[actual][detected]
          : { count: 0, margins: [] };

      const isCorrect = actual === detected;

      const bg = cell.count
        ? isCorrect
          ? "#14532d"
          : "#7f1d1d"
        : "#111827";

      const avgMargin = averageConfusion(cell.margins);

      html += `
        <td style="
          border:1px solid #334155;
          padding:6px;
          background:${bg};
        ">
          <div style="font-weight:bold;">
            ${cell.count}
          </div>
          ${
            cell.count
              ? `<div style="font-size:11px;color:#cbd5e1;">هامش: ${avgMargin}</div>`
              : ""
          }
        </td>
      `;
    });

    html += `
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <hr style="border-color:#1f2937;margin:14px 0;">

    ${renderTopConfusions(data)}
  `;

  box.innerHTML = html;
  box.scrollIntoView({ behavior: "smooth", block: "center" });

  return data;
}

function renderTopConfusions(data) {
  const list = [];

  data.keys.forEach(function (actual) {
    data.keys.forEach(function (detected) {
      if (actual === detected) return;

      const cell =
        data.matrix[actual] &&
        data.matrix[actual][detected];

      if (!cell || !cell.count) return;

      list.push({
        actual,
        detected,
        count: cell.count,
        avgMargin: averageConfusion(cell.margins)
      });
    });
  });

  list.sort(function (a, b) {
    return b.count - a.count;
  });

  if (!list.length) {
    return `
      <h4>أقوى الالتباسات</h4>
      <div>لا توجد التباسات مسجلة.</div>
    `;
  }

  let html = `
    <h4>أقوى الالتباسات</h4>
  `;

  list.slice(0, 10).forEach(function (item) {
    html += `
      <div style="
        background:#111827;
        padding:8px;
        margin:6px 0;
        border-radius:8px;
        border-right:4px solid #ef4444;
      ">
        <b>${item.actual} → ${item.detected}</b>
        — التكرار: ${item.count}
        — متوسط الهامش: ${item.avgMargin}
      </div>
    `;
  });

  return html;
}

function collectKeysFromLog(log) {
  const set = {};

  log.forEach(function (r) {
    if (r.actualKey) set[r.actualKey] = true;
    if (r.detectedKey) set[r.detectedKey] = true;
  });

  return Object.keys(set);
}

function averageConfusion(values) {
  const clean = values.filter(function (v) {
    return typeof v === "number" && !isNaN(v);
  });

  if (!clean.length) return 0;

  const avg =
    clean.reduce(function (a, b) {
      return a + b;
    }, 0) / clean.length;

  return Number(avg.toFixed(4));
}

window.buildCognitiveConfusionMatrix =
  buildCognitiveConfusionMatrix;

window.renderCognitiveConfusionMatrix =
  renderCognitiveConfusionMatrix;

console.log("🧩 مصفوفة الالتباس الإدراكي جاهزة");
