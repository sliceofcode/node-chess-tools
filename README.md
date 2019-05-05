# Node Chess Tools

This repository contains chess related tools/scripts which run on Node.

Pre-requisites: 
- `NodeJS 10.15`

### Download Chess.com Games Archive 
To download your games archive from [www.chess.com](https://www.chess.com), just run the following command: 

`npm run chesscom-games <username>`

This will request your games archives from their API and save each game PGN as a file and create a ZIP file with all PGNs. 