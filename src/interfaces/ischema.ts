export interface ISchemaKey {
    hash : string;
    range? : string;
    secondary : string;
}

export interface ISchema {
    name : string;
    attributes : { [id : string] : any; };
    key : ISchemaKey;
}