"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.default = void 0;

var _manager = require("./manager");

function connect() {
  return (0, _manager.build)().bind().connect(...arguments);
}

var _default = {
  connect
};
exports.default = _default;