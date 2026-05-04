// src/app/_sites/[site]/page.tsx
export default function SchoolPage({ params }: { params: { site: string } }) {
  return (
    <div className="container py-20">
      <div className="welcome-card text-center p-12 bg-surface rounded-xl">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Selamat Datang di Portal Digital
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Akses jadwal pelajaran, tugas, nilai, dan informasi sekolah lainnya dengan mudah dalam satu platform terintegrasi.
        </p>
        
        <div className="grid mt-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <QuickAction title="Absensi" icon="📅" />
          <QuickAction title="Tugas & PR" icon="📝" />
          <QuickAction title="Nilai & Rapor" icon="🎓" />
          <QuickAction title="Pembayaran" icon="💳" />
        </div>
      </div>

      <style jsx>{`
        .bg-surface {
          background-color: var(--surface-color);
        }
        .rounded-xl {
          border-radius: var(--radius-xl);
        }
      `}</style>
    </div>
  );
}

function QuickAction({ title, icon }: { title: string, icon: string }) {
  return (
    <div className="quick-action" style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: 'var(--radius-lg)', 
      boxShadow: 'var(--shadow-md)',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
    </div>
  );
}
