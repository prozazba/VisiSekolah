'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Eye, 
  Users, 
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AnnouncementsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div>
      <header className={styles.greeting} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Megaphone size={32} color="#6366f1" /> School Announcements
        </h1>
        <p>Broadcast important updates and information to your school community.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#8c8e91" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', background: 'white' }}
            />
          </div>
          <select 
            style={{ padding: '0 1rem', borderRadius: '16px', border: '1px solid #eee', background: 'white', fontWeight: 600, outline: 'none' }}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="ALL">All Targets</option>
            <option value="GURU">Teachers</option>
            <option value="SISWA">Students</option>
            <option value="ORANG_TUA">Parents</option>
          </select>
        </div>
        <button style={{ padding: '12px 24px', borderRadius: '16px', background: '#111', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <Plus size={18} /> New Announcement
        </button>
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
          title="Parent-Teacher Association (PTA) Meeting" 
          target="Parents" 
          date="05 May, 09:00 AM" 
          status="Archived"
          views={850}
          priority="Normal"
        />
        <AnnouncementItem 
          title="Maintenance Work: School WiFi Network" 
          target="Staff & Teachers" 
          date="02 May, 11:00 AM" 
          status="Published"
          views={420}
          priority="Normal"
        />
      </div>
    </div>
  );
}

function AnnouncementItem({ title, target, date, status, views, priority }: any) {
  const priorityColor = priority === 'Urgent' ? '#ef4444' : priority === 'High' ? '#f59e0b' : '#3b82f6';
  const statusColor = status === 'Published' ? '#059669' : '#64748b';

  return (
    <div className={styles.card} style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 200px 150px 100px 40px', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          {priority === 'Urgent' && <AlertCircle size={16} color={priorityColor} />}
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#8c8e91' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {target}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {date}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></div>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: statusColor }}>{status}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
        <Eye size={16} /> {views.toLocaleString()} Views
      </div>

      <div style={{ 
        padding: '4px 10px', 
        borderRadius: '8px', 
        fontSize: '0.75rem', 
        fontWeight: 800, 
        color: priorityColor, 
        background: `${priorityColor}10`,
        textAlign: 'center'
      }}>
        {priority}
      </div>

      <MoreVertical size={18} color="#94a3b8" />
    </div>
  );
}
