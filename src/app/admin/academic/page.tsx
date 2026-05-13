'use client';

import { useState } from 'react';
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
  Filter
} from 'lucide-react';

type AcademicTab = 'CLASSES' | 'SUBJECTS';

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState<AcademicTab>('CLASSES');

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={32} color="#6366f1" /> Academic Management
          </h1>
          <p>Organize your school's classes, subjects, and teaching schedules.</p>
        </div>
        <button className={styles.btnPrimary}>
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
            />
          </div>
          <button className={styles.btnOutline} style={{ padding: '0 1.25rem' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {activeTab === 'CLASSES' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <ClassCard name="Grade 10 - Science A" teacher="Sarah Miller" students={32} schedule="07:30 - 13:00" />
          <ClassCard name="Grade 11 - Social B" teacher="Robert Wilson" students={28} schedule="07:30 - 13:00" />
          <ClassCard name="Grade 12 - Science C" teacher="Emma Thompson" students={30} schedule="07:30 - 13:00" />
          <ClassCard name="Grade 10 - Science B" teacher="David Chen" students={31} schedule="07:30 - 13:00" />
        </div>
      ) : (
        <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Subject Name</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Teachers</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Classes</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem' }}></th>
              </tr>
            </thead>
            <tbody>
              <SubjectRow name="Advanced Mathematics" code="MATH401" teachers={4} classes={12} status="Active" />
              <SubjectRow name="Quantum Physics" code="PHYS502" teachers={2} classes={6} status="Active" />
              <SubjectRow name="Modern Literature" code="LIT201" teachers={3} classes={10} status="Active" />
              <SubjectRow name="Computer Science" code="CS101" teachers={5} classes={15} status="Draft" />
            </tbody>
          </table>
        </div>
      )}
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

function SubjectRow({ name, code, teachers, classes, status }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.9375rem' }}>{name}</td>
      <td style={{ padding: '1.25rem 2rem' }}>
        <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#6366f1', fontWeight: 700 }}>{code}</code>
      </td>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem' }}>{teachers} Assigned</td>
      <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem' }}>{classes} Classes</td>
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
