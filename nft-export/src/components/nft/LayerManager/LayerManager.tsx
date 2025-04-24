'use client';

import { useState, useRef, DragEvent } from 'react';
import { useNftStore } from '@/lib/store/useNftStore';
import { TabType } from '@/lib/store/useNftStore';
import { FiUpload, FiTrash2, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from 'react-icons/fi';

export default function LayerManager() {
  const {
    layers,
    activeTab,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    moveLayer,
    updateLayer,
    setActiveTab
  } = useNftStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const tabs: TabType[] = ['backgrounds', 'characters', 'accessories', 'effects'];
  
  const filteredLayers = layers
    .filter(layer => layer.tab === activeTab)
    .sort((a, b) => a.order - b.order);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await addLayer(files[i], activeTab);
      }
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          await addLayer(files[i], activeTab);
        }
      }
    }
  };
  
  const handleBlendModeChange = (id: string, blendMode: string) => {
    updateLayer(id, { blendMode: blendMode as any });
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex border-b dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Drag and drop image files, or{' '}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Layers ({filteredLayers.length})
          </h3>
          
          {filteredLayers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No layers added to this category yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredLayers.map(layer => (
                <li
                  key={layer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={layer.url}
                      alt={layer.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {layer.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <select
                          value={layer.blendMode}
                          onChange={(e) => handleBlendModeChange(layer.id, e.target.value)}
                          className="text-xs border-gray-300 dark:border-gray-700 rounded py-0.5 dark:bg-gray-800 dark:text-gray-300"
                        >
                          <option value="normal">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveLayer(layer.id, 'up')}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Move up"
                    >
                      <FiChevronUp size={18} />
                    </button>
                    <button
                      onClick={() => moveLayer(layer.id, 'down')}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Move down"
                    >
                      <FiChevronDown size={18} />
                    </button>
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete layer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 