import { useCallback, useReducer, useRef } from 'react';
import { useDismiss, useFloating, useInteractions, useListNavigation, useRole } from '@floating-ui/react';
import { produce } from 'immer';

type Action =
  | {
      type: 'SET_OPEN';
      open: boolean;
    }
  | {
      type: 'SET_ACTIVE_INDEX';
      index: number | null;
    }
  | {
      type: 'INPUT_CHANGE';
      value: string;
    }
  | {
      type: 'INPUT_FOCUS';
    }
  | {
      type: 'INPUT_BLUR';
    };

type State = {
  open: boolean;
  activeIndex: number | null;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_OPEN': {
      return produce(state, (draft) => {
        draft.open = action.open;
      });
    }
    case 'SET_ACTIVE_INDEX': {
      return produce(state, (draft) => {
        draft.activeIndex = action.index === null ? 0 : action.index;
      });
    }
    case 'INPUT_FOCUS': {
      return produce(state, (draft) => {
        // draft.open = true;
      });
    }
    case 'INPUT_BLUR': {
      return produce(state, (draft) => {
        draft.open = false;
      });
    }
    case 'INPUT_CHANGE': {
      return produce(state, (draft) => {
        draft.open = action.value.length > 0;
        draft.activeIndex = 0;
      });
    }
    default:
      return state;
  }
};

const DEFAULT_STATE: State = {
  open: false,
  activeIndex: null,
};

type Props<T> = {
  items?: T[];
  onSelect?: (item: T) => void;
};

export const useCombobox = <T,>({ items, onSelect }: Props<T> = {}) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  const listRef = useRef<HTMLElement[]>([]);

  const floating = useFloating<HTMLInputElement>({
    open: true,
    onOpenChange: (open) => dispatch({ type: 'SET_OPEN', open }),
  });

  const listNavigation = useListNavigation(floating.context, {
    listRef,
    activeIndex: state.activeIndex,
    onNavigate: (index) => {
      dispatch({ type: 'SET_ACTIVE_INDEX', index });
    },
    loop: true,
    virtual: true,
  });

  const role = useRole(floating.context, { role: 'listbox' });
  const dismiss = useDismiss(floating.context);
  const interactions = useInteractions([role, dismiss, listNavigation]);

  const getInputProps = useCallback(
    (userProps?: React.HTMLProps<Element>): React.ComponentProps<'input'> => ({
      ref: floating.refs.setReference,
      ...interactions.getReferenceProps({
        ...userProps,
        onFocus: () => {
          dispatch({ type: 'INPUT_FOCUS' });
        },
        onBlur: (e) => {
          userProps?.onBlur?.(e);
          dispatch({ type: 'INPUT_BLUR' });
        },
        onChange: (e) => {
          userProps?.onChange?.(e);
          dispatch({ type: 'INPUT_CHANGE', value: (e.target as HTMLInputElement).value });
        },
        onKeyDown: (e) => {
          userProps?.onKeyDown?.(e);
          if (e.key === 'Enter' && state.activeIndex !== -1) {
            e.preventDefault();
            if (state.activeIndex !== null) {
              const item = items?.[state.activeIndex];
              if (item) {
                onSelect?.(item);
              }
            }
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            dispatch({ type: 'SET_OPEN', open: false });
          }
        },
      }),
    }),
    [state, items]
  );

  const getMenuProps = useCallback(
    (userProps?: React.ComponentProps<'div'>): React.ComponentProps<'div'> => ({
      ref: floating.refs.setFloating,
      ...interactions.getFloatingProps(userProps),
    }),
    [state]
  );

  const getItemProps = useCallback(
    (index: number, userProps?: React.ComponentProps<'div'>): React.ComponentProps<'div'> => ({
      ref: (node) => {
        if (node) {
          listRef.current[index] = node;
        }
      },
      ...interactions.getItemProps(userProps),
    }),
    [state]
  );

  return {
    ...state,
    getInputProps,
    getMenuProps,
    getItemProps,
    floating,
  };
};
