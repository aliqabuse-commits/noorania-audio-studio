// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.4
// فصل أنظف + دمج حي Crossfade
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.4");

let baseSegmentBlob = null;        // بَصْ
let replacementBlob = null;        // قَ
let extractedPayloadBlob = null;   // صْ
let mergedSegmentBlob = null;      // قَصْ


// ======================================
// تحديث حالة المختبر
// ======================================

function updateMergeSplitStatus(message) {
  const box = document.getElementById("merge-split-status");

  if (box) {
    box.innerHTML = message;
  }
}


// ======================================
// تسجيل المقطع الأصلي بَصْ
// ======================================

async function recordBaseSegment() {
  alert("اضغط حسنًا، ثم سجّل الآن المقطع: بَصْ");

  baseSegmentBlob = await recordMergeSample(3000);

  if (!baseSegmentBlob) {
    alert("فشل تسجيل المقطع بَصْ");
    return;
  }

  extractedPayloadBlob = null;
  mergedSegmentBlob = null;

  updateMergeSplitStatus(
    "✅ تم تسجيل المقطع الأصلي: <b>بَصْ</b><br>" +
    "الحجم: " + baseSegmentBlob.size + " bytes<br>" +
    "النوع: " + baseSegmentBlob.type
  );

  alert("✅ تم تسجيل المقطع بَصْ");
}


// ======================================
// تسجيل الحرف البديل قَ
// ======================================

async function recordCarrierReplacement() {
  alert("اضغط حسنًا، ثم سجّل الآن الحرف البديل: قَ");

  replacementBlob = await recordMergeSample(2000);

  if (!replacementBlob) {
    alert("فشل تسجيل الحرف قَ");
    return;
  }

  mergedSegmentBlob = null;

  updateMergeSplitStatus(
    "✅ تم تسجيل الحرف البديل: <b>قَ</b><br>" +
    "الحجم: " + replacementBlob.size + " bytes<br>" +
    "النوع: " + replacementBlob.type
  );

  alert("✅ تم تسجيل الحرف قَ");
}


// ======================================
// تسجيل صوت حقيقي لمختبر الفصل والدمج
// ======================================

async function recordMergeSample(durationMs) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    return await new Promise(function (resolve) {
      const chunks = [];

      let options = {};

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options.mimeType = "audio/webm";
      }

      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        if (!chunks.length) {
          resolve(null);
          return;
        }

        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm"
        });

        console.log(
          "🎙 MERGE RECORDING:",
          "size =", blob.size,
          "type =", blob.type
        );

        resolve(blob);
      };

      recorder.start();

      setTimeout(function () {
        if (recorder.state !== "inactive") {
          recorder.requestData();
          recorder.stop();
        }
      }, durationMs || 3000);
    });

  } catch (err) {
    console.error("❌ فشل تسجيل مختبر الفصل والدمج:", err);
    return null;
  }
}


// ======================================
// تشغيل أي Blob صوتي
// ======================================

function playBlob(blob, label) {
  if (!blob) {
    alert("لا يوجد صوت مسجل: " + label);
    return;
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.onended = function () {
    URL.revokeObjectURL(url);
  };

  audio.play().catch(function (err) {
    console.error("فشل التشغيل:", err);
    alert("فشل تشغيل الصوت: " + label);
  });
}


function playBaseSegment() {
  playBlob(baseSegmentBlob, "بَصْ");
}


function playReplacementSegment() {
  playBlob(replacementBlob, "قَ");
}


function playPayloadSegment() {
  playBlob(extractedPayloadBlob, "صْ المفصول");
}


function playMergedSegment() {
  playBlob(mergedSegmentBlob, "قَصْ");
}


// ======================================
// تحويل Blob إلى AudioBuffer
// ======================================

async function blobToAudioBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  const audioContext = new AudioContextClass();

  return await audioContext.decodeAudioData(arrayBuffer);
}


// ======================================
// تحويل AudioBuffer إلى WAV Blob
// ======================================

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;

  const length =
    buffer.length * numChannels * 2 + 44;

  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  let offset = 0;

  writeString(offset, "RIFF");
  offset += 4;

  view.setUint32(offset, length - 8, true);
  offset += 4;

  writeString(offset, "WAVE");
  offset += 4;

  writeString(offset, "fmt ");
  offset += 4;

  view.setUint32(offset, 16, true);
  offset += 4;

  view.setUint16(offset, 1, true);
  offset += 2;

  view.setUint16(offset, numChannels, true);
  offset += 2;

  view.setUint32(offset, sampleRate, true);
  offset += 4;

  view.setUint32(
    offset,
    sampleRate * numChannels * 2,
    true
  );
  offset += 4;

  view.setUint16(offset, numChannels * 2, true);
  offset += 2;

  view.setUint16(offset, 16, true);
  offset += 2;

  writeString(offset, "data");
  offset += 4;

  view.setUint32(offset, length - offset - 4, true);
  offset += 4;

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = buffer.getChannelData(ch)[i];

      sample = Math.max(-1, Math.min(1, sample));

      view.setInt16(
        offset,
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff,
        true
      );

      offset += 2;
    }
  }

  return new Blob([arrayBuffer], {
    type: "audio/wav"
  });
}


// ======================================
// قص AudioBuffer
// ======================================

function sliceAudioBuffer(buffer, startSecond, endSecond) {
  const sampleRate = buffer.sampleRate;

  const startSample =
    Math.floor(startSecond * sampleRate);

  const endSample =
    Math.floor(endSecond * sampleRate);

  const frameCount =
    Math.max(1, endSample - startSample);

  const newBuffer = new AudioBuffer({
    length: frameCount,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: sampleRate
  });

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const source = buffer.getChannelData(ch);
    const target = newBuffer.getChannelData(ch);

    for (let i = 0; i < frameCount; i++) {
      target[i] = source[startSample + i] || 0;
    }
  }

  return newBuffer;
}


// ======================================
// حساب RMS
// ======================================

function rmsOfSamples(samples, start, end) {
  let sum = 0;
  let count = 0;

  for (let i = start; i < end && i < samples.length; i++) {
    sum += samples[i] * samples[i];
    count++;
  }

  return count ? Math.sqrt(sum / count) : 0;
}


// ======================================
// تنظيف البداية من الصمت والشوائب
// ======================================

function trimPayloadStart(buffer) {
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);

  const frameMs = 10;
  const frameSize =
    Math.max(1, Math.floor(sampleRate * frameMs / 1000));

  let maxRms = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms =
      rmsOfSamples(samples, i, i + frameSize);

    if (rms > maxRms) {
      maxRms = rms;
    }
  }

  const threshold =
    Math.max(maxRms * 0.18, 0.006);

  let startFrame = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms =
      rmsOfSamples(samples, i, i + frameSize);

    if (rms >= threshold) {
      startFrame = i;
      break;
    }
  }

  // نترك هامشًا بسيطًا قبل بداية الصاد حتى لا نأكل أولها
  const safetyBack =
    Math.floor(sampleRate * 0.025);

  const cleanStartSample =
    Math.max(0, startFrame - safetyBack);

  const cleanStartSecond =
    cleanStartSample / sampleRate;

  return {
    buffer: sliceAudioBuffer(
      buffer,
      cleanStartSecond,
      buffer.duration
    ),
    cleanStartSecond,
    threshold
  };
}


// ======================================
// قص نهاية الحامل قَ حتى لا يبقى قَ منفصل طويل
// ======================================

function trimReplacementForMerge(buffer) {
  const sampleRate = buffer.sampleRate;

  // نأخذ آخر 65% تقريبًا من قَ لتقليل الإطالة قبل الصاد
  const startSecond =
    Math.max(0, buffer.duration * 0.15);

  const endSecond =
    Math.max(startSecond + 0.05, buffer.duration);

  return sliceAudioBuffer(
    buffer,
    startSecond,
    endSecond
  );
}


// ======================================
// دمج حي Crossfade
// ======================================

function crossfadeAudioBuffers(bufferA, bufferB, fadeSeconds) {
  const sampleRate = bufferA.sampleRate;

  const numberOfChannels =
    Math.min(
      bufferA.numberOfChannels,
      bufferB.numberOfChannels
    );

  let fadeSamples =
    Math.floor((fadeSeconds || 0.06) * sampleRate);

  fadeSamples =
    Math.min(
      fadeSamples,
      Math.floor(bufferA.length * 0.35),
      Math.floor(bufferB.length * 0.35)
    );

  fadeSamples =
    Math.max(1, fadeSamples);

  const outputLength =
    bufferA.length + bufferB.length - fadeSamples;

  const outputBuffer = new AudioBuffer({
    length: outputLength,
    numberOfChannels: numberOfChannels,
    sampleRate: sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);

    const aKeepLength =
      bufferA.length - fadeSamples;

    for (let i = 0; i < aKeepLength; i++) {
      out[i] = a[i];
    }

    for (let i = 0; i < fadeSamples; i++) {
      const t = i / Math.max(1, fadeSamples - 1);

      const fadeOut = 1 - t;
      const fadeIn = t;

      out[aKeepLength + i] =
        a[aKeepLength + i] * fadeOut +
        b[i] * fadeIn;
    }

    for (let i = fadeSamples; i < bufferB.length; i++) {
      out[aKeepLength + i] = b[i];
    }
  }

  return outputBuffer;
}


// ======================================
// فصل بَ عن صْ — بالهوية الإدراكية + تنظيف
// ======================================

async function splitBaseSegment() {
  if (!baseSegmentBlob) {
    alert("سجّل أولًا المقطع بَصْ");
    return;
  }

  try {
    const buffer =
      await blobToAudioBuffer(baseSegmentBlob);

    if (typeof detectPayloadBoundaryByIdentity !== "function") {
      alert("كاشف الحدود الإدراكية غير محمّل");
      return;
    }

    const result =
      detectPayloadBoundaryByIdentity(buffer, {
        carrierKey: "ba",
        payloadKey: "sad",
        windowSize: 0.18,
        hopSize: 0.035,
        minStart: 0.08
      });

    const cutPoint = result.boundary;

    if (!cutPoint) {
      alert("لم يستطع النظام تحديد بداية صْ");
      return;
    }

    let payloadBuffer =
      sliceAudioBuffer(
        buffer,
        cutPoint,
        buffer.duration
      );

    const trimResult =
      trimPayloadStart(payloadBuffer);

    payloadBuffer =
      trimResult.buffer;

    extractedPayloadBlob =
      audioBufferToWavBlob(payloadBuffer);

    mergedSegmentBlob = null;

    updateMergeSplitStatus(
      "🧭 تم الفصل بالهوية الإدراكية والتنظيف:<br>" +
      "الحامل: <b>بَ</b><br>" +
      "المحمول: <b>صْ</b><br>" +
      "نقطة بداية المحمول: <b>" +
      cutPoint.toFixed(3) +
      " ثانية</b><br>" +
      "تنظيف بداية المحمول: <b>" +
      trimResult.cleanStartSecond.toFixed(3) +
      " ثانية</b><br>" +
      "عدد نوافذ التحليل: " +
      result.scores.length +
      "<br><br>" +
      "الآن جرّب: ▶️ سماع صْ المفصول"
    );

    console.log(
      "🧭 Boundary detection result:",
      result
    );

    alert("✅ تم فصل وتنظيف صْ بناءً على الهوية الإدراكية");

  } catch (err) {
    console.error(
      "❌ splitBaseSegment identity error:",
      err
    );

    alert(
      "فشل الفصل بالهوية الإدراكية:\n" +
      err.message
    );
  }
}


// ======================================
// دمج قَ + صْ — دمج حي
// ======================================

async function mergeReplacementWithPayload() {
  if (!replacementBlob) {
    alert("سجّل أولًا الحرف قَ");
    return;
  }

  if (!extractedPayloadBlob) {
    alert("نفّذ أولًا فصل بَ عن صْ");
    return;
  }

  try {
    let replacementBuffer =
      await blobToAudioBuffer(replacementBlob);

    const payloadBuffer =
      await blobToAudioBuffer(extractedPayloadBlob);

    replacementBuffer =
      trimReplacementForMerge(replacementBuffer);

    const mergedBuffer =
      crossfadeAudioBuffers(
        replacementBuffer,
        payloadBuffer,
        0.065
      );

    mergedSegmentBlob =
      audioBufferToWavBlob(mergedBuffer);

    updateMergeSplitStatus(
      "🧩 تم الدمج الحي:<br>" +
      "<b>قَ</b> + <b>صْ</b> = <b>قَصْ</b><br>" +
      "تم استخدام Crossfade لتداخل حي بين الحامل والمحمول.<br>" +
      "يمكنك الآن تجربة: ▶️ سماع قَصْ"
    );

    alert("✅ تم دمج قَ + صْ بدمج حي");

  } catch (err) {
    console.error("❌ mergeReplacementWithPayload error:", err);
    alert("فشل دمج قَ + صْ");
  }
}


// ======================================
// واجهات عامة
// ======================================

window.recordBaseSegment =
  recordBaseSegment;

window.recordCarrierReplacement =
  recordCarrierReplacement;

window.splitBaseSegment =
  splitBaseSegment;

window.mergeReplacementWithPayload =
  mergeReplacementWithPayload;

window.playMergedSegment =
  playMergedSegment;

window.playBaseSegment =
  playBaseSegment;

window.playReplacementSegment =
  playReplacementSegment;

window.playPayloadSegment =
  playPayloadSegment;

console.log("🧩 محرك الفصل والدمج الصوتي جاهز V1.4");
