'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard');

  if (isDashboardPage) {
    return null;
  }

  return <Footer />;
}