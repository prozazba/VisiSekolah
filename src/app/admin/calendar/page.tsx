'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin,
  MoreVertical,
  Flag
} from 'lucide-react';

export default function AcademicCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('May 2026');

  return (
    <div>
      <header className={styles.greeting} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={32} color="#6366f1" /> Academic Calendar
        </h1>
        <p>Schedule holidays, exams, school events, and academic deadlines.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
        <div>
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentMonth}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer' }}><ChevronRight size={20} /></button>
              </div>
              <button style={{ padding: '0 1.5rem', borderRadius: '16px', background: '#111', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Plus size={18} /> New Event
              </button>
            </div>
          </div>

          {/* Large Calendar Grid Placeholder */}
          <section className={styles.card} style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center', fontWeight: 700, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
              {[...Array(35)].map((_, i) => {
                const day = i - 4; // Start from proper day
                const isCurrent = day === 8;
                const hasEvent = day === 15 || day === 22;
                
                return (
                  <div key={i} style={{ 
                    aspectRatio: '1', 
                    padding: '0.75rem', 
                    borderRadius: '20px', 
                    background: isCurrent ? '#f1f0ff' : 'white',
                    border: '1px solid #f1f5f9',
                    position: 'relative',
                    cursor: day > 0 && day <= 31 ? 'pointer' : 'default',
                    opacity: day > 0 && day <= 31 ? 1 : 0.2
                  }}>
                    {day > 0 && day <= 31 && (
                      <>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: isCurrent ? '#6366f1' : 'inherit' }}>{day}</span>
                        {hasEvent && (
                          <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', height: '4px', background: '#a855f7', borderRadius: '4px' }}></div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Upcoming Events Column */}
        <div>
          <div className={styles.card} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Upcoming Events</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <EventDetailItem 
                date="May 15" 
                title="Spring Semester Finals" 
                time="08:00 AM - 12:00 PM" 
                loc="Examination Hall" 
                color="#6366f1"
              />
              <EventDetailItem 
                date="May 22" 
                title="Annual Sports Day" 
                time="09:00 AM - 04:00 PM" 
                loc="School Playground" 
                color="#10b981"
              />
              <EventDetailItem 
                date="Jun 01" 
                title="Summer Break Starts" 
                time="All Day" 
                loc="System Wide" 
                color="#f59e0b"
                isFlag
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailItem({ date, title, time, loc, color, isFlag }: any) {
  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: color, marginBottom: '4px' }}>{date}</div>
        <MoreVertical size={16} color="#94a3b8" />
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '8px' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#8c8e91' }}>
          <Clock size={14} /> {time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#8c8e91' }}>
          <MapPin size={14} /> {loc}
        </div>
      </div>
      {isFlag && (
        <Flag size={14} color={color} style={{ position: 'absolute', top: 0, right: 0 }} />
      )}
    </div>
  );
}
