// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.1
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.1");

let baseSegmentBlob = null;        // بَصْ
let replacementBlob = null;        // قَ
let extractedPayloadBlob = null;   // صْ
let mergedSegmentBlob = null;      // قَصْ

function updateMergeSplitStatus(message) {
  const box = document.getElementById("merge-split-status");
  if (box) box.innerHTML = message;
}

async function recordBaseSegment() {
  alert("سجّل الآن المقطع: بَصْ");

  baseSegmentBlob = await recordMergeSample(1800);

  if (!baseSegmentBlob) {
    alert("فشل تسجيل المقطع بَصْ");
    return;
  }

  extractedPayloadBlob = null;
  mergedSegmentBlob = null;

  updateMergeSplitStatus("✅ تم تسجيل المقطع الأصلي: بَصْ");
  alert("✅ تم تسجيل المقطع بَصْ");
}

async function recordCarrierReplacement() {
  alert("سجّل الآن الحرف البديل: قَ");

  replacementBlob = await recordMergeSample(1200);

  if (!replacementBlob) {
    alert("فشل تسجيل الحرف قَ");
    return;
  }

  mergedSegmentBlob = null;

  updateMergeSplitStatus("✅ تم تسجيل الحرف البديل: قَ");
  alert("✅ تم تسجيل الحرف قَ");
}

async function recordMergeSample(durationMs) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    return await new Promise(function (resolve) {
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = function () {
        stream.getTracks().forEach(track => track.stop());

        const blob = new Blob(chunks, {
          type: "audio/webm"
        });

        resolve(blob);
      };

      recorder.start();

      setTimeout(function () {
        recorder.stop();
      }, durationMs || 1500);
    });

  } catch (err) {
    console.error("recordMergeSample error:", err);
    return null;
  }
}

async function blobToAudioBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();

  const audioContext = new (
    window.AudioContext ||
    window.webkitAudioContext
  )();

  return await audioContext.decodeAudioData(arrayBuffer);
}

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;

  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  let offset = 0;

  writeString(offset, "RIFF"); offset += 4;
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString(offset, "WAVE"); offset += 4;
  writeString(offset, "fmt "); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * numChannels * 2, true); offset += 4;
  view.setUint16(offset, numChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(offset, "data"); offset += 4;
  view.setUint32(offset, length - offset - 4, true); offset += 4;

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = buffer.getChannelData(ch)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function sliceAudioBuffer(buffer, startSecond, endSecond) {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(startSecond * sampleRate);
  const endSample = Math.floor(endSecond * sampleRate);
  const frameCount = Math.max(1, endSample - startSample);

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

function concatAudioBuffers(bufferA, bufferB) {
  const sampleRate = bufferA.sampleRate;
  const numberOfChannels = Math.min(
    bufferA.numberOfChannels,
    bufferB.numberOfChannels
  );

  const newBuffer = new AudioBuffer({
    length: bufferA.length + bufferB.length,
    numberOfChannels,
    sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const output = newBuffer.getChannelData(ch);
    output.set(bufferA.getChannelData(ch), 0);
    output.set(bufferB.getChannelData(ch), bufferA.length);
  }

  return newBuffer;
}

async function splitBaseSegment() {
  if (!baseSegmentBlob) {
    alert("سجّل أولًا المقطع بَصْ");
    return;
  }

  try {
    const buffer = await blobToAudioBuffer(baseSegmentBlob);
    const duration = buffer.duration;

    // فصل تجريبي:
    // أول 38% = بَ
    // الباقي = صْ
    const cutPoint = duration * 0.38;

    const payloadBuffer = sliceAudioBuffer(
      buffer,
      cutPoint,
      duration
    );

    extractedPayloadBlob = audioBufferToWavBlob(payloadBuffer);
    mergedSegmentBlob = null;

    updateMergeSplitStatus(
      "✂️ تم فصل المقطع تجريبيًا:<br>" +
      "تم حذف بداية بَ، والاحتفاظ بالمحمول صْ.<br>" +
      "نقطة الفصل التقريبية: " +
      cutPoint.toFixed(3) +
      " ثانية"
    );

    alert("✅ تم فصل بَ عن صْ تجريبيًا");

  } catch (err) {
    console.error("splitBaseSegment error:", err);
    alert("فشل فصل المقطع");
  }
}

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

    const mergedBuffer = concatAudioBuffers(
      replacementBuffer,
      payloadBuffer
    );

    mergedSegmentBlob = audioBufferToWavBlob(mergedBuffer);

    updateMergeSplitStatus(
      "🧩 تم الدمج التجريبي:<br>" +
      "قَ + صْ = قَصْ<br>" +
      "يمكنك الآن الضغط على: ▶️ سماع قَصْ"
    );

    alert("✅ تم دمج قَ + صْ");

  } catch (err) {
    console.error("mergeReplacementWithPayload error:", err);
    alert("فشل دمج قَ + صْ");
  }
}

function playMergedSegment() {
  if (!mergedSegmentBlob) {
    alert("لا يوجد مقطع مدموج بعد. نفّذ الدمج أولًا.");
    return;
  }

  const url = URL.createObjectURL(mergedSegmentBlob);
  const audio = new Audio(url);

  audio.play();

  updateMergeSplitStatus(
    "▶️ يتم الآن تشغيل الناتج التجريبي: قَصْ"
  );
}

function playBlob(blob, label) {
  if (!blob) {
    alert("لا يوجد صوت: " + label);
    return;
  }

  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);

  audio.play();
}


function playBaseSegment() {
  playBlob(baseSegmentBlob, "بَصْ");
}


function playReplacementSegment() {
  playBlob(replacementBlob, "قَ");
}


function playPayloadSegment() {
  playBlob(extractedPayloadBlob, "صْ");
}
