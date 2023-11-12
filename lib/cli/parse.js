const fs = require("node:fs");

function parse(argv) {
  const args = argv.slice(2);
  let script = null;
  let nodemonOptions = { scriptPosition: null };
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
    }
  }

  console.log(args);
}

module.exports = parse;
