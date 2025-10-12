'use client';

import { useState, useCallback } from 'react';
import { PollFormData, PollOption, validateTimestamps } from '@/lib/validations/poll';

// Add this interface to track pending uploads
interface PendingUploads {
  pollImage?: File;
  optionImages: Map<number, File>; // Map of optionIdx -> File
}

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

interface PendingUploads {
  pollImage?: File;
  optionImages: Map<number, File>;
}

export function usePollForm() {
  const [formData, setFormData] = useState<PollFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Store actual File objects for upload later
  const [pendingUploads, setPendingUploads] = useState<PendingUploads>({
    optionImages: new Map(),
  });

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

  // New: Store poll image file
  const setPollImageFile = useCallback((file: File | null, previewUrl: string) => {
    setPendingUploads(prev => ({
      ...prev,
      pollImage: file || undefined,
    }));
    setFormData(prev => ({ ...prev, mediaUri: previewUrl }));
  }, []);

  // New: Store option image file
  const setOptionImageFile = useCallback((optionIdx: number, file: File | null, previewUrl: string) => {
    setPendingUploads(prev => {
      const newMap = new Map(prev.optionImages);
      if (file) {
        newMap.set(optionIdx, file);
      } else {
        newMap.delete(optionIdx);
      }
      return { ...prev, optionImages: newMap };
    });

    // Update the option's mediaUri with preview URL
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.idx === optionIdx ? { ...opt, mediaUri: previewUrl } : opt
      ),
    }));
  }, []);

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
    // Revoke all blob URLs before resetting
    if (formData.mediaUri?.startsWith('blob:')) {
      URL.revokeObjectURL(formData.mediaUri);
    }
    formData.options.forEach(opt => {
      if (opt.mediaUri?.startsWith('blob:')) {
        URL.revokeObjectURL(opt.mediaUri);
      }
    });

    setFormData(initialFormData);
    setPendingUploads({ optionImages: new Map() });
    setErrors({});
    setIsSubmitting(false);
  }, [formData]);

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
    // Image handling exports
    setPollImageFile,
    setOptionImageFile,
    pendingUploads,
  };
}
