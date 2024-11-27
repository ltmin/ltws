"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
var _lodash = _interopRequireDefault(require("lodash"));
var _ajv = _interopRequireDefault(require("ajv"));
var _ajvErrors = _interopRequireDefault(require("ajv-errors"));
var WebSocket = _interopRequireWildcard(require("./websocket"));
var Listener = _interopRequireWildcard(require("./listener"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var ajv = new _ajv.default({
  allErrors: true
});
(0, _ajvErrors.default)(ajv, {
  singleError: true
});
var defaultManager = {
  ws: null,
  connReadyCount: 0,
  connRetries: 0,
  pingScheduler: null,
  pingTimeoutScheduler: null,
  connCreatingTimeoutScheduler: null,
  destroyReason: null,
  origin: '',
  config: {
    debug: false,
    warn: true,
    error: true,
    pingInterval: 5000,
    pingTimeout: 5000,
    connectTimeout: 5000,
    reconnectTimeout: 5000,
    reconnectDelay: 5000,
    useReconnectEvent: false,
    autoReconnect: true,
    maxRetries: Number.MAX_SAFE_INTEGER
  },
  listener: {
    on_connect: [],
    on_connectError: [],
    on_reconnect: [],
    on_reconnecting: [],
    on_disconnect: [],
    on_disconnecting: [],
    on_error: [],
    on_ping: [],
    on_pong: [],
    on_message: [],
    on_json: [],
    once_connect: [],
    once_connectError: [],
    once_reconnect: [],
    once_reconnecting: [],
    once_disconnect: [],
    once_disconnecting: [],
    once_error: [],
    once_ping: [],
    once_pong: [],
    once_message: [],
    once_json: []
  },
  out: {
    debug: console.debug,
    warn: console.warn,
    error: console.error,
    info: console.info,
    log: console.log
  }
};
var validator = ajv.compile({
  type: 'object',
  properties: {
    origin: {
      type: 'string'
    },
    config: {
      type: 'object',
      properties: {
        debug: {
          type: 'boolean'
        },
        warn: {
          type: 'boolean'
        },
        error: {
          type: 'boolean'
        },
        pingInterval: {
          type: 'integer'
        },
        pingTimeout: {
          type: 'integer',
          minimum: 1000
        },
        connectTimeout: {
          type: 'integer',
          minimum: 2000
        },
        reconnectTimeout: {
          type: 'integer',
          minimum: 2000
        },
        reconnectDelay: {
          type: 'integer',
          minimum: 1000
        },
        autoReconnect: {
          type: 'boolean'
        },
        maxRetries: {
          type: 'integer',
          minimum: 1
        },
        useReconnectEvent: {
          type: 'boolean'
        }
      },
      errorMessage: {
        properties: {
          debug: '[debug] is invalid',
          warn: '[warn] is invalid',
          error: '[error] is invalid',
          pingInterval: '[pingInterval] is invalid',
          pingTimeout: '[pingTimeout] is invalid',
          connectTimeout: '[connectTimeout] is invalid',
          reconnectTimeout: '[reconnectTimeout] is invalid',
          reconnectDelay: '[reconnectDelay] is invalid',
          autoReconnect: '[autoReconnect] is invalid',
          maxRetries: '[maxRetries] is invalid',
          useReconnectEvent: '[useReconnectEvent] is invalid'
        }
      }
    }
  },
  additionalProperties: false,
  required: ['origin'],
  errorMessage: {
    properties: {
      origin: '[origin] is invalid'
    }
  }
});
var beforeConnect = (manager, origin, config) => {
  manager.params = {
    origin,
    config
  };
  var result = validator(manager.params);
  if (!result) {
    throw new Error(_lodash.default.get(validator.errors, '0.message'));
  }
  manager.origin = manager.params.origin;
  manager.config = _lodash.default.merge(manager.config, manager.params.config);
  manager.baseConfig = {};
  manager.autoReconnect = _lodash.default.get(manager.config, 'autoReconnect', true);
  manager.connRetries = 0;
  manager.connReadyCount = 0;
};
function build(options) {
  var configOptions = _lodash.default.get(options, 'config', {});
  var ltws = {
    manager: _lodash.default.cloneDeep(defaultManager),
    get isConnected() {
      return _lodash.default.get(this.manager.ws, 'readyState') === WebSocket.ReadyState.OPEN;
    },
    connectAsync(origin) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configOptions;
      if (this.isConnected) {
        return this;
      }
      config = _lodash.default.merge(config, {
        autoReconnect: _lodash.default.get(config, 'autoReconnect', false)
      });
      beforeConnect(this.manager, origin, config);
      return WebSocket.connectAsync(this.manager);
    },
    connect(origin) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configOptions;
      if (this.isConnected) {
        return this;
      }
      beforeConnect(this.manager, origin, config);
      process.nextTick(() => {
        WebSocket.connect(this.manager);
      });
      return this;
    },
    reconnect() {
      if (this.isConnected) {
        return this;
      }
      var result = validator(this.manager.params);
      if (!result) {
        throw new Error(_lodash.default.get(validator.errors, '0.message'));
      }
      this.manager.autoReconnect = _lodash.default.get(this.manager.config, 'autoReconnect', true);
      this.manager.connRetries = 0;
      this.manager.connReadyCount = 0;
      WebSocket.connect(this.manager);
      return this;
    },
    disconnect() {
      this.manager.autoReconnect = false;
      if (this.isConnected) {
        this.manager.ws.close();
      }
    },
    send(message) {
      if (this.isConnected) {
        this.manager.ws.send(message);
        return true;
      }
      this.manager.out_error('[send] connection was lost before sending message');
    },
    sendJson(message) {
      return this.send(JSON.stringify(message));
    },
    bind() {
      this.manager.on_connect = Listener.on_connectListener.bind(this);
      this.manager.on_connectError = Listener.on_connectErrorListener.bind(this);
      this.manager.on_reconnect = Listener.on_reconnectListener.bind(this);
      this.manager.on_reconnecting = Listener.on_reconnectingListener.bind(this);
      this.manager.on_disconnect = Listener.on_disconnectListener.bind(this);
      this.manager.on_disconnecting = Listener.on_disconnectingListener.bind(this);
      this.manager.on_error = Listener.on_errorListener.bind(this);
      this.manager.on_ping = Listener.on_pingListener.bind(this);
      this.manager.on_pong = Listener.on_pongListener.bind(this);
      this.manager.on_message = Listener.on_messageListener.bind(this);
      this.manager.on_json = Listener.on_jsonListener.bind(this);
      this.manager.out_debug = Listener.on_debugHandler.bind(this);
      this.manager.out_error = Listener.on_errorHandler.bind(this);
      this.manager.out_log = Listener.on_logHandler.bind(this);
      this.manager.out_info = Listener.on_infoHandler.bind(this);
      this.manager.out_warn = Listener.on_warnHandler.bind(this);
      this.on = this.addListener = Listener.addListener.bind(this);
      this.off = this.removeListener = Listener.removeListener.bind(this);
      this.once = this.addOnceListener = Listener.addOnceListener.bind(this);
      this.offOnce = this.removeOnceListener = Listener.removeOnceListener.bind(this);
      return this;
    }
  };
  return ltws;
}