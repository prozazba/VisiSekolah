'use client';

import { useState } from 'react';
import styles from '../styles/admin.module.scss';
import CreateSchoolModal from './CreateSchoolModal';

interface AddSchoolButtonProps {
  users: { id: string; name: string; email: string | null }[];
}

export default function AddSchoolButton({ users }: AddSchoolButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        className={styles.btnPrimary} 
        onClick={() => setShowModal(true)}
      >
        + Tambah Sekolah Baru
      </button>

      {showModal && (
        <CreateSchoolModal 
          onClose={() => setShowModal(false)} 
          users={users}
        />
      )}
    </>
  );
}
