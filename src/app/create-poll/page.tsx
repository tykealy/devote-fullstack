'use client';

import Link from 'next/link';
import { AdminNavbar } from '../dashboard/components/AdminNavbar';
import { BasicInfoSection } from './components/BasicInfoSection';
import { PollOptionsSection } from './components/PollOptionsSection';
import { VotingTimelineSection } from './components/VotingTimelineSection';
import { CreatorInfoSection } from './components/CreatorInfoSection';
import { FormActions } from './components/FormActions';
import { usePollForm } from './hooks/usePollForm';
import { formDataToPollDraft } from '@/lib/validations/poll';

export default function CreatePollPage() {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateOptions,
    validateForm,
    resetForm,
    canSaveDraft,
  } = usePollForm();

  // Mock wallet - replace with wagmi useAccount()
  const connectedWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const pollDraft = formDataToPollDraft(formData, connectedWallet);
      
      console.log('Creating poll draft:', pollDraft);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/polls', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(pollDraft),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - redirect to dashboard
      alert('Poll draft created successfully!');
      resetForm();
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error creating poll:', error);
      // In a real app, you'd show a toast notification
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!canSaveDraft) return;

    setIsSubmitting(true);
    try {
      console.log('Saving draft...', formData);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/polls/draft', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, createdBy: connectedWallet }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <AdminNavbar />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="breadcrumbs text-sm mb-4">
            <ul>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li>Create New Poll</li>
            </ul>
          </div>
          <h1 className="text-4xl font-bold mb-2">Create New Poll</h1>
          <p className="text-base-content/70">
            Define your poll question, options, and voting timeline
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            errors={errors}
            onUpdate={updateField}
          />

          {/* Poll Options */}
          <PollOptionsSection
            formData={formData}
            errors={errors}
            onUpdateOptions={updateOptions}
          />

          {/* Voting Timeline */}
          <VotingTimelineSection
            formData={formData}
            errors={errors}
            onUpdate={updateField}
          />

          {/* Creator Information */}
          <CreatorInfoSection connectedWallet={connectedWallet} />

          {/* Error Display */}
          {errors.submit && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <FormActions
            isSubmitting={isSubmitting}
            canSaveDraft={canSaveDraft}
            onSaveDraft={handleSaveDraft}
          />
        </form>
      </main>
    </div>
  );
}
