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

it('should call validation with provided input', (done) => {
  const validationErrorMessage = 'Error testing validation';
  const validateAddListenerStub = sandbox.stub(testTimer, 'validateAddListener')
    .rejects(validationErrorMessage);
  testTimer.addListener(fixtures.simpleTimer.fakeListener)
    .should.be.rejected
    .then((errorAddListener) => {
      expect(errorAddListener.name).to.be.equal('SIMPLE_TIMER_ADD_LISTENER_ERROR');
      expect(errorAddListener.cause().message).to.be.equal(validationErrorMessage);
      expect(validateAddListenerStub.callCount).to.be.equal(1);
      expect(validateAddListenerStub.getCall(0).args.length).to.be.equal(1);
      expect(validateAddListenerStub.getCall(0).args[0])
        .to.be.equal(fixtures.simpleTimer.fakeListener);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should call start timer after adding the listener', (done) => {
  const startTimerStub = sandbox.stub(testTimer, 'startTimer').resolves(true);
  testTimer.addListener(fixtures.simpleTimer.fakeListener)
    .should.be.fulfilled
    .then((addResponse) => {
      expect(addResponse).to.be.equal(true);
      expect(startTimerStub.callCount).to.be.equal(1);
      expect(testTimer.listeners.has(fixtures.simpleTimer.fakeListener.name)).to.be.equal(true);
      expect(testTimer.listeners.get(fixtures.simpleTimer.fakeListener.name))
        .to.be.equal(fixtures.simpleTimer.fakeListener.listener);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
