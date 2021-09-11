/*LOCAL STORAGE*/
var array_scores = [];
var storedScores;
var questions = [
    {
        "Q":"Q. True or False: HTML is a coding language used to create web pages.",
        "A":["True","False"],
        "Key":"1",
        "Score":5,
    },
    {
        "Q":"Q. The ____ tag set provides information to the browser about your webpage including the author name and keywords.",
        "A":["<style></style>","<body></body>","<meta></meta>","<html></html>"],
        "Key":"2",
        "Score":10,
    },
    {
        "Question":"Q. Items in a(n) list are preceded by numbers.",
        "A":["unordered","bulleted","grocery","ordered",],
        "Key":"3",
        "Score":5,
    },
];

/*HEADER SECTION SELECTORS*/
var panel_header = document.querySelector("#header");
var link_score = document.querySelector("#score-link");
var btn_start = document.querySelector("#start-button");

/*BODY SECTION SELECTORS */
var panel_body = document.querySelector("#main");
var panel_score = document.querySelector(".high-score");
var panel_quiz = document.querySelector(".quiz");
var panel_cd = document.querySelector("#countdown");

/*SCORE SECTION SELECTORS*/
var link_backhome = document.querySelector("#link_back");
var list_score = document.querySelector("#highscore-list");

// temporary keyin score
// var frm_score = document.querySelector("#form-score");
// var txt_name = document.querySelector("#txt-name");
// var txt_score = document.querySelector("#txt-score");
// var btn_submit = document.querySelector("#btn-submit");

/*COUNTDOWN SECTION SELECTOR*/ 
var lbl_countdown = document.querySelector("#lbl-cd");

/*QUIZ SECTION SELECTOR*/
var lbl_timer = document.querySelector("#timer-label");
var lbl_question = document.querySelector("#question-label");
var lst_answers = document.querySelector("#answer-list");

/*VARIABLES*/
var total_time = 120;
var total_score = 0;
var total_questions = 3;

// START RUN
function init() {
    
    panel_header.setAttribute("class","show");
    panel_body.setAttribute("class", "hide");
    panel_cd.setAttribute("class", "hide");
    panel_quiz.setAttribute("class", "quiz hide");
    panel_score.setAttribute("class", "high-score hide");
    
    // if (panel_header.getAttribute("class","hide")) {
    //     panel_header.setAttribute("class","show");
    // }else {
    //     panel_header.setAttribute("class","hide");
    // }


    // if (panel_body.getAttribute("class", "show")) {
    //    panel_body.setAttribute("class", "hide");
    // }else {
    //     panel_body.setAttribute("class", "show");
    // }

    // if (panel_score.getAttribute("class", "high-score show")) {
    //     panel_score.setAttribute("class", "high-score hide");
    // }else {
    //     panel_score.setAttribute("class", "high-score show");
    // }

    // if (panel_quiz.getAttribute("class", "quiz show")) {
    //     panel_quiz.setAttribute("class", "quiz hide");
    // }else {
    //     panel_quiz.setAttribute("class", "quiz show");
    // }

    // if (panel_cd.getAttribute("class", "show")) {
    //     panel_cd.setAttribute("class", "hide");
    // }else {
    //     panel_cd.setAttribute("class", "show");
    // }
}

// SAVING SCORE == USING FORM
// function save_score(event) {
//     event.preventDefault();

//     var new_scorer = {};

//     var val_name = txt_name.value.trim();
//     var val_score = txt_score.value.trim();

//     if (val_name === "" && val_score === "") {
//         console.log("No Name & Score");
//         txt_name.focus();
//         return;
//     }else if (val_name === "" && val_score !== "") {
//         console.log("No Name.");
//         txt_name.focus();
//         return;
//     }else if (val_name !== "" && val_score === "") {
//         console.log("No Score.");
//         txt_score.focus();
//         return;
//     }else {
//         new_scorer["name"] = val_name;
//         new_scorer["score"] = val_score;
//         array_scores.push(new_scorer);
//         localStorage.setItem(
//           "scores", JSON.stringify(array_scores)
//         );
//         txt_name.value = "";
//         txt_score.value = "";
//         txt_name.focus();
//         view_score();
//     }
// }

// LOAD SCORE
function load_score() {
    storedScores = JSON.parse(localStorage.getItem("scores"));

    if (storedScores !== null) {
        var unsorted_array = [];
        for (var j=0;j<storedScores.length;j++) {
            unsorted_array.push(storedScores[j]);
        }
        array_scores = unsorted_array.sort((a, b) => (b.score - a.score));
    }else {
        return;
    }
}

// VIEW SCORE
function view_score() {
    panel_header.setAttribute("class", "hide");
    panel_body.setAttribute("class", "show");
    panel_score.setAttribute("class", "high-score show");
    // panel_cd.setAttribute("class", "hide")
    // panel_quiz.setAttribute("class","quiz hide");

    list_score.innerHTML = "";

    load_score();

    if (array_scores !== null) {
        for (var i = 0; i < array_scores.length; i++) {
            // Display up to 10 scorers.
            if (i >= 10) {
                return;
            }else {
                var scorelst = array_scores[i]["name"] + " - " + array_scores[i]["score"];
                var li = document.createElement("li");
                li.textContent = scorelst;
                li.setAttribute("style", "text-align: left;");
    
                list_score.appendChild(li);
            }
        }
    }else {
        return;
    }
}

// COUNTDOWN BEFORE QUIZ
function run_countdown() {
    panel_header.setAttribute("class", "hide");
    panel_body.setAttribute("class", "show");
    panel_cd.setAttribute("class", "show");
    
    var int_countdown = 3;
    var timer_cd = setInterval(function() {
        int_countdown--;
        lbl_countdown.textContent = int_countdown;
        
        if(int_countdown < 0) {
            clearInterval(timer_cd);
            run_quiz();
        }
    }, 1000);
}

// THE QUIZ
function run_quiztimer() {
    var timer_quiz = setInterval(function() {
        total_time--;
        lbl_timer.textContent = "Time Left : " + total_time;
        if(total_time < 0) {
            clearInterval(timer_quiz);
            panel_quiz.setAttribute("class","quiz hide");
        }
    }, 1000);
}

function run_quiz() {
    
    panel_cd.setAttribute("class", "hide");
    panel_quiz.setAttribute("class","quiz show");

    lbl_timer.textContent = "Time Left : ---";

    run_quiztimer();
    ask_questions();
}

function ask_questions() {
    var chosen_q = "";
    var question_key = "";
    var score = ""
    var answer_list = [];

    lst_answers.innerHTML = "";

    if (total_questions < 0) {
        panel_quiz.setAttribute("class","quiz hide");
        console.log("Final Score " + total_score);
    }else {
        chosen_q = questions[Math.floor(Math.random() * questions.length)];
        question_key = chosen_q["Key"];
        score = chosen_q["Score"];
    
        for (var x=0;x<chosen_q["A"].length;x++) {
            answer_list.push(chosen_q["A"][x]);

            var ans = chosen_q["A"][x];
            var li = document.createElement("li");
            li.textContent = ans;
            li.setAttribute("class", "show-bullet");
            li.setAttribute("data-index", ans);
            li.setAttribute("data-score", score);
        
            lst_answers.appendChild(li);
        }
    
        lbl_question.setAttribute("class","timer-label");
        lbl_question.textContent = chosen_q["Question"];

        lst_answers.addEventListener("click", function(event) {
            var element = event.target;
            var answer = element.getAttribute("data-index");
            var ans_score = element.getAttribute("data-score");

            if (element.matches("li") === true) {
                if (question_key === "1") {
                    if (answer === "True") {
                        console.log("Correct");
                        console.log(ans_score);
                        ask_questions();
                    }else {
                        console.log("Wrong");
                        total_time = total_time - 5;
                        ask_questions();
                    }
                };
                
                if (question_key === "2") {
                    if (answer === "<meta></meta>") {
                        console.log("Correct");
                        console.log(ans_score);
                        total_questions = total_questions - 1;
                        ask_questions();
                    }else {
                        console.log("Wrong");
                        total_time = total_time - 5;
                        total_questions = total_questions - 1;
                        ask_questions();
                    }
                };
                
                if (question_key === "3") {
                    if (answer === "ordered") {
                        console.log("Correct");
                        console.log(ans_score);
                        total_questions = total_questions - 1;
                        ask_questions();
                    }else {
                        console.log("Wrong");
                        total_time = total_time - 5;
                        total_questions = total_questions - 1;
                        ask_questions();
                    }
                };
            }
        });
    }
//key = 1, A = True, Score = 5
//key = 2, A = <meta></meta>, Score = 10
//key = 3, A = ordered, Score = 5

}

function set_score() {

}


    // for (var i = 0; i < chosen_q["A"].length; i++) {
    //     var todo = todos[i];
    
    //     var li = document.createElement("li");
    //     li.textContent = todo;
    //     li.setAttribute("data-index", i);
    
    //     var button = document.createElement("button");
    //     button.textContent = "Complete ✔️";
    
    //     li.appendChild(button);
    //     todoList.appendChild(li);
    //   }


    // lst_answers.addEventListener("click", function(event) {
    //     var element = event.target;
    //     if (element.matches("button") === true) {
    //       var index = element.parentElement.getAttribute("data-index");
    //       todos.splice(index, 1);
    //       storeTodos();
    //       renderTodos();
    //     }
    //   });

link_score.addEventListener("click", view_score);
link_backhome.addEventListener("click", init);
// btn_submit.addEventListener("click", save_score);
btn_start.addEventListener("click", run_countdown);



init();