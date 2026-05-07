import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  
  // Fetch real school data from Prisma
  const school = await prisma.school.findUnique({
    where: { slug: site }
  });

  if (!school) {
    notFound();
  }

  // Use branding from DB or defaults
  const branding = {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#fbbf24',
    name: school.name,
  };

  return (
    <div 
      className="school-layout"
      style={{
        '--primary-color': branding.primaryColor,
        '--secondary-color': branding.secondaryColor,
        '--accent-color': branding.accentColor,
      } as React.CSSProperties}
    >
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: branding.primaryColor }}>
            {branding.name}
          </div>
          <nav>
            <button style={{ 
              backgroundColor: branding.primaryColor,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Login Portal
            </button>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
