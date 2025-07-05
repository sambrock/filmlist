import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils/app.utils';

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
          'bg-background-0 text-foreground-0 fixed top-0 left-0 h-screen w-screen overflow-y-auto',
          fontSans.className
        )}
      >
        {props.children}
      </body>
    </html>
  );
}
