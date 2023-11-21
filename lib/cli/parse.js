const fs = require("node:fs");
const path = require("node:path");

function parse(argv) {
  if (typeof argv === "string") {
    argv = argv.split(" ");
  }

  const eat = function (i, args) {
    if (i <= args.length) {
      return args.splice(i + 1, 1).pop();
    }
  };

  const args = argv.slice(2);
  let script = null;
  const nodemonOptions = { scriptPosition: null };

  const nodemonOpt = nodemonOption.bind(null, nodemonOptions);
  let lookForArgs = true;

  for (let i = 0; i < args.length; i++) {
    if (!script) {
      if (args[i] === "." || fs.existsSync(args[i])) {
        script = args.slice(i, 1).pop();
        nodemonOptions.scriptPosition = i;
        i--;
        continue;
      }
    }

    if (lookForArgs) {
      if (args[i] === "--") {
        args.splice(i, 1);
        nodemonOptions.scriptPosition = i;
        i--;
        lookForArgs = false;
        continue;
      }

      if (nodemonOpt(args[i], eat.bind(null, i, args)) !== false) {
        args.splice(i, 1);
        i--;
      }
    }
  }

  nodemonOptions.script = script;
  nodemonOptions.args = args;

  return nodemonOptions;
}

function nodemonOption(options, arg, eatNext) {
  if (arg === "--help" || arg === "-h" || arg === "-?") {
    const help = eatNext();
    options.help = help ? help : true;
  } else if (arg === "--version" || arg === "-v") {
    options.version = true;
  } else if (arg === "--no-update-notifier") {
    options.noUpdateNotifier = true;
  } else if (arg === "--spawn") {
    options.spawn = true;
  } else if (arg === "--dump") {
    options.dump = true;
  } else if (arg === "--verbose" || arg === "-V") {
    options.verbose = true;
  } else if (arg === "--legacy-watch" || arg === "-L") {
    options.legacyWatch = true;
  } else if (arg === "--polling-interval" || arg === "-P") {
    options.pollingInterval = parseInt(eatNext(), 10);
  } else if (arg === "--js") {
    // deprecated as this in `on` by default
    options.js = true;
  } else if (arg === "--quiet" || arg === "-q") {
    options.quiet = true;
  } else if (arg === "--config") {
    options.configFile = eatNext();
  } else if (arg === "--watch" || arg === "-w") {
    if (!options.watch) {
      options.watch = [];
    }
    options.watch.push(eatNext());
  } else if (arg === "--ignore" || arg === "-i") {
    if (!options.ignore) {
      options.ignore = [];
    }
    options.ignore.push(eatNext());
  } else if (arg === "--exitcrash") {
    options.exitcrash = true;
  } else if (arg === "--delay" || arg === "-d") {
    options.delay = parseDelay(eatNext());
  } else if (arg === "--exec" || arg === "-x") {
    options.exec = eatNext();
  } else if (arg === "--no-stdin" || arg === "-I") {
    options.stdin = false;
  } else if (arg === "--on-change-only" || arg === "-C") {
    options.runOnChangeOnly = true;
  } else if (arg === "--ext" || arg === "-e") {
    options.ext = eatNext();
  } else if (arg === "--no-colours" || arg === "--no-colors") {
    options.colours = false;
  } else if (arg === "--signal" || arg === "-s") {
    options.signal = eatNext();
  } else if (arg === "--cwd") {
    options.cwd = eatNext();

    process.chdir(path.resolve(options.cwd));
  } else {
    return false;
  }
}

function parseDelay(value) {
  const millisPerSecond = 1000;
  let millis = 0;

  if (value.match(/^d*ms$/)) {
    millis = parseInt(value, 10);
  } else {
    millis = parseFloat(value) * millisPerSecond;
  }

  return isNaN(millis) ? 0 : millis;
}

module.exports = parse;
