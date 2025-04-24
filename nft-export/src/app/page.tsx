'use client';

import { LayerManager, NftCanvas, NftControls, MetadataEditor } from '@/components/nft';
import { Header } from '@/components/layout';

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your NFT</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload layers, customize your design, and export with metadata
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LayerManager />
            <MetadataEditor />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center">
              <NftCanvas />
            </div>
            <NftControls />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>NFT Generator &copy; {new Date().getFullYear()}</p>
        </footer>
      </main>
    </>
  );
}
