'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, UserPlus, Mail, Shield, CheckCircle2, RefreshCcw } from 'lucide-react';
import { createUser } from '@/app/actions/users';

export default function AddUserModal({ isOpen, onCloseAction, refreshDataAction }: { isOpen: boolean, onCloseAction: () => void, refreshDataAction: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'SISWA',
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await createUser(formData);

    if (result.success) {
      refreshDataAction();
      onCloseAction();
      setFormData({ name: '', email: '', role: 'SISWA' });
    } else {
      setError(result.error || 'Failed to create user');
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
            <UserPlus size={24} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Add New Member</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Enter the details of the new school member.</p>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Institutional Role</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                className={styles.inputControl}
                style={{ paddingLeft: '44px' }}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="SISWA">Student</option>
                <option value="GURU">Teacher</option>
                <option value="ORANG_TUA">Parent</option>
                <option value="SCHOOL_ADMIN">Administrative Staff</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#64748b' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Default password <strong>password123</strong> will be assigned.</span>
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isPending}
            style={{ width: '100%', height: '52px' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <UserPlus size={18} />}
            {isPending ? 'Creating Account...' : 'Create Account Now'}
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
