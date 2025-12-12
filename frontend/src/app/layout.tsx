import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'Browse our collection of products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
