// Geometry and measures topics, Years 7 to 9.
// The questions describe shapes in words, so you may want to sketch them on paper.

(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('../maths.js') : root.MathsEngine;
  const { rand, pick, roundDp, numberChecker } = M;

  const DEG = '°';

  // ----- Angle facts -----

  M.register({
    id: 'angles', name: 'Angle facts', strand: 'geometry', year: 'Y7–8', example: 'Angles in a triangle',
    learn: {
      title: 'Which angle facts do I need?',
      body: [
        'Angles on a <strong>straight line</strong> add up to 180°. Angles <strong>around a point</strong> add up to 360°.',
        'Angles in a <strong>triangle</strong> add up to 180°. Angles in a <strong>quadrilateral</strong> add up to 360°.',
        '<strong>Vertically opposite</strong> angles (where two lines cross) are equal. An <strong>isosceles</strong> triangle has two equal angles.',
        'With <strong>parallel lines</strong>: alternate angles (Z shape) are equal, corresponding angles (F shape) are equal, and co-interior angles (C shape) add up to 180°.'
      ],
      eg: 'Triangle with angles 50° and 60°:\nthird angle = 180 − 50 − 60 = 70°'
    },
    make(level) {
      if (level === 'foundation') {
        const type = pick(['line', 'point', 'triangle', 'opposite']);
        if (type === 'line') {
          const a = rand(15, 165);
          return angleQ('Two angles sit next to each other on a straight line. One is ' + a + DEG + '. What is the other?', 'Angles on a straight line add up to 180' + DEG + '.', 180 - a, ['180 ' + '− ' + a + ' = ' + (180 - a) + DEG], [{ value: 360 - a, message: 'That’s for angles around a point. On a straight line they add to 180' + DEG + '.' }]);
        }
        if (type === 'point') {
          const a = rand(40, 150), b = rand(40, 150);
          return angleQ('Three angles meet at a point. Two of them are ' + a + DEG + ' and ' + b + DEG + '. What is the third?', 'Angles around a point add up to 360' + DEG + '.', 360 - a - b, [a + ' + ' + b + ' = ' + (a + b), '360 − ' + (a + b) + ' = ' + (360 - a - b) + DEG], [{ value: 180 - a - b, message: 'Around a point the angles add to 360' + DEG + ', not 180' + DEG + '.' }]);
        }
        if (type === 'triangle') {
          const a = rand(20, 100), b = rand(20, 150 - a);
          return angleQ('Two angles of a triangle are ' + a + DEG + ' and ' + b + DEG + '. What is the third angle?', 'Angles in a triangle add up to 180' + DEG + '.', 180 - a - b, [a + ' + ' + b + ' = ' + (a + b), '180 − ' + (a + b) + ' = ' + (180 - a - b) + DEG], [{ value: 360 - a - b, message: 'Angles in a triangle add up to 180' + DEG + ', not 360' + DEG + '.' }]);
        }
        const a = rand(20, 160);
        return angleQ('Two straight lines cross. One of the angles is ' + a + DEG + '. What is the angle vertically opposite it?', 'Vertically opposite angles are the angles facing each other across the crossing point.', a, ['Vertically opposite angles are equal, so the angle is ' + a + DEG], [{ value: 180 - a, message: 'That’s the angle next to it on the straight line. The opposite angle is equal.' }]);
      }

      const type = pick(['isosceles-top', 'isosceles-base', 'quad', 'parallel']);
      if (type === 'isosceles-top') {
        const top = rand(10, 85) * 2;
        return angleQ('An isosceles triangle has an angle of ' + top + DEG + ' between its two equal sides. What size is each of the other two angles?', 'In an isosceles triangle the two base angles are equal, and all three angles add to 180' + DEG + '.', (180 - top) / 2, ['180 − ' + top + ' = ' + (180 - top), 'Shared equally: ' + (180 - top) + ' ÷ 2 = ' + (180 - top) / 2 + DEG], [{ value: 180 - top, message: 'That’s both base angles together. They’re equal, so split it in half.' }]);
      }
      if (type === 'isosceles-base') {
        const base = rand(20, 85);
        return angleQ('An isosceles triangle has two equal angles of ' + base + DEG + '. What is the third angle?', 'Both equal angles are ' + base + DEG + '. All three angles add to 180' + DEG + '.', 180 - 2 * base, [base + ' + ' + base + ' = ' + 2 * base, '180 − ' + 2 * base + ' = ' + (180 - 2 * base) + DEG], [{ value: 180 - base, message: 'There are TWO angles of ' + base + DEG + ' in this triangle. Take both away from 180' + DEG + '.' }]);
      }
      if (type === 'quad') {
        const a = rand(60, 130), b = rand(60, 130), c = rand(50, 120);
        const d = 360 - a - b - c;
        if (d > 10 && d < 180) {
          return angleQ('Three angles of a quadrilateral are ' + a + DEG + ', ' + b + DEG + ' and ' + c + DEG + '. What is the fourth angle?', 'Angles in a quadrilateral add up to 360' + DEG + '. (A quadrilateral splits into two triangles.)', d, [a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c), '360 − ' + (a + b + c) + ' = ' + d + DEG], [{ value: 180 - a - b - c, message: 'A quadrilateral’s angles add to 360' + DEG + ', not 180' + DEG + '.' }]);
        }
      }
      const a = rand(30, 150);
      const kind = pick(['alternate', 'corresponding', 'co-interior']);
      const value = kind === 'co-interior' ? 180 - a : a;
      const fact = kind === 'alternate' ? 'Alternate angles (the Z shape) are equal.' : kind === 'corresponding' ? 'Corresponding angles (the F shape) are equal.' : 'Co-interior angles (the C shape) add up to 180' + DEG + '.';
      return angleQ('A line crosses two parallel lines. One angle is ' + a + DEG + '. What is the ' + kind + ' angle to it?', 'With parallel lines, look for Z, F and C shapes. Which shape does a ' + kind + ' angle make?', value, [fact, kind === 'co-interior' ? '180 − ' + a + ' = ' + value + DEG : 'So the angle is ' + value + DEG], value !== 180 - a ? [{ value: 180 - a, message: kind.charAt(0).toUpperCase() + kind.slice(1) + ' angles are equal, not adding to 180' + DEG + '.' }] : [{ value: a, message: 'Co-interior angles add up to 180' + DEG + '. They aren’t equal.' }]);
    }
  });

  // Build an angle question with the standard three-step hint ladder
  function angleQ(prompt, fact, value, steps, mistakes) {
    return {
      prompt: prompt,
      kind: 'number',
      hints: [
        'Draw a quick sketch. Which angle fact links these angles?',
        fact,
        'Now write the calculation: ' + steps[0].split(' = ')[0] + ' = ?'
      ],
      solution: steps.concat(['Answer: ' + value + DEG]),
      answer: value + DEG,
      check: numberChecker(value, mistakes)
    };
  }

  // ----- Polygons -----

  const POLYGON = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };

  M.register({
    id: 'polygons', name: 'Angles in polygons', strand: 'geometry', year: 'Y8', example: 'Interior angles of a hexagon',
    learn: {
      title: 'How do I find angles in polygons?',
      body: [
        'A polygon with n sides can be split into (n − 2) triangles, so its <strong>interior angles add up to (n − 2) × 180°</strong>.',
        'The <strong>exterior angles</strong> of any polygon add up to 360°. In a regular polygon they’re all equal: each one is 360° ÷ n.',
        'Interior angle + exterior angle = 180° (they sit on a straight line).'
      ],
      eg: 'Hexagon (6 sides): (6 − 2) × 180 = 720°\nRegular hexagon: exterior = 360 ÷ 6 = 60°, interior = 180 − 60 = 120°'
    },
    make(level) {
      const n = pick([5, 6, 8, 9, 10, 12]);
      const name = POLYGON[n];
      const sum = (n - 2) * 180, ext = 360 / n, int = 180 - ext;
      const type = level === 'foundation' ? pick(['sum', 'ext']) : pick(['int', 'sides', 'missing']);
      if (type === 'sum') {
        return {
          prompt: 'What do the interior angles of a ' + name + ' add up to?',
          kind: 'number',
          hints: ['Any polygon can be split into triangles by drawing lines from one corner. Each triangle has 180' + DEG + '.', 'A ' + name + ' has ' + n + ' sides. How many triangles can you split it into? (It’s always 2 fewer than the number of sides.)', 'It splits into ' + (n - 2) + ' triangles. Work out ' + (n - 2) + ' × 180.'],
          solution: ['A ' + name + ' has ' + n + ' sides, so ' + (n - 2) + ' triangles', (n - 2) + ' × 180 = ' + sum + DEG],
          answer: sum + DEG,
          check: numberChecker(sum, [{ value: n * 180, message: 'Close: the number of triangles is 2 fewer than the number of sides, so use ' + (n - 2) + ' × 180.' }])
        };
      }
      if (type === 'ext') {
        return {
          prompt: 'What is the size of each exterior angle of a regular ' + name + '?',
          kind: 'number',
          hints: ['The exterior angles of ANY polygon add up to 360' + DEG + '.', 'A regular ' + name + ' has ' + n + ' equal exterior angles. How do you share 360' + DEG + ' between them?', 'Work out 360 ÷ ' + n + '.'],
          solution: ['Exterior angles add up to 360' + DEG, '360 ÷ ' + n + ' = ' + ext + DEG],
          answer: ext + DEG,
          check: numberChecker(ext, [{ value: int, message: 'That’s the interior angle. The exterior angle is outside the shape: 360 ÷ ' + n + '.' }])
        };
      }
      if (type === 'int') {
        return {
          prompt: 'What is the size of each interior angle of a regular ' + name + '?',
          kind: 'number',
          hints: ['Start with the exterior angle: exterior angles always add up to 360' + DEG + '.', 'Each exterior angle is 360 ÷ ' + n + ' = ' + ext + DEG + '. How are the interior and exterior angles related?', 'Interior + exterior = 180' + DEG + '. Work out 180 − ' + ext + '.'],
          solution: ['Exterior = 360 ÷ ' + n + ' = ' + ext + DEG, 'Interior = 180 − ' + ext + ' = ' + int + DEG],
          answer: int + DEG,
          check: numberChecker(int, [{ value: ext, message: 'That’s the exterior angle. The interior angle is 180' + DEG + ' minus it.' }])
        };
      }
      if (type === 'sides') {
        return {
          prompt: 'Each exterior angle of a regular polygon is ' + ext + DEG + '. How many sides does it have?',
          kind: 'number',
          hints: ['All the exterior angles add up to 360' + DEG + '.', 'How many lots of ' + ext + DEG + ' make 360' + DEG + '?', 'Work out 360 ÷ ' + ext + '.'],
          solution: ['360 ÷ ' + ext + ' = ' + n + ' sides (a ' + name + ')'],
          answer: String(n),
          check: numberChecker(n)
        };
      }
      // Four angles of a pentagon, leaving a sensible fifth angle
      let known, total, missing;
      do {
        known = [0, 1, 2, 3].map(() => rand(95, 140));
        total = known.reduce((x, y) => x + y, 0);
        missing = 540 - total;
      } while (missing < 30 || missing > 170);
      return {
        prompt: 'Four angles of a pentagon are ' + known.join(DEG + ', ') + DEG + '. What is the fifth angle?',
        kind: 'number',
        hints: ['First work out what all five angles of a pentagon add up to.', 'A pentagon splits into 3 triangles, so the angles add up to 3 × 180 = 540' + DEG + '.', 'The four angles you know add up to ' + total + DEG + '. What’s left from 540' + DEG + '?'],
        solution: ['Pentagon: (5 − 2) × 180 = 540' + DEG, known.join(' + ') + ' = ' + total, '540 − ' + total + ' = ' + missing + DEG],
        answer: missing + DEG,
        check: numberChecker(missing, [{ value: 360 - total, message: 'A pentagon’s angles add up to 540' + DEG + ', not 360' + DEG + '.' }])
      };
    }
  });

  // ----- Area and perimeter -----

  M.register({
    id: 'area', name: 'Area and perimeter', strand: 'geometry', year: 'Y7–8', example: 'Area of a trapezium',
    learn: {
      title: 'How do I find area and perimeter?',
      body: [
        '<strong>Perimeter</strong> is the distance all the way round: add up every side.',
        '<strong>Area</strong> is the space inside, measured in square units like cm².',
        'Rectangle: length × width. Triangle: ½ × base × height. Parallelogram: base × height. Trapezium: ½ × (a + b) × h, where a and b are the parallel sides.',
        'The height is always measured at right angles (perpendicular) to the base, not along the slanted side.'
      ],
      eg: 'Triangle, base 8 cm, height 5 cm:\narea = ½ × 8 × 5 = 20 cm²\nTrapezium, parallel sides 4 and 10, height 6:\narea = ½ × (4 + 10) × 6 = 42 cm²'
    },
    make(level) {
      if (level === 'foundation') {
        const l = rand(3, 15), w = rand(2, 12);
        const type = pick(['rect-area', 'rect-perim', 'triangle', 'parallelogram']);
        if (type === 'rect-area') return areaQ('A rectangle is ' + l + ' cm long and ' + w + ' cm wide. What is its area?', 'Area of a rectangle = length × width.', l + ' × ' + w, l * w, 'cm²', [{ value: 2 * (l + w), message: 'That’s the perimeter (distance round the edge). Area is length × width.' }]);
        if (type === 'rect-perim') return areaQ('A rectangle is ' + l + ' cm long and ' + w + ' cm wide. What is its perimeter?', 'Perimeter is the distance all the way round. A rectangle has two lengths and two widths.', l + ' + ' + w + ' + ' + l + ' + ' + w, 2 * (l + w), 'cm', [{ value: l * w, message: 'That’s the area. Perimeter is the distance round the edge: add all four sides.' }, { value: l + w, message: 'That’s only two of the sides. A rectangle has four.' }]);
        if (type === 'triangle') {
          const b = rand(2, 10) * 2, h = rand(3, 12);
          return areaQ('A triangle has a base of ' + b + ' cm and a perpendicular height of ' + h + ' cm. What is its area?', 'A triangle is half of a rectangle. Area = ½ × base × height.', '½ × ' + b + ' × ' + h, b * h / 2, 'cm²', [{ value: b * h, message: 'That’s the rectangle around the triangle. A triangle is half of it.' }]);
        }
        return areaQ('A parallelogram has a base of ' + l + ' cm and a perpendicular height of ' + w + ' cm. What is its area?', 'A parallelogram can be cut and rearranged into a rectangle. Area = base × height.', l + ' × ' + w, l * w, 'cm²', [{ value: l * w / 2, message: 'You halved it, but that’s for triangles. A parallelogram is base × height.' }]);
      }
      if (Math.random() < 0.4) {
        // An even height keeps the answer a whole number
        const a = rand(2, 12), b = a + rand(1, 8), h = rand(1, 6) * 2;
        const value = (a + b) * h / 2;
        return areaQ('A trapezium has parallel sides of ' + a + ' cm and ' + b + ' cm, and a height of ' + h + ' cm. What is its area?', 'Area of a trapezium = ½ × (a + b) × h, where a and b are the parallel sides.', '½ × (' + a + ' + ' + b + ') × ' + h, value, 'cm²', [{ value: (a + b) * h, message: 'Don’t forget the ½. It’s ½ × (a + b) × h.' }]);
      }
      if (Math.random() < 0.5) {
        const W = rand(8, 16), H = rand(6, 14), w = rand(2, W - 3), h = rand(2, H - 3);
        const value = W * H - w * h;
        return areaQ('An L-shape is made by cutting a ' + w + ' cm by ' + h + ' cm rectangle out of one corner of a ' + W + ' cm by ' + H + ' cm rectangle. What is the area of the L-shape?', 'Find the area of the big rectangle, then take away the piece that was cut out.', W + ' × ' + H + ' − ' + w + ' × ' + h, value, 'cm²', [{ value: W * H, message: 'That’s the whole rectangle. Remember to take away the cut-out corner.' }]);
      }
      const w = rand(3, 12), l = rand(4, 15);
      return areaQ('A rectangle has an area of ' + l * w + ' cm². Its width is ' + w + ' cm. What is its length?', 'Area = length × width. You know the area and the width.', l * w + ' ÷ ' + w, l, 'cm', [{ value: l * w - w, message: 'Area is length × width, so to undo it, divide (don’t subtract).' }]);
    }
  });

  // Build an area/perimeter question with the standard three-step hint ladder
  function areaQ(prompt, fact, sum, value, unit, mistakes) {
    return {
      prompt: prompt,
      kind: 'number',
      hints: ['Sketch the shape and label the lengths you know.', fact, 'Work out ' + sum + '.'],
      solution: [fact, sum + ' = ' + value + ' ' + unit],
      answer: value + ' ' + unit,
      check: numberChecker(value, mistakes)
    };
  }

  // ----- Circles -----

  const PI = Math.PI;

  M.register({
    id: 'circles', name: 'Circles', strand: 'geometry', year: 'Y8–9', example: 'Area with r = 5 cm',
    learn: {
      title: 'How do I work with circles?',
      body: [
        'The <strong>radius</strong> goes from the centre to the edge. The <strong>diameter</strong> goes all the way across: it’s 2 × radius.',
        '<strong>Circumference</strong> (the distance round) = π × diameter, or 2 × π × radius.',
        '<strong>Area</strong> = π × radius². Always use the radius for area. If you’re given the diameter, halve it first.',
        'π (pi) is about 3.14159. Use the π button on your calculator, or give an exact answer like 25π. Type pi or π.'
      ],
      eg: 'Radius 5 cm:\ncircumference = 2 × π × 5 = 31.4 cm (1 d.p.)\narea = π × 5² = 25π = 78.5 cm² (1 d.p.)'
    },
    make(level) {
      const r = rand(2, 15);
      const givenDiameter = Math.random() < 0.5;
      const given = givenDiameter ? 'diameter of ' + 2 * r + ' cm' : 'radius of ' + r + ' cm';
      if (level === 'foundation') {
        const exact = 2 * PI * r;
        return circleQ('A circle has a ' + given + '. Find its circumference, to 1 decimal place.', [
          'Circumference is the distance round the circle. The formula is π × diameter.',
          givenDiameter ? 'You’re given the diameter, ' + 2 * r + ' cm. So work out π × ' + 2 * r + '.' : 'You’re given the radius. The diameter is twice the radius: ' + 2 * r + ' cm.',
          'π × ' + 2 * r + ' = ' + 2 * r + 'π. Use your calculator and round to 1 decimal place.'
        ], ['Circumference = π × diameter = π × ' + 2 * r + ' = ' + 2 * r + 'π', '= ' + roundDp(exact, 4) + '…', '= ' + roundDp(exact, 1) + ' cm (1 d.p.)'], exact, 'cm', [
          { value: roundDp(PI * r, 1), message: 'You used the radius. Circumference is π × diameter (or 2 × π × radius).' },
          { value: roundDp(PI * r * r, 1), message: 'That’s the area. Circumference is the distance round: π × diameter.' }
        ]);
      }
      if (Math.random() < 0.7) {
        const exact = PI * r * r;
        return circleQ('A circle has a ' + given + '. Find its area, to 1 decimal place.', [
          'Area of a circle = π × radius². You need the radius.',
          givenDiameter ? 'You’re given the diameter. Halve it to get the radius: ' + r + ' cm.' : 'The radius is ' + r + ' cm. What is ' + r + '²?',
          r + '² = ' + r * r + ', so the area is ' + r * r + 'π. Use your calculator and round to 1 decimal place.'
        ], ['Radius = ' + r + ' cm', 'Area = π × ' + r + '² = ' + r * r + 'π', '= ' + roundDp(exact, 4) + '… = ' + roundDp(exact, 1) + ' cm² (1 d.p.)'], exact, 'cm²', [
          { value: roundDp(PI * 4 * r * r, 1), message: 'You used the diameter. Area uses the radius, so halve the diameter first.' },
          { value: roundDp(2 * PI * r, 1), message: 'That’s the circumference. Area is π × radius².' },
          { value: roundDp(PI * 2 * r, 1), message: 'Square the radius: it’s π × r × r, not π × r × 2.' }
        ]);
      }
      const C = roundDp(2 * PI * r, 1);
      return {
        prompt: 'A circle has a circumference of ' + 2 * r + 'π cm. What is its radius?',
        kind: 'number',
        hints: ['Circumference = 2 × π × radius.', 'So ' + 2 * r + 'π = 2 × π × r. What do you divide both sides by?', 'Divide both sides by 2π.'],
        solution: [2 * r + 'π = 2πr', 'r = ' + 2 * r + 'π ÷ 2π = ' + r + ' cm'],
        answer: r + ' cm',
        check: numberChecker(r, [{ value: 2 * r, message: 'That’s the diameter. The radius is half of it.' }, { value: C, message: 'That’s the circumference as a decimal. Divide by 2π to find the radius.' }])
      };
    }
  });

  function circleQ(prompt, hints, solution, exact, unit, mistakes) {
    const value = roundDp(exact, 1);
    return {
      prompt, kind: 'number', hints, solution,
      answer: value + ' ' + unit,
      check: numberChecker(value, mistakes.filter(m => m.value !== value), { dp: 1, exact })
    };
  }

  // ----- Volume -----

  M.register({
    id: 'volume', name: 'Volume', strand: 'geometry', year: 'Y8–9', example: 'Cuboid 5 × 4 × 3',
    learn: {
      title: 'How do I find the volume of a prism?',
      body: [
        '<strong>Volume</strong> is the space inside a 3D shape, measured in cubic units like cm³.',
        'Cuboid: length × width × height.',
        'Any <strong>prism</strong> (same shape all the way through): volume = area of the cross-section × length.',
        'A cylinder is a prism with a circle cross-section: volume = π × r² × h.'
      ],
      eg: 'Cuboid 5 cm × 4 cm × 3 cm: volume = 60 cm³\nTriangular prism: triangle area 12 cm², length 10 cm → 120 cm³'
    },
    make(level) {
      const l = rand(2, 12), w = rand(2, 10), h = rand(2, 9);
      if (level === 'foundation') {
        if (Math.random() < 0.8) {
          return volQ('A cuboid measures ' + l + ' cm by ' + w + ' cm by ' + h + ' cm. What is its volume?', 'Volume of a cuboid = length × width × height.', l + ' × ' + w + ' × ' + h, l * w * h, [{ value: 2 * (l * w + l * h + w * h), message: 'That’s the surface area. Volume is length × width × height.' }, { value: l + w + h, message: 'Multiply the three lengths, don’t add them.' }]);
        }
        return volQ('A cube has edges of ' + w + ' cm. What is its volume?', 'All the edges of a cube are the same length. Volume = edge × edge × edge = edge³.', w + ' × ' + w + ' × ' + w, w * w * w, [{ value: 3 * w, message: 'Cubing means ' + w + ' × ' + w + ' × ' + w + ', not × 3.' }, { value: w * w, message: 'That’s the area of one face. Multiply by the third edge too.' }]);
      }
      const type = pick(['prism', 'cylinder', 'missing']);
      if (type === 'prism') {
        const b = rand(2, 8) * 2, th = rand(2, 9), len = rand(4, 15);
        return volQ('A triangular prism is ' + len + ' cm long. Its cross-section is a triangle with base ' + b + ' cm and height ' + th + ' cm. What is its volume?', 'Volume of a prism = area of cross-section × length. The cross-section is a triangle: ½ × base × height.', '½ × ' + b + ' × ' + th + ' × ' + len, b * th / 2 * len, [{ value: b * th * len, message: 'The cross-section is a triangle, so its area is ½ × base × height. You forgot the ½.' }]);
      }
      if (type === 'cylinder') {
        const r = rand(2, 9), ch = rand(3, 15);
        const exact = PI * r * r * ch, value = roundDp(exact, 1);
        return {
          prompt: 'A cylinder has radius ' + r + ' cm and height ' + ch + ' cm. Find its volume, to 1 decimal place.',
          kind: 'number',
          hints: ['A cylinder is a prism with a circle cross-section. Volume = area of circle × height.', 'Area of the circle = π × ' + r + '² = ' + r * r + 'π.', 'Multiply ' + r * r + 'π by ' + ch + ', then use your calculator and round.'],
          solution: ['Circle area = π × ' + r + '² = ' + r * r + 'π', 'Volume = ' + r * r + 'π × ' + ch + ' = ' + r * r * ch + 'π', '= ' + value + ' cm³ (1 d.p.)'],
          answer: value + ' cm³',
          check: numberChecker(value, [{ value: roundDp(PI * 2 * r * ch, 1), message: 'Square the radius: π × r × r × h.' }], { dp: 1, exact })
        };
      }
      return volQ('A cuboid has a volume of ' + l * w * h + ' cm³. It is ' + l + ' cm long and ' + w + ' cm wide. How tall is it?', 'Volume = length × width × height. Find length × width first.', l * w * h + ' ÷ (' + l + ' × ' + w + ') = ' + l * w * h + ' ÷ ' + l * w, h, [], 'cm');
    }
  });

  function volQ(prompt, fact, sum, value, mistakes, unit) {
    unit = unit || 'cm³';
    return {
      prompt, kind: 'number',
      hints: ['Picture the shape, or sketch it, and label the lengths.', fact, 'Work out ' + sum + '.'],
      solution: [fact, sum + ' = ' + value + ' ' + unit],
      answer: value + ' ' + unit,
      check: numberChecker(value, mistakes)
    };
  }

  // ----- Pythagoras -----

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

  M.register({
    id: 'pythagoras', name: 'Pythagoras’ theorem', strand: 'geometry', year: 'Y9', example: 'a² + b² = c²',
    learn: {
      title: 'What is Pythagoras’ theorem?',
      body: [
        'In a <strong>right-angled triangle</strong>, a² + b² = c², where c is the <strong>hypotenuse</strong>: the longest side, opposite the right angle.',
        'Finding the hypotenuse: square the two shorter sides, <strong>add</strong>, then square root.',
        'Finding a shorter side: square the two sides you know, <strong>subtract</strong> (big minus small), then square root.',
        'Check: the hypotenuse must always be the longest side.'
      ],
      eg: 'Shorter sides 6 and 8:\nc² = 6² + 8² = 36 + 64 = 100\nc = √100 = 10'
    },
    make(level) {
      if (level === 'foundation') {
        const triple = pick(TRIPLES);
        const k = triple[2] <= 13 ? rand(1, 3) : 1;
        const [a, b, c] = triple.map(s => s * k);
        return {
          prompt: 'A right-angled triangle has shorter sides of ' + a + ' cm and ' + b + ' cm. How long is the hypotenuse?',
          kind: 'number',
          hints: [
            'Pythagoras: a² + b² = c², where c is the hypotenuse (the longest side).',
            'Square both shorter sides and add them: ' + a + '² + ' + b + '².',
            a + '² + ' + b + '² = ' + a * a + ' + ' + b * b + ' = ' + c * c + '. That’s c². How do you find c?'
          ],
          solution: ['c² = ' + a + '² + ' + b + '² = ' + a * a + ' + ' + b * b + ' = ' + c * c, 'c = √' + c * c + ' = ' + c + ' cm'],
          answer: c + ' cm',
          check: numberChecker(c, [{ value: c * c, message: 'That’s c². Square root it to find c.' }, { value: a + b, message: 'You can’t just add the sides. Square them, add, then square root.' }])
        };
      }
      const a = rand(3, 15), b = rand(3, 15);
      if (Math.random() < 0.5) {
        const exact = Math.sqrt(a * a + b * b), value = roundDp(exact, 1);
        return {
          prompt: 'A right-angled triangle has shorter sides of ' + a + ' cm and ' + b + ' cm. Find the hypotenuse, to 1 decimal place.',
          kind: 'number',
          hints: ['Use a² + b² = c². You’re finding the longest side, so add.', a + '² + ' + b + '² = ' + (a * a + b * b) + '. That’s c².', 'c = √' + (a * a + b * b) + '. Use your calculator and round to 1 decimal place.'],
          solution: ['c² = ' + a * a + ' + ' + b * b + ' = ' + (a * a + b * b), 'c = √' + (a * a + b * b) + ' = ' + roundDp(exact, 4) + '…', '= ' + value + ' cm (1 d.p.)'],
          answer: value + ' cm',
          check: numberChecker(value, [{ value: roundDp(Math.sqrt(Math.abs(a * a - b * b)), 1), message: 'You subtracted. To find the hypotenuse (longest side), add the squares.' }], { dp: 1, exact })
        };
      }
      const hyp = Math.max(a, b) + rand(2, 8), leg = Math.min(a, b);
      const exact = Math.sqrt(hyp * hyp - leg * leg), value = roundDp(exact, 1);
      return {
        prompt: 'A right-angled triangle has a hypotenuse of ' + hyp + ' cm and one shorter side of ' + leg + ' cm. Find the other shorter side, to 1 decimal place.',
        kind: 'number',
        hints: ['You know the hypotenuse, so you’re finding a shorter side. That means you subtract the squares.', hyp + '² − ' + leg + '² = ' + hyp * hyp + ' − ' + leg * leg + '.', 'That gives ' + (hyp * hyp - leg * leg) + '. Square root it and round to 1 decimal place.'],
        solution: ['b² = ' + hyp + '² − ' + leg + '² = ' + hyp * hyp + ' − ' + leg * leg + ' = ' + (hyp * hyp - leg * leg), 'b = √' + (hyp * hyp - leg * leg) + ' = ' + roundDp(exact, 4) + '…', '= ' + value + ' cm (1 d.p.)'],
        answer: value + ' cm',
        check: numberChecker(value, [{ value: roundDp(Math.sqrt(hyp * hyp + leg * leg), 1), message: 'You added the squares, which gives a side longer than the hypotenuse. For a shorter side, subtract.' }], { dp: 1, exact })
      };
    }
  });
})(this);
