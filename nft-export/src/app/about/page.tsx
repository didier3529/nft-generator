'use client';

import { Header } from '@/components/layout';
import { FiLayers, FiImage, FiDownload, FiSliders, FiUsers, FiEdit3 } from 'react-icons/fi';

export default function AboutPage() {
  const features = [
    {
      icon: <FiLayers className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Layer-Based Creation',
      description: 'Upload and arrange multiple image layers to create custom NFTs.'
    },
    {
      icon: <FiImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Multiple Export Formats',
      description: 'Export your NFT as PNG, SVG, or GIF with customizable resolutions.'
    },
    {
      icon: <FiEdit3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Metadata Editor',
      description: 'Add detailed metadata including name, description, and custom attributes.'
    },
    {
      icon: <FiSliders className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Visual Customization',
      description: 'Adjust layer visibility, order, and blend modes for complete control.'
    },
    {
      icon: <FiDownload className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Project Saving',
      description: 'Save your projects and continue working on them later.'
    },
    {
      icon: <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Royalty Settings',
      description: 'Define royalty percentages for your NFTs.'
    },
  ];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About NFT Generator</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              NFT Generator is a modern web application designed to help artists, creators, and enthusiasts
              create custom NFTs without requiring advanced technical knowledge.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              This tool makes the NFT creation process easy and accessible. Upload your artwork layers,
              arrange and customize them, add metadata, and export your creation in multiple formats, 
              ready for minting on your favorite blockchain platform.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="shrink-0 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Getting Started</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ol className="list-decimal list-inside space-y-4">
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Upload Layers:</span> Drag and drop images or click the browse button to upload layers
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Organize Layers:</span> Arrange your layers within categories
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Customize:</span> Adjust visibility, position, and blend modes
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Add Metadata:</span> Enter a name, description, and custom attributes
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Configure Settings:</span> Choose resolution, export format, and royalty percentage
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Export:</span> Download your NFT in your preferred format
                </li>
              </ol>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technology</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              NFT Generator is built with modern web technologies to provide a fast, responsive, and intuitive experience:
            </p>
            <ul className="list-disc list-inside space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-gray-700 dark:text-gray-300">
              <li>Next.js 14 (React framework)</li>
              <li>TypeScript (Type safety)</li>
              <li>Tailwind CSS (Responsive styling)</li>
              <li>Zustand (State management)</li>
              <li>HTML Canvas API (Image manipulation)</li>
            </ul>
          </section>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>NFT Generator &copy; {new Date().getFullYear()}</p>
        </footer>
      </main>
    </>
  );
} 