// ================================
// report-manager.js
// مدير التقارير الموحد — V1
// الوظيفة: إدارة عرض، بناء، ونسخ التقارير داخل لوحة موحدة
// ================================

console.log("📊 phoneme-report-manager.js جاهز V1");

// ======================================
// 1. فتح قائمة خيارات التقرير (عرض / إعادة بناء)
// ======================================
function openReportMenu(reportType, phonemeKey) {
  const modal = document.getElementById('report-modal');
  const overlay = document.getElementById('report-modal-overlay');
  
  if(!modal || !overlay) {
    console.error("❌ واجهة إدارة التقارير غير موجودة في HTML.");
    return;
  }

  // تعيين العناوين حسب نوع التقرير
  let title = "إدارة التقرير";
  if(reportType === 'signal') title = "🛡️ تقرير جودة التسجيل";
  if(reportType === 'memory') title = "🧠 تقرير الذاكرة الإدراكية";
  if(reportType === 'cognitive') title = "🧬 تقرير الجينوم المركزي";
  if(reportType === 'timeline') title = "⏳ تقرير الجينوم الزمني";

  document.getElementById('report-modal-title').innerText = title;

  // ربط الأزرار بالوظائف
  document.getElementById('btn-view-report').onclick = function() {
    closeReportMenu();
    viewSavedReport(reportType, phonemeKey);
  };

  document.getElementById('btn-build-report').onclick = function() {
    closeReportMenu();
    executeReportBuild(reportType, phonemeKey);
  };

  // إظهار النافذة
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeReportMenu() {
  document.getElementById('report-modal').style.display = 'none';
  document.getElementById('report-modal-overlay').style.display = 'none';
}

// ======================================
// 2. عرض التقرير المحفوظ (دون إعادة بناء)
// ======================================
function viewSavedReport(reportType, phonemeKey) {
  let data = null;

  if (reportType === 'signal') {
    data = localStorage.getItem(phonemeKey + "_signal_quality_report");
    if(data) {
      renderToUnifiedPanel(`<pre style="color:#e5e7eb; font-family:monospace; white-space:pre-wrap; font-size:14px;">${data}</pre>`);
      return;
    }
  } 
  else if (reportType === 'cognitive') {
    data = localStorage.getItem(phonemeKey + "_cognitive_identity");
    if(data) {
      if(typeof renderCognitiveReport === 'function') {
        renderCognitiveReport(JSON.parse(data));
      }
      return;
    }
  } 
  else if (reportType === 'timeline') {
    data = localStorage.getItem(phonemeKey + "_timeline_genome");
    if(data) {
      if(typeof renderTimelineGenomeReport === 'function') {
        renderTimelineGenomeReport(phonemeKey, JSON.parse(data));
      }
      return;
    }
  }
  else if (reportType === 'memory') {
    // التعديل: استخدام المفتاح الصحيح _perceptual_identity بدلاً من _memory
    data = localStorage.getItem(phonemeKey + "_perceptual_identity");
    if(data) {
      const parsed = JSON.parse(data);
      if(typeof renderPhonemeMemoryReport === 'function') {
        renderPhonemeMemoryReport(parsed);
      } else {
        const html = `
          <h3 style="color:#38bdf8;">🧠 الذاكرة الإدراكية — ${phonemeKey}</h3>
          <pre style="color:#e5e7eb; background:#111827; padding:10px; border-radius:8px; text-align:left; direction:ltr;">${JSON.stringify(parsed, null, 2)}</pre>
        `;
        renderToUnifiedPanel(html);
      }
      return;
    }
  }

  // إذا لم يتم العثور على التقرير
  alert("⚠️ لا يوجد تقرير محفوظ. أعد البناء أولاً.");
}

// ======================================
// 3. تنفيذ عملية البناء (استدعاء المحركات الأصلية)
// ======================================
function executeReportBuild(reportType, phonemeKey) {
  if (reportType === 'signal') {
    if(typeof testSignalQualityForPhoneme === 'function') testSignalQualityForPhoneme(phonemeKey);
  } 
  else if (reportType === 'memory') {
    if(typeof trainPhonemeMemory === 'function') trainPhonemeMemory(phonemeKey);
  } 
  else if (reportType === 'cognitive') {
    if(typeof buildPhonemeCognitiveIdentity === 'function') buildPhonemeCognitiveIdentity(phonemeKey);
  } 
  else if (reportType === 'timeline') {
    if(typeof buildTimelineGenomeForPhoneme === 'function') buildTimelineGenomeForPhoneme(phonemeKey);
  }
}

// ======================================
// 4. عرض المخرجات داخل اللوحة الموحدة
// ======================================
function renderToUnifiedPanel(htmlContent, canvasElements = []) {
  const panel = document.getElementById("unified-report-panel");
  const contentBox = document.getElementById("unified-report-content");
  
  if(!panel || !contentBox) return;

  // تفريغ اللوحة القديمة
  contentBox.innerHTML = htmlContent;

  // إرفاق الرسوم البيانية إن وجدت
  canvasElements.forEach(canvas => {
    if(canvas) contentBox.appendChild(canvas);
  });

  // إظهار اللوحة والنزول إليها
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ======================================
// 5. نسخ التقرير المعروض حالياً
// ======================================
function copyCurrentReport() {
  const panel = document.getElementById("unified-report-panel");

  if (!panel || !panel.innerText.trim()) {
    alert("⚠️ لا يوجد تقرير ظاهر حاليًا.");
    return;
  }

  navigator.clipboard.writeText(panel.innerText.trim()).then(function () {
    alert("✅ تم نسخ التقرير الحالي فقط.");
  }).catch(function (err) {
    alert("❌ فشل نسخ التقرير: " + err);
  });
}

// ======================================
// 6. نسخ جميع تقارير الحقيبة (تجميعي)
// ======================================
function copyAllPhonemeReports(phonemeKey) {
  const contentBox = document.getElementById("unified-report-content");

  if (!contentBox || !contentBox.innerText.trim()) {
    alert("⚠️ لا توجد تقارير ظاهرة حاليًا لنسخها.");
    return;
  }

  const fullText =
    "=== 📚 التقارير الحالية لحقيبة (" + phonemeKey + ") ===\n\n" +
    contentBox.innerText.trim();

  navigator.clipboard.writeText(fullText).then(function () {
    alert("✅ تم نسخ التقارير الحالية فقط.");
  }).catch(function (err) {
    alert("❌ فشل النسخ: " + err);
  });
}
// ======================================
// 7. تصدير عام للدوال
// ======================================

console.log("✅ phoneme-report-manager.js loaded and exported");

window.openReportMenu = openReportMenu;
window.closeReportMenu = closeReportMenu;
window.viewSavedReport = viewSavedReport;
window.executeReportBuild = executeReportBuild;
window.renderToUnifiedPanel = renderToUnifiedPanel;
window.copyCurrentReport = copyCurrentReport;
window.copyAllPhonemeReports = copyAllPhonemeReports;
