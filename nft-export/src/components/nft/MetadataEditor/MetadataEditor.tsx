'use client';

import { useState, useEffect } from 'react';
import { useNftStore } from '@/lib/store/useNftStore';
import { TraitMetadata } from '@/lib/store/useNftStore';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function MetadataEditor() {
  const { metadata, updateMetadata } = useNftStore();
  const [tempAttributes, setTempAttributes] = useState<TraitMetadata[]>([]);
  
  // Initialize temporary attributes from metadata
  useEffect(() => {
    setTempAttributes(metadata.attributes || []);
  }, [metadata.attributes]);
  
  const handleUpdateMetadata = (field: keyof typeof metadata, value: string) => {
    updateMetadata({ [field]: value });
  };
  
  const handleAddAttribute = () => {
    const newAttributes = [
      ...tempAttributes,
      { trait_type: '', value: '', rarity: 0 },
    ];
    setTempAttributes(newAttributes);
    updateMetadata({ attributes: newAttributes });
  };
  
  const handleRemoveAttribute = (index: number) => {
    const newAttributes = tempAttributes.filter((_, i) => i !== index);
    setTempAttributes(newAttributes);
    updateMetadata({ attributes: newAttributes });
  };
  
  const handleAttributeChange = (index: number, field: keyof TraitMetadata, value: string | number) => {
    const newAttributes = [...tempAttributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setTempAttributes(newAttributes);
    updateMetadata({ attributes: newAttributes });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Metadata Editor
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={metadata.name || ''}
            onChange={(e) => handleUpdateMetadata('name', e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            placeholder="e.g., Cool NFT #1"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={metadata.description || ''}
            onChange={(e) => handleUpdateMetadata('description', e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            placeholder="A description of your NFT..."
          />
        </div>
        
        <div>
          <label htmlFor="external_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            External URL
          </label>
          <input
            id="external_url"
            type="text"
            value={metadata.external_url || ''}
            onChange={(e) => handleUpdateMetadata('external_url', e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            placeholder="https://..."
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Attributes / Traits
            </label>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FiPlus size={18} />
            </button>
          </div>
          
          {tempAttributes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No attributes added yet. Click + to add traits.
            </p>
          ) : (
            <div className="space-y-3">
              {tempAttributes.map((attr, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                      placeholder="Trait type"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={attr.rarity || 0}
                      onChange={(e) => handleAttributeChange(index, 'rarity', Number(e.target.value))}
                      placeholder="Rarity %"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Metadata will be automatically included in your exported NFT.</p>
      </div>
    </div>
  );
} 