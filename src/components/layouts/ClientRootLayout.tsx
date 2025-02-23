'use client';

import { useEffect } from 'react';
import { CrossTabAuth } from '@/lib/auth/crossTabAuth';
import Providers from '@/providers';
import ClientLayout from '@/components/layouts/ClientLayout';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    CrossTabAuth.init();
    return () => CrossTabAuth.cleanup();
  }, []);

  return (
    <Providers>
      <ClientLayout>
        {children}
      </ClientLayout>
    </Providers>
  );
} 