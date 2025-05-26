type Props = React.ComponentProps<'div'>;

export const ListMovieSearchMenu = (props: Props) => {
  return (
    <div className="border-border-1 flex max-h-[430px] w-full flex-col gap-1 overflow-y-auto border-t p-2">
      {props.children}
      <div></div>
    </div>
  );
};
