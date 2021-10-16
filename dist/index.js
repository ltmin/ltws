"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.createInstance = createInstance;
exports.default = void 0;

var _manager = require("./manager");

function connect() {
  return (0, _manager.build)().bind().connect(...arguments);
}

function createInstance() {
  return (0, _manager.build)().bind();
}

var _default = {
  createInstance,
  connect
};
exports.default = _default;