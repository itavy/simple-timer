'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const sinon = require('@itavy/test-utilities').getSinon();
const simpleTimerLib = require('../lib');
const fixtures = require('./Fixtures');

const sandbox = sinon.sandbox.create();
let setIntervalStub;
let testTimer = null;

beforeEach((done) => {
  setIntervalStub = sandbox.stub(global, 'setInterval').returns(fixtures.simpleTimer.idInterval);
  testTimer = simpleTimerLib.getNewSimpleTimer(fixtures.simpleTimer.testSkipRunning);
  done();
});

afterEach((done) => {
  sandbox.restore();
  testTimer = null;
  setIntervalStub = null;
  done();
});

it('Should not start timer if thereis another interval started', (done) => {
  testTimer.timer.id = 123456;
  testTimer.startTimer()
    .should.be.fulfilled
    .then(() => {
      expect(setIntervalStub.callCount).to.be.equal(0);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should not start timer if there are no listeners', (done) => {
  testTimer.startTimer()
    .should.be.fulfilled
    .then(() => {
      expect(setIntervalStub.callCount).to.be.equal(0);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should call setInterval with expected parameters', (done) => {
  testTimer.listeners.set(fixtures.simpleTimer.fakeListener.name,
    fixtures.simpleTimer.fakeListener.listener);
  testTimer.startTimer()
    .should.be.fulfilled
    .then(() => {
      expect(setIntervalStub.callCount).to.be.equal(1);
      expect(setIntervalStub.getCall(0).args.length).to.be.equal(2);
      expect(setIntervalStub.getCall(0).args[0]).to.be.an.instanceof(Function);
      expect(setIntervalStub.getCall(0).args[1]).to.be.equal(testTimer.options.timerStep);
      expect(testTimer.timer.id).to.be.equal(fixtures.simpleTimer.idInterval);
      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
