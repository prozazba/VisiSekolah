// src/app/_sites/[site]/layout.tsx
import React from 'react';
import { notFound } from 'next/navigation';

// Mock function to simulate DB fetch
async function getSchoolData(slug: string) {
  const schools: Record<string, any> = {
    'smp1': {
      name: 'SMP Negeri 1 Jakarta',
      primaryColor: '#1e40af',
      secondaryColor: '#1e3a8a',
      accentColor: '#fbbf24',
    },
    'sma5': {
      name: 'SMA Negeri 5 Bandung',
      primaryColor: '#b91c1c',
      secondaryColor: '#991b1b',
      accentColor: '#4ade80',
    }
  };
  return schools[slug] || null;
}

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { site: string };
}) {
  const { site } = params;
  const school = await getSchoolData(site);

  if (!school) {
    notFound();
  }

  return (
    <div 
      className="school-layout"
      style={{
        '--primary-color': school.primaryColor,
        '--secondary-color': school.secondaryColor,
        '--accent-color': school.accentColor,
      } as React.CSSProperties}
    >
      <header className="school-header">
        <div className="container flex justify-between items-center py-4">
          <div className="school-logo font-bold text-xl">
            {school.name}
          </div>
          <nav className="flex gap-4">
            <button className="btn-primary">Login</button>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      
      <style jsx>{`
        .school-header {
          background-color: white;
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  );
}
