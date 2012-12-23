var funs = require('../src/funs'),
    expect = require('chai').expect;

var errorConstructors = [
    Error, 
    TypeError,
    ReferenceError,
    EvalError,
    RangeError,
    SyntaxError,
    URIError
];

var supportedTypes = [];
(function () {
    for(var attr in funs.types) {
        if (funs.types.hasOwnProperty(attr)) {
            supportedTypes.push(attr);
        }
    }
})();

describe('funs', function () {
    it('returns a function', function () {
        var wrapped = funs(function () { });
        expect(wrapped).to.be.a('function');
    });

    it('accepts argument patterns as a string', function () {
        var wrapped = funs('object, number', function () {
        });

        expect(wrapped).to.be.a('function');
    });

    it('requires a function to be given', function () {
        expect(function () {
            funs('object, number');
        }).to.throw(Error);

        expect(function () {
            funs(function () { }, 'object, number');
        }).to.throw(Error);

        expect(function () {
            funs('object, number', function () {});
        }).to.not.throw();
    });

    it('throws an error if the argument pattern is not supported', function () {
        expect(function () {
            funs('randomCrap$@%', function () { });
        }).to.throw(Error);
    });

    it('throws an error if told to expect no args and is passed some', function () {
        var wrapped = funs(function () { });
        expect(function () {
            wrapped(1);
        }).to.throw(Error);
    });

    it('maintains this context', function () {
        var obj = {
            counter: 0,
            attr: false,
            prop: funs('bool?', function (val) {
                this.counter++;
                if (typeof val === 'boolean') {
                    this.attr = val;
                }

                return this.attr;
            })
        };

        expect(obj.prop()).to.equal(false);
        expect(obj.prop(true)).to.equal(true);
        expect(obj.counter).to.equal(2);
    });

    describe('types', function () {
        describe('object', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = funs('object', function (o) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when you give it an object', function () {
                expect(wrapped({ test: 1 })).to.equal(1);
                expect(wrapped({ test: true })).to.be.ok;
            });

        });

        describe('number', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('number', function (n) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when you give it a number', function () {
                expect(wrapped(12)).to.equal(12);
                expect(wrapped(32.8)).to.equal(32.8);
            });
        });

        describe('array', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('array', function (arr) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when you give it an array', function () {
                expect(wrapped([])).to.equal(0);
                expect(wrapped([1,2])).to.equal(2);
            });
        });

        describe('function', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('function', function (func) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when a function is given', function () {
                expect(wrapped(function () { return 42; })).to.equal(42);
            });
        });

        describe('boolean', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('boolean', function (bl) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when a boolean is given', function () {
                expect(wrapped(true)).to.equal(true);
                expect(wrapped(false)).to.equal(false);
            });
        });
        
        describe('date', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('date', function (d) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when a date is given', function () {
                var date = new Date();
                expect(wrapped(date)).to.equal(date);
            });
        });

        describe('string', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('string', function (d) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works with a string', function () {
                expect(wrapped('test')).to.equal('test');
                expect(wrapped('')).to.equal('');
            });

        });

        describe('any', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('any', function (d) { 
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

            it('works when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(wrapped(new err())).is.a('Error');
                });
            });
        });

        describe('regex', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = funs('regex', function (o) { 
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

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when given a regex', function () {
                expect(wrapped(/test/)).to.eql(/test/);
            });
        });

        describe('callback', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = funs('callback', function (o) { 
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

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
                }).to.throw(Error);
            });

            it('throws an when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(function () {
                        wrapped(new err())
                    }).to.throw(Error);
                });
            });

            it('works when a function is given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.not.throw();
            });

            it('callbacks recieve any error the original function throws', function () {
                var errTest = funs('callback', function (callback) {
                    throw new Error('test message');
                });

                errTest(function (err) {
                    expect(err).to.be.a('error');
                    expect(err.message).to.equal('test message');
                });
            });

            it('callbacks do not have to come last', function () {
                var errTest = funs('callback, object?', function (callback, opts) {
                    throw new Error('test message');
                });

                errTest(function (err) {
                    expect(err).to.be.a('error');
                    expect(err.message).to.equal('test message');
                });

                errTest(function (err) {
                    expect(err).to.be.a('error');
                    expect(err.message).to.equal('test message');
                }, { });
            });
        });
        
        describe('error', function () {
            var wrapped = null;
            
            beforeEach(function () {
                wrapped = funs('error', function (o) { 
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

            it('throws an error when given a regex', function () {
                expect(function () {
                    wrapped(/test/);
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

            it('works when given an Error object', function () {
                errorConstructors.forEach(function (err) {
                    expect(wrapped(new err())).is.a('Error');
                });
            });
        });
    });
    
    describe('alternation', function () {
        var wrapped = null;

        beforeEach(function () {
            wrapped = funs('object|number|function', function (n) {
                return typeof n;
            });
        });

        it('throws an error if one of the alternatives is an unknown pattern', function () {
            expect(function () {
                funs('object|randomCrap$@%|number', function () { } );
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

    describe('modifiers', function () {
        describe('^', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('^function', function (o) {
                    return o;
                });
            });

            it('accepts anything besides the type given', function () {
                expect(wrapped({})).to.eql({});
                expect(wrapped(1)).to.equal(1);
                expect(wrapped('test')).to.equal('test');
                expect(wrapped(true)).to.equal(true);
            });

            it('does not match nully values', function () {
                expect(function () {
                    wrapped(null);
                }).to.throw(Error);
                expect(function () {
                    wrapped(undefined);
                }).to.throw(Error);
                expect(function () {
                    wrapped(Number.NaN);
                }).to.throw(Error);
            });

            it('throws an error if the argument is the type given', function () {
                expect(function () {
                    wrapped(function () { });
                }).to.throw(Error);
            });

            it('can be made optional', function () {
                var optional = funs('^function?', function (o) {
                    return o;
                });

                expect(optional()).to.equal(undefined);
                expect(optional(null)).to.equal(null);
            });

            it('works with quantifiers', function () {
                var many = funs('^function+', function (o) {
                    return o;
                });

                expect(many('test', 'another')).to.eql(['test', 'another']);
            });
        });
    });

    describe('quantifiers', function () {
        describe('?', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('string?', function (str) {
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
                var middle = funs('object?, function', function (opts, callback) {
                    return callback(opts);
                });

                expect(middle(function (opts) { return opts; })).to.equal(undefined);
                expect(middle({}, function (opts) { return opts; })).to.eql({});
            });

            it('optionals can be in the middle', function () {
                var middle = funs('string, object?, function', 
                function (str, opts, callback) {
                    return callback(opts);
                });

                expect(middle('test', function (opts) { return opts; })).to.equal(undefined);
                expect(middle('test', {}, function (opts) { return opts; })).to.eql({});
            });

            supportedTypes.forEach(function (type) {
                it('allows nulls for '+type+' when optional', function () {
                    var nullCheck = funs(type+'?', function (n) { return n; });
                    expect(nullCheck(null)).to.equal(null);
                });
            });

            supportedTypes.forEach(function (type) {
                it('allows undefined for '+type+' when optional', function () {
                    var undefinedCheck = funs(type+'?', function (n) { return n; });
                    expect(undefinedCheck(undefined)).to.equal(undefined);
                });
            });

            it('allows NaN for numbers and turns them into nulls', function () {
                var nanCheck = funs('number?', function (n) { return n; });
                expect(nanCheck(Number.NaN)).to.equal(null);
            });
        });

        describe('+', function () {
            var wrapped = null;

            beforeEach(function () {
                wrapped = funs('string+', function (str) {
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

            it('does not work with callbacks', function () {
                expect(function () {
                    funs('callback+', function () { });
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
                wrapped = funs('string*', function (str) {
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

            it('does not work with callbacks', function () {
                expect(function () {
                    funs('callback*', function () { });
                }).to.throw(Error);
            });

            supportedTypes.forEach(function (type) {
                if (type === 'callback') {
                    return;
                } else {
                    it('allows nulls for '+type+' when optional', function () {
                        var nullCheck = funs(type+'*', function (n) { return n; });
                        expect(nullCheck(null)).to.eql([null]);
                    });
                }
            });

            supportedTypes.forEach(function (type) {
                if (type === 'callback') {
                    return;
                } else {
                    it('allows undefined for '+type+' when optional', function () {
                        var undefinedCheck = funs(type+'*', function (n) { return n; });
                        expect(undefinedCheck(undefined)).to.eql([undefined]);
                    });
                }
            });

            it('allows NaN for numbers and turns them into nulls', function () {
                var nanCheck = funs('number*', function (n) { return n; });
                expect(nanCheck(Number.NaN)).to.eql([null]);
            });
        });
    });

    describe('options', function () {
        describe('partial', function () {
            it('has a default value of false', function () {
                var wrappedDef = funs('string', function (str) { return str; });
                var wrappedGiv = funs('string', function (str) { return str; }, 
                                       { partial: false });

                expect(wrappedDef('test')).to.equal(wrappedGiv('test'));

                expect(function () {
                    wrappedDef();
                }).to.throw(Error);;

                expect(function () {
                    wrappedGiv();
                }).to.throw(Error);;

                expect(function () {
                    wrappedDef('test', 'another');
                }).to.throw(Error);;

                expect(function () {
                    wrappedGiv('test', 'another');
                }).to.throw(Error);;
            });

            it('performs partial application when set to true', function () {
                var map = funs('function, array', function (func, arr) {
                    return arr.map(func);
                }, { partial: true });

                var doubler = map(function (num) { return num * 2; });

                expect(doubler([1,2,3])).to.eql([2,4,6]);
            });

            it('can continually do partial application', function () {
                var fiver = funs('number, number, number, number, number',
                                 function (one, two, three, four, five) {
                                     return one + two + three + four + five;
                                 }, { partial: true });

                var partial = fiver;
                for(var i = 0; i < 4; i++) {
                    partial = partial(i);
                }

                expect(partial(4)).to.equal(10);
            });

            it('does not maintains this while doing parital application', function () {
                var obj = {
                    multipler: 3,
                    formula: funs('number, number', function (first, second) {
                        return (first - second) * this.multipler;
                    }, { partial: true })
                };

                var firstGiven = {
                   multipler: 1,
                   formula: obj.formula(2)
                };

                expect(firstGiven.formula(1)).to.equal(1);
            });
        });

        describe('bind', function () {
            it ('requires the partial option to be true', function () {
                expect(function () {
                    funs('number, number', function () { }, { bind: true });
                }).to.throw(Error);

                expect(function () {
                    funs('number, number', function () { }, { partial: true, bind: true });
                }).to.not.throw();
            });

            it('has a default value of false', function () {
                var objDefault = {
                   attr: 2,
                   foo: funs('number, number', function (one, two) { 
                    return one + two + this.attr;
                   }, { partial: true })
                };

                var objGiven = {
                   attr: 1,
                   foo: funs('number, number', function (one, two) { 
                    return one + two + this.attr;
                   }, { partial: true, bind: false })
                };

                var anotherObj = {
                    attr: 3
                };

                // with bind off the partially applied function has whatever context
                // you assign it to
                anotherObj.foo = objDefault.foo(1);
                var defaultValue = anotherObj.foo(2);

                // even though the original objects had different attr values
                // it's the final context that matters
                anotherObj.foo = objGiven.foo(1);
                var givenValue = anotherObj.foo(2);

                expect(defaultValue).to.equal(givenValue);
            });

            it('binds this to the first this context',
            function () {
                var obj = {
                    multipler: 2,
                    formula: funs('number, number', function (one, two) {
                        return (one + two) * this.multipler;
                    }, { partial: true, bind: true })
                };

                var another = {
                    multipler: 10,
                    formula: obj.formula(1)
                };

                expect(another.formula(1)).to.equal(obj.formula(1, 1));
            });
        });
    });

    describe('dummy examples', function () {
        it('publish msg with optional data', function () {
            var publish = funs('string, any?', function (msg, data) {
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
            var action = funs('object?, function', function (opts, cb) {
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
            var sum = funs('array|number*', function (nums) {
                return nums;
            });

            expect(sum(1, 2, 3)).to.eql([1, 2, 3]);
            expect(sum([1, 2, 3, 4])).to.eql([1, 2, 3, 4]);
        });

        it('router that only needs the first arg', function () {
            var router = funs('string, any*', function (url, etc) {
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
            var map = funs('array, function', function (arr, cb) {
                var results = []
                for(var i = 0; i < arr.length; i++) {
                    results.push(cb(arr[i]));
                }
            });

            expect(function () {
                map([2, 'this', 'will', 'blow'], funs('number', function (num) {
                    return num * num;
                }));
            }).to.throw(Error);
        });

        it('could model itself', function () {
            var thisLib = funs('string?, function, object?', function (pattern, func, opts) {

            });

            expect(function () {
                thisLib('pattern', function () { }, { });
                thisLib(function () { }, { });
                thisLib('pattern', function () { });
                thisLib(function () { });
            }).to.not.throw();
        });
        
        it('async request with callback', function () {
            var request = funs('string, callback', function (url, callback) {
                throw new Error('something went wrong');
            });

            request('example.com', function (err, response) {
                expect(err).is.a('error');
            });
        });
    });
});
