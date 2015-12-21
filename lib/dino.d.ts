export interface IClientConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    endpoint?: string;
}

export declare class Dino {
    private static client;
    static setClient(client: any): void;
    static getClient(): any;
}

/// <reference path="../typings/tsd.d.ts" />
import { IClientConfig } from './interfaces/iclient';
export declare class Client {
    constructor(config: IClientConfig);
}

export interface ISchemaKey {
    hash: string;
    range?: string;
    secondary?: string;
}
export interface ISchema {
    name: string;
    attributes: {
        [id: string]: any;
    };
    key: ISchemaKey;
}

/// <reference path="../typings/tsd.d.ts" />
import { ISchema, ISchemaKey } from './interfaces/ischema';
export declare class Schema {
    private name;
    private schema;
    private key;
    private attributes;
    constructor(schema: ISchema);
    getName(): string;
    getSchema(): ISchema;
    getKey(): ISchemaKey;
    getAttributes(): {
        [id: string]: any;
    };
}

/// <reference path="../typings/tsd.d.ts" />
import { StringSchema, ObjectSchema, ArraySchema, NumberSchema } from 'joi';
export declare class Type {
    static Guid: StringSchema;
    static String: StringSchema;
    static Object: ObjectSchema;
    static Array: ArraySchema;
    static Number: NumberSchema;
    private static string();
    private static object();
    private static array();
    private static number();
    private static guid();
}

/// <reference path="../typings/tsd.d.ts" />
import { Schema } from './schema';
import { Client } from './client';
export declare class Model {
    private schema;
    private client;
    private data;
    constructor(schema: Schema, client?: Client);
    create(data: {
        [id: string]: any;
    }): Model;
    save(callback: Function): Model;
}

export { Client } from './client';
export { Schema } from './schema';
export { Model } from './model';
export { Type } from './type';

/// <reference path="../typings/tsd.d.ts" />
