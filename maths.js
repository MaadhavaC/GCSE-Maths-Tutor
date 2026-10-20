// Maths engine for the Maths Hint Ladder.
// This file holds the shared tools. The topics themselves live in the topics/ folder,
// one file per strand of the Key Stage 3 curriculum (Years 7 to 9).
//
// The engine does three jobs:
//   1. reads what the student types (a tiny "parser"),
//   2. gives topic files helpers for writing questions, hints and worked solutions,
//   3. checks answers and spots common mistakes.
// It has no buttons or colours in it, so we can test it on its own (see test-maths.js).

(function (root) {
  'use strict';

  // ---------- Random helpers ----------

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function randNonZero(min, max) {
    let n = 0;
    while (n === 0) n = rand(min, max);
    return n;
  }

  function pick(list) {
    return list[rand(0, list.length - 1)];
  }

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  function isPrime(n) {
    if (n < 2 || n !== Math.floor(n)) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }

  // Round to a number of decimal places without the usual computer rounding slips
  function roundDp(value, dp) {
    return Number(Math.round(Number(value + 'e' + dp)) + 'e' + -dp);
  }

  // Round to a number of significant figures
  function roundSf(value, sf) {
    if (value === 0) return 0;
    const digitsBeforePoint = Math.floor(Math.log10(Math.abs(value))) + 1;
    return roundDp(value, sf - digitsBeforePoint);
  }

  // ---------- Writing maths nicely ----------

  const MINUS = '−'; // a proper minus sign, wider than a hyphen

  // A number on its own: -3 becomes −3. Long decimals from the computer are tidied.
  function num(n) {
    const tidy = Number(n.toPrecision(12));
    return tidy < 0 ? MINUS + Math.abs(tidy) : String(tidy);
  }

  // A number in brackets if it is negative: used when multiplying, e.g. 4 × (−3)
  function numB(n) {
    return n < 0 ? '(' + num(n) + ')' : num(n);
  }

  // Money: 4.5 becomes £4.50 and 12 stays £12
  function money(n) {
    const pounds = roundDp(n, 2);
    return '£' + (Number.isInteger(pounds) ? String(pounds) : pounds.toFixed(2));
  }

  // A fraction in its simplest form, e.g. frac(6, 8) gives "3/4" and frac(4, 2) gives "2"
  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d === 1) return num(n);
    return (n < 0 ? MINUS : '') + Math.abs(n) + '/' + d;
  }

  // Superscript digits for powers: sup(-3) gives "⁻³"
  const SUPERS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(n) {
    return String(n).split('').map(c => SUPERS[c] || c).join('');
  }

  // Write a list of [coefficient, letter] terms as an expression.
  // poly([[3, 'x'], [-5, '']]) gives "3x − 5"; poly([[1, 'x²'], [-1, 'x']]) gives "x² − x"
  function poly(terms) {
    let out = '';
    for (const [c, v] of terms) {
      if (c === 0) continue;
      const size = Math.abs(c);
      const body = v === '' ? String(size) : (size === 1 ? v : size + v);
      if (out === '') out = (c < 0 ? MINUS : '') + body;
      else out += (c < 0 ? ' ' + MINUS + ' ' : ' + ') + body;
    }
    return out === '' ? '0' : out;
  }

  // Like poly, but never collects like terms: terms([[1,'x'],[3,'x']]) gives "x + 3x"
  function terms(list) {
    return list.map(t => poly([t])).reduce((out, t) =>
      out === '' ? t : out + (t[0] === MINUS ? ' ' + MINUS + ' ' + t.slice(1) : ' + ' + t), '');
  }

  // "x + 3" or "x − 3", for writing inside brackets
  function xPlus(n, coef, letter) {
    return poly([[coef === undefined ? 1 : coef, letter || 'x'], [n, '']]);
  }

  // ---------- Reading what the student typed ----------

  // Swap fancy symbols for plain ones the parser understands
  const FROM_SUPER = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function normalise(text) {
    return String(text)
      .replace(/pi/gi, 'π')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^' + m.split('').map(c => FROM_SUPER[c]).join(''))
      .replace(/[−–]/g, '-')
      .replace(/[×·]/g, '*')
      .replace(/÷/g, '/')
      .replace(/≤/g, '<=')
      .replace(/≥/g, '>=');
  }

  function tokenize(text) {
    const s = normalise(text).replace(/\s+/g, '').toLowerCase();
    if (s === '') throw new Error('empty');

    const raw = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const value = Number(s.slice(i, j));
        if (Number.isNaN(value)) throw new Error('bad number');
        raw.push({ type: 'num', value });
        i = j;
      } else if (ch === 'π') {
        raw.push({ type: 'num', value: Math.PI });
        i++;
      } else if (/[a-z]/.test(ch)) {
        raw.push({ type: 'var', name: ch });
        i++;
      } else if ('+-*/^()'.includes(ch)) {
        raw.push({ type: 'op', value: ch });
        i++;
      } else {
        throw new Error('unexpected ' + ch);
      }
    }

    // In algebra "3x" means 3 × x and "2(x+1)" means 2 × (x+1).
    // Put the hidden × signs back in.
    const tokens = [];
    const endsValue = t => t.type === 'num' || t.type === 'var' || (t.type === 'op' && t.value === ')');
    const startsValue = t => t.type === 'num' || t.type === 'var' || (t.type === 'op' && t.value === '(');
    raw.forEach((t, k) => {
      if (k > 0 && endsValue(raw[k - 1]) && startsValue(t)) tokens.push({ type: 'op', value: '*' });
      tokens.push(t);
    });
    return tokens;
  }

  // Recursive descent parser. Each rule handles one level of BIDMAS:
  //   expr   = term (+ or − term)...         addition and subtraction last
  //   term   = unary (× or ÷ unary)...       then multiplication and division
  //   unary  = − unary | power               a minus sign in front
  //   power  = atom (^ unary)                indices first
  //   atom   = number | letter | ( expr )    brackets before everything
  function parse(text) {
    const tokens = tokenize(text);
    const vars = new Set();
    let pos = 0;

    const peek = () => tokens[pos];
    const isOp = v => peek() && peek().type === 'op' && peek().value === v;

    function expr() {
      let left = term();
      while (isOp('+') || isOp('-')) {
        const op = tokens[pos++].value;
        const right = term();
        const l = left;
        left = op === '+' ? env => l(env) + right(env) : env => l(env) - right(env);
      }
      return left;
    }

    function term() {
      let left = unary();
      while (isOp('*') || isOp('/')) {
        const op = tokens[pos++].value;
        const right = unary();
        const l = left;
        left = op === '*' ? env => l(env) * right(env) : env => l(env) / right(env);
      }
      return left;
    }

    function unary() {
      if (isOp('-')) { pos++; const inner = unary(); return env => -inner(env); }
      if (isOp('+')) { pos++; return unary(); }
      return power();
    }

    function power() {
      const base = atom();
      if (isOp('^')) {
        pos++;
        const exp = unary();
        return env => Math.pow(base(env), exp(env));
      }
      return base;
    }

    function atom() {
      const t = peek();
      if (!t) throw new Error('ends too early');
      if (t.type === 'num') { pos++; return () => t.value; }
      if (t.type === 'var') {
        pos++;
        vars.add(t.name);
        return env => {
          if (!(t.name in env)) throw new Error('unknown letter ' + t.name);
          return env[t.name];
        };
      }
      if (isOp('(')) {
        pos++;
        const inner = expr();
        if (!isOp(')')) throw new Error('missing )');
        pos++;
        return inner;
      }
      throw new Error('unexpected ' + t.value);
    }

    const fn = expr();
    if (pos !== tokens.length) throw new Error('extra symbols');
    return { evaluate: fn, vars: [...vars] };
  }

  // Two expressions are "equivalent" if they give the same value whatever numbers
  // the letters stand for. We can't try every number, so we try lots of awkward ones.
  // (If two different expressions agreed on that many random values it would be an
  // incredible coincidence.)
  const TEST_VALUES = [-3.7, -1.3, -0.4, 0.6, 1.9, 2.5, 4.1, 7.3];

  function sameNumber(a, b) {
    return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
  }

  function equivalent(f, g, letters) {
    letters = letters || ['x'];
    return TEST_VALUES.every((_, i) => {
      const env = {};
      letters.forEach((v, k) => { env[v] = TEST_VALUES[(i + 3 * k) % TEST_VALUES.length] + 0.37 * k; });
      return sameNumber(f(env), g(env));
    });
  }

  // ---------- Checking answers ----------
  // Every checker returns { status, message } where status is one of:
  //   correct   right answer in the right form
  //   almost    the right value, but in the wrong form (not simplified, not rounded…)
  //   wrong     a different answer (sometimes with a message about the likely mistake)
  //   invalid   we couldn't read it, so it isn't counted as a try

  function result(status, message) {
    return { status, message };
  }

  const NOT_QUITE = 'Not quite. Have another go, or take a hint.';

  // Strip "x =", pound signs, commas in big numbers and units like cm or °
  function cleanNumberText(input) {
    return normalise(input).trim()
      .replace(/^[a-z]\s*=\s*/i, '')
      .replace(/^£\s*/, '')
      .replace(/(\d),(?=\d{3}\b)/g, '$1')
      .replace(/\s*(%|°|degrees|cm\^?[23]|m\^?[23]|mm\^?[23]|cm|mm|km\/h|kmh|mph|km|kg|g|m\/s|m|s|p|hours?|hrs?|h|minutes|mins?|days?|people|workers)$/i, '')
      .trim();
  }

  function readNumber(input) {
    const parsed = parse(cleanNumberText(input));
    if (parsed.vars.length) throw new Error('has letters');
    const value = parsed.evaluate({});
    if (!Number.isFinite(value)) throw new Error('not finite');
    return value;
  }

  // Questions whose answer is a number.
  // mistakes: list of { value, message } for common wrong answers.
  // opts.dp: the answer has been rounded to this many decimal places (exact is the unrounded value)
  function numberChecker(answer, mistakes, opts) {
    opts = opts || {};
    return function (input) {
      let value;
      try { value = readNumber(input); } catch (e) {
        return result('invalid', 'I couldn’t read that as a number. Type something like 7, −4 or 2.5.');
      }
      if (sameNumber(value, answer)) return result('correct', 'Correct!');
      if (opts.exact !== undefined && sameNumber(value, opts.exact) && /π/.test(normalise(input))) {
        return result('correct', 'Correct! That’s the exact answer in terms of π.');
      }
      if (opts.dp !== undefined && opts.exact !== undefined && Math.abs(value - opts.exact) < 0.5 * Math.pow(10, -opts.dp) + 1e-9) {
        return result('almost', 'Nearly. Round your answer to ' + opts.dp + ' decimal place' + (opts.dp === 1 ? '' : 's') + '.');
      }
      for (const m of mistakes || []) {
        if (sameNumber(value, m.value)) return result('wrong', m.message);
      }
      return result('wrong', NOT_QUITE);
    };
  }

  function readExpression(input, letters) {
    // Ignore a leading "x =" or "n =": we only want the expression
    const parsed = parse(String(input).replace(/^\s*[a-z]\s*=/i, ''));
    const stray = parsed.vars.filter(v => !letters.includes(v));
    if (stray.length) return { error: 'Use only the letter' + (letters.length > 1 ? 's ' : ' ') + letters.join(' and ') + ' in your answer (I spotted ' + stray.join(', ') + ').' };
    const env = {};
    letters.forEach(v => { env[v] = 1.3; });
    parsed.evaluate(env);
    return { fn: parsed.evaluate };
  }

  // Count terms at the top level: "3x + 2y − 5" has 3 terms
  function countTerms(text) {
    const s = normalise(text).replace(/\s+/g, '');
    let depth = 0, count = 1;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      else if ((c === '+' || c === '-') && depth === 0 && i > 0 && /[0-9a-z)]/i.test(s[i - 1])) count++;
    }
    return count;
  }

  // Questions whose answer is an expression.
  // rules.form(text) can refuse an equivalent answer that is in the wrong form.
  // rules.letters: which letters are allowed (default just x)
  function expressionChecker(target, rules) {
    rules = rules || {};
    const letters = rules.letters || ['x'];
    const targetFn = parse(target).evaluate;
    return function (input) {
      let read;
      try { read = readExpression(input, letters); } catch (e) {
        return result('invalid', 'I couldn’t read that. Type it like 3x + 12 or x^2 + 5x + 6 (use ^ for powers).');
      }
      if (read.error) return result('invalid', read.error);
      if (equivalent(read.fn, targetFn, letters)) {
        const formProblem = rules.form ? rules.form(String(input).replace(/^\s*[a-z]\s*=/i, '')) : null;
        return formProblem ? result('almost', formProblem) : result('correct', 'Correct!');
      }
      for (const m of rules.mistakes || []) {
        if (equivalent(read.fn, parse(m.expr).evaluate, letters)) return result('wrong', m.message);
      }
      return result('wrong', NOT_QUITE);
    };
  }

  // Read "3/4", "−3/4", "1 1/2" (a mixed number), "5" or "0.75"
  function readFraction(input) {
    const s = cleanNumberText(input).replace(/\s+/g, ' ');
    let m;
    if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) {
      const sign = m[1] ? -1 : 1, w = +m[2], n = +m[3], d = +m[4];
      if (d === 0) throw new Error('zero');
      return { n: sign * (w * d + n), d, mixed: true };
    }
    if ((m = s.replace(/ /g, '').match(/^(-?\d+)\/(-?\d+)$/))) {
      if (+m[2] === 0) throw new Error('zero');
      return { n: +m[1], d: +m[2] };
    }
    if ((m = s.replace(/ /g, '').match(/^-?\d+$/))) return { n: +m[0], d: 1 };
    if ((m = s.replace(/ /g, '').match(/^-?\d*\.\d+$/))) return { n: Number(m[0]), d: 1, decimal: true };
    throw new Error('not a fraction');
  }

  // Questions whose answer is a fraction in its simplest form
  function fractionChecker(n, d, mistakes, opts) {
    opts = opts || {};
    const target = n / d;
    return function (input) {
      let f;
      try { f = readFraction(input); } catch (e) {
        return result('invalid', 'Type a fraction like 3/4, a mixed number like 1 1/2, or a whole number.');
      }
      const value = f.n / f.d;
      if (sameNumber(value, target)) {
        if (f.decimal && !opts.allowDecimal) return result('almost', 'That’s the right value, but give your answer as a fraction, like 3/4.');
        if (gcd(f.n, f.d) !== 1 && !f.decimal) return result('almost', 'Right value! Now simplify it: divide the top and bottom by a common factor.');
        return result('correct', 'Correct!');
      }
      for (const m of mistakes || []) {
        if (sameNumber(value, m.n / m.d)) return result('wrong', m.message);
      }
      return result('wrong', NOT_QUITE);
    };
  }

  // Questions whose answer is a ratio like 3 : 4
  function ratioChecker(parts) {
    return function (input) {
      const pieces = normalise(input).replace(/\s+/g, '').split(':');
      if (pieces.length !== parts.length || pieces.some(p => !/^\d+(\.\d+)?$/.test(p))) {
        return result('invalid', 'Write a ratio with ' + parts.length + ' parts and colons, like ' + parts.map((_, i) => i + 2).join(' : ') + '.');
      }
      const given = pieces.map(Number);
      const proportional = given.every((g, i) => sameNumber(g * parts[0], parts[i] * given[0]));
      if (!proportional) return result('wrong', NOT_QUITE);
      if (given.some(g => !Number.isInteger(g))) return result('almost', 'The right proportions, but use whole numbers in a ratio.');
      if (given.reduce(gcd) !== 1) return result('almost', 'Good, but it can be simplified further. Is there another number that divides into every part?');
      return result('correct', 'Correct!');
    };
  }

  // Questions whose answer is an inequality like x > 4 or x ≤ −2
  const FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
  function inequalityChecker(symbol, value) {
    return function (input) {
      const s = normalise(input).replace(/\s+/g, '').toLowerCase().replace(/=</g, '<=').replace(/=>/g, '>=');
      let m, sym, val;
      if ((m = s.match(/^x(<=|>=|<|>)(-?[\d.]+(?:\/\d+)?)$/))) { sym = m[1]; val = m[2]; }
      else if ((m = s.match(/^(-?[\d.]+(?:\/\d+)?)(<=|>=|<|>)x$/))) { sym = FLIP[m[2]]; val = m[1]; }
      else return result('invalid', 'Write your answer like x > 4 or x <= −2 (use <= for ≤ and >= for ≥).');
      const v = parse(val).evaluate({});
      if (!sameNumber(v, value)) return result('wrong', NOT_QUITE);
      if (sym === symbol) return result('correct', 'Correct!');
      if (sym === FLIP[symbol]) return result('wrong', 'The number is right but the sign points the wrong way. Remember: if you multiply or divide both sides by a negative number, the sign flips.');
      return result('wrong', 'The number is right. Check whether it should be < or ≤ (or > or ≥). Does the question include “equal to”?');
    };
  }

  // Questions with two answers, like x = 3, y = −2
  function pairChecker(x, y) {
    return function (input) {
      const s = normalise(input).toLowerCase();
      const mx = s.match(/x\s*=\s*(-?[\d.]+(?:\/\d+)?)/);
      const my = s.match(/y\s*=\s*(-?[\d.]+(?:\/\d+)?)/);
      if (!mx || !my) return result('invalid', 'Give both values, like x = 3, y = −2.');
      const gx = parse(mx[1]).evaluate({}), gy = parse(my[1]).evaluate({});
      const okX = sameNumber(gx, x), okY = sameNumber(gy, y);
      if (okX && okY) return result('correct', 'Correct!');
      if (sameNumber(gx, y) && sameNumber(gy, x)) return result('wrong', 'You’ve got the right numbers but swapped x and y round.');
      if (okX) return result('wrong', 'x is right! Substitute it back into one of the equations to find y.');
      if (okY) return result('wrong', 'y is right! Substitute it back into one of the equations to find x.');
      return result('wrong', 'Not quite. Check by putting your values back into both equations.');
    };
  }

  // Questions whose answer is in standard form, like 3.4 × 10^4
  function standardFormChecker(value) {
    return function (input) {
      const s = normalise(input).replace(/\s+/g, '').replace(/[xX]/g, '*');
      const m = s.match(/^(-?\d+(?:\.\d+)?)\*10\^\(?(-?\d+)\)?$/);
      let given;
      try { given = m ? Number(m[1]) * Math.pow(10, Number(m[2])) : readNumber(s); } catch (e) {
        return result('invalid', 'Write it like 3.4 × 10^4 (you can type x or * for ×).');
      }
      if (!sameNumber(given, value)) return result('wrong', NOT_QUITE);
      if (!m) return result('almost', 'That’s the right number, but write it in standard form: a number from 1 to 10, times a power of 10.');
      const a = Math.abs(Number(m[1]));
      if (a < 1 || a >= 10) return result('almost', 'Right value, but the first number has to be at least 1 and less than 10. Move the decimal point and change the power.');
      return result('correct', 'Correct!');
    };
  }

  // Questions whose answer is a product of prime factors, like 2^3 × 3
  function primeFactorChecker(n) {
    return function (input) {
      const s = normalise(input).replace(/\s+/g, '').replace(/[xX]/g, '*');
      const parts = s.split('*');
      let product = 1, allPrime = true;
      for (const p of parts) {
        const m = p.match(/^(\d+)(?:\^(\d+))?$/);
        if (!m) return result('invalid', 'Write it as primes multiplied together, like 2^3 × 3 or 2 × 2 × 2 × 3.');
        product *= Math.pow(Number(m[1]), m[2] ? Number(m[2]) : 1);
        if (!isPrime(Number(m[1]))) allPrime = false;
      }
      if (product !== n) return result('wrong', 'Those multiply to ' + product + ', not ' + n + '. Check your factor tree.');
      if (!allPrime) return result('almost', 'They multiply to ' + n + ', but not all of them are prime. Keep splitting the ones that aren’t.');
      return result('correct', 'Correct!');
    };
  }

  function bracketCount(text) {
    return (String(text).match(/\(/g) || []).length;
  }

  // ---------- Topics ----------
  // Each topic file calls register() with:
  //   id, name, strand, year, example     how it appears in the menu
  //   learn: { title, body, eg }          the explanation box
  //   make(level)                         returns a new question (see below)
  //
  // A question has:
  //   prompt     the question text
  //   kind       what to type: 'number', 'expression', 'fraction', 'ratio', 'inequality', 'pair', 'standard', 'primes'
  //   hints      three hints, each a bit more helpful than the last
  //   solution   the full worked solution, one line per step
  //   answer     the final answer as text
  //   check      a function that marks what the student typed

  const STRANDS = [
    { id: 'number', name: 'Number' },
    { id: 'algebra', name: 'Algebra' },
    { id: 'ratio', name: 'Ratio & proportion' },
    { id: 'geometry', name: 'Geometry & measures' },
    { id: 'stats', name: 'Probability & statistics' }
  ];

  const TOPICS = [];

  function register(topic) {
    TOPICS.push(topic);
  }

  function generate(topicId, level) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Unknown topic ' + topicId);
    const lvl = level === 'higher' ? 'higher' : 'foundation';
    const q = topic.make(lvl);
    q.topic = topicId;
    q.level = lvl;
    return q;
  }

  const api = {
    // the topic list and question maker
    STRANDS, TOPICS, register, generate,
    // helpers for topic files
    rand, randNonZero, pick, shuffle, gcd, lcm, isPrime, roundDp, roundSf,
    MINUS, num, numB, money, frac, sup, poly, terms, xPlus, bracketCount, countTerms,
    parse, equivalent, sameNumber,
    numberChecker, expressionChecker, fractionChecker, ratioChecker, inequalityChecker,
    pairChecker, standardFormChecker, primeFactorChecker
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathsEngine = api;
})(this);
