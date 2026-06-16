// ================================
// operation-labs/phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1.9
// مختبر استخراج وحدات الاشتباك والدمج بالتداخل الموزون
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1.9");


// ======================================
// متغيرات الطبقة التوافقية القديمة V1.7
// ======================================

let baseSegmentBlob = null;
let replacementBlob = null;
let extractedPayloadBlob = null;
let mergedSegmentBlob = null;


// ======================================
// متغيرات مختبر الفصل والدمج الحالي V1.9
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

let result1_2_Blob = null;
let result2_1_Blob = null;


// ======================================
// تحديث حالة المختبر
// ======================================

function updateMergeSplitStatus(message, saveState = true) {
  const box = document.getElementById("merge-split-status");

  if (!box) return;

  box.innerHTML = message;

  if (saveState && typeof saveMergeExperimentState === "function") {
    saveMergeExperimentState();
  }
}


// ======================================
// 1) أدوات النص والحقائب والصوت
// ======================================

function normalizeArabic(text) {
  if (!text) return "";
  return text.replace(/[\u064B-\u065F\u0640]/g, "").trim();
}


function resolveDynamicKeys(text) {
  if (typeof getAllPhonemeTrainingPacks !== "function") return null;

  const packs = getAllPhonemeTrainingPacks();
  if (!packs) return null;

  const cleanText = normalizeArabic(text);
  const chars = cleanText.split("");
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
  if (!fileName) return null;

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
    keys.forEach(function (key) {
      if (packs[key]) targetPacks.push(packs[key]);
    });
  } else {
    targetPacks = Object.values(packs);
  }

  for (const pack of targetPacks) {
    if (!pack.positions) continue;

    const exactMatch = pack.positions.find(function (position) {
      return position.text === text;
    });

    if (exactMatch) return exactMatch.file;
  }

  for (const pack of targetPacks) {
    if (!pack.positions) continue;

    const normMatch = pack.positions.find(function (position) {
      return normalizeArabic(position.text) === normText;
    });

    if (normMatch) return normMatch.file;
  }

  if (normText.length === 1) {
    for (const pack of targetPacks) {
      if (normalizeArabic(pack.letter) === normText && pack.positions) {
        const fathaMatch = pack.positions.find(function (position) {
          return (
            position.role === "فتح" ||
            position.role === "fatha" ||
            normalizeArabic(position.text) === normText
          );
        });

        if (fathaMatch) return fathaMatch.file;
      }
    }
  }

  return null;
}


async function resolveAudioBlobForText(text) {
  const keys = resolveDynamicKeys(text);
  const authorizedFileName = findAuthorizedFileInPacks(text, keys);

  if (authorizedFileName) {
    const authorizedBlob = await searchAudioBlobSafely(authorizedFileName);
    if (authorizedBlob) return authorizedBlob;
  }

  const tempBlob = await searchAudioBlobSafely(text + ".wav");
  if (tempBlob) return tempBlob;

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
// 2) حفظ واستعادة حالة مختبر الفصل والدمج
// ======================================

window.saveMergeExperimentState = function () {
  const el1 = document.getElementById("merge-seg1-input");
  const el2 = document.getElementById("merge-seg2-input");

  localStorage.setItem(
    "merge_experiment_seg1_text",
    el1 ? el1.value.trim() : ""
  );

  localStorage.setItem(
    "merge_experiment_seg2_text",
    el2 ? el2.value.trim() : ""
  );

  localStorage.setItem(
    "merge_experiment_seg1_ready",
    segment1Blob ? "true" : "false"
  );

  localStorage.setItem(
    "merge_experiment_seg2_ready",
    segment2Blob ? "true" : "false"
  );

  localStorage.setItem(
    "merge_experiment_seg1_split",
    carrier1RawBlob ? "true" : "false"
  );

  localStorage.setItem(
    "merge_experiment_seg2_split",
    carrier2RawBlob ? "true" : "false"
  );

  const statusBox = document.getElementById("merge-split-status");

  localStorage.setItem(
    "merge_experiment_last_status",
    statusBox ? statusBox.innerHTML : "مستعد لبدء التجربة."
  );
};


window.restoreMergeExperimentState = async function () {
  const seg1Text = localStorage.getItem("merge_experiment_seg1_text") || "";
  const seg2Text = localStorage.getItem("merge_experiment_seg2_text") || "";
  const lastStatus =
    localStorage.getItem("merge_experiment_last_status") ||
    "مستعد لبدء التجربة.";

  const el1 = document.getElementById("merge-seg1-input");
  const el2 = document.getElementById("merge-seg2-input");

  if (el1) el1.value = seg1Text;
  if (el2) el2.value = seg2Text;

  updateMergeSplitStatus(lastStatus, false);

  const ready1 = localStorage.getItem("merge_experiment_seg1_ready") === "true";
  const ready2 = localStorage.getItem("merge_experiment_seg2_ready") === "true";
  const split1 = localStorage.getItem("merge_experiment_seg1_split") === "true";
  const split2 = localStorage.getItem("merge_experiment_seg2_split") === "true";

  if (ready1 && seg1Text) {
    const blob = await resolveAudioBlobForText(seg1Text);

    if (blob) {
      segment1Blob = blob;

      if (split1) {
        try {
          const splitData = await performCoreCognitiveSplit(blob, seg1Text);
          carrier1RawBlob = splitData.carrierRawBlob;
          payload1RawBlob = splitData.payloadRawBlob;
          carrier1ReadyBlob = splitData.carrierReadyBlob;
          payload1ReadyBlob = splitData.payloadReadyBlob;
        } catch (err) {
          console.warn("تعذر استعادة فصل المقطع الأول:", err);
        }
      }
    }
  }

  if (ready2 && seg2Text) {
    const blob = await resolveAudioBlobForText(seg2Text);

    if (blob) {
      segment2Blob = blob;

      if (split2) {
        try {
          const splitData = await performCoreCognitiveSplit(blob, seg2Text);
          carrier2RawBlob = splitData.carrierRawBlob;
          payload2RawBlob = splitData.payloadRawBlob;
          carrier2ReadyBlob = splitData.carrierReadyBlob;
          payload2ReadyBlob = splitData.payloadReadyBlob;
        } catch (err) {
          console.warn("تعذر استعادة فصل المقطع الثاني:", err);
        }
      }
    }
  }
};


// ======================================
// 3) استدعاء وتسجيل المقاطع
// ======================================

async function fetchExperimentSegment(segNum) {
  const inputId = segNum === 1 ? "merge-seg1-input" : "merge-seg2-input";
  const inputEl = document.getElementById(inputId);
  const text = inputEl ? inputEl.value.trim() : "";

  if (!text) {
    alert("يرجى إدخال النص أولًا.");
    return false;
  }

  const blob = await resolveAudioBlobForText(text);

  if (!blob) {
    alert("لم يتم العثور على تسجيل لهذا المقطع:\n" + text);
    return false;
  }

  if (segNum === 1) {
    segment1Blob = blob;
    carrier1RawBlob = null;
    payload1RawBlob = null;
    carrier1ReadyBlob = null;
    payload1ReadyBlob = null;
    result1_2_Blob = null;
    result2_1_Blob = null;
  } else {
    segment2Blob = blob;
    carrier2RawBlob = null;
    payload2RawBlob = null;
    carrier2ReadyBlob = null;
    payload2ReadyBlob = null;
    result1_2_Blob = null;
    result2_1_Blob = null;
  }

  updateMergeSplitStatus(
    "✅ تم استدعاء المقطع " +
      segNum +
      ": <b>" +
      text +
      "</b> بنجاح."
  );

  return true;
}


async function recordExperimentSegment(segNum) {
  const inputId = segNum === 1 ? "merge-seg1-input" : "merge-seg2-input";
  const inputEl = document.getElementById(inputId);
  const text = inputEl ? inputEl.value.trim() : "";

  if (!text) {
    alert("اكتب النص أولًا.");
    return;
  }

  alert(
    "اضغط حسنًا، ثم سجّل الآن المقطع: " +
      text +
      "\nالتسجيل سيستمر لمدة ثانية واحدة تقريبًا."
  );

  updateMergeSplitStatus("🎙 تجهيز الميكروفون...", false);

  const blob = await recordMergeSample(1000, null, function () {
  updateMergeSplitStatus("🟢 ابدأ الآن — مدة التسجيل ثانية واحدة", false);
});

updateMergeSplitStatus("🔴 تم", false);
  if (!blob) {
    updateMergeSplitStatus("❌ فشل التسجيل، يرجى التأكد من صلاحيات الميكروفون.");
    return;
  }

  if (segNum === 1) {
    segment1Blob = blob;
    carrier1RawBlob = null;
    payload1RawBlob = null;
    carrier1ReadyBlob = null;
    payload1ReadyBlob = null;
  } else {
    segment2Blob = blob;
    carrier2RawBlob = null;
    payload2RawBlob = null;
    carrier2ReadyBlob = null;
    payload2ReadyBlob = null;
  }

  saveTempAudioToStorage(text + ".wav", blob);

  updateMergeSplitStatus(
    "✅ انتهى التسجيل وتم حفظ المقطع " +
      segNum +
      ": <b>" +
      text +
      "</b><br>" +
      "الحجم: " +
      blob.size +
      " bytes<br>" +
      "النوع: " +
      blob.type
  );
}


// ======================================
// 4) أدوات معالجة الصوت
// ======================================

function concatAudioBuffers(bufferA, bufferB) {
  const numberOfChannels = Math.min(
    bufferA.numberOfChannels,
    bufferB.numberOfChannels
  );

  const sampleRate = bufferA.sampleRate;
  const outputLength = bufferA.length + bufferB.length;

  const outputBuffer = new AudioBuffer({
    length: outputLength,
    numberOfChannels,
    sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);

    out.set(a, 0);
    out.set(b, bufferA.length);
  }

  return outputBuffer;
}


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


function overlapAddAudioBuffers(bufferA, bufferB, overlapSeconds) {
  const sampleRate = bufferA.sampleRate;
  const numberOfChannels = Math.min(
    bufferA.numberOfChannels,
    bufferB.numberOfChannels
  );

  const overlapSamples = Math.floor(overlapSeconds * sampleRate);
  const actualOverlap = Math.min(
    overlapSamples,
    bufferA.length,
    bufferB.length
  );

  const outputLength = bufferA.length + bufferB.length - actualOverlap;

  const outputBuffer = new AudioBuffer({
    length: outputLength,
    numberOfChannels,
    sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);

    const aKeep = bufferA.length - actualOverlap;

    for (let i = 0; i < aKeep; i++) {
      out[i] = a[i];
    }

    for (let i = 0; i < actualOverlap; i++) {
      out[aKeep + i] = (a[aKeep + i] || 0) + (b[i] || 0);
    }

    for (let i = actualOverlap; i < bufferB.length; i++) {
      out[aKeep + i] = b[i];
    }
  }

  return outputBuffer;
}

function getCognitiveJoinOptions() {
  return {
    before: 0.025,
    after: 0.035,
    tailGain: 0.55,
    curvePower: 1.7
  };
}

function dampenCarrierTail(buffer, tailGain) {
  tailGain = Math.max(0.1, Math.min(1, Number(tailGain || 0.55)));

  const out = new AudioBuffer({
    length: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate
  });

  const tailSamples = Math.floor(buffer.sampleRate * 0.018);

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = out.getChannelData(ch);

    for (let i = 0; i < buffer.length; i++) {
      const fromEnd = buffer.length - i;
      let gain = 1;

      if (fromEnd < tailSamples) {
        const t = fromEnd / Math.max(1, tailSamples);
        gain = tailGain + (1 - tailGain) * t;
      }

      dst[i] = src[i] * gain;
    }
  }

  return out;
}
function extractCognitiveJoinUnits(buffer, cutPoint, options, splitContext) {
  options = options || getCognitiveJoinOptions();

  const transStart = Math.max(0, cutPoint - options.before);
  const transEnd = Math.min(buffer.duration, cutPoint + options.after);

  const carrierCore = sliceAudioBuffer(buffer, 0, transStart);
  const joinZone = sliceAudioBuffer(buffer, transStart, transEnd);
  const payloadCore = sliceAudioBuffer(buffer, transEnd, buffer.duration);

  // المسار الآمن الحالي: لا يكسر آخر خطوة ناجحة
  const carrierTail = dampenCarrierTail(
    applyCurvedEnvelope(joinZone, 1.0, 0.0, options.curvePower),
    options.tailGain
  );

  const payloadHead = applyCurvedEnvelope(
    joinZone,
    0.0,
    1.0,
    options.curvePower
  );

  const carrierReady = concatAudioBuffers(carrierCore, carrierTail);
  const payloadReady = concatAudioBuffers(payloadHead, payloadCore);

  return {
    cutPoint,
    transStart,
    transEnd,
    carrierCore,
    payloadCore,
    joinZone,
    carrierTail,
    payloadHead,
    carrierReady,
    payloadReady,
    splitContext: splitContext || null,
    options
  };
}

// ======================================
// 5) استدعاء المعرفة الإدراكية لخدمة الفصل والدمج
// ======================================

function loadCognitiveIdentityForSplit(phonemeKey) {
  const keys = [
    phonemeKey + "_cognitive_identity",
    phonemeKey + "_perceptual_identity",
    phonemeKey + "_memory",
    "phoneme_memory_" + phonemeKey,
    "cognitive_memory_" + phonemeKey
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn("ذاكرة/هوية تالفة:", key, err);
    }
  }

  return null;
}


function buildSplitKnowledgeContext(carrierKey, payloadKey, text) {
  const carrierIdentity = loadCognitiveIdentityForSplit(carrierKey);
  const payloadIdentity = loadCognitiveIdentityForSplit(payloadKey);

  const carrierFamily =
    typeof buildFamilyDecisionContext === "function"
      ? buildFamilyDecisionContext(carrierKey)
      : null;

  const payloadFamily =
    typeof buildFamilyDecisionContext === "function"
      ? buildFamilyDecisionContext(payloadKey)
      : null;

  const carrierMemory =
    typeof loadPhonemeCumulativeMemory === "function"
      ? loadPhonemeCumulativeMemory(carrierKey)
      : null;

  const payloadMemory =
    typeof loadPhonemeCumulativeMemory === "function"
      ? loadPhonemeCumulativeMemory(payloadKey)
      : null;

  return {
    text,
    carrierKey,
    payloadKey,
    carrierIdentity,
    payloadIdentity,
    carrierFamily,
    payloadFamily,
    carrierMemory,
    payloadMemory,
    invokedKnowledge: [
      "phoneme-training-pack",
      carrierIdentity ? "cognitive-genome" : null,
      payloadIdentity ? "cognitive-genome" : null,
      carrierFamily ? "phoneme-family-map" : null,
      payloadFamily ? "phoneme-family-map" : null,
      carrierMemory ? "phoneme-cumulative-memory" : null,
      payloadMemory ? "phoneme-cumulative-memory" : null,
      "payload-boundary"
    ].filter(Boolean)
  };
}


function decideInfluentialKnowledgeForSplit(splitContext, result) {
  const influential = ["payload-boundary"];

  if (splitContext.carrierIdentity || splitContext.payloadIdentity) {
    influential.push("cognitive-genome");
  }

  if (splitContext.carrierFamily || splitContext.payloadFamily) {
    influential.push("phoneme-family-map");
  }

  if (splitContext.carrierMemory || splitContext.payloadMemory) {
    influential.push("phoneme-cumulative-memory");
  }

  if (result && typeof result.confidence === "number") {
    influential.push("confidence-score");
  }

  return influential;
}
function buildMergeKnowledgeContext(carrierNum, payloadNum, isReadyUnits) {
  return {
    carrierNum,
    payloadNum,
    isReadyUnits,
    invokedKnowledge: [
      "merge-split-lab",
      "payload-extraction",
      "payload-boundary",
      isReadyUnits ? "weighted-join-zone" : null
    ].filter(Boolean),
    influentialKnowledge: isReadyUnits
      ? ["weighted-join-zone", "payload-boundary"]
      : ["merge-split-lab", "payload-extraction"]
  };
}
// ======================================
// 6) الفصل الإدراكي
// ======================================
async function performCoreCognitiveSplit(blob, text) {
  const normText = normalizeArabic(text);

  if (normText.length < 2) {
    throw new Error("أدخل مقطعًا من حرفين مختلفين مثل: بص، قد، حب.");
  }

  if (normText[0] === normText[1]) {
    throw new Error("هذا اختبار متقدم لأن الحامل والمحمول من نفس الهوية.");
  }

  const keys = resolveDynamicKeys(text);

  if (!keys || keys.length < 2) {
    throw new Error("لم يتم العثور على مفتاحين إدراكيين لهذا المقطع في الحقائب.");
  }

  if (typeof detectPayloadBoundaryByIdentity !== "function") {
    throw new Error("دالة detectPayloadBoundaryByIdentity غير محمّلة.");
  }

  const splitContext = buildSplitKnowledgeContext(keys[0], keys[1], text);
  const buffer = await blobToAudioBuffer(blob);

  const result = detectPayloadBoundaryByIdentity(buffer, {
    carrierKey: keys[0],
    payloadKey: keys[1],
    windowSize: 0.18,
    hopSize: 0.035,

    cognitiveContext: splitContext,
    carrierIdentity: splitContext.carrierIdentity,
    payloadIdentity: splitContext.payloadIdentity,
    carrierFamily: splitContext.carrierFamily,
    payloadFamily: splitContext.payloadFamily,
    carrierMemory: splitContext.carrierMemory,
    payloadMemory: splitContext.payloadMemory
  });

  if (!result || result.accepted !== true) {
    return {
      accepted: false,
      failedPerceptualSplit: true,
      failureReason:
        result?.failureReason ||
        "لم تكتمل خريطة الحضور الإدراكي لاستخراج الحامل والمحمول.",
      carrierRawBlob: null,
      payloadRawBlob: null,
      carrierReadyBlob: null,
      payloadReadyBlob: null,
      carrierTailBlob: null,
      payloadHeadBlob: null,
      perceptualZones: result?.perceptualZones || null,
      presenceMap: result?.presenceMap || null,
      boundaryEvidence: result || null
    };
  }

  if (typeof window.recordDecisionTrace === "function") {
    window.recordDecisionTrace({
      decisionId: "split-segment",
      decisionName: "بناء خريطة حضور إدراكي للمقطع",
      target: text,
      invokedKnowledge: splitContext.invokedKnowledge,
      influentialKnowledge: decideInfluentialKnowledgeForSplit(splitContext, result),
      result: "perceptual-presence-map-produced",
      confidence: null,
      notes:
        "تم بناء خريطة حضور إدراكي للحامل والمحمول دون boundary أو cutPoint."
    });
  }

  return {
    accepted: true,
    failedPerceptualSplit: false,

    perceptualZones: result.perceptualZones,
    presenceMap: result.presenceMap,
    carrierPresenceMap: result.carrierPresenceMap,
    payloadPresenceMap: result.payloadPresenceMap,
    boundaryEvidence: result,

    carrierRawBlob: null,
    payloadRawBlob: null,
    carrierReadyBlob: null,
    payloadReadyBlob: null,
    carrierTailBlob: null,
    payloadHeadBlob: null
  };
}
// ======================================
  // أثر القرار الحوكمي: فصل المقطع
  // ======================================
  if (typeof window.recordDecisionTrace === "function") {
    window.recordDecisionTrace({
      decisionId: "split-segment",
      decisionName: "فصل إدراكي للمقطع",
      target: text,
      invokedKnowledge: splitContext.invokedKnowledge,
influentialKnowledge: decideInfluentialKnowledgeForSplit(splitContext, result),
      result: "split-produced",
      confidence: typeof result.confidence === "number" ? result.confidence : null,
      notes:
  "تم الفصل بعد استدعاء الحقائب والجينوم والعائلة والذاكرة إن كانت متاحة. " +
  "هذا ليس تقريرًا خارجيًا؛ هذه معرفة تم تمريرها مباشرة إلى قرار الفصل."    });
  }
  const carrierRawBuffer = sliceAudioBuffer(buffer, 0, cutPoint);
  const payloadRawBuffer = sliceAudioBuffer(buffer, cutPoint, buffer.duration);

  const units = extractCognitiveJoinUnits(
  buffer,
  cutPoint,
  getCognitiveJoinOptions(),
  splitContext
);
  return {
  carrierRawBlob: audioBufferToWavBlob(carrierRawBuffer),
  payloadRawBlob: audioBufferToWavBlob(payloadRawBuffer),

  carrierTailBlob: audioBufferToWavBlob(units.carrierTail),
  payloadHeadBlob: audioBufferToWavBlob(units.payloadHead),

  carrierReadyBlob: audioBufferToWavBlob(units.carrierReady),
  payloadReadyBlob: audioBufferToWavBlob(units.payloadReady),

  cutPoint,
  transStart: units.transStart,
  transEnd: units.transEnd,

  joinOptions: units.options,
  perceptualZones: result.perceptualZones || null,
  boundaryEvidence: result
};
}


async function splitExperimentSegment(segNum) {
  const blob = segNum === 1 ? segment1Blob : segment2Blob;

  if (!blob) {
    alert("يرجى استدعاء أو تسجيل المقطع " + segNum + " أولًا.");
    return;
  }

  const inputId = segNum === 1 ? "merge-seg1-input" : "merge-seg2-input";
  const inputEl = document.getElementById(inputId);
  const text = inputEl ? inputEl.value.trim() : "";

  try {
    const splitData = await performCoreCognitiveSplit(blob, text);
alert(
  "نتيجة الفصل الإدراكي:\n" +
  "carrierRawBlob: " + !!splitData.carrierRawBlob + "\n" +
  "payloadRawBlob: " + !!splitData.payloadRawBlob + "\n" +
  "cutPoint: " + splitData.cutPoint + "\n" +
  "transStart: " + splitData.transStart + "\n" +
  "transEnd: " + splitData.transEnd
);
    if (segNum === 1) {
      carrier1RawBlob = splitData.carrierRawBlob;
      payload1RawBlob = splitData.payloadRawBlob;
      carrier1ReadyBlob = splitData.carrierReadyBlob;
      payload1ReadyBlob = splitData.payloadReadyBlob;
    } else {
      carrier2RawBlob = splitData.carrierRawBlob;
      payload2RawBlob = splitData.payloadRawBlob;
      carrier2ReadyBlob = splitData.carrierReadyBlob;
      payload2ReadyBlob = splitData.payloadReadyBlob;
    }

    updateMergeSplitStatus(
      "🧭 تم فصل المقطع " +
        segNum +
        " إدراكيًا:<br>" +
        "نقطة القطع: <b>" +
        splitData.cutPoint.toFixed(3) +
        " ثانية</b><br>" +
        "✔️ تم استخراج الحامل الخام والمحمول الخام.<br>" +
        "✔️ تم استخراج وبناء النسخ الموزونة بنجاح."
    );
  } catch (err) {
    console.error(err);
    alert("فشل الفصل: " + err.message);
  }
}


// ======================================
// 7) الدمج الإدراكي
// ======================================

async function experimentMerge(carrierNum, payloadNum) {
  let carrierBlob = null;
  let payloadBlob = null;
  let isReadyUnits = false;

  if (carrierNum === 1 && payloadNum === 2) {
    if (carrier1ReadyBlob && payload2ReadyBlob) {
      carrierBlob = carrier1ReadyBlob;
      payloadBlob = payload2ReadyBlob;
      isReadyUnits = true;
    } else {
      carrierBlob = carrier1RawBlob;
      payloadBlob = payload2RawBlob;
    }
  } else {
    if (carrier2ReadyBlob && payload1ReadyBlob) {
      carrierBlob = carrier2ReadyBlob;
      payloadBlob = payload1ReadyBlob;
      isReadyUnits = true;
    } else {
      carrierBlob = carrier2RawBlob;
      payloadBlob = payload1RawBlob;
    }
  }

  if (!carrierBlob || !payloadBlob) {
    alert("تأكد من إتمام عملية الفصل للمقطعين أولًا.");
    return;
  }
const mergeContext = buildMergeKnowledgeContext(
    carrierNum,
    payloadNum,
    isReadyUnits
  );
  try {
    let carrierBuffer = await blobToAudioBuffer(carrierBlob);
    let payloadBuffer = await blobToAudioBuffer(payloadBlob);
    let mergedBuffer = null;

    if (isReadyUnits) {
      mergedBuffer = overlapAddAudioBuffers(carrierBuffer, payloadBuffer, 0.09);
    } else {
      carrierBuffer = trimReplacementForMerge(carrierBuffer);
      payloadBuffer = trimPayloadStart(payloadBuffer).buffer;
      mergedBuffer = crossfadeAudioBuffers(carrierBuffer, payloadBuffer, 0.10);
    }

    const resultBlob = audioBufferToWavBlob(mergedBuffer);
// ======================================
    // أثر القرار الحوكمي: دمج المقطع
    // ======================================
    if (typeof window.recordDecisionTrace === "function") {
      window.recordDecisionTrace({
        decisionId: "merge-segment",
        decisionName: "دمج إدراكي للمقطع",
        target: "carrier-" + carrierNum + "_payload-" + payloadNum,
        invokedKnowledge: mergeContext.invokedKnowledge,
influentialKnowledge: mergeContext.influentialKnowledge,
        result: "merge-produced",
        confidence: null,
        notes: isReadyUnits
          ? "تم الدمج باستخدام الوحدات الموزونة."
          : "تم الدمج بالطريقة الخام القديمة، وهذا يحتاج مراجعة إدراكية."
      });
    }
    if (carrierNum === 1 && payloadNum === 2) {
      result1_2_Blob = resultBlob;
    } else {
      result2_1_Blob = resultBlob;
    }

    updateMergeSplitStatus(
      "🧩 تم الدمج بنجاح:<br>" +
        "حامل المقطع " +
        carrierNum +
        " + محمول المقطع " +
        payloadNum +
        "<br>" +
        (isReadyUnits
          ? "✨ <b style='color:#a3e635;'>تم الدمج باستخدام الوحدات الموزونة.</b>"
          : "⚠️ تم استخدام الدمج الخام القديم.") +
        "<br>استخدم أزرار التشغيل للاستماع للنتيجة."
    );
  } catch (err) {
    console.error(err);
    alert("فشل الدمج: " + err.message);
  }
}


// ======================================
// 8) تشغيل الأصوات
// ======================================

function playExperimentAudio(target) {
  let blob = null;
  let label = target;

  switch (target) {
    case "seg1":
      blob = segment1Blob;
      label = "المقطع 1";
      break;

    case "carrier1":
      blob = carrier1RawBlob;
      label = "الحامل الخام 1";
      break;

    case "payload1":
      blob = payload1RawBlob;
      label = "المحمول الخام 1";
      break;

    case "carrier1Ready":
      blob = carrier1ReadyBlob;
      label = "الحامل الجاهز 1";
      break;

    case "payload1Ready":
      blob = payload1ReadyBlob;
      label = "المحمول الجاهز 1";
      break;

    case "seg2":
      blob = segment2Blob;
      label = "المقطع 2";
      break;

    case "carrier2":
      blob = carrier2RawBlob;
      label = "الحامل الخام 2";
      break;

    case "payload2":
      blob = payload2RawBlob;
      label = "المحمول الخام 2";
      break;

    case "carrier2Ready":
      blob = carrier2ReadyBlob;
      label = "الحامل الجاهز 2";
      break;

    case "payload2Ready":
      blob = payload2ReadyBlob;
      label = "المحمول الجاهز 2";
      break;

    case "result1_2":
      blob = result1_2_Blob;
      label = "الناتج: حامل 1 + محمول 2";
      break;

    case "result2_1":
      blob = result2_1_Blob;
      label = "الناتج: حامل 2 + محمول 1";
      break;
  }

  if (!blob) {
    alert("الصوت غير متوفر: " + label);
    return;
  }

  playBlob(blob, label);
}


// ======================================
// 9) الطبقة التوافقية القديمة V1.7
// ======================================

async function fetchSegmentSafely(type) {
  const inputId = type === "base" ? "merge-base-input" : "merge-carrier-input";
  const inputEl = document.getElementById(inputId);

  if (!inputEl) return false;

  const text =
    inputEl.value.trim() ||
    (type === "base" ? "بص" : "ق");

  if (!text) return false;

  const blob = await resolveAudioBlobForText(text);

  if (!blob) return false;

  if (type === "base") {
    baseSegmentBlob = blob;
    extractedPayloadBlob = null;
    mergedSegmentBlob = null;
  } else {
    replacementBlob = blob;
    mergedSegmentBlob = null;
  }

  return true;
}


function fetchDynamicBaseSegment() {
  return fetchSegmentSafely("base");
}


function fetchDynamicCarrierReplacement() {
  return fetchSegmentSafely("carrier");
}


async function recordBaseSegment() {
  const inputEl = document.getElementById("merge-base-input");
  if (!inputEl) return;

  const text = inputEl.value.trim() || "بَصْ";
  baseSegmentBlob = await recordMergeSample(1000);

  if (!baseSegmentBlob) return;

  extractedPayloadBlob = null;
  mergedSegmentBlob = null;

  saveTempAudioToStorage(text + ".wav", baseSegmentBlob);
}


async function recordCarrierReplacement() {
  const inputEl = document.getElementById("merge-carrier-input");
  if (!inputEl) return;

  const text = inputEl.value.trim() || "قَ";
  replacementBlob = await recordMergeSample(1000);

  if (!replacementBlob) return;

  mergedSegmentBlob = null;

  saveTempAudioToStorage(text + ".wav", replacementBlob);
}


async function recordMergeSample(durationMs = 1000, onTick = null, onStart = null) {
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

        resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
      };

      recorder.start();

      if (typeof onStart === "function") {
        onStart();
      }

      setTimeout(function () {
        if (recorder.state !== "inactive") {
          recorder.requestData();
          recorder.stop();
        }
      }, durationMs);
    });
  } catch (err) {
    console.error("فشل الوصول إلى الميكروفون:", err);
    return null;
  }
}


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

  audio.play().catch(function () {
    alert("فشل تشغيل الصوت: " + label);
  });
}


function playBaseSegment() {
  playBlob(baseSegmentBlob, "المقطع الأصلي القديم");
}


function playReplacementSegment() {
  playBlob(replacementBlob, "الحامل القديم");
}


function playPayloadSegment() {
  playBlob(extractedPayloadBlob, "المحمول القديم");
}


function playMergedSegment() {
  playBlob(mergedSegmentBlob, "المدموج القديم");
}


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
  view.setUint32(offset, sampleRate * numChannels * 2, true);
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
    sampleRate
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


function rmsOfSamples(samples, start, end) {
  let sum = 0;
  let count = 0;

  for (let i = start; i < end && i < samples.length; i++) {
    sum += samples[i] * samples[i];
    count++;
  }

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

    if (rms >= threshold) {
      startFrame = i;
      break;
    }
  }

  const cleanStartSecond =
    Math.max(0, startFrame - Math.floor(sampleRate * 0.025)) / sampleRate;

  return {
    buffer: sliceAudioBuffer(buffer, cleanStartSecond, buffer.duration),
    cleanStartSecond,
    threshold
  };
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

    if (rms >= threshold) {
      startSample = Math.max(0, i - Math.floor(sampleRate * 0.015));
      break;
    }
  }

  const startSecond = startSample / sampleRate;

  return sliceAudioBuffer(
    buffer,
    startSecond,
    Math.min(buffer.duration, startSecond + 0.17)
  );
}


function crossfadeAudioBuffers(bufferA, bufferB, fadeSeconds) {
  const sampleRate = bufferA.sampleRate;
  const numberOfChannels = Math.min(
    bufferA.numberOfChannels,
    bufferB.numberOfChannels
  );

  let fadeSamples = Math.floor((fadeSeconds || 0.06) * sampleRate);

  fadeSamples = Math.max(
    1,
    Math.min(
      fadeSamples,
      Math.floor(bufferA.length * 0.35),
      Math.floor(bufferB.length * 0.35)
    )
  );

  const outputLength = bufferA.length + bufferB.length - fadeSamples;

  const outputBuffer = new AudioBuffer({
    length: outputLength,
    numberOfChannels,
    sampleRate
  });

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const out = outputBuffer.getChannelData(ch);
    const aKeepLength = bufferA.length - fadeSamples;

    for (let i = 0; i < aKeepLength; i++) {
      out[i] = a[i];
    }

    for (let i = 0; i < fadeSamples; i++) {
      const t = i / Math.max(1, fadeSamples - 1);
      out[aKeepLength + i] = a[aKeepLength + i] * (1 - t) + b[i] * t;
    }

    for (let i = fadeSamples; i < bufferB.length; i++) {
      out[aKeepLength + i] = b[i];
    }
  }

  return outputBuffer;
}


async function splitBaseSegment() {
  if (!baseSegmentBlob) return;

  try {
    const buffer = await blobToAudioBuffer(baseSegmentBlob);
    const inputEl = document.getElementById("merge-base-input");
    const baseText = inputEl ? inputEl.value.trim() : "بص";

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

    const result = detectPayloadBoundaryByIdentity(buffer, {
      carrierKey,
      payloadKey,
      windowSize: 0.18,
      hopSize: 0.035,
      minStart: 0.08
    });

    if (!result.boundary) return;

    let payloadBuffer = sliceAudioBuffer(
      buffer,
      result.boundary,
      buffer.duration
    );

    payloadBuffer = trimPayloadStart(payloadBuffer).buffer;
    extractedPayloadBlob = audioBufferToWavBlob(payloadBuffer);
    mergedSegmentBlob = null;
  } catch (err) {
    console.error(err);
  }
}


async function mergeReplacementWithPayload() {
  if (!replacementBlob || !extractedPayloadBlob) return;

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
  } catch (err) {
    console.error(err);
  }
}


// ======================================
// 9) التصدير العام
// ======================================

window.fetchExperimentSegment = fetchExperimentSegment;
window.recordExperimentSegment = recordExperimentSegment;
window.splitExperimentSegment = splitExperimentSegment;
window.experimentMerge = experimentMerge;
window.playExperimentAudio = playExperimentAudio;

window.normalizeArabic = normalizeArabic;
window.resolveDynamicKeys = resolveDynamicKeys;
window.findAuthorizedFileInPacks = findAuthorizedFileInPacks;
window.searchAudioBlobSafely = searchAudioBlobSafely;
window.resolveAudioBlobForText = resolveAudioBlobForText;
window.saveTempAudioToStorage = saveTempAudioToStorage;

window.recordMergeSample = recordMergeSample;
window.playBlob = playBlob;

window.blobToAudioBuffer = blobToAudioBuffer;
window.audioBufferToWavBlob = audioBufferToWavBlob;
window.sliceAudioBuffer = sliceAudioBuffer;
window.concatAudioBuffers = concatAudioBuffers;
window.overlapAddAudioBuffers = overlapAddAudioBuffers;
window.extractCognitiveJoinUnits = extractCognitiveJoinUnits;

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

if (typeof detectPayloadBoundaryByIdentity === "function") {
  window.detectPayloadBoundaryByIdentity = detectPayloadBoundaryByIdentity;
}
window.loadCognitiveIdentityForSplit = loadCognitiveIdentityForSplit;
window.buildSplitKnowledgeContext = buildSplitKnowledgeContext;
window.decideInfluentialKnowledgeForSplit = decideInfluentialKnowledgeForSplit;
window.buildMergeKnowledgeContext = buildMergeKnowledgeContext;
console.log("🧩 محرك الفصل والدمج الإدراكي جاهز V1.9 — متوافق مع غرفة التجارب الإدراكية");
window.getCognitiveJoinOptions = getCognitiveJoinOptions;
window.dampenCarrierTail = dampenCarrierTail;
