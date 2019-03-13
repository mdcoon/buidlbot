'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MockStorage = exports.Storage = undefined;

var _LocalTokenStorage = require('./LocalTokenStorage');

var _LocalTokenStorage2 = _interopRequireDefault(_LocalTokenStorage);

var _MockStorage = require('./MockStorage');

var _MockStorage2 = _interopRequireDefault(_MockStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Storage = _LocalTokenStorage2.default;
exports.MockStorage = _MockStorage2.default;