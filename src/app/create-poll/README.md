# Create Poll Page

## Overview
A comprehensive, modular form for creating poll drafts with Zod validation, clean component architecture, and maintainable code structure.

## File Structure

```
create-poll/
├── page.tsx                           # Main page component
├── components/
│   ├── BasicInfoSection.tsx           # Title and description form
│   ├── PollOptionsSection.tsx        # Dynamic options management
│   ├── VotingTimelineSection.tsx     # Start/end date-time pickers
│   ├── CreatorInfoSection.tsx        # Connected wallet display
│   └── FormActions.tsx               # Submit/save/cancel buttons
├── hooks/
│   └── usePollForm.ts                 # Form state management hook
└── README.md                          # This file
```

## Architecture

### 1. Validation Layer (`/lib/validations/poll.ts`)
- **Zod schemas** for type-safe validation
- **PollDraft schema** matching database structure
- **PollFormData schema** for client-side form handling
- **Helper functions** for data transformation
- **Timestamp validation** utilities

### 2. Component Architecture
Each form section is a separate, reusable component:

#### BasicInfoSection
- Title input with character counter (200 max)
- Description textarea with character counter (1000 max)
- Real-time validation feedback

#### PollOptionsSection
- Dynamic add/remove options (2-10 options)
- Option re-indexing when removing
- Label, description, and media URI fields
- Visual option numbering with badges

#### VotingTimelineSection
- Date/time pickers for start and end
- Real-time duration calculation
- Validation for future dates and minimum duration
- Visual feedback for poll duration

#### CreatorInfoSection
- Connected wallet display
- Address truncation and copy functionality
- Avatar with wallet initials

#### FormActions
- Cancel button (links back to dashboard)
- Save Draft button (partial validation)
- Create Poll button (full validation)
- Loading states for async operations

### 3. State Management (`usePollForm.ts`)
Custom hook that provides:
- **Form state** management
- **Error handling** with field-specific clearing
- **Validation** logic
- **Submission** state
- **Helper functions** for form operations

### 4. API Integration (`/api/admin/polls/route.ts`)
- **POST** endpoint for creating poll drafts
- **Zod validation** on server-side
- **Database integration** with Drizzle ORM
- **Error handling** with proper HTTP status codes
- **GET** endpoint for fetching polls (with filtering)

## Key Features

### ✅ Form Validation
- **Client-side**: Real-time validation with Zod
- **Server-side**: API route validation
- **Field-specific errors**: Clear error messages
- **Character limits**: Title (200), Description (1000), Option labels (100)
- **Required fields**: Title, options, timeline
- **Business rules**: Future dates, minimum duration, option limits

### ✅ User Experience
- **Progressive validation**: Errors clear as user types
- **Visual feedback**: Character counters, duration calculator
- **Loading states**: Spinners during async operations
- **Responsive design**: Mobile-friendly layout
- **Accessibility**: Proper labels and ARIA attributes

### ✅ Code Quality
- **TypeScript**: Full type safety
- **Zod validation**: Runtime type checking
- **Modular components**: Single responsibility principle
- **Custom hooks**: Reusable state logic
- **Error boundaries**: Graceful error handling
- **Clean imports**: Organized dependencies

## Usage

### Basic Form Flow
1. User fills out basic information (title, description)
2. Adds/edits poll options (minimum 2, maximum 10)
3. Sets voting timeline (start/end dates)
4. Reviews creator information (connected wallet)
5. Submits form or saves as draft

### Validation Rules
- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters
- **Options**: 2-10 options, all must have labels
- **Start time**: Must be in the future
- **End time**: Must be after start time, minimum 1 hour duration
- **Creator**: Valid Ethereum address

### API Integration
```typescript
// Create poll draft
const response = await fetch('/api/admin/polls', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pollDraft),
});

// Get polls for creator
const response = await fetch('/api/admin/polls?createdBy=0x...');
```

## Database Schema

The form creates records in the `poll_drafts` table:

```sql
CREATE TABLE poll_drafts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  options_json JSONB NOT NULL,
  start_ts BIGINT NOT NULL,
  end_ts BIGINT NOT NULL,
  status SMALLINT DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  frozen_at TIMESTAMP,
  published_at TIMESTAMP
);
```

## Future Enhancements

### 1. Real-time Features
- Auto-save drafts every 30 seconds
- Collaborative editing (multiple admins)
- Real-time validation feedback

### 2. Advanced Options
- Option media upload (IPFS integration)
- Rich text editor for descriptions
- Poll templates and presets
- Duplicate poll functionality

### 3. Integration Improvements
- Wagmi wallet connection
- File upload for option media
- Email template preview
- Poll preview before creation

### 4. UX Improvements
- Form wizard with progress indicator
- Undo/redo functionality
- Keyboard shortcuts
- Bulk option import (CSV)

## Testing

### Manual Testing Checklist
- [ ] Form validation works correctly
- [ ] Character limits are enforced
- [ ] Date/time validation prevents past dates
- [ ] Option add/remove functionality
- [ ] Save draft works with partial data
- [ ] Submit creates poll draft successfully
- [ ] Error messages are clear and helpful
- [ ] Responsive design works on mobile
- [ ] Loading states display correctly

### Unit Tests (Future)
- Validation schema tests
- Form hook tests
- Component rendering tests
- API endpoint tests

## Dependencies

### Required
- `zod` - Schema validation
- `drizzle-orm` - Database ORM
- `next` - React framework
- `react` - UI library

### Optional (Future)
- `wagmi` - Ethereum wallet integration
- `react-hook-form` - Advanced form handling
- `@hookform/resolvers` - Zod integration
- `react-hot-toast` - Toast notifications

## Performance Considerations

### Optimizations
- **Lazy loading**: Components loaded on demand
- **Debounced validation**: Prevents excessive API calls
- **Memoized callbacks**: Prevents unnecessary re-renders
- **Efficient state updates**: Minimal re-renders

### Bundle Size
- **Tree shaking**: Only used components included
- **Code splitting**: Route-based splitting
- **Dynamic imports**: Heavy components loaded async

## Security

### Validation
- **Client-side**: Immediate feedback for UX
- **Server-side**: Final validation for security
- **Zod schemas**: Type-safe validation
- **SQL injection**: Prevented by Drizzle ORM

### Authentication
- **Wallet verification**: Verify connected wallet
- **Creator validation**: Ensure poll creator matches wallet
- **Rate limiting**: Prevent spam submissions

## Troubleshooting

### Common Issues

#### Validation Errors
- Check Zod schema definitions
- Verify field names match schema
- Ensure proper error handling

#### Form State Issues
- Check usePollForm hook implementation
- Verify state updates are immutable
- Ensure proper dependency arrays

#### API Integration
- Verify database connection
- Check API route implementation
- Ensure proper error handling

### Debug Tools
- React DevTools for component inspection
- Network tab for API calls
- Console logs for validation errors
- Database queries for data verification

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow React best practices
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Pull Request Process
1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Submit PR with clear description
5. Address review feedback

## License

Part of the DeVote project.
