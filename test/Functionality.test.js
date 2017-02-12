'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const sinon = require('@itavy/test-utilities').getSinon();
const simpleTimerLib = require('../lib');
const fixtures = require('./Fixtures');

const sandbox = sinon.sandbox.create();
let testTimer = null;
let testClock = null;

beforeEach((done) => {
  testClock = sandbox.useFakeTimers(Date.now());
  testTimer = simpleTimerLib.getNewSimpleTimer(fixtures.simpleTimer.testSkipRunning);
  done();
});

afterEach((done) => {
  sandbox.restore();
  testTimer = null;
  done();
});

it('Should call listeners as expected', (done) => {
  const testCalls = 5;
  const listener1 = {
    name:     'listener1',
    listener: sandbox.stub().returns(true),
  };
  const listener2 = {
    name:     'listener2',
    listener: sandbox.stub().returns(true),
  };
  testTimer.addListener(listener1)
    .then(() => testTimer.addListener(listener2))
    .then(() => {
      testClock.tick((testTimer.options.timerStep * testCalls) + 1);
      return testTimer.removeListener({
        name: listener1.name,
      });
    })
    .then(() => {
      testClock.tick(testTimer.options.timerStep);
      expect(listener1.listener.callCount).to.be.equal(testCalls);
      expect(listener2.listener.callCount).to.be.equal(testCalls + 1);

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should not call listeners if there is allready running', (done) => {
  const listener1 = {
    name:     'listener1',
    listener: sandbox.stub().returns(true),
  };
  testTimer.addListener(listener1)
    .then(() => {
      testTimer.timer.running = true;
      testClock.tick(testTimer.options.timerStep + 1);
      expect(listener1.listener.callCount).to.be.equal(0);

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});

it('Should call listeners even if there is allready running', (done) => {
  const listener1 = {
    name:     'listener1',
    listener: sandbox.stub().returns(true),
  };
  testTimer.options.skipIfRunning = false;
  testTimer.addListener(listener1)
    .then(() => {
      testTimer.timer.running = true;
      testClock.tick(testTimer.options.timerStep + 1);
      expect(listener1.listener.callCount).to.be.equal(1);

      return Promise.resolve();
    })

    .then(done)
    .catch(err => done(err));
});
