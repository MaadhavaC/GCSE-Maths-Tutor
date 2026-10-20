// Probability and statistics topics, Years 7 to 9.

(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('../maths.js') : root.MathsEngine;
  const { rand, pick, shuffle, roundDp, num, frac, numberChecker, fractionChecker } = M;

  // ----- Probability -----

  const COLOURS = ['red', 'blue', 'green', 'yellow', 'purple'];

  M.register({
    id: 'probability', name: 'Probability', strand: 'stats', year: 'Y7–9', example: 'P(red) from a bag',
    learn: {
      title: 'How does probability work?',
      body: [
        'Probability measures how likely something is, from 0 (impossible) to 1 (certain). Write it as a fraction, decimal or percentage.',
        'When every outcome is equally likely: <strong>P(event) = number of ways it can happen ÷ total number of outcomes</strong>.',
        'The probability that something does <strong>not</strong> happen is 1 − P(it happens). All the probabilities in a table add up to 1.',
        '<strong>Expected frequency</strong> = probability × number of trials.'
      ],
      eg: 'A bag has 3 red and 5 blue counters.\nP(red) = 3/8\nP(not red) = 1 − 3/8 = 5/8\nPick 40 times: expect 3/8 × 40 = 15 reds'
    },
    make(level) {
      if (level === 'foundation') {
        if (Math.random() < 0.6) {
          const cols = shuffle(COLOURS).slice(0, rand(2, 3));
          const counts = cols.map(() => rand(1, 9));
          const total = counts.reduce((a, b) => a + b, 0);
          const i = rand(0, cols.length - 1);
          const parts = cols.map((c, k) => counts[k] + ' ' + c);
          const list = parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
          return {
            prompt: 'A bag contains ' + list + ' counters. One counter is picked at random. What is the probability it is ' + cols[i] + '? Give your answer as a fraction in its simplest form.',
            kind: 'fraction',
            hints: [
              'Probability = number of ways it can happen ÷ total number of outcomes.',
              'How many ' + cols[i] + ' counters are there? How many counters are there altogether?',
              'There are ' + counts[i] + ' ' + cols[i] + ' out of ' + total + ' counters. Write that as a fraction and simplify if you can.'
            ],
            solution: ['Total counters = ' + counts.join(' + ') + ' = ' + total, 'P(' + cols[i] + ') = ' + counts[i] + '/' + total + (frac(counts[i], total) !== counts[i] + '/' + total ? ' = ' + frac(counts[i], total) : '')],
            answer: frac(counts[i], total),
            check: fractionChecker(counts[i], total, counts.length > 1 ? [{ n: counts[i], d: total - counts[i], message: 'The bottom of the fraction is the TOTAL number of counters, including the ' + cols[i] + ' ones.' }] : [], { allowDecimal: true })
          };
        }
        const events = [
          ['an even number', [2, 4, 6]], ['an odd number', [1, 3, 5]], ['a number greater than 4', [5, 6]],
          ['a prime number', [2, 3, 5]], ['a multiple of 3', [3, 6]], ['a number less than 3', [1, 2]], ['a 6', [6]], ['a factor of 6', [1, 2, 3, 6]]
        ];
        const [desc, ways] = pick(events);
        return {
          prompt: 'A fair six-sided dice is rolled. What is the probability of getting ' + desc + '? Give your answer as a fraction in its simplest form.',
          kind: 'fraction',
          hints: [
            'A dice can land on 1, 2, 3, 4, 5 or 6. All six are equally likely.',
            'Which of the numbers 1 to 6 count as ' + desc + '?',
            'The numbers that work are ' + ways.join(', ') + '. That’s ' + ways.length + ' out of 6.'
          ],
          solution: ['Outcomes that work: ' + ways.join(', '), 'P = ' + ways.length + '/6' + (frac(ways.length, 6) !== ways.length + '/6' ? ' = ' + frac(ways.length, 6) : '')],
          answer: frac(ways.length, 6),
          check: fractionChecker(ways.length, 6, [], { allowDecimal: true })
        };
      }
      const type = pick(['not', 'table', 'expected']);
      if (type === 'not') {
        const p = rand(1, 19) * 5 / 100;
        return {
          prompt: 'The probability that it rains tomorrow is ' + p + '. What is the probability that it does NOT rain tomorrow?',
          kind: 'number',
          hints: ['It either rains or it doesn’t. Those two probabilities add up to 1.', 'P(not rain) = 1 − P(rain).', 'Work out 1 − ' + p + '.'],
          solution: ['P(not rain) = 1 − ' + p, '= ' + roundDp(1 - p, 2)],
          answer: String(roundDp(1 - p, 2)),
          check: numberChecker(roundDp(1 - p, 2), [{ value: roundDp(100 - p, 2), message: 'Probabilities add up to 1, not 100 (unless you’re using percentages).' }])
        };
      }
      if (type === 'table') {
        const cols = shuffle(COLOURS).slice(0, 4);
        let ps;
        do { ps = [rand(1, 5), rand(1, 5), rand(1, 5)].map(x => x / 10); } while (ps.reduce((a, b) => a + b, 0) >= 0.95);
        const missing = roundDp(1 - ps.reduce((a, b) => a + b, 0), 2);
        const table = cols.slice(0, 3).map((c, k) => c + ': ' + ps[k]).join(',  ') + ',  ' + cols[3] + ': ?';
        return {
          prompt: 'A spinner can land on four colours. The probabilities are\n' + table + '\nWhat is the probability it lands on ' + cols[3] + '?',
          kind: 'number',
          hints: ['The spinner must land on one of the four colours, so the four probabilities add up to 1.', 'Add up the three probabilities you know.', 'They add up to ' + roundDp(1 - missing, 2) + '. What do you add to that to make 1?'],
          solution: [ps.join(' + ') + ' = ' + roundDp(1 - missing, 2), '1 − ' + roundDp(1 - missing, 2) + ' = ' + missing],
          answer: String(missing),
          check: numberChecker(missing)
        };
      }
      const d = pick([4, 5, 6, 8, 10]), n = rand(1, d - 1);
      const trials = d * pick([5, 10, 12, 20, 25, 30]);
      const value = trials / d * n;
      return {
        prompt: 'The probability that a biased coin lands on heads is ' + frac(n, d) + '. The coin is flipped ' + trials + ' times. How many heads would you expect?',
        kind: 'number',
        hints: ['Expected frequency = probability × number of trials.', 'Work out ' + frac(n, d) + ' of ' + trials + '.', trials + ' ÷ ' + d + ' = ' + trials / d + '. Now multiply by ' + n + '.'],
        solution: ['Expected heads = ' + frac(n, d) + ' × ' + trials, '= ' + trials + ' ÷ ' + d + ' × ' + n + ' = ' + value],
        answer: String(value),
        check: numberChecker(value)
      };
    }
  });

  // ----- Averages and range -----

  function sorted(list) {
    return list.slice().sort((a, b) => a - b);
  }

  M.register({
    id: 'averages', name: 'Averages and range', strand: 'stats', year: 'Y7–8', example: 'Mean of 4, 7, 10',
    learn: {
      title: 'What are the mean, median, mode and range?',
      body: [
        '<strong>Mean:</strong> add up all the values and divide by how many there are.',
        '<strong>Median:</strong> put the values in order and find the middle one. If there are two middle values, the median is halfway between them.',
        '<strong>Mode:</strong> the value that appears most often.',
        '<strong>Range:</strong> biggest value − smallest value. It shows how spread out the data is.'
      ],
      eg: 'Data: 3, 7, 4, 7, 9\nIn order: 3, 4, 7, 7, 9\nMean = 30 ÷ 5 = 6\nMedian = 7   Mode = 7   Range = 9 − 3 = 6'
    },
    make(level) {
      if (level === 'foundation') {
        const type = pick(['mean', 'median', 'mode', 'range']);
        const n = pick([5, 7]);
        let data = Array.from({ length: n }, () => rand(1, 20));
        if (type === 'mean') {
          // Adjust the last value so the mean is a whole number
          const extra = data.reduce((a, b) => a + b, 0) % n;
          data[n - 1] += n - extra === n ? 0 : n - extra;
        }
        if (type === 'mode') {
          data = Array.from({ length: n - 2 }, () => rand(1, 15));
          data = shuffle(Array.from(new Set(data)));
          const m = pick(data);
          data.push(m, m);
          data = shuffle(data);
        }
        const shown = data.join(', ');
        const s = sorted(data);
        const total = data.reduce((a, b) => a + b, 0);
        if (type === 'mean') {
          return {
            prompt: 'Find the mean of  ' + shown,
            kind: 'number',
            hints: ['Mean = total of all the values ÷ how many values there are.', 'Add them all up. How many values are there?', 'The total is ' + total + ' and there are ' + n + ' values. Divide.'],
            solution: ['Total = ' + data.join(' + ') + ' = ' + total, 'Mean = ' + total + ' ÷ ' + n + ' = ' + total / n],
            answer: String(total / n),
            check: numberChecker(total / n, [{ value: s[(n - 1) / 2], message: 'That’s the median (the middle value). The mean is total ÷ how many.' }].filter(m => m.value !== total / n))
          };
        }
        if (type === 'median') {
          const med = s[(n - 1) / 2];
          return {
            prompt: 'Find the median of  ' + shown,
            kind: 'number',
            hints: ['The median is the middle value, but only once the values are in order.', 'Write the numbers in order from smallest to largest.', 'In order: ' + s.join(', ') + '. Which one is in the middle?'],
            solution: ['In order: ' + s.join(', '), 'The middle (value number ' + (n + 1) / 2 + ') is ' + med],
            answer: String(med),
            check: numberChecker(med, [{ value: data[(n - 1) / 2], message: 'That’s the middle of the list as given. Put the numbers in order first.' }].filter(m => m.value !== med))
          };
        }
        if (type === 'mode') {
          const counts = {};
          data.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
          const mode = Number(Object.keys(counts).find(k => counts[k] === Math.max(...Object.values(counts))));
          return {
            prompt: 'Find the mode of  ' + data.join(', '),
            kind: 'number',
            hints: ['The mode is the value that appears most often.', 'Count how many times each number appears. Putting them in order makes this easier.', 'In order: ' + sorted(data).join(', ') + '. Which number appears more than once?'],
            solution: ['In order: ' + sorted(data).join(', '), mode + ' appears ' + counts[mode] + ' times, more than any other value', 'Mode = ' + mode],
            answer: String(mode),
            check: numberChecker(mode, [{ value: counts[mode], message: 'That’s how many times the mode appears. The mode is the value itself.' }].filter(m => m.value !== mode))
          };
        }
        return {
          prompt: 'Find the range of  ' + shown,
          kind: 'number',
          hints: ['Range = largest value − smallest value.', 'Which is the largest number? Which is the smallest?', 'Largest is ' + s[n - 1] + ', smallest is ' + s[0] + '. Subtract.'],
          solution: ['Largest = ' + s[n - 1] + ', smallest = ' + s[0], 'Range = ' + s[n - 1] + ' − ' + s[0] + ' = ' + (s[n - 1] - s[0])],
          answer: String(s[n - 1] - s[0]),
          check: numberChecker(s[n - 1] - s[0], [{ value: data[data.length - 1] - data[0], message: 'Use the largest and smallest values, not the last and first in the list.' }].filter(m => m.value !== s[n - 1] - s[0]))
        };
      }

      const type = pick(['even-median', 'missing', 'table']);
      if (type === 'even-median') {
        const data = Array.from({ length: pick([6, 8]) }, () => rand(1, 30));
        const s = sorted(data), n = data.length;
        const a = s[n / 2 - 1], b = s[n / 2], med = (a + b) / 2;
        return {
          prompt: 'Find the median of  ' + data.join(', '),
          kind: 'number',
          hints: ['Put the values in order first. There are ' + n + ' values, an even number, so there are two in the middle.', 'In order: ' + s.join(', ') + '. Which two values are in the middle?', 'The middle two are ' + a + ' and ' + b + '. The median is halfway between them: add them and divide by 2.'],
          solution: ['In order: ' + s.join(', '), 'Middle two: ' + a + ' and ' + b, 'Median = (' + a + ' + ' + b + ') ÷ 2 = ' + num(med)],
          answer: num(med),
          check: numberChecker(med)
        };
      }
      if (type === 'missing') {
        const n = rand(4, 6), mean = rand(5, 15);
        const known = Array.from({ length: n - 1 }, () => rand(1, 2 * mean));
        const missing = mean * n - known.reduce((a, b) => a + b, 0);
        if (missing > 0 && missing < 50) {
          return {
            prompt: 'The mean of ' + n + ' numbers is ' + mean + '. ' + (n - 1) + ' of them are ' + known.join(', ') + '. What is the missing number?',
            kind: 'number',
            hints: ['If you know the mean and how many numbers there are, you can find the total.', 'Total = mean × how many = ' + mean + ' × ' + n + '.', 'The total must be ' + mean * n + '. The numbers you know add to ' + (mean * n - missing) + '. What’s missing?'],
            solution: ['Total = ' + mean + ' × ' + n + ' = ' + mean * n, 'Known numbers add to ' + (mean * n - missing), 'Missing number = ' + mean * n + ' − ' + (mean * n - missing) + ' = ' + missing],
            answer: String(missing),
            check: numberChecker(missing)
          };
        }
      }
      const values = [0, 1, 2, 3, 4];
      const freqs = values.map(() => rand(1, 9));
      const total = freqs.reduce((a, b) => a + b, 0);
      const fx = values.reduce((acc, v, i) => acc + v * freqs[i], 0);
      const mean = roundDp(fx / total, 1);
      return {
        prompt: 'A class recorded how many pets each student has.\nPets:     ' + values.join('   ') + '\nStudents: ' + freqs.join('   ') + '\nFind the mean number of pets, to 1 decimal place.',
        kind: 'number',
        hints: [
          'Mean = total number of pets ÷ total number of students.',
          'For each column, multiply pets × students to get the pets in that group. Add those up for the total pets.',
          'Total pets = ' + values.map((v, i) => v + '×' + freqs[i]).join(' + ') + ' = ' + fx + '. Total students = ' + total + '. Divide.'
        ],
        solution: ['Total pets = ' + values.map((v, i) => v + ' × ' + freqs[i]).join(' + ') + ' = ' + fx, 'Total students = ' + total, 'Mean = ' + fx + ' ÷ ' + total + ' = ' + mean + ' (1 d.p.)'],
        answer: String(mean),
        check: numberChecker(mean, [{ value: roundDp(total / 5, 1), message: 'That’s the mean of the frequencies. You need total pets ÷ total students.' }, { value: roundDp(fx / 5, 1), message: 'Divide by the total number of students (' + total + '), not the number of columns.' }], { dp: 1, exact: fx / total })
      };
    }
  });
})(this);
