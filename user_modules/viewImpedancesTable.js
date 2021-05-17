let wifi = require('node-wifi');

const impedancesTable = [
	{ Barrier: 'Wood', Interference: 'Low' },
	{ Barrier: 'Plaster', Interference: 'Low' },
	{ Barrier: 'Synthetic Material', Interference: 'Low' },
	{ Barrier: 'Glass', Interference: 'Low' },
	{ Barrier: 'Water', Interference: 'Medium' },
	{ Barrier: 'Bricks', Interference: 'Medium' },
	{ Barrier: 'Marble', Interference: 'Medium' },
	{ Barrier: 'Concrete', Interference: 'High' },
	{ Barrier: 'Metal', Interference: 'High' },
	{ Barrier: 'Mirror:', Interference: 'Very High' },
];

function viewImpedancesTable(invokedFromIndex = true) {
	if (!invokedFromIndex) wifi.init({ iface: null });

	console.table(impedancesTable);

	if (invokedFromIndex) require('../index')();
}

// Invoke automatically if this file is called directly from command line
if (require.main === module) viewImpedancesTable(false);

module.exports = viewImpedancesTable;
