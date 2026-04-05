import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../Layout/Sidebar';

const CustomSelect = ({ value, onChange, options, label, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm transition-all text-left",
          isOpen 
            ? "border-primary-500 ring-2 ring-primary-500/20 shadow-md" 
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
        )}
      >
        <span className="truncate flex-1 font-medium">{selectedOption.label}</span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200 ml-2 shrink-0",
            isOpen ? "rotate-180 text-primary-500" : ""
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 top-[calc(100%+6px)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 py-1">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors text-left",
                  option.value === value
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
