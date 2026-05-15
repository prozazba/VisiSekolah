'use client';

import { useState, useEffect } from 'react';
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
  UserCheck,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import AddUserModal from '@/components/AddUserModal';
import { getUsersByRole } from '@/app/actions/users';

type UserRole = 'GURU' | 'SISWA' | 'ORANG_TUA' | 'SCHOOL_ADMIN';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserRole>('SISWA');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'SISWA', label: 'Students', icon: <GraduationCap size={18} /> },
    { id: 'GURU', label: 'Teachers', icon: <UserCheck size={18} /> },
    { id: 'ORANG_TUA', label: 'Parents', icon: <Users size={18} /> },
    { id: 'SCHOOL_ADMIN', label: 'Staff', icon: <ShieldCheck size={18} /> },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsersByRole(activeTab);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={32} color="#6366f1" /> User Directory
          </h1>
          <p>Manage and organize all members of your school community.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.btnOutline} style={{ padding: '0 1.25rem' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <RefreshCcw size={32} className={styles.spin} color="#6366f1" />
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Fetching directory...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Member</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Contact Information</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date Joined</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow 
                  key={user.id}
                  name={user.name} 
                  email={user.email} 
                  date={new Date(user.createdAt).toLocaleDateString()} 
                  status="Active" 
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
          <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h4 style={{ margin: 0, fontWeight: 800 }}>No members found</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>There are no users matching your criteria in this department.</p>
        </div>
      )}

      <AddUserModal 
        isOpen={isModalOpen} 
        onCloseAction={() => setIsModalOpen(false)} 
        refreshDataAction={fetchUsers} 
      />
    </div>
  );
}

function UserRow({ name, email, date, status }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1' }}>
            {name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: '#8c8e91' }}>Registered Member</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Mail size={14} /> {email}
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem' }}>{date}</td>
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
