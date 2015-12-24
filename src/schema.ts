/// <reference path="../typings/tsd.d.ts"/>

import { ISchema, ISchemaKey, IUnitConfig } from './interfaces/ischema';

import * as Joi from 'joi';

import { Dino } from './dino';
import { Type } from './type';

export class Schema {
    private name : string;
    private schema : ISchema;
    private key : ISchemaKey;
    private attributes: { [id : string] : any; };

    constructor (schema : ISchema) {
        this.name = schema.name;
        this.schema = schema;
        this.key = schema.key;
        this.attributes = schema.attributes;
    }

    public getName () : string {
        return this.name;
    }

    public getSchema () : ISchema {
        return this.schema;
    }

    public getKey () : ISchemaKey {
        return this.key;
    }

    public getAttributes () : { [id : string] : any; } {
        return this.attributes;
    }

    public createTable (config : IUnitConfig = null, callback : Function = null) : void {
        let schema = {
            TableName: this.getName(),
            KeySchema: [],
            AttributeDefinitions: [],
            ProvisionedThroughput: {
                ReadCapacityUnits: config && config.readUnits || 5,
                WriteCapacityUnits: config && config.writeUnits || 5
            }
        }

        for (let key in this.getKey()) {
            schema.KeySchema.push({
                AttributeName: this.getKey()[key],
                KeyType: key.toUpperCase()
            });
        }

        for (let attribute in this.getAttributes()) {
            for (let key of schema.KeySchema) {
                if (key.AttributeName == attribute) {
                    schema.AttributeDefinitions.push({
                        AttributeName: attribute,
                        AttributeType: Type.getTypeMapping(this.getAttributes()[attribute])
                    });
                }
            }
        }

        Dino.getClient().createTable(schema, function(err, data) {
            typeof callback === 'function' && callback(err, data);
        });
    }
}
