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

    return function (position, argsToParse, parsedArgs) {
        var argType = getType(argsToParse[position]);

        if (forTypes.indexOf(argType) > -1) {
            parsedArgs.push(argsToParse[position]);
            return 1;
        }

        throw new Error('argue: was expecting an ' + forType + ' at position ' + 
                        position + ' but got an ' + argType);
    };
}

var argue = function () {
    var patterns = argToArray(arguments),
        func = patterns.pop();

    if (typeof func !== 'function') {
        throw new Error('argue: a function must be provided as the last argument');
    }

    var argParsers = [];
    patterns.forEach(function (pattern) {
        var parser = argue.types[pattern];
        if (!parser) {
            throw new Error('argue: invalid arguement pattern, "' + 
                            pattern + '" is an unknown type');
        }

        argParsers.push(parser);
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
    'number': typeParser('number')
};

module.exports = argue;
