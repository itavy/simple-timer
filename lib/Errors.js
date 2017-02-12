'use strict';

/**
 * Utilities module
 * @module @itavy/SimpleTimer/Errors
 */
module.exports = {
  SIMPLE_TIMER_VALIDATE_ADD_LISTENER: {
    name:    'SIMPLE_TIMER_VALIDATE_ADD_LISTENER',
    message: 'Validation for add listener failed',
  },
  SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST: {
    name:    'SIMPLE_TIMER_INVALID_ADD_LISTENER_REQUEST',
    message: 'Name or listener missing',
  },
  SIMPLE_TIMER_INVALID_ADD_LISTENER: {
    name:    'SIMPLE_TIMER_INVALID_ADD_LISTENER',
    message: 'Listener must be a function',
  },
  SIMPLE_TIMER_DUPLICATE_LISTENER_NAME: {
    name:    'SIMPLE_TIMER_DUPLICATE_LISTENER_NAME',
    message: 'Duplicate listener name: ',
  },
  SIMPLE_TIMER_ADD_LISTENER_ERROR: {
    name:    'SIMPLE_TIMER_ADD_LISTENER_ERROR',
    message: 'Error ading listener',
  },
  SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER: {
    name:    'SIMPLE_TIMER_VALIDATE_REMOVE_LISTENER',
    message: 'Validation for remove listener failed',
  },
  SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST: {
    name:    'SIMPLE_TIMER_INVALID_REMOVE_LISTENER_REQUEST',
    message: 'Name of listener missing',
  },
  SIMPLE_TIMER_UNKNOWN_LISTENER_NAME: {
    name:    'SIMPLE_TIMER_UNKNOWN_LISTENER_NAME',
    message: 'Error removing listener: ',
  },
  SIMPLE_TIMER_REMOVE_LISTENER_ERROR: {
    name:    'SIMPLE_TIMER_REMOVE_LISTENER_ERROR',
    message: 'Error removing listener',
  },
};
