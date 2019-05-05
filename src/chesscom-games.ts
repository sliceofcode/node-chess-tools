import {CommandUsage} from './utilities/command-usage';
import {ChessCom} from './utilities/chess-com';
import {Logger} from './utilities/logger';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import './config/config';
import {Zip} from './utilities/zip';

// Check if we have the required argument set
if (process.argv.length === 2) {
    console.error(`Error: Expected at least one argument! Usage: ${CommandUsage.chesscomGames}`);
    process.exit(1);
}

Logger.init();

const username = process.argv[2];

// Optionally use the 3rd argument as path
const directory = _.get(process, 'argv.3', path.resolve(`output/chesscom-games/${username}`));

const zipFile = path.resolve(`${directory}/../${username}-PGNs.zip`);

// Create the directory if it doesn't exist
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {recursive: true});
}

// Start by fetching the player's games archives URLs
let totalGamesSaved: number = 0;
ChessCom
    .fetch(`player/${encodeURIComponent(username)}/games/archives`)
    .then((response) => {
        // Check if the response is valid
        const errorMessage = ChessCom.getErrorMessage(response);
        if (errorMessage) {
            throw errorMessage;
        }

        // Get the archives URLs
        const archives = _.get(response, 'archives', []);
        console.log(`Found ${_.size(archives)} games archives`);

        let result = Promise.resolve();

        // Go through the archives
        _.forEach(archives, (archiveUrl) => {

            // Extract the month and year from the archive URL
            const yearMonthPath = archiveUrl.substr(-7).replace('/', '-');

            result = result.then(() => {

                console.log(`Fetching data for archive url: ${archiveUrl}`);
                // Fetch games data for the archive URL
                return ChessCom.fetch(archiveUrl, {includeBaseUrl: false})
                    .then((gamesResponse) => {
                        console.debug(`Got response for ${archiveUrl}`);

                        // Check if the response is valid
                        const errorMessage = ChessCom.getErrorMessage(response);
                        if (errorMessage) {
                            throw errorMessage;
                        }

                        // Go through the games in the game archive
                        const games = _.get(gamesResponse, 'games', []);
                        console.log(`Found ${_.size(games)} games for archive ${archiveUrl.substr(-7)}`);
                        let savedPGNs: number = 0;
                        _.forEach(games, (game) => {
                            // Check if there is valid game id (extracted from the URL)
                            const gameId = /[^/]*$/.exec(game.url)[0];
                            if (!gameId) {
                                console.error('Game id not found, not doing anything');
                                return;
                            }

                            // We only want to download chess game types for now
                            if (_.get(game, 'rules') !== 'chess') {
                                console.debug('Skipping non Chess game type, game id ${gameId}');
                                return;
                            }

                            // Check if the data contains PGN
                            const pgn = _.get(game, 'pgn');
                            if (!pgn) {
                                console.debug(`PGN not found for game id ${gameId}`);
                            }

                            // Increase the current saved PGNs count for this archive
                            savedPGNs++;

                            // Check if the game PGN file already exists
                            const filePath = `${directory}/${yearMonthPath}-${gameId}.pgn`;
                            if (fs.existsSync(filePath)) {
                                console.debug(`PGN file for game ${gameId} already exists`);
                                return;
                            }

                            // Finally, save the PGN as a file where the filename is the game id
                            fs.writeFileSync(filePath, pgn);
                            console.debug(`PGN file for game ${gameId} saved as ${filePath}`);

                        });

                        console.log(`Saved ${savedPGNs} game PGNs for archive ${archiveUrl.substr(-7)}`);

                        // Increase the total amount
                        totalGamesSaved += savedPGNs;
                    });

            });
        });

        return result;

    })
    .then(() => {
        console.log(`Total of ${totalGamesSaved} PGNs were saved in directory: ${directory}`);
        console.log(`Saving all PGN files in a ZIP file: ${zipFile}`);
        Zip.zipDirectoryFiles(directory, zipFile, `${username}/`);
    })
    .catch((error) => {
        console.error(`Error: `, error);
    })
;