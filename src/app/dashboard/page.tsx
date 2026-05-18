'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  MoreVertical,
  BookOpen,
  Clock,
  Calendar,
  Plus,
  Palette,
  QrCode,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { logout, checkAuthStatus } from '@/app/actions/auth';

export default function DashboardPage() {
  const { dict, language } = useLanguage();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const sess = await checkAuthStatus();
      setSession(sess);
    }
    fetchSession();
  }, []);

  const getRoleLabel = () => {
    if (!session) return language === 'en' ? 'User' : 'Pengguna';
    if (session.role === 'GURU') return language === 'en' ? 'Teacher' : 'Guru';
    if (session.role === 'SISWA') return language === 'en' ? 'Student' : 'Siswa';
    return session.role;
  };

  return (
    <div className={styles.twoColumnLayout}>
          <div>
            <header className={styles.greeting}>
              <h1>{dict.dashboard.greetings || 'Welcome back,'} {getRoleLabel()}!</h1>
              <p>{new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {dict.dashboard.school_portal || 'School Management Portal'}</p>
            </header>

            <section className={styles.statsGrid}>
              <StatCard icon={<FileText size={20} color="#6366f1" />} label={dict.dashboard.total_classes || 'Total classes'} value="02/08" />
              <StatCard icon={<Users size={20} color="#a855f7" />} label={dict.dashboard.total_students || 'Total Students'} value="02/08" />
              <StatCard icon={<BookOpen size={20} color="#22c55e" />} label={dict.dashboard.total_subjects || 'Total Lessons'} value="40/50" />
              <StatCard icon={<Clock size={20} color="#06b6d4" />} label={dict.dashboard.staff_online || 'Total Hours'} value="12/20" />
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Students Performance</h3>
                <MoreVertical size={16} color="#8c8e91" />
              </div>
              <div className={styles.performanceList}>
                <StudentItem name="Oliver James" info="G1 / Class - B" score="98%" />
                <StudentItem name="Sophia Garcia" info="G1 / Class - A" score="92%" />
                <StudentItem name="Ethan Hunt" info="G2 / Class - C" score="95%" />
                <StudentItem name="Isabella Ross" info="G1 / Class - B" score="96%" />
              </div>
            </section>

            <section className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Total attendance report</h3>
                <div style={{ fontSize: '0.75rem', color: '#8c8e91', border: '1px solid #eee', padding: '4px 8px', borderRadius: '8px' }}>Weekly</div>
              </div>
              {/* Simplified Chart Placeholder */}
              <div style={{ height: '200px', width: '100%', background: 'linear-gradient(transparent, #f1f0ff)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '40px', left: '10%', width: '80%', height: '2px', background: '#6366f1', opacity: 0.2 }}></div>
                <div style={{ position: 'absolute', bottom: '60px', left: '30%', width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%', border: '2px solid white' }}></div>
              </div>
            </section>
          </div>

          <section className={styles.lessonsSection}>
            <h3>Teaching Lessons</h3>
            <LessonCard 
              time="10:30 AM" 
              title="High fidelity wireframes" 
              sub="2 lesson • 60 min" 
              subject="Mathematics" 
            />
            <LessonCard 
              time="11:45 AM" 
              title="UI/UX Principles" 
              sub="1 lesson • 45 min" 
              subject="Computer Science" 
            />
            <LessonCard 
              time="01:30 PM" 
              title="History of Modern Art" 
              sub="3 lesson • 90 min" 
              subject="History" 
            />
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}></div>
            <div className={styles.info}>
              <div className={styles.name}>John Karla</div>
              <div className={styles.email}>johnkarla@gmail.com</div>
            </div>
            <Bell size={20} color="#8c8e91" style={{ marginLeft: 'auto' }} />
          </div>

          <div className={styles.calendarPlaceholder}>
            <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>May 2026</div>
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
              <h4 style={{ margin: 0, fontWeight: 800 }}>Upcoming Events</h4>
              <MoreVertical size={16} color="#8c8e91" />
            </div>
            <EventItem time="09:00 - 10:00 am" title="Biology Lab Work" />
            <EventItem time="11:00 - 12:00 am" title="Chemistry Seminar" />
          </section>

          <section className={styles.notesSection}>
            <div className={styles.header}>
              <h4>My Notes <span style={{ fontSize: '0.75rem', background: '#6366f1', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>12</span></h4>
              <button style={{ fontSize: '0.75rem', background: 'none', border: '1px solid #6366f1', color: '#6366f1', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={12} /> Add Notes
              </button>
            </div>
            <div className={styles.noteItem}>
              Prepare questions for final test of Class A students.
            </div>
            <div className={styles.noteItem} style={{ background: '#f0fdf4', borderLeftColor: '#22c55e' }}>
              Review student projects for the UI/UX course.
            </div>
          </section>
        </aside>
      </div>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
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

function StudentItem({ name, info, score }: { name: string; info: string; score: string }) {
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

function LessonCard({ time, title, sub, subject }: { time: string; title: string; sub: string; subject: string }) {
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
      <Link 
        href="/admin/attendance" 
        className={styles.btnPrimary} 
        style={{ 
          padding: '8px 16px', 
          borderRadius: '10px', 
          fontSize: '0.8125rem', 
          textDecoration: 'none', 
          minWidth: '130px', 
          textAlign: 'center',
          boxShadow: 'none'
        }}
      >
        Mulai Absensi QR
      </Link>
    </div>
  );
}

function EventItem({ time, title }: { time: string; title: string }) {
  return (
    <div className={styles.eventItem}>
      <div className={styles.time}>{time}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}
