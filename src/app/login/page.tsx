'use client';

import Link from 'next/link';
import styles from '../../styles/landing.module.scss';
import { LogIn, School, ShieldCheck, AlertCircle } from 'lucide-react';
import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);
  const { dict } = useLanguage();
  const p = dict.login_page;

  return (
    <main className={`${styles.hero} ${styles.heroScroll}`}>
      <div className={`${styles.container} ${styles.flexGroup} ${styles.center} ${styles.fullScreen}`}>
        <div className={`${styles.bentoItem} ${styles.loginCard}`}>
          <div className={`${styles.flexGroup} ${styles.vertical} ${styles.center}`}>
            <div className={`${styles.iconCircle} ${styles.blue} ${styles.loginIcon}`}>
              <School size={40} className="text-white" />
            </div>
            
            <h1 className={`${styles.pageTitle} ${styles.loginTitle}`}>{p.title}</h1>
            <p className={styles.pageSubtitleLogin}>{p.subtitle}</p>
            
            {state?.message && (
              <div className={styles.alertError}>
                <AlertCircle size={18} />
                <span>{state.message}</span>
              </div>
            )}

            <form action={action} className={`${styles.formGrid} w-full`}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={`${styles.formLabel} ${styles.loginLabel}`}>{p.email_label}</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  className={`${styles.formInput} ${styles.loginInput}`} 
                  placeholder="admin@visisekolah.id"
                  required
                />
                {state?.errors?.email && <p className={styles.fieldError}>{state.errors.email}</p>}
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={`${styles.formLabel} ${styles.loginLabel}`}>{p.password_label}</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  className={`${styles.formInput} ${styles.loginInput}`} 
                  placeholder="••••••••"
                  required
                />
                {state?.errors?.password && <p className={styles.fieldError}>{state.errors.password}</p>}
              </div>

              <div className={`${styles.flexGroup} ${styles.between} ${styles.fullWidth} py-2`}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" /> {p.remember_me}
                </label>
                <Link href="#" className={styles.linkSmall}>{p.forgot_password}</Link>
              </div>

              <div className={styles.fullWidth}>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`${styles.btnBentoPrimary} ${styles.btnFull} ${styles.loginBtn} ${isPending ? styles.isLoading : ''}`} 
                >
                  {isPending ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    <><LogIn size={20} /> {p.submit_btn}</>
                  )}
                </button>
              </div>
            </form>

            <div className={styles.footerActions}>
              <p className={styles.footerText}>{p.not_registered} <Link href="/contact" className={styles.linkSmall}>{p.contact_sales}</Link></p>
            </div>

            <div className={styles.secureBadge}>
              <ShieldCheck size={12} /> {p.secure_badge}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
