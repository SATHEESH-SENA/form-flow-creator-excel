
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">FormFlow</h1>
          </div>
          
          <nav className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                ? 'text-primary-700 bg-primary-50' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/forms" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/forms' 
                ? 'text-primary-700 bg-primary-50' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Forms
            </Link>
            <Link 
              to="/settings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/settings' 
                ? 'text-primary-700 bg-primary-50' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>
          
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary-500 hover:bg-primary-600"
            asChild
          >
            <Link to="/forms/new">
              <Plus className="h-4 w-4 mr-1" />
              New Form
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
