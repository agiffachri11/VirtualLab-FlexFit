let currentExercise = 0;
let currentInterval = 0;
const totalExercises = 4;

function updateProgress() {
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const percentage = (currentExercise / totalExercises) * 100;

  progressText.textContent = `${percentage}% Selesai`;
  progressFill.style.width = `${percentage}%`;
}

function markAsDone(exerciseNumber) {
  const markButton = document.getElementById(`mark-done-${exerciseNumber}`);

  // Cek jika latihan sudah selesai
  if (markButton.classList.contains("done")) {
    return;
  }

  currentExercise++;
  currentInterval = 0;
  updateProgress();

  // Tandai tombol mark sebagai selesai
  markButton.classList.add("done");
  markButton.textContent = "Selesai";
  markButton.style.display = "none";

  playAudio("audio-selamat");
}

function startCountdown(exerciseNumber) {
  const workoutDuration =
    parseInt(
      document.getElementById(`workout-duration-${exerciseNumber}`).value
    ) || 60; // Durasi latihan
  const restDuration =
    parseInt(
      document.getElementById(`rest-duration-${exerciseNumber}`).value
    ) || 30; // Durasi istirahat
  const intervalCount =
    parseInt(
      document.getElementById(`interval-count-${exerciseNumber}`).value
    ) || 3; // Jumlah interval

  currentInterval = 0;
  startIntervalTimer(
    workoutDuration,
    restDuration,
    intervalCount,
    exerciseNumber
  );
}

function playAudio(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.play();
  }
}

function startIntervalTimer(
  workoutDuration,
  restDuration,
  intervalCount,
  exerciseNumber
) {
  if (currentInterval < intervalCount) {
    playAudio("audio-latihan");
    const countdownDisplay = document.createElement("div");
    countdownDisplay.id = `countdown-display-${exerciseNumber}`;
    countdownDisplay.textContent = `Waktu latihan: ${workoutDuration} detik`;
    document
      .querySelector(".container")
      .insertBefore(
        countdownDisplay,
        document.getElementById(`start-button-${exerciseNumber}`).nextSibling
      );

    document.getElementById(
      `interval-display-${exerciseNumber}`
    ).textContent = `Interval: ${currentInterval + 1} dari ${intervalCount}`;

    let interval = setInterval(() => {
      workoutDuration--;
      countdownDisplay.textContent = `Waktu latihan: ${workoutDuration} detik`;

      if (workoutDuration < 0) {
        clearInterval(interval);
        currentInterval++;

        startRestTimer(restDuration, exerciseNumber);
      }
    }, 1000);
  } else {
    markAsDone(exerciseNumber);
  }
}

function startRestTimer(restDuration, exerciseNumber) {
  playAudio("audio-istirahat");
  const countdownDisplay = document.getElementById(
    `countdown-display-${exerciseNumber}`
  );
  countdownDisplay.textContent = `Waktu istirahat: ${restDuration} detik`;

  let restInterval = setInterval(() => {
    restDuration--;
    if (restDuration >= 0) {
      countdownDisplay.textContent = `Waktu istirahat: ${restDuration} detik`;
    }

    if (restDuration < 0) {
      clearInterval(restInterval);
      countdownDisplay.textContent = "";

      const workoutInput =
        parseInt(
          document.getElementById(`workout-duration-${exerciseNumber}`).value
        ) || 60;
      const restInput =
        parseInt(
          document.getElementById(`rest-duration-${exerciseNumber}`).value
        ) || 30;
      startIntervalTimer(
        workoutInput,
        restInput,
        parseInt(
          document.getElementById(`interval-count-${exerciseNumber}`).value
        ) || 3,
        exerciseNumber
      );
    }
  }, 1000);
}

document.getElementById("notify-button").addEventListener("click", () => {
  alert("Anda akan diberitahu ketika Latihan 5 sudah dibuka!");
});

document.getElementById("reset-button").addEventListener("click", () => {
  currentExercise = 0;
  currentInterval = 0;
  updateProgress();
  const markButtons = document.querySelectorAll(".mark-done");
  markButtons.forEach((button) => {
    button.style.display = "inline-block";
    button.classList.remove("done");
    button.textContent = "Mark as Done";
  });
  const countdownDisplays = document.querySelectorAll(
    '[id^="countdown-display-"]'
  );
  countdownDisplays.forEach((display) => display.remove());
});

// Panggil fungsi updateProgress di awal untuk mengatur teks awal
updateProgress();
