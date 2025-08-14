'use client';

import dynamic from 'next/dynamic';

const AdminHome = dynamic(() => import('./AdminHome'), { ssr: false });

export default function DashboardPage() {
  return <AdminHome />;
}
