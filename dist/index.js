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
function createInstance(config) {
  return (0, _manager.build)(config).bind();
}
var _default = exports.default = {
  createInstance,
  connect
};