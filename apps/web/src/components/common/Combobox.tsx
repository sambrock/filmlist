'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  FloatingFocusManager,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  type UseFloatingReturn,
  type UseInteractionsReturn,
} from '@floating-ui/react';
import { Slot } from 'radix-ui';

type ComboboxContext = {
  floating: UseFloatingReturn;
  listRef: React.RefObject<HTMLElement[]>;

  open: boolean;
  activeIndex: number;
  setOpen: (open: boolean) => void;
  setActiveIndex: (index: number) => void;

  onItemSelect?: (index: number) => void;

  getReferenceProps: UseInteractionsReturn['getReferenceProps'];
  getFloatingProps: UseInteractionsReturn['getFloatingProps'];
  getItemProps: UseInteractionsReturn['getItemProps'];
};

const ComboboxContext = createContext<ComboboxContext | undefined>(undefined);

const useComboboxContext = () => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('useComboboxContext scan only be used inside Combobox');
  }
  return context;
};

type ComboboxProps<T> = {
  items: T[];
  onItemSelect?: (index: number) => void;
};

export function Combobox<T>(props: React.PropsWithChildren<ComboboxProps<T>>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const listRef = useRef<HTMLElement[]>([]);

  const floating = useFloating<HTMLInputElement>({
    open,
    placement: 'bottom',
    onOpenChange: setOpen,
  });

  const listNavigation = useListNavigation(floating.context, {
    listRef,
    activeIndex,
    loop: true,
    virtual: true,
    onNavigate: (index) => {
      if (index !== null) {
        setActiveIndex(index);
      }
    },
  });

  const role = useRole(floating.context, { role: 'listbox' });
  const dismiss = useDismiss(floating.context);
  const interactions = useInteractions([role, dismiss, listNavigation]);

  useEffect(() => {
    floating.update();
    listRef.current = [];
  }, [props.items.length]);

  return (
    <ComboboxContext
      value={{
        floating,
        listRef,
        open,
        activeIndex,
        setOpen,
        setActiveIndex,
        onItemSelect: props?.onItemSelect,
        getReferenceProps: interactions.getReferenceProps,
        getFloatingProps: interactions.getFloatingProps,
        getItemProps: interactions.getItemProps,
      }}
    >
      {props.children}
    </ComboboxContext>
  );
}

type ComboboxInputProps = React.ComponentProps<'input'> & {
  asChild?: boolean;
};

const ComboboxInput = ({ asChild, ...props }: ComboboxInputProps) => {
  const Comp = asChild ? Slot.Root : 'input';

  const { floating, activeIndex, listRef, setActiveIndex, getReferenceProps, onItemSelect } =
    useComboboxContext();

  return (
    <Comp
      ref={floating.refs.setReference}
      {...getReferenceProps({
        ...props,
        onChange: (e) => {
          props.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
          setActiveIndex(0);
        },
        onKeyDown: (e) => {
          if (e.key === 'ArrowDown' && activeIndex === 0 && listRef.current.length > 1) {
            setActiveIndex(1);
          }
          // if (e.key === 'ArrowUp' && activeIndex === 0 && listRef.current.length > 1) {
          //   setActiveIndex(listRef.current.length - 1);
          // }
          if (e.key === 'Enter') {
            onItemSelect?.(activeIndex);
          }
          if (e.key === 'ArrowDown') {
            const nextIndex = activeIndex === listRef.current.length - 1 ? 0 : activeIndex + 1;
            listRef.current[nextIndex].scrollIntoView({ block: 'nearest' });
          }
          if (e.key === 'ArrowUp') {
            const nextIndex = activeIndex <= 0 ? listRef.current.length - 1 : activeIndex - 1;
            listRef.current[nextIndex].scrollIntoView({ block: 'nearest' });
          }
        },
      })}
      type="text"
    />
  );
};

type ComboboxMenuProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

const ComboboxMenu = ({ asChild, ...props }: ComboboxMenuProps) => {
  const Comp = asChild ? Slot.Root : 'div';

  const { floating, getFloatingProps } = useComboboxContext();

  return (
    <FloatingFocusManager context={floating.context} initialFocus={-1}>
      <Comp ref={floating.refs.setFloating} {...getFloatingProps(props)}>
        {props.children}
      </Comp>
    </FloatingFocusManager>
  );
};

type ComboboxMenuItem = React.ComponentProps<'div'> & { index: number; asChild?: boolean };

const ComboboxMenuItem = ({ index, asChild, ...props }: ComboboxMenuItem) => {
  const Comp = asChild ? Slot.Root : 'div';

  const { listRef, activeIndex, setActiveIndex, getItemProps, onItemSelect } = useComboboxContext();

  return (
    <Comp
      ref={(node) => {
        if (node) {
          listRef.current[index] = node;
        }
      }}
      {...getItemProps({
        ...props,
        onClick: () => {
          onItemSelect?.(index);
        },
        onMouseMove: () => {
          if (activeIndex !== index) {
            setActiveIndex(index);
          }
        },
      })}
      data-active={activeIndex === index}
    >
      {props.children}
    </Comp>
  );
};

Combobox.Input = ComboboxInput;
Combobox.Menu = ComboboxMenu;
Combobox.MenuItem = ComboboxMenuItem;
