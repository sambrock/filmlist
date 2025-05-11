'use client';

import { createRemotePersister } from 'tinybase/persisters/persister-remote';
import { useCell } from 'tinybase/ui-react';

// import { WebSocket } from 'ws';

import { store } from '@/store/tinybase';

const persister = createRemotePersister(
  store,
  'http://localhost:8787/v1/init',
  'http://localhost:8787/v1/save'
);

store.addDidFinishTransactionListener((t) => {
  const [cellsTouched, valuesTouched] = t.getTransactionLog();
  const [changes] = t.getTransactionChanges();
  console.log('CHANGED', changes);
});

export default function TinyBasePage() {
  // const list = store.getRow('lists', '1');
  const title = useCell('lists', '1', 'title', store);

  // createWsSynchronizer(store, new WebSocket('ws://localhost:8787/v1/ws')).then((sync) => {
  //   console.log('Synchronizer created');
  //   sync.startSync();
  // });

  // const persister = createSessionPersister(store, 'lists');

  // persister.startAutoSave();

  // store.addTableListener('lists', async (table) => {
  //   await persister.save();
  // });

  return (
    <div>
      <h1>{title}</h1>
      <input
        onChange={async (e) => {
          // store.setCell('lists', '1', 'title', e.target.value);
          store.transaction(
            () => {
              store.setCell('lists', '1', 'title', e.target.value);
              // store.setCell('lists', '2', 'title', e.target.value + '2');
            }
            // () => {
            //   const [, , changedCells, invalidCells] = store.getTransactionLog();
            //   console.log(store.getTables());
            //   // -> {pets: {fido: {species: 'dog', color: 'black', sold: true}}}
            //   console.log(changedCells);
            //   // -> {pets: {fido: {color: ['brown', 'black']}}}
            //   // console.log(invalidCells);
            //   // -> {pets: {fido: {eyes: [['left', 'right']], buyer: [{name: 'Bob'}]}}}
            //   return invalidCells['pets'] != null;
            // }
          );

          await persister.save();
        }}
      />
    </div>
  );
}
