export type SchoolConfig = {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'GURU' | 'SISWA' | 'ORANG_TUA';
