'use strict';

var uuid = require('uuid');

module.exports = function() {
  return uuid().replace(/-/g, '');
};
