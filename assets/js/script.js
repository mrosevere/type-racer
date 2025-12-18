// Typing test interactions: start/stop actions and simple timing/wpm calculation.

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const retryBtn = document.getElementById('retryBtn');
const userInput = document.getElementById('userInput');
const sampleText = document.getElementById('sampleText');
const resultLevel = document.getElementById('resultLevel');
const resultTime = document.getElementById('resultTime');
const resultWPM = document.getElementById('resultWPM');
const resultAccuracy = document.getElementById('resultAccuracy');
const difficultySelect = document.getElementById('difficultySelect');

// Sample texts by difficulty.
const samples = {
	easy: [
		'The cat sat on the mat.',
		'Practice makes perfect.',
		'Type fast and stay calm.',
		'Coffee fuels the morning.',
	],
	medium: [
		'Typing swiftly requires rhythm and accuracy.',
		'Consistent practice improves both speed and precision.',
		'Short breaks help maintain focus over longer sessions.',
		'Clear goals make training more motivating and measurable.',
	],
	hard: [
		'Complex punctuation, mixed casing, and numbers test true fluency.',
		'Sustained accuracy under pressure is the hallmark of expertise.',
		'Train deliberately: posture, breathing, and controlled keystrokes.',
		'Measure net WPM, not just raw speed, to reflect real accuracy.',
	],
};

let isRunning = false;
let startTimeMs = 0;
let elapsedMs = 0;
let timerId = null;
let currentSample = samples.easy[0];

function setRunningState(running) {
	isRunning = running;
	startBtn.disabled = running;
	stopBtn.disabled = !running;
	retryBtn.disabled = running; // prevent conflicting resets while running
	userInput.disabled = !running;
}

function pickSample() {
	const level = (difficultySelect?.value || 'easy').toLowerCase();
	const bucket = samples[level] || samples.easy;
	const randomIndex = Math.floor(Math.random() * bucket.length);
	currentSample = bucket[randomIndex];
}

function renderSample() {
	if (sampleText) {
		sampleText.textContent = currentSample;
	}
}

function resetTest() {
	clearInterval(timerId);
	timerId = null;
	startTimeMs = 0;
	elapsedMs = 0;
	userInput.value = '';
	updateResults();
	setRunningState(false);
	userInput.placeholder = 'Click the start button to begin the test';
	pickSample();
	renderSample();
}

function updateResults() {
	const elapsedSeconds = Math.floor(elapsedMs / 1000);
	resultTime.textContent = `${elapsedSeconds}s`;

	const text = userInput.value.trim();
	const words = text.length ? text.split(/\s+/).length : 0;
	const minutes = elapsedMs > 0 ? elapsedMs / 60000 : 0;
	const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
	resultWPM.textContent = `${wpm}`;

	// Simple accuracy placeholder: compares typed chars to sample length.
	const typedChars = text.length;
	const target = sampleText.textContent.trim();
	const targetChars = target.length;
	const correctChars = Math.min(typedChars, targetChars);
	const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;
	resultAccuracy.textContent = `${accuracy}%`;
}

function tick() {
	elapsedMs = Date.now() - startTimeMs;
	updateResults();
}

function startTest() {
	if (isRunning) return;
	pickSample();
	renderSample();
	setRunningState(true);
	startTimeMs = Date.now();
	elapsedMs = 0;
	userInput.value = '';
	userInput.placeholder = 'Type the text shown above...';
	userInput.focus();
	timerId = setInterval(tick, 500);
}

function stopTest() {
	if (!isRunning) return;
	clearInterval(timerId);
	tick(); // final update
	setRunningState(false);
}

function bindEvents() {
	startBtn?.addEventListener('click', startTest);
	stopBtn?.addEventListener('click', stopTest);
	retryBtn?.addEventListener('click', resetTest);
	difficultySelect?.addEventListener('change', (e) => {
		resultLevel.textContent = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
		resetTest();
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setRunningState(false);
	stopBtn.disabled = true;
	retryBtn.disabled = false;
	userInput.disabled = true;
	pickSample();
	renderSample();
	bindEvents();
});
