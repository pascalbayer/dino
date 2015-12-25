export interface IClientConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    endpoint?: string;
}

import { IClientConfig } from './interfaces/iclient';
import * as AWS from 'aws-sdk';
export declare class Dino {
    private static client;
    private static documentClient;
    static setClientConfig(config: IClientConfig): void;
    static getClient(): AWS.DynamoDB;
    static getDocumentClient(): AWS.DynamoDB.DocumentClient;
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
export interface IUnitConfig {
    readUnits: number;
    writeUnits: number;
}

/// <reference path="../typings/tsd.d.ts" />
import { Schema, StringSchema, ObjectSchema, ArraySchema, NumberSchema, BooleanSchema, DateSchema } from 'joi';
export declare class Type {
    static Guid: StringSchema;
    static String: StringSchema;
    static Object: ObjectSchema;
    static Array: ArraySchema;
    static Number: NumberSchema;
    static Boolean: BooleanSchema;
    static Date: DateSchema;
    static getTypeMapping(type: Schema): string;
    private static string();
    private static object();
    private static array();
    private static number();
    private static guid();
    private static boolean();
    private static date();
}

/// <reference path="../typings/tsd.d.ts" />
import { ISchema, ISchemaKey, IUnitConfig } from './interfaces/ischema';
export declare class Schema {
    protected name: string;
    protected schema: ISchema;
    protected key: ISchemaKey;
    protected attributes: {
        [id: string]: any;
    };
    constructor(schema: ISchema);
    getName(): string;
    getSchema(): ISchema;
    getKey(): ISchemaKey;
    getAttributes(): {
        [id: string]: any;
    };
    createTable(config?: IUnitConfig, callback?: Function): void;
    deleteTable(callback?: Function): void;
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
