'use client';

import { useState } from 'react';
import { useNftStore } from '@/lib/store/useNftStore';
import { FiDownload, FiSave, FiRotateCw, FiSettings } from 'react-icons/fi';

export default function NftControls() {
  const { 
    resolution, 
    exportFormat, 
    setResolution, 
    setExportFormat, 
    downloadAsset, 
    isProcessing,
    saveProjectState,
    clearLayers,
    royaltyPercentage,
    setRoyaltyPercentage,
    updateMetadata
  } = useNftStore();
  
  const [projectName, setProjectName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleDownload = async () => {
    await downloadAsset(exportFormat);
  };
  
  const handleSaveProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    saveProjectState(projectName);
    setProjectName('');
  };
  
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all layers? This action cannot be undone.')) {
      clearLayers();
      
      // Also reset metadata when clearing layers
      updateMetadata({
        name: '',
        description: '',
        external_url: '',
        attributes: []
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Controls
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiSettings className="w-5 h-5" />
        </button>
      </div>
      
      {showSettings && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                disabled={isProcessing}
              >
                <option value="500x500">500 x 500 px</option>
                <option value="1000x1000">1000 x 1000 px</option>
                <option value="2000x2000">2000 x 2000 px</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                disabled={isProcessing}
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
                <option value="gif">GIF</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Royalty (%)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={royaltyPercentage}
                onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            disabled={isProcessing}
          />
        </div>
        
        <button
          onClick={handleSaveProject}
          disabled={isProcessing || !projectName.trim()}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium ${
            isProcessing || !projectName.trim()
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FiSave className="mr-2" />
          Save Project
        </button>
        
        <button
          onClick={handleClear}
          disabled={isProcessing}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium ${
            isProcessing
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <FiRotateCw className="mr-2" />
          Clear All
        </button>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={isProcessing}
        className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium ${
          isProcessing
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        <FiDownload className="mr-2" />
        Download {exportFormat.toUpperCase()}
      </button>
    </div>
  );
} 