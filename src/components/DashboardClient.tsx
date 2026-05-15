'use client';

import styles from '@/styles/dashboard-v2.module.scss';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Clock, 
  MoreVertical,
  Calendar,
  Bell,
  Plus
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardClientProps {
  stats: {
    studentCount: number;
    teacherCount: number;
    classCount: number;
    subjectCount: number;
  };
  roleTitle: string;
}

export default function DashboardClient({ stats, roleTitle }: DashboardClientProps) {
  const { dict } = useLanguage();
  const d = dict.dashboard;

  return (
    <div className={styles.twoColumnLayout}>
      <div>
        <header className={styles.greeting}>
          <h1>{d.greetings} {roleTitle}!</h1>
          <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {d.school_portal}</p>
        </header>

        <section className={styles.statsGrid}>
          <StatCard icon={<FileText size={20} color="#6366f1" />} label={d.total_classes} value={stats.classCount.toString().padStart(2, '0') + '/10'} />
          <StatCard icon={<Users size={20} color="#a855f7" />} label={d.total_students} value={stats.studentCount.toString().padStart(2, '0') + '/50'} />
          <StatCard icon={<BookOpen size={20} color="#22c55e" />} label={d.total_subjects} value={stats.subjectCount.toString().padStart(2, '0') + '/20'} />
          <StatCard icon={<Clock size={20} color="#06b6d4" />} label={d.staff_online} value={stats.teacherCount.toString().padStart(2, '0')} />
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>{d.student_performance}</h3>
              <MoreVertical size={16} color="#8c8e91" />
            </div>
            <div className={styles.performanceList}>
              <StudentItem name="Oliver James" info="Grade 10 - A" score="98%" />
              <StudentItem name="Sophia Garcia" info="Grade 11 - B" score="92%" />
              <StudentItem name="Ethan Hunt" info="Grade 12 - C" score="95%" />
              <StudentItem name="Isabella Ross" info="Grade 10 - B" score="96%" />
            </div>
          </section>

          <section className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>{d.attendance_overview}</h3>
              <div style={{ fontSize: '0.75rem', color: '#8c8e91', border: '1px solid #eee', padding: '4px 8px', borderRadius: '8px' }}>Weekly</div>
            </div>
            <div style={{ height: '200px', width: '100%', background: 'linear-gradient(transparent, #f1f0ff)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: '40px', left: '10%', width: '80%', height: '2px', background: '#6366f1', opacity: 0.2 }}></div>
              <div style={{ position: 'absolute', bottom: '60px', left: '30%', width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%', border: '2px solid white' }}></div>
            </div>
          </section>
        </div>

        <section className={styles.lessonsSection}>
          <h3 style={{ fontWeight: 800 }}>{d.academic_schedule}</h3>
          <LessonCard time="10:30 AM" title="Mathematics - Advanced Calculus" sub="Room 102 • 60 min" subject="Academic" />
          <LessonCard time="11:45 AM" title="Physics - Quantum Mechanics" sub="Lab 04 • 45 min" subject="Academic" />
          <LessonCard time="01:30 PM" title="World History - Industrial Era" sub="Hall B • 90 min" subject="General" />
        </section>
      </div>

      {/* Right Sidebar */}
      <aside className={styles.rightSidebar}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}></div>
          <div className={styles.info}>
            <div className={styles.name}>System Administrator</div>
            <div className={styles.email}>admin@visisekolah.id</div>
          </div>
          <Bell size={20} color="#8c8e91" style={{ marginLeft: 'auto' }} />
        </div>

        <div className={styles.calendarPlaceholder}>
          <div style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 800 }}>May 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', fontSize: '0.75rem' }}>
            {[...Array(31)].map((_, i) => (
              <div key={i} style={{ padding: '4px', borderRadius: '6px', background: i === 7 ? '#6366f1' : 'transparent', color: i === 7 ? 'white' : 'inherit' }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: 0, fontWeight: 800 }}>{d.upcoming_events}</h4>
            <MoreVertical size={16} color="#8c8e91" />
          </div>
          <EventItem time="09:00 - 10:00 am" title="Monthly Teachers Meeting" />
          <EventItem time="11:00 - 12:00 am" title="Board of Directors Review" />
        </section>

        <section className={styles.notesSection}>
          <div className={styles.header}>
            <h4 style={{ fontWeight: 800 }}>{d.admin_notes} <span style={{ fontSize: '0.75rem', background: '#6366f1', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>05</span></h4>
            <button style={{ fontSize: '0.75rem', background: 'none', border: '1px solid #6366f1', color: '#6366f1', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={12} /> {d.add_note}
            </button>
          </div>
          <div className={styles.noteItem}>
            Finalize student reports for Grade 10 by end of week.
          </div>
          <div className={styles.noteItem} style={{ background: '#f0fdf4', borderLeftColor: '#22c55e' }}>
            Schedule maintenance for the school server.
          </div>
        </section>
      </aside>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className={styles.statCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.iconBox}>{icon}</div>
        <MoreVertical size={14} color="#8c8e91" />
      </div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}

function StudentItem({ name, info, score }: any) {
  return (
    <div className={styles.studentItem}>
      <div className={styles.avatar}></div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.class}>{info}</div>
      </div>
      <div className={styles.score}>{score}</div>
    </div>
  );
}

function LessonCard({ time, title, sub, subject }: any) {
  return (
    <div className={styles.lessonCard}>
      <div className={styles.icon}><Calendar size={20} color="#6366f1" /></div>
      <div className={styles.time}>
        <div className={styles.start}>{time}</div>
        <div className={styles.day}>Today</div>
      </div>
      <div className={styles.title}>
        <div className={styles.main}>{title}</div>
        <div className={styles.sub}>{sub}</div>
      </div>
      <div className={styles.subject}>{subject}</div>
      <div className={styles.reminder}>Reminder</div>
    </div>
  );
}

function EventItem({ time, title }: any) {
  return (
    <div className={styles.eventItem}>
      <div className={styles.time}>{time}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}
