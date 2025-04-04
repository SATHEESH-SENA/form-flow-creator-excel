
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
