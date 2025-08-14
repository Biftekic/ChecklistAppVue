# Vue Checklist Application v1.1.0

A modern, feature-rich checklist/todo application built with Vue 3, TypeScript, and Tailwind CSS. Now with enhanced user experience features including keyboard shortcuts, bulk operations, advanced filtering, and undo/redo functionality.

## 🚀 Version 1.1.0 - Enhanced User Experience

### What's New
- **Keyboard Shortcuts**: Navigate and manage tasks without touching the mouse
- **Bulk Operations**: Select and modify multiple tasks at once
- **Enhanced Filtering**: Save custom filter presets for quick access
- **Undo/Redo System**: Never lose work with comprehensive action history

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, and delete checklist items
- 📁 **Categories**: Organize tasks into custom categories with colors and icons
- 🎯 **Priority Levels**: Set priority (Low, Medium, High, Urgent) for each task
- 📅 **Due Dates**: Assign due dates and track overdue items
- 🏷️ **Tags**: Add multiple tags to tasks for better organization
- 🔍 **Search & Filtering**: Filter by category, priority, status, tags, and search text
- 📊 **Statistics Dashboard**: Track total, completed, pending, and overdue tasks

### Version 1.1.0 Features

#### ⌨️ Keyboard Shortcuts
- **Navigation**: `j/k` (next/previous), `g+h` (home), `g+t` (templates)
- **Actions**: `Cmd/Ctrl+N` (new task), `Space` (toggle), `x` (select), `Delete` (delete selected)
- **Search**: `Cmd/Ctrl+K` or `/` (focus search), `Escape` (clear)
- **Editing**: `e` (edit), `Cmd/Ctrl+Z` (undo), `Cmd/Ctrl+Shift+Z` (redo), `d+d` (duplicate)
- **Help**: `?` (show shortcuts guide)

#### 📦 Bulk Operations
- Multi-select with checkboxes or `Shift+Click`
- Select all with `Shift+X`
- Bulk complete, delete, move, set priority, add/remove tags
- Visual selection mode with floating action bar
- Range selection support

#### 🔍 Enhanced Filtering System
- **Saved Presets**: Save frequently used filter combinations
- **Default Presets**: Today, This Week, High Priority, Overdue, Completed, Pending
- **Quick Filters**: One-click filters for common operations
- **Advanced Filtering**: Combine multiple criteria (categories, priorities, tags, dates, status)
- **Sorting Options**: Sort by title, priority, due date, created/updated date
- **Recent Searches**: Automatic tracking of search history
- **Visual Feedback**: Active filter chips with clear indications

#### ↩️ Undo/Redo System
- Complete action history (up to 50 actions)
- Works with all operations: create, update, delete, move, bulk actions
- Visual feedback with action descriptions
- Keyboard shortcuts: `Cmd/Ctrl+Z` (undo), `Cmd/Ctrl+Shift+Z` (redo)

### Advanced Features
- 🔄 **Drag & Drop**: Reorder tasks with drag-and-drop functionality
- 💾 **Local Storage**: Automatic persistence of all data
- 📥 **Import/Export**: Export data to JSON and import from backup files
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Vitest** - Unit testing framework
- **@vueuse/core** - Collection of Vue composition utilities
- **date-fns** - Modern JavaScript date utility library

## Project Structure

```
src/
├── components/           # Vue components
│   ├── filters/            # Filter components (v1.1.0)
│   │   ├── FilterPresetBar.vue     # Filter preset tabs and quick filters
│   │   └── AdvancedFilterModal.vue # Advanced filtering modal
│   ├── templates/          # Template components
│   │   ├── TemplateSelector.vue    # Template selection interface
│   │   └── TemplateCustomizer.vue  # Template customization
│   ├── ChecklistItem.vue     # Individual task item component
│   ├── ChecklistContainer.vue # Main checklist container
│   ├── CategoryManager.vue   # Category management sidebar
│   └── TaskModal.vue         # Add/Edit task modal
├── composables/         # Vue composables (v1.1.0)
│   ├── useKeyboardShortcuts.ts # Keyboard shortcut system
│   └── useUndoRedo.ts          # Undo/redo functionality
├── stores/              # Pinia stores
│   ├── bulkOperations.store.ts  # Bulk operations (v1.1.0)
│   ├── checklist.store.ts       # Main checklist store
│   ├── filterPresets.store.ts   # Filter presets (v1.1.0)
│   ├── template.store.ts        # Template management
│   └── index.ts                 # Store initialization
├── types/               # TypeScript type definitions
│   ├── checklist.types.ts  # Checklist-related types
│   ├── filter.types.ts     # Filter types (v1.1.0)
│   └── template.types.ts   # Template types
├── tests/               # Test files
│   └── setup.ts           # Test configuration
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles with Tailwind
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vue-checklist-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Usage

### Adding Tasks
1. Click the "Add New Task" button
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Category
   - Priority level
   - Due date
   - Tags
3. Click "Create" to add the task

### Managing Categories
1. Use the sidebar to manage categories
2. Add new categories with custom icons and colors
3. Edit or delete existing categories
4. Tasks in deleted categories are moved to default

### Filtering Tasks
- Use the search bar to find tasks by title, description, or tags
- Filter by category, priority, or status
- Combine multiple filters for precise results
- Click "Clear" to reset all filters

### Data Management
- **Export**: Click the Export button to download your data as JSON
- **Import**: Click Import and select a JSON file to restore data
- All data is automatically saved to browser local storage

## Testing

The application includes comprehensive unit tests for the store logic:

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm test

# Run with coverage
npm run test:coverage
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with Vue 3 and the amazing Vue ecosystem
- Icons provided by system emojis
- Tailwind CSS for rapid UI development