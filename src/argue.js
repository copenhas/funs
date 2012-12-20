function argToArray(args) {
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

        throw new Error('argue: was expecting an ' + parser.desc + ' at position ' + 
                        position + ' but got an ' + argType);
    };

    parser.desc = forType;
    parser.type = forType;
    return parser;
}

function callbackParser() {
    var parser = function (position, argsToParse, parsedArgs) {
        try {
            return argue.types['function'](position, argsToParse, parsedArgs);
        }
        catch (e) {
            if (e.message.indexOf('argue:') === 0) {
                throw new Error('argue: was expecting a callback at position ' + position +
                                ' but got a ' + getType(argsToParse[position]));
            }

            throw e;
        }
    };

    parser.desc = 'callback';
    parser.type = 'callback';
    return parser;
}

function quantifierParser(begin, end) {
    var maxNumber = end || Number.MAX_VALUE;


    return function (parser) {
        if (maxNumber > 1 && parser.type === 'callback') {
            throw new Error('argue: callback has special meaning and ' +
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
                    if (e.message.indexOf('argue:') !== 0) {
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
                } else if (begin === 0 && maxNumber === 1 && quantifierParsedArgs.length === 0) {
                    //optional arg just wasn't given
                    parsedToArgs.push(undefined);
                } else {
                    parsedToArgs.push(quantifierParsedArgs);
                }
                return consumedTotal;
            }

            throw new Error("argue: was expected " + quantifier.desc + 
                            " starting at position " + position);
        };

        quantifier.quantifier = true;
        quantifier.min = begin;
        quantifier.max = maxNumber;
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
                if (e.message.indexOf('argue:') !== 0) {
                    throw e;
                }
            }
        }

        throw new Error('argue: none of the alternatives matched, was expecting ' + 
                        desc + ' at position ' + position);
    };

    alt.desc = desc;
    return alt;
}

var argue = function (argPattern, func, opts) {
    opts = opts || {};
    var patterns = [];

    if (typeof argPattern === 'function') {
        func = argPattern;
    }
    else {
        patterns = argPattern.split(',').map(function (p) { return p.trim(); });
    }

    if (typeof func !== 'function') {
        throw new Error('argue: a function must be provided.');
    }

    var argParsers = [],
        hasCallback = false,
        callbackIndex = -1;

    patterns.forEach(function (pattern, index) {
        var tokens = pattern.split('|');
        var parsers = tokens.map(function (token) {
            var lastChar = token.charAt(token.length - 1),
                type = token,
                quantifier = null,
                parser = null;

            if (argue.quantifiers[lastChar]) {
                type = token.substr(0, token.length - 1);
                quantifier = argue.quantifiers[lastChar];
            }

            parser = argue.types[type];
            if (!parser) {
                throw new Error('argue: invalid arguement pattern, "' + 
                                type + '" is an unknown type');
            }

            if (parser.type === 'callback' && !hasCallback) {
                hasCallback = true;
                callbackIndex = index;
            } else if (parser.type === 'callback' && hasCallback) {
                throw new Error('argue: callbacks have special meaning and ' +
                                'only one callback is allowed in a pattern. One was given as ' +
                                'this ' + callbackIndex + ' argument pattern');
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

    var startsWithAQuantifier = argParsers[0] && argParsers[0].quantifier;

    return function () {
        var argsPassedIn = argToArray(arguments);

        var parsedArgs = [],
            position = 0,
            currentParser;

        for(var i = 0; i < argParsers.length; i++) {
            currentParser = argParsers[i];
            position += currentParser(position, argsPassedIn, parsedArgs);
        }

        if (parsedArgs.length === 0 && argsPassedIn.length > 0) {
            throw new Error('argue: incorrect argument combination, all arguments ' +
                            'were optional but none of them matched the ones given');
        }

        if (position < argsPassedIn.length) {
            throw new Error('argue: incorrect argument combination, all arguments ' +
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
};


argue.types = {
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
    'any': typeParser('any')
};

argue.quantifiers = {
    '?': quantifierParser(0, 1),
    '+': quantifierParser(1),
    '*': quantifierParser(0)
};

module.exports = argue;
