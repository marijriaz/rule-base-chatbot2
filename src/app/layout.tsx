
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerCompass - Career Guidance Chatbot",
  description:
    "A rule-based chatbot for career guidance and professional development."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
