'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

type UserRole = 'GURU' | 'SISWA' | 'ORANG_TUA' | 'STAFF';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserRole>('SISWA');

  const tabs = [
    { id: 'SISWA', label: 'Students', icon: <GraduationCap size={18} /> },
    { id: 'GURU', label: 'Teachers', icon: <UserCheck size={18} /> },
    { id: 'ORANG_TUA', label: 'Parents', icon: <Users size={18} /> },
    { id: 'STAFF', label: 'Staff', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={32} color="#6366f1" /> User Directory
          </h1>
          <p>Manage and organize all members of your school community.</p>
        </div>
        <button className={styles.btnPrimary}>
          <UserPlus size={18} /> Add New User
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as UserRole)}
              className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {tab.icon} {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className={styles.inputControl} 
              style={{ paddingLeft: '44px', width: '280px' }} 
            />
          </div>
          <button className={styles.btnOutline} style={{ padding: '0 1.25rem' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Member</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Contact Information</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>ID / NISN</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            <UserRow name="John Doe" email="john@school.edu" phone="+62 812 3456 7890" id="2024001" status="Active" />
            <UserRow name="Jane Smith" email="jane@school.edu" phone="+62 813 9876 5432" id="2024002" status="Active" />
            <UserRow name="Michael Ross" email="mike@school.edu" phone="+62 814 1111 2222" id="2024003" status="Suspended" />
            <UserRow name="Sarah Miller" email="sarah@school.edu" phone="+62 815 3333 4444" id="2024004" status="Active" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ name, email, phone, id, status }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1' }}>
            {name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: '#8c8e91' }}>Last active 2 hours ago</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Mail size={14} /> {email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Phone size={14} /> {phone}
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem' }}>#{id}</td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div className={`${styles.badge} ${status === 'Active' ? styles.success : styles.error}`}>
          {status}
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}
