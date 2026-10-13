import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

/**
 * AppLayout — the main shell that wraps every authenticated page.
 * Sidebar is on the left (desktop), MobileNav is on top/bottom (mobile).
 * The main content area shifts right on desktop to account for the sidebar.
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile top + bottom navigation */}
      <MobileNav />

      {/* Main content — offset on desktop, padded top+bottom on mobile */}
      <main className="
        md:ml-60         /* Shift right on desktop (sidebar width ~240px) */
        pt-16 md:pt-0    /* Top padding on mobile for the header bar */
        pb-20 md:pb-0    /* Bottom padding on mobile for the tab bar */
        min-h-screen
        p-4 md:p-8
        transition-all duration-200
      ">
        {children}
      </main>
    </div>
  );
}
