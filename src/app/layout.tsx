import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils/cn';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FILMLIST',
};

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-surface-0 text-text-primary overflow-y-auto h-screen w-screen',
          fontSans.className
        )}
      >
        {props.children}
      </body>
    </html>
  );
}
