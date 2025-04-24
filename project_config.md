# NFT Generator Project Configuration

## Technical Context
- React 18.2 with Function Components and Hooks
- Node.js/Express Backend
- NPM for package management
- File Upload: react-dropzone
- State Management: React Context + Hooks
- UI Components: Material-UI (MUI)
- Image Processing: Sharp.js
- File Storage: Local filesystem (upgradeable to cloud storage)

## Architecture Guidelines
### Frontend
- Components organized by feature in `/client/src/components`
- Shared components in `/client/src/components/common`
- Hooks in `/client/src/hooks`
- Context providers in `/client/src/context`
- Services for API calls in `/client/src/services`
- Types/interfaces in `/client/src/types`

### Backend
- Routes organized by feature in `/server/routes`
- Controllers in `/server/controllers`
- Services in `/server/services`
- Middleware in `/server/middleware`
- Utils in `/server/utils`
- Config in `/server/config`

## Edge Cases to Handle
- Large image file uploads
- Invalid image formats
- Network failures during upload
- Concurrent user operations
- Browser compatibility
- Memory management during batch operations
- Error state recovery
- Progress tracking for long operations

## Implementation Standards
### Code Style
- Use TypeScript for type safety
- Functional components with hooks
- Async/await for asynchronous operations
- Error boundaries for React error handling
- PropTypes or TypeScript interfaces for all components
- Meaningful component and function names
- JSDoc comments for complex functions

### State Management
- Context API for global state
- Local state with useState for component-specific state
- useReducer for complex state logic
- Custom hooks for reusable state logic

### Error Handling
- Try/catch blocks for async operations
- Error boundaries for React components
- User-friendly error messages
- Logging for debugging
- Graceful fallbacks

### Testing
- Jest for unit tests
- React Testing Library for component tests
- Integration tests for critical paths
- E2E tests for main workflows 