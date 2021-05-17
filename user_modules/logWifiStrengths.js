let wifi = require('node-wifi');
let inquirer = require('inquirer');
require('colors');

let loggedPlaces = [];

function logWifiStrengths(invokedFromIndex = true) {
	if (!invokedFromIndex) wifi.init({ iface: null });

	wifi.getCurrentConnections()
		.then(currentConnections => {
			if (currentConnections.length === 0) {
				console.warn('Not connected to any networks');
			} else {
				let currentConnection = currentConnections[0];
				verifyAndLogPlace(currentConnection, invokedFromIndex);
			}
		})
		.catch(error => console.error(error));
}

function verifyAndLogPlace(connectionDetails, invokedFromIndex) {
	let currentLoggedSsid =
		loggedPlaces.length > 0 ? loggedPlaces[0].ssid : null;

	if (!currentLoggedSsid || currentLoggedSsid === connectionDetails.ssid) {
		logPlace(connectionDetails, invokedFromIndex);
	} else {
		inquirer
			.prompt([
				{
					type: 'confirm',
					name: 'confirmResetLoggedPlaces',
					message:
						'Logged SSID does not match current SSID; do you want to reset logged places?',
				},
			])
			.then(answers => {
				let { confirmResetLoggedPlaces } = answers;

				if (confirmResetLoggedPlaces) {
					loggedPlaces.length = 0;
					logPlace(connectionDetails, invokedFromIndex);
				} else {
					console.warn('Connection not logged');
					logNewPlace(invokedFromIndex);
				}
			})
			.catch(inquirerError);
	}
}

function logPlace(connectionDetails, invokedFromIndex) {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'placeName',
				message: 'Set name for place',
			},
		])
		.then(answers => {
			let { placeName } = answers;

			let { ssid, quality, signal_level } = connectionDetails;

			loggedPlaces.push({ placeName, ssid, quality, signal_level });
			console.log(
				`Logged: '${placeName}' @ ${quality}% (${signal_level}dB)`,
			);

			logNewPlace(invokedFromIndex);
		})
		.catch(inquirerError);
}

function logNewPlace(invokedFromIndex) {
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'confirmLogNewPlace',
				message: 'Log new place?',
			},
		])
		.then(answers => {
			let { confirmLogNewPlace } = answers;

			if (confirmLogNewPlace) {
				logWifiStrengths(invokedFromIndex);
			} else {
				console.log(`\nSSID: ${loggedPlaces[0].ssid}`.bgGreen);
				loggedPlaces.forEach(place => {
					console.log(
						place.placeName.green,
						`${place.quality.toString().yellow}%`,
						`(${place.signal_level}dB)`.gray,
					);
				});

				if (invokedFromIndex) require('../index')();
			}
		})
		.catch(inquirerError);
}

function inquirerError(error) {
	if (error.isTtyError) {
		console.error('Requires interactive environment', error);
	} else {
		console.error(error);
	}
}

// Invoke automatically if this file is called directly from command line
if (require.main === module) logWifiStrengths(false);

module.exports = logWifiStrengths;
