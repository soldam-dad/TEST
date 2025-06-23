var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');

var envyml = `${ROOT}/env.yml`;
let env = yaml.safeLoad(fs.readFileSync(envyml,'utf8'));

for(var key in env) {
	global[key] = env[key];
}

require('./logging');

function configure(callback) {
	global.SCHEMA = {};
	let scfiles = fs.readdirSync(path.resolve(`${ROOT}/schema`));

	scfiles.forEach( file => {
		let id = file.replace('.js', '');
		console.log("Load Schema file :" + id + ".js");
		global.SCHEMA[id] = require(`../schema/${file}`);

	});

	callback && callback();

}

module.exports = configure