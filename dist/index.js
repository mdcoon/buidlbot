'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _tokenStorage = require('./tokenStorage');

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STORAGE_KEY = "buidlhub_token";
var inst = null;

var Bot = function () {
  _createClass(Bot, null, [{
    key: 'instance',
    get: function get() {
      if (!inst) {
        inst = new Bot();
      }
      return inst;
    }
  }]);

  function Bot() {
    var _this = this;

    _classCallCheck(this, Bot);

    this._cache = null;

    ['init'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(Bot, [{
    key: 'init',
    value: function init(props) {
      if (this._cache) {
        return;
      }
      if (!props) {
        throw new Error("Missing init properties");
      }
      if (!props.apiKey) {
        throw new Error("Missing API key in properties");
      }
      var con = new _connector2.default({
        apiKey: props.apiKey,
        baseUrl: props.baseUrl,
        tokenStorage: new _tokenStorage.Storage({ keyPath: STORAGE_KEY })
      });
      this._cache = new _cache2.default({ connector: con });
    }
  }, {
    key: 'cache',
    get: function get() {
      if (!this._cache) {
        throw new Error("Must first initialize BUIDLBot with apikey");
      }
      return this._cache;
    }
  }]);

  return Bot;
}();

exports.default = Bot;