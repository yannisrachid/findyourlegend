import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindYourLegend - CRM",
  description: "Complete CRM solution for sports management",
  icons: {
    icon: "/ylfc_logo_blue_nobg.png",
    shortcut: "/ylfc_logo_blue_nobg.png",
    apple: "/ylfc_logo_blue_nobg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto">
                  {children}
                </div>
              </main>
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
