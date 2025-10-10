import { z } from 'zod';

// Option schema for poll options
export const pollOptionSchema = z.object({
  idx: z.number().int().min(0).max(9),
  label: z.string().min(1, 'Option label is required').max(100, 'Option label must be 100 characters or less'),
  description: z.string().max(500, 'Option description must be 500 characters or less').optional(),
  mediaUri: z.string().optional().or(z.literal('')),
});

// Main poll draft schema
export const pollDraftSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  
  optionsJson: z.array(pollOptionSchema)
    .min(2, 'Poll must have at least 2 options')
    .max(10, 'Poll can have at most 10 options')
    .refine(
      (options) => options.every(option => option.label.trim().length > 0),
      'All options must have non-empty labels'
    ),
  
  startTs: z.number()
    .int()
    .min(Math.floor(Date.now() / 1000), 'Start time must be in the future'),
  
  endTs: z.number().int(),
  
  createdBy: z.string()
    .min(1, 'Creator wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
}).refine(
  (data) => data.endTs > data.startTs,
  { message: 'End time must be after start time', path: ['endTs'] }
).refine(
  (data) => data.endTs - data.startTs >= 3600,
  { message: 'Poll must run for at least 1 hour', path: ['endTs'] }
);

// Form data schema (for client-side form handling)
export const pollFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  options: z.array(pollOptionSchema).min(2).max(10),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
});

// Type exports
export type PollOption = z.infer<typeof pollOptionSchema>;
export type PollDraft = z.infer<typeof pollDraftSchema>;
export type PollFormData = z.infer<typeof pollFormSchema>;

// Helper function to convert form data to poll draft
export function formDataToPollDraft(formData: PollFormData, createdBy: string): PollDraft {
  const startTs = Math.floor(new Date(`${formData.startDate}T${formData.startTime}`).getTime() / 1000);
  const endTs = Math.floor(new Date(`${formData.endDate}T${formData.endTime}`).getTime() / 1000);

  return {
    title: formData.title,
    description: formData.description || undefined,
    optionsJson: formData.options.map(({ idx, label, description, mediaUri }) => ({
      idx,
      label,
      ...(description && { description }),
      ...(mediaUri && { mediaUri }),
    })),
    startTs,
    endTs,
    createdBy,
  };
}

// Helper function to validate timestamps
export function validateTimestamps(startDate: string, startTime: string, endDate: string, endTime: string) {
  const errors: Record<string, string> = {};

  if (!startDate || !startTime) {
    errors.startTime = 'Start date and time are required';
    return errors;
  }

  if (!endDate || !endTime) {
    errors.endTime = 'End date and time are required';
    return errors;
  }

  const startTs = Math.floor(new Date(`${startDate}T${startTime}`).getTime() / 1000);
  const endTs = Math.floor(new Date(`${endDate}T${endTime}`).getTime() / 1000);
  const nowTs = Math.floor(Date.now() / 1000);

  if (startTs < nowTs) {
    errors.startTime = 'Start time must be in the future';
  }

  if (endTs <= startTs) {
    errors.endTime = 'End time must be after start time';
  }

  if (endTs - startTs < 3600) {
    errors.endTime = 'Poll must run for at least 1 hour';
  }

  return errors;
}
