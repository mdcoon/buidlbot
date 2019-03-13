'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var err = function err(msg) {
  throw new Error(err);
};

var propChecker = exports.propChecker = function propChecker(props, required) {
  required.forEach(function (p) {
    var v = props[p];
    var msg = "Missing property " + p;
    if (typeof v === 'undefined' || v === null) {
      err(msg);
    }
    if (typeof v === 'string') {
      if (v.trim().length === 0) {
        err(msg);
      }
    }
  });
};