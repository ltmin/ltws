import _ from 'lodash'
import Bluebird from 'bluebird'

const execute = (eventListeners) => {
  return Bluebird.map(eventListeners, (fn) => fn(...params), {
    concurrency: 1,
  })
}

export function executeListener(eventProp, ...params) {
  this.manager.out_debug(eventProp, ...params)
  const eventListeners = _.get(this.manager.listener, eventProp)

  const results = execute(eventListeners)

  return results
}

export function executeOnceListener(eventProp, ...params) {
  this.manager.out_debug(eventProp, ...params)
  const eventListeners = _.get(this.manager.listener, eventProp)

  const results = execute(eventListeners)

  _.pullAll(this.manager.listener, eventListeners)

  return results
}

export function executeHandler(handlerProp, ...params) {
  const handler = _.get(this.manager.out, handlerProp) || console.warn
  const info = _.reject(params, _.isUndefined)

  handler(...info)
}

export function on_connectListener(...params) {
  const eventProp = 'on_connect'
  return executeListener.call(this, eventProp, ...params)
}
export function on_connectErrorListener(...params) {
  const eventProp = 'on_connectError'
  return executeListener.call(this, eventProp, ...params)
}
export function on_reconnectListener(...params) {
  const eventProp = 'on_reconnect'
  return executeListener.call(this, eventProp, ...params)
}
export function on_reconnectingListener(...params) {
  const eventProp = 'on_reconnecting'
  return executeListener.call(this, eventProp, ...params)
}
export function on_disconnectingListener(...params) {
  const eventProp = 'on_disconnecting'
  return executeListener.call(this, eventProp, ...params)
}
export function on_disconnectListener(...params) {
  const eventProp = 'on_disconnect'
  return executeListener.call(this, eventProp, ...params)
}
export function on_errorListener(...params) {
  const eventProp = 'on_error'
  return executeListener.call(this, eventProp, ...params)
}
export function on_pingListener(...params) {
  const eventProp = 'on_ping'
  return executeListener.call(this, eventProp, ...params)
}
export function on_pongListener(...params) {
  const eventProp = 'on_pong'
  return executeListener.call(this, eventProp, ...params)
}
export function on_messageListener(...params) {
  const eventProp = 'on_message'
  return executeListener.call(this, eventProp, ...params)
}
export function on_jsonListener(...params) {
  const eventProp = 'on_json'
  return executeListener.call(this, eventProp, ...params)
}

export function once_connectListener(...params) {
  const eventProp = 'once_connect'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_connectErrorListener(...params) {
  const eventProp = 'once_connectError'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_reconnectListener(...params) {
  const eventProp = 'once_reconnect'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_reconnectingListener(...params) {
  const eventProp = 'once_reconnecting'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_disconnectingListener(...params) {
  const eventProp = 'once_disconnecting'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_disconnectListener(...params) {
  const eventProp = 'once_disconnect'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_errorListener(...params) {
  const eventProp = 'once_error'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_pingListener(...params) {
  const eventProp = 'once_ping'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_pongListener(...params) {
  const eventProp = 'once_pong'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_messageListener(...params) {
  const eventProp = 'once_message'
  return executeOnceListener.call(this, eventProp, ...params)
}
export function once_jsonListener(...params) {
  const eventProp = 'once_json'
  return executeOnceListener.call(this, eventProp, ...params)
}

export function on_debugHandler(...params) {
  const handlerProp = 'debug'

  const isEnable = _.get(
    this.manager.config,
    ['debug', handlerProp],
    this.manager.config.debug
  )
  if (isEnable) {
    return executeHandler.call(this, handlerProp, ...params)
  }
}
export function on_infoHandler(...params) {
  const handlerProp = 'info'

  const isEnable = _.get(
    this.manager.config,
    ['debug', handlerProp],
    this.manager.config.debug
  )
  if (isEnable) {
    return executeHandler.call(this, handlerProp, ...params)
  }
}

export function on_logHandler(...params) {
  const handlerProp = 'log'

  const isEnable = _.get(
    this.manager.config,
    ['debug', handlerProp],
    this.manager.config.debug
  )
  if (isEnable) {
    return executeHandler.call(this, handlerProp, ...params)
  }
}

export function on_errorHandler(...params) {
  const handlerProp = 'error'

  const isEnable = _.get(this.manager.config, handlerProp, true)
  if (isEnable) {
    return executeHandler.call(this, handlerProp, ...params)
  }
}

export function on_warnHandler(...params) {
  const handlerProp = 'warn'

  const isEnable = _.get(this.manager.config, handlerProp, true)
  if (isEnable) {
    return executeHandler.call(this, handlerProp, ...params)
  }
}

export function addListener(event, listener) {
  const eventProp = `on_${event}`
  const eventListeners = _.get(this.manager.listener, eventProp)
  if (!eventListeners) {
    throw new Error(`Event on [${event}] is not supported`)
  }
  if (!_.isFunction(listener)) {
    throw new Error(`Event listener one [${event}] is not a function`)
  }

  if (!eventListeners.find((item) => item === listener)) {
    eventListeners.push(listener)
  }
}

export function removeListener(event, listener) {
  const eventProp = `on_${event}`
  const eventListeners = _.get(this.manager.listener, eventProp)
  if (!eventListeners) {
    throw new Error(`Event on [${event}] is not supported`)
  }
  if (!_.isFunction(listener)) {
    throw new Error(`Event listener on [${event}] is not a function`)
  }

  _.pull(eventListeners, listener)
}

export function addOnceListener(event, listener) {
  const eventProp = `once_${event}`
  const eventListeners = _.get(this.manager.listener, eventProp)
  if (!eventListeners) {
    throw new Error(`Event once [${event}] is not supported`)
  }
  if (!_.isFunction(listener)) {
    throw new Error(`Event listener once [${event}] is not a function`)
  }

  if (!eventListeners.find((item) => item === listener)) {
    eventListeners.push(listener)
  }
}

export function removeOnceListener(event, listener) {
  const eventProp = `once_${event}`
  const eventListeners = _.get(this.manager.listener, eventProp)
  if (!eventListeners) {
    throw new Error(`Event once [${event}] is not supported`)
  }
  if (!_.isFunction(listener)) {
    throw new Error(`Event listener once [${event}] is not a function`)
  }

  _.pull(eventListeners, listener)
}
