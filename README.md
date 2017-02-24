# Magic Mirror Particle Device List

This module for the [MagicMirror](https://github.com/MichMich/MagicMirror) shows your Particle device list with customizable title and colors for online/offline status.

![Preview](/preview.png?raw=true)

## Installation

1\. Execute the following commands to install the module:

```bash
cd ~/MagicMirror/modules # navigate to module folder
git clone https://github.com/wgbartley/MMM-Particle-DeviceList.git # clone this repository
```

  2\. Then, add the following into the `modules` section of your `config/config.js` file:

````javascript
{
    module: 'MMM-Particle-DeviceList',
    position: 'top_left', // This can be any of the regions, best results in top left region
    config: {
        // See 'Configuration options' for more information.
    }
},
````


## Configuration options

All configuration items are optional except that you MUST include your username+password or your token.

The following properties can be configured:

| option | description |
| ------------- | ------------- |
| `username` | Particle username (usually e-mail address) |
| `password` | Particle password |
| `token` | Particle token - can be used in lieu of your username / password |
| `title` | A title for the device list - Defaults to "Particle Device List" |
| `online_color` | Color to use for online devices - Defaults to `#3dbbc4` |
| `offline_color` | Color to use for offline devices - Defaults to `#164032` |
