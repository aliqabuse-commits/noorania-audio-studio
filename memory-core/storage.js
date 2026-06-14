// ================================
// storage.js
// غرفة العمليات الصوتية — طبقة التخزين
// ================================


// =====================================
// 1️⃣ قاعدة البيانات
// =====================================

let db;

function initDB() {

  const request = indexedDB.open("noorDB", 1);

  request.onupgradeneeded = function (e) {

    db = e.target.result;

    if (!db.objectStoreNames.contains("recordings")) {
      db.createObjectStore("recordings");
    }

  };

  request.onsuccess = function (e) {
    db = e.target.result;
    console.log("✅ تم فتح قاعدة البيانات");
  };

  request.onerror = function () {
    console.error("❌ تعذر فتح قاعدة البيانات");
    alert("تعذر فتح قاعدة حفظ الأصوات");
  };

}


// =====================================
// 2️⃣ الصوت الخام
// =====================================

function saveAudio(key, blob) {
  return new Promise(function (resolve, reject) {
    if (!db) {
      reject(new Error("قاعدة البيانات غير جاهزة"));
      return;
    }

    const tx = db.transaction("recordings", "readwrite");

    tx.objectStore("recordings").put(blob, key);

    tx.oncomplete = function () {
      resolve(true);
    };

    tx.onerror = function () {
      reject(tx.error || new Error("فشل حفظ الصوت"));
    };
  });
}


function getAudio(key, callback) {
  if (!db) {
    callback(null);
    return;
  }

  const tx = db.transaction("recordings", "readonly");
  const request = tx.objectStore("recordings").get(key);

  request.onsuccess = function () {
    callback(request.result || null);
  };

  request.onerror = function () {
    callback(null);
  };
}

function deleteAudio(key) {

  if (!db) return;

  const tx = db.transaction("recordings", "readwrite");

  tx.objectStore("recordings").delete(key);

}


// =====================================
// 3️⃣ الجينوم
// =====================================

function saveGenome(key, genome) {

  localStorage.setItem(
    key + ".genome.json",
    JSON.stringify(genome, null, 2)
  );

}


function getGenome(key) {

  const data = localStorage.getItem(
    key + ".genome.json"
  );

  if (!data) return null;

  try {

    return JSON.parse(data);

  } catch (err) {

    console.error("❌ فشل قراءة الجينوم", err);

    return null;

  }

}


function deleteGenome(key) {

  localStorage.removeItem(
    key + ".genome.json"
  );

}


// =====================================
// 4️⃣ حالات الاعتماد
// =====================================

let unitStatus = {};

const savedStatus = localStorage.getItem("unitStatus");

if (savedStatus) {

  try {

    unitStatus = JSON.parse(savedStatus);

  } catch (err) {

    console.error("❌ فشل قراءة حالات الاعتماد");

    unitStatus = {};

  }

}


function saveUnitStatus() {

  localStorage.setItem(
    "unitStatus",
    JSON.stringify(unitStatus)
  );

}


// =====================================
// 5️⃣ التهيئة
// =====================================

initDB();

console.log("🗄 storage.js جاهز للعمل");
