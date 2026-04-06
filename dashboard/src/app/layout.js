import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
});

export const metadata = {
  title: "AI Page Manager — مدير الصفحة الذكي",
  description:
    "نظام ذكاء اصطناعي يدير صفحات فيسبوك تلقائياً — يرد على الكومنتات والرسائل بالعربي المصري، يكتشف العملاء المحتملين، ويبعت إشعارات فورية.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmArabic.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-ibm-arabic), 'IBM Plex Sans Arabic', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
