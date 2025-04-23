import { ButtonIcon } from '../../common/ButtonIcon';
import { IconExport, IconLike, IconLink, IconLockOpen, IconOptionsHorizontal } from '../../common/Icon';
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from '../../common/Tooltip';

export const ListViewToolbar = () => {
  return (
    <div className="flex items-center justify-end gap-1 p-2">
      <TooltipProvider>
        <ButtonIcon icon={<IconLike />} variant="transparent" />

        <TooltipRoot>
          <TooltipTrigger asChild>
            <ButtonIcon icon={<IconLockOpen />} variant="transparent" />
          </TooltipTrigger>
          <TooltipContent>
            <span>Lock</span>
          </TooltipContent>
        </TooltipRoot>

        <ButtonIcon icon={<IconLink />} variant="transparent" />
        <ButtonIcon icon={<IconExport />} variant="transparent" />
        <ButtonIcon icon={<IconOptionsHorizontal />} variant="transparent" />
      </TooltipProvider>
    </div>
  );
};
