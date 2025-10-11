'use client';

import { useState, useRef, useEffect } from 'react';

interface PollImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
}

export function PollImageUpload({ currentImage, onImageChange, onImageRemove }: PollImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (currentImage && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [currentImage]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if(process.env.NODE_ENV === 'development') {
        console.log('Please select a valid image file');
      }
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      if(process.env.NODE_ENV === 'development') {
        console.log('Image must be smaller than 5MB');
      }
      return;
    }

    setIsUploading(true);

    try {
      // Revoke previous object URL if it exists
      if (currentImage && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }

      // Create object URL for immediate preview
      const url = URL.createObjectURL(file);
      onImageChange(url);

      // TODO: In production, upload to IPFS or cloud storage
      // const uploadedUrl = await uploadToIPFS(file);
      // onImageChange(uploadedUrl);
      
    } catch (error) {
      if(process.env.NODE_ENV === 'development') {
        console.log('Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    // Revoke object URL before removing
    if (currentImage && currentImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage);
    }
    onImageRemove();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (currentImage) {
    return (
      <div className="relative">
        <img 
          src={currentImage} 
          alt="Poll media preview"
          className="w-full aspect-video object-cover rounded-lg border border-base-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <button
          type="button"
          className="absolute -top-2 -right-2 btn btn-sm btn-circle btn-error shadow-lg"
          onClick={handleRemove}
          title="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          className="absolute -top-2 -left-2 btn btn-sm btn-circle btn-primary shadow-lg"
          onClick={handleClick}
          title="Change image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
      
      <div
        className={`border-2 border-dashed rounded-lg aspect-video flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-base-300 hover:border-primary/50 hover:bg-base-50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-3 p-4">
          {isUploading ? (
            <span className="loading loading-spinner loading-md text-primary"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          
          <div className="text-center">
            <p className="text-sm font-medium text-base-content/70">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-base-content/50 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
