let wifi = require('node-wifi');

function viewCurrentConnections(invokedFromIndex = true) {
	if (!invokedFromIndex) wifi.init({ iface: null });

	wifi.getCurrentConnections()
		.then(currentConnections => console.log(currentConnections))
		.then(() => invokedFromIndex && require('../index')())
		.catch(error => console.error(error));
}

// Invoke automatically if this file is called directly from command line
if (require.main === module) viewCurrentConnections(false);

module.exports = viewCurrentConnections;
