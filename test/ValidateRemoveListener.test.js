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
  testTimer.validateRemoveListener({})
    .should.be.rejected
    .then((errorValidateRemoveListener) => {
      expect(errorValidateRemoveListener.name).to.be.equal('SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER');
      expect(errorValidateRemoveListener.cause().name).to.be.equal('SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST');

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should reject for unknown listener name', (done) => {
  testTimer.listeners.set(fixtures.simpleTimer.fakeListener.name,
    fixtures.simpleTimer.fakeListener.listener);
  testTimer.validateRemoveListener(fixtures.simpleTimer.fakeListener2)
    .should.be.rejected
    .then((errorValidateRemoveListener) => {
      expect(errorValidateRemoveListener.name).to.be.equal('SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER');
      expect(errorValidateRemoveListener.cause().name).to.be.equal('SIMPLE_TIMER_UNKNOWN_LISTENER_NAME');

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should resolve with input for known listener name', (done) => {
  testTimer.listeners.set(fixtures.simpleTimer.fakeListener.name,
    fixtures.simpleTimer.fakeListener.listener);
  testTimer.validateRemoveListener(fixtures.simpleTimer.fakeListener)
    .should.be.fulfilled
    .then((validatedResponse) => {
      expect(validatedResponse).to.be.equal(fixtures.simpleTimer.fakeListener);

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
