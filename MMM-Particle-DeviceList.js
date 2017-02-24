Module.register("MMM-Particle-DeviceList", {
    // Default module config.
    defaults: {
        title: 'Particle Device List',
        username: '',
		password: '',
		token: '',
        online_color: '#3dbbc4',
        offline_color: '#164032',
        update_interval: 5 * 60 * 1000 // Default 5 minutes
    },

    state: 0,
    devices: {},


    start: function() {
        var self = this;

        // Make sure the update_interval is reasonable (minimum 30 seconds)
        if(this.config.update_interval < 30 * 1000)
            this.config.update_interval = 30 * 1000;


        // If we don't have a token, use the user/pass to get one
        if(this.config.token.length==0) {
            this.state = 0;

    		this.sendSocketNotification("AUTHENTICATE", {
    			username: this.config.username,
    			password: this.config.password
    		});

        // If we do have a token, set it in the helper
        } else {
            this.state = 1;
            this.sendSocketNotification("SET_TOKEN", this.config.token);
        }

        // Refresh list at an interval
        setInterval(function() {
            self.sendSocketNotification("LIST_DEVICES");
        }, self.config.update_interval);
	},


    // DOM DOM DOM
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = '';

        if(this.config.title.length>0)
            wrapper.innerHTML += '<div style="font-weight:bold">'+this.config.title+'</div>';

        switch(this.state) {
            case 0:
                wrapper.innerHTML += "Authenticating...";
                break;

            case 1:
                wrapper.innerHTML += "Retrieving device list...";
                break;

            case 2:
                wrapper.innerHTML += this.generateDeviceList();
                break;

            case -1:
                wrapper.innerHTML += this.error;
                break;
        }

        return wrapper;
    },


    generateDeviceList: function() {
        var self = this;

        var html = '<ul style="list-style-type:none; margin:0; padding:0; font-size:50%">';

        // Sort by name
        this.devices.sort(function(a,b){
            var x = a.name < b.name? -1:1;
            return x;
        });

        this.devices.forEach(function(device) {
            var color = self.config.offline_color;

            if(device.connected===true)
                color = self.config.online_color;

            html += '<li style="margin:0; padding:0; line-height:1.5em; color:'+color+'">'+device.name+'</li>';
        });

        html += '</ul>';

        return html;
    },


	socketNotificationReceived: function(notification, payload) {
        // Post-auth, send request to list the devices
		if(notification === "AUTHENTICATE") {
            if(payload.success===true) {
                this.state = 1;
			    this.sendSocketNotification("LIST_DEVICES");
            } else {
                this.state = -1;
                this.error = payload.error;
            }

            this.updateDom();

        // Post-token, send request to list the devices
        } else if(notification === "SET_TOKEN") {
            this.state = 1;
            this.sendSocketNotification("LIST_DEVICES");

        // Device list!
        } else if(notification === "DEVICES") {
            if(payload.success===true) {
                this.state = 2;
                this.getDevices(payload.devices);
            } else {
                this.state = -1;
                this.error = payload.error;
            }
        }

        this.updateDom();
	},


    getDevices: function(devices) {
        this.devices = devices;
        this.updateDom();
    }
});
