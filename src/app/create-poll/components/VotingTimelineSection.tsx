'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { PollFormData } from '@/lib/validations/poll';
import { FormField } from './FormField';
import { TimePicker } from './TimePicker';

interface VotingTimelineSectionProps {
  formData: PollFormData;
  errors: Record<string, string>;
  onUpdate: (field: keyof PollFormData, value: string) => void;
}

export function VotingTimelineSection({ formData, errors, onUpdate }: VotingTimelineSectionProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    formData.startDate ? (() => {
      const [year, month, day] = formData.startDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    })() : undefined
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    formData.endDate ? (() => {
      const [year, month, day] = formData.endDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    })() : undefined
  );
  
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    }

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStartCalendar, showEndCalendar]);

  const calculateDuration = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      return null;
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    return days > 0 
      ? `${days} day${days > 1 ? 's' : ''} and ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const duration = calculateDuration();

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setSelectedStartDate(date);
      onUpdate('startDate', dateString);
      setShowStartCalendar(false);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setSelectedEndDate(date);
      onUpdate('endDate', dateString);
      setShowEndCalendar(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Voting Timeline</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <FormField label="Start Date & Time" required error={errors.startTime}>
            <div className="space-y-3">
              {/* Date Selection */}
              <div className="relative" ref={startCalendarRef}>
                <button
                  type="button"
                  className={`input input-bordered w-full text-base py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-left ${
                    errors.startTime 
                      ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error' 
                      : 'border-base-300 bg-base-100 hover:border-base-content/20'
                  }`}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                >
                  {formData.startDate ? formatDateForDisplay(formData.startDate) : 'Select start date'}
                </button>
                
                {showStartCalendar && (
                  <div className="absolute top-full left-0 z-10 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => setShowStartCalendar(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium">Select Start Date</span>
                    </div>
                    <DayPicker
                      className="react-day-picker"
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={handleStartDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Time Selection */}
              <TimePicker
                value={formData.startTime}
                onChange={(time) => onUpdate('startTime', time)}
                error={!!errors.startTime}
                placeholder="Select start time"
              />
            </div>
          </FormField>

          {/* End Time */}
          <FormField label="End Date & Time" required error={errors.endTime}>
            <div className="space-y-3">
              {/* Date Selection */}
              <div className="relative" ref={endCalendarRef}>
                <button
                  type="button"
                  className={`input input-bordered w-full text-base py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-left ${
                    errors.endTime 
                      ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error' 
                      : 'border-base-300 bg-base-100 hover:border-base-content/20'
                  }`}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                >
                  {formData.endDate ? formatDateForDisplay(formData.endDate) : 'Select end date'}
                </button>
                
                {showEndCalendar && (
                  <div className="absolute top-full left-0 z-10 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => setShowEndCalendar(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium">Select End Date</span>
                    </div>
                    <DayPicker
                      className="react-day-picker"
                      mode="single"
                      selected={selectedEndDate}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        const startDate = formData.startDate ? new Date(formData.startDate) : today;
                        return date < startDate;
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Time Selection */}
              <TimePicker
                value={formData.endTime}
                onChange={(time) => onUpdate('endTime', time)}
                error={!!errors.endTime}
                placeholder="Select end time"
              />
            </div>
          </FormField>
        </div>

        {duration && (
          <div className="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div className="font-bold">Poll Duration</div>
              <div className="text-xs">{duration}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
