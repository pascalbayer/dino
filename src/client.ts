/// <reference path="../typings/tsd.d.ts"/>

import { IClientConfig } from './interfaces/iclient';

import * as AWS from 'aws-sdk';

import { Dino } from './dino';

export class Client {
    constructor(config:IClientConfig) {
        Dino.setClient(new AWS.DynamoDB.DocumentClient({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        }));
    }
}
