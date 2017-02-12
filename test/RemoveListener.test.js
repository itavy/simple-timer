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
  const validateRemoveListenerStub = sandbox.stub(testTimer, 'validateRemoveListener')
    .rejects(validationErrorMessage);
  testTimer.removeListener(fixtures.simpleTimer.removeListener)
    .should.be.rejected
    .then((errorRemoveListener) => {
      expect(errorRemoveListener.name).to.be.equal('SIMPLE_TIMER_REMOVE_LISTENER_ERROR');
      expect(errorRemoveListener.cause().message).to.be.equal(validationErrorMessage);
      expect(validateRemoveListenerStub.callCount).to.be.equal(1);
      expect(validateRemoveListenerStub.getCall(0).args.length).to.be.equal(1);
      expect(validateRemoveListenerStub.getCall(0).args[0])
        .to.be.equal(fixtures.simpleTimer.removeListener);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('should call stop timer after adding the listener', (done) => {
  const stopTimerStub = sandbox.stub(testTimer, 'stopTimer').resolves(true);
  testTimer.listeners.set(fixtures.simpleTimer.removeListener.name, () => true);
  testTimer.removeListener(fixtures.simpleTimer.removeListener)
    .should.be.fulfilled
    .then((removeResponse) => {
      expect(removeResponse).to.be.equal(true);
      expect(stopTimerStub.callCount).to.be.equal(1);
      expect(testTimer.listeners.has(fixtures.simpleTimer.removeListener.name)).to.be.equal(false);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
