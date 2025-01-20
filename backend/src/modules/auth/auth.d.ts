import { Elysia } from 'elysia';
import { type JWTPayload, type JWSHeaderParameters, type KeyLike } from 'jose';
import type { Static, TSchema } from '@sinclair/typebox';

export interface IUserJWT {
  id: number,
  email: string,
  username: string,
  created_at: Date,
}

type ModifiedWTPayloadSpec = Omit<JWTPayloadSpec, 'sub'> & {
  sub: IUserJWT
}

export interface IJwt {
  readonly sign: (morePayload: Record<string, string | number | object> & ModifiedWTPayloadSpec) => Promise<string>;
  readonly verify: (jwt?: string) => Promise<false | (Record<string, string | number> & ModifiedWTPayloadSpec)>;
}

declare const TJwt: <const Name extends string = "jwt", const Schema extends TSchema | undefined = undefined>({ name, secret, alg, crit, schema, nbf, exp, ...payload }: JWTOption<Name, Schema>) => Elysia<"", {
    decorator: ({ 
      [name in Name extends string ? Name : "jwt"]: IJwt
    } extends infer T extends Object ? { [key in keyof T as key extends never ? never : key]: { 
      [name in Name extends string ? Name : "jwt"]: IJwt
     }[key]; } : never) extends infer Collision ? {} extends Collision ? {} : { [K in keyof ({} & Collision)]: ({} & Collision)[K]; } : never;
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: import("@sinclair/typebox").TModule<{}>;
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;