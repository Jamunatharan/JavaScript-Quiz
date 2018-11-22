// List of questions. First mentioned answer is correct one.

var questions = [{
	question: "Inside which HTML element do we put the JavaScript?",
	answers: ["<script>", "<javascript>", "<scripting>", "<js>"]
}, {
	question: "Where is the correct place to insert a JavaScript?",
	answers: ["Both the <head> section and the <body> section are correct", "The <body> section", "The <head> section", "The <title> section"]
}, {
	question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
	answers: ['<script src="xxx.js">', '<script href="xxx.js">', '<script name="xxx.js">', '<javaScript src="xxx.js">']
}, {
	question: 'How do you write "Hello World" in an alert box?',
	answers: ['alert("Hello World");', 'msgBox("Hello World");', 'alertBox("Hello World");', 'msg("Hello World");']
}, {
	question: "How do you create a function in JavaScript?",
	answers: ["function myFunction()", "function:myFunction()", "function = myFunction()", "function myFunction"]
}, {
	question: "How to write an IF statement in JavaScript?",
	answers: ["if (i == 5)", "if i == 5 then", "if i = 5 then", "if i = 5"]
}, {
	question: 'How to write an IF statement for executing some code if "i" is NOT equal to 5?',
	answers: ["if (i != 5)", "if i =! 5 then", "if i <> 5", "if (i <> 5)"]
}, {
	question: "How does a WHILE loop start?",
	answers: ["while (i <= 10)", "while i = 1 to 10", "while (i <= 10; i++)", "while (i=0; i <= 10; i++)"]
}, {
	question: "How does a FOR loop start?",
	answers: ["for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)", "for (i <= 5; i++)", "for i = 1 to 5"]
}, {
	question: "How can you add a comment in a JavaScript?",
	answers: ["//This is a comment", "'This is a comment", "<!--This is a comment-->", "<%-- This is a Comment --%>"]
}];

// Generic function to return a shuffled array:

function shuffled(arr) {

	arr = arr.slice(); // shallow copy
	for (var i = 0; i < arr.length; i++) {
		var j = Math.floor(Math.random() * (arr.length - i)) + i;
		[arr[i], arr[j]] = [arr[j], arr[i]]; // swap
	}

	return arr;
}

// define variables for some of the HTML elements:

var domQuestion = document.querySelector('#question');

var domAnswers = Array.from(document.querySelectorAll('input[name=answer]'));

document.getElementById("piechart").style.display = 'none';

document.getElementById("startBtn").addEventListener("click", onStartQuizClick);

document.getElementById("tryAgainBtn").addEventListener("click", refreshPage);

// Refresh the page to reset the timer

function refreshPage() {

	window.location.reload();
}

function onStartQuizClick() {	

	correctAnswers = 0;

	progressWidth = 0;

	wrongAnswers = 0;

	document.getElementById("quizDisplayId").style.display = 'block';
	document.getElementById("piechart").style.display = 'block';	

	displayQuestion();

	document.getElementById("startBtn").style.display = 'none';
	document.getElementById("tryAgainBtn").style.display = 'none';	
	document.getElementById("displayAnswer").innerHTML = '';	
	document.getElementById("timer").style.display = 'block';

	// Set timer minutes and seconds

	$(document).ready(function (e) {
		var $timer = $("#timer");

		function update() {
			var myTime = $timer.html();
			var ss = myTime.split(":");
			var dt = new Date();
			dt.setHours(0);
			dt.setMinutes(ss[0]);
			dt.setSeconds(ss[1]);
			var dt2 = new Date(dt.valueOf() + 1000);
			var temp = dt2.toTimeString().split(" ");
			var ts = temp[0].split(":");
			$timer.html(ts[1]+":"+ts[2]);
			setTimeout(update, 1000);
		}

		setTimeout(update, 1000);		
	});

	//progressMove();
	drawChart();
}

function displayQuestion() {

	// get a random order for the answers:

	var answers = shuffled(questions[questionId].answers);

	// Display question

	domQuestion.textContent = (questionId+1) + '. ' + 
		questions[questionId].question;
	domAnswers.forEach(function (input, i){

		// Set checkbox value and unselect it

		input.value = answers[i];

		input.checked = false;

		// Display the answer text

		input.nextElementSibling.textContent = answers[i];
	});
}

// Show the percentage of quetions completed

var progressWidth = 0;

function progressMove() {

	var element1 = document.getElementById("myBar");	

	if (progressWidth < 100) {

		progressWidth += 10;

		element1.style.width = progressWidth + '%';

		element1.innerHTML = progressWidth * 1 + '%';
	}	
}

// Initialise and display first question

var questionId = 0;
var correctAnswers = 0;
var wrongAnswers = 0;
var quetionsAnswered = 0; 
displayQuestion();

// Respond to a click on the Next button 

document.getElementById("nextBtn").addEventListener('click', onNextClick);

function onNextClick() {

	// update correct answer counter:

	var domAnswer = domAnswers.find(input => input.checked);	

	if (!domAnswer) {

		document.getElementById("selectAnswer").innerHTML = "* Please select an answer"; // nothing was selected

	} else {

		document.getElementById("selectAnswer").innerHTML = " ";
		progressMove();
	}

	// update number of correctly answered questions:

	if (domAnswer.value == questions[questionId].answers[0]) {

		correctAnswers++;		
	}

	if (domAnswer.value != questions[questionId].answers[0]) {

		wrongAnswers++;
	}	

	quetionsAnswered = questions.length - (wrongAnswers + correctAnswers);
	// next question

	questionId++;

	if (questionId === 9) {

		document.getElementById("nextBtn").innerHTML = "Finish";

	} else {

		document.getElementById("nextBtn").innerHTML = "Next";
	}

	if (questionId >= questions.length) {   

		var currentTimer = document.getElementById("timer").innerHTML;

		document.getElementById("timer").style.display = 'none';

		document.getElementById("displayAnswer").style.display = 'block';

		document.getElementById("displayAnswer").innerHTML = 'You have answered ' + correctAnswers + 
			' of ' + questions.length + ' questions correctly.';
		
		var minutesSlice = currentTimer.slice(0,2);
		var secondsSlice = currentTimer.slice(3);		

		document.getElementById("displayTimer").innerHTML = "You have taken " + minutesSlice + " minutes and " + secondsSlice + " seconds.";		

		if (correctAnswers === questions.length) {

			document.getElementById("displayGreeting").style.display = 'block';

			document.getElementById("displayGreeting").innerHTML = "Well done!";

		} else {

			document.getElementById("tryAgainBtn").style.display = 'block';

		}

		document.getElementById("quizDisplayId").style.display = 'none';		

		// restart
		questionId = 0;
		//correctAnswers = 0;
	}	

	displayQuestion();

	drawChart();

}//);

// Load pie chart

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

	var answeredQuestion = questions.length;	

	var data = google.visualization.arrayToDataTable([
		['Task', 'Hours per Day'],
		['Quetions to answer'+ " : " + quetionsAnswered, quetionsAnswered],
		['Correct answers'+ " : " + correctAnswers, correctAnswers],
		['Wrong answers'+ " : " + wrongAnswers, wrongAnswers]

	]);

	var options = {
		title: 'How you did?',
		chartArea:{
			left:10,
			top:10,
			bottom:10,
			width:'100%',
			height:'100%',
			is3D: true

		}
	};

	var options = {

		title: 'Your Score',
		colors: ['#006594', '#4CAF50', '#fc4204']
	};

	var chart = new google.visualization.PieChart(document.getElementById('piechart'));

	chart.draw(data, options);
}