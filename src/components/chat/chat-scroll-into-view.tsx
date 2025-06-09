'use client';

export const ChatScrollIntoView = () => {
  return (
    <div
      ref={(el) => {
        el?.scrollIntoView({ behavior: 'instant', block: 'end', inline: 'nearest' });
      }}
      className="h-20"
      data-scroll-into-view
    />
  );
};
