'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, UserCog, Mail, CheckCircle2, RefreshCcw } from 'lucide-react';
import { updateUser } from '@/app/actions/users';

export default function EditUserModal({ 
  isOpen, 
  user,
  onCloseAction, 
  refreshDataAction 
}: { 
  isOpen: boolean, 
  user: any,
  onCloseAction: () => void, 
  refreshDataAction: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nisn: '',
    nip: '',
    position: '',
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nisn: user.siswaProfile?.nisn || '',
        nip: user.guruProfile?.nip || '',
        position: user.guruProfile?.position || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await updateUser(user.id, formData);

    if (result.success) {
      refreshDataAction();
      onCloseAction();
    } else {
      setError(result.error || 'Failed to update user');
    }
    setIsPending(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className={styles.card} style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', position: 'relative', animation: 'modalIn 0.3s ease-out' }}>
        <button onClick={onCloseAction} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className={styles.iconCircle} style={{ width: '48px', height: '48px' }}>
            <UserCog size={24} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Update Profile</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Modify the member's personal information.</p>
          </div>
        </div>

        {error && (
          <div className={`${styles.badge} ${styles.error}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Full Name</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder="e.g. Budi Santoso"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                className={styles.inputControl} 
                type="email" 
                placeholder="name@school.edu"
                required
                style={{ paddingLeft: '44px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Phone Number</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder="e.g. 08123456789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {user?.role === 'SISWA' && (
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>NISN (Nomor Induk Siswa Nasional)</label>
              <input 
                className={styles.inputControl} 
                type="text" 
                placeholder="e.g. 0012345678"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
              />
            </div>
          )}

          {user?.role === 'GURU' && (
            <>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>NIP (Nomor Induk Pegawai)</label>
                <input 
                  className={styles.inputControl} 
                  type="text" 
                  placeholder="e.g. 198001012005011003"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Jabatan / Penugasan Khusus</label>
                <select 
                  className={styles.inputControl}
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="">Pilih Jabatan (Opsional)</option>
                  <option value="Guru Kelas">Guru Kelas</option>
                  <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Kepala Jurusan">Kepala Jurusan</option>
                  <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                  <option value="Pembina OSIS">Pembina OSIS</option>
                  <option value="Bimbingan Konseling">Bimbingan Konseling</option>
                  <option value="Koordinator Kurikulum">Koordinator Kurikulum</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isPending}
            style={{ width: '100%', height: '52px' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <CheckCircle2 size={18} />}
            {isPending ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
