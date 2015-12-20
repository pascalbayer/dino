/// <reference path="../typings/tsd.d.ts"/>

import { ISchema, ISchemaKey } from './interfaces/ischema';

import * as Joi from 'joi';

import { Dino } from './dino';

export class Schema {
    private name : string;
    private schema : ISchema;
    private key : ISchemaKey;

    constructor (schema : ISchema) {
        this.name = schema.name;
        this.schema = schema.attributes;
        this.key = schema.key;
    }

    getName () : string {
        return this.name;
    }

    getSchema () : ISchema {
        return this.schema;
    }

    getKey () : ISchemaKey {
        return this.key;
    }
}