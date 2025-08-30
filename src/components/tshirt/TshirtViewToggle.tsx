import React from 'react';
import { RotateCcw } from 'lucide-react';

interface TshirtViewToggleProps {
  currentView: 'front' | 'back';
  onViewChange: (view: 'front' | 'back') => void;
  className?: string;
}

const TshirtViewToggle: React.FC<TshirtViewToggleProps> = ({
  currentView,
  onViewChange,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        T-Shirt View
      </h3>
      
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onViewChange('front')}
          className={`
            flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentView === 'front'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }
          `}
