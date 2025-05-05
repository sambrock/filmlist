import { default as HttpStatus } from 'http-status';

import pjson from '../../package.json';

export const STATUS_CODE = HttpStatus;

export const API_DOCS_PATH = '/docs';
export const API_DOCS_JSON_PATH = '/docs.json';
export const API_DOCS_TITLE = 'Filmlist API';
export const API_DOCS_VERSION = pjson.version;
