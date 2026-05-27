// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.2
// تثبيت التسجيل الحقيقي أولًا
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.2");

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
  alert("سجّل الآن المقطع: بَصْ");

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
  alert("سجّل الآن الحرف البديل: قَ");

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
// دمج AudioBuffer
// ======================================

function concatAudioBuffers(bufferA, bufferB) {
  const sampleRate = bufferA.sampleRate;

  const numberOfChannels = Math.min(
    bufferA.numberOfChannels,
    bufferB.numberOfChannels
  );

  const newBuffer = new AudioBuffer({
    length: bufferA.length + bufferB.length,
    numberOfChannels: numberOfChannels,
    sampleRate: sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const output = newBuffer.getChannelData(ch);

    output.set(
      bufferA.getChannelData(ch),
      0
    );

    output.set(
      bufferB.getChannelData(ch),
      bufferA.length
    );
  }

  return newBuffer;
}


// ======================================
// فصل بَ عن صْ — تجريبي
// ======================================

async function splitBaseSegment() {
  if (!baseSegmentBlob) {
    alert("سجّل أولًا المقطع بَصْ");
    return;
  }

  try {
    const buffer =
      await blobToAudioBuffer(baseSegmentBlob);

    const duration = buffer.duration;

    // فصل تجريبي فقط:
    // أول 38% = بَ
    // الباقي = صْ
    const cutPoint = duration * 0.18;
    
let payloadBuffer =
  sliceAudioBuffer(
    buffer,
    cutPoint,
    duration
  );

// حذف فراغ بسيط من بداية صْ المفصول
payloadBuffer =
  sliceAudioBuffer(
    payloadBuffer,
    0.12,
    payloadBuffer.duration
  );

    extractedPayloadBlob =
      audioBufferToWavBlob(payloadBuffer);

    mergedSegmentBlob = null;

    updateMergeSplitStatus(
      "✂️ تم الفصل التجريبي:<br>" +
      "تم حذف بداية <b>بَ</b> والاحتفاظ بالمحمول <b>صْ</b>.<br>" +
      "مدة المقطع الأصلي: " + duration.toFixed(3) + " ثانية<br>" +
      "نقطة الفصل التقريبية: " + cutPoint.toFixed(3) + " ثانية<br>" +
      "يمكنك الآن تجربة: ▶️ سماع صْ المفصول"
    );

    alert("✅ تم فصل بَ عن صْ تجريبيًا");

  } catch (err) {
    console.error("❌ splitBaseSegment error:", err);
    alert("فشل فصل المقطع");
  }
}


// ======================================
// دمج قَ + صْ
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
    const replacementBuffer =
      await blobToAudioBuffer(replacementBlob);

    const payloadBuffer =
      await blobToAudioBuffer(extractedPayloadBlob);

    const mergedBuffer =
      concatAudioBuffers(
        replacementBuffer,
        payloadBuffer
      );

    mergedSegmentBlob =
      audioBufferToWavBlob(mergedBuffer);

    updateMergeSplitStatus(
      "🧩 تم الدمج التجريبي:<br>" +
      "<b>قَ</b> + <b>صْ</b> = <b>قَصْ</b><br>" +
      "يمكنك الآن تجربة: ▶️ سماع قَصْ"
    );

    alert("✅ تم دمج قَ + صْ");

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

console.log("🧩 محرك الفصل والدمج الصوتي جاهز V1.2");
