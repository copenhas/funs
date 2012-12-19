var argue = require('../src/argue'),
    expect = require('chai').expect;

describe('argue', function () {
    it('returns a function', function () {
        var wrapped = argue(function () { });
        expect(wrapped).to.be.a('function');
    });

    it('accepts variable amount of argument patterns', function () {
        var wrapped = argue('object', 'number', function () {
        });

        expect(wrapped).to.be.a('function');
    });

    it('requires the last argument to be a function', function () {
        expect(function () {
            argue('object', 'number');
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

    describe('basic type patterns', function () {
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

            it('works when you give it an object', function () {
                expect(wrapped({ test: 1 })).to.equal(1);
                expect(wrapped({ test: true })).to.be.ok;
            });

            it('works when you give it a null', function () {
                expect(wrapped(null)).to.not.be.ok;
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

            it('works when a date is given', function () {
                var date = new Date();
                expect(wrapped(date)).to.equal(date);
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
        describe('? makes the argument optional', function () {

        });

        describe('+ makes the pattern 1 to many arguments', function () {

        });

        describe('* makes the pattern 0 to many arguments', function () {

        });
    });
});
