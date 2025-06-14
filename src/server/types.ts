import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { ContextVariableMap } from 'hono';

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, ContextVariableMap>;
