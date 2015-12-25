import { IClientConfig } from './interfaces/iclient';

import * as AWS from 'aws-sdk';

export class Dino {
    private static client : AWS.DynamoDB;
    private static documentClient : AWS.DynamoDB.DocumentClient;

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

    static getClient () : AWS.DynamoDB {
        return this.client;
    }

    static getDocumentClient () : AWS.DynamoDB.DocumentClient {
        return this.documentClient;
    }
}