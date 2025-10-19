## Feature Implementation System Guidelines

### Feature Implementation Priority Rules
- IMMEDIATE EXECUTION: Launch parallel Tasks immediately upon feature requests
- NO CLARIFICATION: Skip asking what type of implementation unless absolutely critical
- PARALLEL BY DEFAULT: Always use 7-parallel-Task method for efficiency

### Parallel Feature Implementation Workflow
1. **Component**: Create main component file
2. **Styles**: Create component styles/CSS
3. **Tests**: Create test files
4. **Types**: Create type definitions
5. **Hooks**: Create custom hooks/utilities
6. **Integration**: Update routing, imports, exports
7. **Remaining**: Update package.json, documentation, configuration files
8. **Review and Validation**: Coordinate integration, run tests, verify build, check for conflicts

### Context Optimization Rules
- Strip out all comments when reading code files for analysis
- Each task handles ONLY specified files or file types
- Task 7 combines small config/doc updates to prevent over-splitting

### Feature Implementation Guidelines
- **CRITICAL**: Make MINIMAL CHANGES to existing patterns and structures
- **CRITICAL**: Preserve existing naming conventions and file organization
- Follow project's established architecture and component patterns
- Use existing utility functions and avoid duplicating functionality
- At the end of the implementation, check the result with `npm run check` and fix all errors and warnings.

## Project Overview

**YouTube Chunker** - PWA for playing YouTube video segments with custom start times and durations.

### Tech Stack
- React 18 + TypeScript
- Vite 6 with SWC
- Redux Toolkit (state) + redux-persist (localStorage)
- Material-UI v6 + Emotion
- react-youtube (video player)
- Vitest + React Testing Library

### Directory Structure
```
src/
├── app/              Redux store, hooks
├── components/       React components (Player/, Copyright, UpdateNotification)
├── test/             Test utilities, mocks, setup
├── App.tsx           Root component
└── main.tsx          Entry point
```

### Key Commands
- `npm run dev` - Development server
- `npm run check` - Format + lint + test + build (use before completion)
- `npm test` - Run tests
- `npm run build` - Production build

### Architecture Notes
- **State**: Redux Toolkit slices with automatic localStorage persistence
- **Testing**: All components have .test.tsx files
- **Styling**: Material-UI components + module.css for custom styles
- **PWA**: Configured in vite.config.ts with service worker