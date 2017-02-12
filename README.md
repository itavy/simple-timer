# SimpleTimer #

This is a wrapper for setInterval when you need to have multiple interval or timeouts. It will maintain a list of registered listeners and it will call each of them every heartbeat. It is designed to work with at least nodejs 6.9.2;

## Installation ##

`
npm install @itavy/simple-timer
`


## Example ##

in this example we will create 2 listeners wich will be called every 100ms each

```
// file1.js
// in this file i will instantiate the timer singleton
const simpleTimer = require('@itavy/simple-timer').getSimpleTimer({
  step:          100,
  skipIfRunning: true,
})
.....
simpleTimer.addListener({
  name: 'firstListener',
  listener: () => {
    // your code here
    .......
  },
})
```

```
// file2.js
// in this file i will just require the timer since it is allready
// instantiated in file1.js
const simpleTimer = require('@itavy/simple-timer').getSimpleTimer();
.....
simpleTimer.addListener({
  name: 'secondListener',
  listener: () => {
    // your code here
    .......
  },
})
```

## API ##
- getSimpleTimer()
- getNewSimpleTimer()
- SimpleTimer.addListener()
- SimpleTimer.removeListener()

#### getSimpleTimer() and getNewSimpleTimer() ####
both will return an instance of a SimpleTimer;

getSimpleTimer need arguments only first time, later on it cann be called without
them and it will return the same SimpleTimer instance;

getNewSimpleTimer will need arguments every time and will return each time a new
instance of SimpleTimer;

the arguments are:
- `step`: heartbeat in milliseconds for calling listeners (default 1000ms)
- `skipIfRunning`: weather to call again if the previous cycle of calling listeners
did not finished (default false)

#### SimpleTimer.addListener ####
it will add a new executor to be called every heartbeat until it is removed;
it will return a Promise:
- on success it will return nothing
- on reject it will return the corresponding error:

the arguments are:
- `name`: unique name for this listener
- `listener`: a function to be called every heartbeat

###### Note ######
first time this function is called it will start the timer

#### SimpleTimer.removeListener ####
it will add a remove the executor from the calling list;
it will return a Promise:
- on success it will return nothing
- on reject it will return the corresponding error:

the arguments are:
- `name`: unique name for this listener

###### Note ######
when the last executor is removed it will stop the timer and it can be
reactivated by adding an executor;
