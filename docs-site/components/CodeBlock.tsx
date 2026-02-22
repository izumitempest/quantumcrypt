"use client";

import { useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <span
            className={styles.dot}
            style={{ backgroundColor: "#ff5f56" }}
          ></span>
          <span
            className={styles.dot}
            style={{ backgroundColor: "#ffbd2e" }}
          ></span>
          <span
            className={styles.dot}
            style={{ backgroundColor: "#27c93f" }}
          ></span>
        </div>
        <div className={styles.meta}>
          <span className={styles.language}>{language}</span>
          <button onClick={handleCopy} className={styles.copyButton}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <pre>
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
