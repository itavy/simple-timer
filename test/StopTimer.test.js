'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const sinon = require('@itavy/test-utilities').getSinon();
const simpleTimerLib = require('../lib');
const fixtures = require('./Fixtures');

const sandbox = sinon.sandbox.create();
let clearIntervalStub;
let testTimer = null;

beforeEach((done) => {
  clearIntervalStub = sandbox.stub(global, 'clearInterval').returns(true);
  testTimer = simpleTimerLib.getNewSimpleTimer(fixtures.simpleTimer.testSkipRunning);
  done();
});

afterEach((done) => {
  sandbox.restore();
  testTimer = null;
  clearIntervalStub = null;
  done();
});

it('Should not clear timeout if no timer is set', (done) => {
  testTimer.stopTimer()
    .should.be.fulfilled
    .then(() => {
      expect(clearIntervalStub.callCount).to.be.equal(0);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should not clear timeout if there are listeners', (done) => {
  testTimer.timer.id = fixtures.simpleTimer.idInterval;
  testTimer.listeners.set(fixtures.simpleTimer.fakeListener.name,
    fixtures.simpleTimer.fakeListener.listener);
  testTimer.stopTimer()
    .should.be.fulfilled
    .then(() => {
      expect(clearIntervalStub.callCount).to.be.equal(0);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should call clearTimeout with expected parameters', (done) => {
  testTimer.timer.id = fixtures.simpleTimer.idInterval;
  testTimer.stopTimer()
    .should.be.fulfilled
    .then(() => {
      expect(clearIntervalStub.callCount).to.be.equal(1);
      expect(clearIntervalStub.getCall(0).args.length).to.be.equal(1);
      expect(clearIntervalStub.getCall(0).args[0]).to.be.equal(fixtures.simpleTimer.idInterval);
      expect(testTimer.timer.id).to.be.equal(null);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
