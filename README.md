# Node xTemplate

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

[npm-image]: https://badge.fury.io/js/node-xtemplate.svg
[npm-url]: https://npmjs.org/package/node-xtemplate
[download-image]: https://img.shields.io/npm/dm/node-xtemplate.svg
[download-url]: https://npmjs.org/package/node-xtemplate
[travis-image]: https://travis-ci.org/zce/node-xtemplate.svg?branch=master
[travis-url]: https://travis-ci.org/zce/node-xtemplate
[dependency-image]: https://david-dm.org/zce/node-xtemplate/status.svg
[dependency-url]: https://david-dm.org/zce/node-xtemplate
[devdependency-image]: https://david-dm.org/zce/node-xtemplate/dev-status.svg
[devdependency-url]: https://david-dm.org/zce/node-xtemplate?type=dev
[style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[style-url]: http://standardjs.com/

> A node.js wrapper around xtemplate engine


## Install

```sh
$ npm install --save node-xtemplate
```


## Usage

demo.xtpl
```html
<p>hello world</p>
```

demo.js

```js
const xTemplate = require('node-xtemplate');

xTemplate.render(path.resolve(__dirname, 'demo.xtpl'), {
  message: 'hello world'
}, function (err, result) {
  // => <p>hello world</p>
})
```


## API

### render(path, data[, options], callback)

#### path

Type: `string`

The path of template file.

#### data

Type: `object`

The template data.

#### options

##### extname

Type: `string`

#### strict

Type: `boolean`

#### catchError

Type: `boolean`

#### cache

Type: `boolean`

#### encoding

Type: `string`<br>
Default: `utf-8`

### callback(err, result)

Type: `function`

Done callback


## License

[MIT](LICENSE) © [汪磊](http://github.com/zce)

