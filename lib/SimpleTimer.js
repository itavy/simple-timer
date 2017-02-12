'use strict';

/**
 * @itavy/utilities
 * @external @itavy/utilities
 * @see {@link https://github.com/itavy/utilities}
 */

/**
 * @typedef {Object} SimpleTimerRequiredDependency
 * @property {exernal:@itavy/utilities} utils
 * @property {Object} errors list of errors
 * @property {Number} step step for timer
 * @property {Boolean} skipIfRunning if it should call listeners when the previous
 * call didn't finished
 */
/**
 * @typedef {Object} AddListenerDefinition
 * @property {String} name identifier for listener to be added
 * @property {Function} listener executor to be called
 */
 /**
  * @typedef {Object} RemoveListenerDefinition
  * @property {String} name identifier for listener to be removed
  */


/**
 * SimpleTimer class
 */
class SimpleTimer {
  /**
   * SimpleTimer constructor
   * @param {SimpleTimerRequiredDependency} di SimpleTimer dependencies
   * @returns {SimpleTimer} return a SimpleTimer instance
   */
  constructor(di) {
    this.utils = di.utils;

    this.errors = di.errors;
    this.listeners = new Map();

    this.options = {
      timerStep:     di.step,
      skipIfRunning: di.skipIfRunning,
    };
    this.timer = {
      running: false,
      id:      null,
    };
  }

  /**
   * Register a listener for receiving ticks
   * @param {AddListenerDefinition} request add listener request
   * @returns {Promise} return true on success and rejects otherwise
   * @public
   */
  addListener(request) {
    return this.validateAddListener(request)
      .then((validatedResponse) => {
        this.listeners.set(validatedResponse.name, validatedResponse.listener);
        return this.startTimer();
      })
      .catch(errorAddListener => Promise.reject(this.utils.createError({
        name:    this.errors.SIMPLE_TIMER_ADD_LISTENER_ERROR.name,
        error:   errorAddListener,
        message: this.errors.SIMPLE_TIMER_ADD_LISTENER_ERROR.message,
      })));
  }

  /**
   * Remove a listener from receiving ticks
   * @param {RemoveListenerDefinition} request remove listener request
   * @returns {Promise} return true on success and rejects otherwise
   * @public
   */
  removeListener(request) {
    return this.validateRemoveListener(request)
      .then((validatedResponse) => {
        this.listeners.delete(validatedResponse.name);
        return this.stopTimer();
      })
      .catch(errorRemoveListener => Promise.reject(this.utils.createError({
        name:    this.errors.SIMPLE_TIMER_REMOVE_LISTENER_ERROR.name,
        error:   errorRemoveListener,
        message: this.errors.SIMPLE_TIMER_REMOVE_LISTENER_ERROR.message,
      })));
  }

  /**
   * Validate input for removeListener
   * @param {RemoveListenerDefinition} request remove listener request
   * @returns {Promise} return provided input
   * @private
   */
  validateRemoveListener(request) {
    return new Promise((resolve, reject) => {
      if (!this.utils.has(request, 'name')) {
        return reject(this.utils.createError({
          name:    this.errors.SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST.name,
          message: this.errors.SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST.message,
        }));
      }
      if (!this.listeners.has(request.name)) {
        return reject(this.utils.createError({
          name:    this.errors.SIMPLE_TIMER_UNKNOWN_LISTENER_NAME.name,
          message: `${this.errors.SIMPLE_TIMER_UNKNOWN_LISTENER_NAME.message} ${request.name}`,
        }));
      }
      return resolve(request);
    })
      .catch(errorRemoveListener => Promise.reject(this.utils.createError({
        name:    this.errors.SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER.name,
        error:   errorRemoveListener,
        message: this.errors.SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER.message,
      })));
  }

  /**
   * Validate input for addListener
   * @param {AddListenerDefinition} request add listener request
   * @returns {Promise} return provided input
   * @private
   */
  validateAddListener(request) {
    return new Promise((resolve, reject) => {
      if (!this.utils.has(request, 'name') || !this.utils.has(request, 'listener')) {
        return reject(this.utils.createError({
          name:    this.errors.SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST.name,
          message: this.errors.SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST.message,
        }));
      }
      if (!(request.listener instanceof Function)) {
        return reject(this.utils.createError({
          name:    this.errors.SIMPLE_TIMER_INVALID_ADD_LISTENER.name,
          message: this.errors.SIMPLE_TIMER_INVALID_ADD_LISTENER.message,
        }));
      }
      if (this.listeners.has(request.name)) {
        return reject(this.utils.createError({
          name:    this.errors.SIMPLE_TIMER_DUPLICATE_LISTENER_NAME.name,
          message: `${this.errors.SIMPLE_TIMER_DUPLICATE_LISTENER_NAME.message} request.name`,
        }));
      }
      return resolve(request);
    })
    .catch(errorValidateListener => Promise.reject(this.utils.createError({
      name:    this.errors.SIMPLE_TIMER_VALIDATE_ADD_LISTENER.name,
      error:   errorValidateListener,
      message: this.errors.SIMPLE_TIMER_VALIDATE_ADD_LISTENER.message,
    })));
  }

  /**
   * setup timer if it is not allready set
   * @returns {Promise} success;
   * @private
   */
  startTimer() {
    if (null !== this.timer.id) {
      return Promise.resolve();
    }
    if (0 === this.listeners.size) {
      return Promise.resolve();
    }
    this.timer.id = setInterval(() => {
      if (this.timer.running && this.options.skipIfRunning) {
        return;
      }
      this.timer.running = true;
      this.listeners.forEach(listener => listener());
      this.timer.running = false;
    }, this.options.timerStep);
    return Promise.resolve();
  }

  /**
   * clearInterval if there are no more listeners
   * @returns {Promise} success;
   * @private
   */
  stopTimer() {
    if (null === this.timer.id) {
      return Promise.resolve();
    }
    if (0 !== this.listeners.size) {
      return Promise.resolve();
    }
    clearInterval(this.timer.id);
    this.timer.id = null;
    return Promise.resolve();
  }
}

module.exports = {
  SimpleTimer,
};
