'use client';

import * as ModalPrimitive from '@radix-ui/react-dialog';
import { cva, VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const Modal = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Root>) => {
  return <ModalPrimitive.Root data-slot="modal" {...props} />;
};

const ModalTrigger = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Trigger>) => {
  return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />;
};

const ModalPortal = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Portal>) => {
  return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />;
};

const ModalClose = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Close>) => {
  return <ModalPrimitive.Close data-slot="modal-close" {...props} />;
};

const ModalOverlay = ({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Overlay>) => {
  return (
    <ModalPrimitive.Overlay
      data-slot="modal-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-xs',
        className
      )}
      {...props}
    />
  );
};

const modalContentVariant = cva('', {
  variants: {
    variant: {
      default: 'sm:max-w-lg',
      wide: 'lg:w-7xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ModalContentVariantProps = VariantProps<typeof modalContentVariant>;

const ModalContent = ({
  className,
  children,
  showCloseButton = true,
  variant,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Content> &
  ModalContentVariantProps & {
    showCloseButton?: boolean;
  }) => {
  return (
    <ModalPortal data-slot="modal-portal">
      <ModalOverlay />
      <ModalPrimitive.Content
        data-slot="modal-content"
        className={cn(
          'bg-background-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-clip rounded-xl shadow-lg duration-200',
          className,
          modalContentVariant({ variant })
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <ModalPrimitive.Close
            data-slot="modal-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </ModalPrimitive.Close>
        )}
      </ModalPrimitive.Content>
    </ModalPortal>
  );
};

const ModalHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="modal-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
};

const ModalFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="modal-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
};

const ModalTitle = ({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Title>) => {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
};

const ModalDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Description>) => {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
};
