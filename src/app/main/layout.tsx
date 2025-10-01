"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import DashboardNavbar from "@/components/ui/DashboardNavbar";
import Sidebar from "@/components/ui/DashboardSidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full overflow-hidden`}>
      {/* Navbar */}
      <div className="w-full h-[10vh] z-10 relative">
        <DashboardNavbar onMenuToggle={toggleMobileMenu} showMobileMenu={isMobileMenuOpen} />
      </div>

      {/* Content area */}
      <div className="h-[90vh] flex flex-1 overflow-hidden">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={toggleMobileMenu} />
        )}

        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out mt-[10vh] md:mt-0 md:static md:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="h-[90vh] flex-1 overflow-y-auto px-1 md:ml-0">{children}</main>
      </div>
    </div>
  );
}
