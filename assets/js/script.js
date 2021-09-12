/*LOCAL STORAGE*/
var arr_scores = [];
var arr_random = [];
var storedScores;
var questions = [
    {
        "q":"True or False: HTML is a coding language used to create web pages.",
        "a":["True","False"],
        "index":1,
        "score":5
    },
    {
        "q":"The ____ tag set provides information to the browser about your webpage including the author name and keywords.",
        "a":["<style></style>","<body></body>","<meta></meta>","<html></html>"],
        "index":2,
        "score":10
    },
    {
        "q":"Items in a(n) list are preceded by numbers.",
        "a":["unordered","bulleted","grocery","ordered",],
        "index":3,
        "score":5
    },
    {
        "q":"Where is the correct place to put the title tag in an HTML document?",
        "a":["Above the HTML tag","In the head of the document","In the body of the document","It doesn't matter",],
        "index":4,
        "score":10
    },
];

var answers = [
    {"index":1,"a":"True"},
    {"index":2,"a":"<meta></meta>"},
    {"index":3,"a":"ordered"},
    {"index":4,"a":"In the head of the document"}
];

/*HEADER SECTION SELECTORS*/
var panel_header = document.querySelector("#header");
var link_score = document.querySelector("#score-link");
var btn_start = document.querySelector("#start-button");

/*BODY SECTION SELECTORS */
var panel_body = document.querySelector("#main");
var panel_scoreboard = document.querySelector(".high-score");
var panel_quiz = document.querySelector(".quiz");
var panel_cd = document.querySelector("#countdown");
var panel_endscore = document.querySelector("#score");

/*HIGH SCORE SECTION SELECTORS*/
var link_backhome = document.querySelector("#link_back");
var list_score = document.querySelector("#highscore-list");

/*COUNTDOWN SECTION SELECTOR*/ 
var lbl_countdown = document.querySelector("#lbl-cd");

/*QUIZ SECTION SELECTOR*/
var lbl_timer = document.querySelector("#timer-label");
var lbl_question = document.querySelector("#question-label");
var lst_answers = document.querySelector("#answer-list");

/*QUIZ SCORE SECTION*/
var lbl_user_score = document.querySelector("#user-score");
var txt_name = document.querySelector("#txt-name");
var btn_submit = document.querySelector("#btn-submit");

/*VARIABLES*/
var total_time;
var total_score;
var int_countdown;

// START RUN
function init() {
    panel_header.setAttribute("class","show");
    panel_body.setAttribute("class", "hide");
    panel_cd.setAttribute("class", "hide");
    panel_quiz.setAttribute("class", "quiz hide");
    panel_scoreboard.setAttribute("class", "high-score hide");
    total_score = 0;
    total_time = 120;
    int_countdown = 3;
    arr_scores = [];
    arr_random = [];
}

//SAVING SCORE == USING FORM
function save_score(event) {

    event.preventDefault();

    load_score();

    var new_scorer = {};

    var val_name = txt_name.value.trim();

    if (val_name === "") {
        txt_name.focus();
    }else {
        new_scorer["name"] = val_name;
        new_scorer["score"] = total_score;
        arr_scores.push(new_scorer);
        localStorage.setItem(
          "scores", JSON.stringify(arr_scores)
        );
        txt_name.textContent = "";
        location.reload();
    }
}

// LOAD SCORE
function load_score() {
    storedScores = JSON.parse(localStorage.getItem("scores"));

    if (storedScores !== null) {
        var unsorted_array = [];
        for (var j=0;j<storedScores.length;j++) {
            unsorted_array.push(storedScores[j]);
        }
        arr_scores = unsorted_array.sort((a, b) => (b.score - a.score));
    }else {
        return;
    }
}

// VIEW SCORE
function view_score() {
    panel_header.setAttribute("class", "hide");
    panel_body.setAttribute("class", "show");
    panel_scoreboard.setAttribute("class", "high-score show");
    panel_endscore.setAttribute("class","hide");

    list_score.innerHTML = "";

    load_score();

    if (arr_scores !== null) {
        for (var i = 0; i < arr_scores.length; i++) {
            // Display up to 10 scorers.
            if (i >= 10) {
                return;
            }else {
                var scorelst = arr_scores[i]["name"] + " - " + arr_scores[i]["score"];
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

    var timer_cd = setInterval(function() {
        lbl_countdown.textContent = int_countdown;
        int_countdown--;
        
        if(int_countdown < 0) {
            clearInterval(timer_cd);
            run_quiz();
        }
    }, 1000);
}

// QUIZ SECTION //
function run_quiztimer() {
    var timer_quiz = setInterval(function() {
        total_time--;
        lbl_timer.textContent = "Time Left : " + total_time;

        if(total_time < 0) {
            clearInterval(timer_quiz);
            set_score();
        }
    }, 1000);
}

function run_quiz() {
    panel_cd.setAttribute("class", "hide");
    panel_quiz.setAttribute("class","quiz show");

    lbl_timer.textContent = "Time Left : ---";

    run_quiztimer();
    run_questions();
}

function run_questions() {
    var str_question;
    var str_q_index;
    var str_q_score;

    //lets grab a random question
    function generate_question() {
        var int_random = Math.floor(Math.random() * questions.length)

        if (arr_random.length != questions.length) {
            if (arr_random.includes(int_random)) {
                generate_question();
            }else {
                arr_random.push(int_random);
                str_question = questions[int_random];
                //arr_question.push(str_question);
                lst_answers.innerHTML = "";

                //grab keys
                str_q_index = str_question["index"];
                str_q_score = str_question["score"];

                lbl_question.textContent = str_question["q"] + " (Score: " + str_q_score + ")";

                for (var x = 0; x < str_question["a"].length; x++ ) {
                    var ans = str_question["a"][x];
                    var li = document.createElement("li");
                    li.textContent = ans;
                    li.setAttribute("class", "show-bullet");
                        
                    lst_answers.appendChild(li);
                }
            }
        }else {
            //if every question is asked, set it to scoreboard.
            set_score();
        }
    }
    
    function get_answer(user_input) {
        var answer_index;
        var str_answer;

        for (var y = 0; y < answers.length; y++) {
            answer_index = answers[y]["index"];
            if (answer_index === str_q_index) {
                str_answer = answers[y]["a"];
                if (user_input === str_answer) {
                    //correct answer
                    total_score = total_score + str_q_score;
                    generate_question();
                }else {
                    //wrong answer
                    var random_time = Math.floor(Math.random() * 5) + 6;
                    total_time = total_time - random_time;
                    generate_question();
                }
                break;
            }
        }
    }

    generate_question();

    lst_answers.addEventListener("click", function(event) {
        var element = event.target;
        var str_user_answer = element.textContent;
        get_answer(str_user_answer);
    });
}  

// SCORE SECTION
function set_score() {
    panel_quiz.setAttribute("class","quiz hide");
    panel_endscore.setAttribute("class","show");

    lbl_user_score.textContent = "Your score is : " + total_score;
}

link_score.addEventListener("click", view_score);
link_backhome.addEventListener("click", init);
btn_submit.addEventListener("click", save_score);
btn_start.addEventListener("click", run_countdown);

init();