import type { ElysiaWS } from "elysia/ws";
import type { Context } from '../context';
import { AfterHandler, AfterResponseHandler, BaseMacro, ContentType, DocumentDecoration, ErrorHandler, InputSchema, Isolate, MapResponse, MaybeArray, MaybePromise, OptionalHandler, Prettify, RouteSchema, SingletonBase, TransformHandler } from '../types';

type TWS =  ElysiaWS<Context, Omit<Route, 'body'> & {body: never;}>;