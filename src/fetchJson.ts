import * as vscode from 'vscode';
const config = require('../config.json');
const fetch: (url: string) => Promise<any> = require('make-fetch-happen').defaults({
    // path where cache will be written (and read)
    cachePath: `${config.cacheDir}`, 
});

// Function to make DockerHubAPI calls and return JSON data.
export function fetchJson(urlDockerHubAPICall: string) {
    return new Promise(resolve => {
        fetch(urlDockerHubAPICall)
        .then(response => {
            if(response.ok) response.json().then(resolve);
            else response.text().then((text: string | undefined) => {
                resolve(undefined);
                throw Error(text)
            });
        })
        .catch(error => {
            // Extract the first line from the Error stack trace.
            const firstLineError = String(error).split("\n")[0];
            const errorReason = firstLineError.slice(firstLineError.search(/reason/gi));
            vscode.window.showErrorMessage(errorReason.search(/getaddrinfo ENOTFOUND/gi) !== -1
                ? `FetchError (${errorReason}). Restarting Visual Studio Code may resolve this issue.`
                : firstLineError
            );
            resolve(undefined);
        });
    });
}