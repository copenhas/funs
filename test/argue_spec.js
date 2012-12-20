var argue = require('../src/argue'),
    expect = require('chai').expect;

var supportedTypes = [];
(function () {
    for(var attr in argue.types) {
        if (argue.types.hasOwnProperty(attr)) {
            supportedTypes.push(attr);
        }
    }
})();

describe('argue', function () {
    it('returns a function', function () {
        var wrapped = argue(function () { });
        expect(wrapped).to.be.a('function');
    });

    it('accepts argument patterns as a string', function () {
        var wrapped = argue('object, number', function () {
        });

        expect(wrapped).to.be.a('function');
    });

    it('requires the last argument to be a function', function () {
        expect(function () {
            argue('object, number');
        }).to.throw(Error);
    });

    it('throws an error if the argument pattern is not supported', function () {
        expect(function () {
            argue('randomCrap$@%', function () { });
        }).to.throw(Error);
    });

    it('throws an error if told to expect no args and is passed some', function () {
        var wrapped = argue(function () { });
        expect(function () {
            wrapped(1);
        }).to.throw(Error);
    });

    describe('types', function () {
        describe('object', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = argue('object', function (o) { 
                    if (o === null) {
                        return false;
                    }
                    return o.test;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when a number is given', function () {
                expect(function () {
                    wrapped(1);
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when you give it an array', function () {
                expect(function () {
                    wrapped([]);
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('works when you give it an object', function () {
                expect(wrapped({ test: 1 })).to.equal(1);
                expect(wrapped({ test: true })).to.be.ok;
            });

        });

        describe('number', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('number', function (n) { 
                    return n;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it an array', function () {
                expect(function () {
                    wrapped([]);
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('throws an error when given a NaN', function () {
                expect(function () {
                    wrapped(Number.NaN);
                }).to.throw(Error);
            });

            it('works when you give it a number', function () {
                expect(wrapped(12)).to.equal(12);
                expect(wrapped(32.8)).to.equal(32.8);
            });
        });

        describe('array', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('array', function (arr) { 
                    return arr.length;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it a number', function () {
                expect(function () {
                    wrapped(12); 
                }).to.throw(Error);

                expect(function () {
                    wrapped(32.8);
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('works when you give it an array', function () {
                expect(wrapped([])).to.equal(0);
                expect(wrapped([1,2])).to.equal(2);
            });
        });

        describe('function', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('function', function (func) { 
                    return func();
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it a number', function () {
                expect(function () {
                    wrapped(12); 
                }).to.throw(Error);

                expect(function () {
                    wrapped(32.8);
                }).to.throw(Error);
            });

            it('throws and error when you give it an array', function () {
                expect(function () {
                    wrapped([]); 
                }).to.throw(Error);

                expect(function () {
                    wrapped([1,2]);
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/)
                }).to.throw(Error);
            });

            it('works when a function is given', function () {
                expect(wrapped(function () { return 42; })).to.equal(42);
            });
        });

        describe('boolean', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('boolean', function (bl) { 
                    return bl;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it a number', function () {
                expect(function () {
                    wrapped(12); 
                }).to.throw(Error);

                expect(function () {
                    wrapped(32.8);
                }).to.throw(Error);
            });

            it('throws and error when you give it an array', function () {
                expect(function () {
                    wrapped([]); 
                }).to.throw(Error);

                expect(function () {
                    wrapped([1,2]);
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('works when a boolean is given', function () {
                expect(wrapped(true)).to.equal(true);
                expect(wrapped(false)).to.equal(false);
            });
        });
        
        describe('date', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('date', function (d) { 
                    return d;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it a number', function () {
                expect(function () {
                    wrapped(12); 
                }).to.throw(Error);

                expect(function () {
                    wrapped(32.8);
                }).to.throw(Error);
            });

            it('throws and error when you give it an array', function () {
                expect(function () {
                    wrapped([]); 
                }).to.throw(Error);

                expect(function () {
                    wrapped([1,2]);
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('works when a date is given', function () {
                var date = new Date();
                expect(wrapped(date)).to.equal(date);
            });
        });

        describe('string', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('string', function (d) { 
                    return d;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when an object is given', function () {
                expect(function () {
                    wrapped({});
                }).to.throw(Error);
            });

            it('throws an error when you give it a number', function () {
                expect(function () {
                    wrapped(12); 
                }).to.throw(Error);

                expect(function () {
                    wrapped(32.8);
                }).to.throw(Error);
            });

            it('throws and error when you give it an array', function () {
                expect(function () {
                    wrapped([]); 
                }).to.throw(Error);

                expect(function () {
                    wrapped([1,2]);
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date())
                }).to.throw(Error);
            });

            it('throws an error with a null', function () {
                expect(function () {
                    wrapped(null)
                }).to.throw(Error);
            });

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('works with a string', function () {
                expect(wrapped('test')).to.equal('test');
                expect(wrapped('')).to.equal('');
            });

        });

        describe('any', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('any', function (d) { 
                    if (typeof d === 'function') {
                        return d();
                    }
                    return d;
                });
            });

            it('works when you give it an object', function () {
                expect(wrapped({ test: 1 })).to.eql({ test: 1 });
                expect(wrapped({ test: true })).to.eql({ test: true });
            });

            it('works when you give it a number', function () {
                expect(wrapped(12)).to.equal(12);
                expect(wrapped(32.8)).to.equal(32.8);
            });

            it('works when you give it an array', function () {
                expect(wrapped([])).to.eql([]);
                expect(wrapped([1,2])).to.eql([1,2]);
            });

            it('works when a function is given', function () {
                expect(wrapped(function () { return 42; })).to.equal(42);
            });

            it('works when a boolean is given', function () {
                expect(wrapped(true)).to.equal(true);
                expect(wrapped(false)).to.equal(false);
            });

            it('works when a date is given', function () {
                var date = new Date();
                expect(wrapped(date)).to.equal(date);
            });

            it('works with a string', function () {
                expect(wrapped('test')).to.equal('test');
            });

            it('works with a null', function () {
                expect(wrapped(null)).to.equal(null);
            });

            it('works when given a regex', function () {
                expect(wrapped(/test/)).to.eql(/test/);
            });
        });

        describe('regex', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = argue('regex', function (o) { 
                    return o;
                });
            });

            it('throws an error when no arguments are given', function () {
                expect(function () {
                    wrapped();
                }).to.throw(Error);
            });

            it('throws an error when a number is given', function () {
                expect(function () {
                    wrapped(1);
                }).to.throw(Error);
            });

            it('throws an error when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('throws an error when you give it an array', function () {
                expect(function () {
                    wrapped([]);
                }).to.throw(Error);
            });

            it('throws an error when a boolean is given', function () {
                expect(function () {
                    wrapped(true);
                }).to.throw(Error);

                expect(function () {
                    wrapped(false);
                }).to.throw(Error);
            });

            it('throws an error when a date is given', function () {
                expect(function () {
                    wrapped(new Date());
                }).to.throw(Error);
            });

            it('throws an error when a string is given', function () {
                expect(function () {
                    wrapped("test");
                }).to.throw(Error);
            });

            it('throws an error when you give it a null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('throws an error when you give it an object', function () {
                expect(function () {
                    wrapped({ test: 1 });
                }).to.throw(Error);
                
                expect(function () {
                    wrapped({ test: true });
                }).to.throw(Error);
            });

            it('works when given a regex', function () {
                expect(wrapped(/test/)).to.eql(/test/);
            });
        });
    });
    
    describe('alternation', function () {
        var wrapped = null;

        beforeEach(function () {
            wrapped = argue('object|number|function', function (n) {
                return typeof n;
            });
        });

        it('throws an error if one of the alternatives is an unknown pattern', function () {
            expect(function () {
                argue('object|randomCrap$@%|number', function () { } );
            }).to.throw(Error);
        });

        it('allows any of the patterns', function () {
            expect(wrapped({})).to.equal('object');
            expect(wrapped(12)).to.equal('number');
            expect(wrapped(function () { })).to.equal('function');
        });

        it('throws an error if none of the patterns match', function () {
            expect(function () {
                wrapped(true);
            }).to.throw(Error);
        });

        it('throws an error if no arguments are given', function () {
            expect(function () {
                wrapped();
            }).to.throw(Error);
        });
    });

    describe('quantifiers', function () {
        describe('?', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('string?', function (str) {
                    return str;
                });
            });

            it('allows the argument to not be given', function () {
                expect(wrapped()).to.equal(undefined);
            });

            it('correctly passes the argument when 1 is given', function () {
                expect(wrapped('test')).to.equal('test');
            });

            it('still relies on the pattern', function () {
                expect(function () {
                    wrapped(42);
                }).to.throw(Error);
            });

            it('still worries about argument count', function () {
                expect(function () {
                    wrapped('test', 42);
                }).to.throw(Error);
            });

            it('optionals can be at the beginning', function () {
                var middle = argue('object?, function', function (opts, callback) {
                    return callback(opts);
                });

                expect(middle(function (opts) { return opts; })).to.equal(undefined);
                expect(middle({}, function (opts) { return opts; })).to.eql({});
            });

            it('optionals can be in the middle', function () {
                var middle = argue('string, object?, function', 
                function (str, opts, callback) {
                    return callback(opts);
                });

                expect(middle('test', function (opts) { return opts; })).to.equal(undefined);
                expect(middle('test', {}, function (opts) { return opts; })).to.eql({});
            });

            supportedTypes.forEach(function (type) {
                it('allows nulls for '+type+' when optional', function () {
                    var nullCheck = argue(type+'?', function (n) { return n; });
                    expect(nullCheck(null)).to.equal(null);
                });
            });

            supportedTypes.forEach(function (type) {
                it('allows undefined for '+type+' when optional', function () {
                    var undefinedCheck = argue(type+'?', function (n) { return n; });
                    expect(undefinedCheck(undefined)).to.equal(undefined);
                });
            });

            it('allows NaN for numbers and turns them into nulls', function () {
                var nanCheck = argue('number?', function (n) { return n; });
                expect(nanCheck(Number.NaN)).to.equal(null);
            });
        });

        describe('+', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('string+', function (str) {
                    return str;
                });
            });

            it('requires an argument to be given', function () {
                expect(function () {
                    wrapped(); 
                }).to.throw(Error);
            });

            it('correctly passes the argument when 1 is given', function () {
                expect(wrapped('test')).to.eql(['test']);
            });

            it('correctly passes the argument when many is given', function () {
                expect(wrapped('test', 'another', 'and', 'another'))
                    .to.eql(['test', 'another', 'and', 'another']);
            });

            it('still relies on the pattern', function () {
                expect(function () {
                    wrapped(42);
                }).to.throw(Error);
            });

            it('still worries about argument count', function () {
                expect(function () {
                    wrapped('test', 42);
                }).to.throw(Error);
            });

            it('does not accept null', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
            });

            it('does not accept undefined', function () {
                expect(function () {
                    wrapped(undefined);
                }).to.throw(Error);
            });

            it('does not accept NaN', function () {
                expect(function () {
                    wrapped(Number.NaN);
                }).to.throw(Error);
            });
        });

        describe('*', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = argue('string*', function (str) {
                    return str;
                });
            });

            it('allows the argument to not be given', function () {
                expect(wrapped()).to.eql([]);
            });

            it('correctly passes the argument when 1 is given', function () {
                expect(wrapped('test')).to.eql(['test']);
            });

            it('correctly passes the argument when many is given', function () {
                expect(wrapped('test', 'another', 'and', 'another'))
                    .to.eql(['test', 'another', 'and', 'another']);
            });

            it('still relies on the pattern', function () {
                expect(function () {
                    wrapped(42);
                }).to.throw(Error);
            });

            it('still worries about argument count', function () {
                expect(function () {
                    wrapped('test', 42);
                }).to.throw(Error);
            });

            supportedTypes.forEach(function (type) {
                it('allows nulls for '+type+' when optional', function () {
                    var nullCheck = argue(type+'?', function (n) { return n; });
                    expect(nullCheck(null)).to.equal(null);
                });
            });

            supportedTypes.forEach(function (type) {
                it('allows undefined for '+type+' when optional', function () {
                    var undefinedCheck = argue(type+'?', function (n) { return n; });
                    expect(undefinedCheck(undefined)).to.equal(undefined);
                });
            });

            it('allows NaN for numbers and turns them into nulls', function () {
                var nanCheck = argue('number?', function (n) { return n; });
                expect(nanCheck(Number.NaN)).to.equal(null);
            });
        });
    });

    describe('dummy examples', function () {
        it('publish msg with optional data', function () {
            var publish = argue('string, any?', function (msg, data) {
                return {
                    msg: msg,
                    data: data
                };
            });

            var results = publish('email.valid', false);
            expect(results).to.eql({
                msg: 'email.valid',
                data: false
            });

            results = publish('document.ready');
            expect(results).to.eql({
                msg: 'document.ready',
                data: undefined
            });
        });

        it('async action with optional options', function () {
            var action = argue('object?, function', function (opts, cb) {
                cb(opts);
            });

            action(function (opts) {
                expect(opts).to.equal(undefined);
            });

            action({ flag: true }, function (opts) {
                expect(opts).to.eql({ flag: true });
            });
        });

        it('sum allowing variable args or an array', function () {
            //NOTE: putting 'number*' first would never let the 'array' match
            var sum = argue('array|number*', function (nums) {
                return nums;
            });

            expect(sum(1, 2, 3)).to.eql([1, 2, 3]);
            expect(sum([1, 2, 3, 4])).to.eql([1, 2, 3, 4]);
        });

        it('router that only needs the first arg', function () {
            var router = argue('string, any*', function (url, etc) {
                if (url === '/test') {
                    return etc[0];
                }
                else {
                    return etc;
                }
            });

            expect(router('/test')).to.equal(undefined);
            expect(router('/test', true)).to.equal(true);
            expect(router('/another', 42, 'something', false))
                   .to.eql([42, 'something', false]);
        });

        it('map that takes any but a mapper that does not', function () {
            //partly to get to 100 tests exactly
            var map = argue('array, function', function (arr, cb) {
                var results = []
                for(var i = 0; i < arr.length; i++) {
                    results.push(cb(arr[i]));
                }
            });

            expect(function () {
                map([2, 'this', 'will', 'blow'], argue('number', function (num) {
                    return num * num;
                }));
            }).to.throw(Error);
        });
    });
});
