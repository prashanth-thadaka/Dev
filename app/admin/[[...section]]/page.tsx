import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/dashboard';
export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};
export default async function Admin({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  if (
    section.length > 1 ||
    !['', 'customers', 'orders', 'quotes', 'support'].includes(section[0] || '')
  )
    notFound();
  return <Dashboard admin section={section[0] || ''} />;
}
