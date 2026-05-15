'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  BookOpen, 
  Plus, 
  Layout, 
  Users, 
  User, 
  Clock,
  MoreVertical,
  ChevronRight,
  Search,
  Filter,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import AddAcademicModal from '@/components/AddAcademicModal';
import { getClasses, getSubjects } from '@/app/actions/academic';

type AcademicTab = 'CLASSES' | 'SUBJECTS';

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState<AcademicTab>('CLASSES');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const result = activeTab === 'CLASSES' ? await getClasses() : await getSubjects();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={32} color="#6366f1" /> Academic Management
          </h1>
          <p>Organize your school's classes, subjects, and teaching schedules.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> {activeTab === 'CLASSES' ? 'Create New Class' : 'Add New Subject'}
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabItem} ${activeTab === 'CLASSES' ? styles.active : ''}`}
            onClick={() => setActiveTab('CLASSES')}
          >
            Classes & Sections
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'SUBJECTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('SUBJECTS')}
          >
            Curriculum Subjects
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className={styles.inputControl} 
              style={{ paddingLeft: '44px', width: '240px' }} 
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
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading records...</p>
        </div>
      ) : filteredData.length > 0 ? (
        activeTab === 'CLASSES' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredData.map((cls) => (
              <ClassCard 
                key={cls.id}
                name={cls.name} 
                teacher={cls.teacher?.name || 'Unassigned'} 
                students={cls.students?.length || 0} 
                schedule="07:30 - 13:00" 
              />
            ))}
          </div>
        ) : (
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Subject Name</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Code</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1.25rem 2rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sbj) => (
                  <SubjectRow 
                    key={sbj.id}
                    name={sbj.name} 
                    code={sbj.code} 
                    status="Active" 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
          <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h4 style={{ margin: 0, fontWeight: 800 }}>No records found</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Start by adding your first {activeTab === 'CLASSES' ? 'class' : 'subject'}.</p>
        </div>
      )}

      <AddAcademicModal 
        isOpen={isModalOpen} 
        onCloseAction={() => setIsModalOpen(false)} 
        type={activeTab} 
        refreshDataAction={fetchData} 
      />
    </div>
  );
}

function ClassCard({ name, teacher, students, schedule }: any) {
  return (
    <div className={styles.card} style={{ padding: '1.75rem', border: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Layout size={26} />
        </div>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <MoreVertical size={20} />
        </button>
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>{name}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <User size={16} /> <span style={{ fontWeight: 600, color: '#1a1c1e' }}>{teacher}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <Users size={16} /> <span>{students} Students Enrolled</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <Clock size={16} /> <span>{schedule} • Mon - Fri</span>
        </div>
      </div>
      <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Manage Class <ChevronRight size={16} />
        </span>
        <div className={`${styles.badge} ${styles.success}`}>Active</div>
      </div>
    </div>
  );
}

function SubjectRow({ name, code, status }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.9375rem' }}>{name}</td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#6366f1', fontWeight: 700 }}>{code}</code>
      </td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <div className={`${styles.badge} ${status === 'Active' ? styles.success : styles.warning}`}>
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
