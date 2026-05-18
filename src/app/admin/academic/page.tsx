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
  AlertCircle,
  Briefcase,
  X
} from 'lucide-react';
import AddAcademicModal from '@/components/AddAcademicModal';
import { getClasses, getSubjects } from '@/app/actions/academic';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/app/actions/departments';
import { useLanguage } from '@/context/LanguageContext';

type AcademicTab = 'CLASSES' | 'SUBJECTS' | 'DEPARTMENTS';

export default function AcademicManagementPage() {
  const { dict } = useLanguage();
  const [activeTab, setActiveTab] = useState<AcademicTab>('CLASSES');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Department Modal States
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', desc: '' });
  const [deptError, setDeptError] = useState<string | null>(null);
  const [isDeptSaving, setIsDeptSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let result = [];
    if (activeTab === 'CLASSES') {
      result = await getClasses();
    } else if (activeTab === 'SUBJECTS') {
      result = await getSubjects();
    } else {
      result = await getDepartments();
    }
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

  const handleDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeptSaving(true);
    setDeptError(null);

    let res;
    if (editingDept) {
      res = await updateDepartment(editingDept.id, deptForm);
    } else {
      res = await createDepartment(deptForm);
    }

    if (res.success) {
      setIsDeptModalOpen(false);
      setDeptForm({ name: '', code: '', desc: '' });
      setEditingDept(null);
      fetchData();
    } else {
      setDeptError(res.error || 'Terjadi kesalahan sistem');
    }
    setIsDeptSaving(false);
  };

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={32} color="#6366f1" /> {dict.academic_mgmt.title}
          </h1>
          <p>{dict.academic_mgmt.subtitle}</p>
        </div>
        <button 
          className={styles.btnPrimary} 
          onClick={() => {
            if (activeTab === 'DEPARTMENTS') {
              setEditingDept(null);
              setDeptForm({ name: '', code: '', desc: '' });
              setDeptError(null);
              setIsDeptModalOpen(true);
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          <Plus size={18} /> {
            activeTab === 'CLASSES' 
              ? dict.academic_mgmt.create_class
              : activeTab === 'SUBJECTS'
                ? dict.academic_mgmt.add_subject
                : dict.academic_mgmt.add_department
          }
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabItem} ${activeTab === 'CLASSES' ? styles.active : ''}`}
            onClick={() => setActiveTab('CLASSES')}
          >
            {dict.academic_mgmt.tab_classes}
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'SUBJECTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('SUBJECTS')}
          >
            {dict.academic_mgmt.tab_subjects}
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'DEPARTMENTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('DEPARTMENTS')}
          >
            {dict.academic_mgmt.tab_departments}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder={dict.academic_mgmt.quick_search}
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
          <p style={{ marginTop: '1rem', color: '#64748b' }}>{dict.academic_mgmt.loading}</p>
        </div>
      ) : filteredData.length > 0 ? (
        activeTab === 'CLASSES' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredData.map((cls) => (
              <ClassCard 
                key={cls.id}
                name={cls.name} 
                teacher={cls.teacher?.name || dict.academic_mgmt.unassigned} 
                students={cls.students?.length || 0} 
                schedule="07:30 - 13:00" 
              />
            ))}
          </div>
        ) : activeTab === 'SUBJECTS' ? (
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.subject_name}</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.code}</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.status}</th>
                  <th style={{ padding: '1.25rem 2rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sbj) => (
                  <SubjectRow 
                    key={sbj.id}
                    name={sbj.name} 
                    code={sbj.code} 
                    status={dict.academic_mgmt.active} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Departments CRUD View */
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.code}</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.dept_name}</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dict.academic_mgmt.dept_desc}</th>
                  <th style={{ padding: '1.25rem 2rem' }}>{dict.academic_mgmt.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((dept) => (
                  <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <code style={{ background: '#f1f0ff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#6366f1', fontWeight: 700 }}>{dept.code}</code>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>{dept.name}</td>
                    <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: '#64748b' }}>{dept.desc || '-'}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button 
                          onClick={() => {
                            setEditingDept(dept);
                            setDeptForm({ name: dept.name, code: dept.code, desc: dept.desc });
                            setDeptError(null);
                            setIsDeptModalOpen(true);
                          }}
                          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}
                        >
                          {dict.academic_mgmt.edit}
                        </button>
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <button 
                          onClick={async () => {
                            if (confirm(`${dict.academic_mgmt.confirm_delete_dept}${dept.name}?`)) {
                              const res = await deleteDepartment(dept.id);
                              if (res.success) {
                                fetchData();
                              } else {
                                alert(res.error || 'Failed');
                              }
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}
                        >
                          {dict.academic_mgmt.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
          <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h4 style={{ margin: 0, fontWeight: 800 }}>{dict.academic_mgmt.no_data}</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{dict.academic_mgmt.no_data_desc}</p>
        </div>
      )}

      <AddAcademicModal 
        isOpen={isModalOpen} 
        onCloseAction={() => setIsModalOpen(false)} 
        type={activeTab === 'DEPARTMENTS' ? 'CLASSES' : activeTab} 
        refreshDataAction={fetchData} 
      />

      {/* Dynamic Compact Department Modal */}
      {isDeptModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative', animation: 'modalIn 0.3s ease-out' }}>
            <button onClick={() => setIsDeptModalOpen(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Briefcase size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>
                  {editingDept ? dict.academic_mgmt.edit_dept : dict.academic_mgmt.create_dept}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{dict.academic_mgmt.dept_modal_desc}</p>
              </div>
            </div>

            {deptError && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem' }}>
                {deptError}
              </div>
            )}

            <form onSubmit={handleDeptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.academic_mgmt.dept_code}</label>
                <input 
                  type="text" 
                  className={styles.inputControl} 
                  value={deptForm.code} 
                  onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })} 
                  placeholder="e.g. CURR"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.academic_mgmt.dept_name}</label>
                <input 
                  type="text" 
                  className={styles.inputControl} 
                  value={deptForm.name} 
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} 
                  placeholder="e.g. Kurikulum & Akademik"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.academic_mgmt.dept_desc}</label>
                <textarea 
                  className={styles.inputControl} 
                  value={deptForm.desc} 
                  onChange={e => setDeptForm({ ...deptForm, desc: e.target.value })} 
                  placeholder={dict.academic_mgmt.dept_placeholder}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary} 
                style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}
                disabled={isDeptSaving}
              >
                {isDeptSaving ? <RefreshCcw size={18} className={styles.spin} /> : <Plus size={18} />}
                {isDeptSaving ? dict.academic_mgmt.saving : editingDept ? dict.academic_mgmt.save_changes : dict.academic_mgmt.create_dept}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassCard({ name, teacher, students, schedule }: any) {
  const { dict } = useLanguage();
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
          <Users size={16} /> <span>{students} {dict.academic_mgmt.students_enrolled}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#64748b' }}>
          <Clock size={16} /> <span>{schedule} • {dict.academic_mgmt.schedule_days}</span>
        </div>
      </div>
      <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          {dict.academic_mgmt.manage_class} <ChevronRight size={16} />
        </span>
        <div className={`${styles.badge} ${styles.success}`}>{dict.academic_mgmt.active}</div>
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
        <div className={`${styles.badge} ${styles.success}`}>
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
