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

            it('works when you give it a number', function () {
                expect(wrapped(12)).to.equal(12);
                expect(wrapped(32.8)).to.equal(32.8);
            });
        });
    });
});
