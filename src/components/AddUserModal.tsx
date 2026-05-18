'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, UserPlus, Mail, Shield, CheckCircle2, RefreshCcw } from 'lucide-react';
import { createUser, getUsersByRole } from '@/app/actions/users';

export default function AddUserModal({ isOpen, onCloseAction, refreshDataAction }: { isOpen: boolean, onCloseAction: () => void, refreshDataAction: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'SISWA',
    studentId: '',
    phone: '',
    address: '',
    teacherId: '',
    jobAssignments: [] as string[],
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getUsersByRole('SISWA').then(setStudents);
      getUsersByRole('GURU').then(setTeachers);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    // If Administrative Staff is selected from existing teacher, we just update the user role
    // However, createUser creates a NEW user. If they want to change existing teacher role, 
    // it might need an update API instead of create.
    // For now, we will pass it to createUser (you may need backend adjustment for teacherId/studentId).
    const result = await createUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      // @ts-ignore - passing extra data for potential backend handling
      phone: formData.phone,
      studentId: formData.studentId,
      address: formData.address,
      teacherId: formData.teacherId,
      jobAssignments: formData.jobAssignments,
    });

    if (result.success) {
      refreshDataAction();
      onCloseAction();
      setFormData({ name: '', email: '', role: 'SISWA', studentId: '', phone: '', address: '', teacherId: '', jobAssignments: [] });
    } else {
      setError(result.error || 'Failed to create user');
    }
    setIsPending(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className={`${styles.card} modal-container`}>
        <button onClick={onCloseAction} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className={styles.iconCircle} style={{ width: '48px', height: '48px' }}>
            <UserPlus size={24} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Tambah Anggota Baru</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Masukkan detail anggota sekolah yang baru.</p>
          </div>
        </div>

        {error && (
          <div className={`${styles.badge} ${styles.error}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className={`${styles.formGroup} full-width`}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Peran Institusional</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                className={styles.inputControl}
                style={{ paddingLeft: '44px' }}
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value, name: '', email: '', teacherId: '' });
                }}
              >
                <option value="SISWA">Siswa</option>
                <option value="GURU">Guru</option>
                <option value="ORANG_TUA">Orang Tua</option>
                <option value="SCHOOL_ADMIN">Staf Administrasi</option>
              </select>
            </div>
          </div>

          {formData.role === 'SCHOOL_ADMIN' && (
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Pilih dari Guru Terdaftar (Opsional)</label>
              <select
                className={styles.inputControl}
                value={formData.teacherId}
                onChange={(e) => {
                  const teacherId = e.target.value;
                  const teacher = teachers.find(t => t.id === teacherId);
                  if (teacher) {
                    setFormData({ ...formData, teacherId, name: teacher.name, email: teacher.email || '' });
                  } else {
                    setFormData({ ...formData, teacherId: '', name: '', email: '' });
                  }
                }}
              >
                <option value="">-- Staf Baru / Tidak Memilih Guru --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Nama Lengkap</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder="e.g. Budi Santoso"
              required={formData.role !== 'SCHOOL_ADMIN' || !formData.teacherId}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={formData.role === 'SCHOOL_ADMIN' && !!formData.teacherId}
            />
          </div>

          {formData.role === 'ORANG_TUA' && (
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Siswa</label>
              <select
                className={styles.inputControl}
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Alamat Email</label>
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
                disabled={formData.role === 'SCHOOL_ADMIN' && !!formData.teacherId}
              />
            </div>
          </div>

          {formData.role === 'ORANG_TUA' && (
            <>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Nomor Telepon</label>
                <input 
                  className={styles.inputControl} 
                  type="tel" 
                  placeholder="e.g. 08123456789"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className={`${styles.formGroup} full-width`}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Alamat</label>
                <textarea 
                  className={styles.inputControl} 
                  placeholder="Alamat Lengkap"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </>
          )}

          {formData.role === 'SCHOOL_ADMIN' && (
            <div className={`${styles.formGroup} full-width`}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Tugas Pekerjaan</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {['Keuangan', 'Akademik', 'Kesiswaan', 'Fasilitas', 'Sumber Daya Manusia', 'Dukungan IT', 'Administrasi Umum'].map(job => (
                  <label key={job} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '150px' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.jobAssignments.includes(job)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, jobAssignments: [...formData.jobAssignments, job] });
                        } else {
                          setFormData({ ...formData, jobAssignments: formData.jobAssignments.filter(j => j !== job) });
                        }
                      }}
                      style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#334155' }}>{job}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="full-width" style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#64748b' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Password default <strong>password123</strong> akan digunakan.</span>
          </div>

          <button 
            type="submit" 
            className={`${styles.btnPrimary} full-width`} 
            disabled={isPending}
            style={{ width: '100%', height: '52px' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <UserPlus size={18} />}
            {isPending ? 'Membuat Akun...' : 'Buat Akun Sekarang'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .modal-container {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2.5rem;
          position: relative;
          animation: modalIn 0.3s ease-out;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .modal-container {
            max-width: 80%;
          }
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .full-width {
            grid-column: 1 / -1;
          }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

