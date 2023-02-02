
var questions = [
    {
      question: "What selector is used to select an element by ID in jQuery?",
      options: ["#", ".", "//", "$"],
      answer: "1"
    } ,
    {
      question: "What data type has a value of true or false?",
      options: ["string", "boolean", "number", "null"],
      answer: "1"
    } ,
    {
      question: "Inside which HTML element do we put the JavaScript",
      options: ["scripting", "javascript", "js", "script"],
      answer: "3"
    } ,
    {
      question: "What jQuery method allows you to add an element to a list?",
      options: ["sort", "addClass", "append"],
      answer: "2"
    }
  ];

var startContainer = "#start-container";
var questionContainer = "#question-container"; 
var scoreContainer = "#score-container"; 
var highScoreContainer = "#high-score-container"
var highScoreListKey = "highScoreList";

var timer = 60; 

var score = 0; 

var quizProgress = "start"

var currentQuestion = 0;

var timerFunc; 

function showQuestion() {

    if(currentQuestion >= questions.length) {
        endQuiz(); 
    } else {
        quizProgress = "question";

        $("#total-score").text("Score = " + score); 

        var questionConfig = questions[currentQuestion]; 
        $("#question").text(questionConfig["question"]); 
        $("#answers").empty(); 

        $(questionConfig["options"]).each(function(i) {
            $("#answers").append("<li class='list-group-item'><button class='btn btn-primary btn-block' value='" + i + "'>" + questionConfig["options"][i] + "</button></li>"); 
        }); 

        $("#answers li button").click(function() {
            var indexOption = jQuery(this).val();
            var isCorrect = false; 
            if(indexOption === questions[currentQuestion]["answer"]) {
                score = score + 5; 
                isCorrect = true; 
            } else {
                timer = timer - 10; 
                $("#timer").text("Timer: " + timer); 
            }
            if(quizProgress === "question") {
                var correctElement = $("#correct");
                if(isCorrect) {
                    correctElement.text("Correct answer!");
                    correctElement.addClass("text-success");
                    correctElement.removeClass("text-danger"); 

                } else {
                    correctElement.text("Incorrect answer!");
                    correctElement.addClass("text-danger");
                    correctElement.removeClass("text-success"); 
                }
                correctElement.removeClass('hidden');
                currentQuestion = currentQuestion + 1; 
                showQuestion(); 
            }
        }); 
    }
}

function showScore() {
    quizProgress = "score";
    $(scoreContainer).removeClass('hidden'); 
    $("#score").text("Score = " + score); 
}

function saveUserScore(initials) {
    highScores = JSON.parse(localStorage.getItem(highScoreListKey));
    if (highScores == null) {
        highScores = [];
    }
    userScore = {
        initials: initials,
        score: score
    };
    highScores.push(userScore);
    localStorage.setItem(highScoreListKey, JSON.stringify(highScores));
}

function showHighScores() {
    highScores = JSON.parse(localStorage.getItem(highScoreListKey));
    
    if (highScores == null || highScores.length == 0) {
        $("#no-scores").removeClass('hidden');
    } else {
        $("#high-scores-list").empty(); 
        highScores.sort(); 
        for(var i = 0; i < highScores.length; i++) {
        var ranking = i + 1;
            $("#high-scores-list").append("<li class='list-group-item'>" + ranking + " " + highScores[i]["initials"] + " - " + highScores[i]["score"] + "</li>"); 
        }; 
    }
}

function startQuiz() {
    timerFunc = setInterval(function() {
        timer--;
        $("#timer").text("Timer: " + timer); 
        if (timer <= 0) {
          clearInterval(timerFunc);
          return endQuiz();
        }
      }, 1000);
    $(startContainer).addClass('hidden'); 
    $(questionContainer).removeClass('hidden'); 
    showQuestion();
}

function endQuiz() {
    clearInterval(timerFunc);
    $("#timer").addClass('hidden'); 
    $(questionContainer).addClass('hidden'); 
    $("#total-score").addClass('hidden'); 
    showScore();
}

$(document).ready(function() {
    $("#reset-scores").click(function() {
        localStorage.clear(); 
        document.location.reload(true);
    });

    $("#back").click(function() {
        document.location.reload(true);
    });

    $("#high-score").click(function() {
        $(startContainer).addClass('hidden');
        $(questionContainer).addClass('hidden'); 
        $(scoreContainer).addClass('hidden'); 
        $(highScoreContainer).removeClass('hidden'); 
        showHighScores();
    });

    $("#start").click(function() {
        startQuiz(); 
    });

    $("#register button").click(function(event) {
        event.preventDefault(); 
        var initials = $("#user-registration").val(); 
        if (initials == '') {
            return;
        }
        saveUserScore(initials);
        document.location.reload(true);
    }); 
});

