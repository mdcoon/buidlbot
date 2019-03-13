'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = "/api/cache/graphql";

var Query = function () {
  function Query(props) {
    var _this = this;

    _classCallCheck(this, Query);

    this.query = props.query;
    this.connector = props.connector;
    ['exec'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(Query, [{
    key: 'exec',
    value: function exec() {
      return this.connector.post(URL, { query: this.query }).then(function (r) {
        return r.data;
      });
    }
  }]);

  return Query;
}();

var EventCache = function () {
  function EventCache(props) {
    var _this2 = this;

    _classCallCheck(this, EventCache);

    this.connector = props.connector;
    ['graphQL'].forEach(function (fn) {
      return _this2[fn] = _this2[fn].bind(_this2);
    });
  }

  _createClass(EventCache, [{
    key: 'graphQL',
    value: function graphQL(query) {
      return new Query({ query: query, connector: this.connector });
    }
  }]);

  return EventCache;
}();

exports.default = EventCache;