import * as _ from 'lodash';


let config = {
    debug: false
};

try {
    const customConfig = require('../../config/config.json');
    config = _.extend(config, customConfig);
} catch (e) {
    // We don't care as we have a default config
}

global.myConfig = config;