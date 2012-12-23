# funs
A friendly somewhat familiar argument parser to make great APIs easier.

It handles function argument specs/patterns and sanitizes them a little. Sort of like a simpler regular expression matching for arguments and types instead of strings and characters. Which means less argument parsing for you just because you want an optional argument or require something to be a function.

[![Build Status](https://travis-ci.org/copenhas/funs.png)](https://travis-ci.org/copenhas/funs)

## Install
`npm install funs`

You want to play around be my guest. Clone the repo and do a `npm install` in the project directory.

## Usage
It supports CommonJs, AMD, and plain global module patterns, so get ahold of the `funs` function one of those ways. Note, that it picks the first one it detects to expose itself (CommonJs, AMD, or global).

Assuming CommonJs the usage is this:

    var funs = require('funs');
    var newWrappedFunction = funs(['<arg pattern>, ...',] <your function> [, opts]);
You'll probably want the same number of argument patterns as you do arguments to your function.
Also the wrapped function should pass the `this` context correctly, so go ahead and use it to build methods if you like.
  
### Argument Patterns
Each pattern is a type matcher with optionally a quantifier and optionally an alternative pattern. For examples check out the `dummy examples` section of the `funs_spec`.

Here's a few examples:
* `'object'` - will match an argument that is an object
* `'function*'` - will match a series of arguments that are functions
* `'number|string'` - will try to match a number and if that fails will try to match a string
  
Here's what's supported:
#### Types
* `'object'` - matches an object but not null (use a 0 base quantifier if you want nully values)
* `'number'` - matches any number but not NaN (use a 0 base quantifier if you want nully values)
* `'boolean'` - matches `true` or `false`
* `'bool'` - boolean alias
* `'string'` - matches a string but not null (use a 0 base quantifier if you want nully values)
* `'date'` - matches any `Date` object
* `'function'` - matches any function
* `'array'` - matches any `Array` object
* `'regexp'` - matches any `Regex` object
* `'regex'` - regexp alias
* `'callback'` - matches a function but with special meaning. Only one allowed at most and if available will automatically be passed the error your function throws. Argument parser errors will still throw normally just as `path.exists(true, callback);` would in node.
* `'error'` - matches an object created with one of the builtin error constructors: ` Error, TypeError, ReferenceError, EvalError, RangeError, SyntaxError, URIError `
* `'dom'` - should match any of the native DOM objects such as `HTMLDivElement` or `HTMLInputElement` (I think)
* `'any'` - matches any type

#### Modifiers
Modifiers come at the beginning of a type pattern and take effect before quantifiers (`'^function?'` would be anything but a `'function'` and it's optional). Meaning they can still be made optional and accept many arguments.

* `'^'` - matches anything but the type specified.

#### Quantifiers
Quantifiers always go at the end of a type (sorry no grouping or optional alternations supported)

* `'?'` - matches 0 to 1, effectively an optional argument. The argument will be passed into your function as an `undefined` or the actual value. Matches nully values (null, undefined, and NaN). NaN value will be turned into a null. Optional arguments do not have to be last so long as all patterns can successfully match. For example, `funs('number', 'object?', 'function', func);` would work while `funs('number', 'function?', 'function', func);` would not.
* `'*'` - matches 0 to many, argument will be passed into your function as an array. Matches nully values (null, undefined, and NaN). NaN value will be turned into a null. 
* `'+'` - matches 1 to many, argument will be passed into your function as an array. 

#### Alternation
Alternations attempt to match left to right and take the first one to succeed. Be **careful** on your ordering!
`'number*|array'` would never give the `'array'` pattern a chance to match!

`'<pattern>|<pattern>[|<pattern>...]'`


### Options
For examples I suggest checking out the options section of the `funs_spec`.

* `'partial'` - `true` or `false` flag that enables the ability to incrementally apply arguments through partial application (or currying). When enabled, if not enough arguments have been given a new function will be returns that accepts the remaining arguments.
* `'bind'` - `true` or `false` but requires `'partial'` to be enabled. The first time the function is partially applied it will bind itself that that context. 
