'use client';

import { useState } from 'react';
import styles from '../styles/admin.module.scss';
import CreateSchoolModal from './CreateSchoolModal';

interface Inquiry {
  id: string;
  email: string;
  schoolName: string;
  plan: string | null;
  status: string;
  createdAt: string;
}

interface AddSchoolButtonProps {
  users: { id: string; name: string; email: string | null }[];
  inquiries: Inquiry[];
}

export default function AddSchoolButton({ users, inquiries }: AddSchoolButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        className={styles.btnPrimary} 
        onClick={() => setShowModal(true)}
      >
        🚀 Aktivasi Sekolah Baru
      </button>

      {showModal && (
        <CreateSchoolModal 
          onClose={() => setShowModal(false)} 
          users={users}
          inquiries={inquiries}
        />
      )}
    </>
  );
}
