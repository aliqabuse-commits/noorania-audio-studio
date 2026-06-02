// ================================
// ba-final-identity-engine.js
// تثبيت الهوية النهائية للباء
// ================================

console.log("🧾 ba-final-identity-engine.js جاهز");

function runBaFinalIdentityEngine() {

  try {

    const onsetSaved = localStorage.getItem("ba_burst_onset_result");
    const lockSaved = localStorage.getItem("ba_locked_payload_result");
    const purifiedSaved = localStorage.getItem("ba_purified_payload_result");
    const coreSaved = localStorage.getItem("ba_pure_core");
    const sealSaved = localStorage.getItem("ba_spectral_seal");

    if (!onsetSaved) {
      alert("شغّل أولًا: 🔥 كشف بداية الانفجار");
      return;
    }

    if (!lockSaved) {
      alert("شغّل أولًا: 🎯 تثبيت المحمول الحقيقي");
      return;
    }

    if (!purifiedSaved) {
      alert("شغّل أولًا: 🧼 تنظيف المحمول");
      return;
    }

    if (!coreSaved) {
      alert("شغّل أولًا: 🧬 تنقية النواة المشتركة");
      return;
    }

    if (!sealSaved) {
      alert("شغّل أولًا: 🌈 بناء الختم الطيفي للباء");
      return;
    }

    const onset = JSON.parse(onsetSaved);
    const lock = JSON.parse(lockSaved);
    const purified = JSON.parse(purifiedSaved);
    const core = JSON.parse(coreSaved);
    const seal = JSON.parse(sealSaved);

    const identity = {
      id: "ba_sukoon_master_identity",
      phoneme: "بْ",
      letterKey: "ba",
      letterName: "باء",
      type: "voiced_bilabial_stop",

      method: "Ba Master Identity V1",

      timing: {
        onsetTime: onset.onsetTime,
        onsetPeak: onset.peakTime,
        onsetConfidence: onset.confidence,

        lockedPayloadStart: lock.start,
        lockedPayloadEnd: lock.end,
        lockedPayloadDuration: lock.duration,
        lockedPayloadPeak: lock.peak,
        lockedPayloadConfidence: lock.confidence,

        purifiedPayloadStart: purified.start,
        purifiedPayloadEnd: purified.end,
        purifiedPayloadDuration: purified.duration,
        purifiedPayloadPeak: purified.peak,
        purity: purified.purity
      },

      spectralSeal: {
        centroid: seal.averageCentroid,
        spread: seal.averageSpread,
        confidence: seal.confidence,
        colorLabel: seal.colorLabel
      },

      pureCore: {
        bandCount: core.bandCount,
        bands: core.bands
      },

      acceptanceRules: {
        minOnsetConfidence: 0.70,
        minPayloadConfidence: 0.05,
        minPurity: 0.04,
        expectedPayloadDurationRange: {
          min: 0.010,
          max: 0.050
        },
        requiredCoreBandsAtLeast: Math.max(2, Math.ceil(core.bandCount * 0.4))
      },

      notes: [
        "هذه هوية عملية أولية للباء الساكنة وليست النموذج النهائي لكل الحروف.",
        "تمثل الهوية: بداية الانفجار، المحمول المثبت، المحمول المنظف، النواة الطيفية، والختم الطيفي.",
        "تُستخدم هذه الهوية لاحقًا للمطابقة والتقييم، وليس لمواصلة التشريح اللامتناهي."
      ],

      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      "ba_master_identity",
      JSON.stringify(identity, null, 2)
    );

    renderBaFinalIdentityReport(identity);

    alert(
      "تم تثبيت الهوية النهائية للباء\n" +
      "النطاقات: " + identity.pureCore.bandCount + "\n" +
      "مدة المحمول النقي: " + identity.timing.purifiedPayloadDuration
    );

  } catch (err) {

    console.error("❌ فشل تثبيت هوية الباء", err);

    alert(
      "فشل تثبيت الهوية النهائية للباء:\n" +
      err.message
    );
  }
}

function renderBaFinalIdentityReport(identity) {

  let box = document.getElementById("ba-final-identity-report-box");

  if (!box) {

    box = document.createElement("div");
    box.id = "ba-final-identity-report-box";

    box.style.background = "#020617";
    box.style.color = "white";
    box.style.padding = "14px";
    box.style.margin = "12px 0";
    box.style.borderRadius = "14px";
    box.style.fontSize = "13px";
    box.style.border = "1px solid #22c55e";

    const target =
      document.getElementById("payload-purifier-report-box") ||
      document.getElementById("unitList") ||
      document.body;

    if (target === document.body) {
      document.body.appendChild(box);
    } else {
      target.parentNode.insertBefore(box, target);
    }
  }

  box.innerHTML = `
    <div style="font-size:19px;font-weight:bold;color:#22c55e;margin-bottom:10px;">
      🧾 الهوية النهائية للباء
    </div>

    <div>الحرف: <b>${identity.phoneme}</b></div>
    <div>النوع: <b>${identity.type}</b></div>

    <hr style="border-color:#1f2937;">

    <div>بداية الانفجار: <b>${identity.timing.onsetTime}</b></div>
    <div>ذروة الانفجار: <b>${identity.timing.onsetPeak}</b></div>
    <div>ثقة الانفجار: <b>${identity.timing.onsetConfidence}</b></div>

    <hr style="border-color:#1f2937;">

    <div>المحمول المثبت: <b>${identity.timing.lockedPayloadStart}</b> → <b>${identity.timing.lockedPayloadEnd}</b></div>
    <div>المحمول المنظف: <b>${identity.timing.purifiedPayloadStart}</b> → <b>${identity.timing.purifiedPayloadEnd}</b></div>
    <div>مدة المحمول النقي: <b>${identity.timing.purifiedPayloadDuration}</b></div>
    <div>النقاء: <b>${identity.timing.purity}</b></div>

    <hr style="border-color:#1f2937;">

    <div>مركز الطيف: <b>${identity.spectralSeal.centroid.toFixed(2)} Hz</b></div>
    <div>انتشار الطيف: <b>${identity.spectralSeal.spread.toFixed(2)}</b></div>
    <div>اللون الطيفي: <b>${identity.spectralSeal.colorLabel}</b></div>

    <hr style="border-color:#1f2937;">

    <div style="font-weight:bold;color:#38bdf8;margin:8px 0;">
      النواة النقية
    </div>

    ${identity.pureCore.bands.map(function (b) {
      return `
        <div style="background:#064e3b;padding:7px;margin:5px 0;border-radius:8px;">
          ${b.from}Hz → ${b.to}Hz
          | المركز: ${b.center}Hz
          | الثبات: ${Math.round(b.stability * 100)}%
          | القوة: ${b.power}
        </div>
      `;
    }).join("")}
  `;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}
