'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

import DashboardNavbar from "@/components/ui/DashboardNavbar";
import Sidebar from "@/components/ui/DashboardSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to control mobile sidebar visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full overflow-hidden`}
      >
        <div className="h-screen w-full bg-slate-200 flex flex-col">
            {/* Navbar at the top */}
            <div className="w-full h-[10vh] z-10 relative">
              <DashboardNavbar 
                onMenuToggle={toggleMobileMenu}
                showMobileMenu={isMobileMenuOpen}
              />
            </div>
            
            {/* Main content area below navbar */}
            <div className="h-[90vh] flex flex-1 overflow-hidden">
              {/* Sidebar on the left */}
              {/* Overlay for mobile view when sidebar is open */}
              {isMobileMenuOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 md:hidden z-30"
                  onClick={toggleMobileMenu}
                  aria-label="Close sidebar"
                />
              )}
              <div 
                className={`
                  transition-all duration-300 ease-in-out mt-[10vh] md:mt-0
                  md:static md:translate-x-0 
                  fixed inset-y-0 left-0 z-40 w-64 
                  ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
              >
                <Sidebar />
              </div>
              
              {/* Main content area */}
              <main className="h-[90vh] flex-1 overflow-y-auto px-1 md:ml-0">
                {children}
              </main>
            </div>
        </div>
      </body>
    </html>
  );
}
