# nd-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

File parser for n-dimesional values.

## Installation

`$ npm i nd-parser`

## Usage

```js
import { ndParse } from 'nd-parser';

const simpleExample = `
meta.first,1
meta.second,,2
temp, volt, curr
1,1,1
2,2,2
3,3,3
`;

expect(ndParse(simpleExample, { separator: ',' })).toStrictEqual({
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
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/nd-parser.svg
[npm-url]: https://www.npmjs.com/package/nd-parser
[ci-image]: https://github.com/mylims/nd-parser/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/mylims/nd-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/mylims/nd-parser.svg
[codecov-url]: https://codecov.io/gh/mylims/nd-parser
[download-image]: https://img.shields.io/npm/dm/nd-parser.svg
[download-url]: https://www.npmjs.com/package/nd-parser
