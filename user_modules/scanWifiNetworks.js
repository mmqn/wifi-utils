let wifi = require('node-wifi');

function scanWifiNetworks(invokedFromIndex = true) {
	if (!invokedFromIndex) wifi.init({ iface: null });

	wifi.scan()
		.then(networks => console.log(networks))
		.then(() => invokedFromIndex && require('../index')())
		.catch(error => console.error(error));
}

// Invoke automatically if this file is called directly from command line
if (require.main === module) scanWifiNetworks(false);

module.exports = scanWifiNetworks;
