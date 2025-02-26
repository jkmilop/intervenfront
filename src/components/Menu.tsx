import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64 pt-16">
        {/* Main content will be rendered here */}
      </div>
    </>
  );
}