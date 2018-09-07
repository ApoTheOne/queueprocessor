'use strict';
const core = require('./core');

module.exports.process = (event, context, callback) => {
    core.execute(callback);
};
