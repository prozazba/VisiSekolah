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
      <header className={styles.greeting} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="#6366f1" /> User Directory
        </h1>
        <p>Manage and organize all members of your school community.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#8c8e91" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', background: 'white' }}
          />
        </div>
        <button style={{ padding: '0 1.5rem', borderRadius: '16px', border: '1px solid #eee', background: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Filter size={18} /> Filter
        </button>
        <button style={{ padding: '0 1.5rem', borderRadius: '16px', background: '#111', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as UserRole)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? '#f1f0ff' : 'transparent',
              color: activeTab === tab.id ? '#6366f1' : '#8c8e91',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* User Table */}
      <section className={styles.card} style={{ padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Member</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID / NISN</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            <UserRow name="John Doe" role={activeTab} email="john@school.edu" phone="+62 812..." id="2024001" status="Active" />
            <UserRow name="Jane Smith" role={activeTab} email="jane@school.edu" phone="+62 813..." id="2024002" status="Active" />
            <UserRow name="Michael Ross" role={activeTab} email="mike@school.edu" phone="+62 814..." id="2024003" status="Inactive" />
          </tbody>
        </table>
      </section>
    </div>
  );
}

function UserRow({ name, email, phone, id, status }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9' }}></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: '#8c8e91' }}>Updated 2 days ago</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Mail size={14} /> {email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Phone size={14} /> {phone}
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 1rem', fontWeight: 600, fontSize: '0.875rem' }}>#{id}</td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <span style={{ 
          padding: '4px 10px', 
          borderRadius: '8px', 
          fontSize: '0.75rem', 
          fontWeight: 700,
          background: status === 'Active' ? '#ecfdf5' : '#f1f5f9',
          color: status === 'Active' ? '#059669' : '#64748b'
        }}>{status}</span>
      </td>
      <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
        <MoreVertical size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
      </td>
    </tr>
  );
}
