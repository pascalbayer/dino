/// <reference path="../typings/tsd.d.ts"/>

import { Schema } from './schema';
import { Client } from './client';
import { Type } from './type';
import { Dino } from './dino';

import * as Joi from 'joi';
import * as Uuid from 'uuid';

export class Model {
    private schema : Schema;
    private client : Client;
    private data : { [id : string] : any; };

    constructor (schema : Schema, client? : Client) {
        this.schema = schema;
        this.client = client || Dino.getClient();
    }

    public create (data : { [id : string] : any; }) : this {
        for (let key in this.schema.getSchema()) {
            if (!data[key]) {
                data[key] = Uuid.v4();
            }
        }

        let result = Joi.validate(data, this.schema.getSchema());

        if (!result.error) {
            this.data = data;
        }
        else {
            console.error(result.error);
        }

        return this;
    }

    public save (callback : Function) : this {
        Dino.getClient().put({
            TableName: this.schema.getName(),
            Item: Object.assign({}, this.data)
        }, function(err, data) {
            typeof callback === 'function' && callback(err, data);
        });

        return this;
    }
}