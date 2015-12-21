/// <reference path="../typings/tsd.d.ts"/>

import { StringSchema, ObjectSchema, ArraySchema, NumberSchema, BooleanSchema, DateSchema } from 'joi';

import * as Joi from 'joi';

export class Type {
    public static Guid = Type.guid();
    public static String = Type.string();
    public static Object = Type.object();
    public static Array = Type.array();
    public static Number = Type.number();
    public static Boolean = Type.boolean();
    public static Date = Type.date();

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

    private static boolean () : BooleanSchema {
        return Joi.boolean();
    }

    private static date() : DateSchema {
        return Joi.date();
    }
}
