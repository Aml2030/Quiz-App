// Start Variables
let countSpan = document.querySelector(".quiz-info .count span");
let theQuestion = document.querySelector(".quiz-area");
let theAnswersArea = document.querySelector(".answers-area");
let buttons = document.querySelector(".buttons")
let submitButton = document.querySelector(".submit-button");
let tip = document.querySelector(".tip");
let prevButton = document.querySelector(".prev");
let start = document.querySelector(".buttons .start");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let resultsContainer = document.querySelector(".results");

let currentIndex = 0;
let rightAnswers = 0;
let clickedAlert = false; //Alert while not submitting an answer.

let count, questionsObject, theKeysOfquestionsObject, answer, radioInput, label;
let answersInputElements = document.getElementsByName("questions");
let labels = document.getElementsByTagName("label");
let labelsArr;
// End Variables

localStorage.clear();

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    if (currentIndex !== count)countSpan.innerHTML = `${currentIndex + 1} / ${count}`;
    theQuestion.innerHTML = "";
    theAnswersArea.innerHTML = "";
    let h2 = document.createElement("h2");
    h2.textContent = obj.title; //same as=> obj['title'];
    theQuestion.appendChild(h2);
    for (let i = 0; i < 4; i++) {
      answer = document.createElement("div");
      answer.className = "answer";
      radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = `answer_${i + 1}`;
      radioInput.name = "questions";
      radioInput.dataset.answer = obj[`ans_${i + 1}`]; //checkAnswer
      
      label = document.createElement("label");
      label.setAttribute("for", `answer_${i + 1}`); //the same as=> label.htmlFor = `answer_${i+1}` ;
      label.textContent = obj[`ans_${i + 1}`];
      
      answer.append(radioInput, label);
      theAnswersArea.appendChild(answer);
    }
    if(currentIndex == count-1){
      tip.classList.add("tooltiptext");
      tip.innerHTML=`Submit & Show Result`
    }
    labelsArr = Array.from(labels); //After assigning values
    checkExist();
  }
  
}
function checkAnswer( count) {
  let theChosenAnswer;
  for (let i = 0; i < answersInputElements.length; i++) {  
    if (answersInputElements[i].checked) {
      theChosenAnswer = labels[i].textContent;
    }
  }
  //add||update||found it in local and checked by checkExist(). 
  for (let i=0 ; i<count ; i++) { 
    if(currentIndex == theKeysOfquestionsObject[i]){ 
      //add to local same index as currentIndex
      localStorage.setItem(i, JSON.stringify(theChosenAnswer));
    }
  }
}
function checkExist( ){
  if(currentIndex>0){
    //input of answers (id) is connected to labels (for) 
    for(let i=0; i<labelsArr.length;i++){               
      if(labelsArr[i].textContent==JSON.parse(localStorage.getItem(currentIndex))){                 
        answersInputElements[i].checked = true;
        clickedAlert=true;
      }
    }
  }
}
function showResults(count) {
  transitionsEnd();
  let theResult;
  let rspan = document.createElement("span");
  if (rightAnswers > count / 2 && rightAnswers < count) {
    rspan.className = "good";
    rspan.textContent = "GOOD ";
  } else if (rightAnswers === count) {
    rspan.className = "perfect";
    rspan.textContent = "PERFECT ";
  } else {
    rspan.className = "bad";
    rspan.textContent = "NOT\x20GOOD  ";
  }
  resultsContainer.append(rspan);

  theResult =  `- You Answered ${rightAnswers} From ${count}`;
  resultsContainer.append(theResult);

  let again = document.createElement("buttton");
  again.className="again";
  again.textContent="Retry";
  again.style.cssText="cursor:pointer ; color:#0075ff; text-decoration: underline;"
  resultsContainer.append(again);

  again.onclick = ()=>location.reload();
}
function countRightAnswers(){
    for ( let i=0 ; i< count ; i++){
    let one = JSON.parse(localStorage.getItem(i));
    let two = questionsObject[i].right_ans;
    if(one == two) rightAnswers++;
  }
}
function createBullets(count) {
  for (let i = 0; i < count; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) theBullet.className = "on";
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) span.className = "on";
  });
}
function handleBulletsPrev() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) span.classList.remove("on");
  });
}
function transitions(){
  createBullets(count);
  start.classList.add("fade-out-animation")
  start.style.cssText = "background-color: #0075ff; color:#fff;  ";
  start.innerHTML=`Started`;
  
  theQuestion.classList.add("fade-in-animation")
  theAnswersArea.classList.add("fade-in-animation")
  bullets.classList.add("fade-in-animation") 
  resultsContainer.classList.add("fade-in-animation")
  submitButton.classList.add("fade-in-animation")
  prevButton.classList.add("fade-in-animation-prev")
  submitButton.classList.add("active-btn")
}
function transitionsEnd(){
  submitButton.classList.remove("fade-in-animation");//to run next line
  submitButton.style.cssText="opacity:0.5; pointer-events:none;"; 

  prevButton.style.cssText="opacity:0.5; pointer-events:none;";

  theAnswersArea.classList.remove("fade-in-animation");
  theAnswersArea.style.cssText="opacity:0.5;";

  theQuestion.classList.remove("fade-in-animation");
  theQuestion.style.cssText = "opacity :0.5; ";

  bullets.classList.remove("fade-in-animation");
  bullets.style.cssText="opacity:0.5";
}
function prevTransitions(){
  prevButton.classList.add("active-btn");
  prevButton.classList.remove("fade-in-animation-prev")
  prevButton.style.cssText=" cursor:pointer; opacity:1;"
}
function clickedAnAnswerAlert() {
  let anyAnswerChecked = Array.from(answersInputElements);
  anyAnswerChecked.forEach((e) =>e.onclick =()=> clickedAlert = true);
}
function startClicked() {
  //so if double clicked the addQuestionData won`t be repeated
  start.removeEventListener("click", startClicked);

  localStorage.setItem("JSON_Questions",JSON.stringify(questionsObject))
  theKeysOfquestionsObject=Object.keys(questionsObject).map((e)=>parseInt(e));
  addQuestionData(questionsObject[currentIndex], count);
  transitions();
  clickedAnAnswerAlert(); 
  submitButton.onclick = () => {
    if (clickedAlert == true) {
      prevTransitions();            
      checkAnswer(count); 
      currentIndex++;
      checkExist();
      if(currentIndex !== count){
        clickedAlert = false; //IF it is Existing in the next fun call, TRUE otherwise still FALSE.
        addQuestionData(questionsObject[currentIndex], count);
        handleBullets();
      }
      else if(currentIndex == count ){
        countRightAnswers();  
        showResults(count);
      }
    } 
    else {
      Swal.fire(
        "You Did Not Choose an Answer?",
        "Please, Choose One Of Them.",
        "question"
      );
    }
    //if clickedAlert still false; it won`t bring QuestionData again.
    clickedAnAnswerAlert();
  };        
  prevButton.onclick = () => {
    if (clickedAlert == true) {
      handleBulletsPrev();//Before currentIndex--; so it removes a bullet.
      checkAnswer(count)
      checkExist();
      currentIndex--;
      tip.classList.remove("tooltiptext");
      tip.innerHTML=``;
      if(currentIndex==0) {
        prevButton.style.cssText="opacity: 0.5; pointer-events:none;"
        prevButton.classList.remove("active-btn");
      }  
      addQuestionData(questionsObject[currentIndex], count);
      
      for (let i=0 ; i<count; i++) {
        if(currentIndex == theKeysOfquestionsObject[i]){
          for(let j=0; j<answersInputElements.length;j++){
            if(labelsArr[j].textContent==JSON.parse(localStorage.getItem(currentIndex))){
              answersInputElements[j].checked = true;
              clickedAlert = true;
            } 
          }
        }
      handleBullets(); 
      }
    } 
    else {
    Swal.fire(
      "You Did Not Choose an Answer?",
      "Please, Choose One Of Them.",
      "question"
    );
    }
  };
};
//Start Main Function
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      questionsObject = JSON.parse(this.responseText);
      count = questionsObject.length;
      countSpan.innerHTML = `1 / ${count}`;
      start.addEventListener("click", startClicked) ; 
    }
  };
  myRequest.open("GET", "html_questions.json",true);
  myRequest.send();
}
getQuestions();
//End Main Function