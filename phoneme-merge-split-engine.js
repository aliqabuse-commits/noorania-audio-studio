// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.7
// مختبر الفصل والدمج الديناميكي (الاستدعاء الموثق من الحقائب)
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.7");

let baseSegmentBlob = null;        // المقطع الأصلي
let replacementBlob = null;        // الحامل الجديد
let extractedPayloadBlob = null;   // المحمول المفصول
let mergedSegmentBlob = null;      // الناتج المدموج


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
// 1️⃣ الطبقة الديناميكية: أدوات التحليل والاستدعاء الموثق
// ======================================

// تطبيع النص العربي: إزالة التشكيل والتطويل لتسهيل المقارنة
function normalizeArabic(text) {
  if (!text) return "";
  return text.replace(/[\u064B-\u065F\u0640]/g, '').trim();
}

// تحليل النص إلى مفاتيح برمجية من الحقائب
function resolveDynamicKeys(text) {
  if (typeof getAllPhonemeTrainingPacks !== "function") return null;
  
  const packs = getAllPhonemeTrainingPacks();
  if (!packs) return null;

  const cleanText = normalizeArabic(text);
  const chars = cleanText.split('');
  const keys = [];

  for (const char of chars) {
    for (const key in packs) {
      if (normalizeArabic(packs[key].letter) === char) {
        keys.push(key);
        break;
      }
    }
  }
  return keys;
}

// أداة بحث آمنة عن التسجيلات في التخزين (فقط للملفات المعتمدة)
async function searchAudioBlobSafely(fileName) {
  if (typeof getAudioPromiseForMemory === "function") {
    const blob = await getAudioPromiseForMemory(fileName, 3000);
    if (blob) return blob;
  }
  const dataUrl = 
    localStorage.getItem("audio_" + fileName) || 
    localStorage.getItem(fileName) || 
    localStorage.getItem("record_" + fileName);

  if (dataUrl) {
    try {
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (err) {
      console.warn("تعذر تحويل التسجيل إلى Blob:", fileName, err);
    }
  }
  return null;
}

// البحث الطبقي الآمن لضمان أن الملف معتمد ضمن الحقائب الإدراكية
function findAuthorizedFileInPacks(text, keys) {
  if (typeof getAllPhonemeTrainingPacks !== "function") return null;
  
  const packs = getAllPhonemeTrainingPacks();
  if (!packs) return null;

  const normText = normalizeArabic(text);
  let targetPacks = [];

  if (keys && keys.length) {
    keys.forEach(k => { if (packs[k]) targetPacks.push(packs[k]); });
  } else {
    targetPacks = Object.values(packs);
  }

  // الطبقة 1: التطابق التام للنص
  for (const pack of targetPacks) {
    if (!pack.positions) continue;
    const exactMatch = pack.positions.find(p => p.text === text);
    if (exactMatch) return exactMatch.file;
  }

  // الطبقة 2: التطابق بعد إزالة التشكيل
  for (const pack of targetPacks) {
    if (!pack.positions) continue;
    const normMatch = pack.positions.find(p => normalizeArabic(p.text) === normText);
    if (normMatch) return normMatch.file;
  }

  // الطبقة 3: إن كان الإدخال حرفًا واحدًا فاستدعِ عينة הפتحة الافتراضية
  if (normText.length === 1) {
    for (const pack of targetPacks) {
      if (normalizeArabic(pack.letter) === normText && pack.positions) {
        const fathaMatch = pack.positions.find(p => 
          p.role === "فتح" || 
          p.role === "fatha" || 
          normalizeArabic(p.text) === normText
        );
        if (fathaMatch) return fathaMatch.file;
      }
    }
  }

  // الطبقة 4: مقطع مركب لا يوجد في أي حقيبة معتمدة
  return null;
}

// دالة حفظ مؤقتة لدعم عمليات التسجيل اليدوية داخل جلسة المختبر
function saveTempAudioToStorage(fileName, blob) {
  const reader = new FileReader();
  reader.onloadend = function () {
    try {
      localStorage.setItem("audio_" + fileName, reader.result);
    } catch (err) {
      console.warn("تعذر الحفظ في التخزين المحلي:", err);
    }
  };
  reader.readAsDataURL(blob);
}

// دالة الاستدعاء الديناميكي الموثق (بدون أي تخمين)
async function fetchSegmentSafely(type) {
  const inputId = type === 'base' ? 'merge-base-input' : 'merge-carrier-input';
  const inputEl = document.getElementById(inputId);
  const text = inputEl && inputEl.value.trim() ? inputEl.value.trim() : (type === 'base' ? 'بص' : 'ق');

  if (!text) {
    alert("يرجى إدخال النص أولاً في الحقل المخصص.");
    return false;
  }

  // 1. استخراج المفاتيح
  const keys = resolveDynamicKeys(text);

  // 2. البحث عن الملف المعتمد حصراً في الحقائب
  const authorizedFileName = findAuthorizedFileInPacks(text, keys);

  if (!authorizedFileName) {
    alert("لا يوجد تسجيل معتمد لهذا العنصر. يمكنك استخدام زر التسجيل لإنشائه.");
    return false;
  }

  // 3. جلب التسجيل الصحيح المعتمد من الذاكرة
  const blob = await searchAudioBlobSafely(authorizedFileName);

  if (blob) {
    if (type === 'base') {
      baseSegmentBlob = blob;
      extractedPayloadBlob = null;
      mergedSegmentBlob = null;
      updateMergeSplitStatus("✅ تم استدعاء المقطع الأصلي المعتمد: <b>" + text + "</b> بنجاح.");
    } else {
      replacementBlob = blob;
      mergedSegmentBlob = null;
      updateMergeSplitStatus("✅ تم استدعاء الحامل الجديد المعتمد: <b>" + text + "</b> بنجاح.");
    }
    return true;
  } else {
    // الملف معتمد برمجياً في الحقيبة، لكن لم يقم المستخدم بتسجيله بعد
    alert("لا يوجد تسجيل معتمد لهذا العنصر. يمكنك استخدام زر التسجيل لإنشائه.");
    return false;
  }
}

// الدوال التوافقية للاستدعاء الديناميكي من الواجهة
function fetchDynamicBaseSegment() {
  return fetchSegmentSafely("base");
}

function fetchDynamicCarrierReplacement() {
  return fetchSegmentSafely("carrier");
}


// ======================================
// تسجيل المقطع الأصلي (معدلة لتدعم الديناميكية)
// ======================================

async function recordBaseSegment() {
  const inputEl = document.getElementById("merge-base-input");
  const text = inputEl && inputEl.value.trim() ? inputEl.value.trim() : "بَصْ";

  alert("اضغط حسنًا، ثم سجّل الآن المقطع: " + text);

  baseSegmentBlob = await recordMergeSample(1000);

  if (!baseSegmentBlob) {
    alert("فشل تسجيل المقطع " + text);
    return;
  }

  extractedPayloadBlob = null;
  mergedSegmentBlob = null;

  saveTempAudioToStorage(text + ".wav", baseSegmentBlob);

  updateMergeSplitStatus(
    "✅ تم تسجيل المقطع الأصلي: <b>" + text + "</b><br>" +
    "الحجم: " + baseSegmentBlob.size + " bytes<br>" +
    "النوع: " + baseSegmentBlob.type
  );

  alert("✅ تم تسجيل المقطع " + text);
}


// ======================================
// تسجيل الحرف البديل (معدلة لتدعم الديناميكية)
// ======================================

async function recordCarrierReplacement() {
  const inputEl = document.getElementById("merge-carrier-input");
  const text = inputEl && inputEl.value.trim() ? inputEl.value.trim() : "قَ";

  alert("اضغط حسنًا، ثم سجّل الآن الحامل الجديد: " + text);

  replacementBlob = await recordMergeSample(1000);

  if (!replacementBlob) {
    alert("فشل تسجيل الحامل " + text);
    return;
  }

  mergedSegmentBlob = null;

  saveTempAudioToStorage(text + ".wav", replacementBlob);

  updateMergeSplitStatus(
    "✅ تم تسجيل الحامل الجديد: <b>" + text + "</b><br>" +
    "الحجم: " + replacementBlob.size + " bytes<br>" +
    "النوع: " + replacementBlob.type
  );

  alert("✅ تم تسجيل الحامل " + text);
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
    alert("لا يوجد صوت مسجل أو مستدعى: " + label);
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

// الدوال التوافقية المستقلة للتشغيل
function playBaseSegment() {
  const inputEl = document.getElementById("merge-base-input");
  const text = inputEl && inputEl.value.trim() ? inputEl.value.trim() : "بَصْ";
  playBlob(baseSegmentBlob, text);
}

function playReplacementSegment() {
  const inputEl = document.getElementById("merge-carrier-input");
  const text = inputEl && inputEl.value.trim() ? inputEl.value.trim() : "قَ";
  playBlob(replacementBlob, text);
}

function playPayloadSegment() {
  const baseInput = document.getElementById("merge-base-input");
  const baseText = baseInput ? baseInput.value.trim() : "بص";
  const normBaseText = normalizeArabic(baseText);
  const chars = normBaseText.split('');
  const payloadText = chars.length >= 2 ? chars[1] + "ْ" : "صْ";
  
  playBlob(extractedPayloadBlob, payloadText + " المفصول");
}

function playMergedSegment() {
  const baseInput = document.getElementById("merge-base-input");
  const baseText = baseInput ? baseInput.value.trim() : "بص";
  const normBaseText = normalizeArabic(baseText);
  const chars = normBaseText.split('');
  const payloadText = chars.length >= 2 ? chars[1] + "ْ" : "صْ";

  const repInput = document.getElementById("merge-carrier-input");
  const repText = repInput ? repInput.value.trim() : "قَ";
  const cleanRep = normalizeArabic(repText);

  const mergedText = cleanRep + "َ" + payloadText;
  playBlob(mergedSegmentBlob, mergedText);
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
// قص نهاية الحامل للدمج
// ======================================

function trimReplacementForMerge(buffer) {
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);

  const frameSize = Math.floor(sampleRate * 0.010);

  let maxRms = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms = rmsOfSamples(samples, i, i + frameSize);
    if (rms > maxRms) maxRms = rms;
  }

  const threshold = Math.max(maxRms * 0.20, 0.006);

  let startSample = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms = rmsOfSamples(samples, i, i + frameSize);

    if (rms >= threshold) {
      startSample = Math.max(0, i - Math.floor(sampleRate * 0.015));
      break;
    }
  }

  const maxCarrierDuration = 0.17;
  const startSecond = startSample / sampleRate;
  const endSecond = Math.min(
    buffer.duration,
    startSecond + maxCarrierDuration
  );

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
// فصل المقطع الأصلي — بالهوية الإدراكية + تنظيف
// ======================================

async function splitBaseSegment() {
  if (!baseSegmentBlob) {
    alert("سجّل أو استدعِ أولًا المقطع الأصلي");
    return;
  }

  try {
    const buffer = await blobToAudioBuffer(baseSegmentBlob);

    if (typeof detectPayloadBoundaryByIdentity !== "function") {
      alert("كاشف الحدود الإدراكية غير محمّل");
      return;
    }

    // جلب النصوص من الواجهة لاستخراج المفاتيح
    const baseInput = document.getElementById("merge-base-input");
    const baseText = baseInput ? baseInput.value.trim() : "بص";

    let carrierKey = "ba";
    let payloadKey = "sad";
    
    const keys = resolveDynamicKeys(baseText);
    if (keys && keys.length >= 2) {
      carrierKey = keys[0];
      payloadKey = keys[1];
    } else if (keys && keys.length === 1) {
      carrierKey = keys[0];
      payloadKey = keys[0];
    }

    const normBaseText = normalizeArabic(baseText);
    const chars = normBaseText.split('');
    const carrierText = chars[0] ? chars[0] + "َ" : "بَ";
    const payloadText = chars[1] ? chars[1] + "ْ" : "صْ";

    const result = detectPayloadBoundaryByIdentity(buffer, {
      carrierKey: carrierKey,
      payloadKey: payloadKey,
      windowSize: 0.18,
      hopSize: 0.035,
      minStart: 0.08
    });

    const cutPoint = result.boundary;

    if (!cutPoint) {
      alert("لم يستطع النظام تحديد بداية " + payloadText);
      return;
    }

    let payloadBuffer = sliceAudioBuffer(buffer, cutPoint, buffer.duration);
    const trimResult = trimPayloadStart(payloadBuffer);
    payloadBuffer = trimResult.buffer;

    extractedPayloadBlob = audioBufferToWavBlob(payloadBuffer);
    mergedSegmentBlob = null;

    updateMergeSplitStatus(
      "🧭 تم الفصل بالهوية الإدراكية والتنظيف:<br>" +
      "الحامل: <b>" + carrierText + "</b><br>" +
      "المحمول: <b>" + payloadText + "</b><br>" +
      "نقطة بداية المحمول: <b>" + cutPoint.toFixed(3) + " ثانية</b><br>" +
      "تنظيف بداية المحمول: <b>" + trimResult.cleanStartSecond.toFixed(3) + " ثانية</b><br>" +
      "عدد نوافذ التحليل: " + result.scores.length + "<br><br>" +
      "الآن جرّب: ▶️ سماع " + payloadText + " المفصول"
    );

    console.log("🧭 Boundary detection result:", result);
    alert("✅ تم فصل وتنظيف " + payloadText + " بناءً على الهوية الإدراكية");

  } catch (err) {
    console.error("❌ splitBaseSegment identity error:", err);
    alert("فشل الفصل بالهوية الإدراكية:\n" + err.message);
  }
}


// ======================================
// دمج حي للحامل والمحمول
// ======================================

async function mergeReplacementWithPayload() {
  if (!replacementBlob) {
    alert("سجّل أو استدعِ أولًا الحامل الجديد");
    return;
  }

  if (!extractedPayloadBlob) {
    alert("نفّذ أولًا فصل المقطع الأصلي");
    return;
  }

  try {
    let replacementBuffer = await blobToAudioBuffer(replacementBlob);
    const payloadBuffer = await blobToAudioBuffer(extractedPayloadBlob);

    replacementBuffer = trimReplacementForMerge(replacementBuffer);

    const mergedBuffer = crossfadeAudioBuffers(
      replacementBuffer,
      payloadBuffer,
      0.10
    );

    mergedSegmentBlob = audioBufferToWavBlob(mergedBuffer);

    const repInput = document.getElementById("merge-carrier-input");
    const repText = repInput && repInput.value.trim() ? repInput.value.trim() : "قَ";
    
    const baseInput = document.getElementById("merge-base-input");
    const baseText = baseInput ? baseInput.value.trim() : "بص";
    const normBaseText = normalizeArabic(baseText);
    const chars = normBaseText.split('');
    const payloadText = chars.length >= 2 ? chars[1] + "ْ" : "صْ";

    const cleanRep = normalizeArabic(repText);

    updateMergeSplitStatus(
      "🧩 تم الدمج الحي:<br>" +
      "<b>" + repText + "</b> + <b>" + payloadText + "</b> = <b>" + cleanRep + "َ" + payloadText + "</b><br>" +
      "تم استخدام Crossfade لتداخل حي بين الحامل والمحمول.<br>" +
      "يمكنك الآن تجربة: ▶️ سماع الناتج المدموج"
    );

    alert("✅ تم دمج " + repText + " + " + payloadText + " بدمج حي");

  } catch (err) {
    console.error("❌ mergeReplacementWithPayload error:", err);
    alert("فشل الدمج");
  }
}


// ======================================
// إتاحة الدوال للواجهة
// ======================================

window.normalizeArabic = normalizeArabic;
window.fetchSegmentSafely = fetchSegmentSafely;
window.fetchDynamicBaseSegment = fetchDynamicBaseSegment;
window.fetchDynamicCarrierReplacement = fetchDynamicCarrierReplacement;

window.recordBaseSegment = recordBaseSegment;
window.recordCarrierReplacement = recordCarrierReplacement;
window.splitBaseSegment = splitBaseSegment;
window.mergeReplacementWithPayload = mergeReplacementWithPayload;

window.playMergedSegment = playMergedSegment;
window.playBaseSegment = playBaseSegment;
window.playReplacementSegment = playReplacementSegment;
window.playPayloadSegment = playPayloadSegment;

console.log("🧩 محرك الفصل والدمج الصوتي جاهز V1.7");
