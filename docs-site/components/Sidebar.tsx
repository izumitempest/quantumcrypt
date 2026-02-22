import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { label: "Cryptography Core", href: "/docs/cryptography" },
      { label: "Protocol Handshake", href: "/docs/protocol" },
    ],
  },
  {
    title: "Core Features",
    items: [
      { label: "KEM Encryption", href: "/docs/kem" },
      { label: "Digital Signatures", href: "/docs/signatures" },
      { label: "Hybrid Mode", href: "/docs/hybrid" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "CLI Manual", href: "/docs/cli" },
      { label: "Security Guidelines", href: "/docs/security" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.wrapper}>
        {sections.map((section) => (
          <div key={section.title} className={styles.section}>
            <h4 className={styles.title}>{section.title}</h4>
            <div className={styles.list}>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${pathname === item.href ? styles.active : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
