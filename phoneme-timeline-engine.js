// ================================
// phoneme-timeline-engine.js
// محرك المسار الزمني الإدراكي للحرف — V1
// المرحلة الأولى لبناء السلوك الزمني للحروف
// ================================

console.log("⏳ phoneme-timeline-engine.js جاهز V1");

// ======================================
// تنظيف الذاكرة المؤقتة (إجباري)
// الهدف: التخلص من الجينومات الزمنية القديمة والضخمة التي تسببت 
// في خطأ (Exceeded the quota) بسبب احتوائها على آلاف الإطارات.
// ======================================
try {
  Object.keys(localStorage)
    .filter(k => k.endsWith("_timeline_genome"))
    .forEach(k => {
      localStorage.removeItem(k);
      console.log("🗑️ تم حذف الجينوم الزمني القديم:", k);
    });
} catch (err) {
  console.warn("⚠️ فشل تنظيف localStorage:", err);
}


// ======================================
// بناء المسار الزمني الإدراكي للحرف
// ======================================

function buildPhonemeTimeline(samples, sampleRate) {

  // ======================================
  // تقسيم الصوت إلى نوافذ زمنية صغيرة
  // ======================================

  const frames =
    splitSamplesIntoFrames(
      samples,
      sampleRate,
      1024,
      512
    );

  // ======================================
  // تحليل كل نافذة صوتية
  // ======================================

  const analyzedFrames =
    frames.map(function (frame, index) {

      const energy =
        calculateFrameEnergy(frame);

      const zcr =
        calculateFrameZCR(frame);

      const centroid =
        calculateFrameCentroid(
          frame,
          sampleRate
        );

      const spread =
        calculateFrameSpread(
          frame,
          sampleRate,
          centroid
        );

      return {
        index: index,
        energy: energy,
        zcr: zcr,
        centroid: centroid,
        spread: spread
      };
    });


  // ======================================
  // استخراج مراحل الحرف
  // ======================================

  const onset =
    detectTimelineOnset(analyzedFrames);

  const burst =
    detectTimelineBurst(analyzedFrames);

  const transition =
    detectTimelineTransition(analyzedFrames);

  const sustain =
    detectTimelineSustain(analyzedFrames);

  const release =
    detectTimelineRelease(analyzedFrames);


  // ======================================
  // بناء التقرير الزمني النهائي
  // ======================================

  return {

    onset: onset,

    burst: burst,

    transition: transition,

    sustain: sustain,

    release: release,

    frames: analyzedFrames
  };
}


// ======================================
// تقسيم العينات إلى نوافذ زمنية
// ======================================

function splitSamplesIntoFrames(
  samples,
  sampleRate,
  frameSize,
  hopSize
) {

  const frames = [];

  for (
    let i = 0;
    i < samples.length - frameSize;
    i += hopSize
  ) {

    const frame =
      samples.slice(i, i + frameSize);

    frames.push(frame);
  }

  return frames;
}


// ======================================
// حساب طاقة الإطار
// ======================================

function calculateFrameEnergy(frame) {

  let sum = 0;

  for (let i = 0; i < frame.length; i++) {
    sum += frame[i] * frame[i];
  }

  return Math.sqrt(sum / frame.length);
}


// ======================================
// حساب معدل عبور الصفر
// ======================================

function calculateFrameZCR(frame) {

  let crossings = 0;

  for (let i = 1; i < frame.length; i++) {

    const prev = frame[i - 1];
    const curr = frame[i];

    if (
      (prev >= 0 && curr < 0) ||
      (prev < 0 && curr >= 0)
    ) {
      crossings++;
    }
  }

  return crossings / frame.length;
}


// ======================================
// حساب centroid الطيفي
// ======================================

function calculateFrameCentroid(
  frame,
  sampleRate
) {

  let weighted = 0;
  let total = 0;

  for (let i = 0; i < frame.length; i++) {

    const magnitude =
      Math.abs(frame[i]);

    weighted += i * magnitude;

    total += magnitude;
  }

  if (!total) return 0;

  return (
    (weighted / total) *
    (sampleRate / frame.length)
  );
}


// ======================================
// حساب spread الطيفي
// ======================================

function calculateFrameSpread(
  frame,
  sampleRate,
  centroid
) {

  let weighted = 0;
  let total = 0;

  for (let i = 0; i < frame.length; i++) {

    const magnitude =
      Math.abs(frame[i]);

    const frequency =
      i * sampleRate / frame.length;

    weighted +=
      Math.pow(
        frequency - centroid,
        2
      ) * magnitude;

    total += magnitude;
  }

  if (!total) return 0;

  return Math.sqrt(weighted / total);
}


// ======================================
// اكتشاف بداية الحرف
// ======================================

function detectTimelineOnset(frames) {

  for (let i = 0; i < frames.length; i++) {

    if (frames[i].energy > 0.02) {

      return {
        frameIndex: i,
        energy: frames[i].energy,
        centroid: frames[i].centroid
      };
    }
  }

  return null;
}


// ======================================
// اكتشاف الانفجار
// ======================================

function detectTimelineBurst(frames) {

  let maxEnergy = 0;
  let burstFrame = null;

  frames.forEach(function (frame) {

    if (frame.energy > maxEnergy) {

      maxEnergy = frame.energy;

      burstFrame = frame;
    }
  });

  return burstFrame;
}


// ======================================
// اكتشاف الانتقال
// ======================================

function detectTimelineTransition(frames) {

  let maxMovement = 0;
  let transitionFrame = null;

  for (let i = 1; i < frames.length; i++) {

    const movement =
      Math.abs(
        frames[i].centroid -
        frames[i - 1].centroid
      );

    if (movement > maxMovement) {

      maxMovement = movement;

      transitionFrame = frames[i];
    }
  }

  return transitionFrame;
}


// ======================================
// اكتشاف الاستقرار
// ======================================

function detectTimelineSustain(frames) {

  let bestFrame = null;
  let bestScore = Infinity;

  for (let i = 1; i < frames.length - 1; i++) {

    const delta1 =
      Math.abs(
        frames[i].energy -
        frames[i - 1].energy
      );

    const delta2 =
      Math.abs(
        frames[i].energy -
        frames[i + 1].energy
      );

    const score = delta1 + delta2;

    if (score < bestScore) {

      bestScore = score;

      bestFrame = frames[i];
    }
  }

  return bestFrame;
}


// ======================================
// اكتشاف الذيل النهائي
// ======================================

function detectTimelineRelease(frames) {

  for (
    let i = frames.length - 1;
    i >= 0;
    i--
  ) {

    if (frames[i].energy > 0.01) {

      return {
        frameIndex: i,
        energy: frames[i].energy,
        centroid: frames[i].centroid
      };
    }
  }

  return null;
}


// ======================================
// بناء المسار الزمني من زر الحقيبة (عينة واحدة للاختبار)
// ======================================

async function buildTimelineForCurrentPhoneme(key) {
  alert(
    "⏳ سيبدأ بناء المسار الزمني للحرف:\n\n" +
    key +
    "\n\nسجّل الآن صوت الحرف."
  );

  if (typeof recordMatchSample !== "function") {
    alert("دالة التسجيل recordMatchSample غير موجودة.");
    return;
  }

  if (typeof decodeCognitiveBlob !== "function") {
    alert("دالة فك الصوت decodeCognitiveBlob غير موجودة.");
    return;
  }

  try {
    const blob =
      await recordMatchSample();

    if (!blob) {
      alert("فشل تسجيل عينة المسار الزمني.");
      return;
    }

    const decoded =
      await decodeCognitiveBlob(blob);

    const timeline =
      buildPhonemeTimeline(
        decoded.samples,
        decoded.sampleRate
      );

    localStorage.setItem(
      key + "_timeline_genome",
      JSON.stringify(timeline, null, 2)
    );

    renderTimelineReport(key, timeline);

    alert("✅ تم بناء المسار الزمني وحفظه.");
  } catch (err) {
    console.error("❌ فشل بناء المسار الزمني:", err);

    alert(
      "فشل بناء المسار الزمني:\n" +
      err.message
    );
  }
}


// ======================================
// عرض تقرير المسار الزمني لعينة واحدة في الواجهة
// ======================================

function renderTimelineReport(key, timeline) {
  let box =
    document.getElementById("timeline-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "timeline-report-box";

    box.style.background = "#111827";
    box.style.color = "#e5e7eb";
    box.style.padding = "12px";
    box.style.marginTop = "14px";
    box.style.borderRadius = "12px";
    box.style.lineHeight = "1.8";

    const parent =
      document.getElementById("phonemeCardsGrid");

    if (parent) {
      parent.appendChild(box);
    }
  }

  box.innerHTML = `
    <h3>⏳ تقرير المسار الزمني — ${key}</h3>

    <div>
      <b>onset:</b>
      ${timeline.onset ? "frame " + timeline.onset.frameIndex : "غير محدد"}
    </div>

    <div>
      <b>burst:</b>
      ${timeline.burst ? "frame " + timeline.burst.index + " / energy " + timeline.burst.energy.toFixed(4) : "غير محدد"}
    </div>

    <div>
      <b>transition:</b>
      ${timeline.transition ? "frame " + timeline.transition.index : "غير محدد"}
    </div>

    <div>
      <b>sustain:</b>
      ${timeline.sustain ? "frame " + timeline.sustain.index : "غير محدد"}
    </div>

    <div>
      <b>release:</b>
      ${timeline.release ? "frame " + timeline.release.frameIndex : "غير محدد"}
    </div>
  `;
}


// =====================================================================
// =====================================================================
// التحديث الجديد: بناء الجينوم الزمني المترابط والمقيد ترتيبياً (V1.5)
// =====================================================================
// =====================================================================

// ======================================
// بناء المسار الزمني المرتب إجبارياً
// ======================================
function buildOrderedPhonemeTimeline(samples, sampleRate) {
  const frames = splitSamplesIntoFrames(samples, sampleRate, 1024, 512);

  const analyzedFrames = frames.map(function (frame, index) {
    return {
      index: index,
      energy: calculateFrameEnergy(frame),
      zcr: calculateFrameZCR(frame),
      centroid: calculateFrameCentroid(frame, sampleRate),
      spread: calculateFrameSpread(frame, sampleRate, calculateFrameCentroid(frame, sampleRate))
    };
  });

  // 1. Onset (البداية)
  let onset = null;
  for (let i = 0; i < analyzedFrames.length; i++) {
    if (analyzedFrames[i].energy > 0.02) {
      onset = analyzedFrames[i];
      break;
    }
  }
  let onsetIdx = onset ? onset.index : 0;

  // 2. Burst (الانفجار - يبحث بعد البداية)
  let burst = null;
  let maxEnergy = 0;
  for (let i = onsetIdx; i < analyzedFrames.length; i++) {
    if (analyzedFrames[i].energy > maxEnergy) {
      maxEnergy = analyzedFrames[i].energy;
      burst = analyzedFrames[i];
    }
  }
  let burstIdx = burst ? burst.index : onsetIdx;

  // 3. Transition (الانتقال - يبحث بعد الانفجار)
  let transition = null;
  let maxMovement = 0;
  for (let i = burstIdx + 1; i < analyzedFrames.length; i++) {
    let movement = Math.abs(analyzedFrames[i].centroid - analyzedFrames[i - 1].centroid);
    if (movement > maxMovement) {
      maxMovement = movement;
      transition = analyzedFrames[i];
    }
  }
  let transIdx = transition ? transition.index : burstIdx;

  // 4. Sustain (الاستقرار - يبحث بعد الانتقال)
  let sustain = null;
  let bestScore = Infinity;
  for (let i = transIdx + 1; i < analyzedFrames.length - 1; i++) {
    let delta1 = Math.abs(analyzedFrames[i].energy - analyzedFrames[i - 1].energy);
    let delta2 = Math.abs(analyzedFrames[i].energy - analyzedFrames[i + 1].energy);
    let score = delta1 + delta2;
    if (score < bestScore) {
      bestScore = score;
      sustain = analyzedFrames[i];
    }
  }
  let sustainIdx = sustain ? sustain.index : transIdx;

  // 5. Release
  let release = null;
  for (let i = analyzedFrames.length - 1; i >= sustainIdx; i--) {
    if (analyzedFrames[i].energy > 0.01) {
      release = analyzedFrames[i];
      break;
    }
  }

  if (!release) {
    release = analyzedFrames[analyzedFrames.length - 1];
  }

  // ======================================
  // التعديل: تقليص حجم الكائن المُرجع لتوفير مساحة التخزين (Slimmed-down)
  // لا يتم إرجاع مصفوفة الإطارات (frames) الكاملة.
  // ======================================
  return {
    onset: onset ? {
      index: onset.index,
      energy: onset.energy,
      centroid: onset.centroid
    } : null,

    burst: burst ? {
      index: burst.index,
      energy: burst.energy,
      centroid: burst.centroid
    } : null,

    transition: transition ? {
      index: transition.index,
      energy: transition.energy,
      centroid: transition.centroid
    } : null,

    sustain: sustain ? {
      index: sustain.index,
      energy: sustain.energy,
      centroid: sustain.centroid
    } : null,

    release: release ? {
      index: release.index,
      energy: release.energy,
      centroid: release.centroid
    } : null
  };
}


// ======================================
// جلب الملف الصوتي من تخزين المشروع
// ======================================
async function getAudioBlobSafely(fileName) {

  // الطريقة الأساسية المعتمدة في مشروعنا
  if (typeof getAudioPromiseForMemory === "function") {
    const blob =
      await getAudioPromiseForMemory(
        fileName,
        3000
      );

    if (blob) {
      return blob;
    }
  }

  // محاولة احتياطية من localStorage
  const dataUrl =
    localStorage.getItem("audio_" + fileName) ||
    localStorage.getItem(fileName) ||
    localStorage.getItem("record_" + fileName);

  if (dataUrl) {
    try {
      const response =
        await fetch(dataUrl);

      return await response.blob();

    } catch (err) {
      console.warn(
        "تعذر تحويل التسجيل إلى Blob:",
        fileName,
        err
      );
    }
  }

  return null;
}


// ======================================
// بناء الجينوم الزمني لجميع عينات الحقيبة
// ======================================
async function buildTimelineGenomeForPhoneme(key) {
  alert("⏳ بدأ بناء المسار الزمني للحقيبة: " + key);

  try {
    if (typeof getPhonemeTrainingPack !== "function") {
      alert("❌ دالة getPhonemeTrainingPack غير موجودة.");
      return;
    }

    const pack = getPhonemeTrainingPack(key);

    if (!pack) {
      alert("❌ لم يتم العثور على حقيبة الحرف: " + key);
      return;
    }

    alert(
      "تم العثور على الحقيبة: " + key + "\n\n" +
      "عدد العينات: " + pack.positions.length
    );

    const genomeRecords = [];

    for (const pos of pack.positions) {
      try {
        console.log("⏳ فحص عينة:", pos.text, pos.file);

        const blob = await getAudioBlobSafely(pos.file);

        if (!blob) {
          console.warn("⚠️ لا يوجد تسجيل:", pos.file);
          continue;
        }

        if (typeof decodeCognitiveBlob !== "function") {
          alert("❌ دالة decodeCognitiveBlob غير موجودة.");
          return;
        }

        const decoded = await decodeCognitiveBlob(blob);

        const timeline = buildOrderedPhonemeTimeline(
          decoded.samples,
          decoded.sampleRate
        );

        genomeRecords.push({
          position: pos,
          timeline: timeline
        });

      } catch (err) {
        alert(
          "❌ فشل تحليل العينة:\n" +
          pos.text + "\n" +
          pos.file + "\n\n" +
          err.message
        );

        console.error("❌ فشل تحليل العينة:", pos.file, err);
      }
    }

    if (!genomeRecords.length) {
      alert(
        "⚠️ لم يتم تحليل أي عينة للحقيبة: " + key +
        "\n\nقد تكون التسجيلات غير موجودة أو فشل فك الصوت."
      );
      return;
    }

    const timelineGenome = {
      key: key,
      records: genomeRecords,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(
      key + "_timeline_genome",
      JSON.stringify(timelineGenome, null, 2)
    );

    renderTimelineGenomeReport(key, timelineGenome);

    alert("✅ تم بناء الجينوم الزمني الشامل للحرف وحفظه بنجاح.");

  } catch (err) {
    alert(
      "❌ توقف بناء المسار الزمني للحقيبة:\n" +
      key +
      "\n\n" +
      err.message
    );

    console.error("❌ buildTimelineGenomeForPhoneme error:", err);
  }
}


// ======================================
// عرض تقرير الجينوم الزمني المتكامل للحقيبة
// ======================================
function renderTimelineGenomeReport(key, timelineGenome) {
  let box = document.getElementById("timeline-report-box");

  if (!box) {
    box = document.createElement("div");
    box.id = "timeline-report-box";
    box.style.background = "#0f172a"; // أغمق قليلاً للتمييز
    box.style.color = "#e5e7eb";
    box.style.padding = "16px";
    box.style.marginTop = "14px";
    box.style.borderRadius = "12px";
    box.style.border = "1px solid #38bdf8";
    box.style.lineHeight = "1.8";

    // نضع التقرير داخل الشبكة إذا كانت موجودة
    const parent = document.getElementById("phonemeCardsGrid") || document.body;
    parent.appendChild(box);
  }

  let html = `<h3 style="color: #38bdf8;">⏳ الجينوم الزمني — ${key}</h3>`;

  let sumOnset = 0, sumBurst = 0, sumTrans = 0, sumSustain = 0, sumRelease = 0;
  let count = timelineGenome.records.length;

  if (count === 0) {
    box.innerHTML = html + "<p>لا توجد بيانات زمنية لعرضها.</p>";
    return;
  }

  // طباعة العينات بترتيبها
  timelineGenome.records.forEach(record => {
    let tl = record.timeline;
    
    // نستخرج الفهارس الزمنية بشكل آمن
    let oIdx = tl.onset ? tl.onset.index : 0;
    let bIdx = tl.burst ? tl.burst.index : 0;
    let tIdx = tl.transition ? tl.transition.index : 0;
    let sIdx = tl.sustain ? tl.sustain.index : 0;
    let rIdx = tl.release ? tl.release.index : 0;

    // جمع القيم لحساب المتوسط لاحقاً
    sumOnset += oIdx; 
    sumBurst += bIdx; 
    sumTrans += tIdx; 
    sumSustain += sIdx; 
    sumRelease += rIdx;

    html += `
      <div style="margin-bottom: 12px; padding: 12px; background: #1e293b; border-radius: 8px;">
        <b style="color: #facc15;">العينة: ${record.position.text}</b><br>
        <span style="font-size: 14px; color: #cbd5e1; font-family: monospace;">
          onset (${oIdx}) → burst (${bIdx}) → transition (${tIdx}) → sustain (${sIdx}) → release (${rIdx})
        </span>
      </div>
    `;
  });

  // طباعة المتوسطات الحسابية
  html += `
    <div style="margin-top: 18px; border-top: 1px solid #334155; padding-top: 14px;">
      <b style="color: #22c55e;">📊 متوسط المراحل الزمنية للجينوم:</b><br>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 14px;">
        <div>متوسط onset: <b style="color:white;">${Math.round(sumOnset / count)}</b></div>
        <div>متوسط burst: <b style="color:white;">${Math.round(sumBurst / count)}</b></div>
        <div>متوسط transition: <b style="color:white;">${Math.round(sumTrans / count)}</b></div>
        <div>متوسط sustain: <b style="color:white;">${Math.round(sumSustain / count)}</b></div>
        <div>متوسط release: <b style="color:white;">${Math.round(sumRelease / count)}</b></div>
      </div>
    </div>
  `;

  box.innerHTML = html;
  
  // لفت الانتباه للمستخدم بأن التقرير تم تحديثه
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// ======================================
// إتاحة الدوال للواجهة
// ======================================

window.buildPhonemeTimeline = buildPhonemeTimeline;
window.buildOrderedPhonemeTimeline = buildOrderedPhonemeTimeline;
window.buildTimelineForCurrentPhoneme = buildTimelineForCurrentPhoneme;
window.buildTimelineGenomeForPhoneme = buildTimelineGenomeForPhoneme;
window.renderTimelineReport = renderTimelineReport;
window.renderTimelineGenomeReport = renderTimelineGenomeReport;

console.log(
  "⏳ محرك المسار الزمني الإدراكي للحرف جاهز V1.5"
);
