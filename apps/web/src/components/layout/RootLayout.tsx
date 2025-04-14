import { useEventListener } from 'usehooks-ts';

import { useGlobalStore } from '../../stores/useGlobalStore/store';

const storeActions = useGlobalStore.getState().actions;

export const RootLayout = (props: React.PropsWithChildren) => {
  useEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'z') {
      console.log('REDO');
      e.preventDefault();
      storeActions.redo();
      return;
    }

    if (e.metaKey && e.key === 'z') {
      console.log('UNDO');
      e.preventDefault();
      storeActions.undo();
      return;
    }
  });
  return <div className="p-6">{props.children}</div>;
};
