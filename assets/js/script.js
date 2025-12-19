// ========================================
// TypeRacer - Simple Typing Speed Test
// ========================================

// GET HTML ELEMENTS
// These are the buttons and displays on the page
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
const bestEasy = document.getElementById('bestEasy');
const bestMedium = document.getElementById('bestMedium');
const bestHard = document.getElementById('bestHard');

// TEXT SAMPLES FOR EACH DIFFICULTY
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

// TRACK TEST STATE
let isRunning = false;
let startTimeMs = 0;
let elapsedMs = 0;
let timerId = null;
let currentSample = samples.easy[0];
const STORAGE_KEY = 'typeracerBestResults';

// ========================================
// HELPER FUNCTIONS
// ========================================

// Safely display text (prevents code injection)
function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// Pick a random sample for the chosen difficulty level
function pickSample() {
	const difficulty = (difficultySelect?.value || 'easy').toLowerCase();
	const textList = samples[difficulty] || samples.easy;
	const randomIndex = Math.floor(Math.random() * textList.length);
	currentSample = textList[randomIndex];
}

// Show sample text with colors (green = correct, red = wrong)
function renderHighlightedSample(typedWords) {
	if (!sampleText) return;
	
	const targetWords = currentSample.split(/\s+/);
	const coloredWords = targetWords.map((targetWord, index) => {
		const typedWord = typedWords[index] ?? null;
		
		// Not typed yet - normal color
		if (typedWord === null || typedWord === '') {
			return `<span class="word-neutral">${escapeHtml(targetWord)}</span>`;
		}
		
		// Typed correctly - blue
		if (typedWord === targetWord) {
			return `<span class="word-correct">${escapeHtml(targetWord)}</span>`;
		}
		
		// Typing the word right now - normal
		if (targetWord.startsWith(typedWord)) {
			return `<span class="word-neutral">${escapeHtml(targetWord)}</span>`;
		}
		
		// Typed wrong - red
		return `<span class="word-incorrect">${escapeHtml(targetWord)}</span>`;
	});
	
	sampleText.innerHTML = coloredWords.join(' ');
}

// Show the sample without any colors
function renderSample() {
	if (sampleText) {
		renderHighlightedSample([]);
	}
}

// Turn buttons on/off based on whether test is running
function setRunningState(running) {
	isRunning = running;
	// startBtn.disabled = running;      // Can't start twice
	// stopBtn.disabled = !running;      // Can only stop while running
	retryBtn.disabled = running;      // Can't retry while running
	userInput.disabled = !running;    // Can only type while running
}

// ========================================
// TEST CONTROL
// ========================================

// Start a new test
function startTest() {
	if (isRunning) return; // Already started
	
	setRunningState(true);
	
	// Reset the timer and input
	startTimeMs = Date.now();
	elapsedMs = 0;
	userInput.value = '';
	userInput.placeholder = 'Type the text shown above...';
	userInput.focus();
	
	// Update results every 0.5 seconds
	timerId = setInterval(() => {
		elapsedMs = Date.now() - startTimeMs;
		updateResults();
	}, 500);
}

// Stop the test
function stopTest() {
	if (!isRunning) return; // Not running
	
	clearInterval(timerId);
	elapsedMs = Date.now() - startTimeMs; // Get final time
	updateResults(); // Show final results
	setRunningState(false); // Stop allowing typing
	saveIfBest(); // Save if this is the best score
}

// Reset everything to start fresh
function resetTest() {
	// Stop the test first if it's running
	if (isRunning) {
		clearInterval(timerId);
		isRunning = false;
	}
	
	clearInterval(timerId);
	isRunning = false;
	startTimeMs = 0;
	elapsedMs = 0;
	userInput.value = '';
	userInput.placeholder = 'Start typing to begin the test...';
	
	updateResults();
	pickSample();
	renderSample();
	setRunningState(false);
	userInput.disabled = false;  // Keep enabled for auto-start
}

// ========================================
// CALCULATE RESULTS
// ========================================

// Calculate WPM and accuracy
function updateResults() {
	// Time in seconds
	const elapsedSeconds = Math.floor(elapsedMs / 1000);
	resultTime.textContent = `${elapsedSeconds}s`;

	// Words Per Minute (WPM)
	const typedText = userInput.value.trim();
	const wordCount = typedText.length ? typedText.split(/\s+/).length : 0;
	const minutes = elapsedMs > 0 ? elapsedMs / 60000 : 0;
	const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;
	resultWPM.textContent = `${wpm}`;

	// Accuracy - check each character typed
	const typedChars = userInput.value.length;
	
	if (typedChars === 0) {
		resultAccuracy.textContent = '0%';
		return;
	}
	
	// Count how many characters are correct
	let correctChars = 0;
	for (let i = 0; i < typedChars; i++) {
		if (i < currentSample.length && userInput.value[i] === currentSample[i]) {
			correctChars++;
		}
	}
	
	// Calculate percentage
	const accuracy = Math.round((correctChars / typedChars) * 100);
	resultAccuracy.textContent = `${accuracy}%`;
}

// Update colors while user is typing
function handleTyping() {

	// Auto-start the test on first keystroke
    if (!isRunning && userInput.value.length > 0) {
        startTest();
        return; // Let the next input event handle the highlighting
    }

	const typedText = userInput.value;
	const typedWords = typedText.length ? typedText.split(/\s+/) : [];
	
	if (typedText.endsWith(' ')) {
		typedWords.push('');
	}
	
	renderHighlightedSample(typedWords);
	updateResults();
}

// ========================================
// BEST RESULTS
// ========================================

// Get best scores from browser storage
function getBestResults() {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		return JSON.parse(stored);
	}
	return { easy: null, medium: null, hard: null };
}

// Save a best result
function saveBestResult(difficulty, wpm, accuracy, time) {
	const allBest = getBestResults();
	allBest[difficulty] = { wpm, accuracy, time };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(allBest));
	displayBestResults();
}

// Check if current score is better than best, and save if it is
function saveIfBest() {
	const difficulty = (difficultySelect?.value || 'easy').toLowerCase();
	const currentWpm = parseInt(resultWPM.textContent) || 0;
	const currentAccuracy = parseInt(resultAccuracy.textContent) || 0;
	const currentTime = resultTime.textContent;
	
	if (currentWpm === 0) return; // No valid result
	
	const allBest = getBestResults();
	const bestForDifficulty = allBest[difficulty];
	
	// Save if first time or better than previous best
	if (!bestForDifficulty || currentWpm > bestForDifficulty.wpm) {
		saveBestResult(difficulty, currentWpm, currentAccuracy, currentTime);
	}
}

// Show all best results on the page
function displayBestResults() {
	const allBest = getBestResults();
	
	if (allBest.easy && bestEasy) {
		bestEasy.textContent = `${allBest.easy.wpm} WPM | ${allBest.easy.accuracy}% | ${allBest.easy.time}`;
	}
	
	if (allBest.medium && bestMedium) {
		bestMedium.textContent = `${allBest.medium.wpm} WPM | ${allBest.medium.accuracy}% | ${allBest.medium.time}`;
	}
	
	if (allBest.hard && bestHard) {
		bestHard.textContent = `${allBest.hard.wpm} WPM | ${allBest.hard.accuracy}% | ${allBest.hard.time}`;
	}
}

// ========================================
// SETUP
// ========================================

// Connect buttons to functions
function setupEventListeners() {
	// startBtn?.addEventListener('click', startTest);
	stopBtn?.addEventListener('click', stopTest);
	retryBtn?.addEventListener('click', resetTest);
	userInput?.addEventListener('input', handleTyping);
	
	// Stop test when Enter key is pressed
	userInput?.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && isRunning) {
			e.preventDefault(); // Prevent newline in textarea
			stopTest();
		}
	});
	
	difficultySelect?.addEventListener('change', (e) => {
		const newDifficulty = e.target.value;
		resultLevel.textContent = newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1);
		resetTest();
	});
}

// Run when page loads
document.addEventListener('DOMContentLoaded', () => {
	// Set initial state
	setRunningState(false);
	// stopBtn.disabled = true;
	retryBtn.disabled = false;
	userInput.disabled = false;  // Enable input right away
    userInput.placeholder = 'Start typing to begin the test...';
	
	// Show first sample and best results
	pickSample();
	renderSample();
	displayBestResults();
	
	// Connect all buttons
	setupEventListeners();
});
