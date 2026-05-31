// ================================ // operation-labs/weighted-join-zone.js // مختبر منطقة الاشتباك الموزون — V1 // امتداد لمختبر الفصل والدمج الحالي // يضيف اختبار منطقة الاشتباك الموزون دون المساس بالمختبر السابق // ================================

console.log("⚖️ weighted-join-zone.js جاهز V1 — مختبر منطقة الاشتباك الموزون");

// ====================================== // حالة المختبر المستقلة // لا تستخدم متغيرات مختبر الفصل والدمج القديم حتى لا تتأثر نتائجه // ====================================== const WJZ_STATE = { seg1Blob: null, seg2Blob: null,

seg1Text: "", seg2Text: "",

seg1Split: null, seg2Split: null,

result12: null, result21: null };

// ====================================== // 1) بناء واجهة مختبر منطقة الاشتباك الموزون // ====================================== function renderWeightedJoinZoneLab() { const root = document.getElementById("weighted-join-zone-root");

if (!root) { alert("لم يتم العثور على جذر واجهة مختبر منطقة الاشتباك الموزون."); return; }

root.innerHTML = ` <h2>⚖️ مختبر منطقة الاشتباك الموزون</h2>

<p style="line-height:1.8; color:#cbd5e1;">
  هذا المختبر هو امتداد لمختبر الفصل والدمج الحالي.
  يحتفظ بفكرة تسجيل مقطعين، وفصل الحامل والمحمول، ثم الدمج التبادلي،
  لكنه يضيف طبقة اختبار جديدة: <b style="color:#a3e635;">منطقة الاشتباك الموزون</b>.
</p>

<p style="line-height:1.8; color:#94a3b8;">
  الهدف هو دراسة الرنين أو الصدى أو الذيل الصوتي الذي يظهر أحيانًا عند الدمج،
  وذلك عبر التحكم في وزن أثر الحامل وأثر المحمول داخل منطقة الانتقال.
</p>

<div style="background:#08111f; border:1px solid #38bdf8; border-radius:14px; padding:18px; margin:12px 0;">
  <h3 style="color:#38bdf8;margin-top:0;">1️⃣ المقطع الأول</h3>

  <input
    id="wjz-seg1-input"
    placeholder="مثال: بص"
    style="width:100%; padding:10px; border-radius:8px; border:1px solid #475569; background:#1e293b; color:white; font-size:16px; box-sizing:border-box;"
  >

  <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
    <button onclick="wjzFetchSegment(1)">📥 استدعاء</button>
    <button onclick="wjzRecordSegment(1)">🎙 تسجيل</button>
    <button onclick="wjzSplitSegment(1)">✂️ فصل بمنطقة اشتباك موزون</button>
    <button onclick="wjzPlay('seg1')">▶ المقطع 1</button>
    <button onclick="wjzPlay('carrier1')">▶ الحامل 1</button>
    <button onclick="wjzPlay('payload1')">▶ المحمول 1</button>
  </div>
</div>

<div style="background:#08111f; border:1px solid #a3e635; border-radius:14px; padding:18px; margin:12px 0;">
  <h3 style="color:#a3e635;margin-top:0;">2️⃣ المقطع الثاني</h3>

  <input
    id="wjz-seg2-input"
    placeholder="مثال: قح"
    style="width:100%; padding:10px; border-radius:8px; border:1px solid #475569; background:#1e293b; color:white; font-size:16px; box-sizing:border-box;"
  >

  <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
    <button onclick="wjzFetchSegment(2)">📥 استدعاء</button>
    <button onclick="wjzRecordSegment(2)">🎙 تسجيل</button>
    <button onclick="wjzSplitSegment(2)">✂️ فصل بمنطقة اشتباك موزون</button>
    <button onclick="wjzPlay('seg2')">▶ المقطع 2</button>
    <button onclick="wjzPlay('carrier2')">▶ الحامل 2</button>
    <button onclick="wjzPlay('payload2')">▶ المحمول 2</button>
  </div>
</div>

<div style="background:#111827; border:1px solid #facc15; border-radius:14px; padding:18px; margin:12px 0;">
  <h3 style="color:#facc15;margin-top:0;">⚙️ إعدادات منطقة الاشتباك الموزون</h3>

  <p style="line-height:1.8; color:#cbd5e1;">
    هذه الإعدادات لا تغيّر المختبر السابق، بل تتحكم فقط في هذه التجربة الجديدة.
  </p>

  <label>منطقة ما قبل نقطة الفصل بالمللي ثانية</label>
  <input id="wjz-before-ms" type="number" value="25" min="5" max="80" style="width:100%; padding:8px; margin:5px 0 10px; box-sizing:border-box;">

  <label>منطقة ما بعد نقطة الفصل بالمللي ثانية</label>
  <input id="wjz-after-ms" type="number" value="35" min="5" max="90" style="width:100%; padding:8px; margin:5px 0 10px; box-sizing:border-box;">

  <label>تخفيض ذيل الحامل — من 0.1 إلى 1</label>
  <input id="wjz-tail-gain" type="number" value="0.55" step="0.05" min="0.1" max="1" style="width:100%; padding:8px; margin:5px 0 10px; box-sizing:border-box;">

  <label>انحناء الانتقال — كلما زاد صار الانتقال أهدأ</label>
  <input id="wjz-curve-power" type="number" value="1.7" step="0.1" min="0.5" max="4" style="width:100%; padding:8px; margin:5px 0 10px; box-sizing:border-box;">
</div>

<div style="background:#1e293b; border:1px solid #a855f7; border-radius:14px; padding:18px; margin:12px 0;">
  <h3 style="color:#d8b4fe;margin-top:0;text-align:center;">🧩 الدمج بمنطقة الاشتباك الموزون</h3>

  <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
    <button onclick="wjzMerge(1,2)" style="background:#7c3aed;color:white;padding:12px;border-radius:10px;">
      🧩 دمج: حامل 1 + محمول 2
    </button>

    <button onclick="wjzMerge(2,1)" style="background:#c026d3;color:white;padding:12px;border-radius:10px;">
      🧩 دمج: حامل 2 + محمول 1
    </button>
  </div>

  <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:12px;">
    <button onclick="wjzPlay('result12')">▶ تشغيل الناتج 1</button>
    <button onclick="wjzPlay('result21')">▶ تشغيل الناتج 2</button>
  </div>
</div>

<div id="wjz-status" style="background:#111827; color:#e5e7eb; border-radius:12px; border:1px solid #1f2937; padding:16px; margin:20px 0; line-height:1.8; min-height:60px;">
  مستعد لبدء تجربة منطقة الاشتباك الموزون.
</div>

<button onclick="closeWeightedJoinZoneView()">🔙 العودة لغرفة التجارب الإدراكية</button>

`;

wjzRestoreStateToInputs(); }

// ====================================== // 2) أدوات الحالة والإعدادات // ====================================== function wjzStatus(message) { const box = document.getElementById("wjz-status"); if (box) box.innerHTML = message; }

function wjzGetOptions() { const beforeMs = Number(document.getElementById("wjz-before-ms")?.value || 25); const afterMs = Number(document.getElementById("wjz-after-ms")?.value || 35); const tailGain = Number(document.getElementById("wjz-tail-gain")?.value || 0.55); const curvePower = Number(document.getElementById("wjz-curve-power")?.value || 1.7);

return { before: Math.max(0.005, Math.min(0.120, beforeMs / 1000)), after: Math.max(0.005, Math.min(0.140, afterMs / 1000)), tailGain: Math.max(0.1, Math.min(1, tailGain)), curvePower: Math.max(0.5, Math.min(5, curvePower)) }; }

function wjzSaveState() { try { localStorage.setItem("wjz_seg1_text", WJZ_STATE.seg1Text || ""); localStorage.setItem("wjz_seg2_text", WJZ_STATE.seg2Text || "");

const status = document.getElementById("wjz-status");
localStorage.setItem("wjz_last_status", status ? status.innerHTML : "");

} catch (err) { console.warn("تعذر حفظ حالة مختبر منطقة الاشتباك:", err); } }

function wjzRestoreStateToInputs() { const seg1 = localStorage.getItem("wjz_seg1_text") || WJZ_STATE.seg1Text || ""; const seg2 = localStorage.getItem("wjz_seg2_text") || WJZ_STATE.seg2Text || "";

const input1 = document.getElementById("wjz-seg1-input"); const input2 = document.getElementById("wjz-seg2-input");

if (input1) input1.value = seg1; if (input2) input2.value = seg2;

WJZ_STATE.seg1Text = seg1; WJZ_STATE.seg2Text = seg2;

const lastStatus = localStorage.getItem("wjz_last_status"); if (lastStatus) wjzStatus(lastStatus); }

// ====================================== // 3) فحص توفر أدوات مختبر الفصل والدمج السابق // ====================================== function wjzRequireTools() { const required = [ "resolveDynamicKeys", "findAuthorizedFileInPacks", "searchAudioBlobSafely", "saveTempAudioToStorage", "recordMergeSample", "playBlob", "blobToAudioBuffer", "audioBufferToWavBlob", "sliceAudioBuffer", "concatAudioBuffers", "detectPayloadBoundaryByIdentity" ];

const missing = required.filter(function (name) { return typeof window[name] !== "function"; });

if (missing.length) { alert( "بعض أدوات مختبر الفصل والدمج غير محمّلة:\n\n" + missing.join("\n") + "\n\nتأكد أن operation-labs-index.js يحمّل phoneme-merge-split-engine.js أولًا." ); return false; }

return true; }

// ====================================== // 4) استدعاء مقطع من الحقائب أو الذاكرة // ====================================== async function wjzFetchSegment(num) { if (!wjzRequireTools()) return;

const input = document.getElementById(num === 1 ? "wjz-seg1-input" : "wjz-seg2-input"); const text = input ? input.value.trim() : "";

if (!text) { alert("اكتب المقطع أولًا."); return; }

const keys = resolveDynamicKeys(text); const file = findAuthorizedFileInPacks(text, keys) || (text + ".wav"); const blob = await searchAudioBlobSafely(file);

if (!blob) { alert("لم يتم العثور على تسجيل لهذا المقطع: " + text); return; }

if (num === 1) { WJZ_STATE.seg1Blob = blob; WJZ_STATE.seg1Text = text; WJZ_STATE.seg1Split = null; WJZ_STATE.result12 = null; } else { WJZ_STATE.seg2Blob = blob; WJZ_STATE.seg2Text = text; WJZ_STATE.seg2Split = null; WJZ_STATE.result21 = null; }

wjzSaveState(); wjzStatus("✅ تم استدعاء المقطع " + num + ": <b>" + text + "</b>"); }

// ====================================== // 5) تسجيل مقطع جديد داخل هذا المختبر // ====================================== async function wjzRecordSegment(num) { if (!wjzRequireTools()) return;

const input = document.getElementById(num === 1 ? "wjz-seg1-input" : "wjz-seg2-input"); const text = input ? input.value.trim() : "";

if (!text) { alert("اكتب المقطع أولًا."); return; }

alert("سجّل الآن: " + text + "\nسيتم الإيقاف بعد ثانية واحدة."); wjzStatus("🎙 جاري تسجيل المقطع " + num + "...");

const blob = await recordMergeSample(1000);

if (!blob) { wjzStatus("❌ فشل التسجيل."); return; }

saveTempAudioToStorage(text + ".wav", blob);

if (num === 1) { WJZ_STATE.seg1Blob = blob; WJZ_STATE.seg1Text = text; WJZ_STATE.seg1Split = null; WJZ_STATE.result12 = null; } else { WJZ_STATE.seg2Blob = blob; WJZ_STATE.seg2Text = text; WJZ_STATE.seg2Split = null; WJZ_STATE.result21 = null; }

wjzSaveState(); wjzStatus("✅ تم تسجيل المقطع " + num + ": <b>" + text + "</b><br>تم حفظه مؤقتًا باسم: <b>" + text + ".wav</b>"); }

// ====================================== // 6) الفصل بإضافة منطقة الاشتباك الموزون // ====================================== async function wjzSplitSegment(num) { if (!wjzRequireTools()) return;

const blob = num === 1 ? WJZ_STATE.seg1Blob : WJZ_STATE.seg2Blob; const text = num === 1 ? WJZ_STATE.seg1Text : WJZ_STATE.seg2Text;

if (!blob || !text) { alert("استدعِ أو سجّل المقطع أولًا."); return; }

try { const cleanText = normalizeArabic(text);

if (cleanText.length < 2) {
  throw new Error("أدخل مقطعًا من حرفين مثل: بص، قح، بح.");
}

if (cleanText[0] === cleanText[1]) {
  throw new Error("هذا اختبار متقدم لأن الحامل والمحمول من نفس الهوية. نؤجله الآن.");
}

const keys = resolveDynamicKeys(text);

if (!keys || keys.length < 2) {
  throw new Error("لم يتم العثور على مفتاحي الحامل والمحمول في الحقائب.");
}

const buffer = await blobToAudioBuffer(blob);

const result = detectPayloadBoundaryByIdentity(buffer, {
  carrierKey: keys[0],
  payloadKey: keys[1],
  windowSize: 0.16,
  hopSize: 0.025,
  minStart: 0.06
});

if (!result || !result.boundary) {
  throw new Error("لم يتم تحديد نقطة الفصل إدراكيًا.");
}

const split = wjzBuildWeightedJoinUnits(buffer, result.boundary, wjzGetOptions());

if (num === 1) {
  WJZ_STATE.seg1Split = split;
} else {
  WJZ_STATE.seg2Split = split;
}

wjzStatus(
  "✅ تم فصل المقطع " + num + " بمنطقة اشتباك موزون:<br>" +
  "نقطة الفصل: <b>" + result.boundary.toFixed(3) + " ثانية</b><br>" +
  "منطقة الاشتباك: <b>" + split.transStart.toFixed(3) + "s → " + split.transEnd.toFixed(3) + "s</b><br>" +
  "تم بناء حامل ومحمول مع تخفيف ذيل الحامل ووزن الانتقال."
);

} catch (err) { console.error("❌ فشل الفصل بمنطقة الاشتباك الموزون", err); alert("فشل الفصل بمنطقة الاشتباك الموزون:\n" + err.message); } }

function wjzBuildWeightedJoinUnits(buffer, cutPoint, options) { const transStart = Math.max(0, cutPoint - options.before); const transEnd = Math.min(buffer.duration, cutPoint + options.after);

const carrierCore = sliceAudioBuffer(buffer, 0, transStart); const joinZone = sliceAudioBuffer(buffer, transStart, transEnd); const payloadCore = sliceAudioBuffer(buffer, transEnd, buffer.duration);

const carrierJoin = wjzApplyCurvedEnvelope(joinZone, 1.0, 0.0, options.curvePower); const payloadJoin = wjzApplyCurvedEnvelope(joinZone, 0.0, 1.0, options.curvePower);

// الفرق الأساسي عن المختبر السابق: // لا نترك نهاية الحامل تدخل بكامل أثرها، بل نخفف الذيل لتقليل الرنين. const guardedCarrierJoin = wjzDampenCarrierTail(carrierJoin, options.tailGain);

const carrierReady = concatAudioBuffers(carrierCore, guardedCarrierJoin); const payloadReady = concatAudioBuffers(payloadJoin, payloadCore);

return { cutPoint, transStart, transEnd, carrierBuffer: carrierReady, payloadBuffer: payloadReady, carrierBlob: audioBufferToWavBlob(carrierReady), payloadBlob: audioBufferToWavBlob(payloadReady) }; }

function wjzApplyCurvedEnvelope(buffer, startVal, endVal, curvePower) { const out = new AudioBuffer({ length: buffer.length, numberOfChannels: buffer.numberOfChannels, sampleRate: buffer.sampleRate });

for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const src = buffer.getChannelData(ch); const dst = out.getChannelData(ch);

for (let i = 0; i < buffer.length; i++) {
  const t = i / Math.max(1, buffer.length - 1);
  const curved = Math.pow(t, curvePower);
  const gain = startVal + (endVal - startVal) * curved;
  dst[i] = src[i] * gain;
}

}

return out; }

function wjzDampenCarrierTail(buffer, tailGain) { const out = new AudioBuffer({ length: buffer.length, numberOfChannels: buffer.numberOfChannels, sampleRate: buffer.sampleRate });

const tailSamples = Math.floor(buffer.sampleRate * 0.018);

for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const src = buffer.getChannelData(ch); const dst = out.getChannelData(ch);

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

return out; }

// ====================================== // 7) الدمج بمنطقة اشتباك موزون // ====================================== async function wjzMerge(carrierNum, payloadNum) { if (!wjzRequireTools()) return;

try { const carrierSplit = carrierNum === 1 ? WJZ_STATE.seg1Split : WJZ_STATE.seg2Split; const payloadSplit = payloadNum === 1 ? WJZ_STATE.seg1Split : WJZ_STATE.seg2Split;

if (!carrierSplit || !payloadSplit) {
  alert("يجب فصل المقطعين أولًا.");
  return;
}

const options = wjzGetOptions();

// نحد التداخل هنا حتى لا يصبح طويلًا فيحدث صدى أو تضخم.
const overlap = Math.min(options.before + options.after, 0.055);

const mergedBuffer = wjzBalancedCrossfade(
  carrierSplit.carrierBuffer,
  payloadSplit.payloadBuffer,
  overlap,
  options.curvePower
);

const blob = audioBufferToWavBlob(mergedBuffer);

if (carrierNum === 1 && payloadNum === 2) {
  WJZ_STATE.result12 = blob;
} else {
  WJZ_STATE.result21 = blob;
}

wjzStatus(
  "🧩 تم الدمج بمنطقة الاشتباك الموزون:<br>" +
  "حامل " + carrierNum + " + محمول " + payloadNum + "<br>" +
  "المعالجة: تداخل موزون + تخفيف ذيل الحامل + موازنة طاقة الانتقال."
);

} catch (err) { console.error("❌ فشل الدمج بمنطقة الاشتباك الموزون", err); alert("فشل الدمج بمنطقة الاشتباك الموزون:\n" + err.message); } }

function wjzBalancedCrossfade(bufferA, bufferB, overlapSeconds, curvePower) { const sampleRate = bufferA.sampleRate; const channels = Math.min(bufferA.numberOfChannels, bufferB.numberOfChannels);

let overlapSamples = Math.floor(overlapSeconds * sampleRate); overlapSamples = Math.max(1, Math.min(overlapSamples, bufferA.length, bufferB.length));

const outputLength = bufferA.length + bufferB.length - overlapSamples; const out = new AudioBuffer({ length: outputLength, numberOfChannels: channels, sampleRate });

for (let ch = 0; ch < channels; ch++) { const a = bufferA.getChannelData(ch); const b = bufferB.getChannelData(ch); const o = out.getChannelData(ch);

const keep = bufferA.length - overlapSamples;

for (let i = 0; i < keep; i++) {
  o[i] = a[i];
}

for (let i = 0; i < overlapSamples; i++) {
  const t = i / Math.max(1, overlapSamples - 1);

  const fadeOut = Math.pow(1 - t, curvePower);
  const fadeIn = Math.pow(t, curvePower);

  // موازنة حتى لا تتضاعف الطاقة في منطقة التداخل
  const normalizer = Math.max(0.0001, fadeOut + fadeIn);

  o[keep + i] =
    ((a[keep + i] || 0) * fadeOut +
     (b[i] || 0) * fadeIn) / normalizer;
}

for (let i = overlapSamples; i < bufferB.length; i++) {
  o[keep + i] = b[i];
}

}

return out; }

// ====================================== // 8) تشغيل الأصوات // ====================================== function wjzPlay(target) { if (!wjzRequireTools()) return;

let blob = null; let label = target;

if (target === "seg1") { blob = WJZ_STATE.seg1Blob; label = "المقطع 1"; }

if (target === "seg2") { blob = WJZ_STATE.seg2Blob; label = "المقطع 2"; }

if (target === "carrier1" && WJZ_STATE.seg1Split) { blob = WJZ_STATE.seg1Split.carrierBlob; label = "الحامل 1 — منطقة اشتباك موزون"; }

if (target === "payload1" && WJZ_STATE.seg1Split) { blob = WJZ_STATE.seg1Split.payloadBlob; label = "المحمول 1 — منطقة اشتباك موزون"; }

if (target === "carrier2" && WJZ_STATE.seg2Split) { blob = WJZ_STATE.seg2Split.carrierBlob; label = "الحامل 2 — منطقة اشتباك موزون"; }

if (target === "payload2" && WJZ_STATE.seg2Split) { blob = WJZ_STATE.seg2Split.payloadBlob; label = "المحمول 2 — منطقة اشتباك موزون"; }

if (target === "result12") { blob = WJZ_STATE.result12; label = "الناتج 1: حامل 1 + محمول 2"; }

if (target === "result21") { blob = WJZ_STATE.result21; label = "الناتج 2: حامل 2 + محمول 1"; }

if (!blob) { alert("الصوت غير متوفر: " + label); return; }

playBlob(blob, label); }

// ====================================== // 9) تصدير دوال الواجهة // ====================================== window.renderWeightedJoinZoneLab = renderWeightedJoinZoneLab; window.wjzFetchSegment = wjzFetchSegment; window.wjzRecordSegment = wjzRecordSegment; window.wjzSplitSegment = wjzSplitSegment; window.wjzMerge = wjzMerge; window.wjzPlay = wjzPlay;

console.log("⚖️ مختبر منطقة الاشتباك الموزون جاهز للتجربة V1");
