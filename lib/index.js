'use strict';

/**
 * @typedef {Object} SimpleTimerDependency
 * @property {exernal:@itavy/utilities} [utils]
 * @property {Number} [step=1000] step for timer
 * @property {Boolean} [skipIfRunning=true] if it should call listeners when the previous
 * call didn't finished
 */

const utils = require('@itavy/utilities').getUtilities();
const simpleTimerLib = require('./SimpleTimer');
const simpleTimerErrors = require('./Errors');
const simpleTimerDefaults = require('./SimpleTimerDefaults');

let simpleTimerInstance = null;


/**
 * SimpleTimer dependency check
 * @param  {SimpleTimerDependency} options dependencies for simple timer
 * @return {SimpleTimer} SimpleTimer instance
 */
const getNewSimpleTimer = (options) => {
  const stOptions = utils.validateConstructorDependencies({
    name:  'SimpleTimer',
    rules: [
      { name: 'utils', required: false, defaultValue: () => utils },
      { name: 'skipIfRunning', required: false, defaultValue: simpleTimerDefaults.skipIfRunning },
      { name: 'step', required: false, defaultValue: simpleTimerDefaults.step },
    ],
    di: options,
  });
  return Reflect.construct(
    simpleTimerLib.SimpleTimer,
    [
      utils.extend({ errors: simpleTimerErrors }, stOptions),
    ]);
};

/**
 * SimpleTimer singleton instance
 * @param  {SimpleTimerDependency} [options] dependencies for simple timer
 * @return {SimpleTimer} SimpleTimer instance
 */
const getSimpleTimer = (options) => {
  if (null === simpleTimerInstance) {
    simpleTimerInstance = getNewSimpleTimer(options);
  }
  return simpleTimerInstance;
};


module.exports = {
  getNewSimpleTimer,
  getSimpleTimer,
};
