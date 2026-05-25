// ================================
// app.js
// غرفة العمليات الصوتية — قائد التشغيل 
// ================================

console.log("🧭 app.js جاهز  — قائد غرفة العمليات الصوتية يعمل");

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

let currentCategory = "";
let currentUnits = [];
let index = 0;

function getUnitKey(unit) {
  return unit.file;
}

async function approveAndNext() {
  if (!currentUnits.length) return;

  const unit = currentUnits[index];
  const key = getUnitKey(unit);

  const currentBlob =
    typeof getCurrentAudioBlob === "function"
      ? getCurrentAudioBlob()
      : null;

  if (!currentBlob && typeof hasWaveform === "function" && !hasWaveform()) {
    alert("سجّل الوحدة أولاً");
    return;
  }

  if (typeof hasGenomeRegions === "function" && !hasGenomeRegions()) {
    alert("لم يتم تعريف مناطق الجينوم الأربع");
    return;
  }

  if (currentBlob && typeof saveAudio === "function") {
    saveAudio(key, currentBlob);
  }

  const genome =
    typeof buildGenome === "function"
      ? buildGenome(key)
      : null;

  if (!genome) {
    alert("تعذر بناء ملف الجينوم");
    return;
  }

  if (typeof saveGenome === "function") {
    saveGenome(key, genome);
  }

  if (typeof unitStatus !== "undefined") {
    unitStatus[key] = "approved";
  }

  if (typeof saveUnitStatus === "function") {
    saveUnitStatus();
  }

  if (typeof clearCurrentAudioBlob === "function") {
    clearCurrentAudioBlob();
  }

  index++;

  if (index >= currentUnits.length) {
    index = 0;
  }

  updateUI();
}

function rejectUnit() {
  if (!currentUnits.length) return;

  const unit = currentUnits[index];
  const key = getUnitKey(unit);

  if (typeof unitStatus !== "undefined") {
    delete unitStatus[key];
  }

  if (typeof saveUnitStatus === "function") {
    saveUnitStatus();
  }

  if (typeof deleteAudio === "function") {
    deleteAudio(key);
  }

  if (typeof deleteGenome === "function") {
    deleteGenome(key);
  }

  localStorage.removeItem(key + ".profile.json");

  if (typeof clearCurrentAudioBlob === "function") {
    clearCurrentAudioBlob();
  }

  if (typeof destroyWaveform === "function") {
    destroyWaveform();
  }

  updateUI();
}

function updateUI() {
  const unit = currentUnits[index];

  if (!unit) return;

  document.getElementById("unit").innerText = unit.text;
  document.getElementById("filename").innerText = unit.file;
  document.getElementById("counter").innerText =
    (index + 1) + " / " + currentUnits.length;

  if (typeof getAudio === "function") {
    getAudio(unit.file, function (blob) {
      if (blob && typeof initWaveform === "function") {
        initWaveform(blob);
      } else if (typeof destroyWaveform === "function") {
        destroyWaveform();
      }
    });
  }

  renderUnitList();
}

function goHome() {
  document.getElementById("recordView").style.display = "none";
  document.getElementById("perceptualTrainingView").style.display = "none";
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

      currentUnits =
        typeof allUnits !== "undefined"
          ? allUnits[cat.title] || []
          : [];

      index = 0;

      if (!currentUnits.length) {
        alert(
          "لا توجد وحدات مسجلة لهذه القائمة بعد:\n" +
          cat.title
        );
        return;
      }

      document.getElementById("homeView").style.display = "none";
      document.getElementById("perceptualTrainingView").style.display = "none";
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

function renderUnitList() {
  const list = document.getElementById("unitList");

  if (!list) return;

  list.innerHTML = "";

  currentUnits.forEach(function (unit, i) {
    const btn = document.createElement("button");
    const key = getUnitKey(unit);

    const approved =
      typeof unitStatus !== "undefined" &&
      unitStatus[key] === "approved";

    btn.innerText =
      (approved ? "✅ " : "⏳ ") + unit.text;

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

async function exportApproved() {
  if (!currentUnits.length) return;

  if (typeof JSZip === "undefined") {
    alert("مكتبة JSZip غير محملة");
    return;
  }

  const approvedUnits = currentUnits.filter(function (unit) {
    const key = getUnitKey(unit);

    return (
      typeof unitStatus !== "undefined" &&
      unitStatus[key] === "approved"
    );
  });

  if (!approvedUnits.length) {
    alert("لا توجد وحدات معتمدة");
    return;
  }

  const zip = new JSZip();
  const manifest = [];

  for (let unit of approvedUnits) {
    const key = getUnitKey(unit);

    const storedAudio =
      typeof getAudio === "function"
        ? await new Promise(function (resolve) {
            getAudio(key, resolve);
          })
        : null;

    const genome =
      typeof getGenome === "function"
        ? getGenome(key)
        : null;

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
  a.download =
    "noorania_" +
    currentCategory +
    "_genome_lab.zip";

  a.click();
}

window.onload = function () {
  renderHome();
};

console.log("🧭 قائد غرفة العمليات الصوتية جاهز ");
