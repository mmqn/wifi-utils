let wifi = require('node-wifi');
require('colors');

async function compareWifiChannels(invokedFromIndex = true) {
	if (!invokedFromIndex) wifi.init({ iface: null });

	let currentConnectionSsids = [];

	await wifi
		.getCurrentConnections()
		.then(currentConnections => {
			currentConnectionSsids = currentConnections.map(
				connection => connection.ssid,
			);
		})
		.catch(error => console.error(error));

	wifi.scan()
		.then(networks =>
			logNetworksByChannel(networks, currentConnectionSsids),
		)
		.then(() => invokedFromIndex && require('../index')())
		.catch(error => console.error(error));
}

function logNetworksByChannel(networks, currentConnectionSsids) {
	networks
		.sort((a, b) => a.channel - b.channel)
		.forEach(network =>
			console.log(
				`${network.channel}${
					currentConnectionSsids.includes(network.ssid)
						? ' [CURRENT]'
						: ''
				}`.green,
				network.ssid.yellow,
				`(${network.signal_level}dB)`.gray,
			),
		);
}

// Invoke automatically if this file is called directly from command line
if (require.main === module) compareWifiChannels(false);

module.exports = compareWifiChannels;
