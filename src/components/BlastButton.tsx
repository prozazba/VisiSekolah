'use client';

import { useState } from 'react';
import { runUrlUpdateBlast } from '@/app/actions/blast';
import styles from '../styles/admin.module.scss';
import { Megaphone, RefreshCw } from 'lucide-react';

export default function BlastButton() {
  const [isBlasting, setIsBlasting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBlast = async () => {
    if (!confirm('Kirim email pembaruan link ke SEMUA sekolah?')) return;
    
    setIsBlasting(true);
    setMessage(null);
    
    const res = await runUrlUpdateBlast();
    
    if (res.success) {
      setMessage(res.message || 'Blast berhasil dikirim!');
    } else {
      setMessage(`Gagal: ${res.error}`);
    }
    
    setIsBlasting(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className={styles.btnSecondary} 
        onClick={handleBlast}
        disabled={isBlasting}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {isBlasting ? <RefreshCw className={styles.spin} size={18} /> : <Megaphone size={18} />}
        {isBlasting ? 'Mengirim Blast...' : 'Blast Update Link'}
      </button>

      {message && (
        <div className={styles.successMsgActivation} style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          marginTop: '10px', 
          whiteSpace: 'nowrap', 
          zIndex: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
