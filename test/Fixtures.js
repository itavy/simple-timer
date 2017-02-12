'use strict';

const exportGoodDependency = {
  skipIfRunning: true,
  step:          500,
  utils:         {},
};

const testSkipRunning = {
  skipIfRunning: true,
  step:          500,
};

const testNoSkipRunning = {
  skipIfRunning: false,
  step:          500,
};

const idInterval = 912345678;
const fakeListener = {
  name:     'fakeListener',
  listener: () => true,
};

const fakeListener2 = {
  name:     'fakeListener2',
  listener: () => true,
};

const removeListener = {
  name: 'fakeListener',
};

module.exports = {
  export: {
    goodDependency: exportGoodDependency,
  },
  simpleTimer: {
    testSkipRunning,
    testNoSkipRunning,
    idInterval,
    fakeListener,
    fakeListener2,
    removeListener,
  },
};
