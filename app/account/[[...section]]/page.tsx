import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/dashboard';
export const metadata: Metadata = {
  title: 'Your Account',
  robots: { index: false, follow: false },
};
export default async function Account({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  if (
    section.length > 1 ||
    !['', 'services', 'domains', 'invoices', 'support', 'settings'].includes(section[0] || '')
  )
    notFound();
  return <Dashboard section={section[0] || ''} />;
}
