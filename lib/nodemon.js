let debug = require("debug")("nodemon");
let path = require("path");
let util = require("util");
let utils = require("./utils");
let config = require("./config");
const defaults = require("./config/defaults");
let eventHandlers = {};

config.required = utils.isRequired;

function nodemon(settings) {}

module.exports = nodemon;
