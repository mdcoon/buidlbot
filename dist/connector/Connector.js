'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _props = require('../utils/props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//24-hr token expiration in ms
var TOKEN_EXPIRATION = 86400000;

//up to 10 attempts will be made to send to endpoint
var MAX_TRIES = 10;

//default server
var DEFAULT_URL = "https://buidlhub.com";

var Required = ['apiKey', 'tokenStorage'];

//endpoint to grab abi keys
var API_ACCESS_URL = "/api/auth/apiAccess/";

/**
  * Actual post functionality that can be used recursively to keep
  * trying. Token will be sent using JWT header Authorization: 'Bearer <token>'
**/
var _axiosDo = function _axiosDo(_ref) {
  var method = _ref.method,
      url = _ref.url,
      payload = _ref.payload,
      token = _ref.token,
      cb = _ref.cb,
      ctx = _ref.ctx;

  var headers = null;
  if (token) {
    headers = { 'Authorization': 'Bearer ' + token };
  }
  return (0, _axios2.default)({
    method: method,
    headers: headers,
    url: url,
    data: payload
  }).then(function (result) {
    if (result.data.error) {
      cb(new Error(result.data.error), ctx);
    } else {
      cb(null, ctx, result);
    }
  }).catch(function (e) {
    if (ctx.tries < MAX_TRIES) {
      setTimeout(function () {
        _axiosDo({ method: method, url: url, payload: payload, token: token, cb: cb, ctx: _extends({}, ctx, {
            tries: ctx.tries + 1
          }) });
      }, 500);
    } else {
      console.log("Exceeded max tries to send to API server. Giving up", e.message);
      cb(e, ctx);
    }
  });
};

var isExpired = function isExpired(token) {
  if (!token) {
    return true;
  }
  if (token.retrieveTime && Date.now() - token.retrieveTime > TOKEN_EXPIRATION) {
    return true;
  }
  return false;
};

var Connector = function () {
  function Connector(props) {
    var _this = this;

    _classCallCheck(this, Connector);

    (0, _props.propChecker)(props, Required);
    this.baseUrl = props.baseUrl;
    if (!this.baseUrl) {
      this.baseUrl = DEFAULT_URL;
    }

    this.apiKey = props.apiKey;
    this.tokenStorage = props.tokenStorage;
    this.token = null;

    if (typeof this.tokenStorage.read !== 'function') {
      throw new Error("Invalid tokenStorage provided");
    }
    if (typeof this.tokenStorage.write !== 'function') {
      throw new Error("Invalid tokenStorage provided");
    }
    ['post', 'postNoRetries', 'get', 'getNoRetries', '_doPost', '_doGet', '_getToken', '_resolveToken'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(Connector, [{
    key: 'post',
    value: function post(url, payload) {
      var ctx = {
        tries: 0
      };
      return this._doPost(url, payload, ctx);
    }
  }, {
    key: 'postNoRetries',
    value: function postNoRetries(url, payload) {
      var ctx = {
        tries: MAX_TRIES
      };

      return this._doPost(url, payload, ctx);
    }
  }, {
    key: '_doPost',
    value: function _doPost(url, payload, ctx) {
      var _this2 = this;

      return new Promise(function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(done, err) {
          var cb, u, token;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  cb = function cb(e, ctx, r) {
                    if (e) {
                      return err(e);
                    }
                    done(r);
                  };

                  if (!url.startsWith(_this2.baseUrl)) {
                    u = _this2.baseUrl + url;

                    url = u;
                  }
                  console.log("Posting to", url);
                  _context.prev = 3;
                  _context.next = 6;
                  return _this2._resolveToken();

                case 6:
                  token = _context.sent;
                  return _context.abrupt('return', _axiosDo({
                    method: "POST",
                    url: url,
                    payload: payload,
                    token: token.token,
                    cb: cb,
                    ctx: ctx }));

                case 10:
                  _context.prev = 10;
                  _context.t0 = _context['catch'](3);

                  err(_context.t0);

                case 13:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this2, [[3, 10]]);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'get',
    value: function get(url) {
      var ctx = {
        tries: 0
      };
      return this._doGet(url, ctx);
    }
  }, {
    key: 'getNoRetries',
    value: function getNoRetries(url) {
      var ctx = {
        tries: MAX_TRIES
      };
      return this._doGet(url, ctx);
    }
  }, {
    key: '_doGet',
    value: function _doGet(url, ctx) {
      var _this3 = this;

      return new Promise(function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(done, err) {
          var cb, u, token;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  cb = function cb(e, ctx, r) {
                    if (e) {
                      return err(e);
                    }
                    done(r);
                  };

                  _context2.prev = 1;

                  if (!url.startsWith(_this3.baseUrl)) {
                    u = _this3.baseUrl + url;

                    url = u;
                  }
                  _context2.next = 5;
                  return _this3._resolveToken();

                case 5:
                  token = _context2.sent;
                  return _context2.abrupt('return', _axiosDo({
                    method: "GET",
                    url: url,
                    token: token.token,
                    cb: cb,
                    ctx: ctx }));

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2['catch'](1);

                  err(_context2.t0);

                case 12:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this3, [[1, 9]]);
        }));

        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: '_getToken',
    value: function _getToken() {
      var _this4 = this;

      var url = this.baseUrl + API_ACCESS_URL + this.apiKey;
      var ctx = {
        tries: MAX_TRIES
      };

      return new Promise(function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(done, err) {
          var cb;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  cb = function cb(e, ctx, r) {
                    if (e) {
                      return err(e);
                    }
                    var token = {
                      token: r.data.token,
                      retrieveTime: Date.now()
                    };
                    _this4.tokenStorage.write(token);
                    done(token);
                  };

                  _axiosDo({
                    method: "GET",
                    url: url,
                    cb: cb,
                    ctx: ctx
                  });

                case 2:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this4);
        }));

        return function (_x5, _x6) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: '_resolveToken',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var token;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                token = this.token;

                if (token) {
                  _context4.next = 11;
                  break;
                }

                token = this.tokenStorage.read();
                if (typeof token === 'string') {
                  token = JSON.parse(token);
                }

                if (!(!token || isExpired(token))) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 7;
                return this._getToken();

              case 7:
                token = _context4.sent;

              case 8:
                this.token = token;
                _context4.next = 16;
                break;

              case 11:
                if (!isExpired(token)) {
                  _context4.next = 16;
                  break;
                }

                _context4.next = 14;
                return this._getToken();

              case 14:
                token = _context4.sent;

                this.token = token;

              case 16:
                return _context4.abrupt('return', token);

              case 17:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _resolveToken() {
        return _ref5.apply(this, arguments);
      }

      return _resolveToken;
    }()
  }]);

  return Connector;
}();

exports.default = Connector;