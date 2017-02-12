'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const simpleTimerLib = require('../lib');
const simpleTimerClass = require('../lib/SimpleTimer');
const simpleTimerErrors = require('../lib/Errors');
const simpleTimerDefaults = require('../lib/SimpleTimerDefaults');

const fixtures = require('./Fixtures');
const utils = require('@itavy/utilities').getUtilities();


it('Should have required errors', (done) => {
  const expectedErrors = [
    'SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER',
    'SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST',
    'SIMPLE_TIMER_VALIDATE_ADD_LISTENER',
    'SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST',
    'SIMPLE_TIMER_INVALID_ADD_LISTENER',
    'SIMPLE_TIMER_DUPLICATE_LISTENER_NAME',
    'SIMPLE_TIMER_ADD_LISTENER_ERROR',
    'SIMPLE_TIMER_UNKNOWN_LISTENER_NAME',
    'SIMPLE_TIMER_REMOVE_LISTENER_ERROR',
  ];

  expect(Object.keys(simpleTimerErrors).length).to.equal(expectedErrors.length);

  expectedErrors.map(el => expect(simpleTimerErrors).to.have.property(el));
  done();
});

it('Should have required defaults', (done) => {
  expect(Object.keys(simpleTimerDefaults).length).to.equal(2);

  [
    'skipIfRunning',
    'step',
  ].map(el => expect(simpleTimerDefaults).to.have.property(el));
  done();
});

it('Should export only SimpleTimer class', (done) => {
  expect(Object.keys(simpleTimerClass).length).to.equal(1);
  expect(simpleTimerClass).to.have.property('SimpleTimer');
  done();
});

it('Should export only required functionality', (done) => {
  expect(Object.keys(simpleTimerLib).length).to.equal(2);
  expect(simpleTimerLib).to.have.property('getNewSimpleTimer');
  expect(simpleTimerLib).to.have.property('getSimpleTimer');
  done();
});


it('Should create an instance of SimpleTimer with provided options', (done) => {
  const di = fixtures.export.goodDependency;
  const sTimer = simpleTimerLib.getNewSimpleTimer(di);

  expect(sTimer).to.be.instanceof(simpleTimerClass.SimpleTimer);
  expect(sTimer).to.be.have.property('utils', di.utils);
  expect(sTimer.options).to.be.have.property('skipIfRunning', di.skipIfRunning);
  expect(sTimer.options).to.be.have.property('timerStep', di.step);
  done();
});

it('Should use default options if none provided ', (done) => {
  const sTimer = simpleTimerLib.getNewSimpleTimer({});
  expect(sTimer).to.be.have.property('utils', utils);
  expect(sTimer.options).to.be.have.property('skipIfRunning', simpleTimerDefaults.skipIfRunning);
  expect(sTimer.options).to.be.have.property('timerStep', simpleTimerDefaults.step);
  done();
});

it('Should export same instance', (done) => {
  const sTimer1 = simpleTimerLib.getSimpleTimer(fixtures.export.goodDependency);
  const sTimer2 = simpleTimerLib.getSimpleTimer();
  expect(sTimer2).to.be.equal(sTimer1);
  done();
});
