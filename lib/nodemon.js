// https://www.npmjs.com/package/debug
const debug = require("debug")("nodemon");
const path = require("node:path");
const utils = require("./utils");
const bus = utils.bus;
const cli = require("./cli");

function nodemon(settings) {
  bus.emit("boot");
  nodemon.reset();

  if (typeof settings === "string") {
    settings = settings.trim();
    if (settings.indexOf("node") !== 0) {
      if (settings.indexOf("nodemon") !== 0) {
        settings = "nodemon " + settings;
      }
      settings = "node " + settings;
    }
    settings = cli.parse(settings);
  }
}

nodemon.reset = function (done) {
  bus.emit("reset", done);
};
