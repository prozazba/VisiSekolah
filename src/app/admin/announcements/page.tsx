'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Eye, 
  Users, 
  Clock,
  MoreVertical,
  AlertCircle,
  Filter,
  CheckCircle2,
  Calendar,
  Send
} from 'lucide-react';

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<'PUBLISHED' | 'DRAFTS' | 'SCHEDULED'>('PUBLISHED');

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Megaphone size={32} color="#6366f1" /> School Announcements
          </h1>
          <p>Broadcast important updates and information to your school community.</p>
        </div>
        <button className={styles.btnPrimary}>
          <Plus size={18} /> Create New Broadcast
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabItem} ${activeTab === 'PUBLISHED' ? styles.active : ''}`}
            onClick={() => setActiveTab('PUBLISHED')}
          >
            Published
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'SCHEDULED' ? styles.active : ''}`}
            onClick={() => setActiveTab('SCHEDULED')}
          >
            Scheduled
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'DRAFTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('DRAFTS')}
          >
            Drafts
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              className={styles.inputControl} 
              style={{ paddingLeft: '44px', width: '280px' }} 
            />
          </div>
          <button className={styles.btnOutline} style={{ padding: '0 1.25rem' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AnnouncementItem 
          title="Upcoming Spring Semester Finals Schedule" 
          target="All Students & Teachers" 
          date="Today, 10:45 AM" 
          status="Published"
          views={1240}
          priority="High"
        />
        <AnnouncementItem 
          title="New Health and Safety Guidelines for Campus" 
          target="Whole School Community" 
          date="Yesterday, 02:30 PM" 
          status="Published"
          views={3500}
          priority="Urgent"
        />
        <AnnouncementItem 
          title="Maintenance Work: School WiFi Network" 
          target="Staff & Teachers" 
          date="02 May, 11:00 AM" 
          status="Published"
          views={420}
          priority="Normal"
        />
        <AnnouncementItem 
          title="Sports Day 2026: Registration Open" 
          target="Students" 
          date="28 Apr, 09:15 AM" 
          status="Published"
          views={2100}
          priority="Normal"
        />
      </div>
    </div>
  );
}

function AnnouncementItem({ title, target, date, status, views, priority }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case 'Urgent': return { background: '#fef2f2', color: '#ef4444' };
      case 'High': return { background: '#fffbeb', color: '#f59e0b' };
      default: return { background: '#eff6ff', color: '#3b82f6' };
    }
  };

  const priorityStyle = getPriorityStyles(priority);

  return (
    <div className={styles.card} style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 180px 140px 120px 40px', alignItems: 'center', gap: '1.5rem', border: '1px solid #f1f5f9' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {priority === 'Urgent' && <AlertCircle size={16} color="#ef4444" />}
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {target}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {date}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={`${styles.badge} ${styles.success}`} style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem' }}>
          <CheckCircle2 size={14} /> {status}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8125rem', fontWeight: 700 }}>
        <Eye size={16} /> {mounted ? views.toLocaleString() : views} Reads
      </div>

      <div style={{ 
        padding: '6px 12px', 
        borderRadius: '10px', 
        fontSize: '0.6875rem', 
        fontWeight: 800, 
        ...priorityStyle,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
      }}>
        {priority}
      </div>

      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
        <MoreVertical size={20} />
      </button>
    </div>
  );
}
