import * as request from 'request';
import * as _ from 'lodash';

export class ChessCom {

    // Chess.com Published-Data API
    protected static readonly apiBaseUrl: string = 'https://api.chess.com/pub';

    // Fetch data from the Chess.com's Published-Data API
    public static fetch(
        endpoint: string,
        options: { includeBaseUrl: boolean } = {includeBaseUrl: true}
    ): Promise<any> {

        let url = endpoint;
        if (_.get(options, 'includeBaseUrl')) {
            url = `${this.apiBaseUrl}/${url}`;
        }

        console.debug(`Making HTTP request to chess.com: ${url}`);

        const requestOptions: request.OptionsWithUrl = {
            url,
            method: 'GET',
            timeout: 1000 * 60, // Wait 60 seconds for response
            headers: {
                'content-type': 'application/json'
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            request(
                requestOptions,
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(body);
                }
            )
        });
    }

    // Returns the error message if the response object has message and code set
    public static getErrorMessage(response: { message: string, code: number }): any {
        if (response.code === 0 && response.message) {
            return response.message;
        }
        return null;
    }
}