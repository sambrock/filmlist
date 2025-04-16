import { useEventListener } from 'usehooks-ts';

import { redo, undo } from '../../stores/usePatchesStore';

export const RootLayout = (props: React.PropsWithChildren) => {
  useEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'z') {
      e.preventDefault();
      return redo();
    }

    if (e.metaKey && e.key === 'z') {
      e.preventDefault();
      return undo();
    }
  });
  return <div className="p-6">{props.children}</div>;
};
