'use client';

import { createStore } from 'tinybase';

export const store = createStore();

store.setTable('lists', {
  1: {
    listId: 1,
    title: 'My List',
    description: 'This is my list',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  2: {
    listId: 2,
    title: 'My List 2',
    description: 'This is my list 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});
