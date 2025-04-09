/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ListsFilmIdImport } from './routes/lists/$filmId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ListsFilmIdRoute = ListsFilmIdImport.update({
  id: '/lists/$filmId',
  path: '/lists/$filmId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/lists/$filmId': {
      id: '/lists/$filmId'
      path: '/lists/$filmId'
      fullPath: '/lists/$filmId'
      preLoaderRoute: typeof ListsFilmIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/lists/$filmId': typeof ListsFilmIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/lists/$filmId': typeof ListsFilmIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/lists/$filmId': typeof ListsFilmIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/lists/$filmId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/lists/$filmId'
  id: '__root__' | '/' | '/lists/$filmId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ListsFilmIdRoute: typeof ListsFilmIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ListsFilmIdRoute: ListsFilmIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/lists/$filmId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/lists/$filmId": {
      "filePath": "lists/$filmId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
