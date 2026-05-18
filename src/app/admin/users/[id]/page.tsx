'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  ArrowLeft, User, Mail, Phone, Shield, UserCog, Edit3, Save, Briefcase, GraduationCap, Users, Link as LinkIcon, Unlink, BookOpen, Medal, TrendingUp, FileText, Bookmark, Plus, Trash2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  getUserById, updateUser, getUsersByRole, linkParentToStudent, unlinkStudentFromParent,
  getAcademicTerms, upsertAcademicRecord, deleteAcademicRecord, upsertGrade, deleteGrade,
  assignSubjectToGuru, unassignSubjectFromGuru, assignHomeroomToGuru, unassignHomeroomFromGuru
} from '@/app/actions/users';
import { getClasses, getSubjects } from '@/app/actions/academic';
import { getDepartments } from '@/app/actions/departments';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const { dict, language } = useLanguage();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [availableParents, setAvailableParents] = useState<any[]>([]);
  const [selectedLinkStudentId, setSelectedLinkStudentId] = useState('');
  const [selectedLinkParentId, setSelectedLinkParentId] = useState('');

  // Academic Management states
  const [classes, setClasses] = useState<any[]>([]);
  const [academicTerms, setAcademicTerms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const getPositionsList = () => {
    const defaults = ['Guru Mata Pelajaran', 'Wali Kelas'];
    const depts = departments.map(d => `Kepala Departemen ${d.name}`);
    return [...defaults, ...depts];
  };
  
  // Adding new academic record state
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  const [newRecordData, setNewRecordData] = useState({
    classId: '',
    termId: '',
    promotionStatus: 'Naik Kelas',
    averageScore: '',
    ranking: '',
    teacherNotes: ''
  });

  // Adding new grade state
  const [showAddGradeFormForRecordId, setShowAddGradeFormForRecordId] = useState<string | null>(null);
  const [newGradeData, setNewGradeData] = useState({
    type: 'UTS',
    score: '',
    subjectId: '',
    term: ''
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    if (user?.role === 'SISWA') {
      getClasses().then(setClasses);
      getAcademicTerms().then(setAcademicTerms);
      getSubjects().then(setSubjects);
    } else if (user?.role === 'GURU') {
      getClasses().then(setClasses);
      getSubjects().then(setSubjects);
      getDepartments().then(setDepartments);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    const data = await getUserById(userId);
    if (data) {
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        nis: data.siswaProfile?.nis || '',
        nisn: data.siswaProfile?.nisn || '',
        birthPlace: data.siswaProfile?.birthPlace || '',
        birthDate: data.siswaProfile?.birthDate ? new Date(data.siswaProfile.birthDate).toISOString().split('T')[0] : '',
        gender: data.siswaProfile?.gender || '',
        religion: data.siswaProfile?.religion || '',
        citizenship: data.siswaProfile?.citizenship || 'WNI',
        nip: data.guruProfile?.nip || '',
        position: data.guruProfile?.position || '',
      });
      
      // Fetch link options
      if (data.role === 'ORANG_TUA') {
        getUsersByRole('SISWA').then(setAvailableStudents);
      } else if (data.role === 'SISWA') {
        getUsersByRole('ORANG_TUA').then(setAvailableParents);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateUser(user.id, formData);
    
    // Handle linking if selected
    if (user.role === 'ORANG_TUA' && selectedLinkStudentId) {
      await linkParentToStudent(user.id, selectedLinkStudentId);
      setSelectedLinkStudentId('');
    } else if (user.role === 'SISWA' && selectedLinkParentId) {
      await linkParentToStudent(selectedLinkParentId, user.id);
      setSelectedLinkParentId('');
    }

    if (res.success) {
      setIsEditing(false);
      fetchUser();
    } else {
      alert(res.error || dict.user_detail.failed_to_save);
    }
    setIsSaving(false);
  };

  const handleUnlink = async (studentUserId: string) => {
    if (confirm(dict.user_detail.confirm_unlink)) {
      await unlinkStudentFromParent(studentUserId);
      fetchUser();
    }
  };

  // Academic Records Management Handlers
  const handleAddAcademicRecord = async () => {
    if (!newRecordData.classId || !newRecordData.termId) {
      alert("Kelas dan Tahun Ajaran harus diisi!");
      return;
    }
    const res = await upsertAcademicRecord({
      studentId: user.siswaProfile.id,
      classId: newRecordData.classId,
      termId: newRecordData.termId,
      promotionStatus: newRecordData.promotionStatus,
      averageScore: newRecordData.averageScore ? parseFloat(newRecordData.averageScore) : undefined,
      ranking: newRecordData.ranking ? parseInt(newRecordData.ranking) : undefined,
      teacherNotes: newRecordData.teacherNotes
    });
    if (res.success) {
      setShowAddRecordForm(false);
      setNewRecordData({
        classId: '',
        termId: '',
        promotionStatus: 'Naik Kelas',
        averageScore: '',
        ranking: '',
        teacherNotes: ''
      });
      fetchUser();
    } else {
      alert("Gagal menambahkan riwayat akademik");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat akademik ini?")) {
      const res = await deleteAcademicRecord(id);
      if (res.success) {
        fetchUser();
      } else {
        alert("Gagal menghapus riwayat akademik");
      }
    }
  };

  const handleAddGrade = async (recordTermId: string) => {
    if (!newGradeData.subjectId || !newGradeData.score) {
      alert("Mata Pelajaran dan Nilai harus diisi!");
      return;
    }
    const res = await upsertGrade({
      studentId: user.siswaProfile.id,
      type: newGradeData.type,
      score: parseFloat(newGradeData.score),
      subjectId: newGradeData.subjectId,
      term: recordTermId
    });
    if (res.success) {
      setShowAddGradeFormForRecordId(null);
      setNewGradeData({
        type: 'UTS',
        score: '',
        subjectId: '',
        term: ''
      });
      fetchUser();
    } else {
      alert("Gagal menambahkan nilai");
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus nilai ini?")) {
      const res = await deleteGrade(gradeId);
      if (res.success) {
        fetchUser();
      } else {
        alert("Gagal menghapus nilai");
      }
    }
  };

  // Guru Assignment Handlers
  const handleAssignSubject = async () => {
    if (!selectedSubjectId) return;
    const res = await assignSubjectToGuru(user.guruProfile.id, selectedSubjectId);
    if (res.success) {
      setSelectedSubjectId('');
      fetchUser();
    } else {
      alert("Gagal menambahkan bidang studi");
    }
  };

  const handleUnassignSubject = async (subjectId: string) => {
    if (confirm("Apakah Anda yakin ingin melepas bidang studi ini?")) {
      const res = await unassignSubjectFromGuru(user.guruProfile.id, subjectId);
      if (res.success) {
        fetchUser();
      } else {
        alert("Gagal melepas bidang studi");
      }
    }
  };

  const handleAssignHomeroom = async () => {
    if (!selectedClassId) return;
    const res = await assignHomeroomToGuru(user.guruProfile.id, selectedClassId);
    if (res.success) {
      setSelectedClassId('');
      fetchUser();
    } else {
      alert("Gagal menetapkan wali kelas");
    }
  };

  const handleUnassignHomeroom = async (classId: string) => {
    if (confirm("Apakah Anda yakin ingin melepas status wali kelas untuk kelas ini?")) {
      const res = await unassignHomeroomFromGuru(classId);
      if (res.success) {
        fetchUser();
      } else {
        alert("Gagal melepas status wali kelas");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>{dict.user_detail.loading_user}</div>;
  }

  if (!user) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>{dict.user_detail.user_not_found}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => router.push('/admin/users')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> {dict.user_detail.back_to_directory}
        </button>
      </div>

      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <User size={32} color="#6366f1" /> {dict.user_detail.profile_detail}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#8c8e91', fontSize: '0.875rem' }}>{dict.user_detail.manage_info_for} {user.name}.</p>
        </div>
        <div>
          {!isEditing ? (
            <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}>
              <Edit3 size={18} /> {dict.user_detail.edit_profile}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={styles.btnOutline} onClick={() => { setIsEditing(false); setFormData({...user, nisn: user.siswaProfile?.nisn, nip: user.guruProfile?.nip, position: user.guruProfile?.position}); }}>
                {dict.user_detail.cancel}
              </button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={isSaving}>
                <Save size={18} /> {isSaving ? dict.user_detail.saving : dict.user_detail.save_changes}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* Left Column - Basic Info */}
        <div className={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '24px', background: '#f1f0ff', color: '#6366f1', fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              {user.name?.charAt(0)}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{user.name}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f8fafc', borderRadius: 'full', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginTop: '0.5rem' }}>
              <Shield size={14} /> {user.role}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <User size={14} /> {dict.user_detail.full_name}
              </label>
              {isEditing ? (
                <input className={styles.inputControl} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              ) : (
                <div style={{ fontWeight: 600, color: '#334155' }}>{user.name}</div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Mail size={14} /> {dict.user_detail.email}
              </label>
              {isEditing ? (
                <input className={styles.inputControl} type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
              ) : (
                <div style={{ fontWeight: 600, color: '#334155' }}>{user.email || '-'}</div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Phone size={14} /> {dict.user_detail.phone}
              </label>
              {isEditing ? (
                <input className={styles.inputControl} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
              ) : (
                <div style={{ fontWeight: 600, color: '#334155' }}>{user.phone || '-'}</div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Briefcase size={14} /> {dict.user_detail.address}
              </label>
              {isEditing ? (
                <textarea className={styles.inputControl} rows={3} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
              ) : (
                <div style={{ fontWeight: 600, color: '#334155', whiteSpace: 'pre-line' }}>{user.address || '-'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Role Specific Info */}
        <div className={styles.card}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <UserCog size={20} color="#6366f1" /> {dict.user_detail.institution_specific_info}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {user.role === 'SISWA' && (
              <>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={18} /> {dict.user_detail.student_ledger}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.nis}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} value={formData.nis || ''} onChange={e => setFormData({...formData, nis: e.target.value})} placeholder={dict.user_detail.enter_nis} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.nis || '-'}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.nisn}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} value={formData.nisn || ''} onChange={e => setFormData({...formData, nisn: e.target.value})} placeholder={dict.user_detail.enter_nisn} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.nisn || dict.user_detail.not_set}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.birth_place}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} value={formData.birthPlace || ''} onChange={e => setFormData({...formData, birthPlace: e.target.value})} placeholder={dict.user_detail.enter_birth_place} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.birthPlace || '-'}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.birth_date}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} type="date" value={formData.birthDate || ''} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.birthDate ? new Date(user.siswaProfile.birthDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.gender}</label>
                      {isEditing ? (
                        <select className={styles.inputControl} value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})}>
                          <option value="">{dict.user_detail.select}</option>
                          <option value="L">{dict.user_detail.male}</option>
                          <option value="P">{dict.user_detail.female}</option>
                        </select>
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.gender === 'L' ? dict.user_detail.male : user.siswaProfile?.gender === 'P' ? dict.user_detail.female : '-'}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.religion}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} value={formData.religion || ''} onChange={e => setFormData({...formData, religion: e.target.value})} placeholder={dict.user_detail.religion} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.religion || '-'}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>{dict.user_detail.citizenship}</label>
                      {isEditing ? (
                        <input className={styles.inputControl} value={formData.citizenship || ''} onChange={e => setFormData({...formData, citizenship: e.target.value})} placeholder={dict.user_detail.enter_citizenship} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{user.siswaProfile?.citizenship || '-'}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{dict.user_detail.parent_profile_status}</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Users size={20} color={user.siswaProfile?.parent ? '#10b981' : '#94a3b8'} />
                      <span style={{ fontWeight: 600 }}>
                        {user.siswaProfile?.parent 
                          ? `${dict.user_detail.parent_name} ${user.siswaProfile.parent.user?.name || 'Orang Tua'}` 
                          : dict.user_detail.not_linked}
                      </span>
                    </div>
                    {user.siswaProfile?.parent && isEditing && (
                      <button onClick={() => handleUnlink(user.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Unlink size={14} /> {dict.user_detail.unlink}
                      </button>
                    )}
                  </div>
                  
                  {isEditing && !user.siswaProfile?.parent && (
                    <div style={{ marginTop: '10px' }}>
                      <select 
                        className={styles.inputControl} 
                        value={selectedLinkParentId}
                        onChange={(e) => setSelectedLinkParentId(e.target.value)}
                      >
                        <option value="">{dict.user_detail.select_parent_to_link}</option>
                        {availableParents.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            {user.role === 'GURU' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{dict.user_detail.nip}</label>
                    {isEditing ? (
                      <input className={styles.inputControl} value={formData.nip || ''} onChange={e => setFormData({...formData, nip: e.target.value})} placeholder={dict.user_detail.enter_nip} />
                    ) : (
                      <div style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1e293b' }}>{user.guruProfile?.nip || dict.user_detail.not_set}</div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{dict.user_detail.position}</label>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <select 
                          className={styles.inputControl}
                          value={
                            getPositionsList().includes(formData.position || '')
                              ? formData.position
                              : formData.position ? 'custom' : ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'custom') {
                              setFormData({ ...formData, position: 'Jabatan Baru' });
                            } else {
                              setFormData({ ...formData, position: val });
                            }
                          }}
                        >
                          <option value="">{dict.academic_mgmt.select_dept}</option>
                          <option value="Guru Mata Pelajaran">{dict.user_detail.default_position}</option>
                          <option value="Wali Kelas">{dict.user_detail.homeroom_class || 'Wali Kelas'}</option>
                          
                          {/* Dynamically list departments loaded from CRUD */}
                          {departments.map((dept) => (
                            <option key={dept.id} value={`Kepala Departemen ${dept.name}`}>
                              {language === 'en' 
                                ? `Head of ${dept.name} Department`
                                : `Kepala Departemen ${dept.name}`}
                            </option>
                          ))}

                          <option value="custom">{dict.academic_mgmt.custom_role}</option>
                        </select>

                        {/* Show text input ONLY if custom option is selected */}
                        {!['', ...getPositionsList()].includes(formData.position || '') && (
                          <input 
                            className={styles.inputControl} 
                            value={formData.position || ''} 
                            onChange={e => setFormData({...formData, position: e.target.value})} 
                            placeholder={dict.academic_mgmt.enter_custom_role} 
                          />
                        )}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1e293b' }}>{user.guruProfile?.position || dict.user_detail.default_position}</div>
                    )}
                  </div>
                </div>

                {/* Assigned Subjects / Bidang Studi */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={16} /> {dict.user_detail.assigned_subjects}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {user.guruProfile?.subjects?.length > 0 ? (
                      user.guruProfile.subjects.map((sub: any) => (
                        <div key={sub.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', color: '#4338ca', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600 }}>
                          <span>{sub.name} ({sub.code || 'N/A'})</span>
                          {isEditing && (
                            <button 
                              type="button" 
                              onClick={() => handleUnassignSubject(sub.id)} 
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>
                        {dict.user_detail.no_subjects}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '360px', marginTop: '12px' }}>
                      <select 
                        className={styles.inputControl} 
                        style={{ fontSize: '0.8125rem', height: '36px' }}
                        value={selectedSubjectId}
                        onChange={e => setSelectedSubjectId(e.target.value)}
                      >
                        <option value="">{dict.user_detail.assign_subject}</option>
                        {subjects
                          .filter(s => !user.guruProfile?.subjects?.some((sub: any) => sub.id === s.id))
                          .map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code || 'N/A'})</option>
                          ))
                        }
                      </select>
                      <button 
                        type="button" 
                        onClick={handleAssignSubject} 
                        className={styles.btnPrimary} 
                        style={{ fontSize: '0.8125rem', padding: '0 12px', height: '36px', borderRadius: '8px' }}
                      >
                        Tambah
                      </button>
                    </div>
                  )}
                </div>

                {/* Homeroom Class / Kelas Binaan */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> {dict.user_detail.homeroom_class}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {user.guruProfile?.classes?.length > 0 ? (
                      user.guruProfile.classes.map((cls: any) => (
                        <div key={cls.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600 }}>
                          <span>{cls.name}</span>
                          {isEditing && (
                            <button 
                              type="button" 
                              onClick={() => handleUnassignHomeroom(cls.id)} 
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>
                        {dict.user_detail.no_homeroom}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '360px', marginTop: '12px' }}>
                      <select 
                        className={styles.inputControl} 
                        style={{ fontSize: '0.8125rem', height: '36px' }}
                        value={selectedClassId}
                        onChange={e => setSelectedClassId(e.target.value)}
                      >
                        <option value="">{dict.user_detail.assign_homeroom}</option>
                        {classes
                          .filter(c => !user.guruProfile?.classes?.some((cls: any) => cls.id === c.id))
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))
                        }
                      </select>
                      <button 
                        type="button" 
                        onClick={handleAssignHomeroom} 
                        className={styles.btnPrimary} 
                        style={{ fontSize: '0.8125rem', padding: '0 12px', height: '36px', borderRadius: '8px' }}
                      >
                        Tetapkan
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {user.role === 'ORANG_TUA' && (
              <div>
                <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{dict.user_detail.linked_children}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {user.parentProfile?.students?.length > 0 ? (
                    user.parentProfile.students.map((s: any) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <GraduationCap size={24} color="#6366f1" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700 }}>{s.user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NISN: {s.nisn || '-'}</div>
                        </div>
                        {isEditing && (
                          <button onClick={() => handleUnlink(s.userId)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={dict.user_detail.unlink}>
                            <Unlink size={16} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                      {dict.user_detail.no_linked_students}
                    </div>
                  )}

                  {isEditing && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '10px' }}>
                      <select 
                        className={styles.inputControl} 
                        value={selectedLinkStudentId}
                        onChange={(e) => setSelectedLinkStudentId(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="">{dict.user_detail.add_new_student_link}</option>
                        {availableStudents.filter(st => !st.siswaProfile?.parentId).map(st => (
                          <option key={st.id} value={st.id}>{st.name} (NISN: {st.siswaProfile?.nisn || '-'})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user.role === 'SCHOOL_ADMIN' && (
              <div>
                <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{dict.user_detail.job_assignments}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {/* Since Job Assignments was just added to formData in AddUserModal but not to DB schema in users.ts, we mock it or show a placeholder */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: 'full', fontSize: '0.875rem', fontWeight: 600 }}>
                    <Briefcase size={14} /> {dict.user_detail.general_admin}
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>{dict.user_detail.admin_note}</p>
              </div>
            )}
            
            {user.role === 'SUPER_ADMIN' && (
              <div style={{ padding: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#b45309' }}>{dict.user_detail.full_access_title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#d97706' }}>{dict.user_detail.full_access_desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.role === 'SISWA' && (
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <BookOpen size={20} color="#6366f1" /> {dict.user_detail.academic_data_history}
            </h3>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => setShowAddRecordForm(!showAddRecordForm)} 
                className={styles.btnPrimary} 
                style={{ fontSize: '0.8125rem', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Tambah Riwayat
              </button>
            )}
          </div>

          {/* Add New Academic Record Form (Inline Card) */}
          {isEditing && showAddRecordForm && (
            <div style={{ padding: '1.5rem', border: '2px dashed #6366f1', borderRadius: '12px', background: '#f5f3ff', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} /> Tambah Riwayat Akademik Baru
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kelas & Jurusan</label>
                  <select 
                    className={styles.inputControl} 
                    value={newRecordData.classId} 
                    onChange={e => setNewRecordData({...newRecordData, classId: e.target.value})}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tahun Ajaran / Term</label>
                  <select 
                    className={styles.inputControl} 
                    value={newRecordData.termId} 
                    onChange={e => setNewRecordData({...newRecordData, termId: e.target.value})}
                  >
                    <option value="">-- Pilih Tahun Ajaran --</option>
                    {academicTerms.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Riwayat</label>
                  <select 
                    className={styles.inputControl} 
                    value={newRecordData.promotionStatus} 
                    onChange={e => setNewRecordData({...newRecordData, promotionStatus: e.target.value})}
                  >
                    <option value="Naik Kelas">Naik Kelas</option>
                    <option value="Tinggal Kelas">Tinggal Kelas</option>
                    <option value="Lulus">Lulus</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Rata-rata Nilai</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="Contoh: 85.5" 
                    className={styles.inputControl} 
                    value={newRecordData.averageScore} 
                    onChange={e => setNewRecordData({...newRecordData, averageScore: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ranking (Opsional)</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 3" 
                    className={styles.inputControl} 
                    value={newRecordData.ranking} 
                    onChange={e => setNewRecordData({...newRecordData, ranking: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan Guru / Wali Kelas</label>
                <textarea 
                  className={styles.inputControl} 
                  rows={2} 
                  placeholder="Berikan catatan evaluasi..." 
                  value={newRecordData.teacherNotes} 
                  onChange={e => setNewRecordData({...newRecordData, teacherNotes: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddRecordForm(false)} 
                  className={styles.btnOutline} 
                  style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  onClick={handleAddAcademicRecord} 
                  className={styles.btnPrimary} 
                  style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                >
                  Simpan Riwayat
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {/* Academic Records List */}
            {user.siswaProfile?.academicRecords?.length > 0 ? (
              user.siswaProfile.academicRecords.map((record: any, idx: number) => (
                <div key={record.id || idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', position: 'relative' }}>
                  
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => handleDeleteRecord(record.id)} 
                      style={{ position: 'absolute', top: '12px', right: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Hapus Riwayat Akademik"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem', paddingRight: isEditing ? '32px' : '0' }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bookmark size={16} color="#6366f1" /> {record.class?.name || dict.user_detail.class_not_set}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '4px' }}>
                      {record.term?.name || dict.user_detail.academic_year}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={12} /> {dict.user_detail.history_status}
                      </div>
                      <div style={{ fontWeight: 600, color: record.promotionStatus === 'Tinggal Kelas' ? '#ef4444' : '#10b981' }}>
                        {record.promotionStatus || '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Medal size={12} /> {dict.user_detail.average_ranking}
                      </div>
                      <div style={{ fontWeight: 600, color: '#334155' }}>
                        {record.averageScore ? record.averageScore.toFixed(2) : '-'} / {record.ranking ? `${dict.user_detail.rank} ${record.ranking}` : '-'}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <FileText size={12} /> {dict.user_detail.teacher_notes}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#334155', fontStyle: record.teacherNotes ? 'normal' : 'italic' }}>
                      {record.teacherNotes || dict.user_detail.no_notes}
                    </div>
                  </div>

                  {/* Grades Section */}
                  <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>
                        {dict.user_detail.grades_per_subject}
                      </span>
                      {isEditing && showAddGradeFormForRecordId !== record.id && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowAddGradeFormForRecordId(record.id);
                            setNewGradeData({...newGradeData, term: record.termId});
                          }} 
                          style={{ background: '#6366f1', border: 'none', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                        >
                          <Plus size={10} /> Tambah
                        </button>
                      )}
                    </div>

                    {/* Add Grade Form (Inline Inside Card) */}
                    {isEditing && showAddGradeFormForRecordId === record.id && (
                      <div style={{ padding: '8px 12px', background: '#f5f3ff', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '6px', marginBottom: '6px' }}>
                          <select 
                            style={{ fontSize: '0.75rem', padding: '4px' }} 
                            className={styles.inputControl}
                            value={newGradeData.subjectId} 
                            onChange={e => setNewGradeData({...newGradeData, subjectId: e.target.value})}
                          >
                            <option value="">-- Mapel --</option>
                            {subjects.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                          <select 
                            style={{ fontSize: '0.75rem', padding: '4px' }} 
                            className={styles.inputControl}
                            value={newGradeData.type} 
                            onChange={e => setNewGradeData({...newGradeData, type: e.target.value})}
                          >
                            <option value="UTS">UTS</option>
                            <option value="UAS">UAS</option>
                            <option value="Tugas">Tugas</option>
                            <option value="Kuis">Kuis</option>
                          </select>
                          <input 
                            type="number" 
                            placeholder="Nilai" 
                            style={{ fontSize: '0.75rem', padding: '4px' }} 
                            className={styles.inputControl}
                            value={newGradeData.score} 
                            onChange={e => setNewGradeData({...newGradeData, score: e.target.value})}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button 
                            type="button" 
                            style={{ fontSize: '0.6875rem', padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => setShowAddGradeFormForRecordId(null)}
                          >
                            Batal
                          </button>
                          <button 
                            type="button" 
                            style={{ fontSize: '0.6875rem', padding: '2px 6px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => handleAddGrade(record.termId)}
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    )}

                    {user.siswaProfile?.grades?.filter((g: any) => g.term === record.termId || g.term === record.term?.name).length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                        <tbody>
                          {user.siswaProfile.grades.filter((g: any) => g.term === record.termId || g.term === record.term?.name).map((grade: any, i: number) => (
                            <tr key={grade.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '6px 12px', color: '#334155' }}>{grade.subject?.name || dict.user_detail.subject}</td>
                              <td style={{ padding: '6px 12px', color: '#64748b', textAlign: 'right' }}>{grade.type}</td>
                              <td style={{ padding: '6px 12px', fontWeight: 700, color: '#0f172a', textAlign: 'right', width: '50px' }}>{grade.score}</td>
                              {isEditing && (
                                <td style={{ padding: '4px 8px', width: '30px', textAlign: 'center' }}>
                                  <button 
                                    type="button" 
                                    onClick={() => handleDeleteGrade(grade.id)} 
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Hapus Nilai"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: '0.75rem', fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        {dict.user_detail.no_grades}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', gridColumn: '1 / -1', background: '#f8fafc', borderRadius: '12px' }}>
                {dict.user_detail.no_academic_history}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
