// ================================
// app.js
// غرفة العمليات الصوتية — قائد التشغيل
// ================================

console.log("🧭 app.js جاهز — قائد غرفة العمليات الصوتية يعمل");


// =====================================
// 1️⃣ القوائم الرئيسية
// =====================================

const categories = [
  { title: "حقيبة الباء الساكنة" },
  { title: "أسماء الحروف الهجائية" },
  { title: "الحروف المتحركة" },
  { title: "أسماء الحروف النورانية" },
  { title: "الحروف الساكنة" },
  { title: "التنوين" },
  { title: "المد واللين" },
  { title: "الأصوات النورانية" }
];


// =====================================
// 2️⃣ حالة الواجهة الحالية
// =====================================

let currentCategory = "";
let currentUnits = [];
let index = 0;

function getUnitKey(unit) {
  return unit.file;
}


// =====================================
// 3️⃣ اعتماد الوحدة وحفظ الجينوم
// =====================================

async function approveAndNext() {

  if (!currentUnits.length) return;

  const unit = currentUnits[index];
  const key = getUnitKey(unit);

  const currentBlob = getCurrentAudioBlob();

  if (!currentBlob && !hasWaveform()) {
    alert("سجّل الوحدة أولاً");
    return;
  }

  if (!hasGenomeRegions()) {
    alert("لم يتم تعريف مناطق الجينوم الأربع");
    return;
  }

  if (currentBlob) {
    saveAudio(key, currentBlob);
  }

  const genome = buildGenome(key);

  if (!genome) {
    alert("تعذر بناء ملف الجينوم");
    return;
  }

  saveGenome(key, genome);

  unitStatus[key] = "approved";
  saveUnitStatus();

  clearCurrentAudioBlob();

  index++;

  if (index >= currentUnits.length) {
    index = 0;
  }

  updateUI();

}


// =====================================
// 4️⃣ إلغاء اعتماد الوحدة
// =====================================

function rejectUnit() {

  if (!currentUnits.length) return;

  const unit = currentUnits[index];
  const key = getUnitKey(unit);

  delete unitStatus[key];
  saveUnitStatus();

  deleteAudio(key);
  deleteGenome(key);

  localStorage.removeItem(key + ".profile.json");

  clearCurrentAudioBlob();
  destroyWaveform();

  updateUI();

}


// =====================================
// 5️⃣ تحديث الواجهة
// =====================================

function updateUI() {

  const unit = currentUnits[index];

  if (!unit) return;

  document.getElementById("unit").innerText = unit.text;
  document.getElementById("filename").innerText = unit.file;
  document.getElementById("counter").innerText =
    (index + 1) + " / " + currentUnits.length;

  getAudio(unit.file, function (blob) {

    if (blob) {
      initWaveform(blob);
    } else {
      destroyWaveform();
    }

  });

  renderUnitList();

}


// =====================================
// 6️⃣ الصفحة الرئيسية والتنقل
// =====================================

function goHome() {

  document.getElementById("recordView").style.display = "none";
  document.getElementById("homeView").style.display = "block";

}


function renderHome() {

  const list = document.getElementById("categoryList");

  if (!list) return;

  list.innerHTML = "";

  categories.forEach(function (cat) {

    const btn = document.createElement("button");

    btn.innerText = cat.title;
    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.width = "90%";

    btn.onclick = function () {

      currentCategory = cat.title;
      currentUnits = allUnits[cat.title] || [];
      index = 0;

      document.getElementById("homeView").style.display = "none";
      document.getElementById("recordView").style.display = "block";

      updateUI();

    };

    list.appendChild(btn);

  });

}


function nextUnit() {

  if (!currentUnits.length) return;

  index = (index + 1) % currentUnits.length;

  updateUI();

}


function prevUnit() {

  if (!currentUnits.length) return;

  index = (index - 1 + currentUnits.length) % currentUnits.length;

  updateUI();

}


// =====================================
// 7️⃣ قائمة الوحدات
// =====================================

function renderUnitList() {

  const list = document.getElementById("unitList");

  if (!list) return;

  list.innerHTML = "";

  currentUnits.forEach(function (unit, i) {

    const btn = document.createElement("button");

    const key = getUnitKey(unit);

    btn.innerText =
      (unitStatus[key] === "approved" ? "✅ " : "⏳ ") + unit.text;

    btn.style.display = "block";
    btn.style.margin = "5px auto";
    btn.style.width = "90%";

    if (i === index) {
      btn.style.background = "#cfe8ff";
    }

    btn.onclick = function () {
      index = i;
      updateUI();
    };

    list.appendChild(btn);

  });

}


// =====================================
// 8️⃣ التصدير السيادي ZIP
// =====================================

async function exportApproved() {

  if (!currentUnits.length) return;

  const approvedUnits = currentUnits.filter(function (unit) {
    return unitStatus[getUnitKey(unit)] === "approved";
  });

  if (!approvedUnits.length) {
    alert("لا توجد وحدات معتمدة");
    return;
  }

  const zip = new JSZip();

  const manifest = [];

  for (let unit of approvedUnits) {

    const key = getUnitKey(unit);

    const storedAudio = await new Promise(function (resolve) {
      getAudio(key, resolve);
    });

    const genome = getGenome(key);

    if (storedAudio) {

      zip.file("audio/" + key, storedAudio);

      if (genome) {
        zip.file(
          "genomes/" + key + ".genome.json",
          JSON.stringify(genome, null, 2)
        );
      }

      manifest.push({
        category: currentCategory,
        text: unit.text,
        file: key,
        genome: genome ? "genomes/" + key + ".genome.json" : null,
        status: "approved"
      });

    }

  }

  zip.file(
    "manifest.json",
    JSON.stringify(manifest, null, 2)
  );

  const content = await zip.generateAsync({
    type: "blob"
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(content);
  a.download = "noorania_" + currentCategory + "_genome_lab.zip";

  a.click();

}


// =====================================
// 9️⃣ بدء التطبيق
// =====================================

window.onload = function () {

  renderHome();

};
