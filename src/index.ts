import {CommandUsage} from './utilities/command-usage';

const os = require('os');

console.log(
    `Available scripts are: ${os.EOL}`,
    CommandUsage.chesscomGames,
);