function argToArray(args) {
    return Array.prototype.slice.call(args);
}

function getType(o) {
    var rawTypeString = Object.prototype.toString.call(o);
    var typeString = rawTypeString.replace('[object ', '')
                                  .replace(']', '')
                                  .toLowerCase();

    return typeString;
}

function typeParser(/*forType, ... */) {
    var forTypes = argToArray(arguments);

    var parser = function (position, argsToParse, parsedArgs) {
        var argType = getType(argsToParse[position]);

        if (forTypes.indexOf(argType) > -1) {
            parsedArgs.push(argsToParse[position]);
            return 1;
        }

        if (forTypes.indexOf('any') > -1) { 
            parsedArgs.push(argsToParse[position]);
            return 1;
        }

        throw new Error('argue: was expecting an ' + forTypes.join(', ') + ' at position ' + 
                        position + ' but got an ' + argType);
    };

    parser.name = forTypes.join(', ');
    return parser;
}

function quantifierParser(begin, end) {
    var maxNumber = end || Number.MAX_VALUE;

    return function (parser) {
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

            throw new Error("argue: was expected " + quantifier.name + 
                            " starting at position " + position);
        };

        quantifier.quantifier = true;
        quantifier.name = begin + " to " + (end || "many") + " of " + parser.name;
        return quantifier;
    };
}

function alternation(parsers) {
    var name = parsers.map(function (parser) { return parser.name; }).join(' OR ');

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
                        name + ' at position ' + position);
    };

    alt.name = name;
    return alt;
}

var argue = function () {
    var patterns = argToArray(arguments),
        func = patterns.pop();

    if (typeof func !== 'function') {
        throw new Error('argue: a function must be provided as the last argument');
    }

    var argParsers = [];
    patterns.forEach(function (pattern) {
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

        return func.apply(this, parsedArgs);
    };
};


argue.types = {
    'object': typeParser('object', 'null'),
    'number': typeParser('number'),
    'array': typeParser('array'),
    'function': typeParser('function'),
    'boolean': typeParser('boolean'),
    'date': typeParser('date'),
    'string': typeParser('string', 'null'),
    'any': typeParser('any')
};

argue.quantifiers = {
    '?': quantifierParser(0, 1),
    '+': quantifierParser(1),
    '*': quantifierParser(0)
};

module.exports = argue;
