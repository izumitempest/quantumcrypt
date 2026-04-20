import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantumCrypt | Post-Quantum Cryptography for Python",
  description:
    "Secure your data against future quantum threats with ML-KEM, ML-DSA, and hybrid classical-quantum encryption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
