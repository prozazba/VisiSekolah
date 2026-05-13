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
  ChevronRight
} from 'lucide-react';

export default function AcademicManagementPage() {
  const [view, setView] = useState<'CLASSES' | 'SUBJECTS'>('CLASSES');

  return (
    <div>
      <header className={styles.greeting} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={32} color="#6366f1" /> Academic Management
        </h1>
        <p>Organize your school's classes, subjects, and teaching schedules.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '6px', borderRadius: '14px' }}>
          <button 
            onClick={() => setView('CLASSES')}
            style={{ 
              padding: '8px 20px', 
              borderRadius: '10px', 
              border: 'none', 
              background: view === 'CLASSES' ? 'white' : 'transparent',
              color: view === 'CLASSES' ? '#1a1c1e' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: view === 'CLASSES' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Classes
          </button>
          <button 
            onClick={() => setView('SUBJECTS')}
            style={{ 
              padding: '8px 20px', 
              borderRadius: '10px', 
              border: 'none', 
              background: view === 'SUBJECTS' ? 'white' : 'transparent',
              color: view === 'SUBJECTS' ? '#1a1c1e' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: view === 'SUBJECTS' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Subjects
          </button>
        </div>
        <button style={{ padding: '12px 24px', borderRadius: '16px', background: '#111', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <Plus size={18} /> {view === 'CLASSES' ? 'Add Class' : 'Add Subject'}
        </button>
      </div>

      {view === 'CLASSES' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <ClassCard name="Grade 10 - A" teacher="Sarah Miller" students={32} schedule="Mon - Fri" />
          <ClassCard name="Grade 11 - B" teacher="Robert Wilson" students={28} schedule="Mon - Fri" />
          <ClassCard name="Grade 12 - C" teacher="Emma Thompson" students={30} schedule="Mon - Fri" />
          <ClassCard name="Grade 10 - B" teacher="David Chen" students={31} schedule="Mon - Fri" />
        </div>
      ) : (
        <section className={styles.card} style={{ padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subject Name</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Teachers</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Classes</th>
                <th style={{ padding: '1rem' }}></th>
              </tr>
            </thead>
            <tbody>
              <SubjectRow name="Advanced Mathematics" code="MATH401" teachers={4} classes={12} />
              <SubjectRow name="Quantum Physics" code="PHYS502" teachers={2} classes={6} />
              <SubjectRow name="Modern Literature" code="LIT201" teachers={3} classes={10} />
              <SubjectRow name="Computer Science" code="CS101" teachers={5} classes={15} />
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function ClassCard({ name, teacher, students, schedule }: any) {
  return (
    <div className={styles.card} style={{ padding: '1.75rem', border: '1px solid transparent', transition: 'all 0.2s', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Layout size={24} />
        </div>
        <MoreVertical size={18} color="#94a3b8" />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{name}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <User size={16} /> <span style={{ fontWeight: 600, color: '#1a1c1e' }}>{teacher}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <Users size={16} /> <span>{students} Students Enrolled</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <Clock size={16} /> <span>{schedule} Schedule</span>
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6366f1', fontWeight: 700, fontSize: '0.875rem' }}>
        View Details <ChevronRight size={16} />
      </div>
    </div>
  );
}

function SubjectRow({ name, code, teachers, classes }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1.25rem 1rem', fontWeight: 700, fontSize: '0.9375rem' }}>{name}</td>
      <td style={{ padding: '1.25rem 1rem' }}><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>{code}</code></td>
      <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{teachers} Assigned</td>
      <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{classes} Classes</td>
      <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
        <MoreVertical size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
      </td>
    </tr>
  );
}
