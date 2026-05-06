'use client';

import { useState } from 'react';
import styles from '../styles/admin.module.scss';
import { createSchool } from '@/app/actions/school';

interface CreateSchoolModalProps {
  onClose: () => void;
  users: { id: string; name: string; email: string | null }[];
}

export default function CreateSchoolModal({ onClose, users }: CreateSchoolModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [setupInfo, setSetupInfo] = useState<{ email: string | null; tempPassword: string; setupUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminId) {
      setError('Pilih administrator sekolah terlebih dahulu');
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('adminId', adminId);

    const result = await createSchool(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else if (result?.setupInfo) {
      setSetupInfo(result.setupInfo);
      setIsPending(false);
    } else {
      onClose();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto-generate slug from name if slug is empty or was auto-generated
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')) {
       setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {setupInfo ? (
          <div className={styles.successScreen}>
            <div className={styles.modalHeader}>
              <div className={styles.successBadge}>✓</div>
              <h2>Pendaftaran Berhasil!</h2>
              <p>Sekolah telah didaftarkan. Bagikan detail berikut kepada administrator sekolah.</p>
            </div>

            <div className={styles.setupDetails}>
              <div className={styles.detailItem}>
                <label>Email Administrator</label>
                <div className={styles.detailValue}>{setupInfo.email}</div>
              </div>
              <div className={styles.detailItem}>
                <label>Password Sementara</label>
                <div className={styles.detailValue}>
                  <code>{setupInfo.tempPassword}</code>
                  <span className={styles.detailNote}>(Wajib diganti saat login pertama)</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <label>Link Konfirmasi & Setup</label>
                <div className={styles.detailValue}>
                  <a href={setupInfo.setupUrl} className={styles.setupLink} target="_blank" rel="noopener noreferrer">
                    {setupInfo.setupUrl}
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnPrimary} onClick={onClose}>Selesai</button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2>Tambah Sekolah Baru</h2>
              <p>Daftarkan tenant baru ke dalam ekosistem VisiSekolah.</p>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nama Sekolah</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  value={name}
                  onChange={handleNameChange}
                  required
                  disabled={isPending}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="admin">Administrator Sekolah</label>
                <select
                  id="admin"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                  disabled={isPending}
                  className={styles.select}
                >
                  <option value="">Pilih Pengguna...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="slug">Slug Subdomain</label>
                <input
                  type="text"
                  id="slug"
                  placeholder="contoh-sekolah"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  disabled={isPending}
                />
                <span className={styles.slugPreview}>
                  URL Akses: <code>{slug || 'slug'}.visisekolah.id</code>
                </span>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={onClose}
                  disabled={isPending}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className={styles.btnPrimary}
                  disabled={isPending}
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Sekolah'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
