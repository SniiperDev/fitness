var currentExercise = "";
var startTime;
var timerInterval;
var completedExercises = [];
var pauseTime = 0; // Variable pour stocker le temps écoulé pendant la pause

function startTimer(exercise) {
  currentExercise = exercise;
  hideExerciseImages();
  showSelectedExerciseImage(exercise);
  showTimer();
  start();
  updateExerciseTitle(exercise);
}

function updateExerciseTitle(exercise) {
  var exerciseTitle = document.getElementById("exerciseTitle");
  exerciseTitle.textContent = "Exercice sélectionné : " + exercise;
}

function hideExerciseImages() {
  var exerciseImages = document.querySelectorAll("#exercises li img");
  for (var i = 0; i < exerciseImages.length; i++) {
    exerciseImages[i].style.display = "none";
  }
}

function showSelectedExerciseImage(exercise) {
  var exerciseImage = document.getElementById("exerciseImage");
  exerciseImage.src = "images/" + exercise + ".png";
  exerciseImage.alt = exercise;
}

function showTimer() {
  var timer = document.getElementById("timer");
  timer.style.display = "block";
}

function start() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  var currentTime = new Date().getTime();
  var timeDiff = currentTime - startTime;
  var seconds = Math.floor(timeDiff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  var timeDisplay = hours.toString().padStart(2, "0") + ":" +
    minutes.toString().padStart(2, "0") + ":" +
    seconds.toString().padStart(2, "0");

  var timerDisplay = document.getElementById("time");
  timerDisplay.textContent = timeDisplay;
}

function pause() {
  clearInterval(timerInterval);
  pauseTime = new Date().getTime() - startTime;
}

function resume() {
  startTime = new Date().getTime() - pauseTime;
  timerInterval = setInterval(updateTimer, 1000);
}

function stop() {
  clearInterval(timerInterval);
  var timerDisplay = document.getElementById("time").textContent;
  var completedExercise = {
    date: getCurrentDate(),
    exercise: currentExercise,
    time: timerDisplay
  };
  completedExercises.push(completedExercise);
  saveCompletedExercisesToLocalStorage();
  resetTimer();
  showExerciseImages();
  updateCompletedExercisesList();
}

function resetTimer() {
  var timerDisplay = document.getElementById("time");
  timerDisplay.textContent = "00:00:00";
  var timer = document.getElementById("timer");
  timer.style.display = "none";
}

function showExerciseImages() {
  var exerciseImages = document.querySelectorAll("#exercises li img");
  for (var i = 0; i < exerciseImages.length; i++) {
    exerciseImages[i].style.display = "block";
  }
}

function updateCompletedExercisesList() {
  var exerciseList = document.getElementById("completedExercises");
  exerciseList.innerHTML = "";

  var dates = [];

  for (var i = 0; i < completedExercises.length; i++) {
    var exercise = completedExercises[i];
    var existingDate = dates.find(function(date) {
      return date.date === exercise.date;
    });

    if (existingDate) {
      existingDate.exercises.push(exercise);
    } else {
      dates.push({
        date: exercise.date,
        exercises: [exercise]
      });
    }
  }

  dates.forEach(function(dateItem) {
    var exerciseDate = document.createElement("h2");
    exerciseDate.textContent = dateItem.date;
    exerciseList.appendChild(exerciseDate);

    dateItem.exercises.forEach(function(exercise, index) {
      var exerciseItem = document.createElement("div");
      exerciseItem.className = "exercise-item";

      var exerciseDetails = document.createElement("p");
      exerciseDetails.textContent = exercise.exercise + " - Temps passé sur l'exercice : " + exercise.time;
      exerciseItem.appendChild(exerciseDetails);

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "button-primary";
      deleteButton.setAttribute("data-index", index);
      deleteButton.addEventListener("click", function() {
        var index = parseInt(this.getAttribute("data-index"));
        deleteCompletedExercise(index);
      });

      exerciseItem.appendChild(deleteButton);
      exerciseList.appendChild(exerciseItem);
    });
  });
}

function deleteCompletedExercise(index) {
  completedExercises.splice(index, 1);
  saveCompletedExercisesToLocalStorage();
  updateCompletedExercisesList();
}

function saveCompletedExercisesToLocalStorage() {
  localStorage.setItem("completedExercises", JSON.stringify(completedExercises));
}

function loadCompletedExercisesFromLocalStorage() {
  var storedExercises = localStorage.getItem("completedExercises");
  if (storedExercises) {
    completedExercises = JSON.parse(storedExercises);
    updateCompletedExercisesList();
  }
}

window.onload = function() {
  loadCompletedExercisesFromLocalStorage();
};

var isPaused = false; // Nouvelle variable pour suivre l'état de la pause

function togglePause() {
  if (isPaused) {
    isPaused = false;
    resume();
    document.getElementById("pauseButton").textContent = "Pause";
  } else {
    isPaused = true;
    pause();
    document.getElementById("pauseButton").textContent = "Play";
  }
}

function getCurrentDate() {
  var now = new Date();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('fr-FR', options);
}

function displayCompletedExercises() {
  var exerciseList = document.getElementById("completedExercises");
  exerciseList.innerHTML = "";

  var dates = [];

  for (var i = 0; i < completedExercises.length; i++) {
    var exercise = completedExercises[i];
    var existingDate = dates.find(function(date) {
      return date.date === exercise.date;
    });

    if (existingDate) {
      existingDate.exercises.push(exercise);
    } else {
      dates.push({
        date: exercise.date,
        exercises: [exercise]
      });
    }
  }

  dates.forEach(function(dateItem) {
    var exerciseDate = document.createElement("h2");
    exerciseDate.textContent = dateItem.date;
    exerciseList.appendChild(exerciseDate);

    dateItem.exercises.forEach(function(exercise, index) {
      var exerciseItem = document.createElement("div");
      exerciseItem.className = "exercise-item";

      var exerciseDetails = document.createElement("p");
      exerciseDetails.textContent = exercise.exercise + " - Temps passé sur l'exercice : " + exercise.time;
      exerciseItem.appendChild(exerciseDetails);

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.setAttribute("data-index", index);
      deleteButton.addEventListener("click", function() {
        var index = parseInt(this.getAttribute("data-index"));
        deleteCompletedExercise(index);
      });

      exerciseItem.appendChild(deleteButton);
      exerciseList.appendChild(exerciseItem);
    });
  });
}

displayCompletedExercises();
