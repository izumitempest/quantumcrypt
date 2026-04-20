"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styles from "./DocLayout.module.css";

export default function DocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.inner}>
            {children}
            <footer className={styles.footer}>
              <div className={styles.social}>
                <span className={styles.copy}>
                  © 2026 QuantumCrypt Project. NIST FIPS-203 Standardized.
                </span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
