'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Abstraction that determines the best way to store a JWT token
  * for reuse. If a local file system is available, that will be
  * used. Otherwise, localStorage is checked. If neither exist,
  * token cannot be stored or retrieved.
**/
var LocalTokenStorage = function () {
  /**
    * Constructor options requires a 'keyPath' property. This is
    * either going to be the filename assigned to the token file
    * if a file system is available, or the key in localStorage.
    */
  function LocalTokenStorage(props) {
    var _this = this;

    _classCallCheck(this, LocalTokenStorage);

    this.keyPath = props.keyPath;
    if (!this.keyPath) {
      throw new Error("Missing keyPath property");
    }
    if (_os2.default && typeof _os2.default.tmpdir === 'function') {
      var homeDir = _os2.default.homedir();
      var keyPart = props.keyPath.replace(/\//g, "_");
      keyPart = keyPart.replace(/\n/g, "");
      keyPart = keyPart.replace(/\s/g, "");
      this.keyPath = _path2.default.join(homeDir, '.buidlhub', keyPart);
      var dir = _path2.default.join(homeDir, '.buidlhub');
      if (!_fs2.default.existsSync(dir)) {
        _fs2.default.mkdirSync(dir);
      }
    }
    ['read', 'write'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  /**
    * Write the given token to storage. If not a string, it will be
    * converted to string first.
    */


  _createClass(LocalTokenStorage, [{
    key: 'write',
    value: function write(token) {
      if (!token) {
        return;
      }
      if (typeof token !== 'string') {
        token = JSON.stringify(token);
      }
      if (_fs2.default && typeof _fs2.default.writeFileSync === 'function') {
        _fs2.default.writeFileSync(this.keyPath, token);
        return true;
      }
      if (localStorage && typeof localStorage.setItem === 'function') {
        localStorage.setItem(this.keyPath, token);
        return true;
      }
      return false;
    }

    /**
      * Read a previously stored token. A string is returned so if the token
      * is a complex object, it must be parsed after this method.
      */

  }, {
    key: 'read',
    value: function read() {
      if (_fs2.default && typeof _fs2.default.readFileSync === 'function') {
        if (!_fs2.default.existsSync(this.keyPath)) {
          return null;
        }
        var buf = _fs2.default.readFileSync(this.keyPath);
        return buf.toString();
      }
      if (localStorage && typeof localStorage.getItem === 'function') {
        return localStorage.getItem(this.keyPath);
      }
      return null;
    }
  }]);

  return LocalTokenStorage;
}();

exports.default = LocalTokenStorage;