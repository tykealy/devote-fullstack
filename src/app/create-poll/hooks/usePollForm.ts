'use client';

import { useState, useCallback } from 'react';
import { PollFormData, PollOption, validateTimestamps } from '@/lib/validations/poll';

const initialFormData: PollFormData = {
  title: '',
  description: '',
  mediaUri: '',
  options: [
    { idx: 0, label: '', description: '' },
    { idx: 1, label: '', description: '' },
  ],
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

export function usePollForm() {
  const [formData, setFormData] = useState<PollFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof PollFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateOptions = useCallback((options: PollOption[]) => {
    setFormData(prev => ({ ...prev, options }));
    
    // Clear options error when user modifies options
    if (errors.options) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.options;
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate basic fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    // Validate options
    if (formData.options.length < 2) {
      newErrors.options = 'Poll must have at least 2 options';
    } else if (formData.options.length > 10) {
      newErrors.options = 'Poll can have at most 10 options';
    } else if (formData.options.some(opt => !opt.label.trim())) {
      newErrors.options = 'All options must have non-empty labels';
    }

    // Validate timestamps
    const timestampErrors = validateTimestamps(
      formData.startDate,
      formData.startTime,
      formData.endDate,
      formData.endTime
    );
    Object.assign(newErrors, timestampErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const canSaveDraft = useCallback(() => {
    return formData.title.trim().length > 0;
  }, [formData.title]);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateOptions,
    validateForm,
    resetForm,
    canSaveDraft: canSaveDraft(),
  };
}
