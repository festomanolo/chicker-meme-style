import React from 'react';

interface TshirtTypeSelectorProps {
  selectedType: typeof realisticTshirtTypes[0];
  onTypeSelect: (type: typeof realisticTshirtTypes[0]) => void;
  className?: string;
}

const TshirtTypeSelector: React.FC<TshirtTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        T-Shirt Style
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {[].map((type: any) => (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${selectedType.id === type.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
