"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListener = addListener;
exports.addOnceListener = addOnceListener;
exports.executeHandler = executeHandler;
exports.executeListener = executeListener;
exports.on_connectErrorListener = on_connectErrorListener;
exports.on_connectListener = on_connectListener;
exports.on_debugHandler = on_debugHandler;
exports.on_disconnectListener = on_disconnectListener;
exports.on_disconnectingListener = on_disconnectingListener;
exports.on_errorHandler = on_errorHandler;
exports.on_errorListener = on_errorListener;
exports.on_infoHandler = on_infoHandler;
exports.on_jsonListener = on_jsonListener;
exports.on_logHandler = on_logHandler;
exports.on_messageListener = on_messageListener;
exports.on_pingListener = on_pingListener;
exports.on_pongListener = on_pongListener;
exports.on_reconnectListener = on_reconnectListener;
exports.on_reconnectingListener = on_reconnectingListener;
exports.on_warnHandler = on_warnHandler;
exports.removeListener = removeListener;
exports.removeOnceListener = removeOnceListener;
var _lodash = _interopRequireDefault(require("lodash"));
var _bluebird = _interopRequireDefault(require("bluebird"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var Type = {
  ON: 'ON',
  ONCE: 'ONCE'
};
var execute = function execute(eventListeners) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return _bluebird.default.map(eventListeners, fn => fn(...params), {
    concurrency: 1
  });
};
function executeListener(eventProp) {
  for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    params[_key2 - 1] = arguments[_key2];
  }
  this.manager.out_debug(eventProp, ...params);
  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);
  var fncs = _lodash.default.map(eventListeners, 'listener');
  var results = execute(fncs, ...params);
  _lodash.default.remove(this.manager.listener[eventProp], _ref => {
    var {
      type,
      listener
    } = _ref;
    return type === Type.ONCE && _lodash.default.includes(fncs, listener);
  });
  return results;
}
function executeHandler(handlerProp) {
  var handler = _lodash.default.get(this.manager.out, handlerProp) || console.warn;
  for (var _len3 = arguments.length, params = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    params[_key3 - 1] = arguments[_key3];
  }
  var info = _lodash.default.reject(params, _lodash.default.isUndefined);
  handler(...info);
}
function on_connectListener() {
  var eventProp = 'on_connect';
  for (var _len4 = arguments.length, params = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    params[_key4] = arguments[_key4];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_connectErrorListener() {
  var eventProp = 'on_connectError';
  for (var _len5 = arguments.length, params = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    params[_key5] = arguments[_key5];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_reconnectListener() {
  var eventProp = 'on_reconnect';
  for (var _len6 = arguments.length, params = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    params[_key6] = arguments[_key6];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_reconnectingListener() {
  var eventProp = 'on_reconnecting';
  for (var _len7 = arguments.length, params = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    params[_key7] = arguments[_key7];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_disconnectingListener() {
  var eventProp = 'on_disconnecting';
  for (var _len8 = arguments.length, params = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    params[_key8] = arguments[_key8];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_disconnectListener() {
  var eventProp = 'on_disconnect';
  for (var _len9 = arguments.length, params = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    params[_key9] = arguments[_key9];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_errorListener() {
  var eventProp = 'on_error';
  for (var _len10 = arguments.length, params = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    params[_key10] = arguments[_key10];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_pingListener() {
  var eventProp = 'on_ping';
  for (var _len11 = arguments.length, params = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    params[_key11] = arguments[_key11];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_pongListener() {
  var eventProp = 'on_pong';
  for (var _len12 = arguments.length, params = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    params[_key12] = arguments[_key12];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_messageListener() {
  var eventProp = 'on_message';
  for (var _len13 = arguments.length, params = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    params[_key13] = arguments[_key13];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_jsonListener() {
  var eventProp = 'on_json';
  for (var _len14 = arguments.length, params = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    params[_key14] = arguments[_key14];
  }
  return executeListener.call(this, eventProp, ...params);
}
function on_debugHandler() {
  var handlerProp = 'debug';
  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);
  if (isEnable) {
    for (var _len15 = arguments.length, params = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
      params[_key15] = arguments[_key15];
    }
    return executeHandler.call(this, handlerProp, ...params);
  }
}
function on_infoHandler() {
  var handlerProp = 'info';
  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);
  if (isEnable) {
    for (var _len16 = arguments.length, params = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
      params[_key16] = arguments[_key16];
    }
    return executeHandler.call(this, handlerProp, ...params);
  }
}
function on_logHandler() {
  var handlerProp = 'log';
  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);
  if (isEnable) {
    for (var _len17 = arguments.length, params = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
      params[_key17] = arguments[_key17];
    }
    return executeHandler.call(this, handlerProp, ...params);
  }
}
function on_errorHandler() {
  var handlerProp = 'error';
  var isEnable = _lodash.default.get(this.manager.config, handlerProp, true);
  if (isEnable) {
    for (var _len18 = arguments.length, params = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
      params[_key18] = arguments[_key18];
    }
    return executeHandler.call(this, handlerProp, ...params);
  }
}
function on_warnHandler() {
  var handlerProp = 'warn';
  var isEnable = _lodash.default.get(this.manager.config, handlerProp, true);
  if (isEnable) {
    for (var _len19 = arguments.length, params = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
      params[_key19] = arguments[_key19];
    }
    return executeHandler.call(this, handlerProp, ...params);
  }
}
function addListener(event, listener) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Type.ON;
  var eventProp = "on_".concat(event);
  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);
  if (!eventListeners) {
    throw new Error("Event on [".concat(event, "] is not supported"));
  }
  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener one [".concat(event, "] is not a function"));
  }
  if (!eventListeners.find(item => item.listener === listener)) {
    eventListeners.push({
      type,
      listener
    });
  }
  return this;
}
function removeListener(event, listener) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Type.ON;
  var eventProp = "on_".concat(event);
  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);
  if (!eventListeners) {
    throw new Error("Event on [".concat(event, "] is not supported"));
  }
  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener on [".concat(event, "] is not a function"));
  }
  _lodash.default.remove(this.manager.listener[eventProp], {
    type,
    listener
  });
  return this;
}
function addOnceListener(event, listener) {
  addListener.call(this, event, listener, Type.ONCE);
  return this;
}
function removeOnceListener(event, listener) {
  removeListener.call(this, event, listener, Type.ONCE);
  return this;
}