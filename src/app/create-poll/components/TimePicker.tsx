'use client';

import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  error?: boolean;
  placeholder?: string;
}

export function TimePicker({ value, onChange, error = false, placeholder = 'Select time' }: TimePickerProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(() => {
    if (value) {
      const [hour] = value.split(':');
      return parseInt(hour, 10);
    }
    return 12;
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (value) {
      const [, minute] = value.split(':');
      return parseInt(minute, 10);
    }
    return 0;
  });
  
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Close time picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTimePicker]);

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);
    
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const displayMinute = minuteNum.toString().padStart(2, '0');
    
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const handleTimeSelect = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(timeString);
    setShowTimePicker(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // Scroll to selected time when picker opens
  useEffect(() => {
    if (showTimePicker && hourScrollRef.current && minuteScrollRef.current) {
      const hourButton = hourScrollRef.current.querySelector(`[data-hour="${selectedHour}"]`);
      const minuteButton = minuteScrollRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
      
      if (hourButton) {
        hourButton.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      if (minuteButton) {
        minuteButton.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [showTimePicker, selectedHour, selectedMinute]);

  return (
    <div className="relative" ref={timePickerRef}>
      <button
        type="button"
        className={`input input-bordered w-full text-base py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-left ${
          error 
            ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error' 
            : 'border-base-300 bg-base-100 hover:border-base-content/20 focus:ring-primary/20 focus:border-primary'
        }`}
        onClick={() => setShowTimePicker(!showTimePicker)}
      >
        {value ? formatTimeForDisplay(value) : placeholder}
      </button>
      
      {showTimePicker && (
        <div className="absolute top-full left-0 z-10 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg p-3 w-full max-w-xs">
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold">Select Time</span>
              <button 
                className="btn btn-xs btn-circle btn-ghost"
                onClick={() => setShowTimePicker(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-3 p-2 bg-primary/10 rounded-lg">
              <div className="text-xl font-bold text-primary">
                {formatTimeForDisplay(`${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col">
                <div className="text-xs font-bold text-center mb-2 text-base-content">Hour</div>
                <div 
                  ref={hourScrollRef}
                  className="h-[180px] overflow-y-auto flex flex-col gap-0.5 p-1.5 bg-base-200 rounded-lg scroll-smooth"
                >
                  {hours.map((hour) => {
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const period = hour >= 12 ? 'PM' : 'AM';
                    const isSelected = hour === selectedHour;
                    
                    return (
                      <button
                        key={hour}
                        data-hour={hour}
                        type="button"
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-md transition-all duration-200 text-left ${
                          isSelected 
                            ? 'bg-primary text-primary-content font-bold shadow-sm' 
                            : 'bg-base-100 hover:bg-base-300 font-medium'
                        }`}
                        onClick={() => setSelectedHour(hour)}
                      >
                        <span className="text-sm">{displayHour}</span>
                        <span className="text-xs opacity-70">{period}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="text-xs font-bold text-center mb-2 text-base-content">Minute</div>
                <div 
                  ref={minuteScrollRef}
                  className="h-[180px] overflow-y-auto flex flex-col gap-0.5 p-1.5 bg-base-200 rounded-lg scroll-smooth"
                >
                  {minutes.map((minute) => {
                    const isSelected = minute === selectedMinute;
                    
                    return (
                      <button
                        key={minute}
                        data-minute={minute}
                        type="button"
                        className={`flex items-center justify-center py-1.5 px-2.5 rounded-md transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary text-primary-content font-bold shadow-sm' 
                            : 'bg-base-100 hover:bg-base-300 font-medium'
                        }`}
                        onClick={() => setSelectedMinute(minute)}
                      >
                        <span className="text-sm">{minute.toString().padStart(2, '0')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t border-base-300">
              <button
                type="button"
                className="btn btn-sm btn-ghost flex-1"
                onClick={() => setShowTimePicker(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary flex-1"
                onClick={handleTimeSelect}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
