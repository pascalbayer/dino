/// <reference path="../typings/joi/joi.d.ts"/>

import { StringSchema, ObjectSchema, ArraySchema, NumberSchema } from 'joi';

import * as Joi from 'joi';

export class Type {
    public static Guid = Type.guid();
    public static String = Type.string();
    public static Object = Type.object();
    public static Array = Type.array();
    public static Number = Type.number();

    private static string () : StringSchema {
        return Joi.string();
    }

    private static object () : ObjectSchema {
        return Joi.object();
    }

    private static array () : ArraySchema {
        return Joi.array();
    }

    private static number () : NumberSchema {
        return Joi.number();
    }

    private static guid () : StringSchema {
        return Joi.string().guid();
    }
}