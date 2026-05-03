const units = [
  { text: "بَ", file: "ba_fatha.wav" },
  { text: "بِ", file: "ba_kasra.wav" },
  { text: "بُ", file: "ba_damma.wav" },

  { text: "أَبْ", file: "ba_sukoon_after_fatha.wav" },
  { text: "إِبْ", file: "ba_sukoon_after_kasra.wav" },
  { text: "أُبْ", file: "ba_sukoon_after_damma.wav" },

  { text: "أَمْ", file: "meem_sukoon_after_fatha.wav" },
  { text: "أَنْ", file: "noon_sukoon_after_fatha.wav" },
  { text: "أُلْ", file: "lam_sukoon_after_damma.wav" }
];

let index = 0;

let mediaRecorder;
let audioChunks = [];
let audioBlob;

function updateUI() {
  document.getElementById("unit").innerText = units[index].text;
}

updateUI();

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.start();

  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    audioBlob = new Blob(audioChunks);
  };
}

function stopRecording() {
  mediaRecorder.stop();
}

function play() {
  if (!audioBlob) return;
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
}

function download() {
  if (!audioBlob) return;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(audioBlob);
  a.download = units[index].file;
  a.click();
}

function nextUnit() {
  index++;
  if (index >= units.length) index = 0;
  updateUI();
}
