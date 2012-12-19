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

        throw new Error('argue: was expecting an ' + forTypes.join(', ') + ' at position ' + 
                        position + ' but got an ' + argType);
    };

    parser.name = forTypes.join(', ');
    return parser;
}

function alternation(parsers) {
    var name = "";

    name = parsers.map(function (parser) { return parser.name; }).join(' OR ');

    var parser = function (position, argsToParse, parsedToArgs) {
        for(var i = 0; i < parser.length; i++) {
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

    parser.name = name;
    return parser;
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
            var parser = argue.types[token];
            if (!parser) {
                throw new Error('argue: invalid arguement pattern, "' + 
                                token + '" is an unknown type');
            }

            return parser;
        });

        if (parsers.length === 0) {
            argParsers.push(parsers[0]);
        }
        else {
            argParsers.push(alternation(parsers));
        }
    });

    return function () {
        var argsPassedIn = argToArray(arguments);
        if (argsPassedIn.length !== patterns.length) {
            throw new Error('argue: incorrect number of arguments, was expecting ' + 
                            patterns.length + ' but recieved ' + argsPassedIn.length);
        }

        var parsedArgs = [],
            position = 0;

        argParsers.forEach(function (parser) {
            position += parser(position, argsPassedIn, parsedArgs);
        });

        return func.apply(this, parsedArgs);
    };
};


argue.types = {
    'object': typeParser('object', 'null'),
    'number': typeParser('number'),
    'array': typeParser('array'),
    'function': typeParser('function'),
    'boolean': typeParser('boolean')
};

module.exports = argue;
