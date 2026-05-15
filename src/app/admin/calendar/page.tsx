'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin,
  MoreVertical,
  Flag,
  Filter,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import AddEventModal from '@/components/AddEventModal';
import { getEvents } from '@/app/actions/calendar';

export default function AcademicCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('May 2026');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Today's agenda filter
  const today = new Date();
  const todaysAgenda = events.filter(ev => {
    const evDate = new Date(ev.startTime);
    return evDate.toDateString() === today.toDateString();
  });

  // Upcoming deadlines (mocking the last 3 for now)
  const upcomingEvents = events.slice(0, 5);

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarIcon size={32} color="#6366f1" /> Academic Calendar
          </h1>
          <p>Schedule holidays, exams, school events, and academic deadlines.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Schedule New Event
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem' }}>
        <div>
          {/* Calendar Control Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.25rem 2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{currentMonth}</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                <button style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <button style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer' }}><ChevronRight size={20} /></button>
              </div>
              <button className={styles.btnOutline} style={{ padding: '0 1rem', height: '44px' }}>
                <Filter size={18} /> Filter
              </button>
            </div>
          </div>

          {/* Academic Calendar Grid - Simplified representation */}
          <section className={styles.card} style={{ padding: '2.5rem' }}>
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <RefreshCcw size={32} className={styles.spin} color="#6366f1" />
                <p style={{ marginTop: '1rem', color: '#64748b' }}>Syncing calendar...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center', fontWeight: 800, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '2rem' }}>
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                  {[...Array(35)].map((_, i) => {
                    const day = i - 4; 
                    const isCurrent = day === today.getDate();
                    
                    // Simple dot indicator if an event exists on this day
                    const hasEvent = events.some(ev => new Date(ev.startTime).getDate() === day);
                    
                    return (
                      <div key={i} style={{ 
                        aspectRatio: '1', 
                        padding: '0.75rem', 
                        borderRadius: '20px', 
                        background: isCurrent ? '#f1f0ff' : 'white',
                        border: isCurrent ? '1px solid #6366f1' : '1px solid #f1f5f9',
                        position: 'relative',
                        opacity: day > 0 && day <= 31 ? 1 : 0.2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {day > 0 && day <= 31 && (
                          <>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: isCurrent ? '#6366f1' : '#1a1c1e' }}>{day}</span>
                            {hasEvent && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', marginTop: '4px' }}></div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Detail View Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className={styles.card} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#6366f1" /> Today's Agenda
            </h3>
            {todaysAgenda.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {todaysAgenda.map((ev) => (
                  <div key={ev.id} style={{ borderLeft: '4px solid #6366f1', paddingLeft: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1a1c1e' }}>{ev.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No events scheduled for today.</p>
            )}
          </div>

          <div className={styles.card} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flag size={20} color="#f59e0b" /> Critical Deadlines
            </h3>
            {upcomingEvents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {upcomingEvents.map((ev) => (
                  <EventDetailItem 
                    key={ev.id}
                    date={new Date(ev.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} 
                    title={ev.title} 
                    time={new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    loc={ev.location || 'No Location'} 
                    color="#6366f1"
                  />
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No upcoming deadlines.</p>
            )}
          </div>
        </div>
      </div>

      <AddEventModal 
        isOpen={isModalOpen} 
        onCloseAction={() => setIsModalOpen(false)} 
        refreshDataAction={fetchEvents} 
      />
    </div>
  );
}

function EventDetailItem({ date, title, time, loc, color }: any) {
  return (
    <div style={{ position: 'relative', paddingLeft: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: color }}>{date}</div>
        <MoreVertical size={16} color="#94a3b8" />
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#1a1c1e', marginBottom: '8px' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
          <Clock size={14} /> {time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
          <MapPin size={14} /> {loc}
        </div>
      </div>
    </div>
  );
}
