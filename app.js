let mediaRecorder;
let audioChunks = [];
let audioBlob;

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
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
}

function download() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(audioBlob);
  a.download = "record.wav";
  a.click();
}
