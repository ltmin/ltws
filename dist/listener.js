"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListener = addListener;
exports.addOnceListener = addOnceListener;
exports.executeHandler = executeHandler;
exports.executeListener = executeListener;
exports.executeOnceListener = executeOnceListener;
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
exports.once_connectErrorListener = once_connectErrorListener;
exports.once_connectListener = once_connectListener;
exports.once_disconnectListener = once_disconnectListener;
exports.once_disconnectingListener = once_disconnectingListener;
exports.once_errorListener = once_errorListener;
exports.once_jsonListener = once_jsonListener;
exports.once_messageListener = once_messageListener;
exports.once_pingListener = once_pingListener;
exports.once_pongListener = once_pongListener;
exports.once_reconnectListener = once_reconnectListener;
exports.once_reconnectingListener = once_reconnectingListener;
exports.removeListener = removeListener;
exports.removeOnceListener = removeOnceListener;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execute = eventListeners => {
  return _bluebird.default.map(eventListeners, fn => fn(...params), {
    concurrency: 1
  });
};

function executeListener(eventProp) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  this.manager.out_debug(eventProp, ...params);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  var results = execute(eventListeners);
  return results;
}

function executeOnceListener(eventProp) {
  for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    params[_key2 - 1] = arguments[_key2];
  }

  this.manager.out_debug(eventProp, ...params);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  var results = execute(eventListeners);

  _lodash.default.pullAll(this.manager.listener, eventListeners);

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

function once_connectListener() {
  var eventProp = 'once_connect';

  for (var _len15 = arguments.length, params = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
    params[_key15] = arguments[_key15];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_connectErrorListener() {
  var eventProp = 'once_connectError';

  for (var _len16 = arguments.length, params = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
    params[_key16] = arguments[_key16];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_reconnectListener() {
  var eventProp = 'once_reconnect';

  for (var _len17 = arguments.length, params = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
    params[_key17] = arguments[_key17];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_reconnectingListener() {
  var eventProp = 'once_reconnecting';

  for (var _len18 = arguments.length, params = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
    params[_key18] = arguments[_key18];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_disconnectingListener() {
  var eventProp = 'once_disconnecting';

  for (var _len19 = arguments.length, params = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
    params[_key19] = arguments[_key19];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_disconnectListener() {
  var eventProp = 'once_disconnect';

  for (var _len20 = arguments.length, params = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
    params[_key20] = arguments[_key20];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_errorListener() {
  var eventProp = 'once_error';

  for (var _len21 = arguments.length, params = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
    params[_key21] = arguments[_key21];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_pingListener() {
  var eventProp = 'once_ping';

  for (var _len22 = arguments.length, params = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
    params[_key22] = arguments[_key22];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_pongListener() {
  var eventProp = 'once_pong';

  for (var _len23 = arguments.length, params = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
    params[_key23] = arguments[_key23];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_messageListener() {
  var eventProp = 'once_message';

  for (var _len24 = arguments.length, params = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
    params[_key24] = arguments[_key24];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function once_jsonListener() {
  var eventProp = 'once_json';

  for (var _len25 = arguments.length, params = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
    params[_key25] = arguments[_key25];
  }

  return executeOnceListener.call(this, eventProp, ...params);
}

function on_debugHandler() {
  var handlerProp = 'debug';

  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);

  if (isEnable) {
    for (var _len26 = arguments.length, params = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
      params[_key26] = arguments[_key26];
    }

    return executeHandler.call(this, handlerProp, ...params);
  }
}

function on_infoHandler() {
  var handlerProp = 'info';

  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);

  if (isEnable) {
    for (var _len27 = arguments.length, params = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
      params[_key27] = arguments[_key27];
    }

    return executeHandler.call(this, handlerProp, ...params);
  }
}

function on_logHandler() {
  var handlerProp = 'log';

  var isEnable = _lodash.default.get(this.manager.config, ['debug', handlerProp], this.manager.config.debug);

  if (isEnable) {
    for (var _len28 = arguments.length, params = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
      params[_key28] = arguments[_key28];
    }

    return executeHandler.call(this, handlerProp, ...params);
  }
}

function on_errorHandler() {
  var handlerProp = 'error';

  var isEnable = _lodash.default.get(this.manager.config, handlerProp, true);

  if (isEnable) {
    for (var _len29 = arguments.length, params = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
      params[_key29] = arguments[_key29];
    }

    return executeHandler.call(this, handlerProp, ...params);
  }
}

function on_warnHandler() {
  var handlerProp = 'warn';

  var isEnable = _lodash.default.get(this.manager.config, handlerProp, true);

  if (isEnable) {
    for (var _len30 = arguments.length, params = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
      params[_key30] = arguments[_key30];
    }

    return executeHandler.call(this, handlerProp, ...params);
  }
}

function addListener(event, listener) {
  var eventProp = "on_".concat(event);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  if (!eventListeners) {
    throw new Error("Event on [".concat(event, "] is not supported"));
  }

  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener one [".concat(event, "] is not a function"));
  }

  if (!eventListeners.find(item => item === listener)) {
    eventListeners.push(listener);
  }
}

function removeListener(event, listener) {
  var eventProp = "on_".concat(event);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  if (!eventListeners) {
    throw new Error("Event on [".concat(event, "] is not supported"));
  }

  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener on [".concat(event, "] is not a function"));
  }

  _lodash.default.pull(eventListeners, listener);
}

function addOnceListener(event, listener) {
  var eventProp = "once_".concat(event);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  if (!eventListeners) {
    throw new Error("Event once [".concat(event, "] is not supported"));
  }

  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener once [".concat(event, "] is not a function"));
  }

  if (!eventListeners.find(item => item === listener)) {
    eventListeners.push(listener);
  }
}

function removeOnceListener(event, listener) {
  var eventProp = "once_".concat(event);

  var eventListeners = _lodash.default.get(this.manager.listener, eventProp);

  if (!eventListeners) {
    throw new Error("Event once [".concat(event, "] is not supported"));
  }

  if (!_lodash.default.isFunction(listener)) {
    throw new Error("Event listener once [".concat(event, "] is not a function"));
  }

  _lodash.default.pull(eventListeners, listener);
}