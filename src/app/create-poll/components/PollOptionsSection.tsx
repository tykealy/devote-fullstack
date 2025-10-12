'use client';

import { PollOption, PollFormData } from '@/lib/validations/poll';
import { ImageUpload } from './ImageUpload';
import { FormField, Input } from './FormField';

interface PollOptionsSectionProps {
  formData: PollFormData;
  errors: Record<string, string>;
  onUpdateOptions: (options: PollOption[]) => void;
  onImageChange: (optionIdx: number, file: File | null, previewUrl: string) => void;
}

export function PollOptionsSection({ formData, errors, onUpdateOptions, onImageChange }: PollOptionsSectionProps) {
  const addOption = () => {
    if (formData.options.length >= 10) return;
    
    const newOption: PollOption = {
      idx: formData.options.length,
      label: '',
      description: '',
    };
    
    onUpdateOptions([...formData.options, newOption]);
  };

  const removeOption = (idx: number) => {
    if (formData.options.length <= 2) {
      return; // Don't allow removing if only 2 options left
    }
    
    const newOptions = formData.options
      .filter(opt => opt.idx !== idx)
      .map((opt, i) => ({ ...opt, idx: i })); // Re-index
    
    onUpdateOptions(newOptions);
  };

  const updateOption = (idx: number, field: keyof PollOption, value: string) => {
    const newOptions = formData.options.map(opt => 
      opt.idx === idx ? { ...opt, [field]: value } : opt
    );
    onUpdateOptions(newOptions);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-2xl">Poll Options</h2>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={addOption}
            disabled={formData.options.length >= 10}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Option
          </button>
        </div>

        <p className="text-sm text-base-content/70 mb-4">
          Add 2-10 options for voters to choose from. At least 2 options are required.
        </p>

        <div className="space-y-4">
          {formData.options.map((option) => (
            <div key={option.idx} className="card bg-base-100">
              <div className="card-body p-4">
                <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-start">
                  {/* Option number badge */}
                  <div className="badge badge-lg badge-primary">{option.idx}</div>
                  
                  {/* Grid layout: image on left, fields on right */}
                  <div className="grid grid-cols-[8rem_1fr] gap-6 items-start">
                    {/* Image column - spans 2 rows */}
                    <div className="row-span-2">
                      <FormField label="Image" className="mb-0">
                        <ImageUpload
                          optionIdx={option.idx}
                          currentImage={option.mediaUri}
                          onImageChange={(file, previewUrl) => onImageChange(option.idx, file, previewUrl)}
                        />
                      </FormField>
                    </div>
                    
                    {/* Fields column */}
                    <div className="space-y-4">
                      <FormField label="Option Label" required>
                        <Input
                          type="text"
                          placeholder="Enter option label..."
                          className="py-2.5 px-3"
                          value={option.label}
                          onChange={(e) => updateOption(option.idx, 'label', e.target.value)}
                          required
                        />
                      </FormField>

                      <FormField label="Description (Optional)">
                        <Input
                          type="text"
                          placeholder="Brief description of this option..."
                          className="py-2.5 px-3"
                          value={option.description || ''}
                          onChange={(e) => updateOption(option.idx, 'description', e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Remove button */}
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-circle"
                      onClick={() => removeOption(option.idx)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors.options && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.options}</span>
          </div>
        )}
      </div>
    </div>
  );
}
