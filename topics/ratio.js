// Ratio, proportion and rates of change topics, Years 7 to 9.

(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('../maths.js') : root.MathsEngine;
  const { rand, pick, gcd, roundDp, money, numberChecker, ratioChecker } = M;

  const NAMES = ['Amir', 'Bea', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Hassan', 'Isla', 'Jay', 'Kai', 'Lena'];

  function twoNames() {
    const a = pick(NAMES);
    let b = pick(NAMES);
    while (b === a) b = pick(NAMES);
    return [a, b];
  }

  // ----- Simplifying ratios -----

  M.register({
    id: 'ratio-simplify', name: 'Simplifying ratios', strand: 'ratio', year: 'Y7', example: '12 : 18 = 2 : 3',
    learn: {
      title: 'How do I simplify a ratio?',
      body: [
        'A <strong>ratio</strong> compares amounts. 2 : 3 means "for every 2 of the first, there are 3 of the second".',
        'Simplify a ratio like a fraction: divide every part by the same number. It’s fully simplified when the only number that divides into every part is 1.',
        'If the parts have different units, change them to the same unit first.'
      ],
      eg: '12 : 18  (÷ 6)  = 2 : 3\n50 cm : 2 m = 50 cm : 200 cm = 1 : 4'
    },
    make(level) {
      const k = rand(2, 12);
      if (level === 'foundation') {
        let a, b;
        do { a = rand(1, 9); b = rand(1, 9); } while (gcd(a, b) !== 1 || a === b);
        const shown = a * k + ' : ' + b * k;
        return {
          prompt: 'Write ' + shown + ' in its simplest form.',
          kind: 'ratio',
          hints: [
            'Divide both parts of the ratio by the same number, just like simplifying a fraction.',
            'What is the highest common factor of ' + a * k + ' and ' + b * k + '?',
            'The HCF is ' + k + '. Divide both parts by ' + k + '.'
          ],
          solution: ['HCF of ' + a * k + ' and ' + b * k + ' is ' + k, a * k + ' ÷ ' + k + ' = ' + a + '  and  ' + b * k + ' ÷ ' + k + ' = ' + b, 'Answer: ' + a + ' : ' + b],
          answer: a + ' : ' + b,
          check: ratioChecker([a, b])
        };
      }
      if (Math.random() < 0.5) {
        let a, b, c;
        do { a = rand(1, 7); b = rand(1, 7); c = rand(1, 7); } while (gcd(gcd(a, b), c) !== 1);
        const shown = [a, b, c].map(x => x * k).join(' : ');
        return {
          prompt: 'Write ' + shown + ' in its simplest form.',
          kind: 'ratio',
          hints: [
            'A three-part ratio works the same way: divide every part by the same number.',
            'Find the biggest number that divides into all three: ' + shown.replace(/ : /g, ', ') + '.',
            'They all divide by ' + k + '.'
          ],
          solution: ['HCF of ' + shown.replace(/ : /g, ', ') + ' is ' + k, 'Divide every part by ' + k + ':  ' + a + ' : ' + b + ' : ' + c],
          answer: a + ' : ' + b + ' : ' + c,
          check: ratioChecker([a, b, c])
        };
      }
      const units = pick([['cm', 'm', 100], ['g', 'kg', 1000], ['minutes', 'hours', 60], ['p', '£', 100]]);
      const big = rand(1, 5);
      let small;
      do { small = rand(1, 19) * (units[2] / (units[2] === 60 ? 4 : 20)); } while (small >= units[2] * big || small % 1);
      const g = gcd(small, big * units[2]);
      const a = small / g, b = big * units[2] / g;
      const bigShown = units[1] === '£' ? '£' + big : big + ' ' + units[1];
      const smallShown = units[0] === 'p' ? small + 'p' : small + ' ' + units[0];
      return {
        prompt: 'Write ' + smallShown + ' : ' + bigShown + ' in its simplest form.',
        kind: 'ratio',
        hints: [
          'The units are different. Change them to the same unit first, then simplify.',
          'There are ' + units[2] + ' ' + units[0] + ' in 1 ' + units[1] + '. How many ' + units[0] + ' are in ' + bigShown + '?',
          'The ratio is ' + small + ' : ' + big * units[2] + '. Now divide both parts by their highest common factor.'
        ],
        solution: [bigShown + ' = ' + big * units[2] + ' ' + units[0], small + ' : ' + big * units[2], 'Divide both by ' + g + ':  ' + a + ' : ' + b],
        answer: a + ' : ' + b,
        check: ratioChecker([a, b])
      };
    }
  });

  // ----- Sharing in a ratio -----

  M.register({
    id: 'ratio-share', name: 'Sharing in a ratio', strand: 'ratio', year: 'Y7–8', example: 'Share £30 in 2 : 3',
    learn: {
      title: 'How do I share an amount in a ratio?',
      body: [
        'Add the parts of the ratio to find the <strong>total number of parts</strong>.',
        'Divide the amount by the total parts to find what <strong>one part</strong> is worth.',
        'Multiply to find each share. Check the shares add up to the total.'
      ],
      eg: 'Share £30 in the ratio 2 : 3\nTotal parts = 2 + 3 = 5\nOne part = £30 ÷ 5 = £6\nShares: 2 × £6 = £12 and 3 × £6 = £18'
    },
    make(level) {
      const [p, q] = twoNames();
      let a, b;
      do { a = rand(1, 7); b = rand(1, 7); } while (a === b || gcd(a, b) !== 1);
      const part = rand(2, 15) * (level === 'foundation' ? 1 : pick([1, 5]));
      if (level === 'foundation' || Math.random() < 0.5) {
        const total = (a + b) * part;
        const askFirst = Math.random() < 0.5;
        const value = (askFirst ? a : b) * part;
        return {
          prompt: p + ' and ' + q + ' share £' + total + ' in the ratio ' + a + ' : ' + b + '. How much does ' + (askFirst ? p : q) + ' get?',
          kind: 'number',
          hints: [
            'First find how many parts there are altogether.',
            'There are ' + a + ' + ' + b + ' = ' + (a + b) + ' parts. How much is one part worth?',
            'One part is £' + total + ' ÷ ' + (a + b) + ' = £' + part + '. ' + (askFirst ? p : q) + ' gets ' + (askFirst ? a : b) + ((askFirst ? a : b) === 1 ? ' part.' : ' parts.')
          ],
          solution: ['Total parts = ' + a + ' + ' + b + ' = ' + (a + b), 'One part = £' + total + ' ÷ ' + (a + b) + ' = £' + part, (askFirst ? p : q) + ' gets ' + (askFirst ? a : b) + ' × £' + part + ' = £' + value],
          answer: '£' + value,
          check: numberChecker(value, [
            { value: total / (askFirst ? a : b), message: 'Don’t divide by ' + (askFirst ? a : b) + '. Divide by the total number of parts (' + (a + b) + ') to find one part.' },
            { value: (askFirst ? b : a) * part, message: 'That’s the other person’s share. Check which number in the ratio belongs to ' + (askFirst ? p : q) + '.' }
          ])
        };
      }
      // Difference problems
      const big = Math.max(a, b), small = Math.min(a, b);
      const diff = (big - small) * part;
      const value = small * part;
      const bigName = a > b ? p : q, smallName = a > b ? q : p;
      return {
        prompt: 'Sweets are shared between ' + p + ' and ' + q + ' in the ratio ' + a + ' : ' + b + '. ' + bigName + ' gets ' + diff + ' more sweets than ' + smallName + '. How many sweets does ' + smallName + ' get?',
        kind: 'number',
        hints: [
          'The difference in the ratio is ' + big + ' ' + '− ' + small + ' = ' + (big - small) + ' parts. That matches the difference in sweets.',
          (big - small) + ' parts = ' + diff + ' sweets. How many sweets is one part?',
          'One part is ' + diff + ' ÷ ' + (big - small) + ' = ' + part + '. ' + smallName + ' has ' + small + (small === 1 ? ' part.' : ' parts.')
        ],
        solution: ['Difference = ' + big + ' − ' + small + ' = ' + (big - small) + ' parts = ' + diff + ' sweets', 'One part = ' + diff + ' ÷ ' + (big - small) + ' = ' + part, smallName + ' gets ' + small + ' × ' + part + ' = ' + value],
        answer: String(value),
        check: numberChecker(value, [{ value: big * part, message: 'That’s ' + bigName + '’s share. The question asks about ' + smallName + '.' }])
      };
    }
  });

  // ----- Direct and inverse proportion -----

  const ITEMS = [['pens', 'a pen'], ['notebooks', 'a notebook'], ['apples', 'an apple'], ['cinema tickets', 'a ticket'], ['bus fares', 'a fare']];

  M.register({
    id: 'proportion', name: 'Proportion', strand: 'ratio', year: 'Y8–9', example: '4 pens cost £2.40',
    learn: {
      title: 'How do I solve proportion problems?',
      body: [
        '<strong>Direct proportion:</strong> when one thing doubles, so does the other. Use the <strong>unitary method</strong>: find the value of ONE, then multiply.',
        '<strong>Inverse proportion:</strong> when one thing doubles, the other halves. More workers means less time. Find the total amount of work first (workers × days), then divide.',
        '<strong>Best buy:</strong> compare the price of one item (or one gram) in each deal.'
      ],
      eg: '4 pens cost £2.40. Find the cost of 7 pens.\n1 pen = £2.40 ÷ 4 = £0.60\n7 pens = 7 × £0.60 = £4.20\n\n6 workers take 10 days. 4 workers take?\n6 × 10 = 60 worker-days, 60 ÷ 4 = 15 days'
    },
    make(level) {
      if (level === 'foundation' || Math.random() < 0.5) {
        const [plural] = pick(ITEMS);
        const unitPence = rand(15, 120) * (level === 'foundation' ? 5 : 1);
        const n = rand(2, 8);
        let m = rand(2, 12);
        while (m === n) m = rand(2, 12);
        const cost = n * unitPence / 100, value = roundDp(m * unitPence / 100, 2);
        return {
          prompt: n + ' ' + plural + ' cost ' + money(cost) + '. How much do ' + m + ' ' + plural + ' cost?',
          kind: 'number',
          hints: [
            'Use the unitary method: find the cost of ONE first.',
            'What is ' + money(cost) + ' ÷ ' + n + '?',
            'One costs ' + money(unitPence / 100) + '. Now multiply by ' + m + '.'
          ],
          solution: ['1 costs ' + money(cost) + ' ÷ ' + n + ' = ' + money(unitPence / 100), m + ' cost ' + m + ' × ' + money(unitPence / 100) + ' = ' + money(value)],
          answer: money(value),
          check: numberChecker(value)
        };
      }
      // Pick numbers where another whole number of builders takes a whole number of days
      let workers, days, total, options;
      do {
        workers = pick([2, 3, 4, 5, 6, 8, 10, 12]);
        days = pick([3, 4, 5, 6, 8, 10, 12, 15]);
        total = workers * days;
        options = [];
        for (let w = 2; w <= total / 2; w++) if (total % w === 0 && w !== workers) options.push(w);
      } while (!options.length);
      const w2 = pick(options);
      const value = total / w2;
      return {
        prompt: workers + ' builders take ' + days + ' days to build a wall. How many days would ' + w2 + ' builders take, working at the same rate?',
        kind: 'number',
        hints: [
          'Is this direct or inverse proportion? Would more builders take more time or less time?',
          'It’s inverse proportion. Find the total amount of work: how many "builder-days" is ' + workers + ' builders for ' + days + ' days?',
          'The wall takes ' + workers + ' × ' + days + ' = ' + total + ' builder-days. Share that between ' + w2 + ' builders.'
        ],
        solution: ['Total work = ' + workers + ' × ' + days + ' = ' + total + ' builder-days', total + ' ÷ ' + w2 + ' = ' + value + ' days'],
        answer: value + ' days',
        check: numberChecker(value, [{ value: roundDp(days * w2 / workers, 6), message: 'That would be true if more builders took longer! This is inverse proportion: more builders means fewer days.' }])
      };
    }
  });

  // ----- Speed, distance and time -----

  M.register({
    id: 'speed', name: 'Speed, distance, time', strand: 'ratio', year: 'Y8–9', example: '120 km in 2 hours',
    learn: {
      title: 'How do speed, distance and time connect?',
      body: [
        '<strong>Speed = distance ÷ time.</strong> So distance = speed × time, and time = distance ÷ speed.',
        'The formula triangle helps: D on top, S and T underneath. Cover the one you want.',
        'Watch the units. If the speed is in km/h, the time must be in hours: 30 minutes = 0.5 hours, 15 minutes = 0.25 hours.'
      ],
      eg: '120 km in 2 hours: speed = 120 ÷ 2 = 60 km/h\n50 km/h for 3 hours: distance = 50 × 3 = 150 km\n20 km at 40 km/h: time = 20 ÷ 40 = 0.5 hours = 30 minutes'
    },
    make(level) {
      const speed = rand(2, 14) * 5;
      if (level === 'foundation') {
        const t = rand(2, 6);
        const d = speed * t;
        const type = pick(['speed', 'distance', 'time']);
        if (type === 'speed') {
          return {
            prompt: 'A car travels ' + d + ' km in ' + t + ' hours. What is its average speed in km/h?',
            kind: 'number',
            hints: ['Speed = distance ÷ time.', 'Which number is the distance and which is the time?', 'Work out ' + d + ' ÷ ' + t + '.'],
            solution: ['Speed = distance ÷ time', '= ' + d + ' ÷ ' + t + ' = ' + speed + ' km/h'],
            answer: speed + ' km/h',
            check: numberChecker(speed, [{ value: d * t, message: 'You multiplied. Speed is distance divided by time.' }])
          };
        }
        if (type === 'distance') {
          return {
            prompt: 'A cyclist rides at ' + speed + ' km/h for ' + t + ' hours. How far do they go, in km?',
            kind: 'number',
            hints: ['Distance = speed × time.', 'In each hour they ride ' + speed + ' km. How many hours are there?', 'Work out ' + speed + ' × ' + t + '.'],
            solution: ['Distance = speed × time', '= ' + speed + ' × ' + t + ' = ' + d + ' km'],
            answer: d + ' km',
            check: numberChecker(d)
          };
        }
        return {
          prompt: 'A train travels ' + d + ' km at ' + speed + ' km/h. How many hours does the journey take?',
          kind: 'number',
          hints: ['Time = distance ÷ speed.', 'The train covers ' + speed + ' km every hour. How many lots of ' + speed + ' km fit into ' + d + ' km?', 'Work out ' + d + ' ÷ ' + speed + '.'],
          solution: ['Time = distance ÷ speed', '= ' + d + ' ÷ ' + speed + ' = ' + t + ' hours'],
          answer: t + ' hours',
          check: numberChecker(t)
        };
      }
      const minutes = pick([15, 30, 45, 90]);
      const hours = minutes / 60;
      const d = roundDp(speed * hours, 4);
      if (!Number.isInteger(d) || Math.random() < 0.5) {
        const s2 = pick([8, 12, 16, 20, 24, 40, 48, 60]);
        const d2 = roundDp(s2 * hours, 4);
        return {
          prompt: 'A runner covers ' + d2 + ' km in ' + minutes + ' minutes. What is their average speed in km/h?',
          kind: 'number',
          hints: [
            'Speed = distance ÷ time. But the answer is in km per HOUR, so the time needs to be in hours.',
            'What fraction of an hour is ' + minutes + ' minutes? Write it as a decimal.',
            minutes + ' minutes = ' + hours + ' hours. Work out ' + d2 + ' ÷ ' + hours + '.'
          ],
          solution: [minutes + ' minutes = ' + minutes + ' ÷ 60 = ' + hours + ' hours', 'Speed = ' + d2 + ' ÷ ' + hours + ' = ' + s2 + ' km/h'],
          answer: s2 + ' km/h',
          check: numberChecker(s2, [{ value: roundDp(d2 / minutes, 6), message: 'That’s km per minute. Change ' + minutes + ' minutes into hours first.' }])
        };
      }
      return {
        prompt: 'A bus travels at ' + speed + ' km/h for ' + minutes + ' minutes. How far does it go, in km?',
        kind: 'number',
        hints: [
          'Distance = speed × time. The speed is per hour, so change the time into hours.',
          'What fraction of an hour is ' + minutes + ' minutes?',
          minutes + ' minutes = ' + hours + ' hours. Work out ' + speed + ' × ' + hours + '.'
        ],
        solution: [minutes + ' minutes = ' + hours + ' hours', 'Distance = ' + speed + ' × ' + hours + ' = ' + d + ' km'],
        answer: d + ' km',
        check: numberChecker(d, [{ value: speed * minutes, message: 'Change the minutes into hours before multiplying.' }])
      };
    }
  });
})(this);
