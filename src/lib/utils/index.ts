import { cx, CxOptions } from 'class-variance-authority';
import { v4 } from 'uuid';

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};

export const uuid = () => {
  return v4();
};

export const timeAgo = (date: Date) => {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'just now';
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 2592000) {
    // Approximately 30 days in a month
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 31536000) {
    // Approximately 365 days in a year
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(secondsPast / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};
