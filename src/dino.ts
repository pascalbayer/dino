import { IClientConfig } from './interfaces/iclient';

import * as AWS from 'aws-sdk';

export class Dino {
    private static client : any;
    private static documentClient : any;

    static setClientConfig (config : IClientConfig) : void {
        this.client = new AWS.DynamoDB({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        });

        this.documentClient = new AWS.DynamoDB.DocumentClient({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        });
    }

    static getClient () : any {
        return this.client;
    }

    static getDocumentClient () : any {
        return this.documentClient;
    }
}