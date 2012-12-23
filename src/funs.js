(function () {
    var global = this;

    function createOptions(defaults, user) {
        var opts = Object.create(defaults);

        for(var attr in user) {
            if (user.hasOwnProperty(attr)) {
                opts[attr] = user[attr];
            }
        }

        return opts;
    }

    function argToArray(args) {
        if (getType(args) !== 'arguments') {
            throw new Error('funs: funs.toArray() only accepts Arguments objects');
        }
        return Array.prototype.slice.call(args);
    }

    function getType(o) {
        var rawTypeString = Object.prototype.toString.call(o);
        var typeString = rawTypeString.replace('[object ', '')
                                      .replace(']', '')
                                      .toLowerCase();

        if (typeString === 'number' && Number.isNaN(o)) {
            return 'nan';
        }

        if (o instanceof Error) {
            return 'error';
        }

        if (typeString.indexOf('html') === 0) {
            return 'dom';
        }

        return typeString;
    }

    function typeParser(forType) {
        var parser = function (position, argsToParse, parsedArgs) {
            var argType = getType(argsToParse[position]);

            if (forType === argType) {
                parsedArgs.push(argsToParse[position]);
                return 1;
            }

            if (forType === 'any') { 
                parsedArgs.push(argsToParse[position]);
                return 1;
            }

            throw new Error('funs: was expecting an ' + parser.desc + ' at position ' + 
                            position + ' but got an ' + argType);
        };

        parser.desc = forType;
        parser.type = forType;
        return parser;
    }

    function callbackParser() {
        var parser = function (position, argsToParse, parsedArgs) {
            try {
                return funs.types['function'](position, argsToParse, parsedArgs);
            }
            catch (e) {
                if (e.message.indexOf('funs:') === 0) {
                    throw new Error('funs: was expecting a callback at position ' + position +
                                    ' but got a ' + getType(argsToParse[position]));
                }

                throw e;
            }
        };

        parser.desc = 'callback';
        parser.type = 'callback';
        return parser;
    }

    function besidesParser() {
        return function (parser) {
            var modifier = function (position, argsToParse, parsedToArgs) {
                var parserMatchedArgs = [];
                try {
                    parser(position, argsToParse, parserMatchedArgs);
                } catch (e) {
                    if (e.message.indexOf('funs:') !== 0) {
                        throw e;
                    }

                    var argType = getType(argsToParse[position]);
                    if (['null', 'undefined', 'nan'].indexOf(argType) === -1 ){
                        parsedToArgs.push(argsToParse[position]);
                        return 1;
                    }
                }

                throw new Error('funs: expected ' + modifier.desc + ' at position ' + position);
            };

            modifier.desc = 'anything besides ' + parser.desc;
            return modifier;
        };
    }

    function quantifierParser(begin, end) {
        var maxNumber = end || Number.MAX_VALUE;

        return function (parser) {
            if (maxNumber > 1 && parser.type === 'callback') {
                throw new Error('funs: callback has special meaning and ' +
                                'there may only be a max of 1');
            }

            var quantifier = function (position, argsToParse, parsedToArgs) {
                var currentPosition = position,
                    consumedTotal = 0,
                    consumedStep = 0,
                    quantifierParsedArgs = [];

                while (currentPosition < argsToParse.length && 
                       maxNumber > quantifierParsedArgs.length) {

                    consumedStep = 0;

                    try {
                        consumedStep = parser(currentPosition, argsToParse, quantifierParsedArgs);
                        currentPosition += consumedStep;
                        consumedTotal += consumedStep;
                    } catch (e) {
                        if (e.message.indexOf('funs:') !== 0) {
                            throw e;
                        }

                        // optional parameters accept nully values
                        if (begin === 0 && consumedTotal === 0) {
                            var currentArgType = getType(argsToParse[currentPosition]);
                            if (currentArgType === 'null' || currentArgType === 'nan') {
                                quantifierParsedArgs.push(null);
                                currentPosition += 1;
                                consumedTotal += 1;
                            } else if (currentArgType === 'undefined') {
                                quantifierParsedArgs.push(undefined);
                                currentPosition += 1;
                                consumedTotal += 1;
                            }
                        }

                        break;
                    }
                }

                if (consumedTotal >= begin && consumedTotal <= maxNumber) {
                    if (maxNumber === 1 && quantifierParsedArgs.length === 1) {
                        //they only wanted 1 so give it to them
                        parsedToArgs.push(quantifierParsedArgs[0]);
                    } else if (begin === 0 && maxNumber === 1 && 
                               quantifierParsedArgs.length === 0) {
                        //optional arg just wasn't given
                        parsedToArgs.push(undefined);
                    } else {
                        parsedToArgs.push(quantifierParsedArgs);
                    }
                    return consumedTotal;
                }

                throw new Error("funs: was expected " + quantifier.desc + 
                                " starting at position " + position);
            };

            quantifier.quantifier = true;
            quantifier.desc = begin + " to " + (end || "many") + " of " + parser.desc;
            return quantifier;
        };
    }

    function alternation(parsers) {
        var desc = parsers.map(function (parser) { return parser.desc; }).join(' OR ');

        var alt = function (position, argsToParse, parsedToArgs) {
            for(var i = 0; i < parsers.length; i++) {
                try {
                    //return on the first one to succeed
                    return parsers[i](position, argsToParse, parsedToArgs);
                } catch (e) {
                    if (e.message.indexOf('funs:') !== 0) {
                        throw e;
                    }
                }
            }

            throw new Error('funs: none of the alternatives matched, was expecting ' + 
                            desc + ' at position ' + position);
        };

        alt.desc = desc;
        return alt;
    }

    function createWrappedFunction (opts, argParsers, callbackIndex, func, levels) {
        var startsWithAQuantifier = argParsers[0] && argParsers[0].quantifier,
            hasCallback = callbackIndex > -1;

        return function () {
            var argsPassedIn = argToArray(arguments);

            var parsedArgs = [],
                position = 0,
                currentParser,
                i;

            if (levels === 0 && opts.bind) {
                func = func.bind(this);
            }

            try {
                for(i = 0; i < argParsers.length; i++) {
                    currentParser = argParsers[i];
                    position += currentParser(position, argsPassedIn, parsedArgs);
                }
            } catch (e) {
                if (e.message.indexOf('funs:') === 0 && 
                        opts.partial && i < argParsers.length) {
                    return createWrappedFunction(
                                opts, argParsers.slice(i), callbackIndex - i, 
                                function () {
                                    var theRest = argToArray(arguments);
                                    return func.apply(this, parsedArgs.concat(theRest));
                                }, levels++);
                }

                throw e;
            }

            if (parsedArgs.length === 0 && argsPassedIn.length > 0) {
                throw new Error('funs: incorrect argument combination, all arguments ' +
                                'were optional but none of them matched the ones given');
            }

            if (position < argsPassedIn.length) {
                throw new Error('funs: incorrect argument combination, all arguments ' +
                                'were not able to be parsed');
            }

            try{
                return func.apply(this, parsedArgs);
            } catch (err) {
                var callbackSlotArg = parsedArgs[callbackIndex];
                if (hasCallback && (typeof callbackSlotArg === 'function')) {
                    return callbackSlotArg(err);
                }

                throw err;
            }
        };
    }

    var defaultOpts = {
        partial: false,
        bind: false
    };

    var funs = function (argPattern, func, opts) {
        var patterns = [];

        if (typeof argPattern === 'function') {
            opts = func;
            func = argPattern;
        }
        else {
            patterns = argPattern.split(',').map(function (p) { return p.trim(); });
        }

        if (typeof func !== 'function') {
            throw new Error('funs: a function must be provided.');
        }

        opts = opts || {};

        if (typeof opts !== 'object') {
            throw new Error('funs: final argument is an optional hash of options.');
        }

        opts = createOptions(defaultOpts, opts);
        var argParsers = [],
            hasCallback = false,
            callbackIndex = -1;

        if (opts.bind && !opts.partial) {
            throw new Error('funs: bind option can not be turned on without partial');
        }

        patterns.forEach(function (pattern, index) {
            var tokens = pattern.split('|');
            var parsers = tokens.map(function (token) {
                var firstChar = token.charAt(0),
                    lastChar = token.charAt(token.length - 1),
                    type = token,
                    quantifier = null,
                    modifier = null,
                    parser = null;

                if (funs.modifiers[firstChar]) {
                    type = type.substr(1, type.length);
                    modifier = funs.modifiers[firstChar];
                }

                if (funs.quantifiers[lastChar]) {
                    type = type.substr(0, type.length - 1);
                    quantifier = funs.quantifiers[lastChar];
                }

                parser = funs.types[type];
                if (!parser) {
                    throw new Error('funs: invalid arguement pattern, "' + 
                                    type + '" is an unknown type');
                }

                if (parser.type === 'callback' && !hasCallback) {
                    hasCallback = true;
                    callbackIndex = index;
                } else if (parser.type === 'callback' && hasCallback) {
                    throw new Error('funs: callbacks have special meaning and ' +
                                    'only one callback is allowed in a pattern. One was ' +
                                    'given as this ' + callbackIndex + ' argument pattern');
                }

                if (modifier) {
                    parser = modifier(parser);
                }

                if (quantifier) {
                    return quantifier(parser);
                }

                return parser;
            });

            if (parsers.length === 1) {
                argParsers.push(parsers[0]);
            }
            else {
                argParsers.push(alternation(parsers));
            }
        });

        return createWrappedFunction(opts, argParsers, callbackIndex, func, 0);
    };

    funs.types = {
        'object': typeParser('object'),
        'number': typeParser('number'),
        'array': typeParser('array'),
        'function': typeParser('function'),
        'boolean': typeParser('boolean'),
        'bool': typeParser('boolean'),
        'date': typeParser('date'),
        'string': typeParser('string'),
        'regexp': typeParser('regexp'),
        'regex': typeParser('regexp'),
        'callback': callbackParser(),
        'dom': typeParser('dom'),
        'error': typeParser('error'),
        'any': typeParser('any')
    };

    funs.modifiers = {
        '^': besidesParser()
    };

    funs.quantifiers = {
        '?': quantifierParser(0, 1),
        '+': quantifierParser(1),
        '*': quantifierParser(0)
    };

    funs.toArray = argToArray;
    funs.getType = getType;

    if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
        //commonjs
        module.exports = funs;
    } else if (typeof define === 'function') {
        //amd
        define([], function () {
            return funs;
        });
    } else {
        //plain
        global.funs = funs;
    }
})();
