import { ndParse } from '..';

const simpleExample = `
meta.first,1
meta.second,,2
temp, volt, curr
1,1,1
2,2,2
3,3,3
`;

test('simpleExample', () => {
  expect(ndParse(simpleExample)).toStrictEqual({
    data: {
      temp: { data: [1, 2, 3], label: 'temp' },
      volt: { data: [1, 2, 3], label: 'volt' },
      curr: { data: [1, 2, 3], label: 'curr' },
    },
    meta: {
      'meta.first': '1',
      'meta.second': '2',
    },
  });
});
