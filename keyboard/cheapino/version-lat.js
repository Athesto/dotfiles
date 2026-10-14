var fs = require("fs");
var path = require("path");

// Reapply metadata to a fresh Vial export without rebuilding its keymap.
var file = process.argv[2] || path.join(__dirname, "cheapino-lat.vil");
var raw = fs.readFileSync(file, "utf8");
var config = JSON.parse(raw);
var uid = raw.match(/"uid"\s*:\s*(\d+)/)[1];
var version = process.argv[3] || (config.metadata && config.metadata.version) || "0.1.0";
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Use a version such as 0.1.0");
config.metadata = Object.assign({}, config.metadata, {
  name: "Cheapino LAT",
  version: version,
  host_layout: (config.metadata && config.metadata.host_layout) || "Español Latinoamérica",
});
fs.writeFileSync(file, JSON.stringify(config).replace(/"uid":\d+/, '"uid":' + uid) + "\n");
