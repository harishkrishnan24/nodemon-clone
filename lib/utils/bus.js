let events = require("events");
let debug = require("debug")("nodemon");
let util = require("util");

let Bus = function () {
  events.EventEmitter.call(this);
};

util.inherits(Bus, events.EventEmitter);

let bus = new Bus();

let collected = {};

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

let emit = bus.emit;

if (process.send) {
  bus.emit = function (event, data) {
    process.send({ type: event, data });
    emit.apply(bus, arguments);
  };
}

module.exports = bus;
