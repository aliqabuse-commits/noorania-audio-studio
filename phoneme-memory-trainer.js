// ================================
// phoneme-memory-trainer.js
// مدرب الذاكرة الإدراكية اللونية للحروف — V1.2
// ================================

console.log("🎨 phoneme-memory-trainer.js جاهز V1.2");

// ======================================
// تشغيل تدريب ذاكرة حرف
// ======================================

async function trainPhonemeMemory(phonemeKey) {
  try {

    if (typeof getPhonemeMemory !== "function") {
      alert("دالة getPhonemeMemory غير موجودة");
      return;
    }

    const memory =
      getPhonemeMemory(phonemeKey);

    const pack =
      typeof getPhonemeTrainingPack === "function"
        ? getPhonemeTrainingPack(phonemeKey)
        : null;

    if (!memory) {
      alert(
        "لا توجد ذاكرة مسجلة لهذا الحرف: " +
        phonemeKey
      );
      return;
    }

    const units =
      pack && pack.positions
        ? pack.positions.map(function (p) {
            return {
              text: p.text,
              file: p.file,
              role: p.role
            };
          })
        : memory.trainingUnits;

    const missing =
      await findMissingTrainingFiles(units);

    if (missing.length) {
      alert(
        "لم تكتمل حقيبة التدريب الإدراكي بعد.\n\n" +
        "الملفات الناقصة:\n" +
        missing.join("\n") +
        "\n\nابدأ أولًا بزر: 🎙 تدريب هذا الحرف إدراكيًا"
      );

      return;
    }

    showPhonemeTrainingLoading(
      "جاري بناء ذاكرة لون " +
      memory.label +
      "..."
    );

    const samples = [];

    for (const unit of units) {

      console.log(
        "🔍 قراءة ملف التدريب:",
        unit.file
      );

      const blob =
        await getAudioPromiseForMemory(unit.file);

      console.log(
        "📦 نتيجة الملف:",
        unit.file,
        blob
      );

      if (!blob) {
        throw new Error(
          "الصوت غير موجود: " +
          unit.file
        );
      }

      const decoded =
        await decodeBlobToMonoForMemory(blob);

      console.log(
        "✅ تم فك الصوت:",
        unit.file,
        decoded.sampleRate,
        decoded.samples.length
      );

      const features =
        extractPerceptualFeatures(
          decoded.samples,
          decoded.sampleRate
        );

      samples.push({
        text: unit.text,
        file: unit.file,
        role: unit.role,
        duration:
          decoded.samples.length /
          decoded.sampleRate,
        features
      });
    }

    const identity =
      buildPerceptualIdentity(
        memory,
        samples
      );

    localStorage.setItem(
      phonemeKey +
      "_perceptual_identity",

      JSON.stringify(identity, null, 2)
    );

    renderPhonemeMemoryReport(identity);

    hidePhonemeTrainingLoading();

    alert(
      "تم بناء ذاكرة لون " +
      memory.label +
      "\n" +
      "اللون: " +
      memory.color.name +
      "\n" +
      "الثقة الإدراكية: " +
      identity.confidence.toFixed(4)
    );

  } catch (err) {

    hidePhonemeTrainingLoading();

    console.error(
      "❌ فشل تدريب الذاكرة الإدراكية",
      err
    );

    alert(
      "فشل تدريب الذاكرة الإدراكية:\n" +
      err.message
    );
  }
}


// ======================================
// فحص الملفات الناقصة
// ======================================

async function findMissingTrainingFiles(units) {

  const missing = [];

  for (const unit of units) {

    const blob =
      await getAudioPromiseForMemory(
        unit.file,
        1200
      );

    if (!blob) {
      missing.push(unit.file);
    }
  }

  return missing;
}


// ======================================
// بناء الهوية الإدراكية
// ======================================

function buildPerceptualIdentity(
  memory,
  samples
) {

  const centroidValues = [];
  const spreadValues = [];
  const energyValues = [];
  const zcrValues = [];
  const durationValues = [];
  const burstValues = [];

  samples.forEach(function (sample) {

    centroidValues.push(
      sample.features.centroid
    );

    spreadValues.push(
      sample.features.spread
    );

    energyValues.push(
      sample.features.energy
    );

    zcrValues.push(
      sample.features.zcr
    );

    durationValues.push(
      sample.duration
    );

    burstValues.push(
      sample.features.burstiness
    );
  });

  return {

    method:
      "Phoneme Color Memory Trainer V1.2",

    phonemeKey:
      memory.key ||
      memory.phonemeKey ||
      memory.label ||
      memory.phoneme,

    phoneme:
      memory.phoneme,

    label:
      memory.label,

    color:
      memory.color,

    trainingUnits:
      samples.map(function (s) {

        return {
          text: s.text,
          file: s.file,
          role: s.role,

          duration:
            roundMemory(s.duration),

          centroid:
            roundMemory(
              s.features.centroid
            ),

          spread:
            roundMemory(
              s.features.spread
            ),

          energy:
            roundMemory(
              s.features.energy
            ),

          zcr:
            roundMemory(
              s.features.zcr
            ),

          burstiness:
            roundMemory(
              s.features.burstiness
            )
        };
      }),

    perceptualSignature: {

      centroid: {
        mean:
          roundMemory(
            averageMemory(
              centroidValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              centroidValues
            )
          )
      },

      spread: {
        mean:
          roundMemory(
            averageMemory(
              spreadValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              spreadValues
            )
          )
      },

      energy: {
        mean:
          roundMemory(
            averageMemory(
              energyValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              energyValues
            )
          )
      },

      zcr: {
        mean:
          roundMemory(
            averageMemory(
              zcrValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              zcrValues
            )
          )
      },

      duration: {
        mean:
          roundMemory(
            averageMemory(
              durationValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              durationValues
            )
          )
      },

      burstiness: {
        mean:
          roundMemory(
            averageMemory(
              burstValues
            )
          ),

        variance:
          roundMemory(
            varianceMemory(
              burstValues
            )
          )
      }
    },

    confidence:
      calcPerceptualConfidence({
        centroidValues,
        spreadValues,
        energyValues,
        zcrValues,
        burstValues
      }),

    concept:
      memory.concept,

    createdAt:
      new Date().toISOString()
  };
}

console.log("🎨 مدرب الذاكرة الإدراكية جاهز V1.2");
