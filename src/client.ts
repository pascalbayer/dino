/// <reference path="../typings/tsd.d.ts"/>

import { IClientConfig } from './interfaces/iclient';

import { Dino } from './dino';

export class Client {
    constructor(config: IClientConfig) {
        Dino.setClientConfig(config);
    }
}
