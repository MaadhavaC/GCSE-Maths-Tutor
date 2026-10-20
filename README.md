# Maths Hint Ladder

An interactive maths tutor covering **Key Stage 3 (Years 7, 8 and 9)**, building up to GCSE. It teaches with **hints, questions and explanations**, and it doesn't hand you the answer straight away.

## How to use it

1. Download or clone this folder.
2. Double-click `index.html`. It opens in your web browser. There's nothing to install.

### Install it as an app

The Maths Hint Ladder is a **Progressive Web App** (PWA). That means once it's on a website, you can install it like an app. It gets its own icon, opens full screen without the browser bars, and works offline.

1. **Put it online for free with GitHub Pages:** in this repository on GitHub, go to **Settings → Pages**, choose **Deploy from a branch**, pick your branch and the `/ (root)` folder, then click **Save**. After a minute GitHub gives you a link like `https://your-name.github.io/SustainG/`.
2. **Install it:**
   - **Android phone (Chrome):** open the link, then tap **Install app** on the page (or ⋮ → **Install app**).
   - **iPhone or iPad (Safari):** open the link, tap the **Share** button, then **Add to Home Screen**.
   - **Computer (Chrome or Edge):** click **Install app** on the page, or the install icon in the address bar.

Opening `index.html` straight from your computer still works, but you can only install it and use it offline when it comes from a website (`https://`), because browsers only allow offline mode on websites.

There are three tabs:

| Tab | What it does |
|---|---|
| **Practise** | Choose a strand, a year and a topic. When you're stuck, climb the hint ladder: a nudge, then a guiding question, then the next step. The worked solution is only the very last rung. |
| **Quiz** | 8 questions with **no hints**, on one topic, a whole strand or everything mixed. Use it to measure how much you know (see "Does it actually work?" below). |
| **My progress** | Your results for each topic, quiz scores, a before/after comparison, and a button to copy everything into a spreadsheet. |

### Features

- **33 topics** across the five strands of the Key Stage 3 curriculum (listed below), with a Year 7 / 8 / 9 filter
- **Hint ladder:** 3 hints that get gradually more helpful, then the worked solution
- **Mistake spotting:** recognises common errors (forgetting to multiply the second term, sign slips, squaring a negative, using the diameter instead of the radius, forgetting to flip an inequality) and says what went wrong
- **"Almost" answers:** if your answer is equal to the right one but in the wrong form (a fraction that isn't simplified, a bracket left in, a number not rounded, a ratio not fully simplified), it tells you that instead of just marking it wrong
- **Lots of answer types:** numbers, expressions, fractions, ratios, inequalities, pairs of answers (x = 3, y = 2), standard form, prime factors, and exact answers with π
- **Endless questions:** every question is made up randomly, so you never run out
- **Foundation, Higher and Auto levels:** Auto moves you up after 3 correct in a row (with 1 hint or fewer) and back down after 2 solutions shown in a row
- **Progress tracking:** saved in your browser
- **Quiz mode:** no hints, for testing yourself

## Topics

| Strand | Topics (year) |
|---|---|
| **Number** | Negative numbers (Y7) · Order of operations / BIDMAS (Y7) · Rounding to d.p. and s.f. (Y7–8) · HCF and LCM (Y7) · Prime factors (Y8) · Fractions (Y7–8) · Fractions, decimals, percentages (Y7) · Percentages (Y7–9) · Powers and roots (Y7–8) · Standard form (Y9) |
| **Algebra** | Simplifying expressions (Y7) · Substitution (Y7) · Linear equations (Y7–8) · Expanding brackets (Y8) · Factorising (Y8–9) · Sequences and nth term (Y7–8) · Inequalities (Y8–9) · Index laws (Y8–9) · Rearranging formulae (Y9) · Straight-line graphs (Y8–9) · Simultaneous equations (Y9) |
| **Ratio & proportion** | Simplifying ratios (Y7) · Sharing in a ratio (Y7–8) · Direct and inverse proportion (Y8–9) · Speed, distance, time (Y8–9) |
| **Geometry & measures** | Angle facts and parallel lines (Y7–8) · Angles in polygons (Y8) · Area and perimeter (Y7–8) · Circles (Y8–9) · Volume of prisms and cylinders (Y8–9) · Pythagoras' theorem (Y9) |
| **Probability & statistics** | Probability (Y7–9) · Averages and range (Y7–8) |

Every topic has Foundation and Higher questions, three hints, a worked solution, and a "How does this work?" explanation.

**Not covered yet:** some Key Stage 3 topics really need pictures to drag, measure or draw on, so they aren't here yet. These include transformations (reflections, rotations, enlargements), constructions with a compass, bearings, plans and elevations, drawing graphs and charts, and Venn diagrams. Years differ a bit between schools, so the year labels are a guide.

## The files

| File | What's in it |
|---|---|
| `index.html` | The web page: layout (HTML), colours and style (CSS), and the buttons and screens (JavaScript) |
| `maths.js` | The engine: reads answers, checks them, and has shared helpers for writing questions |
| `topics/number.js` | Number topics |
| `topics/algebra.js` | Algebra topics |
| `topics/ratio.js` | Ratio, proportion and rates of change topics |
| `topics/geometry.js` | Geometry and measures topics |
| `topics/stats.js` | Probability and statistics topics |
| `manifest.webmanifest` | Tells phones the app's name, icon and colours, so it can be installed |
| `sw.js` | The service worker: saves the app's files so it works offline |
| `icons/` | The app icon (a ladder: three teal hint rungs and a coral solution rung) |
| `test-maths.js` | Automatic tests that check everything works. Run them with `node test-maths.js` |

**Adding a topic yourself:** copy one of the `M.register({ ... })` blocks in a topics file, change the `id`, `name` and `make` function, and run the tests. The page picks the new topic up automatically.

Keeping the maths separate from the page means you can test the maths on its own, and change how the page looks without breaking the maths. Programmers call this **separation of concerns**.

---

## Technical ideas you'll meet in the code

**HTML, CSS and JavaScript.** These are the three languages of a web page. HTML says *what* is on the page (a heading, a button, a text box). CSS says *how it looks* (colours, sizes, the squared-paper background). JavaScript says *what happens* when you click things.

**Functions.** A function is a reusable recipe. `makers.linear('foundation')` is a recipe that cooks up a brand-new linear equation every time you call it.

**Random numbers.** `rand(2, 9)` picks a whole number from 2 to 9. Here's the clever bit: the program picks the **answer first**, then builds the question around it. To make `3x + 5 = 20`, it picks x = 5, a = 3, b = 5 and works out 3 × 5 + 5 = 20. That's why the answers always come out as nice whole numbers.

**Parsing.** When you type `3(x + 2)`, the computer only sees the characters `3`, `(`, `x`, … A **parser** turns that text into something it can calculate with. Ours follows BIDMAS by having one rule for each level: brackets, then powers, then × and ÷, then + and −. It also puts back the hidden × signs, because in algebra `3x` means `3 × x`.

**Checking algebra answers.** How does the computer know `3x + 12` and `12 + 3x` are both right? It doesn't compare the letters. It **substitutes** lots of awkward numbers for x (like −3.7 and 2.5) into your answer and into the correct answer. If they match every time, the two expressions are **equivalent**, which means they're equal for every value of x. (Two *different* expressions agreeing on all those random numbers would be an almost impossible coincidence.) Then it checks the *form*: expanded answers mustn't have brackets, and factorised answers must have them.

**localStorage.** This is a small storage area in your browser where the page saves your progress. It stays on your computer, which means it won't follow you to a different device or browser.

**Automated tests.** `test-maths.js` makes about 20,000 random questions (300 for every topic at both levels) and checks that every one accepts its own answer, rejects a wrong one, has 3 hints and a worked solution, and contains no broken text. It also tests each kind of answer checker. If you change anything, run the tests to check you haven't broken something.

**Progressive Web Apps.** A PWA is a website that can behave like an app. Two files make that happen. The **manifest** is a label telling the phone the app's name, icon and colours. The **service worker** is a little helper script that the browser runs in the background: the first time you open the app it saves a copy of every file, and after that it hands out the saved copies, which is why the app works without internet. When you change a file, bump `VERSION` in `sw.js` so phones know to fetch the new copies.

**Responsive design.** The same page rearranges itself depending on the screen. CSS **media queries** (`@media (max-width: 760px)`) switch on phone-only styles: the tabs move to a bar along the bottom and the topic picker folds away so the question is on screen.

**Registering modules.** Each topics file calls `M.register(...)` to add its topics to a shared list. The page never needs to know how many topics there are: it just reads the list. This is how big programs stay organised, with lots of small pieces plugged into one place.

**Floating-point numbers.** Computers store decimals in binary, so 0.1 + 0.2 comes out as 0.30000000000000004! That's why the code has helpers like `roundDp`, and why the answer checker treats two numbers as equal when they're extremely close.

## Maths ideas the tutor teaches

Every topic has its own explanation box in the app ("How does this work?"). Here are the key ideas for the algebra topics:

- **Linear equation:** an equation where x isn't squared, like `3x + 5 = 20`. Think of it as a **balance**: whatever you do to one side, do to the other.
- **Inverse operations:** operations that undo each other. + undoes −, and × undoes ÷. You undo things in the reverse order to how they were done.
- **Expanding:** multiplying out brackets. The term outside multiplies *every* term inside. For two brackets, use FOIL: First, Outer, Inner, Last.
- **Like terms:** terms with the same letter part, like `5x` and `−2x`. You can add them together: `3x`.
- **Factorising:** expanding backwards. Take out the **highest common factor** (HCF). For `x² + bx + c`, find two numbers that multiply to c and add to b.
- **Substitution:** replacing letters with numbers. Remember BIDMAS, and put negatives in brackets: `(−3)² = 9`.

---

## Does it actually work? How to test whether it improves learning

"It feels helpful" isn't proof. Scientists test ideas by **measuring**, and here's a plan you can actually carry out.

### Test 1: Before and after (start here)

1. Pick one topic, say factorising. Take a **Quiz** and choose "Before practising".
2. Practise that topic for 15 minutes using the hints.
3. Take another Quiz and choose "After practising".
4. The **My progress** tab shows the change automatically, e.g. "before 38%, after 75%, +37 points".

Get 3 to 5 friends or classmates to do it too. One person improving could be luck. Most people improving is much better evidence.

### Test 2: A fair test (are the hints what made the difference?)

Test 1 has a problem: people might improve just from doing *any* practice. To check that the **hints** help, you need a **control group**:

- **Group A** practises with the Hint Ladder.
- **Group B** practises the same number of questions but is only shown the answer (for example from a textbook's answer page).
- Both groups take the same before and after quizzes.

If Group A improves more than Group B, that's evidence that the hints make the difference. Keep everything else the same: the same time, topic and level. That makes it a **fair test**, just like in science lessons. Split people into the groups **randomly**, by flipping a coin, so one group doesn't end up with all the strongest students.

### Test 3: Does it stick?

Real learning means remembering. A week later, take a quiz on the same topic and choose "A week later". If your score stays close to the "after" score, the learning stuck.

### Other things to measure (they're already being recorded)

- **Hints per question** should **go down** over time as you get more confident.
- **"No hints"** solves should **go up**.
- **Time** taken on quizzes should go down without your score dropping.

Click **Copy results for a spreadsheet** and paste into Google Sheets or Excel to draw graphs.

### Ask people too

Numbers don't tell you everything. Ask testers short questions like:
- "On a scale of 1–5, how stuck did you feel?"
- "Which hint helped most? Which one was confusing?"
- "Did you ever just keep clicking hints to get the answer?" (If yes, maybe hints should unlock only after one try.)

### Be careful about

- **Small samples:** 3 people is a start, not proof. More people gives more reliable results.
- **Practice effect:** taking the same kind of quiz twice can make you better at quizzes. A control group (Test 2) helps with this.
- **Asking only friends:** they might be kind rather than honest. Ask them to be brutally honest.
- **Privacy:** if you collect classmates' results, use first names or codes like "Tester 1" instead of full names, and ask permission first (and a teacher, if you're doing it at school).

---

## Ideas for the next version

- Make hints unlock only after you've tried once, so people don't skip straight to them
- Diagrams for the geometry questions, then topics that need drawing: transformations, bearings, constructions
- Spaced repetition: bring back topics you found hard a few days later
- A "teach it back" mode where you explain a step in your own words
- Draw graphs of your progress on the My progress tab
