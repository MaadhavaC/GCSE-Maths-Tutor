// Algebra topics, Years 7 to 9.

(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('../maths.js') : root.MathsEngine;
  const { rand, randNonZero, pick, gcd, MINUS, num, numB, frac, sup, poly, terms, xPlus, bracketCount, countTerms,
    parse, numberChecker, expressionChecker, fractionChecker, inequalityChecker, pairChecker } = M;

  // ----- Simplifying expressions -----

  M.register({
    id: 'simplify', name: 'Simplifying expressions', strand: 'algebra', year: 'Y7', example: '3x + 2y + x',
    learn: {
      title: 'How do I simplify an expression?',
      body: [
        '<strong>Like terms</strong> have exactly the same letters (and powers). 3x and 5x are like terms. 3x and 5y are not, and neither are x and x².',
        'You can add and subtract like terms: 3x + 5x = 8x. The sign in front of a term belongs to it.',
        'When multiplying, multiply the numbers and write the letters next to each other: 3x × 4y = 12xy.'
      ],
      eg: '4x + 3y − x + 2y\n= 4x − x + 3y + 2y\n= 3x + 5y'
    },
    make(level) {
      if (level === 'foundation') {
        let a, b, c, d;
        do { a = rand(1, 9); b = randNonZero(-6, 9); c = randNonZero(-6, 9); d = randNonZero(-6, 9); } while (a + c === 0 || b + d === 0);
        const question = terms([[a, 'x'], [b, 'y'], [c, 'x'], [d, 'y']]);
        const answer = poly([[a + c, 'x'], [b + d, 'y']]);
        return {
          prompt: 'Simplify  ' + question,
          kind: 'expression',
          hints: [
            'Like terms have the same letter. You can only combine x terms with x terms, and y terms with y terms.',
            'Collect the x terms: what is ' + num(a) + ' + ' + numB(c) + '? Then the y terms: what is ' + num(b) + ' + ' + numB(d) + '? The sign in front of each term belongs to it.',
            'The x terms make ' + poly([[a + c, 'x']]) + '. Now combine ' + poly([[b, 'y']]) + ' and ' + poly([[d, 'y']]) + '.'
          ],
          solution: [
            question,
            'x terms: ' + num(a) + ' + ' + numB(c) + ' = ' + num(a + c) + ', so ' + poly([[a + c, 'x']]),
            'y terms: ' + num(b) + ' + ' + numB(d) + ' = ' + num(b + d) + ', so ' + poly([[b + d, 'y']]),
            'Answer: ' + answer
          ],
          answer,
          check: expressionChecker((a + c) + 'x+(' + (b + d) + ')y', {
            letters: ['x', 'y'],
            form: t => countTerms(t) > 2 ? 'That’s equal, but you can still collect some like terms together.' : null
          })
        };
      }

      if (Math.random() < 0.5) {
        // Multiplying or dividing terms
        const p = rand(2, 9), q = rand(2, 9);
        if (Math.random() < 0.5) {
          const answer = (p * q) + 'xy';
          return {
            prompt: 'Simplify  ' + p + 'x × ' + q + 'y',
            kind: 'expression',
            hints: [
              'When you multiply terms, multiply the numbers together and the letters together.',
              'What is ' + p + ' × ' + q + '? And how do you write x × y in algebra?',
              p + ' × ' + q + ' = ' + p * q + ', and x × y is written xy. Put them together.'
            ],
            solution: [p + 'x × ' + q + 'y', '= ' + p + ' × ' + q + ' × x × y', '= ' + answer],
            answer,
            check: expressionChecker(p * q + 'xy', {
              letters: ['x', 'y'],
              form: t => /[*×/÷(]/.test(t) ? 'That’s equal, but simplify it fully: multiply the numbers and write the letters together.' : null,
              mistakes: [{ expr: (p + q) + 'xy', message: 'You added ' + p + ' and ' + q + '. This is a multiplication, so multiply them.' }]
            })
          };
        }
        const answer = poly([[p, 'y']]);
        return {
          prompt: 'Simplify  ' + (p * q) + 'xy ÷ ' + q + 'x',
          kind: 'expression',
          hints: [
            'Write it as a fraction, then divide the numbers and cancel any letters that are on the top and the bottom.',
            'What is ' + p * q + ' ÷ ' + q + '? Which letter appears on both the top and the bottom?',
            p * q + ' ÷ ' + q + ' = ' + p + ', and the x on top cancels with the x on the bottom. What’s left?'
          ],
          solution: [(p * q) + 'xy ÷ ' + q + 'x', p * q + ' ÷ ' + q + ' = ' + p + '   and   xy ÷ x = y', 'Answer: ' + answer],
          answer,
          check: expressionChecker(p + 'y', {
            letters: ['x', 'y'],
            form: t => /[*×/÷(]/.test(t) ? 'That’s equal, but simplify it fully so there is no division left.' : null
          })
        };
      }

      // Collecting with x² and numbers
      let a, b, c, d, e;
      do { a = randNonZero(-5, 6); b = randNonZero(-8, 8); c = randNonZero(-5, 6); d = randNonZero(-8, 8); e = randNonZero(-9, 9); } while (a + c === 0 || b + d === 0);
      const question = terms([[a, 'x²'], [b, 'x'], [e, ''], [c, 'x²'], [d, 'x']]);
      const answer = poly([[a + c, 'x²'], [b + d, 'x'], [e, '']]);
      return {
        prompt: 'Simplify  ' + question,
        kind: 'expression',
        hints: [
          'x² terms and x terms are NOT like terms, because the powers are different. Collect each kind separately.',
          'Add the x² terms: ' + num(a) + ' + ' + numB(c) + '. Add the x terms: ' + num(b) + ' + ' + numB(d) + '. The number term stays on its own.',
          'The x² terms make ' + poly([[a + c, 'x²']]) + '. Now collect the x terms, then write the number on the end.'
        ],
        solution: [
          question,
          'x² terms: ' + num(a) + ' + ' + numB(c) + ' = ' + num(a + c),
          'x terms: ' + num(b) + ' + ' + numB(d) + ' = ' + num(b + d),
          'Answer: ' + answer
        ],
        answer,
        check: expressionChecker('(' + (a + c) + ')x^2+(' + (b + d) + ')x+(' + e + ')', {
          form: t => countTerms(t) > 3 ? 'That’s equal, but you can still collect some like terms together.' : null,
          mistakes: [{ expr: '(' + (a + c + b + d) + ')x^2+(' + e + ')', message: 'x² and x are different kinds of term, so they can’t be added together.' }]
        })
      };
    }
  });

  // ----- Substitution -----

  const SUB_TEMPLATES = {
    foundation: [
      () => { const m = rand(2, 9), n = rand(2, 9); return m + 'a+' + n + 'b'; },
      () => { const m = rand(2, 9); return m + 'a-b'; },
      () => { const n = rand(1, 12); return 'ab+' + n; },
      () => { const m = rand(2, 6); return m + '(a+b)'; },
      () => { const n = rand(2, 9); return 'a^2+' + n; }
    ],
    higher: [
      () => { const m = rand(2, 5); return m + 'a^2-b'; },
      () => { const n = rand(2, 6); return 'a^2+' + n + 'b'; },
      () => { const m = rand(2, 5); return m + 'ab-a'; },
      () => '(a-b)^2',
      () => { const m = rand(2, 4); return 'b^2-' + m + 'a'; }
    ]
  };

  // Turn our internal text (3a^2-b) into what the student sees (3a² − b)
  function pretty(src) {
    return src
      .replace(/\^2/g, '²')
      .replace(/-/g, ' ' + MINUS + ' ')
      .replace(/\+/g, ' + ');
  }

  // Write the expression with the numbers swapped in, showing the hidden × signs.
  function substituted(src, values) {
    let out = '';
    let prev = '';
    for (const ch of src) {
      const isLetter = /[a-z]/.test(ch);
      const needsTimes = (isLetter || ch === '(') && /[0-9a-z)]/.test(prev);
      if (needsTimes) out += ' × ';
      out += isLetter ? numB(values[ch]) : ch;
      prev = ch;
    }
    return pretty(out);
  }

  M.register({
    id: 'substitute', name: 'Substitution', strand: 'algebra', year: 'Y7', example: '2a + b',
    learn: {
      title: 'How does substitution work?',
      body: [
        'Substitution means replacing each letter with a number, then working it out.',
        'In algebra a hidden × sign sits between a number and a letter: 3a means 3 × a, and ab means a × b.',
        'Use <strong>BIDMAS</strong>: Brackets, Indices (powers), Division and Multiplication, then Addition and Subtraction. Put negative numbers in brackets so you square the whole number: (−3)² = 9.'
      ],
      eg: '2a + b  when a = 3, b = 5\n= 2 × 3 + 5\n= 6 + 5 = 11'
    },
    make(level) {
      const a = level === 'foundation' ? rand(1, 9) : randNonZero(-6, 6);
      let b = level === 'foundation' ? rand(1, 9) : randNonZero(-6, 6);
      // Make sure higher questions have at least one negative number to think about
      if (level !== 'foundation' && a > 0 && b > 0) b = -b;
      const src = pick(SUB_TEMPLATES[level])();
      const values = { a, b };
      const value = parse(src).evaluate(values);
      const shown = pretty(src);
      const written = substituted(src, values);
      const tip = level === 'foundation'
        ? 'Remember BIDMAS: brackets, then powers, then × and ÷, then + and −.'
        : 'Put negative numbers in brackets. (' + MINUS + '3)² means (' + MINUS + '3) × (' + MINUS + '3) = 9, which is positive.';

      // A common slip: squaring a negative and keeping the minus sign
      const mistakes = [];
      if (/[a-z]\^2/.test(src) && (a < 0 || b < 0)) {
        const slipSrc = src.replace(/([a-z])\^2/g, (m, v) => '(' + (values[v] < 0 ? '-' : '') + values[v] * values[v] + ')');
        mistakes.push({ value: parse(slipSrc).evaluate(values), message: 'Check your squaring. A negative number squared is positive: (' + MINUS + '2)² = 4, not ' + MINUS + '4.' });
      }
      mistakes.push({ value: -value, message: 'The size is right but the sign is wrong. Go back over the negative numbers carefully.' });

      return {
        prompt: 'Work out  ' + shown + '  when  a = ' + num(a) + '  and  b = ' + num(b),
        kind: 'number',
        hints: [
          'Substituting means replacing each letter with its number. Letters written next to each other, or next to a number, are multiplied: 3a means 3 × a.',
          'Write the expression out again with the numbers in place of a and b. ' + tip,
          'Written out it is:  ' + written + '. Work out powers first, then ×, then + and −.'
        ],
        solution: [shown + '  with  a = ' + num(a) + ',  b = ' + num(b), '= ' + written, '= ' + num(value)],
        answer: num(value),
        check: numberChecker(value, mistakes.filter(m => m.value !== value))
      };
    }
  });

  // ----- Linear equations -----

  M.register({
    id: 'linear', name: 'Linear equations', strand: 'algebra', year: 'Y7–8', example: '3x + 5 = 20',
    learn: {
      title: 'How do I solve a linear equation?',
      body: [
        'An equation is like a balance: both sides are equal. If you do something to one side, you must do the same to the other side to keep it balanced.',
        'To get x on its own, undo what has been done to it using <strong>inverse operations</strong>: + undoes −, and × undoes ÷. Undo things in the reverse order they were done.',
        'If there are x terms on both sides, move them all to one side first.'
      ],
      eg: '3x + 5 = 20\n3x = 15      (subtract 5 from both sides)\nx = 5        (divide both sides by 3)\nCheck: 3 × 5 + 5 = 20 ✓'
    },
    make(level) {
      if (level === 'foundation') {
        const x = rand(-3, 10), a = rand(2, 9), b = randNonZero(-12, 12);
        const c = a * x + b;
        const undoB = b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + Math.abs(b) + ' to';
        return {
          prompt: 'Solve  ' + poly([[a, 'x'], [b, '']]) + ' = ' + num(c),
          kind: 'number',
          hints: [
            'You want x on its own. Here x is multiplied by ' + a + ', then ' + (b > 0 ? b + ' is added' : Math.abs(b) + ' is taken away') + '. Undo those in reverse order.',
            'What can you do to both sides to get rid of the ' + (b > 0 ? '+ ' + b : MINUS + ' ' + Math.abs(b)) + '?',
            undoB + ' both sides to get ' + a + 'x = ' + num(c - b) + '. What do you do to both sides to undo × ' + a + '?'
          ],
          solution: [
            poly([[a, 'x'], [b, '']]) + ' = ' + num(c),
            undoB + ' both sides:  ' + a + 'x = ' + num(c - b),
            'Divide both sides by ' + a + ':  x = ' + num(x)
          ],
          answer: 'x = ' + num(x),
          check: numberChecker(x, [
            { value: (c + b) / a, message: 'Close, but check your first step. To get rid of ' + (b > 0 ? '+ ' + b + ' you subtract it' : MINUS + ' ' + Math.abs(b) + ' you add it') + '. Do the opposite.' },
            { value: c - b, message: 'Nearly there! You’ve found ' + a + 'x. Now find x on its own.' }
          ])
        };
      }

      if (Math.random() < 0.5) {
        // ax + b = cx + d  (letters on both sides)
        const x = rand(-6, 9), a = rand(3, 9), c = rand(1, a - 1), b = randNonZero(-10, 10);
        const d = (a - c) * x + b;
        const left = poly([[a, 'x'], [b, '']]), right = poly([[c, 'x'], [d, '']]);
        const undoB = b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + Math.abs(b) + ' to';
        return {
          prompt: 'Solve  ' + left + ' = ' + right,
          kind: 'number',
          hints: [
            'There are x terms on both sides. Start by getting all the x terms on one side. It’s easiest to move them to the side that has more.',
            'What could you take away from both sides so that x only appears on the left?',
            'Subtract ' + poly([[c, 'x']]) + ' from both sides: ' + poly([[a - c, 'x'], [b, '']]) + ' = ' + num(d) + '. Now it’s a two-step equation. What’s next?'
          ],
          solution: [
            left + ' = ' + right,
            'Subtract ' + poly([[c, 'x']]) + ' from both sides:  ' + poly([[a - c, 'x'], [b, '']]) + ' = ' + num(d),
            undoB + ' both sides:  ' + poly([[a - c, 'x']]) + ' = ' + num(d - b),
            (a - c === 1 ? 'That already says' : 'Divide both sides by ' + (a - c) + ':') + '  x = ' + num(x)
          ],
          answer: 'x = ' + num(x),
          check: numberChecker(x, [
            { value: (d - b) / (a + c), message: 'Check how you moved ' + poly([[c, 'x']]) + '. When it crosses to the other side you subtract it, so you get ' + (a - c) + 'x, not ' + (a + c) + 'x.' }
          ])
        };
      }

      // a(x + b) = c
      const x = rand(-5, 9), a = rand(2, 7), b = randNonZero(-8, 8);
      const c = a * (x + b);
      return {
        prompt: 'Solve  ' + a + '(' + xPlus(b) + ') = ' + num(c),
        kind: 'number',
        hints: [
          'There are two ways in: expand the bracket first, or divide both sides by the ' + a + ' outside the bracket.',
          'Try dividing both sides by ' + a + '. What is ' + num(c) + ' ÷ ' + a + '?',
          'Dividing both sides by ' + a + ' gives ' + xPlus(b) + ' = ' + num(c / a) + '. What do you do to both sides to leave x on its own?'
        ],
        solution: [
          a + '(' + xPlus(b) + ') = ' + num(c),
          'Divide both sides by ' + a + ':  ' + xPlus(b) + ' = ' + num(c / a),
          (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + Math.abs(b) + ' to') + ' both sides:  x = ' + num(x)
        ],
        answer: 'x = ' + num(x),
        check: numberChecker(x, [
          { value: c - b, message: 'Careful: the ' + a + ' multiplies the whole bracket, so deal with it before the ' + num(b) + '.' }
        ])
      };
    }
  });

  // ----- Expanding brackets -----

  M.register({
    id: 'expand', name: 'Expanding brackets', strand: 'algebra', year: 'Y8', example: '3(x + 4)',
    learn: {
      title: 'How do I expand brackets?',
      body: [
        'Expanding means multiplying out the brackets. The term outside multiplies <strong>every</strong> term inside.',
        'For two brackets, every term in the first bracket multiplies every term in the second. FOIL helps you remember all four: First, Outer, Inner, Last. Then collect like terms (add the x terms together).'
      ],
      eg: '3(x + 4) = 3x + 12\n(x + 2)(x + 5) = x² + 5x + 2x + 10 = x² + 7x + 10'
    },
    make(level) {
      if (level === 'foundation') {
        const a = rand(2, 9), b = rand(1, 5), c = randNonZero(-9, 9);
        const inside = poly([[b, 'x'], [c, '']]);
        const answer = poly([[a * b, 'x'], [a * c, '']]);
        return {
          prompt: 'Expand  ' + a + '(' + inside + ')',
          kind: 'expression',
          hints: [
            'The number outside the bracket multiplies every term inside it, not just the first one.',
            'There are two multiplications to do. What is ' + a + ' × ' + poly([[b, 'x']]) + '? And what is ' + a + ' × ' + numB(c) + '?',
            a + ' × ' + poly([[b, 'x']]) + ' = ' + poly([[a * b, 'x']]) + '. Now work out ' + a + ' × ' + numB(c) + ' and watch the sign.'
          ],
          solution: [
            a + '(' + inside + ')',
            a + ' × ' + poly([[b, 'x']]) + ' = ' + poly([[a * b, 'x']]) + '  and  ' + a + ' × ' + numB(c) + ' = ' + num(a * c),
            'So ' + a + '(' + inside + ') = ' + answer
          ],
          answer,
          check: expressionChecker(a * b + 'x+(' + a * c + ')', {
            form: t => bracketCount(t) ? 'That’s equal, but it still has a bracket. Expanding means multiplying out so the brackets disappear.' : null,
            mistakes: [
              { expr: (a * b) + 'x+(' + c + ')', message: 'You multiplied the first term but not the second. The ' + a + ' multiplies everything inside the bracket.' },
              { expr: (a * b) + 'x-(' + a * c + ')', message: 'The x part is right. Check the sign of the number: ' + a + ' × ' + numB(c) + '.' }
            ]
          })
        };
      }

      const p = randNonZero(-9, 9), q = randNonZero(-9, 9);
      const answer = poly([[1, 'x²'], [p + q, 'x'], [p * q, '']]);
      const first = xPlus(p), second = xPlus(q);
      return {
        prompt: 'Expand and simplify  (' + first + ')(' + second + ')',
        kind: 'expression',
        hints: [
          'Every term in the first bracket multiplies every term in the second, so there are 4 multiplications. Try FOIL: First, Outer, Inner, Last. A grid works too.',
          'Work out each one: x × x,  x × ' + numB(q) + ',  ' + numB(p) + ' × x,  and  ' + numB(p) + ' × ' + numB(q) + '.',
          'You should have ' + terms([[1, 'x²'], [q, 'x'], [p, 'x'], [p * q, '']]) + '. Collect the two x terms: what is ' + num(q) + ' + ' + numB(p) + '?'
        ],
        solution: [
          '(' + first + ')(' + second + ')',
          'First: x × x = x².  Outer: x × ' + numB(q) + ' = ' + poly([[q, 'x']]) + '.  Inner: ' + numB(p) + ' × x = ' + poly([[p, 'x']]) + '.  Last: ' + numB(p) + ' × ' + numB(q) + ' = ' + num(p * q),
          'Collect the x terms: ' + num(q) + ' + ' + numB(p) + ' = ' + num(p + q),
          'Answer: ' + answer
        ],
        answer,
        check: expressionChecker('(x+(' + p + '))*(x+(' + q + '))', {
          form: t => bracketCount(t) ? 'That’s equal, but it still has brackets. Multiply them out and collect like terms.' : null,
          mistakes: [
            { expr: 'x^2+(' + p * q + ')', message: 'You’ve done First and Last, but the Outer and Inner terms (the x terms in the middle) are missing.' },
            { expr: 'x^2+(' + (p + q) + ')x-(' + p * q + ')', message: 'Very close. Check the sign of the last number: ' + numB(p) + ' × ' + numB(q) + '.' }
          ]
        })
      };
    }
  });

  // ----- Factorising -----

  function factorPairs(n) {
    const pairs = [];
    const size = Math.abs(n);
    for (let i = 1; i * i <= size; i++) {
      if (size % i === 0) {
        if (n > 0) pairs.push(i + ' × ' + size / i, num(-i) + ' × ' + numB(-size / i));
        else pairs.push(i + ' × ' + numB(-size / i), num(-i) + ' × ' + size / i);
      }
    }
    return pairs;
  }

  M.register({
    id: 'factorise', name: 'Factorising', strand: 'algebra', year: 'Y8–9', example: '6x + 9',
    learn: {
      title: 'How do I factorise?',
      body: [
        'Factorising is expanding backwards: you put the brackets back in.',
        'For two terms, find the <strong>highest common factor</strong> (HCF), the biggest number that divides into both, and take it outside the bracket. “Fully” factorised means you used the biggest one.',
        'For x² + bx + c, find two numbers that <strong>multiply to c</strong> and <strong>add to b</strong>. They go in the brackets.'
      ],
      eg: '6x + 9 = 3(2x + 3)          (HCF of 6 and 9 is 3)\nx² + 7x + 12 = (x + 3)(x + 4)   (3 × 4 = 12, 3 + 4 = 7)'
    },
    make(level) {
      if (level === 'foundation') {
        let a, b;
        do { a = rand(1, 6); b = randNonZero(-9, 9); } while (gcd(a, b) !== 1);
        const k = rand(2, 9);
        const question = poly([[k * a, 'x'], [k * b, '']]);
        const answer = k + '(' + poly([[a, 'x'], [b, '']]) + ')';
        return {
          prompt: 'Factorise fully  ' + question,
          kind: 'expression',
          hints: [
            'Factorising is expanding backwards. Look for the biggest number that divides into both terms. That’s the highest common factor (HCF).',
            'What is the highest common factor of ' + (k * a) + ' and ' + Math.abs(k * b) + '?',
            'The HCF is ' + k + ', so the answer starts ' + k + '( … ). What do you multiply ' + k + ' by to get ' + poly([[k * a, 'x']]) + '? And to get ' + num(k * b) + '?'
          ],
          solution: [
            question,
            'The HCF of ' + (k * a) + ' and ' + Math.abs(k * b) + ' is ' + k,
            poly([[k * a, 'x']]) + ' ÷ ' + k + ' = ' + poly([[a, 'x']]) + '  and  ' + num(k * b) + ' ÷ ' + k + ' = ' + num(b),
            'Answer: ' + answer + '. Check by expanding: you get back to ' + question
          ],
          answer,
          check: expressionChecker(k * a + 'x+(' + k * b + ')', {
            form: t => {
              if (!bracketCount(t)) return 'That’s the same expression, but factorised means writing it with a bracket, like 3(x + 2).';
              const m = String(t).trim().match(/^([0-9]+)\s*\(/);
              if (m && Number(m[1]) < k) return 'Good start, but it isn’t fully factorised. There’s a bigger number that still goes into both terms in the bracket.';
              if (!m) return 'Write it as a number times a bracket, like ' + k + '( … ).';
              return null;
            }
          })
        };
      }

      const p = randNonZero(-9, 9), q = randNonZero(-9, 9);
      const question = poly([[1, 'x²'], [p + q, 'x'], [p * q, '']]);
      const answer = '(' + xPlus(p) + ')(' + xPlus(q) + ')';
      return {
        prompt: 'Factorise  ' + question,
        kind: 'expression',
        hints: [
          'The answer looks like (x + ?)(x + ?). The two missing numbers multiply to give the number on the end and add to give the number in front of x.',
          'Find two numbers that multiply to ' + num(p * q) + ' and add to ' + num(p + q) + '. Start by listing the factor pairs of ' + num(p * q) + '.',
          'The factor pairs of ' + num(p * q) + ' are: ' + factorPairs(p * q).join(',  ') + '. Which pair adds up to ' + num(p + q) + '?'
        ],
        solution: [
          question,
          'We need two numbers that multiply to ' + num(p * q) + ' and add to ' + num(p + q),
          numB(p) + ' × ' + numB(q) + ' = ' + num(p * q) + '  and  ' + num(p) + ' + ' + numB(q) + ' = ' + num(p + q),
          'Answer: ' + answer
        ],
        answer,
        check: expressionChecker('(x+(' + p + '))*(x+(' + q + '))', {
          form: t => bracketCount(t) >= 2 ? null : 'That’s equal, but factorised means two brackets multiplied together, like (x + 2)(x + 3).',
          mistakes: [
            { expr: '(x-(' + p + '))*(x-(' + q + '))', message: 'Right numbers, wrong signs. Expand your answer to check it: the middle term should be ' + poly([[p + q, 'x']]) + '.' }
          ]
        })
      };
    }
  });

  // ----- Sequences -----

  M.register({
    id: 'sequences', name: 'Sequences', strand: 'algebra', year: 'Y7–8', example: '5, 8, 11, 14, …',
    learn: {
      title: 'How do sequences work?',
      body: [
        'In a <strong>linear</strong> (arithmetic) sequence you add or subtract the same amount each time. That amount is the <strong>common difference</strong>.',
        'The <strong>nth term</strong> is a rule that gives any term. For a linear sequence it looks like dn + c, where d is the common difference.',
        'To find c, compare the sequence with the times table of d. Then check your rule by putting n = 1.'
      ],
      eg: '5, 8, 11, 14, …   difference is 3\n3 times table:  3, 6, 9, 12\nEach term is 2 more, so nth term = 3n + 2\nCheck n = 1: 3 × 1 + 2 = 5 ✓'
    },
    make(level) {
      const d = pick([-4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
      const a = rand(-5, 15);
      const seq = [0, 1, 2, 3].map(i => a + i * d);
      const shown = seq.map(num).join(',  ') + ',  …';
      const c = a - d;
      const rule = poly([[d, 'n'], [c, '']]);

      if (level === 'foundation') {
        const n = rand(6, 12);
        const value = a + (n - 1) * d;
        return {
          prompt: 'Here is a sequence:  ' + shown + '\nWhat is term number ' + n + '?',
          kind: 'number',
          hints: [
            'Find the common difference: what do you add (or subtract) to get from one term to the next?',
            'The difference is ' + num(d) + '. You could keep going from the 4th term, or think: how many steps of ' + num(d) + ' from term 1 to term ' + n + '?',
            'From term 1 to term ' + n + ' is ' + (n - 1) + ' steps. So work out ' + num(a) + ' + ' + (n - 1) + ' × ' + numB(d) + '.'
          ],
          solution: [
            'Common difference = ' + num(d),
            'Term ' + n + ' = first term + ' + (n - 1) + ' steps = ' + num(a) + ' + ' + (n - 1) + ' × ' + numB(d),
            '= ' + num(value)
          ],
          answer: num(value),
          check: numberChecker(value, [
            { value: a + n * d, message: 'One step too many. From term 1 to term ' + n + ' there are ' + (n - 1) + ' steps, not ' + n + '.' }
          ])
        };
      }

      return {
        prompt: 'Find the nth term of the sequence  ' + shown,
        kind: 'expression',
        hints: [
          'Find the common difference first. The nth term will start with that number times n.',
          'The difference is ' + num(d) + ', so the rule starts ' + poly([[d, 'n']]) + '. Write out ' + poly([[d, 'n']]) + ' for n = 1, 2, 3: what do you get, and how far is each from the real sequence?',
          poly([[d, 'n']]) + ' gives ' + [1, 2, 3].map(i => num(d * i)).join(', ') + '. The sequence is ' + seq.slice(0, 3).map(num).join(', ') + '. What do you add to each one?'
        ],
        solution: [
          'Common difference = ' + num(d) + ', so the rule starts ' + poly([[d, 'n']]),
          'When n = 1, ' + poly([[d, 'n']]) + ' = ' + num(d) + ', but the first term is ' + num(a) + '. The difference is ' + num(c),
          'nth term = ' + rule,
          'Check n = 2: ' + num(d) + ' × 2 + ' + numB(c) + ' = ' + num(a + d) + ' ✓'
        ],
        answer: rule,
        check: expressionChecker('(' + d + ')n+(' + c + ')', {
          letters: ['n'],
          mistakes: [
            { expr: '(' + d + ')n+(' + a + ')', message: 'The number in front of n is right. For the other number, put n = 1 into your rule: does it give ' + num(a) + '?' },
            { expr: 'n+(' + d + ')', message: 'The common difference goes in front of n: the rule starts ' + poly([[d, 'n']]) + '.' }
          ]
        })
      };
    }
  });

  // ----- Inequalities -----

  const SHOW = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
  const FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

  M.register({
    id: 'inequalities', name: 'Inequalities', strand: 'algebra', year: 'Y8–9', example: '2x + 1 > 9',
    learn: {
      title: 'How do I solve an inequality?',
      body: [
        '< means less than, > means greater than, ≤ means less than or equal to, ≥ means greater than or equal to.',
        'Solve an inequality just like an equation, doing the same thing to both sides, but keep the inequality sign instead of =.',
        'One important rule: if you <strong>multiply or divide by a negative number</strong>, the sign flips round. (Think: 2 < 3, but −2 > −3.)'
      ],
      eg: '2x + 1 > 9\n2x > 8\nx > 4\n\n−3x ≤ 12\nx ≥ −4   (divided by −3, so the sign flips)'
    },
    make(level) {
      const sym = pick(['<', '>', '<=', '>=']);
      const x = rand(-6, 9);
      if (level === 'foundation') {
        if (Math.random() < 0.5) {
          const a = randNonZero(-9, 9);
          const b = x + a;
          const left = xPlus(a);
          const undo = a > 0 ? 'Subtract ' + a + ' from' : 'Add ' + Math.abs(a) + ' to';
          return {
            prompt: 'Solve  ' + left + ' ' + SHOW[sym] + ' ' + num(b),
            kind: 'inequality',
            hints: [
              'Solve it like an equation, but keep the ' + SHOW[sym] + ' sign where the = would be.',
              'What do you do to both sides to get rid of the ' + (a > 0 ? '+ ' + a : MINUS + ' ' + Math.abs(a)) + '?',
              undo + ' both sides. The answer will look like x ' + SHOW[sym] + ' (a number).'
            ],
            solution: [left + ' ' + SHOW[sym] + ' ' + num(b), undo + ' both sides:  x ' + SHOW[sym] + ' ' + num(x)],
            answer: 'x ' + SHOW[sym] + ' ' + num(x),
            check: inequalityChecker(sym, x)
          };
        }
        const a = rand(2, 9);
        return {
          prompt: 'Solve  ' + a + 'x ' + SHOW[sym] + ' ' + num(a * x),
          kind: 'inequality',
          hints: [
            'Solve it like an equation, but keep the ' + SHOW[sym] + ' sign where the = would be.',
            'x is multiplied by ' + a + '. What do you do to both sides to undo that?',
            'Divide both sides by ' + a + '. ' + num(a * x) + ' ÷ ' + a + ' = ?'
          ],
          solution: [a + 'x ' + SHOW[sym] + ' ' + num(a * x), 'Divide both sides by ' + a + ':  x ' + SHOW[sym] + ' ' + num(x)],
          answer: 'x ' + SHOW[sym] + ' ' + num(x),
          check: inequalityChecker(sym, x)
        };
      }

      const a = pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]);
      const b = randNonZero(-10, 10);
      const c = a * x + b;
      const final = a < 0 ? FLIP[sym] : sym;
      const left = poly([[a, 'x'], [b, '']]);
      const undoB = b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + Math.abs(b) + ' to';
      return {
        prompt: 'Solve  ' + left + ' ' + SHOW[sym] + ' ' + num(c),
        kind: 'inequality',
        hints: [
          'Solve it like an equation in two steps, keeping the inequality sign. Watch out for the number in front of x.',
          'First get rid of the ' + (b > 0 ? '+ ' + b : MINUS + ' ' + Math.abs(b)) + '. Then divide by ' + num(a) + '.' + (a < 0 ? ' What happens to the sign when you divide by a negative number?' : ''),
          undoB + ' both sides: ' + poly([[a, 'x']]) + ' ' + SHOW[sym] + ' ' + num(c - b) + '. Now divide both sides by ' + num(a) + (a < 0 ? ', and remember to flip the sign.' : '.')
        ],
        solution: [
          left + ' ' + SHOW[sym] + ' ' + num(c),
          undoB + ' both sides:  ' + poly([[a, 'x']]) + ' ' + SHOW[sym] + ' ' + num(c - b),
          'Divide both sides by ' + num(a) + (a < 0 ? ' (negative, so the sign flips)' : '') + ':  x ' + SHOW[final] + ' ' + num(x)
        ],
        answer: 'x ' + SHOW[final] + ' ' + num(x),
        check: inequalityChecker(final, x)
      };
    }
  });

  // ----- Index laws -----

  // Powers of x displayed nicely: xp(1) gives "x", xp(5) gives "x⁵"
  function xp(n, coef) {
    const c = coef === undefined || coef === 1 ? '' : String(coef);
    if (n === 0) return coef === undefined ? '1' : String(coef);
    return c + 'x' + (n === 1 ? '' : sup(n));
  }

  const singlePower = t => (String(t).match(/x/gi) || []).length > 1 || /[*×/÷(]/.test(t)
    ? 'That’s equal, but write it as a single power of x, like x^5.' : null;

  M.register({
    id: 'indices', name: 'Index laws', strand: 'algebra', year: 'Y8–9', example: 'x³ × x⁴',
    learn: {
      title: 'What are the index laws?',
      body: [
        'The small number is the <strong>index</strong> (or power). x³ means x × x × x.',
        '<strong>Multiplying:</strong> add the powers. x³ × x⁴ = x⁷, because that’s 3 x’s times 4 x’s.',
        '<strong>Dividing:</strong> subtract the powers. x⁹ ÷ x⁴ = x⁵.',
        '<strong>Power of a power:</strong> multiply the powers. (x²)³ = x⁶. And anything to the power 0 is 1.'
      ],
      eg: 'x³ × x⁴ = x⁷\nx⁹ ÷ x⁴ = x⁵\n(x²)³ = x⁶\n3x² × 4x⁵ = 12x⁷'
    },
    make(level) {
      const a = rand(2, 9), b = rand(2, 7);
      if (level === 'foundation') {
        if (Math.random() < 0.5) {
          return {
            prompt: 'Simplify  ' + xp(a) + ' × ' + xp(b),
            kind: 'expression',
            hints: [
              'Think about what the powers mean: ' + xp(a) + ' is ' + a + ' x’s multiplied together.',
              'Altogether, how many x’s are being multiplied? When you multiply powers of the same letter, what do you do to the powers?',
              'Multiplying means you add the powers: ' + a + ' + ' + b + ' = ?'
            ],
            solution: [xp(a) + ' × ' + xp(b), 'Add the powers: ' + a + ' + ' + b + ' = ' + (a + b), 'Answer: ' + xp(a + b)],
            answer: xp(a + b),
            check: expressionChecker('x^' + (a + b), {
              form: singlePower,
              mistakes: [{ expr: 'x^' + a * b, message: 'When you multiply, add the powers. Multiplying the powers is for a power of a power, like (x²)³.' }]
            })
          };
        }
        const big = a + b;
        return {
          prompt: 'Simplify  ' + xp(big) + ' ÷ ' + xp(b),
          kind: 'expression',
          hints: [
            'Write it as a fraction: ' + big + ' x’s on top and ' + b + ' x’s on the bottom. Some of them cancel.',
            'When you divide powers of the same letter, what do you do to the powers?',
            'Dividing means you subtract the powers: ' + big + ' ' + MINUS + ' ' + b + ' = ?'
          ],
          solution: [xp(big) + ' ÷ ' + xp(b), 'Subtract the powers: ' + big + ' ' + MINUS + ' ' + b + ' = ' + a, 'Answer: ' + xp(a)],
          answer: xp(a),
          check: expressionChecker('x^' + a, { form: singlePower })
        };
      }

      if (Math.random() < 0.5) {
        const p = rand(2, 5), q = rand(2, 4);
        return {
          prompt: 'Simplify  (' + xp(p) + ')' + sup(q),
          kind: 'expression',
          hints: [
            'The bracket means ' + xp(p) + ' is multiplied by itself ' + q + ' times.',
            'Write it out: ' + Array(q).fill(xp(p)).join(' × ') + '. How many x’s is that altogether?',
            'For a power of a power you multiply the powers: ' + p + ' × ' + q + ' = ?'
          ],
          solution: ['(' + xp(p) + ')' + sup(q) + ' = ' + Array(q).fill(xp(p)).join(' × '), 'Multiply the powers: ' + p + ' × ' + q + ' = ' + p * q, 'Answer: ' + xp(p * q)],
          answer: xp(p * q),
          check: expressionChecker('x^' + p * q, {
            form: singlePower,
            mistakes: [{ expr: 'x^' + (p + q), message: 'For a power of a power, multiply the powers (don’t add them).' }]
          })
        };
      }
      const m = rand(2, 7), n = rand(2, 6);
      return {
        prompt: 'Simplify  ' + xp(a, m) + ' × ' + xp(b, n),
        kind: 'expression',
        hints: [
          'Deal with the numbers and the powers of x separately.',
          'Multiply the numbers: ' + m + ' × ' + n + '. For the x’s, what do you do to the powers when you multiply?',
          m + ' × ' + n + ' = ' + m * n + '. Now add the powers: ' + a + ' + ' + b + '.'
        ],
        solution: [xp(a, m) + ' × ' + xp(b, n), 'Numbers: ' + m + ' × ' + n + ' = ' + m * n + '.  Powers: ' + a + ' + ' + b + ' = ' + (a + b), 'Answer: ' + xp(a + b, m * n)],
        answer: xp(a + b, m * n),
        check: expressionChecker(m * n + 'x^' + (a + b), {
          form: t => (String(t).match(/x/gi) || []).length > 1 || /[*×/÷(]/.test(t) ? 'That’s equal, but simplify it to a single term, like 12x^7.' : null,
          mistakes: [
            { expr: (m + n) + 'x^' + (a + b), message: 'The power is right. The numbers in front get multiplied, not added.' },
            { expr: m * n + 'x^' + a * b, message: 'The number is right. For the powers, multiplying means you add them.' }
          ]
        })
      };
    }
  });

  // ----- Rearranging formulae -----

  M.register({
    id: 'rearrange', name: 'Rearranging formulae', strand: 'algebra', year: 'Y9', example: 'y = 3x + 2',
    learn: {
      title: 'How do I change the subject of a formula?',
      body: [
        'The <strong>subject</strong> is the letter on its own, e.g. y is the subject of y = 3x + 2.',
        'To make x the subject, use inverse operations just like solving an equation, but you’re moving letters as well as numbers.',
        'Undo things in reverse order. Use brackets when a whole side gets divided: x = (y − 2) ÷ 3, written (y − 2)/3.'
      ],
      eg: 'Make x the subject of y = 3x + 2\ny − 2 = 3x\nx = (y − 2)/3'
    },
    make(level) {
      const a = rand(2, 9), b = randNonZero(-9, 9);
      const bAbs = Math.abs(b);
      if (level === 'foundation') {
        const formula = 'y = ' + poly([[a, 'x'], [b, '']]);
        const yMinusB = 'y ' + (b > 0 ? MINUS + ' ' + b : '+ ' + bAbs);
        const answer = 'x = (' + yMinusB + ')/' + a;
        return {
          prompt: 'Make x the subject of  ' + formula,
          kind: 'expression',
          hints: [
            'You want x on its own, like solving an equation. To build y, x was multiplied by ' + a + ' then ' + (b > 0 ? b + ' was added' : bAbs + ' was taken away') + '. Undo those in reverse order.',
            'What do you do to both sides to get rid of the ' + (b > 0 ? '+ ' + b : MINUS + ' ' + bAbs) + '?',
            (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + bAbs + ' to') + ' both sides: ' + yMinusB + ' = ' + a + 'x. Now divide both sides by ' + a + ' (use a bracket so the whole side gets divided).'
          ],
          solution: [formula, (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + bAbs + ' to') + ' both sides:  ' + yMinusB + ' = ' + a + 'x', 'Divide both sides by ' + a + ':  ' + answer],
          answer,
          check: expressionChecker('(y-(' + b + '))/' + a, {
            letters: ['y'],
            mistakes: [
              { expr: '(y+(' + b + '))/' + a, message: 'Check the first step. To undo ' + (b > 0 ? '+ ' + b + ' you subtract ' + b : MINUS + ' ' + bAbs + ' you add ' + bAbs) + '.' },
              { expr: 'y/' + a + '-(' + b + ')', message: 'Close! But the whole of ' + yMinusB + ' has to be divided by ' + a + '. Use a bracket: (' + yMinusB + ')/' + a + '.' }
            ]
          })
        };
      }

      if (Math.random() < 0.5) {
        // y = a(x + b)  →  x = y/a − b
        const formula = 'y = ' + a + '(' + xPlus(b) + ')';
        const answer = 'x = y/' + a + ' ' + (b > 0 ? MINUS + ' ' + b : '+ ' + bAbs);
        return {
          prompt: 'Make x the subject of  ' + formula,
          kind: 'expression',
          hints: [
            'The last thing done to x was multiplying the whole bracket by ' + a + '. Undo that first.',
            'Divide both sides by ' + a + '. What do you get?',
            'y/' + a + ' = ' + xPlus(b) + '. What do you do to both sides to leave x on its own?'
          ],
          solution: [formula, 'Divide both sides by ' + a + ':  y/' + a + ' = ' + xPlus(b), (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + bAbs + ' to') + ' both sides:  ' + answer],
          answer,
          check: expressionChecker('y/' + a + '-(' + b + ')', {
            letters: ['y'],
            mistakes: [{ expr: '(y-(' + b + '))/' + a, message: 'Undo in reverse order: the × ' + a + ' was done last, so undo it first. Then deal with the ' + num(b) + '.' }]
          })
        };
      }
      // y = (x + b)/a  →  x = ay − b
      const formula = 'y = (' + xPlus(b) + ')/' + a;
      const answer = 'x = ' + poly([[a, 'y'], [-b, '']]);
      return {
        prompt: 'Make x the subject of  ' + formula,
        kind: 'expression',
        hints: [
          'The last thing done was dividing by ' + a + '. What undoes dividing?',
          'Multiply both sides by ' + a + '. What do you get?',
          poly([[a, 'y']]) + ' = ' + xPlus(b) + '. What do you do to both sides to leave x on its own?'
        ],
        solution: [formula, 'Multiply both sides by ' + a + ':  ' + poly([[a, 'y']]) + ' = ' + xPlus(b), (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + bAbs + ' to') + ' both sides:  ' + answer],
        answer,
        check: expressionChecker(a + 'y-(' + b + ')', {
          letters: ['y'],
          mistakes: [{ expr: a + 'y+(' + b + ')', message: 'Check the sign. To undo ' + (b > 0 ? '+ ' + b + ' you subtract it' : MINUS + ' ' + bAbs + ' you add it') + '.' }]
        })
      };
    }
  });

  // ----- Straight-line graphs -----

  M.register({
    id: 'graphs', name: 'Straight-line graphs', strand: 'algebra', year: 'Y8–9', example: 'y = 2x + 1',
    learn: {
      title: 'What do y = mx + c and gradient mean?',
      body: [
        'Every straight line can be written as <strong>y = mx + c</strong>.',
        '<strong>m is the gradient</strong>: how steep the line is. It’s how much y goes up when x goes up by 1. A negative gradient slopes downwards.',
        '<strong>c is the y-intercept</strong>: where the line crosses the y-axis (when x = 0).',
        'Gradient between two points = change in y ÷ change in x ("rise over run").'
      ],
      eg: 'y = 2x + 1  has gradient 2 and crosses the y-axis at 1\n\nPoints (1, 3) and (4, 9):\ngradient = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = 2'
    },
    make(level) {
      if (level === 'foundation') {
        const m = randNonZero(-6, 8), c = randNonZero(-9, 9);
        const line = 'y = ' + poly([[m, 'x'], [c, '']]);
        const type = pick(['gradient', 'intercept', 'value']);
        if (type === 'gradient') {
          return {
            prompt: 'What is the gradient of the line  ' + line + '?',
            kind: 'number',
            hints: [
              'Straight lines can be written y = mx + c. Which letter is the gradient?',
              'Match your line to y = mx + c. What number is in the place of m (in front of x)?',
              'm is the number multiplying x. Include its sign.'
            ],
            solution: ['Compare ' + line + ' with y = mx + c', 'm = ' + num(m), 'The gradient is ' + num(m)],
            answer: num(m),
            check: numberChecker(m, [{ value: c, message: 'That’s c, the y-intercept. The gradient is m, the number in front of x.' }])
          };
        }
        if (type === 'intercept') {
          return {
            prompt: 'Where does the line  ' + line + '  cross the y-axis? Give the y value.',
            kind: 'number',
            hints: [
              'Straight lines can be written y = mx + c. Which letter tells you where the line crosses the y-axis?',
              'On the y-axis, x = 0. What is y when x = 0?',
              'Put x = 0 into the equation: y = ' + m + ' × 0 + ' + numB(c) + '.'
            ],
            solution: ['On the y-axis, x = 0', 'y = ' + m + ' × 0 + ' + numB(c) + ' = ' + num(c), 'It crosses at y = ' + num(c)],
            answer: num(c),
            check: numberChecker(c, [{ value: m, message: 'That’s the gradient. The line crosses the y-axis where x = 0.' }])
          };
        }
        const x = rand(-4, 6);
        return {
          prompt: 'The line  ' + line + '  passes through the point (' + num(x) + ', ?). What is the missing y value?',
          kind: 'number',
          hints: [
            'A point is written (x, y). You know x, so substitute it into the equation.',
            'Put x = ' + num(x) + ' into ' + line + '.',
            'y = ' + m + ' × ' + numB(x) + ' + ' + numB(c) + '. Multiply first.'
          ],
          solution: ['y = ' + m + ' × ' + numB(x) + ' + ' + numB(c), '= ' + num(m * x) + ' + ' + numB(c), '= ' + num(m * x + c)],
          answer: num(m * x + c),
          check: numberChecker(m * x + c)
        };
      }

      if (Math.random() < 0.5) {
        // Gradient between two points (can be a fraction)
        const x1 = rand(-5, 4), dx = rand(1, 6), y1 = rand(-6, 6), dy = randNonZero(-9, 9);
        const x2 = x1 + dx, y2 = y1 + dy;
        const g = frac(dy, dx);
        return {
          prompt: 'Find the gradient of the line through (' + num(x1) + ', ' + num(y1) + ') and (' + num(x2) + ', ' + num(y2) + ').',
          kind: 'fraction',
          hints: [
            'Gradient = change in y ÷ change in x (rise over run).',
            'Work out the change in y: ' + num(y2) + ' ' + MINUS + ' ' + numB(y1) + '. And the change in x: ' + num(x2) + ' ' + MINUS + ' ' + numB(x1) + '.',
            'Change in y = ' + num(dy) + ' and change in x = ' + dx + '. Divide, and simplify if you can.'
          ],
          solution: ['Change in y = ' + num(y2) + ' ' + MINUS + ' ' + numB(y1) + ' = ' + num(dy), 'Change in x = ' + num(x2) + ' ' + MINUS + ' ' + numB(x1) + ' = ' + dx, 'Gradient = ' + num(dy) + ' ÷ ' + dx + ' = ' + g],
          answer: g,
          check: fractionChecker(dy, dx, [{ n: dx, d: dy, message: 'Upside down! Gradient is change in y divided by change in x.' }], { allowDecimal: true })
        };
      }
      // Equation of a line through two points with a whole-number gradient
      const m = randNonZero(-5, 5), c = randNonZero(-8, 8), x1 = rand(-3, 2), x2 = x1 + rand(1, 4);
      const y1 = m * x1 + c, y2 = m * x2 + c;
      return {
        prompt: 'Find the equation of the straight line through (' + num(x1) + ', ' + num(y1) + ') and (' + num(x2) + ', ' + num(y2) + '). Write it as y = mx + c.',
        kind: 'expression',
        hints: [
          'You need two things: the gradient m and the y-intercept c.',
          'Gradient = change in y ÷ change in x. Then put one of the points into y = mx + c to find c.',
          'The gradient is ' + num(m) + '. Using (' + num(x1) + ', ' + num(y1) + '): ' + num(y1) + ' = ' + m + ' × ' + numB(x1) + ' + c. Solve for c.'
        ],
        solution: [
          'Gradient = (' + num(y2) + ' ' + MINUS + ' ' + numB(y1) + ') ÷ (' + num(x2) + ' ' + MINUS + ' ' + numB(x1) + ') = ' + num(m * (x2 - x1)) + ' ÷ ' + (x2 - x1) + ' = ' + num(m),
          num(y1) + ' = ' + m + ' × ' + numB(x1) + ' + c, so c = ' + num(c),
          'y = ' + poly([[m, 'x'], [c, '']])
        ],
        answer: 'y = ' + poly([[m, 'x'], [c, '']]),
        check: expressionChecker('(' + m + ')x+(' + c + ')', {
          mistakes: [{ expr: '(' + m + ')x', message: 'The gradient is right. Now find c by putting one of the points into y = ' + poly([[m, 'x']]) + ' + c.' }]
        })
      };
    }
  });

  // ----- Simultaneous equations -----

  M.register({
    id: 'simultaneous', name: 'Simultaneous equations', strand: 'algebra', year: 'Y9', example: 'x + y = 10, x − y = 4',
    learn: {
      title: 'How do I solve simultaneous equations?',
      body: [
        'Two equations, two unknowns. You need values of x and y that make <strong>both</strong> equations true.',
        '<strong>Elimination:</strong> add or subtract the equations so one letter disappears. If the numbers in front don’t match, multiply one equation first.',
        'Once you know one letter, substitute it back into either equation to find the other. Check your answer in both equations.'
      ],
      eg: 'x + y = 10\nx − y = 4\nAdd them:  2x = 14, so x = 7\nThen 7 + y = 10, so y = 3'
    },
    make(level) {
      const x = rand(-4, 9), y = rand(-4, 9);
      if (level === 'foundation') {
        const s = x + y, d = x - y;
        const e1 = 'x + y = ' + num(s), e2 = 'x ' + MINUS + ' y = ' + num(d);
        return {
          prompt: 'Solve the simultaneous equations\n' + e1 + '\n' + e2,
          kind: 'pair',
          hints: [
            'Look at the y terms: one is +y and one is ' + MINUS + 'y. What happens to them if you add the two equations together?',
            'Add the equations: (x + y) + (x ' + MINUS + ' y) = ' + num(s) + ' + ' + numB(d) + '. The y’s cancel. What is 2x?',
            '2x = ' + num(s + d) + ', so x = ' + num(x) + '. Now put that into x + y = ' + num(s) + ' to find y.'
          ],
          solution: ['Add the equations:  2x = ' + num(s + d), 'x = ' + num(x), 'Substitute:  ' + num(x) + ' + y = ' + num(s) + ', so y = ' + num(y), 'Check: ' + num(x) + ' ' + MINUS + ' ' + numB(y) + ' = ' + num(d) + ' ✓'],
          answer: 'x = ' + num(x) + ', y = ' + num(y),
          check: pairChecker(x, y)
        };
      }
      let a, b, d;
      do { a = rand(2, 5); b = rand(2, 5); d = rand(1, 4); } while (a === b * d);
      const c = a * x + b * y, f = d * x + y;
      const e1 = poly([[a, 'x'], [b, 'y']]) + ' = ' + num(c);
      const e2 = poly([[d, 'x'], [1, 'y']]) + ' = ' + num(f);
      const k = a - b * d;
      return {
        prompt: 'Solve the simultaneous equations\n' + e1 + '\n' + e2,
        kind: 'pair',
        hints: [
          'Make the y terms match so you can eliminate y. The first equation has ' + b + 'y and the second has y.',
          'Multiply every term of the second equation by ' + b + '. Then subtract it from the first equation.',
          b + ' × (second equation) gives ' + poly([[b * d, 'x'], [b, 'y']]) + ' = ' + num(b * f) + '. Subtracting: ' + poly([[k, 'x']]) + ' = ' + num(c - b * f) + '.'
        ],
        solution: [
          'Multiply the second equation by ' + b + ':  ' + poly([[b * d, 'x'], [b, 'y']]) + ' = ' + num(b * f),
          'Subtract from the first:  ' + poly([[k, 'x']]) + ' = ' + num(c - b * f) + ', so x = ' + num(x),
          'Substitute into ' + e2 + ':  ' + d + ' × ' + numB(x) + ' + y = ' + num(f) + ', so y = ' + num(y),
          'Answer: x = ' + num(x) + ', y = ' + num(y)
        ],
        answer: 'x = ' + num(x) + ', y = ' + num(y),
        check: pairChecker(x, y)
      };
    }
  });
})(this);
