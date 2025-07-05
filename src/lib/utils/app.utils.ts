import { cx, type CxOptions } from 'class-variance-authority';

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};

export const scrollToEnd = () => {
  const end = document.getElementById('chat-end');
  if (end) {
    end.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'end' });
  }
};
