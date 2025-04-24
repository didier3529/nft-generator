'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLayers, FiInfo } from 'react-icons/fi';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiLayers className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              NFT Generator
            </h1>
          </div>
          
          <nav className="flex space-x-4">
            <Link 
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Create
            </Link>
            
            <Link 
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/about') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FiInfo className="mr-1" />
                About
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 