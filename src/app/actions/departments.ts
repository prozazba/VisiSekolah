'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

const filePath = path.join(process.cwd(), 'src/data/departments.json');

// Helper to read departments
async function readDepartmentsFile(): Promise<any[]> {
  try {
    if (!fs.existsSync(filePath)) {
      // Ensure folder exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading departments file:', error);
    return [];
  }
}

// Helper to write departments
async function writeDepartmentsFile(data: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing departments file:', error);
  }
}

export async function getDepartments() {
  return await readDepartmentsFile();
}

export async function createDepartment(data: { name: string; code?: string; desc?: string }) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  if (!data.name) {
    return { error: 'Nama departemen wajib diisi' };
  }

  try {
    const list = await readDepartmentsFile();
    
    // Check duplication
    const exists = list.some(item => item.name.toLowerCase() === data.name.toLowerCase());
    if (exists) {
      return { error: 'Nama departemen sudah terdaftar' };
    }

    const newDept = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      code: data.code || 'DEPT',
      desc: data.desc || '',
    };

    list.push(newDept);
    await writeDepartmentsFile(list);
    
    revalidatePath('/admin/academic');
    return { success: true, department: newDept };
  } catch (error) {
    return { error: 'Gagal membuat departemen' };
  }
}

export async function updateDepartment(id: string, data: { name: string; code?: string; desc?: string }) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const list = await readDepartmentsFile();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) {
      return { error: 'Departemen tidak ditemukan' };
    }

    // Check name duplication elsewhere
    const dupe = list.some(item => item.id !== id && item.name.toLowerCase() === data.name.toLowerCase());
    if (dupe) {
      return { error: 'Nama departemen sudah digunakan oleh departemen lain' };
    }

    list[idx] = {
      ...list[idx],
      name: data.name,
      code: data.code || list[idx].code,
      desc: data.desc || '',
    };

    await writeDepartmentsFile(list);
    
    revalidatePath('/admin/academic');
    return { success: true, department: list[idx] };
  } catch (error) {
    return { error: 'Gagal merubah departemen' };
  }
}

export async function deleteDepartment(id: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const list = await readDepartmentsFile();
    const newList = list.filter(item => item.id !== id);
    if (list.length === newList.length) {
      return { error: 'Departemen tidak ditemukan' };
    }

    await writeDepartmentsFile(newList);
    
    revalidatePath('/admin/academic');
    return { success: true };
  } catch (error) {
    return { error: 'Gagal menghapus departemen' };
  }
}
