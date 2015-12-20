/// <reference path="../typings/tsd.d.ts"/>

import { ISchema, ISchemaKey } from './interfaces/ischema';

import * as Joi from 'joi';

import { Dino } from './dino';

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

    getName () : string {
        return this.name;
    }

    getSchema () : ISchema {
        return this.schema;
    }

    getKey () : ISchemaKey {
        return this.key;
    }

    getAttributes () : { [id : string] : any; } {
        return this.attributes;
    }
}
