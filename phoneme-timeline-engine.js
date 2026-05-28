// ================================
// phoneme-timeline-engine.js
// محرك المسار الزمني الإدراكي للحرف — V1
// المرحلة الأولى لبناء السلوك الزمني للحروف
// ================================

console.log("⏳ phoneme-timeline-engine.js جاهز V1");


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
// واجهات عامة للنظام
// ======================================

window.buildPhonemeTimeline =
  buildPhonemeTimeline;
// ======================================
// بناء المسار الزمني من زر الحقيبة
// الهدف:
// هذه الدالة هي الجسر بين زر الواجهة
// ومحرك تحليل المسار الزمني الداخلي
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
// عرض تقرير المسار الزمني في الواجهة
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


// ======================================
// إتاحة الدوال للواجهة
// ======================================

window.buildTimelineForCurrentPhoneme =
  buildTimelineForCurrentPhoneme;

window.renderTimelineReport =
  renderTimelineReport;
console.log(
  "⏳ محرك المسار الزمني الإدراكي للحرف جاهز"
);
