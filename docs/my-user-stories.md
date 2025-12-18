# Typing Test – Product Spec (Bootcamp)

This file will be the canonical source for the bootcamp course stories. You can paste the official course stories here; current content mirrors the previous spec until replaced.

## Product Goal
Help users improve their typing speed and accuracy through an easy-to-use, responsive web app that delivers instant feedback and tracks performance over time.

## User Needs & Goals
- Easy to use interface
- Instant feedback while typing
- Performance tracking over time
- Measure and improve typing speed
- Know how to take the test
- Easily take the test
- Take a test relevant to ability level
- Use the test on different devices
- See accurate results including WPM

---

## User Stories, Acceptance Criteria, and Tasks

### 1) Onboarding & Instructions
**Story:** As a first-time visitor, I want clear instructions so that I can understand how to take the typing test.

**Acceptance Criteria**
- Given I open the site for the first time, when I land on the homepage, then I see a brief, dismissible guide explaining start, pause, finish, and scoring (WPM, accuracy).
- Given I close the guide, when I need help later, then I can reopen instructions via a visible “How it works” link.
- Given I navigate on mobile, when the guide appears, then it is readable and fits the screen without horizontal scrolling.

**Tasks**
- Build an onboarding modal or panel (HTML/CSS) with concise steps.
- Add a persistent “Help/How it works” control.
- Store dismissal in `localStorage` to avoid re-showing automatically.

### 2) Simple Test Interface
**Story:** As a user, I want a clean interface so that I can start, pause, and finish the test easily.

**Acceptance Criteria**
- Given I’m on the test page, when I press “Start”, then the input field is focused and the timer begins.
- Given the test is running, when I press “Pause”, then input is disabled and the timer stops.
- Given I finish the text or click “Finish”, when results are shown, then input is disabled and I can restart.
- Given I’m using a small screen, when I interact with controls, then primary actions remain visible and accessible.

**Tasks**
- Implement Start/Pause/Finish controls with accessible labels.
- Auto-focus input on Start; disable on Pause/Finish.
- Layout with responsive CSS; ensure key controls stay visible.

### 3) Instant Feedback While Typing
**Story:** As a learner, I want instant feedback so that I can correct mistakes quickly and see my progress.

**Acceptance Criteria**
- Given I type a character, when it matches the next target character, then it is marked correct; otherwise it’s highlighted as an error.
- Given I’m typing, when I make mistakes, then error count updates immediately.
- Given the timer is running, when I type, then live WPM and accuracy update at least every 250ms.

**Tasks**
- Implement per-character comparison and error highlighting.
- Live calculations: keystrokes, correct chars, errors.
- Render live WPM/accuracy indicators.

### 4) Accurate Results Summary
**Story:** As a user, I want an accurate results summary so that I can measure my typing speed.

**Acceptance Criteria**
- Given I finish or click “Finish”, when results appear, then I see time, characters typed, errors, accuracy (%), and WPM.
- WPM calculation uses: `WPM = floor((correctChars / 5) / minutes)`.
- Accuracy calculation uses: `Accuracy = floor((correctChars / totalTypedChars) * 100)`.
- Given I review results, when I want to retake, then a visible “Restart” starts a new test immediately.

**Tasks**
- Implement end-of-test summary view.
- Compute WPM and accuracy deterministically.
- Provide Restart control and clear previous state.

### 5) Difficulty & Relevance
**Story:** As a user, I want to pick an appropriate difficulty so that I can take a test relevant to my ability level.

**Acceptance Criteria**
- Given I open difficulty settings, when I select Beginner/Intermediate/Advanced, then the test text updates accordingly.
- Given I pick text length (short/medium/long), when I start the test, then the timer and target text reflect my choice.
- Given I want variety, when I start a new test, then a new text sample is loaded for the selected difficulty.

**Tasks**
- Difficulty selector UI and text sets per level.
- Text length selector and sample pool.
- Randomize sample selection per run.

### 6) Multi-Device Responsiveness
**Story:** As a mobile user, I want a responsive design so that I can use the test on different devices.

**Acceptance Criteria**
- Given viewport widths 360px–1200px, when I load the page, then layout adapts without horizontal scroll.
- Given I use a touch keyboard, when I type, then input and feedback work without keyboard-specific issues.
- Given I rotate the device, when orientation changes, then content remains usable and controls accessible.

**Tasks**
- Responsive CSS grid/flex layout with breakpoints.
- Test on common widths: 360, 768, 1024, 1440.
- Ensure input focus/zoom behaviors are handled on mobile.

### 7) Performance Tracking
**Story:** As a returning user, I want to track my performance so that I can see improvement over time.

**Acceptance Criteria**
- Given I complete a test, when results are saved, then a record is stored client-side with date, difficulty, length, WPM, accuracy, errors, and duration.
- Given I open History, when I view past sessions, then I see a list and a simple trend indicator (e.g., sparkline for WPM).
- Given I want to clear data, when I choose “Reset history”, then tracked records are deleted after confirmation.

**Tasks**
- Persist results with `localStorage` (schema v1).
- History view (list + minimal trend visualization).
- Clear/reset functionality with confirm dialog.

### 8) Practice Modes & Drills
**Story:** As a learner, I want practice modes so that I can improve speed and accuracy on specific skills.

**Acceptance Criteria**
- Given I open Practice, when I select “Common words”, “Numbers”, or “Punctuation”, then the target text changes to that category.
- Given I start a drill, when I type, then live accuracy and error highlighting behave as in the main test.
- Given I finish a drill, when results appear, then WPM/accuracy are computed and saved to history (flagged as Practice).

**Tasks**
- Practice mode selector and text generation.
- Reuse typing/feedback logic.
- Tag practice sessions in tracking.

### 9) Accessibility
**Story:** As an accessibility-focused user, I want support features so that I can use the test comfortably.

**Acceptance Criteria**
- Given I navigate with keyboard only, when I tab through, then all controls are reachable and have visible focus.
- Given I use a screen reader, when I start typing, then live region announcements summarize errors and current status without being verbose.
- Given I need high contrast, when I toggle “High contrast”, then error/correct states remain distinguishable.

**Tasks**
- Ensure semantic HTML, ARIA roles, and live regions.
- Keyboard focus order and focus styles.
- High-contrast theme toggle.

### 10) Reliable Session Control
**Story:** As a user, I want reliable pause/restart controls so that I can manage interruptions.

**Acceptance Criteria**
- Given a running test, when I press Pause, then the timer and input stop instantly and status reads “Paused”.
- Given a paused test, when I press Resume, then the timer and input resume without data loss.
- Given I restart, when I confirm, then a fresh test begins and previous progress is not carried over.

**Tasks**
- Implement pause/resume state machine.
- Guard against double starts/finishes.
- Confirmation for restart.

---

## Technical Notes
- WPM formula: `WPM = floor((correctChars / 5) / minutes)`; Accuracy: `floor((correctChars / totalTypedChars) * 100)`.
- Track both Gross WPM (raw) and Accuracy; optionally show Net WPM.
- Persist history via `localStorage` with versioned schema for forward compatibility.
- Responsive layout via CSS Flex/Grid; test common breakpoints.
- Keep inputs debounced for live metrics updates (~250ms).
