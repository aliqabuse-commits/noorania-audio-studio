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

console.log(
  "⏳ محرك المسار الزمني الإدراكي للحرف جاهز"
);
