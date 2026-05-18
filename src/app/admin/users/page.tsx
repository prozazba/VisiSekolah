'use client';

import { useRouter } from 'next/navigation';

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
  AlertCircle,
  Edit2,
  Trash2,
  Ban,
  UserCog
} from 'lucide-react';
import AddUserModal from '@/components/AddUserModal';
import EditUserModal from '@/components/EditUserModal';
import { getUsersByRole, deleteUser, updateUser } from '@/app/actions/users';
import { checkAuthStatus } from '@/app/actions/auth';

type UserRole = 'GURU' | 'SISWA' | 'ORANG_TUA' | 'SCHOOL_ADMIN';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserRole>('SISWA');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus().then(session => setCurrentUser(session));
  }, []);

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
                  user={user}
                  currentUser={currentUser}
                  onRefresh={fetchUsers}
                  onViewAction={(userId: string) => {
                    router.push(`/admin/users/${userId}`);
                  }}
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

      <EditUserModal 
        isOpen={isEditModalOpen} 
        user={editingUser}
        onCloseAction={() => setIsEditModalOpen(false)} 
        refreshDataAction={fetchUsers} 
      />
    </div>
  );
}

function UserRow({ user, currentUser, onRefresh, onViewAction }: any) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isSelf = currentUser?.userId === user.id;

  const roleLabels: any = {
    'SUPER_ADMIN': 'Super Admin',
    'SCHOOL_ADMIN': 'Admin / Staff',
    'GURU': 'Guru / Teacher',
    'SISWA': 'Siswa / Student',
    'ORANG_TUA': 'Orang Tua / Parent',
  };

  const canShowMenu = isSuperAdmin || isSelf;

  const handleDelete = async () => {
    if (confirm(`Anda yakin ingin menghapus akun ${user.name}? Data tidak dapat dikembalikan.`)) {
      setIsDeleting(true);
      await deleteUser(user.id);
      setIsDeleting(false);
      onRefresh();
    }
  };

  const handleViewDetail = () => {
    onViewAction(user.id);
    setShowMenu(false);
  };

  const handleSuspend = () => {
    alert("Fitur Suspend membutuhkan penambahan kolom status pada skema database.");
  };

  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1' }}>
            {user.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#8c8e91' }}>{roleLabels[user.role] || 'Registered Member'}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
            <Mail size={14} /> {user.email}
          </div>
          {user.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
              <Phone size={14} /> {user.phone}
            </div>
          )}
          {user.role === 'SISWA' && user.siswaProfile?.nisn && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NISN: {user.siswaProfile.nisn}</div>
          )}
          {user.role === 'GURU' && user.guruProfile?.nip && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NIP: {user.guruProfile.nip}</div>
          )}
          {user.role === 'GURU' && user.guruProfile?.position && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{user.guruProfile.position}</div>
          )}
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div className={`${styles.badge} ${styles.success}`}>
          Active
        </div>
      </td>
      <td style={{ padding: '1.25rem 2rem', textAlign: 'right', position: 'relative' }}>
        {canShowMenu && (
          <>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div style={{ position: 'absolute', right: '3rem', top: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, width: '180px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {isSuperAdmin && !isSelf && (
                    <>
                      <button onClick={handleViewDetail} className={styles.menuItem} style={{ padding: '12px 16px', border: 'none', background: 'white', textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <UserCog size={16} /> Lihat Detail
                      </button>
                      <button onClick={handleSuspend} className={styles.menuItem} style={{ padding: '12px 16px', border: 'none', background: 'white', textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
                        <Ban size={16} /> Suspend
                      </button>
                      <button onClick={handleDelete} disabled={isDeleting} className={styles.menuItem} style={{ padding: '12px 16px', border: 'none', background: 'white', textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                        {isDeleting ? <RefreshCcw size={16} className={styles.spin} /> : <Trash2 size={16} />} 
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                  {isSelf && (
                    <button onClick={handleViewDetail} className={styles.menuItem} style={{ padding: '12px 16px', border: 'none', background: 'white', textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                      <UserCog size={16} /> Update Profile
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </td>
    </tr>
  );
}
