import { useEventListener } from 'usehooks-ts';

import { dispatch } from '../../stores/useGlobalStore/store';

export const RootLayout = (props: React.PropsWithChildren) => {
  useEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'z') {
      console.log('REDO');
      dispatch({ type: 'REDO' });
      return;
    }

    if (e.metaKey && e.key === 'z') {
      console.log('UNDO');
      dispatch({ type: 'UNDO' });
      return;
    }
  });
  return <div className="p-6">{props.children}</div>;
};
