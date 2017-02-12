'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const sinon = require('@itavy/test-utilities').getSinon();
const simpleTimerLib = require('../lib');
const fixtures = require('./Fixtures');

const sandbox = sinon.sandbox.create();
let testTimer = null;

beforeEach((done) => {
  testTimer = simpleTimerLib.getNewSimpleTimer(fixtures.simpleTimer.testSkipRunning);
  done();
});

afterEach((done) => {
  sandbox.restore();
  testTimer = null;
  done();
});

it('should reject for missing name', (done) => {
  testTimer.validateAddListener({})
    .should.be.rejected
    .then((errorValidateAddListener) => {
      expect(errorValidateAddListener.name).to.be.equal('SIMPLE_TIMER_VALIDATE_ADD_LISTENER');
      expect(errorValidateAddListener.cause().name).to.be.equal('SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST');

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should reject for invalid listener', (done) => {
  testTimer.validateAddListener({
    name:     'testListener',
    listener: {},
  })
    .should.be.rejected
    .then((errorValidateAddListener) => {
      expect(errorValidateAddListener.name).to.be.equal('SIMPLE_TIMER_VALIDATE_ADD_LISTENER');
      expect(errorValidateAddListener.cause().name).to.be.equal('SIMPLE_TIMER_INVALID_ADD_LISTENER');

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should reject for duplicate listener name', (done) => {
  testTimer.listeners.set(fixtures.simpleTimer.fakeListener.name,
    fixtures.simpleTimer.fakeListener.listener);
  testTimer.validateAddListener({
    name:     fixtures.simpleTimer.fakeListener.name,
    listener: () => null,
  })
    .should.be.rejected
    .then((errorValidateAddListener) => {
      expect(errorValidateAddListener.name).to.be.equal('SIMPLE_TIMER_VALIDATE_ADD_LISTENER');
      expect(errorValidateAddListener.cause().name).to.be.equal('SIMPLE_TIMER_DUPLICATE_LISTENER_NAME');
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});


it('should validate a good request', (done) => {
  const validateRequest = {
    name:     fixtures.simpleTimer.fakeListener.name,
    listener: fixtures.simpleTimer.fakeListener.listener,
  };
  testTimer.validateAddListener(validateRequest)
    .should.be.fulfilled
    .then((validatedResponse) => {
      expect(validatedResponse).to.be.equal(validateRequest);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
