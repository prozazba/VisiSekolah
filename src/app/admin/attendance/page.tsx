'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  QrCode, 
  User, 
  MapPin, 
  CheckCircle, 
  Play, 
  X, 
  Camera, 
  AlertTriangle,
  RefreshCw,
  Clock
} from 'lucide-react';

interface SimulatedStudent {
  id: string;
  name: string;
  nisn: string;
  time: string;
  status: string;
}

export default function QrAttendancePage() {
  const { dict, language } = useLanguage();
  const t = dict.qr_attendance || {
    title: "QR Code Attendance System",
    subtitle: "Simulate and manage real-time class attendance using QR Code scanning and GPS verification.",
    role_select: "Select Your Simulation Role",
    teacher_view: "Teacher Mode (QR Generator)",
    student_view: "Student Mode (Scanner)",
    select_class: "Select Class",
    select_subject: "Select Subject",
    generate_btn: "Start Class & Generate QR Code",
    generating: "Generating QR...",
    scanning_window: "Active Scanning Window",
    scan_timer: "QR Code expires in:",
    seconds: "seconds",
    scanned_students: "Attending Students (Real-time)",
    no_scanned: "Waiting for students to scan...",
    camera_viewfinder: "Student Camera Viewfinder",
    scan_now_btn: "Scan & Submit Attendance",
    gps_verification: "GPS Location Verification",
    getting_gps: "Detecting GPS coordinates...",
    gps_success: "GPS Verified: Within School Radius",
    lat: "Latitude:",
    lng: "Longitude:",
    attendance_success: "Attendance Registered!",
    attendance_success_desc: "Your attendance has been recorded.",
    sim_scan_title: "Camera Detection Simulation",
    sim_scan_desc: "Point your mobile camera at the teacher's QR Code on the left.",
    sim_btn_success: "Confirm Scan (Submit GPS & Scan)",
    switch_role_alert: "Switch roles above to test the opposite workflow!",
    teacher_notes: "Teacher Note: The QR Code automatically regenerates every 10 seconds to prevent attendance sharing.",
    close_session: "Close Attendance Session"
  };

  // State Management
  const [activeRole, setActiveRole] = useState<'GURU' | 'SISWA'>('GURU');
  const [selectedClass, setSelectedClass] = useState('10 - A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics - Calculus');
  
  // Teacher session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [qrToken, setQrToken] = useState('');
  
  // Shared state for simulated attendees
  const [attendees, setAttendees] = useState<SimulatedStudent[]>([
    { id: '1', name: 'Oliver James', nisn: '00982312', time: '10:31 AM', status: 'HADIR' },
    { id: '2', name: 'Sophia Garcia', nisn: '00982544', time: '10:33 AM', status: 'HADIR' }
  ]);

  // Real database attendees polling
  const fetchRealAttendees = async () => {
    try {
      const { getTodayAttendance } = await import('@/app/actions/attendance');
      const realAttendees = await getTodayAttendance();
      
      setAttendees(prev => {
        const mockData = [
          { id: '1', name: 'Oliver James', nisn: '00982312', time: '10:31 AM', status: 'HADIR' },
          { id: '2', name: 'Sophia Garcia', nisn: '00982544', time: '10:33 AM', status: 'HADIR' }
        ];

        // Filter out any mock attendees if the real attendee NISN matches
        const uniqueReal = realAttendees.map(r => ({
          id: r.id,
          name: r.name,
          nisn: r.nisn,
          time: r.time,
          status: r.status
        }));

        const filteredMock = mockData.filter(m => !uniqueReal.some(r => r.nisn === m.nisn));
        return [...uniqueReal, ...filteredMock];
      });
    } catch (err) {
      console.error("Failed to fetch database attendees:", err);
    }
  };

  useEffect(() => {
    fetchRealAttendees();
    
    // Set up polling interval every 3 seconds
    const interval = setInterval(() => {
      fetchRealAttendees();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Student scanning state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Auto-generate unique token and cycle QR Code every 10 seconds to simulate anti-fraud features
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      // Set initial token
      setQrToken(`visisekolah-token-${selectedClass.replace(/\s+/g, '')}-${Date.now()}`);
      
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Regenerate QR Code
            setQrToken(`visisekolah-token-${selectedClass.replace(/\s+/g, '')}-${Date.now()}`);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(10);
    }

    return () => clearInterval(interval);
  }, [isSessionActive, selectedClass]);

  // Get real or simulated GPS coordinates
  const triggerGpsLookup = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsLoading(false);
        },
        () => {
          // Fallback to gorgeous school coordinates if browser blocked
          setTimeout(() => {
            setGpsCoords({ lat: -6.2088, lng: 106.8456 });
            setGpsLoading(false);
          }, 1000);
        }
      );
    } else {
      setTimeout(() => {
        setGpsCoords({ lat: -6.2088, lng: 106.8456 });
        setGpsLoading(false);
      }, 1000);
    }
  };

  // Trigger GPS on student mode open
  useEffect(() => {
    if (activeRole === 'SISWA') {
      triggerGpsLookup();
    }
  }, [activeRole]);

  // Simulate scanning action
  const handleScanSubmit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      
      // Register current student to shared state
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const newStudent: SimulatedStudent = {
        id: Date.now().toString(),
        name: language === 'id' ? 'Budi Santoso (Anda)' : 'Alex Mercer (You)',
        nisn: '00985512',
        time: timeString,
        status: 'HADIR'
      };

      // Add to list if not already there
      setAttendees(prev => {
        if (prev.some(a => a.nisn === '00985512')) return prev;
        return [...prev, newStudent];
      });
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Premium Bilingual Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <QrCode size={36} style={{ color: 'var(--primary-color)' }} />
            {t.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>{t.subtitle}</p>
        </div>
      </div>

      {/* Role Selection Toggle */}
      <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '16px', display: 'flex', width: 'fit-content', marginBottom: '2.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)' }}>
        <button 
          onClick={() => setActiveRole('GURU')}
          style={{
            padding: '10px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeRole === 'GURU' ? 'white' : 'transparent',
            color: activeRole === 'GURU' ? '#1e293b' : '#64748b',
            boxShadow: activeRole === 'GURU' ? '0 4px 10px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          {t.teacher_view}
        </button>
        <button 
          onClick={() => setActiveRole('SISWA')}
          style={{
            padding: '10px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeRole === 'SISWA' ? 'white' : 'transparent',
            color: activeRole === 'SISWA' ? '#1e293b' : '#64748b',
            boxShadow: activeRole === 'SISWA' ? '0 4px 10px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          {t.student_view}
        </button>
      </div>

      {/* Simulation Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {activeRole === 'GURU' ? (
          /* ========================================================
             TEACHER FLOW (GENERATOR)
             ======================================================== */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Control Panel Card */}
            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Play size={20} color="var(--primary-color)" />
                  {isSessionActive ? t.scanning_window : t.teacher_view}
                </h3>

                <div className={styles.formGroup}>
                  <label>{t.select_class}</label>
                  <select 
                    className={styles.inputControl} 
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                    disabled={isSessionActive}
                  >
                    <option value="10 - A">Kelas 10 - A</option>
                    <option value="11 - B">Kelas 11 - B</option>
                    <option value="12 - C">Kelas 12 - C</option>
                  </select>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                  <label>{t.select_subject}</label>
                  <select 
                    className={styles.inputControl} 
                    value={selectedSubject} 
                    onChange={e => setSelectedSubject(e.target.value)}
                    disabled={isSessionActive}
                  >
                    <option value="Mathematics - Calculus">Mathematics - Advanced Calculus</option>
                    <option value="Physics - Quantum">Physics - Quantum Mechanics</option>
                    <option value="History - Modern">World History - Industrial Era</option>
                  </select>
                </div>

                {isSessionActive && (
                  <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '1.25rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={24} style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>{t.scan_timer}</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                        {countdown} {t.seconds}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                {!isSessionActive ? (
                  <button 
                    className={styles.btnPrimary} 
                    style={{ width: '100%', padding: '1rem' }} 
                    onClick={() => setIsSessionActive(true)}
                  >
                    {t.generate_btn}
                  </button>
                ) : (
                  <button 
                    className={styles.btnOutline} 
                    style={{ width: '100%', padding: '1rem', border: '1px solid #ef4444', color: '#ef4444', background: '#fef2f2' }} 
                    onClick={() => setIsSessionActive(false)}
                  >
                    <X size={18} /> {t.close_session}
                  </button>
                )}

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', lineHeight: 1.4, display: 'flex', gap: '8px' }}>
                  <AlertTriangle size={16} style={{ color: '#eab308', flexShrink: 0 }} />
                  <span>{t.teacher_notes}</span>
                </div>
              </div>
            </div>

            {/* QR Code Presentation Display */}
            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center', minHeight: '400px', border: isSessionActive ? '2px solid rgba(99, 102, 241, 0.2)' : '1px solid #e2e8f0' }}>
              {isSessionActive ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Glowing QR Scanner Frame */}
                  <div style={{
                    position: 'relative',
                    padding: '16px',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    marginBottom: '1.5rem',
                    border: '1px solid #f1f5f9'
                  }}>
                    {/* Corner Laser Guides */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '4px solid var(--primary-color)', borderLeft: '4px solid var(--primary-color)', borderRadius: '6px 0 0 0' }}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '4px solid var(--primary-color)', borderRight: '4px solid var(--primary-color)', borderRadius: '0 6px 0 0' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '4px solid var(--primary-color)', borderLeft: '4px solid var(--primary-color)', borderRadius: '0 0 0 6px' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '4px solid var(--primary-color)', borderRight: '4px solid var(--primary-color)', borderRadius: '0 0 6px 0' }}></div>

                    {/* Animated Scanning Laser Line */}
                    <div style={{
                      position: 'absolute',
                      left: '16px',
                      right: '16px',
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                      boxShadow: '0 0 8px #22c55e',
                      zIndex: 5,
                      animation: 'scan-laser 2s infinite ease-in-out'
                    }}></div>

                    {/* Dynamic QR API Source */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        typeof window !== 'undefined' 
                          ? `${window.location.origin}/scan?token=${qrToken}` 
                          : `https://visi-sekolah.vercel.app/scan?token=${qrToken}`
                      )}`}
                      alt="Attendance QR Code"
                      style={{ width: '220px', height: '220px', display: 'block', borderRadius: '12px' }}
                    />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{selectedSubject}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Kelas {selectedClass} • {t.scanning_window}</p>
                </div>
              ) : (
                <div style={{ maxWidth: '320px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                    <QrCode size={40} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>Pilih kelas di sebelah kiri untuk menghasilkan QR Code absensi waktu-nyata kelas.</p>
                </div>
              )}
            </div>

            {/* Live Student Tracker List */}
            <div className={styles.card} style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t.scanned_students}
                  <span style={{ fontSize: '0.75rem', background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '99px' }}>
                    {attendees.length}
                  </span>
                </h3>
                {isSessionActive && (
                  <span style={{ fontSize: '0.8125rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <RefreshCw size={14} className="spin" /> Live Updates
                  </span>
                )}
              </div>

              {attendees.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {attendees.map((attendee) => (
                    <div 
                      key={attendee.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '12px 16px', 
                        background: '#f8fafc', 
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                        <User size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{attendee.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NISN: {attendee.nisn}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> {attendee.status}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>{attendee.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                  {t.no_scanned}
                </div>
              )}
            </div>

            {/* Custom Animation CSS injected dynamically */}
            <style jsx global>{`
              @keyframes scan-laser {
                0%, 100% { top: 16px; }
                50% { top: 236px; }
              }
              .spin {
                animation: spin-anim 2s linear infinite;
              }
              @keyframes spin-anim {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          /* ========================================================
             STUDENT FLOW (SCANNER)
             ======================================================== */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Viewfinder Mock Smartphone Scanner */}
            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '480px' }}>
              <div style={{ width: '100%' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Camera size={20} color="var(--primary-color)" />
                  {t.camera_viewfinder}
                </h3>

                {/* Simulated Camera Window */}
                <div style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '300px',
                  background: '#0f172a',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: '6px solid #e2e8f0',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}>
                  {scanSuccess ? (
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'rgba(16, 185, 129, 0.95)',
                      color: 'white',
                      zIndex: 10,
                      padding: '1.5rem'
                    }}>
                      <div style={{ animation: 'bounce 1s infinite' }}>
                        <CheckCircle size={64} color="white" />
                      </div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.25rem' }}>{t.attendance_success}</h4>
                      <p style={{ fontSize: '0.8125rem', textAlign: 'center', opacity: 0.9 }}>
                        {language === 'id' 
                          ? `Absensi Anda untuk ${selectedSubject} telah terekam di sistem!` 
                          : `Your attendance for ${selectedSubject} has been successfully recorded!`}
                      </p>
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      {/* Scanning Visual Grid overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: '20px',
                        border: '1.5px dashed rgba(255,255,255,0.25)',
                        borderRadius: '16px',
                        zIndex: 2
                      }}></div>
                      
                      {/* Viewfinder Corner Highlights */}
                      <div style={{ position: 'absolute', top: '16px', left: '16px', width: '15px', height: '15px', borderTop: '3px solid white', borderLeft: '3px solid white' }}></div>
                      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '15px', height: '15px', borderTop: '3px solid white', borderRight: '3px solid white' }}></div>
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '15px', height: '15px', borderBottom: '3px solid white', borderLeft: '3px solid white' }}></div>
                      <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '15px', height: '15px', borderBottom: '3px solid white', borderRight: '3px solid white' }}></div>

                      {/* Mock Viewfinder background representing phone scan */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: isScanning ? 0.9 : 0.6,
                        backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%), url(https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'opacity 0.3s'
                      }}></div>

                      {/* Scanning Laser Line */}
                      {isScanning && (
                        <div style={{
                          position: 'absolute',
                          left: '20px',
                          right: '20px',
                          height: '3px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          boxShadow: '0 0 10px #22c55e',
                          zIndex: 5,
                          animation: 'scan-laser-phone 1.5s infinite ease-in-out'
                        }}></div>
                      )}

                      {/* Initial Guidance Txt */}
                      {!isScanning && (
                        <div style={{ position: 'absolute', bottom: '24px', left: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', padding: '8px 12px', borderRadius: '10px', textAlign: 'center', color: 'white', fontSize: '0.75rem', zIndex: 3 }}>
                          {t.sim_scan_desc}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '2rem' }}>
                {!scanSuccess ? (
                  <button 
                    className={styles.btnPrimary} 
                    style={{ width: '100%', padding: '1rem' }} 
                    onClick={handleScanSubmit}
                    disabled={isScanning || gpsLoading}
                  >
                    {isScanning ? t.generating : t.sim_btn_success}
                  </button>
                ) : (
                  <button 
                    className={styles.btnOutline} 
                    style={{ width: '100%', padding: '1rem' }} 
                    onClick={() => setScanSuccess(false)}
                  >
                    Reset & Scan Lagi
                  </button>
                )}
              </div>
            </div>

            {/* GPS Location & Radius Verification Card */}
            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={20} color="var(--primary-color)" />
                  {t.gps_verification}
                </h3>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: gpsCoords ? '#d1fae5' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gpsCoords ? '#10b981' : '#f59e0b' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Status Geolocation</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: gpsCoords ? '#10b981' : '#f59e0b' }}>
                        {gpsLoading ? t.getting_gps : (gpsCoords ? t.gps_success : 'GPS Off')}
                      </div>
                    </div>
                  </div>

                  {gpsCoords ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>{t.lat}</span>
                        <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>{gpsCoords.lat.toFixed(6)}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>{t.lng}</span>
                        <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>{gpsCoords.lng.toFixed(6)}</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                      Mengambil koordinat lokasi GPS untuk memverifikasi jarak kehadiran dengan koordinat resmi sekolah.
                    </div>
                  )}
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '16px', padding: '1rem', marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                  <AlertTriangle size={20} style={{ color: '#d97706', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: '#b45309', lineHeight: 1.4 }}>
                    {t.switch_role_alert}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button 
                  className={styles.btnOutline} 
                  style={{ width: '100%', padding: '0.875rem', fontSize: '0.875rem' }} 
                  onClick={triggerGpsLookup}
                  disabled={gpsLoading}
                >
                  <RefreshCw size={14} style={{ marginRight: '6px' }} className={gpsLoading ? 'spin' : ''} />
                  Ambil Ulang GPS
                </button>
              </div>
            </div>
            
            {/* Custom Animation Phone CSS */}
            <style jsx>{`
              @keyframes scan-laser-phone {
                0%, 100% { top: 20px; }
                50% { top: 277px; }
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
