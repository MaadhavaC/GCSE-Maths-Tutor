// Tests for the maths engine. Run with:  node test-maths.js
// A test is a small program that checks another program gives the right answers.

const assert = require('assert');
const M = require('./maths.js');
require('./topics/number.js');
require('./topics/algebra.js');
require('./topics/ratio.js');
require('./topics/geometry.js');
require('./topics/stats.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error('FAIL: ' + name + '\n  ' + e.message); process.exitCode = 1; }
}

// --- The parser follows BIDMAS and understands algebra shorthand ---
test('3x means 3 times x', () => assert.strictEqual(M.parse('3x').evaluate({ x: 4 }), 12));
test('brackets', () => assert.strictEqual(M.parse('2(x+1)').evaluate({ x: 4 }), 10));
test('two brackets', () => assert.strictEqual(M.parse('(x+2)(x-3)').evaluate({ x: 5 }), 14));
test('powers before multiplying', () => assert.strictEqual(M.parse('3x^2').evaluate({ x: 2 }), 12));
test('minus squared', () => assert.strictEqual(M.parse('-x^2').evaluate({ x: 3 }), -9));
test('fancy symbols', () => assert.strictEqual(M.parse('2x² − 3 × 2').evaluate({ x: 1 }), -4));
test('superscript powers', () => assert.strictEqual(M.parse('x⁵').evaluate({ x: 2 }), 32));
test('pi', () => assert.ok(Math.abs(M.parse('2pi').evaluate({}) - 2 * Math.PI) < 1e-9));
test('rubbish is rejected', () => assert.throws(() => M.parse('3x +')));

// --- Equivalence ---
test('expanded form equals bracket form', () => {
  assert.ok(M.equivalent(M.parse('3(x+4)').evaluate, M.parse('3x+12').evaluate));
});
test('different expressions are not equivalent', () => {
  assert.ok(!M.equivalent(M.parse('3(x+4)').evaluate, M.parse('3x+4').evaluate));
});
test('two letters', () => {
  assert.ok(M.equivalent(M.parse('3x+2y+x').evaluate, M.parse('4x+2y').evaluate, ['x', 'y']));
  assert.ok(!M.equivalent(M.parse('3x+2y').evaluate, M.parse('2x+3y').evaluate, ['x', 'y']));
});

// --- Every topic: each generated question accepts its own answer and refuses a wrong one ---
const KINDS = ['number', 'expression', 'fraction', 'ratio', 'inequality', 'pair', 'standard', 'primes'];
for (const topic of M.TOPICS) {
  test(topic.id + ' has a strand, year and explanation', () => {
    assert.ok(M.STRANDS.some(s => s.id === topic.strand), 'unknown strand ' + topic.strand);
    assert.ok(topic.year && topic.example && topic.learn && topic.learn.body.length && topic.learn.eg);
  });
  for (const level of ['foundation', 'higher']) {
    test(topic.id + ' ' + level + ': 300 random questions', () => {
      for (let i = 0; i < 300; i++) {
        const q = M.generate(topic.id, level);
        assert.ok(KINDS.includes(q.kind), 'unknown kind ' + q.kind);
        assert.strictEqual(q.hints.length, 3, 'needs 3 hints');
        assert.ok(q.solution.length >= 1, 'needs a worked solution');
        const r = q.check(q.answer);
        assert.strictEqual(r.status, 'correct', q.prompt + '\n  rejected its own answer ' + q.answer + ': ' + r.message);
        assert.notStrictEqual(q.check('999').status, 'correct', q.prompt + ' accepted 999');
        const text = [q.prompt].concat(q.hints, q.solution, [q.answer]).join(' | ');
        assert.ok(!/NaN|undefined|Infinity|\.\d*(0{6,}|9{6,})\d/.test(text), 'bad text in: ' + text);
      }
    });
  }
}

// --- Specific marking rules ---
function find(topic, level, match) {
  for (let i = 0; i < 3000; i++) { const q = M.generate(topic, level); if (match(q)) return q; }
  throw new Error('could not find a matching question');
}

test('expanding: leaving the bracket in is "almost"', () => {
  const q = M.generate('expand', 'foundation');
  assert.strictEqual(q.check(q.prompt.replace('Expand', '').trim()).status, 'almost');
});

test('factorising: a smaller common factor is "almost"', () => {
  const q = find('factorise', 'foundation', q => /^\d+\(/.test(q.answer) && Number(q.answer.match(/^\d+/)[0]) % 2 === 0 && Number(q.answer.match(/^\d+/)[0]) > 2);
  const k = Number(q.answer.match(/^\d+/)[0]);
  const inner = M.parse(q.answer.slice(String(k).length)).evaluate;
  const b = inner({ x: 0 }), a = inner({ x: 1 }) - b;
  const typed = '2(' + (k / 2) * a + 'x + ' + (k / 2) * b + ')';
  assert.strictEqual(q.check(typed).status, 'almost', typed);
});

test('factorising quadratics: expanded answer is "almost"', () => {
  const q = M.generate('factorise', 'higher');
  assert.strictEqual(q.check(q.prompt.replace('Factorise', '').trim()).status, 'almost');
});

test('answers with the wrong letter are explained', () => {
  const q = M.generate('expand', 'foundation');
  assert.strictEqual(q.check('3y + 2').status, 'invalid');
});

test('fractions: unsimplified is "almost", decimal is "almost"', () => {
  const check = M.fractionChecker(3, 4);
  assert.strictEqual(check('3/4').status, 'correct');
  assert.strictEqual(check('6/8').status, 'almost');
  assert.strictEqual(check('0.75').status, 'almost');
  assert.strictEqual(M.fractionChecker(3, 2)('1 1/2').status, 'correct');
});

test('ratios', () => {
  const check = M.ratioChecker([2, 3]);
  assert.strictEqual(check('2:3').status, 'correct');
  assert.strictEqual(check('4 : 6').status, 'almost');
  assert.strictEqual(check('3:2').status, 'wrong');
});

test('inequalities: flipped sign gets a helpful message', () => {
  const check = M.inequalityChecker('<', -3);
  assert.strictEqual(check('x < -3').status, 'correct');
  assert.strictEqual(check('-3 > x').status, 'correct');
  assert.ok(/flips/.test(check('x > -3').message));
  assert.strictEqual(M.inequalityChecker('>=', 2)('x ≥ 2').status, 'correct');
});

test('simultaneous: swapped answers are spotted', () => {
  const check = M.pairChecker(3, -2);
  assert.strictEqual(check('x = 3, y = -2').status, 'correct');
  assert.strictEqual(check('y=-2 x=3').status, 'correct');
  assert.ok(/swapped/.test(check('x = -2, y = 3').message));
});

test('standard form', () => {
  const check = M.standardFormChecker(34000);
  assert.strictEqual(check('3.4 x 10^4').status, 'correct');
  assert.strictEqual(check('3.4 × 10⁴').status, 'correct');
  assert.strictEqual(check('34 x 10^3').status, 'almost');
  assert.strictEqual(check('34000').status, 'almost');
  assert.strictEqual(M.standardFormChecker(0.0045)('4.5 x 10^-3').status, 'correct');
});

test('prime factors', () => {
  const check = M.primeFactorChecker(72);
  assert.strictEqual(check('2^3 x 3^2').status, 'correct');
  assert.strictEqual(check('2 × 2 × 2 × 3 × 3').status, 'correct');
  assert.strictEqual(check('8 x 9').status, 'almost');
  assert.strictEqual(check('2^3 x 3').status, 'wrong');
});

test('rounded answers: unrounded is "almost", exact π answer is accepted', () => {
  const exact = Math.PI * 25;
  const check = M.numberChecker(78.5, [], { dp: 1, exact });
  assert.strictEqual(check('78.5').status, 'correct');
  assert.strictEqual(check('78.54').status, 'almost');
  assert.strictEqual(check('25π').status, 'correct');
  assert.strictEqual(check('25pi').status, 'correct');
});

test('numbers with units and money are read', () => {
  assert.strictEqual(M.numberChecker(4.2)('£4.20').status, 'correct');
  assert.strictEqual(M.numberChecker(70)('70°').status, 'correct');
  assert.strictEqual(M.numberChecker(20)('20 cm²').status, 'correct');
  assert.strictEqual(M.numberChecker(34000)('34,000').status, 'correct');
  assert.strictEqual(M.numberChecker(35)('35%').status, 'correct');
});

// --- The app: every topic file is loaded by the page and saved for offline use ---
test('every topic file is in index.html and the offline list in sw.js', () => {
  const fs = require('fs');
  const page = fs.readFileSync(__dirname + '/index.html', 'utf8');
  const sw = fs.readFileSync(__dirname + '/sw.js', 'utf8');
  for (const file of fs.readdirSync(__dirname + '/topics')) {
    assert.ok(page.includes('topics/' + file), 'index.html does not load topics/' + file);
    assert.ok(sw.includes('./topics/' + file), 'sw.js does not save topics/' + file + ' for offline use');
  }
});

test('the app manifest points at icons that exist', () => {
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync(__dirname + '/manifest.webmanifest', 'utf8'));
  for (const icon of manifest.icons) assert.ok(fs.existsSync(__dirname + '/' + icon.src), 'missing ' + icon.src);
});

console.log(passed + ' tests passed' + (process.exitCode ? ', some FAILED' : '') + ' (' + M.TOPICS.length + ' topics)');
