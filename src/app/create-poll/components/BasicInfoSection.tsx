'use client';

import { PollFormData } from '@/lib/validations/poll';
import { FormField, Input, Textarea } from './FormField';
import { PollImageUpload } from './PollImageUpload';

interface BasicInfoSectionProps {
  formData: PollFormData;
  errors: Record<string, string>;
  onUpdate: (field: keyof PollFormData, value: string) => void;
}

export function BasicInfoSection({ formData, errors, onUpdate }: BasicInfoSectionProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Basic Information</h2>

        {/* Title */}
        <FormField 
          label="Poll Title" 
          required 
          error={errors.title}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., Q1 2025 Budget Approval"
              error={!!errors.title}
              value={formData.title}
              onChange={(e) => onUpdate('title', e.target.value.slice(0, 200))}
              maxLength={200}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-base-content/60 font-medium">
              {formData.title.length}/200
            </div>
          </div>
        </FormField>

        {/* Description */}
        <FormField label="Description (Optional)">
          <div className="relative">
            <Textarea
              placeholder="Provide context and details about this poll..."
              className="h-32"
              value={formData.description || ''}
              onChange={(e) => onUpdate('description', e.target.value.slice(0, 1000))}
              maxLength={1000}
            />
            <div className="absolute right-3 bottom-3 text-sm text-base-content/60 font-medium">
              {formData.description?.length || 0}/1000
            </div>
          </div>
        </FormField>

        {/* Media Upload */}
        <FormField label="Poll Image (Optional)">
          <PollImageUpload
            currentImage={formData.mediaUri}
            onImageChange={(url) => onUpdate('mediaUri', url)}
            onImageRemove={() => onUpdate('mediaUri', '')}
          />
        </FormField>
      </div>
    </div>
  );
}
