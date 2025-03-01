'use client';

import { useRef, useState } from 'react';
import { type LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/common/Icon';

const STAR_COUNT = 5;

type StarsInputProps = {
  initialRating: number;
  onRatingChange?: (rating: number) => void;
};

export const StarsInput = ({ initialRating, onRatingChange }: StarsInputProps) => {
  const [rating, setRating] = useState(initialRating);

  const selectedRatingRef = useRef(initialRating);

  const handleClick = () => {
    onRatingChange?.(rating);
    selectedRatingRef.current = rating;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rating = (Math.round((x / rect.width) * STAR_COUNT * 2) / 2) * 2;
    setRating(rating);
  };

  const handleMouseLeave = () => {
    if (selectedRatingRef.current === rating) return;
    setRating(selectedRatingRef.current);
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        {[...Array(STAR_COUNT).keys()].map((i) => (
          <Star key={i} className="fill-text-default/10" />
        ))}
      </div>

      <div
        className="absolute top-0 left-0 flex items-center"
        style={{
          clipPath: `inset(0 ${100 - (rating / 2 / STAR_COUNT) * 100}% 0 0)`,
        }}
      >
        {[...Array(STAR_COUNT).keys()].map((i) => (
          <Star key={i} className="fill-green-default" />
        ))}
      </div>
    </div>
  );
};

const Star = ({ className, ...props }: LucideProps) => {
  return (
    <Icon
      className={cn('size-[2.2rem] stroke-transparent', className)}
      {...props}
      name="star"
      strokeWidth={3}
    />
  );
};
