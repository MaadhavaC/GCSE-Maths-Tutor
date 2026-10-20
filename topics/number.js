// Number topics, Years 7 to 9.

(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('../maths.js') : root.MathsEngine;
  const { rand, randNonZero, pick, gcd, lcm, roundDp, roundSf, MINUS, num, numB, money, frac, sup,
    numberChecker, fractionChecker, standardFormChecker, primeFactorChecker } = M;

  // ----- Negative numbers -----

  M.register({
    id: 'negatives', name: 'Negative numbers', strand: 'number', year: 'Y7', example: '−3 − 5',
    learn: {
      title: 'How do I calculate with negative numbers?',
      body: [
        'Picture a number line. Adding moves right, subtracting moves left.',
        '<strong>Subtracting a negative is the same as adding</strong>: 4 − (−3) = 4 + 3 = 7. Adding a negative is the same as subtracting: 4 + (−3) = 1.',
        'Multiplying or dividing: <strong>same signs give a positive, different signs give a negative</strong>. −4 × −3 = 12, but −4 × 3 = −12.'
      ],
      eg: '−3 − 5 = −8\n2 − (−6) = 8\n−4 × −3 = 12\n−20 ÷ 4 = −5'
    },
    make(level) {
      if (level === 'foundation') {
        const a = randNonZero(-12, 12), b = randNonZero(-12, 12);
        const op = pick(['+', '-']);
        const value = op === '+' ? a + b : a - b;
        const shown = num(a) + ' ' + (op === '+' ? '+' : MINUS) + ' ' + numB(b);
        const simpler = op === '-' && b < 0 ? num(a) + ' + ' + Math.abs(b) : op === '+' && b < 0 ? num(a) + ' ' + MINUS + ' ' + Math.abs(b) : shown;
        return {
          prompt: 'Work out  ' + shown,
          kind: 'number',
          hints: [
            'Picture a number line. Start at ' + num(a) + '. Adding moves you right, subtracting moves you left.',
            b < 0 ? 'Two signs next to each other can be combined. ' + (op === '-' ? 'Subtracting a negative is the same as adding.' : 'Adding a negative is the same as subtracting.') + ' How could you rewrite it?' : 'Which way do you move from ' + num(a) + ', and how many places?',
            (simpler !== shown ? 'It’s the same as ' + simpler + '. ' : '') + 'Start at ' + num(a) + ' and move ' + Math.abs(b) + ' places ' + (value > a ? 'right' : 'left') + '.'
          ],
          solution: simpler !== shown ? [shown, '= ' + simpler, '= ' + num(value)] : [shown, '= ' + num(value)],
          answer: num(value),
          check: numberChecker(value, [{ value: -value, message: 'The size is right but the sign is wrong. Use a number line to check which side of zero you end up.' }])
        };
      }
      const a = randNonZero(-12, 12);
      let b = randNonZero(-12, 12);
      if (a > 0 && b > 0) b = -b;
      if (Math.random() < 0.5) {
        const value = a * b;
        return {
          prompt: 'Work out  ' + num(a) + ' × ' + numB(b),
          kind: 'number',
          hints: [
            'First multiply the numbers as if they were both positive. Then decide the sign.',
            'What is ' + Math.abs(a) + ' × ' + Math.abs(b) + '? Then: are the signs the same or different?',
            'Same signs give a positive answer; different signs give a negative answer. Here the signs are ' + ((a < 0) === (b < 0) ? 'the same' : 'different') + '.'
          ],
          solution: [Math.abs(a) + ' × ' + Math.abs(b) + ' = ' + Math.abs(value), 'Signs are ' + ((a < 0) === (b < 0) ? 'the same, so positive' : 'different, so negative'), num(a) + ' × ' + numB(b) + ' = ' + num(value)],
          answer: num(value),
          check: numberChecker(value, [{ value: -value, message: 'The size is right but check the sign: same signs give positive, different signs give negative.' }])
        };
      }
      const total = a * b;
      return {
        prompt: 'Work out  ' + num(total) + ' ÷ ' + numB(b),
        kind: 'number',
        hints: [
          'First divide as if both numbers were positive. Then decide the sign.',
          'What is ' + Math.abs(total) + ' ÷ ' + Math.abs(b) + '? Then: are the signs the same or different?',
          'Same signs give a positive answer; different signs give a negative answer. Here the signs are ' + ((total < 0) === (b < 0) ? 'the same' : 'different') + '.'
        ],
        solution: [Math.abs(total) + ' ÷ ' + Math.abs(b) + ' = ' + Math.abs(a), 'Signs are ' + ((total < 0) === (b < 0) ? 'the same, so positive' : 'different, so negative'), num(total) + ' ÷ ' + numB(b) + ' = ' + num(a)],
        answer: num(a),
        check: numberChecker(a, [{ value: -a, message: 'The size is right but check the sign: same signs give positive, different signs give negative.' }])
      };
    }
  });

  // ----- Order of operations -----

  M.register({
    id: 'bidmas', name: 'Order of operations', strand: 'number', year: 'Y7', example: '3 + 4 × 2',
    learn: {
      title: 'What order do I do calculations in?',
      body: [
        'Use <strong>BIDMAS</strong>: Brackets, Indices (powers and roots), Division and Multiplication, Addition and Subtraction.',
        'Division and multiplication have equal priority, so work left to right. The same goes for addition and subtraction.',
        'Calculators follow BIDMAS too. That’s why 3 + 4 × 2 is 11, not 14.'
      ],
      eg: '3 + 4 × 2 = 3 + 8 = 11\n(3 + 4) × 2 = 7 × 2 = 14\n20 − 3² = 20 − 9 = 11'
    },
    make(level) {
      const a = rand(2, 12), b = rand(2, 9), c = rand(2, 9);
      const forms = level === 'foundation'
        ? [
          { shown: a + ' + ' + b + ' × ' + c, first: b + ' × ' + c + ' = ' + b * c, value: a + b * c, wrong: (a + b) * c, then: a + ' + ' + b * c },
          { shown: '(' + a + ' + ' + b + ') × ' + c, first: a + ' + ' + b + ' = ' + (a + b), value: (a + b) * c, wrong: a + b * c, then: (a + b) + ' × ' + c },
          { shown: (a * b + c * 3) + ' ' + MINUS + ' ' + a + ' × ' + b, first: a + ' × ' + b + ' = ' + a * b, value: c * 3, wrong: (a * b + c * 3 - a) * b, then: (a * b + c * 3) + ' ' + MINUS + ' ' + a * b }
        ]
        : [
          { shown: (b * b + a) + ' ' + MINUS + ' ' + b + '²', first: b + '² = ' + b * b, value: a, wrong: Math.pow(b * b + a - b, 2), then: (b * b + a) + ' ' + MINUS + ' ' + b * b },
          { shown: a + ' × (' + (b + c) + ' ' + MINUS + ' ' + c + ')²', first: (b + c) + ' ' + MINUS + ' ' + c + ' = ' + b, value: a * b * b, wrong: Math.pow(a * b, 2), then: a + ' × ' + b + '² = ' + a + ' × ' + b * b },
          { shown: (a * c) + ' ÷ ' + c + ' + ' + b + ' × ' + c, first: (a * c) + ' ÷ ' + c + ' = ' + a + '  and  ' + b + ' × ' + c + ' = ' + b * c, value: a + b * c, wrong: (a + b) * c, then: a + ' + ' + b * c }
        ];
      const f = pick(forms);
      return {
        prompt: 'Work out  ' + f.shown,
        kind: 'number',
        hints: [
          'Don’t just go left to right. Use BIDMAS: Brackets, Indices, Division and Multiplication, Addition and Subtraction.',
          'Which part of ' + f.shown + ' has to be done first?',
          'Start with ' + f.first + '. That leaves ' + f.then + '.'
        ],
        solution: [f.shown, 'First: ' + f.first, '= ' + f.then, '= ' + num(f.value)],
        answer: num(f.value),
        check: numberChecker(f.value, f.wrong !== f.value ? [{ value: f.wrong, message: 'It looks like you worked from left to right. Use BIDMAS to decide what comes first.' }] : [])
      };
    }
  });

  // ----- Rounding -----

  M.register({
    id: 'rounding', name: 'Rounding', strand: 'number', year: 'Y7–8', example: '3.476 to 1 d.p.',
    learn: {
      title: 'How do I round numbers?',
      body: [
        'Find the digit you’re rounding to, then look at the <strong>next digit</strong>. If it’s 5 or more, round up. If it’s 4 or less, keep the digit the same.',
        '<strong>Decimal places</strong> (d.p.) count digits after the decimal point.',
        '<strong>Significant figures</strong> (s.f.) count from the first non-zero digit. Fill in with zeros to keep the number the right size: 4,780 to 1 s.f. is 5,000.'
      ],
      eg: '3.476 to 1 d.p. = 3.5   (next digit 7, so round up)\n0.04381 to 2 s.f. = 0.044\n62,849 to 2 s.f. = 63,000'
    },
    make(level) {
      if (level === 'foundation') {
        if (Math.random() < 0.5) {
          const n = rand(1000, 99999);
          const to = pick([10, 100, 1000]);
          const value = Math.round(n / to) * to;
          return {
            prompt: 'Round ' + n + ' to the nearest ' + to + '.',
            kind: 'number',
            hints: [
              'Which two multiples of ' + to + ' is ' + n + ' between?',
              n + ' is between ' + Math.floor(n / to) * to + ' and ' + (Math.floor(n / to) + 1) * to + '. Which one is it closer to?',
              'Look at the digit after the ' + (to === 10 ? 'tens' : to === 100 ? 'hundreds' : 'thousands') + ' digit. If it’s 5 or more, round up.'
            ],
            solution: [n + ' is between ' + Math.floor(n / to) * to + ' and ' + (Math.floor(n / to) + 1) * to, 'It is closer to ' + value],
            answer: String(value),
            check: numberChecker(value, [{ value: Math.floor(n / to) * to === value ? value + to : Math.floor(n / to) * to, message: 'Check the next digit: 5 or more rounds up, 4 or less rounds down.' }])
          };
        }
        const dp = pick([1, 2]);
        const n = rand(100, 99999) / 1000;
        const value = roundDp(n, dp);
        const truncated = Math.floor(n * Math.pow(10, dp)) / Math.pow(10, dp);
        return {
          prompt: 'Round ' + n + ' to ' + dp + ' decimal place' + (dp > 1 ? 's' : '') + '.',
          kind: 'number',
          hints: [
            'Count ' + dp + ' digit' + (dp > 1 ? 's' : '') + ' after the decimal point. That’s where you cut it off.',
            'Now look at the very next digit. Is it 5 or more?',
            'Next digit 5 or more: add 1 to the last digit you keep. 4 or less: leave it.'
          ],
          solution: [n + ' to ' + dp + ' d.p.', 'The next digit decides whether to round up', 'Answer: ' + value],
          answer: String(value),
          check: numberChecker(value, truncated !== value ? [{ value: truncated, message: 'You cut the number off without rounding. Check the next digit: if it’s 5 or more, round up.' }] : [])
        };
      }
      const sf = pick([1, 2, 3]);
      const n = pick([rand(1000, 999999), rand(1, 9999) / 100000]);
      const value = roundSf(n, sf);
      return {
        prompt: 'Round ' + num(n) + ' to ' + sf + ' significant figure' + (sf > 1 ? 's' : '') + '.',
        kind: 'number',
        hints: [
          'Significant figures start from the first digit that isn’t zero.',
          'Find the first non-zero digit and count ' + sf + ' digit' + (sf > 1 ? 's' : '') + ' from there. Then look at the next digit to decide whether to round up.',
          'Keep the number the same size: big numbers need zeros at the end, and small decimals keep their zeros at the start.'
        ],
        solution: [num(n) + ' to ' + sf + ' s.f.', 'Answer: ' + num(value)],
        answer: num(value),
        check: numberChecker(value, n >= 1 ? [{ value: Number(String(value).replace(/0+$/, '')) || value, message: 'Keep the number the same size! Fill the other places with zeros.' }].filter(m => m.value !== value) : [])
      };
    }
  });

  // ----- HCF and LCM -----

  M.register({
    id: 'hcf-lcm', name: 'HCF and LCM', strand: 'number', year: 'Y7', example: 'HCF of 12 and 18',
    learn: {
      title: 'What are the HCF and LCM?',
      body: [
        'A <strong>factor</strong> divides into a number exactly. A <strong>multiple</strong> is in its times table.',
        'The <strong>highest common factor</strong> (HCF) is the biggest number that divides into both.',
        'The <strong>lowest common multiple</strong> (LCM) is the smallest number that is in both times tables.',
        'Listing factors or multiples works for small numbers. For bigger ones, use prime factors.'
      ],
      eg: 'Factors of 12: 1, 2, 3, 4, 6, 12\nFactors of 18: 1, 2, 3, 6, 9, 18\nHCF = 6\n\nMultiples of 4: 4, 8, 12, 16…\nMultiples of 6: 6, 12, 18…\nLCM = 12'
    },
    make(level) {
      const big = level === 'higher';
      let a, b;
      do {
        const g = rand(2, big ? 15 : 6);
        a = g * rand(1, big ? 9 : 5);
        b = g * rand(1, big ? 9 : 5);
      } while (a === b || a === 1 || b === 1);
      if (Math.random() < 0.5) {
        const h = gcd(a, b);
        return {
          prompt: 'Find the highest common factor (HCF) of ' + a + ' and ' + b + '.',
          kind: 'number',
          hints: [
            'The HCF is the biggest number that divides exactly into both ' + a + ' and ' + b + '.',
            'List the factors of ' + Math.min(a, b) + ', starting from the biggest. Which is the first one that also divides into ' + Math.max(a, b) + '?',
            'The factors of ' + Math.min(a, b) + ' are ' + factors(Math.min(a, b)).join(', ') + '. Which of these also go into ' + Math.max(a, b) + '?'
          ],
          solution: ['Factors of ' + a + ': ' + factors(a).join(', '), 'Factors of ' + b + ': ' + factors(b).join(', '), 'HCF = ' + h],
          answer: String(h),
          check: commonFactorCheck(a, b, h)
        };
      }
      const l = lcm(a, b);
      return {
        prompt: 'Find the lowest common multiple (LCM) of ' + a + ' and ' + b + '.',
        kind: 'number',
        hints: [
          'The LCM is the smallest number that is in the times tables of both ' + a + ' and ' + b + '.',
          'Write out the multiples of ' + Math.max(a, b) + '. Which is the first one that ' + Math.min(a, b) + ' also divides into?',
          'Multiples of ' + Math.max(a, b) + ': ' + [1, 2, 3, 4, 5, 6].map(i => i * Math.max(a, b)).join(', ') + ', … Which is the first one in the ' + Math.min(a, b) + ' times table?'
        ],
        solution: ['Multiples of ' + Math.max(a, b) + ': ' + [1, 2, 3, 4, 5].map(i => i * Math.max(a, b)).join(', ') + ', …', 'The first one that ' + Math.min(a, b) + ' divides into is ' + l, 'LCM = ' + l],
        answer: String(l),
        check: numberChecker(l, a * b !== l ? [{ value: a * b, message: 'That’s a common multiple, but is it the lowest one? Look for a smaller number in both times tables.' }] : [])
      };
    }
  });

  function factors(n) {
    const out = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
    return out;
  }

  function commonFactorCheck(a, b, h) {
    const base = numberChecker(h);
    return function (input) {
      const r = base(input);
      if (r.status !== 'wrong') return r;
      const v = Number(String(input).trim());
      if (Number.isInteger(v) && v > 0 && a % v === 0 && b % v === 0) return { status: 'almost', message: v + ' is a common factor, but not the highest one. Is there a bigger number that goes into both?' };
      return r;
    };
  }

  // ----- Prime factors -----

  M.register({
    id: 'primes', name: 'Prime factors', strand: 'number', year: 'Y8', example: '72 = 2³ × 3²',
    learn: {
      title: 'How do I write a number as a product of primes?',
      body: [
        'A <strong>prime</strong> has exactly two factors: 1 and itself. 2, 3, 5, 7, 11, 13… (1 is not prime.)',
        'Every whole number can be built by multiplying primes. Use a <strong>factor tree</strong>: split the number into any two factors, then keep splitting until every branch ends in a prime.',
        'Write the answer with powers: 2 × 2 × 2 × 3 × 3 = 2³ × 3². Type it as 2^3 × 3^2.'
      ],
      eg: '72\n= 8 × 9\n= 2 × 2 × 2 × 3 × 3\n= 2³ × 3²'
    },
    make(level) {
      const primes = level === 'higher' ? [2, 3, 5, 7, 11] : [2, 3, 5, 7];
      const max = level === 'higher' ? 1000 : 150;
      let n, powers;
      do {
        powers = {};
        n = 1;
        const count = rand(level === 'higher' ? 4 : 3, level === 'higher' ? 6 : 4);
        for (let i = 0; i < count; i++) {
          const p = pick(primes.slice(0, i < 2 ? 2 : primes.length));
          n *= p;
          powers[p] = (powers[p] || 0) + 1;
        }
      } while (n > max || n < 12 || Object.keys(powers).length < 2);
      const list = Object.keys(powers).map(Number).sort((x, y) => x - y);
      const answer = list.map(p => p + (powers[p] > 1 ? sup(powers[p]) : '')).join(' × ');
      const long = list.flatMap(p => Array(powers[p]).fill(p)).join(' × ');
      const smallest = list[0];
      return {
        prompt: 'Write ' + n + ' as a product of its prime factors. Use powers where you can.',
        kind: 'primes',
        hints: [
          'Make a factor tree: split ' + n + ' into two numbers that multiply to make it. Keep splitting until every branch ends in a prime number.',
          'Start with the smallest prime that divides into ' + n + '. Does 2 go in? If not, try 3, then 5…',
          n + ' = ' + smallest + ' × ' + n / smallest + '. Now split ' + n / smallest + ' the same way, and keep going.'
        ],
        solution: [n + ' = ' + long, 'With powers:  ' + answer],
        answer,
        check: primeFactorChecker(n)
      };
    }
  });

  // ----- Fractions -----

  M.register({
    id: 'fractions', name: 'Fractions', strand: 'number', year: 'Y7–8', example: '2/3 + 1/4',
    learn: {
      title: 'How do I calculate with fractions?',
      body: [
        '<strong>Adding and subtracting:</strong> make the denominators (bottom numbers) the same first, then add or subtract the numerators (top numbers).',
        '<strong>Multiplying:</strong> multiply the tops and multiply the bottoms.',
        '<strong>Dividing:</strong> keep the first fraction, change ÷ to ×, and flip the second fraction (KFC: Keep, Flip, Change).',
        '<strong>Fraction of an amount:</strong> divide by the bottom, multiply by the top.',
        'Always simplify your answer. Type fractions like 3/4, or mixed numbers like 1 1/2.'
      ],
      eg: '2/3 + 1/4 = 8/12 + 3/12 = 11/12\n2/3 × 3/5 = 6/15 = 2/5\n1/2 ÷ 3/4 = 1/2 × 4/3 = 4/6 = 2/3\n3/5 of 40 = 40 ÷ 5 × 3 = 24'
    },
    make(level) {
      const d1 = rand(2, 9), d2 = rand(2, 9);
      const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
      const f1 = n1 + '/' + d1, f2 = n2 + '/' + d2;
      if (level === 'foundation') {
        if (Math.random() < 0.35) {
          const amount = d1 * rand(2, 12);
          const value = amount / d1 * n1;
          return {
            prompt: 'Work out  ' + f1 + '  of  ' + amount,
            kind: 'number',
            hints: [
              'The bottom number says how many equal parts to split ' + amount + ' into. The top number says how many parts you take.',
              'What is ' + amount + ' ÷ ' + d1 + '? That’s one part.',
              'One part is ' + amount / d1 + '. You want ' + n1 + ' part' + (n1 > 1 ? 's' : '') + '.'
            ],
            solution: [amount + ' ÷ ' + d1 + ' = ' + amount / d1, amount / d1 + ' × ' + n1 + ' = ' + value],
            answer: String(value),
            check: numberChecker(value)
          };
        }
        const add = Math.random() < 0.6;
        const top = add ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
        const bottom = d1 * d2;
        const common = lcm(d1, d2);
        return {
          prompt: 'Work out  ' + f1 + (add ? ' + ' : ' ' + MINUS + ' ') + f2 + '. Give your answer in its simplest form.',
          kind: 'fraction',
          hints: [
            'You can only ' + (add ? 'add' : 'subtract') + ' fractions when the denominators (bottom numbers) are the same.',
            'Find a number that both ' + d1 + ' and ' + d2 + ' go into. The smallest is ' + common + '. Change both fractions to have that denominator.',
            f1 + ' = ' + n1 * common / d1 + '/' + common + ' and ' + f2 + ' = ' + n2 * common / d2 + '/' + common + '. Now ' + (add ? 'add' : 'subtract') + ' the tops, then simplify.'
          ],
          solution: [
            f1 + ' = ' + n1 * common / d1 + '/' + common + ',  ' + f2 + ' = ' + n2 * common / d2 + '/' + common,
            (n1 * common / d1) + '/' + common + (add ? ' + ' : ' ' + MINUS + ' ') + (n2 * common / d2) + '/' + common + ' = ' + num(top * common / bottom) + '/' + common,
            'Simplest form: ' + frac(top, bottom)
          ],
          answer: frac(top, bottom),
          check: fractionChecker(top, bottom, [{ n: add ? n1 + n2 : n1 - n2, d: d1 + d2, message: 'You can’t add (or subtract) the bottoms. Make the denominators the same first.' }])
        };
      }
      if (Math.random() < 0.5) {
        const top = n1 * n2, bottom = d1 * d2;
        return {
          prompt: 'Work out  ' + f1 + ' × ' + f2 + '. Give your answer in its simplest form.',
          kind: 'fraction',
          hints: [
            'Multiplying fractions is the easy one: no need for a common denominator.',
            'Multiply the tops together and the bottoms together.',
            n1 + ' × ' + n2 + ' = ' + top + ' and ' + d1 + ' × ' + d2 + ' = ' + bottom + '. Can ' + top + '/' + bottom + ' be simplified?'
          ],
          solution: [f1 + ' × ' + f2 + ' = ' + top + '/' + bottom, 'Simplest form: ' + frac(top, bottom)],
          answer: frac(top, bottom),
          check: fractionChecker(top, bottom)
        };
      }
      const top = n1 * d2, bottom = d1 * n2;
      return {
        prompt: 'Work out  ' + f1 + ' ÷ ' + f2 + '. Give your answer in its simplest form.',
        kind: 'fraction',
        hints: [
          'To divide by a fraction, multiply by its reciprocal (flip it upside down). Remember KFC: Keep, Flip, Change.',
          'Keep ' + f1 + ', change ÷ to ×, and flip ' + f2 + ' to ' + d2 + '/' + n2 + '.',
          f1 + ' × ' + d2 + '/' + n2 + ' = ' + top + '/' + bottom + '. Simplify it, or write it as a mixed number.'
        ],
        solution: [f1 + ' ÷ ' + f2 + ' = ' + f1 + ' × ' + d2 + '/' + n2, '= ' + top + '/' + bottom, 'Simplest form: ' + frac(top, bottom)],
        answer: frac(top, bottom),
        check: fractionChecker(top, bottom, [{ n: n1 * n2, d: d1 * d2, message: 'You multiplied instead of dividing. Flip the second fraction, then multiply.' }])
      };
    }
  });

  // ----- Fractions, decimals and percentages -----

  const FDP = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [7, 20], [1, 25], [6, 25], [1, 8], [3, 8], [1, 50], [13, 50]];

  M.register({
    id: 'fdp', name: 'Fractions, decimals, percentages', strand: 'number', year: 'Y7', example: '3/4 = 0.75 = 75%',
    learn: {
      title: 'How do I convert between fractions, decimals and percentages?',
      body: [
        '<strong>Percent</strong> means "out of 100". 35% = 35/100 = 0.35.',
        'Decimal → percentage: multiply by 100. Percentage → decimal: divide by 100.',
        'Fraction → decimal: divide the top by the bottom, or make the bottom 10, 100 or 1000.',
        'Percentage → fraction: write it over 100, then simplify.'
      ],
      eg: '3/4 = 75/100 = 0.75 = 75%\n35% = 35/100 = 7/20\n0.6 = 60%'
    },
    make(level) {
      const [n, d] = pick(FDP);
      const decimal = n / d, percent = roundDp(decimal * 100, 4);
      const type = level === 'foundation' ? pick(['f2p', 'd2p', 'f2d']) : pick(['p2f', 'd2f', 'f2p']);
      if (type === 'f2p') {
        return {
          prompt: 'Write ' + n + '/' + d + ' as a percentage.',
          kind: 'number',
          hints: [
            'Percent means "out of 100". Can you make an equivalent fraction with 100 on the bottom?',
            'What do you multiply ' + d + ' by to get 100? Do the same to the top.' + (100 % d ? ' (If 100 doesn’t work, find the decimal first by dividing ' + n + ' by ' + d + '.)' : ''),
            n + '/' + d + ' as a decimal is ' + decimal + '. Multiply by 100 to get a percentage.'
          ],
          solution: [n + '/' + d + ' = ' + n + ' ÷ ' + d + ' = ' + decimal, decimal + ' × 100 = ' + percent + '%'],
          answer: percent + '%',
          check: numberChecker(percent, [{ value: decimal, message: 'That’s the decimal. Multiply by 100 to get the percentage.' }])
        };
      }
      if (type === 'd2p') {
        return {
          prompt: 'Write ' + decimal + ' as a percentage.',
          kind: 'number',
          hints: ['Percent means "out of 100".', 'To change a decimal to a percentage, multiply by 100.', decimal + ' × 100 moves every digit two places to the left.'],
          solution: [decimal + ' × 100 = ' + percent + '%'],
          answer: percent + '%',
          check: numberChecker(percent)
        };
      }
      if (type === 'f2d') {
        return {
          prompt: 'Write ' + n + '/' + d + ' as a decimal.',
          kind: 'number',
          hints: [
            'A fraction is a division: ' + n + '/' + d + ' means ' + n + ' ÷ ' + d + '.',
            'Can you make the bottom 10, 100 or 1000? What would you multiply ' + d + ' by?',
            n + '/' + d + ' = ' + percent + '/100. Write that as a decimal.'
          ],
          solution: [n + '/' + d + ' = ' + percent + '/100', '= ' + decimal],
          answer: String(decimal),
          check: numberChecker(decimal, [{ value: percent, message: 'That’s the percentage. A decimal is that number divided by 100.' }])
        };
      }
      const from = type === 'p2f' ? percent + '%' : String(decimal);
      return {
        prompt: 'Write ' + from + ' as a fraction in its simplest form.',
        kind: 'fraction',
        hints: [
          type === 'p2f' ? 'Percent means "out of 100", so start by writing ' + percent + ' over 100.' : 'Use place value: the last digit of ' + decimal + ' is in the ' + (String(decimal).split('.')[1].length === 1 ? 'tenths' : String(decimal).split('.')[1].length === 2 ? 'hundredths' : 'thousandths') + ' column.',
          'Write it as a fraction over ' + (type === 'p2f' ? 100 : Math.pow(10, String(decimal).split('.')[1].length)) + ', then simplify.',
          'Divide the top and bottom by their highest common factor.'
        ],
        solution: type === 'p2f'
          ? [percent + '% = ' + percent + '/100', 'Simplify: ' + n + '/' + d]
          : [decimal + ' = ' + Math.round(decimal * Math.pow(10, String(decimal).split('.')[1].length)) + '/' + Math.pow(10, String(decimal).split('.')[1].length), 'Simplify: ' + n + '/' + d],
        answer: n + '/' + d,
        check: fractionChecker(n, d)
      };
    }
  });

  // ----- Percentages -----

  M.register({
    id: 'percentages', name: 'Percentages', strand: 'number', year: 'Y7–9', example: '15% of £40',
    learn: {
      title: 'How do I work with percentages?',
      body: [
        '<strong>Percentage of an amount:</strong> find 10% (divide by 10) or 1% (divide by 100), then build up. Or use a decimal multiplier: 15% of 40 = 0.15 × 40.',
        '<strong>Increase or decrease:</strong> find the percentage and add it on or take it off. Or use a multiplier: a 20% increase is × 1.2; a 20% decrease is × 0.8.',
        '<strong>Percentage change</strong> = change ÷ original × 100.'
      ],
      eg: '15% of £40:  10% = £4, 5% = £2, so 15% = £6\nIncrease £50 by 20%:  £50 × 1.2 = £60\n£80 to £60 is a change of £20; 20 ÷ 80 × 100 = 25% decrease'
    },
    make(level) {
      if (level === 'foundation') {
        const p = pick([10, 20, 25, 50, 5, 15, 30, 75, 1, 40, 60]);
        const amount = pick([20, 40, 60, 80, 120, 200, 240, 300, 360, 500]);
        const value = amount * p / 100;
        return {
          prompt: 'Work out ' + p + '% of £' + amount + '.',
          kind: 'number',
          hints: [
            'Start with an easy percentage. 10% means divide by 10. 1% means divide by 100. 50% is half.',
            'What is 10% of £' + amount + '? How can you build ' + p + '% from 10%, 5% or 1%?',
            '10% of £' + amount + ' is ' + money(amount / 10) + '. ' + p + '% is ' + p / 10 + ' lots of that.'
          ],
          solution: ['10% of £' + amount + ' = ' + money(amount / 10), p + '% = ' + p / 10 + ' × ' + money(amount / 10) + ' = ' + money(value)],
          answer: money(value),
          check: numberChecker(value)
        };
      }
      if (Math.random() < 0.6) {
        const p = pick([5, 10, 12, 15, 20, 25, 30, 35, 40]);
        const amount = pick([40, 60, 80, 120, 150, 200, 250, 360, 400, 640]);
        const up = Math.random() < 0.5;
        const mult = roundDp(1 + (up ? p : -p) / 100, 2);
        const value = roundDp(amount * mult, 2);
        return {
          prompt: (up ? 'Increase' : 'Decrease') + ' £' + amount + ' by ' + p + '%.',
          kind: 'number',
          hints: [
            'You can find ' + p + '% of £' + amount + ' and then ' + (up ? 'add it on' : 'take it off') + '. Or use a multiplier in one step.',
            'The new amount is ' + (up ? '100% + ' : '100% ' + MINUS + ' ') + p + '% = ' + (up ? 100 + p : 100 - p) + '% of the original. What decimal is ' + (up ? 100 + p : 100 - p) + '%?',
            'The multiplier is ' + mult + '. Work out £' + amount + ' × ' + mult + '.'
          ],
          solution: [p + '% of £' + amount + ' = ' + money(amount * p / 100), '£' + amount + (up ? ' + ' : ' ' + MINUS + ' ') + money(amount * p / 100) + ' = ' + money(value), 'Or in one step: £' + amount + ' × ' + mult + ' = ' + money(value)],
          answer: money(value),
          check: numberChecker(value, [{ value: amount * p / 100, message: 'That’s ' + p + '% of the amount. Now ' + (up ? 'add it on to' : 'take it away from') + ' £' + amount + '.' }])
        };
      }
      const original = pick([20, 40, 50, 80, 120, 200, 250, 400]);
      const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
      const up = Math.random() < 0.5;
      const after = original * (100 + (up ? p : -p)) / 100;
      return {
        prompt: 'A price changes from £' + original + ' to ' + money(after) + '. What is the percentage ' + (up ? 'increase' : 'decrease') + '?',
        kind: 'number',
        hints: [
          'Percentage change = change ÷ original amount × 100.',
          'What is the change in price? And which amount is the original?',
          'The change is ' + money(Math.abs(after - original)) + ' and the original is £' + original + '. Work out ' + num(Math.abs(after - original)) + ' ÷ ' + original + ' × 100.'
        ],
        solution: ['Change = ' + money(Math.abs(after - original)), num(Math.abs(after - original)) + ' ÷ ' + original + ' × 100 = ' + p + '%'],
        answer: p + '%',
        check: numberChecker(p, [{ value: roundDp(Math.abs(after - original) / after * 100, 2), message: 'Divide by the original amount (the starting price), not the new one.' }])
      };
    }
  });

  // ----- Powers and roots -----

  M.register({
    id: 'powers', name: 'Powers and roots', strand: 'number', year: 'Y7–8', example: '5², √49, 2³',
    learn: {
      title: 'What are powers and roots?',
      body: [
        'A <strong>square number</strong> is a number times itself: 5² = 5 × 5 = 25. A <strong>cube</strong> is three of them: 2³ = 2 × 2 × 2 = 8.',
        'A <strong>square root</strong> undoes squaring: √25 = 5. A <strong>cube root</strong> undoes cubing: ∛8 = 2.',
        'Learn the squares up to 15² and the cubes of 1, 2, 3, 4, 5 and 10. They come up all the time.'
      ],
      eg: '7² = 49    √49 = 7\n4³ = 64    ∛64 = 4\n2⁵ = 2 × 2 × 2 × 2 × 2 = 32'
    },
    make(level) {
      const type = level === 'foundation' ? pick(['sq', 'root', 'cube']) : pick(['cube', 'cuberoot', 'power', 'combo']);
      if (type === 'sq') {
        const n = rand(2, 15);
        return {
          prompt: 'Work out  ' + n + '²',
          kind: 'number',
          hints: ['The little 2 means "squared": multiply the number by itself.', 'What is ' + n + ' × ' + n + '?', n > 10 ? n + ' × ' + n + ' = ' + n + ' × 10 + ' + n + ' × ' + (n - 10) + '.' : 'Count up in ' + n + 's, ' + n + ' times: ' + n + ', ' + 2 * n + ', ' + 3 * n + ', …'],
          solution: [n + '² = ' + n + ' × ' + n + ' = ' + n * n],
          answer: String(n * n),
          check: numberChecker(n * n, [{ value: 2 * n, message: 'Squaring means ' + n + ' × ' + n + ', not ' + n + ' × 2.' }])
        };
      }
      if (type === 'root') {
        const n = rand(2, 15);
        return {
          prompt: 'Work out  √' + n * n,
          kind: 'number',
          hints: ['The square root undoes squaring.', 'Which number, multiplied by itself, makes ' + n * n + '?', 'Try ' + (n - 1) + ' × ' + (n - 1) + ' and ' + (n + 1) + ' × ' + (n + 1) + '. Is the answer between them?'],
          solution: [n + ' × ' + n + ' = ' + n * n, 'So √' + n * n + ' = ' + n],
          answer: String(n),
          check: numberChecker(n, [{ value: n * n / 2, message: 'Square root isn’t halving. Which number times itself makes ' + n * n + '?' }])
        };
      }
      if (type === 'cube') {
        const n = level === 'foundation' ? rand(1, 5) : pick([2, 3, 4, 5, 6, 10, -2, -3]);
        return {
          prompt: 'Work out  ' + numB(n) + '³',
          kind: 'number',
          hints: ['The little 3 means "cubed": three of the number multiplied together.', 'Work out ' + [n, n, n].map(numB).join(' × ') + '.', numB(n) + ' × ' + numB(n) + ' = ' + n * n + '. Now multiply by ' + numB(n) + ' again.'],
          solution: [numB(n) + '³ = ' + [n, n, n].map(numB).join(' × '), '= ' + num(n * n * n)],
          answer: num(n * n * n),
          check: numberChecker(n * n * n, [{ value: 3 * n, message: 'Cubing means ' + numB(n) + ' × ' + numB(n) + ' × ' + numB(n) + ', not × 3.' }])
        };
      }
      if (type === 'cuberoot') {
        const n = pick([2, 3, 4, 5, 10, -2, -3, -4]);
        return {
          prompt: 'Work out  ∛' + numB(n * n * n),
          kind: 'number',
          hints: ['The cube root undoes cubing.', 'Which number, multiplied by itself three times, makes ' + num(n * n * n) + '?', 'Think of the cube numbers: 8, 27, 64, 125, 1000.' + (n < 0 ? ' A negative times a negative times a negative is negative.' : '')],
          solution: [[n, n, n].map(numB).join(' × ') + ' = ' + num(n * n * n), 'So ∛' + numB(n * n * n) + ' = ' + num(n)],
          answer: num(n),
          check: numberChecker(n)
        };
      }
      if (type === 'power') {
        const base = pick([2, 3, 10]);
        const p = base === 2 ? rand(4, 8) : base === 3 ? rand(3, 4) : rand(3, 6);
        const value = Math.pow(base, p);
        return {
          prompt: 'Work out  ' + base + sup(p),
          kind: 'number',
          hints: ['The power tells you how many ' + base + '’s to multiply together.', 'Write it out: ' + Array(p).fill(base).join(' × ') + '.', 'Go step by step: ' + [1, 2, 3].map(i => base + sup(i) + ' = ' + Math.pow(base, i)).join(', ') + ', …'],
          solution: [base + sup(p) + ' = ' + Array(p).fill(base).join(' × '), '= ' + value],
          answer: String(value),
          check: numberChecker(value, [{ value: base * p, message: 'A power isn’t a multiplication by ' + p + '. Multiply ' + p + ' ' + base + '’s together.' }])
        };
      }
      const a = rand(2, 10), b = rand(2, 4);
      const value = a * a + b * b * b;
      return {
        prompt: 'Work out  ' + a + '² + ' + b + '³',
        kind: 'number',
        hints: ['Work out each power separately, then add.', 'What is ' + a + '²? And what is ' + b + '³?', a + '² = ' + a * a + '. Now ' + b + '³ = ' + b + ' × ' + b + ' × ' + b + '.'],
        solution: [a + '² = ' + a * a + '  and  ' + b + '³ = ' + b * b * b, a * a + ' + ' + b * b * b + ' = ' + value],
        answer: String(value),
        check: numberChecker(value)
      };
    }
  });

  // ----- Standard form -----

  // 3.4 × 10⁴ written nicely
  function sf(mantissa, power) {
    return num(mantissa) + ' × 10' + sup(power);
  }

  M.register({
    id: 'standard-form', name: 'Standard form', strand: 'number', year: 'Y9', example: '34 000 = 3.4 × 10⁴',
    learn: {
      title: 'What is standard form?',
      body: [
        'Standard form is a short way to write very big or very small numbers: <strong>A × 10ⁿ</strong>, where A is at least 1 and less than 10.',
        'For big numbers, n is positive: count how many places the decimal point moves left to get A.',
        'For small numbers, n is negative: 0.0045 = 4.5 × 10⁻³.',
        'Type powers with ^, like 3.4 x 10^4 or 4.5 x 10^-3.'
      ],
      eg: '34 000 = 3.4 × 10⁴\n0.0045 = 4.5 × 10⁻³\n(2 × 10³) × (4 × 10⁵) = 8 × 10⁸'
    },
    make(level) {
      const mantissa = rand(11, 99) / 10;
      const toStandard = Math.random() < 0.5;
      const power = level === 'foundation' ? rand(3, 7) : pick([-5, -4, -3, -2, 3, 4, 5, 6]);
      const value = roundSf(mantissa * Math.pow(10, power), 4);
      const plain = power > 0 ? value.toLocaleString('en-GB') : num(value);

      if (level === 'higher' && Math.random() < 0.4) {
        const a = rand(2, 4), b = rand(2, 4), p = rand(2, 6), q = rand(2, 6);
        let m = a * b, n = p + q;
        const mid = m + ' × 10' + sup(n);
        if (m >= 10) { m = m / 10; n += 1; }
        return {
          prompt: 'Work out  (' + sf(a, p) + ') × (' + sf(b, q) + '). Give your answer in standard form.',
          kind: 'standard',
          hints: [
            'Multiply the front numbers together, and multiply the powers of 10 together.',
            'Front numbers: ' + a + ' × ' + b + '. Powers of 10: when you multiply, add the powers.',
            'You get ' + mid + '.' + (a * b >= 10 ? ' But ' + a * b + ' is not less than 10, so adjust it: move the decimal point and change the power.' : ' Check the front number is between 1 and 10.')
          ],
          solution: [a + ' × ' + b + ' = ' + a * b + '  and  10' + sup(p) + ' × 10' + sup(q) + ' = 10' + sup(p + q), '= ' + mid].concat(a * b >= 10 ? ['= ' + sf(m, n)] : []),
          answer: sf(m, n),
          check: standardFormChecker(m * Math.pow(10, n))
        };
      }
      if (toStandard) {
        return {
          prompt: 'Write ' + plain + ' in standard form.',
          kind: 'standard',
          hints: [
            'Standard form is A × 10ⁿ, where A is at least 1 and less than 10.',
            'Put the decimal point after the first non-zero digit to get A = ' + num(mantissa) + '. How many places did the decimal point move?',
            'The point moves ' + Math.abs(power) + ' places. ' + (power > 0 ? 'It’s a big number, so the power is positive.' : 'It’s a small number (less than 1), so the power is negative.')
          ],
          solution: ['A = ' + num(mantissa), 'The decimal point moves ' + Math.abs(power) + ' places', plain + ' = ' + sf(mantissa, power)],
          answer: sf(mantissa, power),
          check: standardFormChecker(value)
        };
      }
      return {
        prompt: 'Write ' + sf(mantissa, power) + ' as an ordinary number.',
        kind: 'number',
        hints: [
          '10' + sup(power) + (power > 0 ? ' means multiply by 10, ' + power + ' times.' : ' means divide by 10, ' + -power + ' times.'),
          'Move the decimal point in ' + num(mantissa) + ' ' + Math.abs(power) + ' places to the ' + (power > 0 ? 'right' : 'left') + '.',
          'Fill any gaps with zeros as you move the decimal point.'
        ],
        solution: [sf(mantissa, power), 'Move the decimal point ' + Math.abs(power) + ' places ' + (power > 0 ? 'right' : 'left'), '= ' + plain],
        answer: plain,
        check: numberChecker(value, [{ value: mantissa * Math.pow(10, -power), message: 'The decimal point went the wrong way. A ' + (power > 0 ? 'positive power makes the number bigger' : 'negative power makes the number smaller') + '.' }])
      };
    }
  });

})(this);
