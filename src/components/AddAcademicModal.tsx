'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, BookOpen, Layout, Plus, CheckCircle2, RefreshCcw } from 'lucide-react';
import { createClass, createSubject } from '@/app/actions/academic';

export default function AddAcademicModal({ 
  isOpen, 
  onCloseAction, 
  type, 
  refreshDataAction 
}: { 
  isOpen: boolean, 
  onCloseAction: () => void, 
  type: 'CLASSES' | 'SUBJECTS',
  refreshDataAction: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '', // For subjects
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    let result;
    if (type === 'CLASSES') {
      result = await createClass({ name: formData.name });
    } else {
      result = await createSubject({ name: formData.name, code: formData.code });
    }

    if (result.success) {
      refreshDataAction();
      onCloseAction();
      setFormData({ name: '', code: '' });
    } else {
      setError(result.error || 'Operation failed');
    }
    setIsPending(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className={styles.card} style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', position: 'relative' }}>
        <button onClick={onCloseAction} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className={styles.iconCircle} style={{ width: '48px', height: '48px' }}>
            {type === 'CLASSES' ? <Layout size={24} color="#6366f1" /> : <BookOpen size={24} color="#6366f1" />}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{type === 'CLASSES' ? 'New Class Section' : 'New Curriculum Subject'}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Configure the academic registry entry.</p>
          </div>
        </div>

        {error && (
          <div className={`${styles.badge} ${styles.error}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label>{type === 'CLASSES' ? 'Class/Section Name' : 'Subject Name'}</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder={type === 'CLASSES' ? 'e.g. Grade 10 - Science A' : 'e.g. Advanced Mathematics'}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {type === 'SUBJECTS' && (
            <div className={styles.formGroup}>
              <label>Subject Code</label>
              <input 
                className={styles.inputControl} 
                type="text" 
                placeholder="e.g. MATH101"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
          )}

          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isPending}
            style={{ width: '100%', height: '52px', marginTop: '1rem' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <Plus size={18} />}
            {isPending ? 'Registering...' : `Add ${type === 'CLASSES' ? 'Class' : 'Subject'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
