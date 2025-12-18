# TypeRacer GitHub Issues Creation Script
# This script creates labels and GitHub issues from the user stories
# Prerequisites: GitHub CLI (gh) must be installed and authenticated

Write-Host "Creating GitHub Labels and Issues for TypeRacer User Stories..." -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
try {
    $null = gh --version
} catch {
    Write-Host "Error: GitHub CLI (gh) is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Creating labels..." -ForegroundColor Green
Write-Host ""

# Create priority labels
gh label create "must-have" --color "d73a4a" --description "Critical feature" --force
gh label create "should-have" --color "fbca04" --description "Important feature" --force
gh label create "could-have" --color "0e8a16" --description "Nice to have feature" --force
gh label create "user-story" --color "1d76db" --description "User story" --force

Write-Host "Labels created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Step 2: Creating issues..." -ForegroundColor Green
Write-Host ""

# Issue 1: Responsive and accessible design (must-have)
$body1 = @'
## User Story
As a general user, I want the website to be responsive on various devices so that I can take the typing test on my preferred device.

## Acceptance Criteria
- [ ] The website layout adapts to different screen sizes (desktop, tablet, smartphone).

## Tasks
- [ ] Implement responsive design for the website to adapt to different screen sizes (desktop, tablet, smartphone)
'@

gh issue create --title "Responsive and accessible design" --body $body1 --label "must-have,user-story"
Write-Host "Created: Responsive and accessible design" -ForegroundColor Green

# Issue 2: Start and stop actions (must-have)
$body2 = @'
## User Story
As a casual user, I want to start and stop the typing speed test so that I can accurately measure my typing speed.

## Acceptance Criteria
- [ ] The test begins by user action, such as clicking a start button
- [ ] The test ends by user action, such as clicking a stop button
- [ ] It is clear to the user how they can start and stop the test

## Tasks
- [ ] Create a user action that triggers the start of the test
- [ ] Create a user action that triggers the end of the test
- [ ] Create clear actions the user needs to take to start and stop the test
'@

gh issue create --title "Start and stop actions" --body $body2 --label "must-have,user-story"
Write-Host "Created: Start and stop actions" -ForegroundColor Green

# Issue 3: Display typing test sample text (must-have)
$body3 = @'
## User Story
As a user, I want to see a sample of text to type so that I know what I need to type to measure my speed.

## Acceptance Criteria
- [ ] A sentence of sample text is clearly visible and formatted for easy reading.
- [ ] The sample text is randomly chosen from a set selection for each level of difficulty. (easy, medium or hard)

## Tasks
- [ ] Implement functionality to display a random paragraph of text upon starting the test, depending on the level of difficulty selected by the user.
- [ ] Ensure the text is clearly visible and formatted for easy reading.
'@

gh issue create --title "Display typing test sample text" --body $body3 --label "must-have,user-story"
Write-Host "Created: Display typing test sample text" -ForegroundColor Green

# Issue 4: User typing input section (must-have)
$body4 = @'
## User Story
As a user, I want a dedicated area to type the displayed text so that I can input my typing accurately.

## Acceptance Criteria
- [ ] An editable text area is provided separate from the displayed text.
- [ ] The text area is initially empty and ready for user input.
- [ ] The text area contains a placeholder that indicates how to start the test.

## Tasks
- [ ] Add an editable text area for user input.
- [ ] Ensure the text area starts empty and is ready for typing.
- [ ] Ensure the text area placeholder text indicates to the user how to start the test.
'@

gh issue create --title "User typing input section" --body $body4 --label "must-have,user-story"
Write-Host "Created: User typing input section" -ForegroundColor Green

# Issue 5: Calculate and display Words Per Minute (WPM) (must-have)
$body5 = @'
## User Story
As a user, I want to see my typing speed calculated in Words Per Minute (WPM) when I finish typing so that I know my typing performance.

## Acceptance Criteria
- [ ] WPM is calculated based on the number of correctly typed words and elapsed time.
- [ ] The difficulty level and WPM result is displayed immediately after completing the test.

## Tasks
- [ ] Create a results area to display the level, time and Words Per Minute (WPM) results to the user
- [ ] Implement functionality to calculate the number of correctly typed WPM.
- [ ] Display the WPM result with the level and time immediately after the user completes the test.
'@

gh issue create --title "Calculate and display Words Per Minute (WPM)" --body $body5 --label "must-have,user-story"
Write-Host "Created: Calculate and display Words Per Minute (WPM)" -ForegroundColor Green

# Issue 6: Retry button (should-have)
$body6 = @'
## User Story
As a user, I want to be able to easily retry my typing speed test so that I can work on improving my typing speed.

## Acceptance Criteria
- [ ] A retry button is clearly visible on the web page
- [ ] When the retry button is clicked, a new test is set up at the same difficulty level as the previous one.

## Tasks
- [ ] Add a "Retry" button to the typing test.
- [ ] Ensure clicking the "Retry" button resets the test for a new attempt at the same difficulty level as the previous test.
'@

gh issue create --title "Retry button" --body $body6 --label "should-have,user-story"
Write-Host "Created: Retry button" -ForegroundColor Green

# Issue 7: Real-time feedback on typing accuracy (should-have)
$body7 = @'
## User Story
As a user, I want to see real-time feedback on my typing accuracy so that I can immediately know if I am making errors.

## Acceptance Criteria
- [ ] As the user types, correctly typed words are highlighted in blue.
- [ ] As the user types, incorrectly typed words are highlighted in red.

## Tasks
- [ ] Implement the functionality to highlight correctly typed words in blue and incorrectly typed words in red.
- [ ] Ensure the highlighting happens in real time as the user is typing.
'@

gh issue create --title "Real-time feedback on typing accuracy" --body $body7 --label "should-have,user-story"
Write-Host "Created: Real-time feedback on typing accuracy" -ForegroundColor Green

# Issue 8: Test instructions modal (should-have)
$body8 = @'
## User Story
As a new user, I want clear instructions on how to use the typing speed test so that I know how to start and complete the test.

## Acceptance Criteria
- [ ] Clear instructions on how to take the test are provided on the homepage.
- [ ] Instructions are easy to understand and follow.

## Tasks
- [ ] Create a modal that displays clear instructions to the user on how to take the test.
- [ ] Add a clearly visible button on the web page to open the instructions modal.
'@

gh issue create --title "Test instructions modal" --body $body8 --label "should-have,user-story"
Write-Host "Created: Test instructions modal" -ForegroundColor Green

# Issue 9: Display best test results for each difficulty level (could-have)
$body9 = @'
## User Story
As a competitive user, I want my best results for each difficulty level to be displayed so that I can compare my progress.

## Acceptance Criteria
- [ ] The best test result for each level is stored
- [ ] The best test result for each level is displayed on the site

## Tasks
- [ ] Create an area to display the best test results for each level of difficulty
- [ ] The best test result for each level is stored and displayed to the user
'@

gh issue create --title "Display best test results for each difficulty level" --body $body9 --label "could-have,user-story"
Write-Host "Created: Display best test results for each difficulty level" -ForegroundColor Green

Write-Host ""
Write-Host "All 9 issues created successfully!" -ForegroundColor Green
Write-Host ""
