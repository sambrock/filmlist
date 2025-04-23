import { Download, Ellipsis, EllipsisVertical, Link, LockOpen, Heart, type LucideProps, Plus } from 'lucide-react';

import { cn } from '../../lib/utils';

const iconCn = cn('stroke-2 antialiased');

export const IconLink = ({ className, ...props }: LucideProps) => {
  return <Link className={cn(iconCn, className)} {...props} />;
};

export const IconExport = ({ className, ...props }: LucideProps) => {
  return <Download className={cn(iconCn, className)} {...props} />;
};

export const IconOptionsVertical = ({ className, ...props }: LucideProps) => {
  return <EllipsisVertical className={cn(iconCn, className)} {...props} />;
};

export const IconOptionsHorizontal = ({ className, ...props }: LucideProps) => {
  return <Ellipsis className={cn(iconCn, className)} {...props} />;
};

export const IconLockOpen = ({ className, ...props }: LucideProps) => {
  return <LockOpen className={cn(iconCn, className)} {...props} />;
};

export const IconLike = ({ className, ...props }: LucideProps) => {
  return <Heart className={cn(iconCn, className)} {...props} />;
};

export const IconPlus = ({ className, ...props }: LucideProps) => {
  return <Plus className={cn(iconCn, className)} {...props} />;
};
