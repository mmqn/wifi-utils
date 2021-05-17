let wifi = require('node-wifi');
let inquirer = require('inquirer');

const userModulesMap = {
	'View Current Connections': require('./user_modules/viewCurrentConnections'),
	'Scan Wifi Networks': require('./user_modules/scanWifiNetworks'),
	'Compare Wifi Channels': require('./user_modules/compareWifiChannels'),
	'Log Wifi Strengths': require('./user_modules/logWifiStrengths'),
	'View Impedances Table': require('./user_modules/viewImpedancesTable'),
};

function WifiUtilsApp() {
	wifi.init({ iface: null });

	console.log(); // Adds blank line

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'selectedModule',
				message: 'Select module to execute',
				choices: [...Object.keys(userModulesMap), 'Exit'],
			},
		])
		.then(answers => {
			let { selectedModule } = answers;

			if (selectedModule !== 'Exit') {
				let targetModule = userModulesMap[selectedModule];
				if (targetModule) targetModule();
				else console.error('Module not found');
			}
		})
		.catch(error => {
			if (error.isTtyError) {
				console.error('Requires interactive environment', error);
			} else {
				console.error(error);
			}
		});
}

WifiUtilsApp();

module.exports = WifiUtilsApp;
