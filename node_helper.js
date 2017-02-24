var NodeHelper = require("node_helper");
var Particle = require('particle-api-js');
var particle = new Particle();
module.exports = NodeHelper.create({
	devices: {},
	token: undefined,

	start: function() {
		// Nothing to do here, move along
	},


	// Receive notifications from the front-end
	socketNotificationReceived: function(notification, payload) {
		if(notification === "AUTHENTICATE")
			this.authenticate(payload.username, payload.password);

		else if(notification === "SET_TOKEN")
			this.setToken(payload);

		else if(notification === "LIST_DEVICES")
			this.listDevices();
	},


	// Authenticate with user/pass
	authenticate: function(username, password) {
		var self = this;

		particle.login({
			"username": username,
			"password": password
		}).then(
			function(data) {
				self.token = data.body.access_token;

				self.sendSocketNotification("AUTHENTICATE", {
					success: true
				});
			},
			function(err) {
				self.sendSocketNotification("AUTHENTICATE", {
					success: false,
					error: err.shortErrorDescription
				});
			}
		)
	},


	// Get the list of devices!
	listDevices: function() {
		var self = this;

		particle.listDevices({auth:self.token}).then(
			function(data) {
				devices = data.body;
				self.sendSocketNotification("DEVICES", {
					success: true,
					devices: devices
				});
			},
			function(err) {
				self.sendSocketNotification("DEVICES", {
					success: false,
					error: err.shortErrorDescription
				});
			}
		)
	},


	// Set the token provided by the front-end
	setToken: function(token) {
		this.token = token;

		this.sendSocketNotification("SET_TOKEN", true);
	}
});
