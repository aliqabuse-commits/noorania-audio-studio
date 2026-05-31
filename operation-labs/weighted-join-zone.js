// ================================
// operation-labs/weighted-join-zone.js
// مختبر منطقة الاشتباك الموزونة — V1
// علاج الرنين/الصدى الناتج من تداخل الحامل والمحمول
// ================================

console.log("⚖️ weighted-join-zone.js جاهز V1");

const WJZ = {
  seg1Blob: null,
  seg2Blob: null,

  seg1Text: "",
  seg2Text: "",

  seg1Split: null,
  seg2Split: null,

  result12: null,
  result21: null
};

function openWeightedJoinZoneLab() {
  const box = document.getElementById("operation-labs-content");
  if (!box) return;

  box.innerHTML = `
    <div style="background:#020617; border:1px solid #38bdf8; border-radius:16px; padding:16px; margin-top:16px;">
      <h3 style="color:#38bdf8; margin-top:0;">⚖️ مختبر منطقة الاشتباك الموزونة</h3>

      <p style="line-height:1.8;">
        هذا المختبر لا يستبدل مختبر الفصل والدمج القديم.
        وظيفته اختبار منطقة التداخل نفسها لمعالجة الرنين أو الصدى الناتج من بقاء أثر الحامل أو المحمول.
      </p>

      <hr style="border-color:#1f2937;">

      <div style="margin:12px 0;">
        <h4>1️⃣ المقطع الأول</h4>
        <input id="wjz-seg1-input" placeholder="مثال: بص" style="width:100%; padding:10px; border-radius:8px; background:#1e293b; color:white; border:1px solid #475569;">
        <div style="margin-top:8px;">
          <button onclick="wjzFetchSegment(1)">📥 استدعاء</button>
          <button onclick="wjzRecordSegment(1)">🎙 تسجيل</button>
          <button onclick="wjzSplitSegment(1)">✂️ فصل موزون</button>
          <button onclick="wjzPlay('seg1')">▶ المقطع 1</button>
          <button onclick="wjzPlay('carrier1')">▶ الحامل 1</button>
          <button onclick="wjzPlay('payload1')">▶ المحمول 1</button>
        </div>
      </div>

      <div style="margin:12px 0;">
        <h4>2️⃣ المقطع الثاني</h4>
        <input id="wjz-seg2-input" placeholder="مثال: قح" style="width:100%; padding:10px; border-radius:8px; background:#1e293b; color:white; border:1px solid #475569;">
        <div style="margin-top:8px;">
          <button onclick="wjzFetchSegment(2)">📥 استدعاء</button>
          <button onclick="wjzRecordSegment(2)">🎙 تسجيل</button>
          <button onclick="wjzSplitSegment(2)">✂️ فصل موزون</button>
          <button onclick="wjzPlay('seg2')">▶ المقطع 2</button>
          <button onclick="wjzPlay('carrier2')">▶ الحامل 2</button>
          <button onclick="wjzPlay('payload2')">▶ المحمول 2</button>
        </div>
      </div>

      <hr style="border-color:#1f2937;">

      <h4>⚙️ إعدادات منطقة الاشتباك</h4>

      <label>قبل نقطة الفصل ms</label>
      <input id="wjz-before" type="number" value="25" style="width:100%; margin:4px 0 8px;">

      <label>بعد نقطة الفصل ms</label>
      <input id="wjz-after" type="number" value="35" style="width:100%; margin:4px 0 8px;">

      <label>قوة تخفيض ذيل الحامل 0.1 - 1</label>
      <input id="wjz-tail" type="number" value="0.55" step="0.05" style="width:100%; margin:4px 0 8px;">

      <label>انحناء التدرج</label>
      <input id="wjz-curve" type="number" value="1.7" step="0.1" style="width:100%; margin:4px 0 8px;">

      <div style="margin-top:14px; text-align:center;">
        <button onclick="wjzMerge(1,2)" style="background:#7c3aed; color:white; padding:12px; border-radius:10px;">🧩 دمج حامل 1 + محمول 2</button>
        <button onclick="wjzMerge(2,1)" style="background:#c026d3; color:white; padding:12px; border-radius:10px;">🧩 دمج حامل 2 + محمول 1</button>
      </div>

      <div style="margin-top:10px; text-align:center;">
        <button onclick="wjzPlay('result12')">▶ تشغيل الناتج الأول</button>
        <button onclick="wjzPlay('result21')">▶ تشغيل الناتج الثاني</button>
      </div>

      <div id="wjz-status" style="background:#111827; color:#e5e7eb; padding:12px; border-radius:10px; margin-top:16px; line-height:1.8;">
        مستعد لبدء اختبار منطقة الاشتباك الموزونة.
      </div>
    </div>
  `;
}

function wjzStatus(msg) {
  const box = document.getElementById("wjz-status");
  if (box) box.innerHTML = msg;
}

function wjzOptions() {
  return {
    before: Math.max(0.005, Number(document.getElementById("wjz-before")?.value || 25) / 1000),
    after: Math.max(0.005, Number(document.getElementById("wjz-after")?.value || 35) / 1000),
    tail: Math.max(0.1, Math.min(1, Number(document.getElementById("wjz-tail")?.value || 0.55))),
    curve: Math.max(0.5, Number(document.getElementById("wjz-curve")?.value || 1.7))
  };
}

async function wjzFetchSegment(num) {
  const input = document.getElementById(num === 1 ? "wjz-seg1-input" : "wjz-seg2-input");
  const text = input ? input.value.trim() : "";

  if (!text) {
    alert("اكتب المقطع أولاً.");
    return;
  }

  if (typeof resolveDynamicKeys !== "function" || typeof findAuthorizedFileInPacks !== "function") {
    alert("الدوال المرجعية غير متاحة. تأكد من تحميل مختبر الفصل والدمج الأصلي قبل هذا المختبر.");
    return;
  }

  const keys = resolveDynamicKeys(text);
  const file = findAuthorizedFileInPacks(text, keys);

  if (!file) {
    alert("لا يوجد تسجيل معتمد لهذا المقطع.");
    return;
  }

  const blob = await searchAudioBlobSafely(file);

  if (!blob) {
    alert("التسجيل غير موجود في الذاكرة.");
    return;
  }

  if (num === 1) {
    WJZ.seg1Blob = blob;
    WJZ.seg1Text = text;
    WJZ.seg1Split = null;
    WJZ.result12 = null;
  } else {
    WJZ.seg2Blob = blob;
    WJZ.seg2Text = text;
    WJZ.seg2Split = null;
    WJZ.result21 = null;
  }

  wjzStatus("✅ تم استدعاء المقطع " + num + ": <b>" + text + "</b>");
}

async function wjzRecordSegment(num) {
  const input = document.getElementById(num === 1 ? "wjz-seg1-input" : "wjz-seg2-input");
  const text = input ? input.value.trim() : "";

  if (!text) {
    alert("اكتب المقطع أولاً.");
    return;
  }

  if (typeof recordMergeSample !== "function") {
    alert("دالة التسجيل غير متاحة.");
    return;
  }

  alert("سجّل الآن: " + text + "\nسيتم الإيقاف بعد ثانية واحدة.");

  const blob = await recordMergeSample(1000);

  if (!blob) {
    alert("فشل التسجيل.");
    return;
  }

  if (num === 1) {
    WJZ.seg1Blob = blob;
    WJZ.seg1Text = text;
    WJZ.seg1Split = null;
  } else {
    WJZ.seg2Blob = blob;
    WJZ.seg2Text = text;
    WJZ.seg2Split = null;
  }

  if (typeof saveTempAudioToStorage === "function") {
    saveTempAudioToStorage(text + ".wav", blob);
  }

  wjzStatus("✅ تم تسجيل المقطع " + num + ": <b>" + text + "</b>");
}

async function wjzSplitSegment(num) {
  const blob = num === 1 ? WJZ.seg1Blob : WJZ.seg2Blob;
  const text = num === 1 ? WJZ.seg1Text : WJZ.seg2Text;

  if (!blob || !text) {
    alert("استدعِ أو سجّل المقطع أولاً.");
    return;
  }

  try {
    const buffer = await blobToAudioBuffer(blob);
    const keys = resolveDynamicKeys(text);

    if (!keys || keys.length < 2) {
      throw new Error("لا يمكن تحديد الحامل والمحمول من هذا المقطع.");
    }

    const result = detectPayloadBoundaryByIdentity(buffer, {
      carrierKey: keys[0],
      payloadKey: keys[1],
      windowSize: 0.16,
      hopSize: 0.025,
      minStart: 0.06
    });

    if (!result || !result.boundary) {
      throw new Error("لم يتم تحديد نقطة الفصل.");
    }

    const split = wjzExtractWeightedUnits(buffer, result.boundary, wjzOptions());

    if (num === 1) WJZ.seg1Split = split;
    else WJZ.seg2Split = split;

    wjzStatus(
      "✅ تم الفصل الموزون للمقطع " + num + "<br>" +
      "نقطة الفصل: <b>" + result.boundary.toFixed(3) + " ثانية</b><br>" +
      "تم تقليل ذيل الحامل بدل تركه يدخل كاملًا في الدمج."
    );

  } catch (err) {
    console.error(err);
    alert("فشل الفصل الموزون:\n" + err.message);
  }
}

function wjzExtractWeightedUnits(buffer, cutPoint, options) {
  const before = options.before;
  const after = options.after;

  const transStart = Math.max(0, cutPoint - before);
  const transEnd = Math.min(buffer.duration, cutPoint + after);

  const carrierCore = sliceAudioBuffer(buffer, 0, transStart);
  const joinZone = sliceAudioBuffer(buffer, transStart, transEnd);
  const payloadCore = sliceAudioBuffer(buffer, transEnd, buffer.duration);

  const carrierJoin = wjzApplyCurvedEnvelope(joinZone, 1.0, 0.0, options.curve);
  const payloadJoin = wjzApplyCurvedEnvelope(joinZone, 0.0, 1.0, options.curve);

  const guardedCarrierJoin = wjzDampenTail(carrierJoin, options.tail);

  const carrierReady = concatAudioBuffers(carrierCore, guardedCarrierJoin);
  const payloadReady = concatAudioBuffers(payloadJoin, payloadCore);

  return {
    carrierBlob: audioBufferToWavBlob(carrierReady),
    payloadBlob: audioBufferToWavBlob(payloadReady),
    carrierBuffer: carrierReady,
    payloadBuffer: payloadReady,
    cutPoint,
    transStart,
    transEnd
  };
}

function wjzApplyCurvedEnvelope(buffer, startVal, endVal, curvePower) {
  const out = new AudioBuffer({
    length: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate
  });

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = out.getChannelData(ch);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / Math.max(1, buffer.length - 1);
      const curved = Math.pow(t, curvePower);
      const gain = startVal + (endVal - startVal) * curved;
      dst[i] = src[i] * gain;
    }
  }

  return out;
}

function wjzDampenTail(buffer, tailGain) {
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

async function wjzMerge(carrierNum, payloadNum) {
  try {
    const carrierSplit = carrierNum === 1 ? WJZ.seg1Split : WJZ.seg2Split;
    const payloadSplit = payloadNum === 1 ? WJZ.seg1Split : WJZ.seg2Split;

    if (!carrierSplit || !payloadSplit) {
      alert("يجب فصل المقطعين أولاً.");
      return;
    }

    const carrierBuffer = carrierSplit.carrierBuffer;
    const payloadBuffer = payloadSplit.payloadBuffer;

    const overlap = Math.min(
      wjzOptions().before + wjzOptions().after,
      0.055
    );

    const merged = wjzBalancedCrossfade(carrierBuffer, payloadBuffer, overlap, wjzOptions().curve);
    const blob = audioBufferToWavBlob(merged);

    if (carrierNum === 1 && payloadNum === 2) WJZ.result12 = blob;
    else WJZ.result21 = blob;

    wjzStatus(
      "🧩 تم الدمج الموزون:<br>" +
      "حامل " + carrierNum + " + محمول " + payloadNum + "<br>" +
      "هذا الدمج لا يجمع التداخل جمعًا مباشرًا، بل يوازن الطاقة لتقليل الرنين والصدى."
    );

  } catch (err) {
    console.error(err);
    alert("فشل الدمج الموزون:\n" + err.message);
  }
}

function wjzBalancedCrossfade(bufferA, bufferB, overlapSeconds, curvePower) {
  const sampleRate = bufferA.sampleRate;
  const channels = Math.min(bufferA.numberOfChannels, bufferB.numberOfChannels);

  let overlapSamples = Math.floor(overlapSeconds * sampleRate);
  overlapSamples = Math.max(1, Math.min(overlapSamples, bufferA.length, bufferB.length));

  const outputLength = bufferA.length + bufferB.length - overlapSamples;
  const out = new AudioBuffer({
    length: outputLength,
    numberOfChannels: channels,
    sampleRate
  });

  for (let ch = 0; ch < channels; ch++) {
    const a = bufferA.getChannelData(ch);
    const b = bufferB.getChannelData(ch);
    const o = out.getChannelData(ch);

    const keep = bufferA.length - overlapSamples;

    for (let i = 0; i < keep; i++) {
      o[i] = a[i];
    }

    for (let i = 0; i < overlapSamples; i++) {
      const t = i / Math.max(1, overlapSamples - 1);

      const fadeOut = Math.pow(1 - t, curvePower);
      const fadeIn = Math.pow(t, curvePower);

      const normalizer = Math.max(0.0001, fadeOut + fadeIn);

      o[keep + i] =
        ((a[keep + i] || 0) * fadeOut + (b[i] || 0) * fadeIn) / normalizer;
    }

    for (let i = overlapSamples; i < bufferB.length; i++) {
      o[keep + i] = b[i];
    }
  }

  return out;
}

function wjzPlay(target) {
  let blob = null;
  let label = target;

  if (target === "seg1") blob = WJZ.seg1Blob;
  if (target === "seg2") blob = WJZ.seg2Blob;

  if (target === "carrier1" && WJZ.seg1Split) blob = WJZ.seg1Split.carrierBlob;
  if (target === "payload1" && WJZ.seg1Split) blob = WJZ.seg1Split.payloadBlob;

  if (target === "carrier2" && WJZ.seg2Split) blob = WJZ.seg2Split.carrierBlob;
  if (target === "payload2" && WJZ.seg2Split) blob = WJZ.seg2Split.payloadBlob;

  if (target === "result12") blob = WJZ.result12;
  if (target === "result21") blob = WJZ.result21;

  if (!blob) {
    alert("الصوت غير متوفر: " + label);
    return;
  }

  if (typeof playBlob === "function") {
    playBlob(blob, label);
  } else {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  }
}
