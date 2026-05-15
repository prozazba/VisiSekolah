'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, Calendar, MapPin, Clock, Plus, RefreshCcw } from 'lucide-react';
import { createEvent } from '@/app/actions/calendar';

export default function AddEventModal({ isOpen, onCloseAction, refreshDataAction }: { isOpen: boolean, onCloseAction: () => void, refreshDataAction: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    // Combine date and time
    const eventDate = new Date(`${formData.date}T${formData.time || '00:00'}`);

    const result = await createEvent({
      title: formData.title,
      startDate: eventDate,
      location: formData.location,
    });

    if (result.success) {
      refreshDataAction();
      onCloseAction();
      setFormData({ title: '', date: '', time: '', location: '' });
    } else {
      setError(result.error || 'Failed to schedule event');
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
            <Calendar size={24} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Schedule New Event</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Add an entry to the institutional calendar.</p>
          </div>
        </div>

        {error && (
          <div className={`${styles.badge} ${styles.error}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label>Event Title</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder="e.g. Final Exams Week"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input 
                className={styles.inputControl} 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Time (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className={styles.inputControl} 
                  type="time" 
                  style={{ paddingLeft: '40px' }}
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                className={styles.inputControl} 
                type="text" 
                placeholder="e.g. Auditorium Hall"
                style={{ paddingLeft: '44px' }}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isPending}
            style={{ width: '100%', height: '52px', marginTop: '1rem' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <Plus size={18} />}
            {isPending ? 'Scheduling...' : 'Schedule Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
