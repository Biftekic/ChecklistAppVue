# Changelog

All notable changes to the Vue Checklist Application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Version 1.2.0 (In Development)

### Planned Features
- Cloud sync with real-time collaboration
- User authentication system
- List sharing and permissions
- Comments and discussion threads
- Activity history and audit logs

## [1.1.0] - 2025-01-14

### Added
- **Keyboard Shortcuts System**
  - Navigation shortcuts: `j/k` for next/previous, `g+h` for home, `g+t` for templates
  - Action shortcuts: `Cmd/Ctrl+N` for new task, `Space` to toggle, `x` to select
  - Search shortcuts: `Cmd/Ctrl+K` or `/` for quick search
  - Editing shortcuts: `e` to edit, `Cmd/Ctrl+Z` to undo, `Cmd/Ctrl+Shift+Z` to redo
  - Help modal accessible with `?`

- **Bulk Operations**
  - Multi-select with checkboxes or `Shift+Click`
  - Select all with `Shift+X`
  - Bulk actions: complete, delete, move, set priority, add/remove tags, duplicate
  - Visual selection mode with floating action bar
  - Range selection support

- **Enhanced Filtering with Saved Presets**
  - Default presets: Today, This Week, High Priority, Overdue, Completed, Pending
  - Custom filter presets with localStorage persistence
  - Quick filters for one-click filtering
  - Advanced filtering modal with multiple criteria
  - Sort by title, priority, due date, created/updated date
  - Recent searches tracking
  - Visual filter chips with clear indicators

- **Undo/Redo System**
  - Complete action history (up to 50 actions)
  - Works with all operations: create, update, delete, move, bulk actions
  - Visual feedback with action descriptions
  - Keyboard shortcuts: `Cmd/Ctrl+Z` and `Cmd/Ctrl+Shift+Z`

### Changed
- Updated checklist store to support enhanced filtering
- Improved TypeScript type definitions
- Enhanced UI components with better accessibility

### Fixed
- TypeScript errors with filter status types
- PostCSS configuration for Tailwind CSS v4
- Date range filtering logic
- localStorage persistence edge cases

### Technical
- Added `date-fns` dependency for date handling
- Created new composables: `useKeyboardShortcuts`, `useUndoRedo`
- New stores: `bulkOperations.store.ts`, `filterPresets.store.ts`
- New components: `FilterPresetBar.vue`, `AdvancedFilterModal.vue`

## [1.0.0] - 2025-01-10

### Initial Release
- **Core Features**
  - CRUD operations for checklist items
  - Categories with colors and icons
  - Priority levels (Low, Medium, High, Urgent)
  - Due dates with overdue tracking
  - Tags for organization
  - Search and basic filtering
  - Statistics dashboard

- **Advanced Features**
  - Drag & drop reordering
  - Local storage persistence
  - Import/Export to JSON
  - Dark mode support
  - Responsive design

- **Technical Stack**
  - Vue 3 with Composition API
  - TypeScript
  - Pinia state management
  - Tailwind CSS
  - Vite build tool
  - Vitest for testing

### Infrastructure
- GitHub Actions CI/CD pipeline
- Automated testing on push
- Build and deployment workflows

---

## Version Roadmap

### Version 1.2.0 - Collaboration Features (Q2 2025)
- User authentication
- Cloud sync with real-time updates
- List sharing and permissions
- Comments and activity feeds

### Version 1.3.0 - Mobile & PWA (Q3 2025)
- Progressive Web App setup
- Mobile-specific optimizations
- Push notifications
- Offline functionality

### Version 2.0.0 - Enterprise Features (Q4 2025)
- Team workspaces
- Advanced permissions and roles
- Audit logs and compliance
- API for third-party integrations
- Custom workflows and automation

[Unreleased]: https://github.com/Biftekic/ChecklistAppVue/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Biftekic/ChecklistAppVue/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Biftekic/ChecklistAppVue/releases/tag/v1.0.0