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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

function build() {
  var ltws = {
    manager: _lodash.default.cloneDeep(defaultManager),

    get isConnected() {
      return _lodash.default.get(this.manager.ws, 'readyState') === WebSocket.ReadyState.OPEN;
    },

    connectAsync(origin, config) {
      var _this = this;

      return _asyncToGenerator(function* () {
        if (_this.isConnected) {
          return _this;
        }

        beforeConnect(_this.manager, origin, config);
        yield WebSocket.connectAsync(_this.manager);
        return _this;
      })();
    },

    connect(origin, config) {
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
      if (this.isConnected) {
        this.manager.autoReconnect = false;
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
      this.send(JSON.stringify(message));
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