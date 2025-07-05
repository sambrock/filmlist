import { createApp } from './init';
import * as chat from './routes/chat.route';
import * as getMessages from './routes/get-messages.route';

export type AppType = typeof app;

export const app = createApp();

app.openapi(chat.route, chat.handler);
app.openapi(getMessages.route, getMessages.handler);

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API',
  },
});
