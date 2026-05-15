'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { X, Megaphone, Send, AlertCircle, RefreshCcw, Users } from 'lucide-react';
import { createAnnouncement } from '@/app/actions/announcements';

export default function AddAnnouncementModal({ isOpen, onCloseAction, refreshDataAction }: { isOpen: boolean, onCloseAction: () => void, refreshDataAction: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'All Students & Teachers',
    priority: 'Normal',
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await createAnnouncement(formData);

    if (result.success) {
      refreshDataAction();
      onCloseAction();
      setFormData({ title: '', content: '', target: 'All Students & Teachers', priority: 'Normal' });
    } else {
      setError(result.error || 'Failed to broadcast announcement');
    }
    setIsPending(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className={styles.card} style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative' }}>
        <button onClick={onCloseAction} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className={styles.iconCircle} style={{ width: '48px', height: '48px' }}>
            <Megaphone size={24} color="#6366f1" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Create New Broadcast</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Post an update to the school announcement board.</p>
          </div>
        </div>

        {error && (
          <div className={`${styles.badge} ${styles.error}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label>Announcement Title</label>
            <input 
              className={styles.inputControl} 
              type="text" 
              placeholder="e.g. Schedule Change for Graduation Ceremony"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label>Target Audience</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  className={styles.inputControl}
                  style={{ paddingLeft: '40px' }}
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                >
                  <option>All Students & Teachers</option>
                  <option>Teachers & Staff Only</option>
                  <option>Students Only</option>
                  <option>Whole School Community</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Priority</label>
              <select 
                className={styles.inputControl}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Content / Message</label>
            <textarea 
              className={styles.inputControl} 
              rows={6}
              placeholder="Type your detailed announcement here..."
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isPending}
            style={{ width: '100%', height: '52px', marginTop: '1rem' }}
          >
            {isPending ? <RefreshCcw size={18} className={styles.spin} /> : <Send size={18} />}
            {isPending ? 'Broadcasting...' : 'Post Announcement Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
