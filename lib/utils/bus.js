const events = require("node:events");
const util = require("node:util");
const debug = require("debug")("nodemon");

const Bus = function () {
  events.EventEmitter.call(this);
};

util.inherits(Bus, events.EventEmitter);

const bus = new Bus();

const collected = {};

bus.on("newListener", function (event) {
  debug("bus new listener: %s (%s)", event, bus.listeners(event).length);
  if (!collected[event]) {
    collected[event] = true;
    bus.on(event, function () {
      debug("bus emit: %s", event);
    });
  }
});

process.on("message", function (event) {
  debug("process.message(%s)", event);
  bus.emit(event);
});

const emit = bus.emit;

if (process.send) {
  bus.emit = function (event, data) {
    process.send({ type: event, data });
    emit.apply(bus, arguments);
  };
}

module.exports = bus;
