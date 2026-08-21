const cds = require('@sap/cds');
const licenseStore = require('./license/licenseStore');

licenseStore.init();

module.exports = cds.server;
