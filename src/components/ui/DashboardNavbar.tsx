'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Bell, Menu, X } from 'lucide-react'; // Add these imports if using Lucide icons

// Define props interface for future extensibility
interface DashboardNavbarProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onMenuToggle,
  showMobileMenu = false,
}) => {

  return (
    <header className="w-full h-[10%] bg-amber-50 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-30 shadow-sm">
      {/* Left section: Logo and mobile menu button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onMenuToggle?.()}
          className="lg:hidden p-2 rounded-md bg-transparent hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-expanded={showMobileMenu}
          aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
        >
          <div className="relative transition-transform duration-300 ease-in-out">
            {showMobileMenu ? 
              <X size={22} className="text-gray-700" /> : 
              <Menu size={22} className="text-gray-700" />
            }
          </div>
        </button>
        
        <div className="flex items-center">
          <Image 
            src="/image/logo.png" 
            alt="Tech Geeks Logo" 
            width={100} 
            height={40} 
            className="object-contain h-[90px] w-auto"
            priority
          />
        </div>
      </div>



      {/* Right section: User menu and notifications */}
      <div className="flex items-center gap-3">
        {/* Notifications button (optional enhancement) */}
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="relative group">
          <button 
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-rose-100">
              <Image 
                src="/image/user.png" 
                alt="User profile"
                width={40} 
                height={40} 
                className="object-cover"
              />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">User</span>
          </button>
          
          {/* User dropdown menu (optional enhancement) */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <ul className="py-2">
              <li>
                <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              </li>
              <li>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              </li>
              <li>
                <a href="#logout" className="block px-4 py-2 text-sm text-rose-600 hover:bg-gray-100">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;