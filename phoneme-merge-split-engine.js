// ================================
// phoneme-merge-split-engine.js
// محرك الفصل والدمج الصوتي — V1
// ================================

console.log("🧩 phoneme-merge-split-engine.js جاهز V1");

let baseSegmentBlob = null;        // بَصْ
let replacementBlob = null;        // قَ
let extractedPayloadBlob = null;   // صْ
let mergedSegmentBlob = null;      // قَصْ

async function recordBaseSegment() {
  alert("سجّل الآن المقطع: بَصْ");

  baseSegmentBlob = await recordMergeSample();

  if (!baseSegmentBlob) {
    alert("فشل تسجيل المقطع بَصْ");
    return;
  }

  alert("✅ تم تسجيل المقطع بَصْ");
}

async function recordCarrierReplacement() {
  alert("سجّل الآن الحرف البديل: قَ");

  replacementBlob = await recordMergeSample();

  if (!replacementBlob) {
    alert("فشل تسجيل الحرف قَ");
    return;
  }

  alert("✅ تم تسجيل الحرف قَ");
}

async function recordMergeSample() {
  return new Promise(function (resolve) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = function (e) {
          chunks.push(e.data);
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
        }, 1800);
      })
      .catch(function () {
        resolve(null);
      });
  });
}
