"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconnect = exports.connect = exports.ReadyState = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ReadyState = {
  CONNECTING: _ws.default.CONNECTING,
  OPEN: _ws.default.OPEN,
  CLOSING: _ws.default.CLOSING,
  CLOSED: _ws.default.CLOSED
};
exports.ReadyState = ReadyState;

var onOpen = manager => /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (_raw) {
    clearTimeout(manager.connCreatingTimeoutScheduler);
    manager.connReadyCount++;
    manager.connRetries = 0;

    if (manager.config.pingInterval !== -1) {
      manager.pingScheduler = setInterval(() => {
        if (!manager.ws) {
          manager.out_error('[ping-scheduler] not initialized');
          return;
        }

        if (manager.ws.readyState === _ws.default.OPEN) {
          manager.out_debug('[ping-scheduler] sending ping');

          if (manager.pingTimeoutScheduler === null) {
            manager.pingTimeoutScheduler = setTimeout(() => onClose(manager)('PingTimeout'), manager.config.pingTimeout);
          }

          manager.ws.ping();
        } else {
          manager.out_warn('[ping-scheduler] readyState failed', manager.ws.readyState);
        }
      }, manager.config.pingInterval);
    } else {
      manager.out_info('[ping-scheduler] disabled');
    }

    if (manager.connReadyCount > 1 && manager.config.useReconnectEvent) {
      manager.out_debug('[on-open] socket re-connected', manager.config.useReconnectEvent);
      yield manager.on_reconnect(_raw);
    } else {
      manager.out_debug('[on-open] socket connected', manager.connReadyCount);
      yield manager.on_connect(_raw);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

var onPing = manager => /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (_raw) {
    manager.out_debug('[on-ping] received');
    var result = yield manager.on_ping(_raw);

    if (result !== false) {
      manager.out_debug('[on-ping] sending pong');
      manager.ws.pong();
    } else {
      manager.out_debug('[on-ping] sending ignored');
    }
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var onPong = manager => /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (_raw) {
    manager.out_debug('[on-pong] received');
    clearTimeout(manager.pingTimeoutScheduler);
    manager.pingTimeoutScheduler = null;
    yield manager.on_pong(_raw);
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var onClose = manager => /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (closeCode) {
    manager.out_info('[on-close] socket closed', closeCode);
    destroy(manager, closeCode);

    if (!manager.connReadyCount) {
      manager.out_warn('[on-close] connect falied');
      yield manager.on_disconnect('ConnectError');
      return;
    }

    var result = yield manager.on_disconnecting(closeCode);

    if (result === false) {
      manager.out_warn('[on-close] abort re-connect', manager.ws.readyState);
      yield manager.on_disconnect(closeCode);
      return;
    }

    if (manager.autoReconnect && manager.connRetries < manager.config.maxRetries) {
      manager.connRetries++;
      setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
        manager.out_debug('[on-close] socket delay re-connect', manager.config.reconnectDelay);
        yield manager.on_reconnecting(closeCode, manager.connRetries);
        reconnect(manager);
      }), manager.config.reconnectDelay);
    } else {
      yield manager.on_disconnect(closeCode);
    }
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var onMessage = manager => /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (_raw) {
    manager.out_debug('[on-message] received');
    yield manager.on_message(_raw);
  });

  return function (_x5) {
    return _ref6.apply(this, arguments);
  };
}();

var onJson = manager => /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(function* (_raw) {
    manager.out_debug('[on-json] received');

    try {
      var json = JSON.parse(_raw);
      yield manager.on_json(json, _raw);
    } catch (err) {
      yield manager.on_json(null, _raw);
    }
  });

  return function (_x6) {
    return _ref7.apply(this, arguments);
  };
}();

var onError = manager => /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (_raw) {
    manager.out_debug('[on-error] error thrown', _raw);
    yield manager.on_error(_raw);
  });

  return function (_x7) {
    return _ref8.apply(this, arguments);
  };
}();

var destroy = (manager, reason) => {
  clearInterval(manager.pingScheduler);
  clearTimeout(manager.pingTimeoutScheduler);
  clearTimeout(manager.connCreatingTimeoutScheduler);
  manager.pingTimeoutScheduler = null;

  if (manager.ws && manager.ws.readyState === _ws.default.OPEN) {
    manager.ws.close();
  } // if (manager.ws) {
  //   manager.ws._events = {}
  // }


  manager.ws = null;
  manager.destroyReason = reason;
};

var connect = manager => {
  manager.connCreatingTimeoutScheduler = setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
    destroy(manager, 'ConnectTimeout');
    manager.out_warn('[connect] timeout');
    yield manager.on_connectError('ConnectTimeout');
  }), manager.config.connectTimeout);
  manager.ws = new _ws.default(manager.origin, manager.baseConfig);
  manager.ws.on('open', onOpen(manager));
  manager.ws.on('close', onClose(manager));
  manager.ws.on('ping', onPing(manager));
  manager.ws.on('pong', onPong(manager));
  manager.ws.on('message', onMessage(manager));
  manager.ws.on('message', onJson(manager));
  manager.ws.on('error', onError(manager));
};

exports.connect = connect;

var reconnect = manager => {
  manager.connCreatingTimeoutScheduler = setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
    destroy(manager, 'ReconnectTimeout');
    manager.out_warn('[reconnect] timeout');

    if (manager.connRetries < manager.config.maxRetries) {
      manager.connRetries++;
      yield manager.on_reconnecting('ReconnectTimeout', manager.connRetries);
      connect(manager);
    } else {
      yield manager.on_disconnect('ReconnectTimeout');
    }
  }), manager.config.reconnectTimeout);
  manager.ws = new _ws.default(manager.origin, manager.baseConfig);
  manager.ws.on('open', onOpen(manager));
  manager.ws.on('close', onClose(manager));
  manager.ws.on('ping', onPing(manager));
  manager.ws.on('pong', onPong(manager));
  manager.ws.on('message', onMessage(manager));
  manager.ws.on('message', onJson(manager));
  manager.ws.on('error', onError(manager));
};

exports.reconnect = reconnect;