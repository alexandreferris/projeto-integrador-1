[![Build Status](https://travis-ci.org/mgduk/uncamelize.svg?branch=master)](https://travis-ci.org/mgduk/uncamelize)
[![GitHub issues](https://img.shields.io/github/issues/mgduk/uncamelize.svg)](https://github.com/mgduk/uncamelize/issues)

Convert a camelCase string into a space separated one.

Examples
--------
```js
uncamelize('fooBarBaz')
// => "foo Bar Baz"
```

`uncamelize` corrects the capitalization of special cases, such as initialisms and camelcased names:
```
uncamelize('httpGitHubUrls')
// => 'HTTP GitHub URLs'
// (whereas naturally this would become 'http Git Hub Urls')
```

You can pass special case words of your own.
```
// calling uncamelize directly with a string
uncamelize = require('uncamelize')
uncamelize('fooBarBaz')
// => 'foo Bar Baz'

// calling uncamelize with a hashmap of options to override the default
uncamelize = require('uncamelize')({specialCases: 'FOO WhyNot'})
uncamelize('fooBarWhyNotBaz')
// => 'FOO Bar WhyNot Baz'

// `specialCases` can be a space separated string or an array:
uncamelize = require('uncamelize')({specialCases: ['FOO', 'WhyNot']})
uncamelize('fooBarWhyNotBaz')
// => 'FOO Bar WhyNot Baz'
```

By default `specialCases` you provide override the default. You can alternatively merge them:
```
uncamelize = require('uncamelize')({specialCases: 'NASA'})
uncamelize('nasaGitHubUrl')
// => 'NASA Git Hub Url'

uncamelize = require('uncamelize')({specialCases: 'NASA', merge: 'specialCases'})
uncamelize('nasaGitHubUrl')
// => 'NASA GitHub URL'
```

Tests
-----
```
npm test
```

Licence
-------
```
MIT License

Copyright (c) 2016 Matt Dolan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
