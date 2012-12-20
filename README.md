# argue
A friendly somewhat familiar argument parser to make great APIs easier

Sort of like a simpler regular expression matching for arguments and types instead of characters.

## Install
Currently not in the NPM register. You want to play around be my guest. 
Clone the repo and do a `make init` in the project directory.
After that use the `npm link` to link it into a project to test it out.

## Usage
    var newWrappedFunction = argue(['<arg pattern>, ...',] <your function> [, opts]);
You'll probably want the same number of argument patterns as you do arguments to your function.
Also the wrapped function should pass the `this` context correctly, so go ahead and use it to build methods if you like.
  
### Argument Patterns
Each pattern is a type matcher with optionally a quantifier and optionally an alternative pattern.

Here's a few examples:
* `'object'` - will match an argument that is an object or null
* `'function*'` - will match a series of arguments that are functions
* `'number|string'` - will try to match a number and if that fails will try to match a string
  
Here's what's supported:
#### Types
* `'object'` - matches an object or null
* `'number'` - matches any number
* `'boolean'` - matches `true` or `false`
* `'bool'` - boolean alias
* `'string'` - matches a string or null
* `'date'` - matches any `Date` object
* `'function'` - matches any function
* `'array'` - matches any `Array` object
* `'regexp'` - matches any `Regex` object
* `'regex'` - regexp alias
* `'any'` - matches any type

#### Quantifiers
Quantifiers always go at the end of a type (sorry no grouping or optional alternations supported)

* `'?'` - matches 0 to 1, effectively an optional argument. The argument will be passed into your function as an `undefined` or the actual value. Matches nully values (null, undefined, and NaN). NaN value will be turned into a null. Optional arguments do not have to be last so long as all patterns can successfully match. For example, `argue('number', 'object?', 'function', func);` would work while `argue('number', 'function?', 'function', func);` would not.
* `'*'` - matches 0 to many, argument will be passed into your function as an array
* `'+'` - matches 1 to many, argument will be passed into your function as an array. Matches nully values (null, undefined, and NaN). NaN value will be turned into a null. 

#### Alternation
Alternations attempt to match left to right and take the first one to succeed. Be **careful** on your ordering!
`'number*|array'` would never give the `'array'` pattern a chance to match!

`'<pattern>|<pattern>[|<pattern>...]'`
