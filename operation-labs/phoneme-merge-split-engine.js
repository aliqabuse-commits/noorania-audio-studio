// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.9 (محرك الدمج الإدراكي الموزون)
// مختبر استخراج وحدات الاشتباك (Join Units) والدمج بالتداخل الموزون
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.9");

// ======================================
// متغيرات الطبقة التوافقية (النظام القديم V1.7)
// ======================================
let baseSegmentBlob = null;        
let replacementBlob = null;        
let extractedPayloadBlob = null;   
let mergedSegmentBlob = null;      


// ======================================
// متغيرات النظام الجديد V1.9 (المسار المزدوج الموزون)
// ======================================
let segment1Blob = null;
let carrier1RawBlob = null;
let payload1RawBlob = null;
let carrier1ReadyBlob = null;
let payload1ReadyBlob = null;

let segment2Blob = null;
let carrier2RawBlob = null;
let payload2RawBlob = null;
let carrier2ReadyBlob = null;
let payload2ReadyBlob = null;

let result1_2_Blob = null; // حامل 1 + محمول 2
let result2_1_Blob = null; // حامل 2 + محمول 1

// ======================================
// تحديث حالة المختبر (المشترك)
// ======================================
function updateMergeSplitStatus(message, saveState = true) {
  const box = document.getElementById("merge-split-status");
  if (box) {
    box.innerHTML = message;
    if (saveState && typeof saveMergeExperimentState === "function") {
      saveMergeExperimentState();
    }
  }
}

// ======================================
// 1️⃣ الطبقة الديناميكية المشتركة وأدوات التحليل
// ======================================

function normalizeArabic(text) {
  if (!text) return "";
  return text.replace(/[\u064B-\u065F\u0640]/g, '').trim();
}

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

  for (const pack of targetPacks) {
    if (!pack.positions) continue;
    const exactMatch = pack.positions.find(p => p.text === text);
    if (exactMatch) return exactMatch.file;
  }

  for (const pack of targetPacks) {
    if (!pack.positions) continue;
    const normMatch = pack.positions.find(p => normalizeArabic(p.text) === normText);
    if (normMatch) return normMatch.file;
  }

  if (normText.length === 1) {
    for (const pack of targetPacks) {
      if (normalizeArabic(pack.letter) === normText && pack.positions) {
        const fathaMatch = pack.positions.find(p => 
          p.role === "فتح" || p.role === "fatha" || normalizeArabic(p.text) === normText
        );
        if (fathaMatch) return fathaMatch.file;
      }
    }
  }

  return null;
}

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

// ======================================
// 2️⃣ نظام إدارة الحالة وحفظ الذاكرة لـ V1.9
// ======================================

window.saveMergeExperimentState = function() {
  const el1 = document.getElementById('merge-seg1-input');
  const el2 = document.getElementById('merge-seg2-input');
  
  localStorage.setItem('merge_experiment_seg1_text', el1 ? el1.value.trim() : "");
  localStorage.setItem('merge_experiment_seg2_text', el2 ? el2.value.trim() : "");
  
  localStorage.setItem('merge_experiment_seg1_ready', segment1Blob ? 'true' : 'false');
  localStorage.setItem('merge_experiment_seg2_ready', segment2Blob ? 'true' : 'false');
  
  localStorage.setItem('merge_experiment_seg1_split', carrier1RawBlob ? 'true' : 'false');
  localStorage.setItem('merge_experiment_seg2_split', carrier2RawBlob ? 'true' : 'false');
  
  const statusBox = document.getElementById("merge-split-status");
  localStorage.setItem('merge_experiment_last_status', statusBox ? statusBox.innerHTML : "مستعد لبدء التجربة.");
};

window.restoreMergeExperimentState = async function() {
  const seg1Text = localStorage.getItem('merge_experiment_seg1_text') || "";
  const seg2Text = localStorage.getItem('merge_experiment_seg2_text') || "";
  const lastStatus = localStorage.getItem('merge_experiment_last_status') || "مستعد لبدء التجربة.";
  
  const el1 = document.getElementById('merge-seg1-input');
  if (el1) el1.value = seg1Text;
  
  const el2 = document.getElementById('merge-seg2-input');
  if (el2) el2.value = seg2Text;

  updateMergeSplitStatus(lastStatus, false);

  const ready1 = localStorage.getItem('merge_experiment_seg1_ready') === 'true';
  const ready2 = localStorage.getItem('merge_experiment_seg2_ready') === 'true';
  const split1 = localStorage.getItem('merge_experiment_seg1_split') === 'true';
  const split2 = localStorage.getItem('merge_experiment_seg2_split') === 'true';

  if (ready1 && seg1Text) {
    const keys = resolveDynamicKeys(seg1Text);
    const authFile = findAuthorizedFileInPacks(seg1Text, keys);
    if (authFile) {
      const blob = await searchAudioBlobSafely(authFile);
      if (blob) {
        segment1Blob = blob;
        if (split1) {
           try {
             const sData = await performCoreCognitiveSplit(blob, seg1Text);
             carrier1RawBlob = sData.carrierRawBlob; payload1RawBlob = sData.payloadRawBlob;
             carrier1ReadyBlob = sData.carrierReadyBlob; payload1ReadyBlob = sData.payloadReadyBlob;
           } catch(e) { console.warn("Background split 1 failed", e); }
        }
      }
    }
  }

  if (ready2 && seg2Text) {
    const keys = resolveDynamicKeys(seg2Text);
    const authFile = findAuthorizedFileInPacks(seg2Text, keys);
    if (authFile) {
      const blob = await searchAudioBlobSafely(authFile);
      if (blob) {
        segment2Blob = blob;
        if (split2) {
           try {
             const sData = await performCoreCognitiveSplit(blob, seg2Text);
             carrier2RawBlob = sData.carrierRawBlob; payload2RawBlob = sData.payloadRawBlob;
             carrier2ReadyBlob = sData.carrierReadyBlob; payload2ReadyBlob = sData.payloadReadyBlob;
           } catch(e) { console.warn("Background split 2 failed", e); }
        }
      }
    }
  }
};

// ======================================
// 3️⃣ النظام الجديد: استدعاء وتسجيل V1.9
// ======================================

async function fetchExperimentSegment(segNum) {
  const inputId = segNum === 1 ? 'merge-seg1-input' : 'merge-seg2-input';
  const inputEl = document.getElementById(inputId);
  const text = inputEl ? inputEl.value.trim() : '';

  if (!text) { alert("يرجى إدخال النص أولاً."); return false; }

  const keys = resolveDynamicKeys(text);
  const authorizedFileName = findAuthorizedFileInPacks(text, keys);

  if (!authorizedFileName) { alert("لا يوجد تسجيل معتمد لهذا العنصر."); return false; }

  const blob = await searchAudioBlobSafely(authorizedFileName);

  if (blob) {
    if (segNum === 1) {
      segment1Blob = blob; carrier1RawBlob = null; payload1RawBlob = null; carrier1ReadyBlob = null; payload1ReadyBlob = null; result1_2_Blob = null; result2_1_Blob = null;
    } else {
      segment2Blob = blob; carrier2RawBlob = null; payload2RawBlob = null; carrier2ReadyBlob = null; payload2ReadyBlob = null; result1_2_Blob = null; result2_1_Blob = null;
    }
    updateMergeSplitStatus("✅ تم استدعاء المقطع " + segNum + ": <b>" + text + "</b> بنجاح.");
    return true;
  } else {
    alert("التسجيل غير موجود بالذاكرة.");
    return false;
  }
}

async function recordExperimentSegment(segNum) {
  const inputId = segNum === 1 ? 'merge-seg1-input' : 'merge-seg2-input';
  const inputEl = document.getElementById(inputId);
  const text = inputEl ? inputEl.value.trim() : '';
  if(!text) { alert("اكتب النص أولاً."); return; }

  alert("اضغط حسنًا، ثم سجّل الآن المقطع: " + text);
  const blob = await recordMergeSample(1000);

  if (!blob) { alert("فشل التسجيل"); return; }

  if (segNum === 1) {
    segment1Blob = blob; carrier1RawBlob = null; payload1RawBlob = null; carrier1ReadyBlob = null; payload1ReadyBlob = null;
  } else {
    segment2Blob = blob; carrier2RawBlob = null; payload2RawBlob = null; carrier2ReadyBlob = null; payload2ReadyBlob = null;
  }

  saveTempAudioToStorage(text + ".wav", blob);
  updateMergeSplitStatus("✅ تم تسجيل المقطع " + segNum + ": <b>" + text + "</b> بنجاح.");
}


// ======================================
// 4️⃣ دوال الهندسة الصوتية لوحدات الاشتباك (Cognitive Join Units)
// ======================================

// لصق مقطعين صوتيين بشكل مباشر (Concat)
function concatAudioBuffers(bufferA, bufferB) {
  const numberOfChannels = Math.min(bufferA.numberOfChannels, bufferB.numberOfChannels);
  const sampleRate = bufferA.sampleRate;
  const outputLength = bufferA.length + bufferB.length;
  const outputBuffer = new AudioBuffer({ length: outputLength, numberOfChannels, sampleRate });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);
    out.set(a, 0);
    out.set(b, bufferA.length);
  }
  return outputBuffer;
}

// تطبيق مغلف تلاشي أو تصعيد (Envelope)
function applyEnvelope(buffer, startVal, endVal) {
  const newBuffer = new AudioBuffer({
    length: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate
  });
  
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = newBuffer.getChannelData(ch);
    for (let i = 0; i < buffer.length; i++) {
      const t = i / Math.max(1, buffer.length - 1);
      const mult = startVal + (endVal - startVal) * t;
      dst[i] = src[i] * mult;
    }
  }
  return newBuffer;
}

// دمج بتداخل محسوب (Overlap-Add)
function overlapAddAudioBuffers(bufferA, bufferB, overlapSeconds) {
  const sampleRate = bufferA.sampleRate;
  const numberOfChannels = Math.min(bufferA.numberOfChannels, bufferB.numberOfChannels);
  
  const overlapSamples = Math.floor(overlapSeconds * sampleRate);
  const actualOverlap = Math.min(overlapSamples, bufferA.length, bufferB.length);
  
  const outputLength = bufferA.length + bufferB.length - actualOverlap;
  const outputBuffer = new AudioBuffer({ length: outputLength, numberOfChannels, sampleRate });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);

    const aKeep = bufferA.length - actualOverlap;
    
    for(let i = 0; i < aKeep; i++) out[i] = a[i];
    
    for(let i = 0; i < actualOverlap; i++) {
      out[aKeep + i] = (a[aKeep + i] || 0) + (b[i] || 0);
    }
    
    for(let i = actualOverlap; i < bufferB.length; i++) {
      out[aKeep + i] = b[i];
    }
  }
  return outputBuffer;
}

// استخراج الوحدات الإدراكية الجاهزة (الموزونة حول cutPoint)
function extractCognitiveJoinUnits(buffer, cutPoint) {
  const transitionBefore = 0.045;
  const transitionAfter = 0.045;

  const transStart = Math.max(0, cutPoint - transitionBefore);
  const transEnd = Math.min(buffer.duration, cutPoint + transitionAfter);

  const carrierCore = sliceAudioBuffer(buffer, 0, transStart);
  const joinZone = sliceAudioBuffer(buffer, transStart, transEnd);
  const payloadCore = sliceAudioBuffer(buffer, transEnd, buffer.duration);

  // الحامل في منطقة التداخل: يبدأ بـ 1.0 (أعلى أثر) ويتلاشى إلى 0.0
  const carrierJoin = applyEnvelope(joinZone, 1.0, 0.0);
  
  // المحمول في منطقة التداخل: يبدأ بـ 0.0 ويتصاعد إلى 1.0 (أعلى أثر)
  const payloadJoin = applyEnvelope(joinZone, 0.0, 1.0);

  // بناء الوحدات الجاهزة (Ready)
  const carrierReady = concatAudioBuffers(carrierCore, carrierJoin);
  const payloadReady = concatAudioBuffers(payloadJoin, payloadCore);

  return { carrierReady, payloadReady };
}


// ======================================
// 5️⃣ النظام الجديد: محرك الفصل الإدراكي (الخام + الجاهز) V1.9
// ======================================

async function performCoreCognitiveSplit(blob, text) {
  const normText = normalizeArabic(text);
  
  if (normText.length < 2) {
    throw new Error("لا يمكن تنفيذ الفصل الإدراكي: أدخل مقطعًا من حرفين مختلفين مثل: بص، قد، حب.");
  }
  
  if (normText[0] === normText[1]) {
    throw new Error("هذا اختبار متقدم لأن الحامل والمحمول من نفس الهوية. نؤجله الآن.");
  }

  const keys = resolveDynamicKeys(text);
  if (!keys || keys.length < 2) {
    throw new Error("لم يتم العثور على مفتاحين إدراكيين لهذا المقطع في الحقائب.");
  }

  const carrierKey = keys[0];
  const payloadKey = keys[1];

  const buffer = await blobToAudioBuffer(blob);

  const result = detectPayloadBoundaryByIdentity(buffer, {
    carrierKey: carrierKey,
    payloadKey: payloadKey,
    windowSize: 0.18,
    hopSize: 0.035,
    minStart: 0.08
  });

  const cutPoint = result.boundary;
  if (!cutPoint) throw new Error("لم يستطع النظام تحديد نقطة الفصل إدراكياً.");

  // 1- الاستخراج الخام القديم (حفظاً على السيادة السابقة)
  const carrierRawBuffer = sliceAudioBuffer(buffer, 0, cutPoint);
  const payloadRawBuffer = sliceAudioBuffer(buffer, cutPoint, buffer.duration);

  // 2- الاستخراج الإدراكي الموزون (Ready Units)
  const { carrierReady, payloadReady } = extractCognitiveJoinUnits(buffer, cutPoint);

  return {
    carrierRawBlob: audioBufferToWavBlob(carrierRawBuffer),
    payloadRawBlob: audioBufferToWavBlob(payloadRawBuffer),
    carrierReadyBlob: audioBufferToWavBlob(carrierReady),
    payloadReadyBlob: audioBufferToWavBlob(payloadReady),
    cutPoint: cutPoint
  };
}

async function splitExperimentSegment(segNum) {
  const blob = segNum === 1 ? segment1Blob : segment2Blob;
  if (!blob) { alert("يرجى استدعاء أو تسجيل المقطع " + segNum + " أولاً."); return; }

  const inputId = segNum === 1 ? 'merge-seg1-input' : 'merge-seg2-input';
  const text = document.getElementById(inputId).value.trim();

  try {
    const splitData = await performCoreCognitiveSplit(blob, text);
    
    if (segNum === 1) {
      carrier1RawBlob = splitData.carrierRawBlob; payload1RawBlob = splitData.payloadRawBlob;
      carrier1ReadyBlob = splitData.carrierReadyBlob; payload1ReadyBlob = splitData.payloadReadyBlob;
    } else {
      carrier2RawBlob = splitData.carrierRawBlob; payload2RawBlob = splitData.payloadRawBlob;
      carrier2ReadyBlob = splitData.carrierReadyBlob; payload2ReadyBlob = splitData.payloadReadyBlob;
    }

    updateMergeSplitStatus(
      "🧭 تم فصل المقطع " + segNum + " إدراكياً:<br>" +
      "نقطة القطع: <b>" + splitData.cutPoint.toFixed(3) + " ثانية</b><br>" +
      "✔️ تم استخراج الحامل الخام والمحمول الخام.<br>" +
      "✔️ تم استخراج وبناء النسخ الموزونة (Ready Units) بنجاح."
    );
  } catch (err) {
    console.error(err);
    alert("فشل الفصل: " + err.message);
  }
}

// ======================================
// 6️⃣ النظام الجديد: الدمج الإدراكي الموزون V1.9
// ======================================

async function experimentMerge(carrierNum, payloadNum) {
  let carrierBlob = null;
  let payloadBlob = null;
  let isReadyUnits = false;

  // تحديد ما إذا كانت الوحدات الجاهزة متوفرة، وإلا فالرجوع للخام
  if (carrierNum === 1 && payloadNum === 2) {
    if (carrier1ReadyBlob && payload2ReadyBlob) {
      carrierBlob = carrier1ReadyBlob; payloadBlob = payload2ReadyBlob; isReadyUnits = true;
    } else {
      carrierBlob = carrier1RawBlob; payloadBlob = payload2RawBlob;
    }
  } else {
    if (carrier2ReadyBlob && payload1ReadyBlob) {
      carrierBlob = carrier2ReadyBlob; payloadBlob = payload1ReadyBlob; isReadyUnits = true;
    } else {
      carrierBlob = carrier2RawBlob; payloadBlob = payload1RawBlob;
    }
  }

  if (!carrierBlob || !payloadBlob) {
    alert("تأكد من إتمام عملية الفصل للمقطعين أولاً.");
    return;
  }

  try {
    let carrierBuffer = await blobToAudioBuffer(carrierBlob);
    let payloadBuffer = await blobToAudioBuffer(payloadBlob);
    let mergedBuffer;

    if (isReadyUnits) {
      // دمج الوحدات الجاهزة عبر التداخل (Overlap) بنفس مساحة الـ transition (0.045 + 0.045 = 0.09s)
      mergedBuffer = overlapAddAudioBuffers(carrierBuffer, payloadBuffer, 0.09);
    } else {
      // تراجع (Fallback) للطريقة الخام إذا لم تكن الوحدات الجاهزة متاحة
      carrierBuffer = trimReplacementForMerge(carrierBuffer);
      const trimResult = trimPayloadStart(payloadBuffer);
      payloadBuffer = trimResult.buffer;
      mergedBuffer = crossfadeAudioBuffers(carrierBuffer, payloadBuffer, 0.10);
    }

    const resultBlob = audioBufferToWavBlob(mergedBuffer);

    if (carrierNum === 1 && payloadNum === 2) {
      result1_2_Blob = resultBlob;
    } else {
      result2_1_Blob = resultBlob;
    }

    updateMergeSplitStatus(
      "🧩 تم الدمج بنجاح:<br>" +
      "حامل المقطع " + carrierNum + " + محمول المقطع " + payloadNum + "<br>" +
      (isReadyUnits ? "✨ <b style='color:#a3e635;'>تم الدمج الموزون بدقة ضمن منطقة الاشتباك (Ready Units).</b>" : "⚠️ تم استخدام الدمج الخام القديم.") + "<br>" +
      "استخدم أزرار التشغيل للاستماع للنتيجة."
    );

  } catch (err) {
    console.error(err);
    alert("فشل الدمج: " + err.message);
  }
}

function playExperimentAudio(target) {
  let blob = null;
  let label = target;

  switch(target) {
    case 'seg1': blob = segment1Blob; label = "المقطع 1"; break;
    case 'carrier1': blob = carrier1RawBlob; label = "الحامل الخام 1"; break;
    case 'payload1': blob = payload1RawBlob; label = "المحمول الخام 1"; break;
    case 'carrier1Ready': blob = carrier1ReadyBlob; label = "الحامل الجاهز 1"; break;
    case 'payload1Ready': blob = payload1ReadyBlob; label = "المحمول الجاهز 1"; break;

    case 'seg2': blob = segment2Blob; label = "المقطع 2"; break;
    case 'carrier2': blob = carrier2RawBlob; label = "الحامل الخام 2"; break;
    case 'payload2': blob = payload2RawBlob; label = "المحمول الخام 2"; break;
    case 'carrier2Ready': blob = carrier2ReadyBlob; label = "الحامل الجاهز 2"; break;
    case 'payload2Ready': blob = payload2ReadyBlob; label = "المحمول الجاهز 2"; break;

    case 'result1_2': blob = result1_2_Blob; label = "الناتج: حامل 1 + محمول 2"; break;
    case 'result2_1': blob = result2_1_Blob; label = "الناتج: حامل 2 + محمول 1"; break;
  }

  if(!blob) {
    alert("الكيان غير متوفر للتشغيل: " + label);
    return;
  }
  playBlob(blob, label);
}

// تصدير دوال الواجهة
window.fetchExperimentSegment = fetchExperimentSegment;
window.recordExperimentSegment = recordExperimentSegment;
window.splitExperimentSegment = splitExperimentSegment;
window.experimentMerge = experimentMerge;
window.playExperimentAudio = playExperimentAudio;
window.saveMergeExperimentState = window.saveMergeExperimentState;
window.restoreMergeExperimentState = window.restoreMergeExperimentState;


// =========================================================================
// ⚠️ الطبقة التوافقية للنظام القديم (V1.7) لضمان عدم الكسر
// =========================================================================

async function fetchSegmentSafely(type) {
  const inputId = type === 'base' ? 'merge-base-input' : 'merge-carrier-input';
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return false;
  
  const text = inputEl.value.trim() ? inputEl.value.trim() : (type === 'base' ? 'بص' : 'ق');
  if (!text) return false;

  const keys = resolveDynamicKeys(text);
  const authorizedFileName = findAuthorizedFileInPacks(text, keys);
  if (!authorizedFileName) return false;

  const blob = await searchAudioBlobSafely(authorizedFileName);
  if (blob) {
    if (type === 'base') {
      baseSegmentBlob = blob; extractedPayloadBlob = null; mergedSegmentBlob = null;
    } else {
      replacementBlob = blob; mergedSegmentBlob = null;
    }
    return true;
  }
  return false;
}

function fetchDynamicBaseSegment() { return fetchSegmentSafely("base"); }
function fetchDynamicCarrierReplacement() { return fetchSegmentSafely("carrier"); }

async function recordBaseSegment() {
  const inputEl = document.getElementById("merge-base-input");
  if (!inputEl) return;
  const text = inputEl.value.trim() ? inputEl.value.trim() : "بَصْ";
  baseSegmentBlob = await recordMergeSample(1000);
  if (!baseSegmentBlob) return;
  extractedPayloadBlob = null; mergedSegmentBlob = null;
  saveTempAudioToStorage(text + ".wav", baseSegmentBlob);
}

async function recordCarrierReplacement() {
  const inputEl = document.getElementById("merge-carrier-input");
  if (!inputEl) return;
  const text = inputEl.value.trim() ? inputEl.value.trim() : "قَ";
  replacementBlob = await recordMergeSample(1000);
  if (!replacementBlob) return;
  mergedSegmentBlob = null;
  saveTempAudioToStorage(text + ".wav", replacementBlob);
}

async function recordMergeSample(durationMs) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    return await new Promise(function (resolve) {
      const chunks = [];
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) { options.mimeType = "audio/webm;codecs=opus"; } 
      else if (MediaRecorder.isTypeSupported("audio/webm")) { options.mimeType = "audio/webm"; }
      
      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = function (event) { if (event.data && event.data.size > 0) chunks.push(event.data); };
      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) { track.stop(); });
        if (!chunks.length) { resolve(null); return; }
        resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
      };
      recorder.start();
      setTimeout(function () { if (recorder.state !== "inactive") { recorder.requestData(); recorder.stop(); } }, durationMs || 3000);
    });
  } catch (err) { return null; }
}

function playBlob(blob, label) {
  if (!blob) { alert("لا يوجد صوت مسجل أو مستدعى: " + label); return; }
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = function () { URL.revokeObjectURL(url); };
  audio.play().catch(function () { alert("فشل تشغيل الصوت: " + label); });
}

function playBaseSegment() { playBlob(baseSegmentBlob, "المقطع الأصلي القديم"); }
function playReplacementSegment() { playBlob(replacementBlob, "الحامل القديم"); }
function playPayloadSegment() { playBlob(extractedPayloadBlob, "المحمول القديم"); }
function playMergedSegment() { playBlob(mergedSegmentBlob, "المدموج القديم"); }

async function blobToAudioBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return await new AudioContextClass().decodeAudioData(arrayBuffer);
}

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) { view.setUint8(offset + i, string.charCodeAt(i)); }
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
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
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
  
  const newBuffer = new AudioBuffer({ length: frameCount, numberOfChannels: buffer.numberOfChannels, sampleRate: sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const source = buffer.getChannelData(ch);
    const target = newBuffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) { target[i] = source[startSample + i] || 0; }
  }
  return newBuffer;
}

function rmsOfSamples(samples, start, end) {
  let sum = 0, count = 0;
  for (let i = start; i < end && i < samples.length; i++) { sum += samples[i] * samples[i]; count++; }
  return count ? Math.sqrt(sum / count) : 0;
}

function trimPayloadStart(buffer) {
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);
  const frameSize = Math.max(1, Math.floor(sampleRate * 10 / 1000));
  let maxRms = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms = rmsOfSamples(samples, i, i + frameSize);
    if (rms > maxRms) maxRms = rms;
  }

  const threshold = Math.max(maxRms * 0.18, 0.006);
  let startFrame = 0;

  for (let i = 0; i < samples.length; i += frameSize) {
    const rms = rmsOfSamples(samples, i, i + frameSize);
    if (rms >= threshold) { startFrame = i; break; }
  }

  const cleanStartSecond = Math.max(0, startFrame - Math.floor(sampleRate * 0.025)) / sampleRate;
  return { buffer: sliceAudioBuffer(buffer, cleanStartSecond, buffer.duration), cleanStartSecond, threshold };
}

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
    if (rms >= threshold) { startSample = Math.max(0, i - Math.floor(sampleRate * 0.015)); break; }
  }

  const startSecond = startSample / sampleRate;
  return sliceAudioBuffer(buffer, startSecond, Math.min(buffer.duration, startSecond + 0.17));
}

function crossfadeAudioBuffers(bufferA, bufferB, fadeSeconds) {
  const sampleRate = bufferA.sampleRate;
  const numberOfChannels = Math.min(bufferA.numberOfChannels, bufferB.numberOfChannels);
  let fadeSamples = Math.floor((fadeSeconds || 0.06) * sampleRate);
  fadeSamples = Math.max(1, Math.min(fadeSamples, Math.floor(bufferA.length * 0.35), Math.floor(bufferB.length * 0.35)));

  const outputLength = bufferA.length + bufferB.length - fadeSamples;
  const outputBuffer = new AudioBuffer({ length: outputLength, numberOfChannels: numberOfChannels, sampleRate: sampleRate });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);
    const aKeepLength = bufferA.length - fadeSamples;

    for (let i = 0; i < aKeepLength; i++) { out[i] = a[i]; }
    for (let i = 0; i < fadeSamples; i++) {
      const t = i / Math.max(1, fadeSamples - 1);
      out[aKeepLength + i] = a[aKeepLength + i] * (1 - t) + b[i] * t;
    }
    for (let i = fadeSamples; i < bufferB.length; i++) { out[aKeepLength + i] = b[i]; }
  }
  return outputBuffer;
}

async function splitBaseSegment() {
  if (!baseSegmentBlob) return;
  try {
    const buffer = await blobToAudioBuffer(baseSegmentBlob);
    const inputEl = document.getElementById("merge-base-input");
    const baseText = inputEl ? inputEl.value.trim() : "بص";
    let carrierKey = "ba", payloadKey = "sad";
    const keys = resolveDynamicKeys(baseText);
    if (keys && keys.length >= 2) { carrierKey = keys[0]; payloadKey = keys[1]; } 
    else if (keys && keys.length === 1) { carrierKey = keys[0]; payloadKey = keys[0]; }

    const result = detectPayloadBoundaryByIdentity(buffer, { carrierKey, payloadKey, windowSize: 0.18, hopSize: 0.035, minStart: 0.08 });
    if (!result.boundary) return;

    let payloadBuffer = sliceAudioBuffer(buffer, result.boundary, buffer.duration);
    payloadBuffer = trimPayloadStart(payloadBuffer).buffer;
    extractedPayloadBlob = audioBufferToWavBlob(payloadBuffer);
    mergedSegmentBlob = null;
  } catch (err) { console.error(err); }
}

async function mergeReplacementWithPayload() {
  if (!replacementBlob || !extractedPayloadBlob) return;
  try {
    let replacementBuffer = await blobToAudioBuffer(replacementBlob);
    const payloadBuffer = await blobToAudioBuffer(extractedPayloadBlob);
    replacementBuffer = trimReplacementForMerge(replacementBuffer);
    const mergedBuffer = crossfadeAudioBuffers(replacementBuffer, payloadBuffer, 0.10);
    mergedSegmentBlob = audioBufferToWavBlob(mergedBuffer);
  } catch (err) { console.error(err); }
}

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
window.extractCognitiveJoinUnits = extractCognitiveJoinUnits;

console.log("🧩 محرك الفصل والدمج الإدراكي التجريبي جاهز V1.9 مصحح وموزون");
