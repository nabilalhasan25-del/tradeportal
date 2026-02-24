import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // استخدام خط كابيرو كبديل احترافي وعصري
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LookupsProvider } from "@/context/LookupsContext";
import { AuthProvider } from "@/context/AuthContext";
import { SignalRProvider } from "@/context/SignalRContext";

// إعداد خط كابيرو لدعم اللغة العربية بشكل ممتاز
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "مديرية الشركات - نظام إدارة الطلبات",
  description: "نظام الإدارة العامة للتجارة الداخلية وحماية المستهلك - الجمهورية العربية السورية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ضبط اللغة للعربية والاتجاه من اليمين لليسار
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} antialiased font-[family-name:var(--font-cairo)]`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LookupsProvider>
              <SignalRProvider>
                {children}
              </SignalRProvider>
            </LookupsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

